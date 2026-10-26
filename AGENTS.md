# Architecture

- Scope support appearance through SupportAppearance and semantic CSS tokens, with a browser-local preference shared by all support routes; this keeps the public website and access rules unchanged.
- Keep legacy support color compatibility selectors in the scoped global CSS until pages adopt semantic utilities, so both appearances cover existing forms and tables without changing their behavior.
- Keep Smart Tag demonstration mode explicitly opt-in via the demo query parameter and local to the activation component; it must bypass all lookup, access counting, activation and redirect operations to preserve real plates and avoid API usage.