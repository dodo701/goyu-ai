## 2024-10-28 - Explicit Tooltips for Text-Character Icons
**Learning:** This design system heavily relies on generic text characters (like ✦, ＋, ↗, ⌕) for icons in buttons. While ARIA labels cover screen readers, sighted mouse/pointer users are left guessing what these ambiguous symbols mean without visual tooltips.
**Action:** Always add native `title` attributes (or custom tooltips) to icon-only buttons that use ambiguous text characters to ensure the interface is intuitive for all users, not just screen reader users.
