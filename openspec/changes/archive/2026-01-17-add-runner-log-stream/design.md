## Context
The console needs a live view of runner output. The app is deployed on Vercel, so the runner process cannot live inside the serverless runtime.

## Goals / Non-Goals
- Goals: Stream runner logs to the Console UI in real time using Next.js API.
- Goals: Avoid persistence and database dependencies.
- Non-Goals: Guaranteed delivery, historical replay, or long-term log storage.

## Decisions
- Use in-memory buffering inside the API runtime for recent log lines.
- Provide a log ingestion endpoint for the runner to POST to.
- Provide an SSE endpoint for the UI to subscribe to.

## Risks / Trade-offs
- In-memory logs are lost on cold starts or instance rotation. Acceptable for simple display.
- SSE connections may drop; the UI should reconnect automatically.

## Migration Plan
1) Add API endpoints.
2) Add UI terminal panel.
3) Update runner to POST logs to the API.

## Open Questions
- Do we need a shared secret for the ingest endpoint?
