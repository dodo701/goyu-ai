## 2026-10-25 - Root State Anti-pattern in Search
**Learning:** Keeping rapidly changing state like search input in a root component (`Page`) causes the entire layout, including unrelated sidebars and chat windows, to re-render on every keystroke. This is a significant bottleneck in React applications.
**Action:** Extract search input into its own component (`DebouncedSearch`) with local state for immediate typing feedback, and use debouncing to propagate changes to the parent only when necessary.
