# GOYU-General 학습 데이터

이 폴더의 `raw/example.jsonl`은 파이프라인 확인용 예시 데이터입니다. 실제 성능 학습용 데이터셋이 아닙니다.

실제 데이터는 한 줄에 하나의 JSON 객체를 사용합니다.

```json
{"messages":[{"role":"system","content":"너는 GOYU AI다."},{"role":"user","content":"질문"},{"role":"assistant","content":"답변"}]}
```

실제 학습 전에는 합법적으로 사용할 수 있는 자료만 수집하고, 개인정보·중복·저품질·악성 지시문을 검토해야 합니다.
