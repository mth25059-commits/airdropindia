-- Optional seed data. Run after 0001_init.sql.
-- These mirror the in-memory DEMO_AIRDROPS list shown when Supabase is empty.

insert into public.airdrops
  (slug, name, chain, description, estimated_value_usd, estimated_value_inr,
   difficulty, status, official_url, steps, tags, views)
values
  ('linea-points-airdrop','Linea Points Program','ethereum',
   'ConsenSys''s zkEVM L2. Bridge, swap, and lend to earn Voyage XP.',
   500, 41500, 'medium', 'active', 'https://linea.build/',
   '[{"title":"Bridge ETH to Linea","body":"Use the official Linea bridge."},
     {"title":"Swap on Lynex / Echodex","body":"Make 2-3 small swaps."},
     {"title":"Lend on Mendi or Lynex","body":"Deposit a stable to earn yield."},
     {"title":"Track XP weekly","body":"Login and farm consistently."}]'::jsonb,
   ARRAY['eth','l2','points'], 0),

  ('zksync-era-followup','zkSync Era Follow-up','ethereum',
   'After ZK token TGE, a second round is widely speculated. Stay active.',
   300, 24900, 'medium', 'upcoming', 'https://zksync.io/',
   '[{"title":"Bridge to zkSync Era","body":"Use the native bridge."},
     {"title":"Use SyncSwap / Velocore","body":"Make a few swaps each month."},
     {"title":"Mint a small NFT","body":"On a major marketplace."}]'::jsonb,
   ARRAY['eth','l2'], 0),

  ('jito-restaking-points','Jito Restaking Points','solana',
   'Liquid restaking on Solana. Hold JitoSOL, accrue points.',
   600, 49800, 'easy', 'active', 'https://www.jito.network/',
   '[{"title":"Buy SOL on CoinDCX","body":"Withdraw to Phantom."},
     {"title":"Stake to JitoSOL","body":"Via the official site."},
     {"title":"Hold and check points","body":"Don''t unstake."}]'::jsonb,
   ARRAY['sol','restaking','points'], 0),

  ('eigenlayer-restaking','EigenLayer Restaking','ethereum',
   'Restake stETH/rETH. Earn EigenLayer points + AVS rewards.',
   1000, 83000, 'hard', 'active', 'https://www.eigenlayer.xyz/',
   '[{"title":"Buy stETH or rETH","body":"Use Lido or Rocket Pool."},
     {"title":"Deposit to EigenLayer","body":"Choose an operator."},
     {"title":"Opt into AVS programs","body":"Each adds extra rewards."}]'::jsonb,
   ARRAY['eth','restaking'], 0),

  ('base-l2-activity','Base L2 Activity','base',
   'Coinbase L2. No token confirmed but ecosystem speculation is strong.',
   400, 33200, 'easy', 'active', 'https://base.org/',
   '[{"title":"Bridge ETH to Base","body":"Via the official bridge."},
     {"title":"Swap on Aerodrome","body":"Provide liquidity if comfortable."},
     {"title":"Mint a Zora NFT","body":"Costs ~$1."}]'::jsonb,
   ARRAY['base','l2'], 0),

  ('arbitrum-stip-rounds','Arbitrum STIP Rounds','arbitrum',
   'Short-Term Incentive Program — ARB rewards via grantee protocols.',
   200, 16600, 'easy', 'active', 'https://arbitrum.foundation/',
   '[{"title":"Find a live STIP recipient","body":"Watch the Arbitrum forum."},
     {"title":"Provide liquidity or trade","body":"On the recipient app."},
     {"title":"Claim rewards weekly","body":"Always check the official URL."}]'::jsonb,
   ARRAY['arb','grants'], 0),

  ('bnb-megadrop-current','BNB Chain Megadrop','bnb',
   'Binance''s recurring drop program — lock BNB, complete tasks, claim tokens.',
   100, 8300, 'easy', 'active', 'https://www.binance.com/en/megadrop',
   '[{"title":"Hold BNB on Binance","body":"At least the required amount."},
     {"title":"Complete Web3 wallet tasks","body":"Visit the campaign page."},
     {"title":"Claim allocation","body":"Available at TGE."}]'::jsonb,
   ARRAY['bnb','binance'], 0),

  ('polygon-zkevm-activity','Polygon zkEVM Activity','polygon',
   'Polygon''s zk rollup. Token possibilities for active users.',
   250, 20750, 'medium', 'active', 'https://polygon.technology/polygon-zkevm',
   '[{"title":"Bridge MATIC/ETH","body":"Via the official zkEVM bridge."},
     {"title":"Use QuickSwap / Layer3","body":"Make a few swaps and quests."},
     {"title":"Track weekly activity","body":"Stay consistent."}]'::jsonb,
   ARRAY['polygon','l2','zk'], 0)

on conflict (slug) do nothing;
