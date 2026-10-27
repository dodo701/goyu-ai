## 2023-10-27 - [Map labels to tooltips on icon-only buttons]
**Learning:** Reusable icon buttons typically only expose an `aria-label` which is great for screen readers, but mouse and keyboard users are left guessing what an icon means.
**Action:** When building reusable `IconButton` components, always map the `label` prop to both the `aria-label` and the `title` attributes so everyone benefits from the provided context. Also always include `focus-visible` styles for better keyboard navigation.
