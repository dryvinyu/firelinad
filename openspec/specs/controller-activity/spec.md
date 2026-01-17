# controller-activity Specification

## Purpose
TBD - created by archiving change refactor-controller-activity-react-query. Update Purpose after archive.
## Requirements
### Requirement: declarative-polling
The system MUST use TanStack Query to manage the polling lifecycle of controller activity.

#### Scenario: periodic-refetch
- **Given** the user is viewing the console dashboard.
- **When** the `POLL_INTERVAL_MS` (6000ms) elapses.
- **Then** the `useQuery` hook SHOULD automatically trigger a new fetch for transactions.

#### Scenario: error-retry
- **Given** a temporary RPC failure occurs during polling.
- **When** the query fails.
- **Then** TanStack Query SHOULD handle retries based on its default policy.

### Requirement: cumulative-transaction-history
The system MUST maintain a cumulative history of transactions even though they are fetched in batches.

#### Scenario: append-new-transactions
- **Given** 2 new transactions are found in the latest poll.
- **When** the query completes successfully.
- **Then** these transactions SHOULD be added to the top of the existing `txs` list.
- **And** the total list SHOULD be capped at `MAX_TXS`.

### Requirement: reactive-agent-status
Agent activity status MUST remain synchronized with the polled transactions.

#### Scenario: mark-agent-active
- **Given** a new transaction for a "pause" action is detected.
- **When** the transaction is processed.
- **Then** the agents associated with the "pause" action SHOULD be marked as active for 6 seconds.

