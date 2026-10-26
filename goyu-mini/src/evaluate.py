import json, math, torch
from torch.utils.data import DataLoader
from src.tokenizer import SimpleTokenizer
from src.model import GoyuMini
from src.dataset import TextDataset


def main():
    with open("config/model_config.json", encoding="utf-8") as f: config = json.load(f)
    tokenizer = SimpleTokenizer(); tokenizer.load("data/processed/tokenizer.json"); config["vocab_size"] = tokenizer.vocab_size
    state = torch.load("checkpoints/goyu_mini_latest.pt", map_location="cpu", weights_only=False)
    model = GoyuMini(config); model.load_state_dict(state.get("model", state)); model.eval()
    text = open("data/raw/corpus.txt", encoding="utf-8").read(); loader = DataLoader(TextDataset(text, tokenizer, config["block_size"]), batch_size=8)
    total = 0.0
    with torch.no_grad():
        for x, y in loader: total += model(x, y)[1].item()
    loss = total / max(len(loader), 1)
    print(json.dumps({"loss": loss, "perplexity": math.exp(min(loss, 20)), "samples": len(loader.dataset)}, ensure_ascii=False, indent=2))


if __name__ == "__main__": main()
