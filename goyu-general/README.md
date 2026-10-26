# GOYU-General

GOYU-Mini를 참고해 다시 설계한 GOYU의 범용 언어 모델 기반입니다.

중요: 이 저장소는 **견고한 학습·평가·추론 기반**입니다. 모델이 실제로 똑똑해지는 정도는 학습 데이터의 품질/규모와 GPU 학습량에 의해 결정됩니다. 현재 컴퓨터는 CPU 전용이고 `goyu-mini`의 원본 코퍼스는 약 6KB이므로, 여기서 곧바로 지능형 상용 모델이 만들어지는 것은 아닙니다.

## Mini에서 개선한 점

- 문자 단위 토큰화 대신 SentencePiece 기반 서브워드 토큰화
- RMSNorm, RoPE, SwiGLU, pre-norm Transformer
- 긴 문맥을 위한 설정 분리
- 중복/빈 문장/과도한 길이 데이터를 검증하는 전처리
- 학습/검증 loss, perplexity, best checkpoint, resume 지원
- gradient accumulation, AMP, gradient clipping, cosine learning rate
- temperature/top-p/repetition penalty를 포함한 안전한 생성
- 실제 답변과 연결 전 상태를 구분할 수 있는 추론 API 골격

## 설치

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
```

## 데이터 형식

`data/raw/train.jsonl`에 한 줄당 하나의 예제를 넣습니다.

```json
{"messages":[{"role":"system","content":"너는 GOYU AI다."},{"role":"user","content":"대한민국의 수도는?"},{"role":"assistant","content":"대한민국의 수도는 서울입니다."}]}
```

데이터는 직접 수집한 합법적인 자료만 사용하고, 개인정보·저작권 침해 자료·중복 데이터를 제거해야 합니다.

## 실행 순서

```bash
python scripts/prepare_data.py --input data/raw/train.jsonl --output data/processed
python -m src.train --config config/base.json --data data/processed
python -m src.evaluate --config config/base.json --checkpoint checkpoints/best.pt --data data/processed
python -m src.generate --config config/base.json --checkpoint checkpoints/best.pt --prompt "안녕하세요"
```

처음 학습할 때는 `config/base.json`의 작은 설정으로 파이프라인을 확인한 후, GPU와 데이터가 준비되면 모델 크기를 늘립니다.

## 똑똑한 모델을 만들기 위한 실제 순서

1. 한국어/영어/코드의 정제된 사전학습 데이터 확보
2. 중복 제거·개인정보 제거·품질 점수화
3. 충분한 토큰 수로 사전학습
4. 지시 데이터로 instruction tuning
5. 사실성·코딩·안전성·한국어 평가셋으로 자동 평가
6. 실패 사례를 다시 데이터에 반영

Mini 체크포인트를 General 체크포인트로 직접 변환하지 않습니다. 토크나이저와 구조가 달라서 무리한 변환보다 General을 깨끗하게 학습하는 편이 안전합니다.
