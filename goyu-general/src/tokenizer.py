from pathlib import Path
import sentencepiece as spm


class GoyuTokenizer:
    def __init__(self, model_path: str):
        self.processor = spm.SentencePieceProcessor(model_file=model_path)
        self.pad_id = self.processor.pad_id()
        self.eos_id = self.processor.eos_id()
        self.bos_id = self.processor.bos_id()

    def encode(self, text: str, add_bos: bool = False, add_eos: bool = True):
        ids = self.processor.encode(text, out_type=int)
        if add_bos:
            ids.insert(0, self.bos_id)
        if add_eos:
            ids.append(self.eos_id)
        return ids

    def decode(self, ids):
        return self.processor.decode(ids)

    @property
    def vocab_size(self):
        return self.processor.get_piece_size()


def train_tokenizer(input_file: str, model_prefix: str, vocab_size: int = 32000):
    Path(model_prefix).parent.mkdir(parents=True, exist_ok=True)
    spm.SentencePieceTrainer.train(input=input_file, model_prefix=model_prefix, vocab_size=vocab_size, model_type="unigram", character_coverage=0.9995, pad_id=0, unk_id=1, bos_id=2, eos_id=3)
