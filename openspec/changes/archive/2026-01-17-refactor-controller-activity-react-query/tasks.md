# Tasks: Refactor Controller Activity with React Query

- [x] **Setup Query Structure** <!-- id: 0 -->
  - Define the query key and the base `useQuery` skeleton in `useControllerActivity.ts`.
  - Ensure the query only runs when `provider` and `CONTRACT_ADDRESSES.controller` are available.

- [x] **Migrate Polling Logic to queryFn** <!-- id: 1 -->
  - Move the logic from `poll` function into the `queryFn`.
  - Use `lastBlockRef` to determine the start block.
  - Return the array of `ActionTx` items found in the current poll.

- [x] **Implement State Synchronization** <!-- id: 2 -->
  - Add a `useEffect` that listens to the query `data`.
  - When `data` changes (and is not empty), update the `txs` state by prepending new items.
  - Trigger `markAgentsForAction` for each new transaction.
  - Update `lastUpdated` and `error` states based on query status.

- [x] **Cleanup Legacy Polling** <!-- id: 3 -->
  - Remove the manual `setInterval` in the `useEffect` that was calling `poll`.
  - Remove the old `poll` function if it's no longer used outside the query.
  - Ensure `refresh` function now calls the query's `refetch`.

- [x] **Validation and Testing** <!-- id: 4 -->
  - Verify that the transaction list still updates correctly every 6 seconds.
  - Verify that active agent highlights still trigger on relevant transactions.
  - Verify that errors are correctly displayed if the RPC fails.
