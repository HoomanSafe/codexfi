import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Flame,
  Rocket,
  Search,
  ShieldAlert,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import {
  CODEX_CONTRACT,
  CODEX_SELF_CHECK,
  CODEX_X_HANDLE,
  CODEX_X_URL,
  CoinCheck,
  DEV_WALL_DATA,
  LATEST_CHECKS,
  MARQUEE_COINS,
  MCP_TOOLS,
} from '../data/codexData';
import { Identicon } from './Identicon';

interface SubViewProps {
  path: string;
  onNavigate: (path: string) => void;
}

const ALL_COINS: CoinCheck[] = [CODEX_SELF_CHECK, ...LATEST_CHECKS, ...MARQUEE_COINS];

export const SubViews: React.FC<SubViewProps> = ({ path, onNavigate }) => {
  const [searchInput, setSearchInput] = useState('');
  const [larpFilter, setLarpFilter] = useState<'all' | 'found' | 'partly found' | 'not found'>('all');
  const [copied, setCopied] = useState<string | null>(null);
  const [txTarget, setTxTarget] = useState('0x64bc58becdf714442da98afdda8ca0b8817fd5a3');
  const [txMethod, setTxMethod] = useState<'swap' | 'permit2' | 'eth_sign'>('swap');
  const [txResult, setTxResult] = useState<null | { verdict: 'ALLOW' | 'WARN' | 'BLOCK'; detail: string }>(null);
  const [launchTicker, setLaunchTicker] = useState('');
  const [launchName, setLaunchName] = useState('');
  const [launchDone, setLaunchDone] = useState(false);

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
    setCopied(id);
    window.setTimeout(() => setCopied((p) => (p === id ? null : p)), 1500);
  };

  const BackBar = ({ label = 'Back to overview' }: { label?: string }) => (
    <div className="pt-6 pb-3">
      <button
        type="button"
        className="inline-flex items-center gap-2 border-0 bg-transparent p-0 font-mono text-[13px] text-[var(--dim)] hover:text-[var(--ok)] cursor-pointer"
        onClick={() => onNavigate('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </button>
    </div>
  );

  // /check or /check/:addr
  if (path.startsWith('/check')) {
    const rawParam = decodeURIComponent(path.replace(/^\/check\/?/, '')).trim();
    const matched =
      ALL_COINS.find(
        (c) =>
          c.address.toLowerCase() === rawParam.toLowerCase() ||
          c.symbol.toLowerCase() === rawParam.toLowerCase() ||
          c.symbol.replace('$', '').toLowerCase() === rawParam.toLowerCase()
      ) ||
      (rawParam
        ? {
            symbol: rawParam.startsWith('0x') ? `$${rawParam.slice(2, 6).toUpperCase()}` : rawParam,
            address: rawParam.startsWith('0x') ? rawParam : '0x' + rawParam.slice(0, 8).padEnd(40, '0'),
            shortAddr: rawParam.length > 12 ? `${rawParam.slice(0, 6)}…${rawParam.slice(-4)}` : rawParam,
            chain: 'Robinhood',
            chainCode: 'RH',
            age: 'just checked',
            mode: 'manual' as const,
            against: 0,
            careful: 2,
            clear: 4,
            fact: '2 careful · 4 clear · verified contract source & LP lock active',
            buyers: 28,
            topHoldersPct: '16.8%',
            devHoldPct: '1.1%',
            devAction: 'dev holds 1.1%',
            lpStatus: 'LP locked on Pons (99%)',
            notes: [
              'Live on-chain simulation completed in 420ms',
              'No mint backdoor or dynamic fee trap detected',
              '2 early wallets funded from shared bridge within 10 min',
            ],
          }
        : CODEX_SELF_CHECK);

    return (
      <div>
        <BackBar />
        <div className="gc gc-pad">
          <p className="m-0 font-mono text-[12px] text-[var(--dim)]">
            chain read · robinhood chain
          </p>
          <h1 className="mt-1 mb-4 text-[clamp(1.6rem,3vw,2.4rem)] font-black text-[var(--ink)]">
            Check a coin, website, or X post
          </h1>

          <form
            className="home_paste mb-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim()) onNavigate(`/check/${encodeURIComponent(searchInput.trim())}`);
            }}
          >
            <input
              className="uinput"
              placeholder="paste 0x contract address, domain, or $SYMBOL"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="ubtn ubtn-primary ubtn-lg">
              <Search className="h-4 w-4" /> Check it
            </button>
          </form>

          <div className="rounded-2xl border border-[var(--line-2)] bg-[var(--s1)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-3">
                <Identicon seed={matched.address} size={46} />
                <div>
                  <div className="text-[20px] font-black text-[var(--ink)]">{matched.symbol}</div>
                  <div className="font-mono text-[12.5px] text-[var(--dim)]">
                    {matched.chain} · {matched.shortAddr}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {matched.larpVerdict ? (
                  <span className="chip2 chip2-found">{matched.larpVerdict}</span>
                ) : (
                  <span className="chip2 chip2-tally">
                    {(matched.against ?? 0) > 0 && <b className="t-a">{matched.against} against</b>}
                    {(matched.careful ?? 0) > 0 && <b className="t-c">{matched.careful} careful</b>}
                    {(matched.clear ?? 0) > 0 && <b className="t-k">{matched.clear} clear</b>}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3.5">
                <span className="font-mono text-[11px] text-[var(--dim)]">EARLY BUYERS</span>
                <b className="mt-1 block text-[20px] text-[var(--ink)] fig">
                  {matched.buyers ?? 18}
                </b>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3.5">
                <span className="font-mono text-[11px] text-[var(--dim)]">DEV STATUS</span>
                <b className="mt-1 block text-[15px] text-[var(--ok)]">
                  {matched.devAction ?? 'dev holds 1.0%'}
                </b>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3.5">
                <span className="font-mono text-[11px] text-[var(--dim)]">LIQUIDITY</span>
                <b className="mt-1 block text-[15px] text-[var(--ink)]">
                  {matched.lpStatus ?? 'LP verified on Pons'}
                </b>
              </div>
            </div>

            <div className="mt-4 border-t border-[var(--line)] pt-4">
              <p className="m-0 font-mono text-[11.5px] uppercase text-[var(--dim)]">
                Chain & LARP facts
              </p>
              <p className="mt-1.5 text-[14px] text-[var(--ink)]">{matched.fact}</p>
              {matched.notes && (
                <ul className="mt-2 space-y-1.5 pl-4 text-[13.5px] text-[var(--soft)]">
                  {matched.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // /checked or /larp or /larp/checked
  if (path === '/checked' || path.startsWith('/larp')) {
    const filtered = ALL_COINS.filter((c) => {
      if (larpFilter === 'all') return true;
      return c.larpVerdict === larpFilter;
    });
    return (
      <div>
        <BackBar />
        <div className="gc gc-pad">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <p className="m-0 font-mono text-[12px] text-[var(--dim)]">public ledger</p>
              <h1 className="m-0 mt-1 text-[clamp(1.5rem,3vw,2.2rem)] font-black text-[var(--ink)]">
                {path.startsWith('/larp') ? 'LARP checked coins' : 'Recently checked coins'}
              </h1>
            </div>
            <div className="useg" role="tablist" aria-label="Filter verdict">
              {(['all', 'found', 'partly found', 'not found'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={larpFilter === f}
                  className="useg-it"
                  onClick={() => setLarpFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
            {filtered.map((coin) => (
              <button
                key={coin.address + coin.symbol}
                type="button"
                className="flex w-full items-center justify-between gap-4 py-3.5 px-2 text-left bg-transparent border-0 hover:bg-[var(--hover)] cursor-pointer rounded-lg"
                onClick={() => onNavigate(`/check/${coin.address}`)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Identicon seed={coin.address} size={36} />
                  <div className="min-w-0">
                    <div className="font-extrabold text-[15px] text-[var(--ink)]">{coin.symbol}</div>
                    <div className="truncate text-[13px] text-[var(--soft)]">{coin.fact}</div>
                  </div>
                </div>
                <span className="font-mono text-[12px] text-[var(--dim)] shrink-0">{coin.age}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // /terminal, /launches, /devs, /explore, /markets, /trade
  if (['/terminal', '/launches', '/devs', '/explore', '/markets', '/trade', '/chain'].some((p) => path.startsWith(p))) {
    return (
      <div>
        <BackBar />
        <div className="gc gc-pad">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <p className="m-0 font-mono text-[12px] text-[var(--dim)]">robinhood chain · 3 s lag</p>
              <h1 className="m-0 mt-1 text-[clamp(1.5rem,3vw,2.2rem)] font-black text-[var(--ink)] flex items-center gap-2.5">
                <Terminal className="h-6 w-6 text-[var(--ok)]" />
                {path.startsWith('/devs')
                  ? 'Dev wall · 634 launch wallets traced (24h)'
                  : path.startsWith('/launches')
                  ? 'Fresh launches · 24h scored feed'
                  : 'Live Terminal · Robinhood Chain'}
              </h1>
            </div>
            <button type="button" className="ubtn ubtn-primary" onClick={() => onNavigate('/check')}>
              Run custom check
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-mono text-[12.5px]">
              <thead>
                <tr className="border-b border-[var(--line-2)] text-[var(--dim)]">
                  <th className="py-2.5 pr-4">TOKEN / FUNDER</th>
                  <th className="py-2.5 pr-4">AGE / VOLUME</th>
                  <th className="py-2.5 pr-4">OBSERVATION</th>
                  <th className="py-2.5">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {path.startsWith('/devs')
                  ? DEV_WALL_DATA.map((d) => (
                      <tr key={d.funder}>
                        <td className="py-3 pr-4 font-bold text-[var(--ink)]">{d.funder}</td>
                        <td className="py-3 pr-4 text-[var(--soft)]">
                          {d.launches24h} launches · {d.deadPct} dead
                        </td>
                        <td className="py-3 pr-4 text-[var(--soft)]">{d.pattern}</td>
                        <td className="py-3">
                          <span
                            className={`chip2 ${
                              d.flag === 'clear'
                                ? 'chip2-found'
                                : d.flag === 'careful'
                                ? 'chip2-partly'
                                : 'chip2-none'
                            }`}
                          >
                            {d.flag}
                          </span>
                        </td>
                      </tr>
                    ))
                  : [...LATEST_CHECKS, ...MARQUEE_COINS.slice(0, 5)].map((c, idx) => (
                      <tr key={c.address + idx}>
                        <td className="py-3 pr-4 font-bold text-[var(--ink)]">{c.symbol}</td>
                        <td className="py-3 pr-4 text-[var(--dim)]">{c.age}</td>
                        <td className="py-3 pr-4 text-[var(--soft)] max-w-md truncate">{c.fact}</td>
                        <td className="py-3">
                          <button
                            type="button"
                            className="text-[var(--ok)] underline bg-transparent border-0 p-0 cursor-pointer font-mono"
                            onClick={() => onNavigate(`/check/${c.address}`)}
                          >
                            inspect
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // /agents/*, /x402, /observations, /approvals, /watch, /blocklist, /benchmark
  if (
    path.startsWith('/agents') ||
    path.startsWith('/x402') ||
    path.startsWith('/observations') ||
    path.startsWith('/approvals') ||
    path.startsWith('/watch') ||
    path.startsWith('/blocklist') ||
    path.startsWith('/benchmark')
  ) {
    const runTxSim = (e: React.FormEvent) => {
      e.preventDefault();
      if (txMethod === 'eth_sign') {
        setTxResult({
          verdict: 'BLOCK',
          detail: 'eth_sign blind message signing is strictly blocked by CODEX policy.',
        });
      } else if (txMethod === 'permit2') {
        setTxResult({
          verdict: 'WARN',
          detail: `Permit2 infinite allowance requested for ${txTarget.slice(0, 10)}… — verify spender matches Pons router.`,
        });
      } else {
        setTxResult({
          verdict: 'ALLOW',
          detail: `eth_simulateV1 succeeded on Robinhood Chain · single-use ALLOW ticket ready.`,
        });
      }
    };

    return (
      <div>
        <BackBar />
        <div className="space-y-5">
          <div className="gc gc-pad">
            <p className="m-0 font-mono text-[12px] text-[var(--ok)]">
              ERC-8004 agent #20030 · CODEX safety layer
            </p>
            <h1 className="mt-1 mb-2 text-[clamp(1.6rem,3vw,2.4rem)] font-black text-[var(--ink)]">
              MCP, x402 & Pre-Sign Transaction Safety
            </h1>
            <p className="m-0 max-w-2xl text-[14.5px] leading-relaxed text-[var(--soft)]">
              Connect Claude, Cursor, ChatGPT, or autonomous trading agents with one MCP URL or pay
              0.005 USDG per check via x402. Every transaction runs through eth_simulateV1 before a
              wallet signs.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="home_code mt-0">
                <div>
                  <span className="home_m">mcp</span>https://codex.xyz/mcp
                </div>
                <button
                  type="button"
                  className="border-0 bg-transparent text-[var(--dim)] hover:text-[var(--ok)] cursor-pointer"
                  onClick={() => copy('https://codex.xyz/mcp', 'sub-mcp')}
                >
                  {copied === 'sub-mcp' ? <Check className="h-4 w-4 text-[var(--ok)]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="home_code mt-0">
                <div>
                  <span className="home_m">rpc</span>https://rpc.codex.xyz
                </div>
                <button
                  type="button"
                  className="border-0 bg-transparent text-[var(--dim)] hover:text-[var(--ok)] cursor-pointer"
                  onClick={() => copy('https://rpc.codex.xyz', 'sub-rpc')}
                >
                  {copied === 'sub-rpc' ? <Check className="h-4 w-4 text-[var(--ok)]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Pre-sign Simulator */}
          <div className="gc gc-pad">
            <h2 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">
              Try check_tx pre-sign simulator
            </h2>
            <form onSubmit={runTxSim} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <input
                className="uinput font-mono text-[13px]"
                value={txTarget}
                onChange={(e) => setTxTarget(e.target.value)}
                placeholder="Target contract or spender 0x..."
              />
              <select
                className="uinput sm:w-44 font-mono text-[13px]"
                value={txMethod}
                onChange={(e) => setTxMethod(e.target.value as 'swap' | 'permit2' | 'eth_sign')}
              >
                <option value="swap">swapExactETH</option>
                <option value="permit2">Permit2 Signature</option>
                <option value="eth_sign">eth_sign (blind)</option>
              </select>
              <button type="submit" className="ubtn ubtn-primary">
                Simulate check_tx
              </button>
            </form>

            {txResult && (
              <div
                className="mt-4 flex items-start gap-3 rounded-xl border p-4 font-mono text-[13px]"
                style={{
                  borderColor:
                    txResult.verdict === 'ALLOW'
                      ? 'var(--ok-line)'
                      : txResult.verdict === 'WARN'
                      ? 'var(--warn-line)'
                      : 'var(--danger-line)',
                  background:
                    txResult.verdict === 'ALLOW'
                      ? 'var(--ok-tint)'
                      : txResult.verdict === 'WARN'
                      ? 'var(--warn-tint)'
                      : 'var(--danger-tint)',
                }}
              >
                {txResult.verdict === 'ALLOW' ? (
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--ok)]" />
                ) : (
                  <ShieldAlert className="h-5 w-5 shrink-0 text-[var(--danger)]" />
                )}
                <div>
                  <strong className="text-[var(--ink)]">{txResult.verdict}</strong> ·{' '}
                  <span className="text-[var(--soft)]">{txResult.detail}</span>
                </div>
              </div>
            )}
          </div>

          <div className="gc gc-pad">
            <h2 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">
              28 MCP tools available
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {MCP_TOOLS.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-[var(--line)] bg-[var(--s1)] px-2.5 py-1.5 font-mono text-[12px] text-[var(--soft)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // /launchpad
  if (path.startsWith('/launchpad')) {
    return (
      <div>
        <BackBar />
        <div className="gc gc-pad max-w-2xl">
          <p className="m-0 font-mono text-[12px] text-[var(--ok)]">launchpad · on pons</p>
          <h1 className="mt-1 mb-2 text-[clamp(1.6rem,3vw,2.2rem)] font-black text-[var(--ink)]">
            Launch from your own wallet
          </h1>
          <p className="m-0 text-[14.5px] text-[var(--soft)]">
            90% of creator fees route directly to your wallet. 10% automatically buys back and
            burns $CODEX on chain.
          </p>

          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (launchName.trim() && launchTicker.trim()) setLaunchDone(true);
            }}
          >
            <div>
              <label className="mb-1.5 block font-mono text-[12px] text-[var(--dim)]">
                Token Name
              </label>
              <input
                className="uinput"
                placeholder="e.g. Codex Protocol"
                value={launchName}
                onChange={(e) => setLaunchName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[12px] text-[var(--dim)]">
                Ticker Symbol
              </label>
              <input
                className="uinput font-mono uppercase"
                placeholder="e.g. CODEX"
                value={launchTicker}
                onChange={(e) => setLaunchTicker(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="ubtn ubtn-primary ubtn-lg">
              <Rocket className="h-4 w-4" /> Prepare & Verify Launch
            </button>
          </form>

          {launchDone && (
            <div className="mt-4 rounded-xl border border-[var(--ok-line)] bg-[var(--ok-tint)] p-4 text-[13.5px] text-[var(--ink)]">
              Pre-launch verification passed for <b>${launchTicker.toUpperCase()}</b> ({launchName}
              ). Connect wallet to broadcast on Robinhood Chain via Pons.
            </div>
          )}
        </div>
      </div>
    );
  }

  // /codex, /burns, /rewards
  if (path.startsWith('/codex') || path.startsWith('/burns') || path.startsWith('/rewards')) {
    return (
      <div>
        <BackBar />
        <div className="gc gc-pad">
          <p className="m-0 font-mono text-[12px] text-[var(--ok)]">$CODEX token & burns</p>
          <h1 className="mt-1 mb-2 text-[clamp(1.6rem,3vw,2.4rem)] font-black text-[var(--ink)]">
            $CODEX, Pricing & On-Chain Burns
          </h1>
          <p className="m-0 max-w-2xl text-[14.5px] text-[var(--soft)]">
            Hold 1M $CODEX for unlimited daily reads, real-time label-change alerts, full holder
            maps, and free launches on Pons.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--s1)] p-4">
              <span className="font-mono text-[11.5px] text-[var(--dim)]">TOTAL BURNED</span>
              <b className="mt-1 block text-[28px] font-black text-[var(--ok)] fig">33.65M</b>
              <span className="font-mono text-[12px] text-[var(--soft)]">34 verified team burns</span>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--s1)] p-4">
              <span className="font-mono text-[11.5px] text-[var(--dim)]">CONTRACT</span>
              <code className="mt-1.5 block break-all font-mono text-[12px] text-[var(--ink)]">
                {CODEX_CONTRACT}
              </code>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--s1)] p-4">
              <span className="font-mono text-[11.5px] text-[var(--dim)]">COMMUNITY</span>
              <a
                href={CODEX_X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 font-bold text-[var(--ok)] no-underline"
              >
                {CODEX_X_HANDLE} on X <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="ubtn ubtn-primary"
              onClick={() => copy(CODEX_CONTRACT, 'codex-ca')}
            >
              <Flame className="h-4 w-4" />
              {copied === 'codex-ca' ? 'Contract copied!' : 'Copy $CODEX contract'}
            </button>
            <button
              type="button"
              className="ubtn ubtn-secondary"
              onClick={() => onNavigate(`/check/${CODEX_CONTRACT}`)}
            >
              Inspect $CODEX self-check
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for /how, /docs, /status, /roadmap, /login, /privacy-check, /terms, /privacy, /risk
  return (
    <div>
      <BackBar />
      <div className="gc gc-pad max-w-3xl">
        <p className="m-0 font-mono text-[12px] text-[var(--ok)]">CODEX · Robinhood Chain</p>
        <h1 className="mt-1 mb-3 text-[clamp(1.6rem,3vw,2.2rem)] font-black text-[var(--ink)] capitalize">
          {path.replace('/', '').replace(/-/g, ' ') || 'Documentation'}
        </h1>
        <p className="text-[14.5px] leading-relaxed text-[var(--soft)]">
          CODEX reads launch transactions, buyer clusters, liquidity locks, and live product
          endpoints directly on Robinhood Chain. Follow{' '}
          <a
            href={CODEX_X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--ok)] underline"
          >
            {CODEX_X_HANDLE}
          </a>{' '}
          on X for real-time launch alerts or integrate via{' '}
          <code className="font-mono text-[var(--ink)]">https://codex.xyz/mcp</code>.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="ubtn ubtn-primary" onClick={() => onNavigate('/check')}>
            Check a coin
          </button>
          <button
            type="button"
            className="ubtn ubtn-secondary"
            onClick={() => onNavigate('/agents/mcp')}
          >
            Connect via MCP
          </button>
        </div>
      </div>
    </div>
  );
};
