# 🤗 Hugging Face AI Integration Setup

RoomNook AI integrates with Hugging Face via the official **Python `huggingface_hub` SDK** (`InferenceClient`) to provide intelligent natural language recommendations for PG accommodations, roommate compatibility, and mess services.

---

## 🚀 Quick Setup

### 1. Get a Free Hugging Face API Token

1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
2. Click **Create new token**.
3. Select **Read** access.
4. Copy the generated token string.

### 2. Configure `backend/.env`

Open `backend/.env` and update the `HF_TOKEN` setting:

```env
HF_TOKEN=hf_your_actual_token_here
```

### 3. Restart the Backend

```bash
npm run dev
# or: npm run dev:backend
```

The backend logs will confirm:
```
INFO:roomnook_ai: Hugging Face InferenceClient initialized.
```

---

## 🛡️ Built-in Graceful Fallback System

You **do not need a Hugging Face token to run and test the application**!

If no token is supplied, or if the Hugging Face API is rate-limited or temporarily unreachable, RoomNook AI automatically falls back to its internal **Perfect Match Score™ rule-based NLP engine**. 

The assistant will still parse queries for budgets, locations, room types, and preferences, and return matched PG and roommate recommendations seamlessly.

---

## 💬 Chat Endpoint Reference

- **Route**: `POST /api/ai/assistant`
- **Request Body**:
  ```json
  {
    "query": "Looking for a single room PG near Clement Town under 7000"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Here are the top student accommodation options near Clement Town under ₹7000...",
    "recommendations": [...],
    "totalFound": 3,
    "studentProfile": {
      "budget": "₹4000-8000",
      "location": "Clement Town",
      "foodPreference": "veg",
      "lifestyle": "early_bird"
    },
    "timestamp": "2026-10-28T12:00:00.000000"
  }
  ```

---

## 🧪 Testing the AI Assistant

You can test the AI assistant:
1. In the Web UI: Navigate to `http://localhost:3000/ai-assistant`
2. In Swagger UI: Open `http://localhost:5000/docs#/AI%20%26%20Recommendations/chat_with_ai_api_ai_assistant_post`
3. With curl:
   ```bash
   curl -X POST http://localhost:5000/api/ai/assistant \
     -H "Content-Type: application/json" \
     -d '{"query": "Find me a PG near Clement Town under 8000"}'
   ```
