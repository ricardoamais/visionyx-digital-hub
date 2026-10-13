# Architecture

- Scope support appearance through SupportAppearance and semantic CSS tokens, with a browser-local preference shared by all support routes; this keeps the public website and access rules unchanged.
- Keep legacy support color compatibility selectors in the scoped global CSS until pages adopt semantic utilities, so both appearances cover existing forms and tables without changing their behavior.