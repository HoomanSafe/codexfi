import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Cpu,
  Database,
  Eye,
  FileText,
  Flame,
  Gauge,
  Gift,
  Globe,
  HelpCircle,
  Home,
  KeyRound,
  Layers,
  Lock,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Rocket,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  CODEX_CONTRACT,
  CODEX_CONTRACT_SHORT,
  CODEX_LAUNCH_WALLET,
  CODEX_LAUNCH_WALLET_SHORT,
  CODEX_LOGO_SRC,
  CODEX_X_HANDLE,
  CODEX_X_URL,
} from '../data/codexData';

interface ShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: Array<{ label: string; path: string; icon: React.ReactNode }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Start',
    items: [{ label: 'Home', path: '/', icon: <Home className="sb-ico" /> }],
  },
  {
    label: 'Agents',
    items: [
      { label: 'Agent #20030', path: '/agents', icon: <Bot className="sb-ico" /> },
      { label: 'Use in your AI (MCP)', path: '/agents/mcp', icon: <Cpu className="sb-ico" /> },
      { label: 'Agent API (x402)', path: '/agents/x402', icon: <KeyRound className="sb-ico" /> },
      { label: 'x402 facilitator', path: '/x402', icon: <Layers className="sb-ico" /> },
      { label: 'Plugins & SDKs', path: '/agents/plugins', icon: <Database className="sb-ico" /> },
      { label: 'Embed the CODEX badge', path: '/agents/embed', icon: <ShieldCheck className="sb-ico" /> },
      { label: 'Agent census', path: '/agents/census', icon: <Users className="sb-ico" /> },
      { label: 'On-chain record (ERC-8470)', path: '/observations', icon: <FileText className="sb-ico" /> },
    ],
  },
  {
    label: 'Safety layer',
    items: [
      { label: 'What CODEX checks', path: '/agents/safety', icon: <Shield className="sb-ico" /> },
      { label: 'ALLOW & Protect RPC', path: '/agents/allow', icon: <Lock className="sb-ico" /> },
      { label: 'Approvals & revoke', path: '/approvals', icon: <CheckCircle2 className="sb-ico" /> },
      { label: 'Watch & alerts', path: '/watch', icon: <Eye className="sb-ico" /> },
      { label: 'Open blocklist', path: '/blocklist', icon: <ShieldAlert className="sb-ico" /> },
      { label: 'Pre-sign record', path: '/agents/record', icon: <FileText className="sb-ico" /> },
      { label: 'Benchmark', path: '/benchmark', icon: <Gauge className="sb-ico" /> },
    ],
  },
  {
    label: 'Check',
    items: [
      { label: 'Check a coin', path: '/check', icon: <Search className="sb-ico" /> },
      { label: 'LARP check', path: '/larp', icon: <AlertTriangle className="sb-ico" /> },
      { label: 'Checked coins', path: '/checked', icon: <CheckCircle2 className="sb-ico" /> },
      { label: 'LARP checked coins', path: '/larp/checked', icon: <Database className="sb-ico" /> },
      { label: 'Privacy check', path: '/privacy-check', icon: <Wallet className="sb-ico" /> },
      { label: 'Markets', path: '/markets', icon: <TrendingUp className="sb-ico" /> },
    ],
  },
  {
    label: 'Trenches',
    items: [
      { label: 'Trade', path: '/trade', icon: <TrendingUp className="sb-ico" /> },
      { label: 'Terminal', path: '/terminal', icon: <Terminal className="sb-ico" /> },
      { label: 'Launches', path: '/launches', icon: <Rocket className="sb-ico" /> },
      { label: 'Dev wall', path: '/devs', icon: <Users className="sb-ico" /> },
      { label: 'Chain', path: '/chain', icon: <Activity className="sb-ico" /> },
    ],
  },
  {
    label: 'Launch',
    items: [
      { label: 'Launchpad', path: '/launchpad', icon: <Rocket className="sb-ico" /> },
      { label: 'Explore', path: '/explore', icon: <Compass className="sb-ico" /> },
    ],
  },
  {
    label: 'CODEX',
    items: [
      { label: '$CODEX, pricing & keys', path: '/codex', icon: <KeyRound className="sb-ico" /> },
      { label: 'Burns', path: '/burns', icon: <Flame className="sb-ico" /> },
      { label: 'Rewards', path: '/rewards', icon: <Gift className="sb-ico" /> },
      { label: 'How it works', path: '/how', icon: <HelpCircle className="sb-ico" /> },
      { label: 'Docs', path: '/docs', icon: <FileText className="sb-ico" /> },
      { label: 'Speed & uptime', path: '/status', icon: <Gauge className="sb-ico" /> },
      { label: 'Roadmap', path: '/roadmap', icon: <Layers className="sb-ico" /> },
    ],
  },
];

