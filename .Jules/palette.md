## 2024-10-27 - Auth Form Accessibility & Interaction Polish
**Learning:**
- Input fields using only placeholders without associated labels or aria-labels are invisible to screen readers, causing a critical a11y failure.
- Using native HTML `required` attributes provides free, accessible browser validation that blocks submission without needing complex frontend state.
- Submit buttons without disabled states during async operations provide no visual feedback and allow double submissions, hurting the user experience.

**Action:**
- Always ensure form inputs have either visible `<label>` associations or explicit `aria-label`s.
- Leverage native browser validation (e.g. `required`) when feasible.
- Always apply a disabled state (`disabled={isSubmitting}`) with appropriate visual cues (e.g., `disabled:opacity-50`, `disabled:cursor-not-allowed`) to interactive elements like submit buttons when an async action is active.
