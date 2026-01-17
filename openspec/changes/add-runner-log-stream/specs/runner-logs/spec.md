## ADDED Requirements
### Requirement: Runner log ingestion
The system SHALL accept runner log lines via a Next.js API endpoint for display in the Console UI.

#### Scenario: Runner submits a log line
- **WHEN** the runner POSTs a log line to the ingestion endpoint
- **THEN** the system stores the log line in the in-memory buffer

### Requirement: Runner log streaming
The system SHALL stream runner logs to connected clients using Server-Sent Events (SSE).

#### Scenario: Console connects to the stream
- **WHEN** the Console UI opens an SSE connection
- **THEN** the system streams new log lines to the client

### Requirement: Console log display
The Console UI SHALL render incoming runner log lines in a dedicated panel.

#### Scenario: New log line arrives
- **WHEN** the Console UI receives a streamed log line
- **THEN** the line is appended to the display in timestamp order

### Requirement: Non-persistent storage
The system SHALL keep runner logs only in memory for the active API runtime.

#### Scenario: API runtime restarts
- **WHEN** the API runtime restarts or scales
- **THEN** previously buffered logs are no longer available
