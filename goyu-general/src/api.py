import os
import uuid
import json
import torch
import torch.nn.functional as F
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from src.model import GoyuGeneral, ModelConfig
from src.tokenizer import GoyuTokenizer

app = FastAPI(title="GOYU API Server")

class Message(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str = "goyu-general"
    messages: List[Message]
    stream: Optional[bool] = False
    temperature: Optional[float] = 0.7

# Load model globally if available
MODEL_LOADED = False
model = None
tokenizer = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model():
    global MODEL_LOADED, model, tokenizer, device
    config_path = "config/base.json"
    checkpoint_path = "checkpoints/best.pt"
    tokenizer_path = "data/processed/tokenizer.model" # assuming standard sentencepiece output

    if os.path.exists(config_path) and os.path.exists(checkpoint_path) and os.path.exists(tokenizer_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                config_dict = json.load(f)
            config = ModelConfig(**config_dict)

            tokenizer = GoyuTokenizer(tokenizer_path)

            model = GoyuGeneral(config)
            checkpoint = torch.load(checkpoint_path, map_location=device, weights_only=False)
            model.load_state_dict(checkpoint.get("model", checkpoint) if isinstance(checkpoint, dict) else checkpoint)
            model.to(device)
            model.eval()
            MODEL_LOADED = True
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
    else:
        print("Checkpoint, config, or tokenizer not found. Running in mock mode.")

load_model()

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatCompletionRequest):
    user_messages = [msg.content for msg in request.messages if msg.role == "user"]
    prompt = user_messages[-1] if user_messages else ""

    if MODEL_LOADED:
        # Simple inference logic
        try:
            input_ids = tokenizer.encode(prompt, add_bos=True, add_eos=False)
            x = torch.tensor([input_ids], dtype=torch.long, device=device)

            max_new_tokens = 50
            temperature = request.temperature if request.temperature > 0 else 1e-5

            with torch.no_grad():
                for _ in range(max_new_tokens):
                    x_cond = x[:, -model.config.block_size:]
                    logits, _ = model(x_cond)
                    logits = logits[:, -1, :]

                    logits = logits / temperature
                    probs = F.softmax(logits, dim=-1)
                    next_id = torch.multinomial(probs, num_samples=1)

                    x = torch.cat((x, next_id), dim=1)
                    if next_id.item() == tokenizer.eos_id:
                        break

            generated_ids = x[0].tolist()[len(input_ids):]
            response_content = tokenizer.decode(generated_ids)

        except Exception as e:
            response_content = f"[오류 발생]: {str(e)}"
    else:
        response_content = f"FastAPI 백엔드 응답 (모델 체크포인트 없음): '{prompt}'에 대한 임시 답변입니다."

    response = {
        "id": f"msg_{uuid.uuid4().hex[:8]}",
        "model": request.model,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response_content.strip(),
                },
                "finish_reason": "stop"
            }
        ],
        "usage": {
            "prompt_tokens": len(prompt),
            "completion_tokens": len(response_content),
            "total_tokens": len(prompt) + len(response_content)
        },
        "proof": {
            "status": "unverified",
            "checks": []
        }
    }

    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api:app", host="0.0.0.0", port=8000, reload=True)
