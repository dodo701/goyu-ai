# src/chat.py
import os
import sys
import json
import torch
import torch.nn.functional as F

# 프로젝트 루트 경로 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.tokenizer import SimpleTokenizer
from src.model import GoyuMini

def chat_cli():
    # 설정 및 토크나이저 로드
    with open("config/model_config.json", "r", encoding="utf-8") as f:
        config = json.load(f)
        
    tokenizer = SimpleTokenizer()
    tokenizer.load("data/processed/tokenizer.json")
    config['vocab_size'] = tokenizer.vocab_size
    
    device = torch.device("cpu")
    model = GoyuMini(config)
    
    checkpoint_path = "checkpoints/goyu_mini_latest.pt"
    if not os.path.exists(checkpoint_path):
        print("학습된 체크포인트가 없습니다. 먼저 모델을 학습시켜주세요.")
        return
        
    checkpoint = torch.load(checkpoint_path, map_location=device, weights_only=False)
    model.load_state_dict(checkpoint.get("model", checkpoint) if isinstance(checkpoint, dict) else checkpoint)
    model.to(device)
    model.eval()
    
    print("=" * 40)
    print("GOYU-미니 1.0")
    print("연구용 소형 언어 모델입니다.")
    print("종료하려면 /exit 를 입력하세요.")
    print("=" * 40)
    
    while True:
        try:
            user_input = input("\n사용자: ")
            if user_input.strip() == "/exit":
                print("프로그램을 종료합니다.")
                break
            if not user_input.strip():
                continue
                
            # 입력을 프롬프트로 사용하여 응답 생성
            input_ids = tokenizer.encode(user_input)
            x = torch.tensor([input_ids], dtype=torch.long, device=device)
            
            max_new_tokens = 30
            with torch.no_grad():
                for _ in range(max_new_tokens):
                    x_cond = x[:, -config['block_size']:]
                    logits, _ = model(x_cond)
                    logits = logits[:, -1, :]
                    
                    logits = logits / 0.8
                    probs = F.softmax(logits, dim=-1)
                    next_id = torch.multinomial(probs, num_samples=1)
                    x = torch.cat((x, next_id), dim=1)
                    
            generated_ids = x[0].tolist()
            output_text = tokenizer.decode(generated_ids)
            print(f"GOYU-미니: {output_text}")
            
        except KeyboardInterrupt:
            print("\n프로그램을 종료합니다.")
            break

if __name__ == "__main__":
    chat_cli()
