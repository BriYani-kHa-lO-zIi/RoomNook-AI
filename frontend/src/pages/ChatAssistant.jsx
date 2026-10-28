import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Zap, Star } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import api from '../api/axios'
import toast from 'react-hot-toast'

const ChatAssistant = () => {
  const { user } = useSelector((state) => state.auth)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your RoomNook AI assistant. I can help you find the perfect PG, compatible roommates, and mess services using our Perfect Match Score™ system. What are you looking for?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await api.post('/ai/assistant', { query: inputMessage })
      const { message, recommendations } = response.data

      const botMessage = {
        id: Date.now() + 1,
        text: message,
        sender: 'bot',
        timestamp: new Date(),
        recommendations: recommendations || []
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('AI chat error:', error)
      toast.error('Failed to get AI response')
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const exampleQueries = [
    "Find me a PG under ₹6000 near Clement Town",
    "Show me compatible roommates for a night owl student",
    "What are the best vegetarian mess options?",
    "Find PGs with WiFi and AC under ₹8000"
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
          <MessageCircle className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Assistant</h1>
        <p className="text-gray-600 text-lg">Get personalized recommendations using our Perfect Match Score™ system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">RoomNook AI</h3>
                  <p className="text-sm text-blue-100">Online • Perfect Match Score™</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      {message.recommendations && message.recommendations.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.recommendations.map((rec, index) => (
                            <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm">{rec.pg}</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400" />
                                  <span className="text-sm font-bold">{rec.score}</span>
                                </div>
                              </div>
                              <div className="text-xs space-y-1">
                                <p><strong>Roommate:</strong> {rec.roommate}</p>
                                <p><strong>Mess:</strong> {rec.mess}</p>
                                <p><strong>Total Cost:</strong> ₹{rec.totalCost}/month</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about PGs, roommates, or mess services..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Example Queries */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              Try These Queries
            </h3>
            <div className="space-y-2">
              {exampleQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(query)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm transition-colors duration-200"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>

          {/* Perfect Match Score Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Perfect Match Score™</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">PG Compatibility</span>
                <span className="text-sm font-semibold">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Roommate Match</span>
                <span className="text-sm font-semibold">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mess Service</span>
                <span className="text-sm font-semibold">20%</span>
              </div>
              <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  Our AI analyzes your preferences, budget, location, lifestyle, and food habits to calculate the perfect match score.
                </p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Role:</strong> {user.role}</p>
                {user.budget_min && user.budget_max && (
                  <p><strong>Budget:</strong> ₹{user.budget_min}-{user.budget_max}</p>
                )}
                {user.preferred_location && (
                  <p><strong>Location:</strong> {user.preferred_location}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatAssistant
