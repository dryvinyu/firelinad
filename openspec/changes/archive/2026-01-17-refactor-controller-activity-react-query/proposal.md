# Proposal: Refactor Controller Activity Polling with React Query

## Why
The current implementation of `useControllerActivity` uses manual polling logic with `setInterval`, `useState`, and `useRef` to manage blockchain transaction data. This approach is prone to race conditions, lacks robust error handling/retry logic, and doesn't leverage the caching and synchronization benefits of a dedicated data-fetching library.

## What Changes
Replace the manual polling and state management in `useControllerActivity` with TanStack Query (`react-query`). This will centralize the polling logic, provide built-in caching, simplify error handling, and make the hook more declarative.

## Scope
- Refactor `useControllerActivity` to use `useQuery`.
- Maintain existing functionality:
  - Polling for new blocks.
  - Filtering transactions for the controller contract.
  - Decoding transaction data.
  - Tracking active agents based on transactions.
  - Maintaining a cumulative list of the last `MAX_TXS` transactions.
- Remove manual `setInterval` and `lastBlockRef` management in favor of React Query's `refetchInterval` and state-aware fetching.

## Alternatives Considered
- **Keep manual polling**: Lower dependency overhead, but harder to maintain and extend.
- **Zustand middleware**: Good for global state, but TanStack Query is better suited for server-state (blockchain data) and polling.

## Risks
- **Cumulative state**: TanStack Query is typically used for "current" state. Since we need to maintain a cumulative list of transactions (`txs`), we need to ensure the query function or an effect correctly appends new transactions to the state without losing old ones.
- **Provider changes**: The query must react correctly when the `provider` changes or becomes available.
