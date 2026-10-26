import argparse, hashlib, json, random
from pathlib import Path


def normalize_messages(row):
    messages = row.get("messages") if isinstance(row, dict) else None
    if not isinstance(messages, list):
        return None
    clean = []
    for message in messages:
        role, content = message.get("role"), message.get("content", "")
        if role not in {"system", "user", "assistant"} or not isinstance(content, str) or not content.strip():
            return None
        clean.append({"role": role, "content": content.strip()})
    return {"messages": clean} if any(m["role"] == "assistant" for m in clean) else None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", default="data/processed")
    parser.add_argument("--val-ratio", type=float, default=0.02)
    args = parser.parse_args()
    rows, seen = [], set()
    for line in Path(args.input).read_text(encoding="utf-8").splitlines():
        try:
            row = normalize_messages(json.loads(line))
        except json.JSONDecodeError:
            row = None
        if not row:
            continue
        key = hashlib.sha256(json.dumps(row, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
        if key not in seen:
            seen.add(key); rows.append(row)
    random.Random(42).shuffle(rows)
    split = max(1, int(len(rows) * args.val_ratio)) if rows else 0
    out = Path(args.output); out.mkdir(parents=True, exist_ok=True)
    (out / "train.jsonl").write_text("\n".join(json.dumps(x, ensure_ascii=False) for x in rows[split:]) + "\n", encoding="utf-8")
    (out / "val.jsonl").write_text("\n".join(json.dumps(x, ensure_ascii=False) for x in rows[:split]) + "\n", encoding="utf-8")
    print(f"valid={len(rows)} train={len(rows[split:])} val={split} duplicates_removed={len(seen)}")


if __name__ == "__main__":
    main()
