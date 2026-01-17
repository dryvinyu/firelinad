# Design: Refactoring Controller Activity with React Query

## Architecture
We will transition from a manual polling loop to a declarative `useQuery` approach.

### Key Components

#### 1. Query Key
`['controllerActivity', rpcUrl, controllerAddress]`
This ensures the query refetches if the network or contract changes.

#### 2. Query Function
The `queryFn` will:
1. Fetch the latest block number.
2. Determine the range of blocks to fetch (using a local state or ref to track `lastFetchedBlock`).
3. Fetch transactions in that range.
4. Process and return the *new* transactions.

#### 3. State Accumulation
Since `useQuery` returns the result of the latest fetch, we still need to maintain the cumulative `txs` list.
- We will use `useEffect` to watch the query's `data`.
- When new transactions are returned, we append them to the local `txs` state and slice to `MAX_TXS`.
- This keeps the logic for "what to display" (the last N transactions) separate from "how to fetch" (the query).

#### 4. Active Agents
The `activeAgents` state will continue to be updated via `markAgentsForAction` when new transactions are processed.

## Data Flow
1. `useQuery` triggers every `POLL_INTERVAL_MS`.
2. `queryFn` finds new transactions since the last run.
3. `useQuery` data updates with the list of *new* transactions.
4. `useEffect` detects new data, updates `txs` state, and updates `activeAgents`.

## Implementation Details
- The `lastBlockRef` will likely still be needed within the hook to tell the `queryFn` where to start, or it can be passed as part of the query function's context if we manage it carefully. However, since we want the query to be the source of truth for the *fetch*, we can store the `lastBlock` in a `useRef` within the hook and have the `queryFn` update it upon successful completion.

## Trade-offs
- **Redundant state**: We maintain both query data (the latest batch) and local state (the cumulative list). This is necessary because blockchain activity is an append-only stream, while React Query is designed for fetching snapshots.
