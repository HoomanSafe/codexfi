import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Chrome,
  Copy,
  Layers,
  Rocket,
  Send,
  Terminal,
  Users,
} from 'lucide-react';
import {
  CODEX_CONTRACT,
  CODEX_SELF_CHECK,
  CODEX_X_HANDLE,
  CODEX_X_URL,
  CoinCheck,
  DAILY_LAUNCHES,
  HOURLY_SPARK,
  LARP_BREAKDOWN,
  LATEST_CHECKS,
  MARQUEE_COINS,
  MCP_TOOLS,
} from '../data/codexData';
import { Identicon } from './Identicon';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

const renderTally = (coin: CoinCheck) => {
  if (coin.larpVerdict) {
    const cls =
      coin.larpVerdict === 'found'
        ? 'chip2 chip2-found'
        : coin.larpVerdict === 'partly found'
        ? 'chip2 chip2-partly'
        : 'chip2 chip2-none';
    return (
      <span className={cls}>
        <i aria-hidden="true" />
        {coin.larpVerdict}
      </span>
    );
  }
  return (
    <span
      className="chip2 chip2-tally"
      role="img"
      aria-label={`${coin.against ?? 0} against, ${coin.careful ?? 0} careful, ${coin.clear ?? 0} clear`}
    >
      {(coin.against ?? 0) > 0 && (
        <b className="t-a">
          <i aria-hidden="true" />
          {coin.against}
          <span className="w"> against</span>
        </b>
      )}
      {(coin.careful ?? 0) > 0 && (
        <b className="t-c">
          <i aria-hidden="true" />
          {coin.careful}
          <span className="w"> careful</span>
        </b>
      )}
      {(coin.clear ?? 0) > 0 && (
        <b className="t-k">
          <i aria-hidden="true" />
          {coin.clear}
          <span className="w"> clear</span>
        </b>
      )}
    </span>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [utcTime, setUtcTime] = useState(() => new Date().toISOString().slice(11, 19) + ' UTC');
  const [windowMode, setWindowMode] = useState<'24h' | '7d'>('7d');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeBarIdx, setActiveBarIdx] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setUtcTime(new Date().toISOString().slice(11, 19) + ' UTC');
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard error
    }
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) {
      onNavigate('/check');
      return;
    }
    onNavigate(`/check/${encodeURIComponent(cleaned)}`);
  };

  const trenchMetrics =
    windowMode === '7d'
      ? {
          launches: '21,483',
          launchesLabel: 'launches, 7 d',
          graduated: '20',
          checked: '305',
          pads: '18',
          dead: '96%',
        }
      : {
          launches: '2,727',
          launchesLabel: 'launches, 24 h',
          graduated: '3',
          checked: '48',
          pads: '12',
          dead: '94%',
        };

  const maxDaily = 6000;

  return (
    <div>
      {/* HERO SECTION */}
      <section className="home_hero" aria-labelledby="home-h1">
        <p className="home_kicker">
          the safety layer for agentic finance on robinhood chain · erc-8004 agent #20030
        </p>
        <h1 id="home-h1" className="home_h1">
          The check your agent calls{' '}
          <span className="home_accent">before it buys or signs.</span>
        </h1>
        <p className="home_lede">
          Every buy, signature and payment checked before your agent makes it: who&apos;s behind a
          coin, what a transaction really does, who a payment really goes to. Read from the chain
          on Robinhood Chain. One MCP line, one x402 call, or one paste. Free: 10 new coins a day.
        </p>

        <div className="home_pasteWrap">
          <form className="home_paste" role="search" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="home-check">
              Check a coin, a website or an X post
            </label>
            <input
              id="home-check"
              className="uinput"
              placeholder="paste a coin, a website or an X post"
              autoComplete="off"
              spellCheck={false}
              maxLength={300}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="ubtn ubtn-primary ubtn-lg" type="submit">
              Check it
            </button>
          </form>

          <p className="home_chains">
            <span>
              <i className="ch-dot-rh" aria-hidden="true" />
              Robinhood Chain
            </span>
            <span>any launchpad · no sign-in · no key</span>
          </p>

          <p className="mt-2 text-[13.5px] text-[var(--dim)]">
            Try one:{' '}
            <button
              type="button"
              className="font-bold text-[var(--ok)] underline decoration-[var(--ok-line)] underline-offset-2 bg-transparent border-0 p-0 cursor-pointer hover:text-[var(--ok-hi)]"
              onClick={() => onNavigate(`/check/${CODEX_CONTRACT}`)}
            >
              $CODEX
            </button>{' '}
            · who bought first, who the dev is, and whether the liquidity can be pulled.
          </p>
        </div>

        {/* Connect Pills */}
        <nav className="home_connect" aria-label="Connect an agent">
          <button
            type="button"
            className="home_connectPill"
            onClick={() => copyText('https://codex.xyz/mcp', 'pill-mcp')}
          >
            <span className="home_m">mcp</span>
            <span>{copiedKey === 'pill-mcp' ? 'copied https://codex.xyz/mcp' : 'codex.xyz/mcp'}</span>
          </button>
          <button
            type="button"
            className="home_connectPill"
            onClick={() => onNavigate('/agents/x402')}
          >
            <span className="home_m">GET</span>
            <span>/api/x402/check/{'{token}'}</span>
            <span className="home_dim">0.005 USDG</span>
          </button>
          <button
            type="button"
            className="home_connectPill"
            onClick={() => copyText('npm install @codexxyz/sdk', 'pill-sdk')}
          >
            <span className="home_m">$</span>
            <span>
              {copiedKey === 'pill-sdk' ? 'copied npm install @codexxyz/sdk' : 'npm install @codexxyz/sdk'}
            </span>
          </button>
        </nav>

        {/* HERO SPLIT GRID */}
        <div className="home_heroGrid">
          {/* Left: Latest Checks */}
          <div className="gc flex flex-col overflow-hidden pb-1">
            <div className="gc-head">
              <h2 className="m-0 flex items-center gap-2.5 text-[15.5px] font-extrabold text-[var(--ink)]">
                <span className="home_liveDot" aria-hidden="true" />
                Latest checks
              </h2>
              <span className="font-mono text-[11.5px] font-medium text-[var(--dim)] fig">
                {utcTime}
              </span>
            </div>

            <ul className="m-0 flex-1 list-none p-0">
              {LATEST_CHECKS.map((coin) => (
                <li key={coin.address}>
                  <a
                    href={`/check/${coin.address}`}
                    className="home_feedRow"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/check/${coin.address}`);
                    }}
                  >
                    <Identicon seed={coin.address} size={36} />
                    <span className="min-w-0">
                      <span className="flex items-baseline gap-2 min-w-0">
                        <span className="truncate text-[15px] font-extrabold text-[var(--ink)]">
                          {coin.symbol}
                        </span>
                        <span className="shrink-0 font-mono text-[12px] text-[var(--dim)]">
                          <span className="sm:hidden">{coin.chainCode}</span>
                          <span className="hidden sm:inline">{coin.chain}</span>
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[13.5px] text-[var(--soft)]">
                        {coin.fact}
                      </span>
                    </span>
                    <span className="flex flex-col items-end gap-1.5">
                      <span className="flex items-center gap-1.5">
                        {coin.mode === 'auto' && <span className="chip2 chip2-auto">auto</span>}
                        {renderTally(coin)}
                      </span>
                      <span className="font-mono text-[11.5px] text-[var(--dim)]">{coin.age}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] px-5 py-2.5">
              <span className="hidden sm:inline text-[12.5px] text-[var(--dim)]">
                People&apos;s checks and our own launch reads (auto).
              </span>
              <button
                type="button"
                className="ml-auto inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer min-h-[36px]"
                onClick={() => onNavigate('/checked')}
              >
                All checks <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right: Live Counters */}
          <div className="gc home_counters">
            <div className="home_ct home_ctWide">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <b className="fig">603</b>
                  <span className="mt-1.5 block font-mono text-[12px] text-[var(--dim)]">
                    launches read today · per hour, 24 h
                  </span>
                </div>
                <div
                  className="flex h-12 items-end gap-[3px]"
                  aria-label="Hourly launches sparkline"
                >
                  {HOURLY_SPARK.map((val, idx) => (
                    <span
                      key={idx}
                      className="w-[4px] sm:w-[5px] rounded-t-sm"
                      style={{
                        height: `${Math.round((val / 41) * 100)}%`,
                        background: idx >= 20 ? 'var(--ok)' : 'var(--bar-top)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="home_ct">
              <b className="fig text-[var(--ok)]">3 s</b>
              <span className="font-mono text-[12px] text-[var(--dim)]">behind the chain</span>
            </div>

            <div className="home_ct home_ctR">
              <b className="fig">319</b>
              <span className="font-mono text-[12px] text-[var(--dim)]">trades read / min</span>
            </div>

            <div className="home_ct">
              <b className="fig">793</b>
              <span className="font-mono text-[12px] text-[var(--dim)]">
                coins LARP-checked{' '}
                <span className="text-[var(--faint)]">· last 90 days</span>
              </span>
            </div>

            <div className="home_ct home_ctR">
              <b className="fig text-[var(--ok)]">49</b>
              <span className="font-mono text-[12px] text-[var(--dim)]">had a real product</span>
            </div>

            <div className="home_ct home_ctFull">
              <b className="fig">634</b>
              <span className="font-mono text-[12px] text-[var(--dim)]">
                launch wallets traced, 24 h
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FOR AI AGENTS */}
      <section className="home_sec" aria-labelledby="home-agents">
        <div className="home_secHead">
          <div>
            <p className="home_secKicker">for ai agents</p>
            <h2 id="home-agents" className="home_h2">
              One call before every buy.
            </h2>
          </div>
        </div>

        <div className="home_g3">
          {/* Card 1: 28 tools over MCP */}
          <div className="gc gc-pad gc-col">
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">28 tools over MCP</h3>
              <span className="chip2 chip2-clear">
                <i aria-hidden="true" />
                free
              </span>
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--soft)]">
              Claude, ChatGPT, Cursor or your own agent. One URL, no key.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {MCP_TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md border border-[var(--line)] bg-[var(--s1)] px-2 py-1 font-mono text-[11px] text-[var(--soft)]"
                >
                  {tool}
                </span>
              ))}
            </div>
            <div className="home_code">
              <div>
                <span className="home_m">mcp</span>
                <span>https://codex.xyz/mcp</span>
              </div>
              <button
                type="button"
                aria-label="Copy MCP URL"
                className="border-0 bg-transparent p-1 text-[var(--dim)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => copyText('https://codex.xyz/mcp', 'card-mcp')}
              >
                {copiedKey === 'card-mcp' ? <Check className="h-3.5 w-3.5 text-[var(--ok)]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/agents/mcp')}
              >
                Set it up <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Agents pay per check */}
          <div className="gc gc-pad gc-col">
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">
                Agents pay per check
              </h3>
              <span className="chip2 chip2-none">
                <i aria-hidden="true" />
                x402
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2.5">
              <b className="text-[38px] font-black leading-none text-[var(--ok)] fig">0.005</b>
              <span className="text-[13px] text-[var(--soft)]">
                USDG a check · no account · charged only for a full answer
              </span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--soft)]">
              Coin checks on Robinhood Chain, LARP checks and the pre-sign check (0.005 USDG).
            </p>
            <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--s1)] px-3.5 py-2.5">
              <b className="block text-[22px] font-extrabold text-[var(--ink)] fig">3</b>
              <span className="font-mono text-[11.5px] text-[var(--dim)]">
                paid checks from other agents
              </span>
            </div>
            <div className="home_code">
              <div>
                <span className="home_m">GET</span>
                <span>codex.xyz/api/x402/larp/{'{token}'}</span>
              </div>
              <button
                type="button"
                aria-label="Copy x402 endpoint"
                className="border-0 bg-transparent p-1 text-[var(--dim)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => copyText('https://codex.xyz/api/x402/larp/{token}', 'card-x402')}
              >
                {copiedKey === 'card-x402' ? <Check className="h-3.5 w-3.5 text-[var(--ok)]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/agents/x402')}
              >
                How agents pay <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card 3: SDKs & plugins */}
          <div className="gc gc-pad gc-col">
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">SDKs & plugins</h3>
              <span className="chip2 chip2-none">
                <i aria-hidden="true" />
                MIT
              </span>
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--soft)]">
              JavaScript, Python, ElizaOS, AgentKit, Vercel AI SDK, LangChain, Mastra, OpenAI
              Agents SDK, CrewAI. The same check, called from your code.
            </p>
            <div className="home_code">
              <div>
                <span className="home_m">$</span>
                <span>npm install @codexxyz/sdk</span>
              </div>
              <button
                type="button"
                aria-label="Copy npm install"
                className="border-0 bg-transparent p-1 text-[var(--dim)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => copyText('npm install @codexxyz/sdk', 'card-npm')}
              >
                {copiedKey === 'card-npm' ? <Check className="h-3.5 w-3.5 text-[var(--ok)]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="home_code mt-2">
              <div>
                <span className="home_m">$</span>
                <span>pip install codex-sdk</span>
              </div>
              <button
                type="button"
                aria-label="Copy pip install"
                className="border-0 bg-transparent p-1 text-[var(--dim)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => copyText('pip install codex-sdk', 'card-pip')}
              >
                {copiedKey === 'card-pip' ? <Check className="h-3.5 w-3.5 text-[var(--ok)]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/agents/plugins')}
              >
                Plugins & SDKs <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-[var(--dim)]">
          <button
            type="button"
            className="text-[var(--soft)] underline decoration-[var(--line-2)] hover:text-[var(--ok)] bg-transparent border-0 p-0 cursor-pointer"
            onClick={() => onNavigate('/agents')}
          >
            ERC-8004 agent #20030 on Robinhood Chain
          </button>{' '}
          · Three ERCs in review, each live in CODEX:{' '}
          <button
            type="button"
            className="text-[var(--soft)] underline decoration-[var(--line-2)] hover:text-[var(--ok)] bg-transparent border-0 p-0 cursor-pointer"
            onClick={() => onNavigate('/observations')}
          >
            ERC-8470 Launch Observations (PR #2121)
          </button>
          ,{' '}
          <button
            type="button"
            className="text-[var(--soft)] underline decoration-[var(--line-2)] hover:text-[var(--ok)] bg-transparent border-0 p-0 cursor-pointer"
            onClick={() => onNavigate('/x402')}
          >
            ERC-8478 x402 payee check (PR #2132)
          </button>
          ,{' '}
          <button
            type="button"
            className="text-[var(--soft)] underline decoration-[var(--line-2)] hover:text-[var(--ok)] bg-transparent border-0 p-0 cursor-pointer"
            onClick={() => onNavigate('/agents/x402')}
          >
            Agent Pre-Sign Risk Report (PR #2134)
          </button>{' '}
          ·{' '}
          <button
            type="button"
            className="text-[var(--soft)] underline decoration-[var(--line-2)] hover:text-[var(--ok)] bg-transparent border-0 p-0 cursor-pointer"
            onClick={() => onNavigate('/agents')}
          >
            CODEX for agents
          </button>
        </p>
      </section>

      {/* SECTION: SAFETY LAYER */}
      <section className="home_sec" aria-labelledby="home-safety">
        <div className="home_secHead">
          <div>
            <p className="home_secKicker">safety layer</p>
            <h2 id="home-safety" className="home_h2">
              Read it before you sign it.
            </h2>
          </div>
        </div>

        <div className="home_g3">
          <div className="gc gc-pad gc-col">
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">Before it signs</h3>
              <span className="chip2 chip2-none">
                <i aria-hidden="true" />
                check_tx
              </span>
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--soft)]">
              The transaction runs against the chain first (eth_simulateV1): what moves, what gets
              approved, a revert. Signatures (Permit2, Seaport, UniswapX, sign-in messages) say what
              they let someone take (simulated, in dollars where CODEX has a price), and their text
              is read for hidden instructions; eth_sign is BLOCK. An x402 payment is checked against
              the seller&apos;s ERC-8004 wallet and usual price, upto and hold-and-capture terms
              included. ALLOW, WARN or BLOCK, with the reasons. 0.005 USDG over x402, or free within
              the daily coins.
            </p>
            <div className="home_code">
              <div>
                <span className="home_m">POST</span>
                <span>codex.xyz/api/tx/check</span>
              </div>
              <button
                type="button"
                aria-label="Copy check_tx URL"
                className="border-0 bg-transparent p-1 text-[var(--dim)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => copyText('https://codex.xyz/api/tx/check', 'card-tx')}
              >
                {copiedKey === 'card-tx' ? <Check className="h-3.5 w-3.5 text-[var(--ok)]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/agents/safety')}
              >
                What CODEX checks <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="gc gc-pad gc-col">
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">Make it binding</h3>
              <span className="chip2 chip2-none">
                <i aria-hidden="true" />
                onchain
              </span>
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--soft)]">
              ALLOW tickets: CODEX signs a single-use ticket for one exact call, and a contract or a
              MetaMask delegation (CodexAllowEnforcer, deployed on Robinhood Chain) refuses calls
              without one. Protect RPC: a signed transaction CODEX would BLOCK never reaches the
              chain; reads pass through.
            </p>
            <div className="home_code">
              <div>
                <span className="home_m">rpc</span>
                <span>https://rpc.codex.xyz</span>
              </div>
              <button
                type="button"
                aria-label="Copy Protect RPC URL"
                className="border-0 bg-transparent p-1 text-[var(--dim)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => copyText('https://rpc.codex.xyz', 'card-rpc')}
              >
                {copiedKey === 'card-rpc' ? <Check className="h-3.5 w-3.5 text-[var(--ok)]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/agents/allow')}
              >
                ALLOW & Protect RPC <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="gc gc-pad gc-col">
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">After the trade</h3>
              <span className="chip2 chip2-none">
                <i aria-hidden="true" />
                watch
              </span>
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--soft)]">
              Every token approval a wallet still has live, each with a revoke transaction CODEX has
              checked. Webhooks when a watched coin&apos;s verdict turns or its dev or a wallet
              cluster sells, and when a watched wallet gives a new approval.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['wallet_approvals', 'watch_coin', 'watch_wallet'].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-[var(--line)] bg-[var(--s1)] px-2 py-1 font-mono text-[11px] text-[var(--soft)]"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/approvals')}
              >
                Approvals & revoke <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[13px] text-[var(--dim)]">
          In the open:{' '}
          {[
            ['open blocklist', '/blocklist'],
            ['pre-sign record', '/agents/record'],
            ['benchmark', '/benchmark'],
            ['speed & uptime', '/status'],
            ['watch & alerts', '/watch'],
          ].map(([label, path], idx) => (
            <React.Fragment key={path}>
              {idx > 0 && ' · '}
              <button
                type="button"
                className="text-[var(--soft)] underline decoration-[var(--line-2)] hover:text-[var(--ok)] bg-transparent border-0 p-0 cursor-pointer"
                onClick={() => onNavigate(path)}
              >
                {label}
              </button>
            </React.Fragment>
          ))}
        </p>
      </section>

      {/* SECTION: TWO CHECKS, ONE CALL */}
      <section className="home_sec" aria-labelledby="home-two">
        <div className="home_secHead">
          <div>
            <p className="home_secKicker">two checks, one call</p>
            <h2 id="home-two" className="home_h2">
              Who&apos;s behind it. Is it real.
            </h2>
          </div>
        </div>
        <p className="-mt-2 mb-4 max-w-[70ch] text-[14.5px] leading-relaxed text-[var(--soft)]">
          Every answer is facts from the chain and a tally, against / careful / clear. Your agent
          decides.
        </p>

        <div className="home_g2">
          <div className="gc gc-pad gc-col">
            <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">Who&apos;s behind it</h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--soft)]">
              The dev&apos;s full record, wallets that bought or sold in the same block, who funded
              the top holders, and whether the liquidity can be pulled.
            </p>
            <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-3">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--dim)]">
                from recent checks
              </span>
              <p className="m-0 font-mono text-[12.5px] text-[var(--soft)]">
                16 buyers · 5 wallets took 9.1% in the first 3 s
              </p>
              <p className="m-0 font-mono text-[12.5px] text-[var(--soft)]">
                17 wallets took 16% in the first 3 s · 23 flagged wallets bought 21% · dev holds 1%
              </p>
              <p className="m-0 font-mono text-[12.5px] text-[var(--soft)]">
                99 buyers · 32 wallets took 39% in the first 3 s · 39 flagged wallets bought 46%
              </p>
            </div>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/check')}
              >
                Check a coin <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="gc gc-pad gc-col">
            <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">Is the product real</h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--soft)]">
              We quote every claim, then test it ourselves: call its API, MCP and x402, read its
              code, read the chain for burns, buys and payouts.
            </p>
            <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-3">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--dim)]">
                from recent LARP checks
              </span>
              <p className="m-0 font-mono text-[12.5px] text-[var(--soft)]">
                its API at kilncompute.xyz/api/feed answered with data (fields events, stats)
              </p>
              <p className="m-0 font-mono text-[12.5px] text-[var(--soft)]">
                its public code at USBVadik/rhook was last changed 2 days ago
              </p>
              <p className="m-0 font-mono text-[12.5px] text-[var(--soft)]">
                its app called its own API at farmingseason.io, which answered with data made at the
                time of the read (4 fields)
              </p>
            </div>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/larp')}
              >
                LARP check a coin <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT READS & SELF-CHECK RECEIPT */}
      <section className="home_sec" aria-labelledby="home-how">
        <div className="home_secHead">
          <div>
            <p className="home_secKicker">how it reads</p>
            <h2 id="home-how" className="home_h2">
              Chain first. Models second.
            </h2>
          </div>
        </div>

        <div className="home_g2 items-start">
          <div className="gc gc-pad space-y-5">
            <div>
              <h3 className="m-0 text-[16px] font-extrabold text-[var(--ink)]">Read the chain</h3>
              <p className="mt-1 m-0 text-[14px] leading-relaxed text-[var(--soft)]">
                Launch, buyers, holders, funders, liquidity, burns. Every number comes from here.
              </p>
            </div>
            <div className="border-t border-[var(--line)] pt-4">
              <h3 className="m-0 text-[16px] font-extrabold text-[var(--ink)]">Quote the claims</h3>
              <p className="mt-1 m-0 text-[14px] leading-relaxed text-[var(--soft)]">
                Fast reader model lists what the site, post and code say, word for word.
              </p>
            </div>
            <div className="border-t border-[var(--line)] pt-4">
              <h3 className="m-0 text-[16px] font-extrabold text-[var(--ink)]">Test them</h3>
              <p className="mt-1 m-0 text-[14px] leading-relaxed text-[var(--soft)]">
                We call their API, MCP and x402 ourselves and match claims to the chain.
              </p>
            </div>
            <div className="border-t border-[var(--line)] pt-4">
              <h3 className="m-0 text-[16px] font-extrabold text-[var(--ink)]">Second reader</h3>
              <p className="mt-1 m-0 text-[14px] leading-relaxed text-[var(--soft)]">
                Verification reader checks each result. Final model gets the final say on a
                &quot;found&quot;; if it can&apos;t answer, the stricter rule stands.
              </p>
            </div>
            <div className="border-t border-[var(--line)] pt-4">
              <h3 className="m-0 text-[16px] font-extrabold text-[var(--ok)]">
                Facts, not a verdict.
              </h3>
              <p className="mt-1 m-0 text-[14px] leading-relaxed text-[var(--soft)]">
                The models never write a number and never say a coin is safe.
              </p>
            </div>
          </div>

          {/* Right: Self-check receipt */}
          <div className="uledger">
            <p className="m-0 font-mono text-[11.5px] text-[var(--dim)]">
              we pass our own test first
            </p>
            <p className="mt-1 mb-4 text-[14px] text-[var(--soft)]">
              $CODEX, through our own check. Same reads, same rules, no special case. If a part of
              CODEX stops answering, this receipt says so.
            </p>

            <div className="flex flex-wrap items-center gap-3 pb-3">
              <Identicon seed={CODEX_CONTRACT} size={40} />
              <div className="min-w-0">
                <div className="text-[17px] font-extrabold text-[var(--ink)]">
                  {CODEX_SELF_CHECK.symbol}
                </div>
                <div className="font-mono text-[12.5px] text-[var(--dim)]">
                  Robinhood Chain · Pons
                </div>
              </div>
              <span className="chip2 chip2-found ml-auto">
                <i aria-hidden="true" />
                product found
              </span>
            </div>

            <div className="uledger-sec">
              <div className="uledger-ln">
                <span className="uledger-k">contract</span>
                <span className="uledger-dots" aria-hidden="true" />
                <span className="uledger-v">0xff9e…4ed3</span>
              </div>
            </div>

            <div className="uledger-sec">
              <p className="uledger-lab">working parts that answered</p>
              <div className="uledger-ln">
                <span className="uledger-k">API</span>
                <span className="uledger-dots" aria-hidden="true" />
                <span className="uledger-v ok">answered</span>
              </div>
              <div className="uledger-ln">
                <span className="uledger-k">MCP server</span>
                <span className="uledger-dots" aria-hidden="true" />
                <span className="uledger-v ok">28 tools</span>
              </div>
              <div className="uledger-ln">
                <span className="uledger-k">x402</span>
                <span className="uledger-dots" aria-hidden="true" />
                <span className="uledger-v ok">answered</span>
              </div>
              <div className="uledger-ln">
                <span className="uledger-k">Chrome extension</span>
                <span className="uledger-dots" aria-hidden="true" />
                <span className="uledger-v ok">answered</span>
              </div>
            </div>

            <div className="uledger-sec">
              <p className="uledger-lab">on chain</p>
              <div className="uledger-ln">
                <span className="uledger-k">team burns</span>
                <span className="uledger-dots" aria-hidden="true" />
                <span className="uledger-v fig">34</span>
              </div>
              <div className="uledger-ln">
                <span className="uledger-k">burned so far</span>
                <span className="uledger-dots" aria-hidden="true" />
                <span className="uledger-v fig">33.65M $CODEX</span>
              </div>
            </div>

            <div className="uledger-sec">
              <p className="uledger-lab">paid by strangers</p>
              <div className="uledger-ln">
                <span className="uledger-k">x402 payments</span>
                <span className="uledger-dots" aria-hidden="true" />
                <span className="uledger-v fig">3</span>
              </div>
              <div className="uledger-ln">
                <span className="uledger-k">wallets that paid, none ours</span>
                <span className="uledger-dots" aria-hidden="true" />
                <span className="uledger-v fig">2</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line-2)] pt-3 font-mono text-[12px]">
              <span className="text-[var(--dim)]">
                as of Nov 12 · burns 07:46 UTC · x402 07:38 UTC
              </span>
              <span className="font-bold text-[var(--ok)]">FOUND</span>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate(`/check/${CODEX_CONTRACT}`)}
              >
                Read the full $CODEX check <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: THE TRENCHES, BY THE NUMBERS */}
      <section className="home_sec" aria-labelledby="home-numbers">
        <div className="home_secHead">
          <div>
            <p className="home_secKicker">the trenches, by the numbers</p>
            <h2 id="home-numbers" className="home_h2">
              Every launch on Robinhood Chain, read.
            </h2>
          </div>
          <div className="useg" role="tablist" aria-label="Time window">
            <button
              type="button"
              role="tab"
              aria-selected={windowMode === '24h'}
              className="useg-it"
              onClick={() => setWindowMode('24h')}
            >
              24h
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={windowMode === '7d'}
              className="useg-it"
              onClick={() => setWindowMode('7d')}
            >
              7d
            </button>
          </div>
        </div>

        <div className="ustrip">
          <div className="ust ust-lead">
            <b className="ust-v">{trenchMetrics.launches}</b>
            <span className="ust-l">{trenchMetrics.launchesLabel}</span>
          </div>
          <div className="ust">
            <b className="ust-v">{trenchMetrics.graduated}</b>
            <span className="ust-l">graduated · scored in window</span>
          </div>
          <div className="ust">
            <b className="ust-v">{trenchMetrics.checked}</b>
            <span className="ust-l">coins checked</span>
          </div>
          <div className="ust">
            <b className="ust-v">{trenchMetrics.pads}</b>
            <span className="ust-l">launchpads</span>
          </div>
          <div className="ust">
            <b className="ust-v text-[var(--warn)]">{trenchMetrics.dead}</b>
            <span className="ust-l">dead within 24 h</span>
          </div>
        </div>

        <div className="home_numGrid">
          {/* Bar Chart */}
          <div className="gc gc-pad">
            <div className="flex items-center justify-between gap-2">
              <b className="text-[16px] font-extrabold text-[var(--ink)]">Launches per day</b>
              <span className="font-mono text-[11.5px] text-[var(--dim)]">
                {activeBarIdx !== null
                  ? `${DAILY_LAUNCHES[activeBarIdx].label} · ${DAILY_LAUNCHES[activeBarIdx].value.toLocaleString()}`
                  : '30d · hover any bar'}
              </span>
            </div>

            <div className="ubars-wrap mt-3" role="group" aria-label="Launches per day">
              {DAILY_LAUNCHES.map((bar, i) => {
                const hPct = Math.max(4, (bar.value / maxDaily) * 100);
                return (
                  <button
                    key={bar.label}
                    type="button"
                    className={`ubar border-0 p-0 ${bar.old ? 'bar-old' : ''} ${bar.today ? 'bar-today' : ''}`}
                    style={{ '--h': `${hPct.toFixed(1)}%` } as React.CSSProperties}
                    aria-label={`${bar.label} · ${bar.value.toLocaleString()}`}
                    onMouseEnter={() => setActiveBarIdx(i)}
                    onMouseLeave={() => setActiveBarIdx(null)}
                    onFocus={() => setActiveBarIdx(i)}
                    onBlur={() => setActiveBarIdx(null)}
                  >
                    <span className="ubar-tip">
                      {bar.label} · {bar.value.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-[var(--dim)]">
              <span>Oct 15</span>
              <span>Oct 29</span>
              <span>Nov 7</span>
              <span className="text-[var(--ok)]">today</span>
            </div>
          </div>

          {/* LARP Check Breakdown */}
          <div className="gc gc-pad flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <b className="text-[16px] font-extrabold text-[var(--ink)]">Is the product real?</b>
              <span className="font-mono text-[11.5px] text-[var(--dim)]">793 coins · 90d</span>
            </div>
            <p className="mt-2 text-[13.5px] text-[var(--soft)]">
              Most coins claim a product. Few can back it up.
            </p>

            <div className="mt-4 space-y-3">
              {LARP_BREAKDOWN.map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-[12.5px]">
                    <span className="text-[var(--soft)]">{row.label}</span>
                    <span className="font-semibold text-[var(--ink)] fig">
                      {row.count} <span className="text-[var(--dim)]">({row.pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--s1)]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${row.pct}%`, background: row.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-5">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/larp/checked')}
              >
                See every coin checked <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: RECENTLY CHECKED MARQUEE */}
      <section className="home_sec" aria-labelledby="home-recent">
        <div className="home_secHead">
          <div>
            <p className="home_secKicker">recently checked</p>
            <h2 id="home-recent" className="home_h2">
              Coins people asked about
            </h2>
          </div>
        </div>

        <div className="home_mqWrap">
          <div className="home_mqTrack">
            {[...MARQUEE_COINS, ...MARQUEE_COINS].map((coin, idx) => (
              <a
                key={`${coin.address}-${idx}`}
                href={`/check/${coin.address}`}
                className="gc flex w-[285px] sm:w-[310px] shrink-0 flex-col justify-between gap-3 p-4 no-underline hover:border-[var(--ok-line)] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/check/${coin.address}`);
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Identicon seed={coin.address} size={38} />
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-extrabold text-[var(--ink)]">
                        {coin.symbol}
                      </div>
                      <div className="font-mono text-[11.5px] text-[var(--dim)]">{coin.chain}</div>
                    </div>
                  </div>
                  <span className="font-mono text-[11.5px] text-[var(--dim)] shrink-0">
                    {coin.age}
                  </span>
                </div>

                <div>{renderTally(coin)}</div>

                <p className="m-0 line-clamp-2 text-[13px] leading-snug text-[var(--soft)]">
                  {coin.fact}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: THE TRENCHES, LIVE */}
      <section className="home_sec" aria-labelledby="home-live">
        <div className="home_secHead">
          <div>
            <p className="home_secKicker">the trenches, live</p>
            <h2 id="home-live" className="home_h2">
              Read as it happens. <span className="home_accent">3 s behind the chain</span>
            </h2>
          </div>
        </div>

        <div className="gc overflow-hidden">
          {[
            {
              title: 'Terminal',
              desc: 'Every launch and new pool, from every launchpad, with what we found on each.',
              meta: 'live stream',
              path: '/terminal',
              icon: <Terminal className="h-5 w-5 text-[var(--ok)]" />,
            },
            {
              title: 'Launches',
              desc: 'Our read on every coin, filed a few minutes after launch and scored 24 hours later, in public.',
              meta: 'called minutes after launch · scored at 24 h',
              path: '/launches',
              icon: <Rocket className="h-5 w-5 text-[var(--ok)]" />,
            },
            {
              title: 'Dev wall',
              desc: 'Who is launching, how often, and which "devs" are really one funder.',
              meta: '634 wallets, 24 h',
              path: '/devs',
              icon: <Users className="h-5 w-5 text-[var(--ok)]" />,
            },
          ].map((row, idx) => (
            <button
              key={row.path}
              type="button"
              className={`flex w-full items-center gap-4 px-5 py-4 text-left bg-transparent border-0 cursor-pointer hover:bg-[var(--hover)] transition-colors ${
                idx > 0 ? 'border-t border-[var(--line)]' : ''
              }`}
              onClick={() => onNavigate(row.path)}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--line-2)] bg-[var(--s1)]">
                {row.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[16px] font-extrabold text-[var(--ink)]">{row.title}</span>
                  <span className="font-mono text-[11.5px] text-[var(--ok)]">{row.meta}</span>
                </span>
                <span className="mt-0.5 block text-[13.5px] text-[var(--soft)]">{row.desc}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-[var(--dim)]" />
            </button>
          ))}
        </div>
      </section>

      {/* SECTION: EVERYWHERE YOU TRADE */}
      <section className="home_sec" aria-labelledby="home-everywhere">
        <div className="home_secHead">
          <div>
            <p className="home_secKicker">everywhere you trade</p>
            <h2 id="home-everywhere" className="home_h2">
              Same check, wherever you are.
            </h2>
          </div>
        </div>

        <div className="home_g3">
          <div className="gc gc-pad gc-col">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line-2)] bg-[var(--s1)] text-[var(--ok)]">
                <Send className="h-5 w-5" />
              </span>
              <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">Telegram</h3>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--soft)]">
              Paste a coin to @codex_bot, or add it to your group and ask &quot;who&apos;s the dev
              on this?&quot;
            </p>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/docs')}
              >
                Open @codex_bot <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="gc gc-pad gc-col">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line-2)] bg-[var(--s1)] text-[var(--ok)] font-black text-base">
                𝕏
              </span>
              <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">X</h3>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--soft)]">
              Tag <b className="text-[var(--ink)]">{CODEX_X_HANDLE}</b> under any coin. Add{' '}
              <b className="text-[var(--ink)]">larp</b> to check the product, or{' '}
              <b className="text-[var(--ink)]">roast</b> for the less polite version.
            </p>
            <div className="mt-auto pt-4">
              <a
                href={CODEX_X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-extrabold text-[14px] text-[var(--ok)] hover:text-[var(--ok-hi)] no-underline"
              >
                Follow {CODEX_X_HANDLE} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="gc gc-pad gc-col">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line-2)] bg-[var(--s1)] text-[var(--ok)]">
                <Chrome className="h-5 w-5" />
              </span>
              <h3 className="m-0 text-[18px] font-extrabold text-[var(--ink)]">Chrome</h3>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--soft)]">
              The check inside GMGN, DexScreener and Pons, next to the buy button.
            </p>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/agents/plugins')}
              >
                Add the extension <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: LAUNCH ON CODEX. HOLD $CODEX. */}
      <section className="home_sec" aria-labelledby="home-launch">
        <div className="home_secHead">
          <div>
            <p className="home_secKicker">codex</p>
            <h2 id="home-launch" className="home_h2">
              Launch on CODEX. Hold $CODEX.
            </h2>
          </div>
        </div>

        <div className="home_g2">
          {/* Left: Launchpad */}
          <div className="gc gc-pad gc-col">
            <p className="m-0 font-mono text-[12px] text-[var(--dim)]">launchpad · on pons</p>
            <h3 className="mt-1.5 mb-2 text-[20px] font-extrabold text-[var(--ink)]">
              Launch from your own wallet
            </h3>
            <p className="m-0 text-[14px] leading-relaxed text-[var(--soft)]">
              Pick your pair. Tested against the chain before your wallet opens. Creator fees split
              on chain every payout.
            </p>

            <div
              className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-[var(--s1)]"
              role="img"
              aria-label="90% to you, 10% buys back and burns $CODEX"
            >
              <div style={{ width: '90%', background: 'var(--ink)' }} />
              <div style={{ width: '10%', background: 'var(--ok)' }} />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[12px]">
              <span className="text-[var(--soft)]">90% to you</span>
              <span className="text-[var(--ok)] font-semibold">
                10% buys back and burns $CODEX
              </span>
            </div>

            <div className="mt-auto pt-5">
              <button
                type="button"
                className="ubtn ubtn-secondary"
                onClick={() => onNavigate('/launchpad')}
              >
                Launch a coin
              </button>
            </div>
          </div>

          {/* Right: Hold 1M $CODEX */}
          <div className="gc gc-pad gc-col">
            <p className="m-0 font-mono text-[12px] text-[var(--dim)]">hold 1M $CODEX</p>
            <h3 className="mt-1.5 mb-3 text-[20px] font-extrabold text-[var(--ink)]">
              What holders get
            </h3>

            <div className="flex flex-wrap gap-2">
              {[
                'more new coins a day',
                're-read any coin now',
                'AI reader notes',
                "dev's full LARP record",
                'label-change alerts',
                'full holder map',
                'launch free',
              ].map((perk) => (
                <span
                  key={perk}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--s1)] px-2.5 py-1.5 text-[12.5px] font-semibold text-[var(--soft)]"
                >
                  <Check className="h-3.5 w-3.5 text-[var(--ok)]" />
                  {perk}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-2.5 border-t border-[var(--line)] pt-4">
              <b className="text-[32px] font-black leading-none text-[var(--ok)] fig">33.65M</b>
              <span className="font-mono text-[12px] text-[var(--dim)]">
                $CODEX burned so far · as of 07:46 UTC
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="ubtn ubtn-primary"
                onClick={() => onNavigate('/codex')}
              >
                Get $CODEX
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-extrabold text-[14px] text-[var(--ink)] hover:text-[var(--ok)] cursor-pointer"
                onClick={() => onNavigate('/burns')}
              >
                Burns and rewards <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