export const Shell: React.FC<ShellProps> = ({ currentPath, onNavigate, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pinned, setPinned] = useState<boolean>(() => {
    try {
      return document.documentElement.dataset.sb === 'pin';
    } catch {
      return false;
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [blockNum, setBlockNum] = useState(18492741);
  const [ethPrice] = useState('3,184.20');
  const [gasGwei] = useState('0.01');

  useEffect(() => {
    const id = window.setInterval(() => {
      setBlockNum((b) => b + 1);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '[' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        togglePin();
      }
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pinned]);

  const togglePin = () => {
    const next = !pinned;
    setPinned(next);
    try {
      if (next) {
        document.documentElement.dataset.sb = 'pin';
        localStorage.setItem('codex.sidebar', 'pin');
      } else {
        delete document.documentElement.dataset.sb;
        localStorage.removeItem('codex.sidebar');
      }
    } catch {
      // ignore storage failure
    }
  };

  const handleCopy = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1600);
    } catch {
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1600);
    }
  };

  const go = (path: string) => {
    setDrawerOpen(false);
    onNavigate(path);
  };

  return (
    <>
      <div className="bg-glow" aria-hidden="true" />

      {/* Mobile Top Header */}
      <header className="mb-top">
        <a
          href="/"
          className="sb-brand"
          aria-label="CODEX, home"
          onClick={(e) => {
            e.preventDefault();
            go('/');
          }}
        >
          <img src={CODEX_LOGO_SRC} alt="CODEX logo" width={32} height={32} />
          <span>CODEX</span>
        </a>
        <a
          href="/codex"
          className="mb-get"
          onClick={(e) => {
            e.preventDefault();
            go('/codex');
          }}
        >
          Get $CODEX
        </a>
        <button
          type="button"
          className="mb-menu"
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile Drawer Scrim */}
      {drawerOpen && (
        <div
          className="sb-scrim"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Left Rail / Drawer Sidebar */}
      <aside
        id="sb"
        className={`sb ${drawerOpen ? 'sb-open' : ''}`}
        aria-label="Site navigation"
      >
        <div className="sb-head">
          <a
            href="/"
            className="sb-brand"
            aria-label="CODEX, home"
            onClick={(e) => {
              e.preventDefault();
              go('/');
            }}
          >
            <img src={CODEX_LOGO_SRC} alt="CODEX logo" width={32} height={32} />
            <span className="sb-brand-txt">CODEX</span>
          </a>
          <button
            type="button"
            className="sb-pin"
            aria-pressed={pinned}
            aria-label={pinned ? 'Collapse menu' : 'Keep the menu open'}
            title="Keep the menu open  ["
            onClick={togglePin}
          >
            {pinned ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="sb-close"
            aria-label="Close the menu"
            onClick={() => setDrawerOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="sb-body">
          <nav className="sb-nav" aria-label="Pages">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} role="group" aria-label={group.label}>
                <span className="sb-gh" aria-hidden="true">
                  {group.label}
                </span>
                <div className="sb-grid">
                  {group.items.map((item) => {
                    const active =
                      item.path === '/'
                        ? currentPath === '/'
                        : currentPath === item.path || currentPath.startsWith(item.path + '/');
                    return (
                      <button
                        key={item.path}
                        type="button"
                        className="sb-link"
                        aria-current={active ? 'page' : undefined}
                        onClick={() => go(item.path)}
                      >
                        {item.icon}
                        <span className="sb-label">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="sb-foot">
            <div className="sb-grid">
              <button type="button" className="sb-link" onClick={() => go('/login')}>
                <User className="sb-ico" />
                <span className="sb-label">Sign in</span>
              </button>
              <a
                className="sb-link"
                href={CODEX_X_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CODEX on X (@codex)"
              >
                <Globe className="sb-ico" />
                <span className="sb-label">{CODEX_X_HANDLE}</span>
              </a>
              <button type="button" className="sb-link" onClick={() => go('/docs')}>
                <Send className="sb-ico" />
                <span className="sb-label">Telegram & Chrome</span>
              </button>
            </div>

            <button
              type="button"
              className="sb-ca"
              title={CODEX_CONTRACT}
              aria-label="Copy the $CODEX contract address"
              onClick={() => handleCopy(CODEX_CONTRACT, 'sb-ca')}
            >
              <span>
                <b>$CODEX</b> <code>{CODEX_CONTRACT_SHORT}</code>
              </span>
              <span className="sb-ca-do">
                {copiedId === 'sb-ca' ? 'copied' : 'copy'}
              </span>
            </button>

            <a
              href="/codex"
              className="sb-get"
              onClick={(e) => {
                e.preventDefault();
                go('/codex');
              }}
            >
              <span className="sb-label">Get $CODEX</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mb-tabs" aria-label="Main mobile navigation">
        <button
          type="button"
          aria-current={currentPath === '/' ? 'page' : undefined}
          onClick={() => go('/')}
        >
          <Home className="h-[18px] w-[18px]" />
          <span>Home</span>
        </button>
        <button
          type="button"
          aria-current={currentPath === '/explore' ? 'page' : undefined}
          onClick={() => go('/explore')}
        >
          <Compass className="h-[18px] w-[18px]" />
          <span>Explore</span>
        </button>
        <button
          type="button"
          aria-current={currentPath === '/launchpad' ? 'page' : undefined}
          onClick={() => go('/launchpad')}
        >
          <Rocket className="h-[18px] w-[18px]" />
          <span>Launch</span>
        </button>
        <button
          type="button"
          aria-current={currentPath.startsWith('/check') ? 'page' : undefined}
          onClick={() => go('/check')}
        >
          <Search className="h-[18px] w-[18px]" />
          <span>Check</span>
        </button>
        <button
          type="button"
          aria-current={currentPath === '/login' ? 'page' : undefined}
          onClick={() => go('/login')}
        >
          <User className="h-[18px] w-[18px]" />
          <span>Profile</span>
        </button>
      </nav>

      {/* Main Content Container */}
      <main className="home_main">
        {/* Desktop Top Utility Bar */}
        <nav className="ag-top" aria-label="For agents">
          <button type="button" className="ag-link" onClick={() => go('/x402')}>
            x402 facilitator
          </button>
          <button type="button" className="ag-link" onClick={() => go('/agents/mcp')}>
            MCP
          </button>
          <button type="button" className="ag-link" onClick={() => go('/markets')}>
            Markets
          </button>
          <button type="button" className="ag-link" onClick={() => go('/docs')}>
            skill.md
          </button>
          <button type="button" className="ag-link" onClick={() => go('/agents')}>
            Agent #20030
          </button>
          <button type="button" className="ag-link" onClick={() => go('/agents/census')}>
            Census
          </button>
          <button type="button" className="ag-link" onClick={() => go('/codex')}>
            Pricing
          </button>
          <a
            href={CODEX_X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ag-link"
          >
            X ({CODEX_X_HANDLE})
          </a>
          <button
            type="button"
            className="ag-link ag-ca"
            title={`Copy the $CODEX contract ${CODEX_CONTRACT}`}
            onClick={() => handleCopy(CODEX_CONTRACT, 'top-ca')}
          >
            <span>$CODEX</span>
            <span className="ag-ca-a">
              {copiedId === 'top-ca' ? 'copied!' : CODEX_CONTRACT_SHORT}
            </span>
          </button>
        </nav>

        {children}
      </main>

      {/* Live Chain Strip */}
      <div className="strip" role="region" aria-label="Chain status">
        <span className="strip-dot" aria-hidden="true" />
        <span className="text-[var(--ok)] font-medium">connected</span>
        <span>
          <span className="text-[var(--dim)]">Robinhood Chain</span> · 3 s lag
        </span>
        <span>
          <span className="text-[var(--dim)]">ETH</span>{' '}
          <span className="fig text-[var(--ink)]">${ethPrice}</span>
        </span>
        <span>
          <span className="text-[var(--dim)]">gas</span>{' '}
          <span className="fig text-[var(--ink)]">{gasGwei} gwei</span>
        </span>
        <span>
          <span className="text-[var(--dim)]">block</span>{' '}
          <span className="fig text-[var(--ink)]">#{blockNum.toLocaleString()}</span>
        </span>
        <span className="ml-auto hidden sm:inline text-[var(--dim)]">
          ERC-8004 agent #20030 · CODEX
        </span>
      </div>

      {/* Footer */}
      <footer className="foot">
        <div className="foot-in">
          <div className="space-y-3">
            <a
              href="/"
              className="inline-flex items-center gap-2.5 text-[var(--ink)] no-underline font-black text-xl tracking-tight"
              onClick={(e) => {
                e.preventDefault();
                go('/');
              }}
            >
              <img
                src={CODEX_LOGO_SRC}
                alt="CODEX logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span>CODEX</span>
            </a>
            <p className="text-[13px] leading-relaxed text-[var(--soft)] m-0">
              The safety layer for agentic finance on Robinhood Chain. Coin checks on Robinhood
              Chain. Also a launchpad on Pons. Information only. Nothing here is financial advice,
              and nothing here trades for you.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono text-[var(--dim)]">$CODEX</span>
              <code className="text-xs font-mono text-[var(--ink)]">{CODEX_CONTRACT_SHORT}</code>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-[var(--line-2)] bg-[var(--s1)] px-2.5 py-1 text-[11px] font-mono text-[var(--soft)] hover:text-[var(--ink)] hover:border-[var(--ok-line)] cursor-pointer"
                onClick={() => handleCopy(CODEX_CONTRACT, 'foot-ca')}
              >
                {copiedId === 'foot-ca' ? (
                  <>
                    <Check className="h-3 w-3 text-[var(--ok)]" /> copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> copy
                  </>
                )}
              </button>
            </div>
            <div>
              <button
                type="button"
                className="ubtn ubtn-primary min-h-[38px] px-4 text-xs"
                onClick={() => go('/codex')}
              >
                Get $CODEX
              </button>
            </div>
            <p className="text-[12px] text-[var(--dim)] m-0">
              The only official contract. Anything else is not ours.
            </p>
            <p className="text-[12px] text-[var(--dim)] m-0">
              Our launch wallet:{' '}
              <button
                type="button"
                className="font-mono text-[var(--soft)] underline decoration-[var(--line-2)] hover:text-[var(--ok)] bg-transparent border-0 p-0 cursor-pointer"
                onClick={() => go(`/check/${CODEX_LAUNCH_WALLET}`)}
              >
                {CODEX_LAUNCH_WALLET_SHORT}
              </button>{' '}
              · Trace it like any other dev&apos;s.
            </p>
          </div>

          <nav className="foot-col" aria-label="Agents">
            <span className="foot-k">Agents</span>
            <a href="/agents" onClick={(e) => { e.preventDefault(); go('/agents'); }}>For agents</a>
            <a href="/agents/mcp" onClick={(e) => { e.preventDefault(); go('/agents/mcp'); }}>MCP server</a>
            <a href="/agents/x402" onClick={(e) => { e.preventDefault(); go('/agents/x402'); }}>x402 API</a>
            <a href="/agents/plugins" onClick={(e) => { e.preventDefault(); go('/agents/plugins'); }}>Plugins & SDKs</a>
            <a href="/agents/embed" onClick={(e) => { e.preventDefault(); go('/agents/embed'); }}>Embed the badge</a>
            <a href="/markets" onClick={(e) => { e.preventDefault(); go('/markets'); }}>Markets</a>
            <a href="/x402" onClick={(e) => { e.preventDefault(); go('/x402'); }}>x402 facilitator</a>
            <a href="/agents/census" onClick={(e) => { e.preventDefault(); go('/agents/census'); }}>Agent census</a>
            <a href="/observations" onClick={(e) => { e.preventDefault(); go('/observations'); }}>ERC-8470 record</a>
          </nav>

          <nav className="foot-col" aria-label="Safety layer">
            <span className="foot-k">Safety layer</span>
            <a href="/agents/safety" onClick={(e) => { e.preventDefault(); go('/agents/safety'); }}>What CODEX checks</a>
            <a href="/agents/allow" onClick={(e) => { e.preventDefault(); go('/agents/allow'); }}>ALLOW tickets</a>
            <a href="/agents/allow" onClick={(e) => { e.preventDefault(); go('/agents/allow'); }}>Protect RPC</a>
            <a href="/approvals" onClick={(e) => { e.preventDefault(); go('/approvals'); }}>Approvals & revoke</a>
            <a href="/watch" onClick={(e) => { e.preventDefault(); go('/watch'); }}>Watch & alerts</a>
            <a href="/blocklist" onClick={(e) => { e.preventDefault(); go('/blocklist'); }}>Open blocklist</a>
            <a href="/agents/record" onClick={(e) => { e.preventDefault(); go('/agents/record'); }}>Pre-sign record</a>
            <a href="/benchmark" onClick={(e) => { e.preventDefault(); go('/benchmark'); }}>Benchmark</a>
            <a href="/status" onClick={(e) => { e.preventDefault(); go('/status'); }}>Speed & uptime</a>
          </nav>

          <nav className="foot-col" aria-label="Product">
            <span className="foot-k">Product</span>
            <a href="/check" onClick={(e) => { e.preventDefault(); go('/check'); }}>Check a coin</a>
            <a href="/checked" onClick={(e) => { e.preventDefault(); go('/checked'); }}>Coins checked</a>
            <a href="/larp" onClick={(e) => { e.preventDefault(); go('/larp'); }}>LARP check</a>
            <a href="/larp/checked" onClick={(e) => { e.preventDefault(); go('/larp/checked'); }}>Coins LARP checked</a>
            <a href="/devs" onClick={(e) => { e.preventDefault(); go('/devs'); }}>Dev wall</a>
            <a href="/launchpad" onClick={(e) => { e.preventDefault(); go('/launchpad'); }}>Launchpad</a>
            <a href="/explore" onClick={(e) => { e.preventDefault(); go('/explore'); }}>Explore</a>
            <a href="/burns" onClick={(e) => { e.preventDefault(); go('/burns'); }}>Burns</a>
            <a href="/rewards" onClick={(e) => { e.preventDefault(); go('/rewards'); }}>Rewards</a>
            <a href="/terminal" onClick={(e) => { e.preventDefault(); go('/terminal'); }}>Terminal</a>
          </nav>

          <nav className="foot-col" aria-label="Learn">
            <span className="foot-k">Learn</span>
            <a href="/how" onClick={(e) => { e.preventDefault(); go('/how'); }}>How it works</a>
            <a href="/roadmap" onClick={(e) => { e.preventDefault(); go('/roadmap'); }}>Roadmap</a>
            <a href="/docs" onClick={(e) => { e.preventDefault(); go('/docs'); }}>Docs</a>
            <a href="/codex" onClick={(e) => { e.preventDefault(); go('/codex'); }}>$CODEX & pricing</a>
            <a href="/privacy-check" onClick={(e) => { e.preventDefault(); go('/privacy-check'); }}>Wallet privacy</a>
          </nav>

          <nav className="foot-col" aria-label="Legal">
            <span className="foot-k">Legal</span>
            <a href="/terms" onClick={(e) => { e.preventDefault(); go('/terms'); }}>Terms</a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); go('/privacy'); }}>Privacy</a>
            <a href="/risk" onClick={(e) => { e.preventDefault(); go('/risk'); }}>Risk</a>
          </nav>

          <nav className="foot-col" aria-label="Elsewhere">
            <span className="foot-k">Elsewhere</span>
            <a href={CODEX_X_URL} target="_blank" rel="noopener noreferrer">
              @codex on X
            </a>
            <a href={CODEX_X_URL} target="_blank" rel="noopener noreferrer">
              @codex check bot on X
            </a>
            <a href="/docs" onClick={(e) => { e.preventDefault(); go('/docs'); }}>
              Telegram bot
            </a>
            <a href="/docs" onClick={(e) => { e.preventDefault(); go('/docs'); }}>
              Chrome extension
            </a>
          </nav>
        </div>

        <div className="mx-auto mt-8 flex max-w-[var(--content-max)] flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5 text-xs font-mono text-[var(--dim)]">
          <span>CODEX · ERC-8004 Agent #20030 · Robinhood Chain</span>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/agents/mcp" className="text-[var(--dim)] hover:text-[var(--ok)] no-underline" onClick={(e) => { e.preventDefault(); go('/agents/mcp'); }}>MCP</a>
            <a href="/agents/x402" className="text-[var(--dim)] hover:text-[var(--ok)] no-underline" onClick={(e) => { e.preventDefault(); go('/agents/x402'); }}>x402</a>
            <a href="/agents/plugins" className="text-[var(--dim)] hover:text-[var(--ok)] no-underline" onClick={(e) => { e.preventDefault(); go('/agents/plugins'); }}>SDKs</a>
            <a href={CODEX_X_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--dim)] hover:text-[var(--ok)] no-underline">X (@codex)</a>
          </div>
        </div>
      </footer>
    </>
  );
};
