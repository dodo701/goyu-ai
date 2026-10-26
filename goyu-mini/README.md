# GOYU-Mini

GOYU-General의 소형 실험용 모델입니다. 구조 이해와 빠른 실험을 위한 모델이며, 충분한 데이터 없이는 범용 지능을 기대할 수 없습니다.

## 개선된 학습 기능

- train/validation 분리
- seed 고정으로 재현 가능한 실험
- CUDA 자동 선택 및 AMP
- gradient clipping
- validation loss가 가장 좋은 checkpoint 저장
- 기존 state-dict와 새 checkpoint 형식 호환 평가

## 실행

```bash
python scripts/prepare_data.py
python -m src.train
python -m src.evaluate
python -m src.generate --prompt "질문: 대한민국 수도는" --tokens 30
```

실제 성능을 높이려면 반복 코퍼스를 늘리는 것보다 검증된 한국어·영어·코드 데이터를 많이 확보하고, 중복·개인정보·저품질 문장을 제거해야 합니다.
