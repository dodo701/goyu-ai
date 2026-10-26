# src/tokenizer.py
import json
import os

class SimpleTokenizer:
    def __init__(self):
        self.pad_token = "<PAD>"
        self.eos_token = "<EOS>"
        self.unk_token = "<UNK>"
        
        self.special_tokens = [self.pad_token, self.eos_token, self.unk_token]
        self.vocab = {}
        self.inv_vocab = {}
        self.vocab_size = 0

    def build_vocab(self, texts):
        chars = set()
        for text in texts:
            for char in text:
                chars.add(char)
        
        tokens = self.special_tokens + sorted(list(chars))
        self.vocab = {token: idx for idx, token in enumerate(tokens)}
        self.inv_vocab = {idx: token for token, idx in self.vocab.items()}
        self.vocab_size = len(self.vocab)

    def encode(self, text):
        return [self.vocab.get(char, self.vocab[self.unk_token]) for char in text]

    def decode(self, ids):
        return "".join([self.inv_vocab.get(i, self.unk_token) for i in ids])

    def save(self, filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        data = {
            "vocab": self.vocab,
            "special_tokens": self.special_tokens
        }
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def load(self, filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.vocab = data["vocab"]
        self.inv_vocab = {int(idx): token for token, idx in self.vocab.items()}
        self.vocab_size = len(self.vocab)