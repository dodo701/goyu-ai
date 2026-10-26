# GOYU-Mini 분석

참조한 `goyu-mini`은 Transformer 동작을 이해하기 좋은 최소 구현입니다.

현재 확인된 한계:

- 문자 단위 토크나이저라 한국어·코드·공백 효율이 낮습니다.
- 설정상 3개 블록, 임베딩 192, 4개 헤드이며 실제 파라미터는 약 148만 개입니다.
- 코퍼스가 약 6KB이고 동일 문장을 반복하므로 일반화보다 암기에 가깝습니다.
- 학습/검증 분리와 평가 코드가 비어 있습니다.
- CPU 고정, checkpoint 원자 저장, resume, gradient accumulation, mixed precision이 없습니다.
- 생성 시 temperature/top-p/반복 억제/stop 조건이 없습니다.

GOYU-General은 위 문제를 해결하기 위해 서브워드 토크나이저, RoPE, RMSNorm, SwiGLU, 검증셋, 안정적인 checkpoint, 재현 가능한 학습 설정, 생성 제어를 포함합니다.
