# src/generate.py
import os
import sys
import json
import torch
import torch.nn.functional as F

# 프로젝트 루트 경로 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.tokenizer import SimpleTokenizer
from src.model import GoyuMini

def generate_text(prompt, max_new_tokens=30):
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
    
    # 프롬프트를 토큰 ID로 변환
    input_ids = tokenizer.encode(prompt)
    x = torch.tensor([input_ids], dtype=torch.long, device=device)
    
    print(f"입력 프롬프트: {prompt}")
    print("생성 중...")
    
    with torch.no_grad():
        for _ in range(max_new_tokens):
            # context length(block_size)를 넘지 않도록 자름
            x_cond = x[:, -config['block_size']:]
            logits, _ = model(x_cond)
            logits = logits[:, -1, :] # 마지막 시점의 로짓
            
            # 확률 분포로 변환 후 샘플링 (Top-k 적용 가능)
            temperature = 0.8
            logits = logits / temperature
            probs = F.softmax(logits, dim=-1)
            next_id = torch.multinomial(probs, num_samples=1)
            
            x = torch.cat((x, next_id), dim=1)
            
    generated_ids = x[0].tolist()
    output_text = tokenizer.decode(generated_ids)
    print(f"\n[GOYU-미니 생성 결과]:\n{output_text}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", type=str, default="안녕하세요", help="생성 시작 프롬프트")
    parser.add_argument("--tokens", type=int, default=30, help="생성할 최대 토큰 수")
    args = parser.parse_args()
    
    generate_text(args.prompt, args.tokens)
