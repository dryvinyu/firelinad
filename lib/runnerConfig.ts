export const RUNNER_CONFIG = {
  autoMode:
    (process.env.NEXT_PUBLIC_RUNNER_AUTO || 'true').toLowerCase() === 'true',
  cooldownBlocks: Number(process.env.NEXT_PUBLIC_COOLDOWN_BLOCKS || '5'),
  reserveDropBps: Number(process.env.NEXT_PUBLIC_RESERVE_DROP_BPS || '2000'),
  reserveWindowBlocks: Number(
    process.env.NEXT_PUBLIC_RESERVE_WINDOW_BLOCKS || '5',
  ),
  priceShock: Number(process.env.NEXT_PUBLIC_PRICE_SHOCK || '200'),
  withdrawLimitBps: Number(
    process.env.NEXT_PUBLIC_WITHDRAW_LIMIT_BPS || '1000',
  ),
  pollIntervalMs: Number(process.env.NEXT_PUBLIC_RUNNER_POLL_MS || '10000'),
  lookbackBlocks: Number(process.env.NEXT_PUBLIC_RUNNER_LOOKBACK || '6'),
}
