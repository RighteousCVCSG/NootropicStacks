import { AMAZON_TAG } from '@/lib/affiliate.js';

const BANNER_TEXT = `As an Amazon Associate we earn from qualifying purchases.`;

const INLINE_TEXT = (
  <>
    <strong>Affiliate Disclosure:</strong> Some links on this page are affiliate links.
    If you purchase through these links, NootropicStacker may earn a small commission at no extra cost to you.
    We only recommend products we have researched and believe add value. See our{' '}
    <a href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-gray-900 transition-colors">
      full disclosure policy
    </a>{' '}
    for details.
  </>
);

const STACKS_TEXT = (
  <>
    <strong>Affiliate disclosure.</strong> Product links are Amazon affiliate links using our tag{' '}
    <code className="text-xs bg-gray-200 px-1 rounded">{AMAZON_TAG}</code>.
    We earn a small commission at no extra cost to you if you buy through them, which is how
    we keep the research lights on. We do not accept payment from supplement brands.
  </>
);

const COMPARE_TEXT = (
  <>
    * Affiliate links — we earn a small commission at no extra cost to you. We only link to quality-tested sources.
  </>
);

const VARIANT_CONFIG = {
  banner: {
    role: 'note',
    testId: 'affiliate-disclosure',
    className:
      'mb-2 rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-center text-xs leading-snug text-gray-700',
    children: BANNER_TEXT,
  },
  inline: {
    role: 'note',
    testId: 'affiliate-disclosure-inline',
    className:
      'flex items-start gap-3 p-4 mb-6 bg-gray-50 border border-gray-200 rounded-lg text-sm leading-normal text-gray-600',
    children: INLINE_TEXT,
  },
  stacks: {
    role: 'note',
    testId: 'affiliate-disclosure-stacks',
    className:
      'p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 mb-8',
    children: STACKS_TEXT,
  },
  compare: {
    role: 'note',
    testId: 'affiliate-disclosure-compare',
    className:
      'text-xs text-gray-400 text-center',
    children: COMPARE_TEXT,
  },
};

export function AffiliateDisclosureInline() {
  return (
    <span
      role="note"
      aria-label="Affiliate disclosure"
      className="text-xs text-ink-500 italic"
    >
      (we earn a commission, no extra cost to you)
    </span>
  );
}

export default function AffiliateDisclosure({ variant = 'banner' }) {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.banner;

  if (variant === 'inline') {
    return (
      <div role={config.role} aria-label="Affiliate disclosure" data-testid={config.testId} className={config.className}>
        <svg className="w-5 h-5 mt-0.5 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="m-0">{config.children}</p>
      </div>
    );
  }

  return (
    <p role={config.role} aria-label="Affiliate disclosure" data-testid={config.testId} className={config.className}>
      {config.children}
    </p>
  );
}
