# Change: Add runner log streaming to console

## Why
Operators need to see real-time runner output inside the Console page without relying on terminal access.

## What Changes
- Add a Next.js API ingestion endpoint for runner log lines.
- Add a Next.js API SSE endpoint to stream logs to the Console UI.
- Add a Console panel that renders incoming runner logs in real time.
- Keep only an in-memory buffer (no persistence) for simplicity.

## Impact
- Affected specs: new capability `runner-logs`
- Affected code: `app/console`, `app/api`, runner logging
