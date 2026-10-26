import json, os, random
from pathlib import Path
import numpy as np
import torch
from torch.utils.data import DataLoader, random_split
from src.tokenizer import SimpleTokenizer
from src.model import GoyuMini
from src.dataset import TextDataset


def seed_everything(seed):
    random.seed(seed); np.random.seed(seed); torch.manual_seed(seed)


def evaluate(model, loader, device):
    model.eval(); total = 0.0; count = 0
    with torch.no_grad():
        for x, y in loader:
            _, loss = model(x.to(device), y.to(device)); total += loss.item(); count += 1
    model.train(); return total / max(count, 1)


def automated_pretrain():
    print("=== GOYU-Mini 안정화 학습 파이프라인 ===")
    with open("config/model_config.json", "r", encoding="utf-8") as f: config = json.load(f)
    seed_everything(int(config.get("seed", 42)))
    tokenizer = SimpleTokenizer(); tokenizer.load("data/processed/tokenizer.json")
    config["vocab_size"] = tokenizer.vocab_size
    corpus_path = Path("data/raw/corpus.txt")
    if not corpus_path.exists(): raise FileNotFoundError("data/raw/corpus.txt가 없습니다.")
    dataset = TextDataset(corpus_path.read_text(encoding="utf-8"), tokenizer, config["block_size"])
    if len(dataset) < 2: raise ValueError("학습 데이터가 너무 적습니다. 충분한 코퍼스를 준비하세요.")
    val_size = max(1, int(len(dataset) * float(config.get("val_ratio", 0.1))))
    train_set, val_set = random_split(dataset, [len(dataset) - val_size, val_size], generator=torch.Generator().manual_seed(42))
    batch_size = int(config.get("batch_size", 8))
    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True); val_loader = DataLoader(val_set, batch_size=batch_size)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu"); model = GoyuMini(config).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=float(config.get("learning_rate", 1e-3)), weight_decay=float(config.get("weight_decay", 0.1)))
    scaler = torch.amp.GradScaler("cuda", enabled=device.type == "cuda"); best_val = float("inf")
    for epoch in range(int(config.get("epochs", 40))):
        model.train(); optimizer.zero_grad(set_to_none=True); train_total = 0.0
        for x, y in train_loader:
            with torch.autocast(device_type=device.type, enabled=device.type == "cuda"): _, loss = model(x.to(device), y.to(device))
            scaler.scale(loss).backward(); scaler.unscale_(optimizer); torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            scaler.step(optimizer); scaler.update(); optimizer.zero_grad(set_to_none=True); train_total += loss.item()
        train_loss = train_total / max(len(train_loader), 1); val_loss = evaluate(model, val_loader, device)
        print(f"Epoch [{epoch + 1:02d}] train={train_loss:.4f} val={val_loss:.4f}")
        if val_loss < best_val:
            best_val = val_loss; os.makedirs("checkpoints", exist_ok=True)
            torch.save({"model": model.state_dict(), "config": config, "epoch": epoch + 1, "val_loss": val_loss}, "checkpoints/goyu_mini_latest.pt")
    print(f"학습 완료 | best validation loss: {best_val:.4f}")


if __name__ == "__main__": automated_pretrain()
