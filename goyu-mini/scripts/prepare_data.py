# scripts/prepare_data.py
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.tokenizer import SimpleTokenizer

def prepare_large_corpus():
    os.makedirs("data/raw", exist_ok=True)
    os.makedirs("data/processed", exist_ok=True)
    
    corpus_text = (
        "인공지능(AI)은 인간의 학습능력, 추론능력, 지각능력 등을 컴퓨터로 구현한 기술입니다. "
        "딥러닝은 인공신경망을 기반으로 한 머신러닝의 한 분야로, 대규모 데이터로부터 스스로 특징을 학습합니다. "
        "Transformer 아키텍처는 어텐션(Attention) 메커니즘을 사용하여 문맥 속 단어들의 관계를 파악합니다. "
        "안녕하세요! 저는 GOYU-미니 1.0입니다. 연구용으로 개발된 소형 언어 모델입니다. "
        "Hello, world! Welcome to the world of deep learning and artificial intelligence. "
        "파이썬(Python)은 간결하고 읽기 쉬운 문법을 가진 프로그래밍 언어로 인공지능 개발에 널리 사용됩니다. "
        "질문: 대한민국 수도는 어디인가요? 답변: 대한민국의 수도는 서울입니다. "
        "질문: 인공지능은 어떻게 학습하나요? 답변: 인공지능은 방대한 데이터 속에서 패턴을 찾고 다음 토큰을 예측하며 학습합니다. "
        "코딩은 컴퓨터에게 명령어의 순서를 알려주는 과정입니다. 함께 멋진 AI를 만들어 봅시다! "
        "오늘 날씨가 정말 좋습니다. 머신러닝과 딥러닝 모델을 학습시키는 것은 매우 흥미로운 작업입니다. "
    ) * 5  # 데이터를 반복하여 모델이 충분히 패턴을 노출시키도록 함
    
    raw_path = "data/raw/corpus.txt"
    with open(raw_path, "w", encoding="utf-8") as f:
        f.write(corpus_text)
    
    print(f"대규모 사전학습 코퍼스 생성 완료: {raw_path}")
    print(f"전체 글자 수: {len(corpus_text)} 자")
    
    # 토크나이저 어휘 사전 재구축
    tokenizer = SimpleTokenizer()
    tokenizer.build_vocab([corpus_text])
    tokenizer_path = "data/processed/tokenizer.json"
    tokenizer.save(tokenizer_path)
    
    print(f"어휘 사전 구축 완료 (Vocab Size): {tokenizer.vocab_size}")

if __name__ == "__main__":
    prepare_large_corpus()