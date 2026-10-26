# src/dataset.py
import torch
from torch.utils.data import Dataset

class TextDataset(Dataset):
    def __init__(self, text, tokenizer, block_size):
        self.tokenizer = tokenizer
        self.block_size = block_size
        
        # 전체 텍스트를 토큰 ID로 변환
        tokens = tokenizer.encode(text)
        self.data = torch.tensor(tokens, dtype=torch.long)

    def __len__(self):
        return max(0, len(self.data) - self.block_size)

    def __getitem__(self, idx):
        # block_size 크기로 잘라서 입력(x)과 타겟(y) 생성
        chunk = self.data[idx:idx + self.block_size + 1]
        x = chunk[:-1]
        y = chunk[1:]
        return x, y