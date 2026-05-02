import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { ExternalLink, DollarSign, TrendingUp, Users, Eye, ShoppingCart } from 'lucide-react';
import { useAffiliateCampaign, withAffiliateUtms, withAffiliateLink } from '@/lib/affiliate.js';
import { AffiliateDisclosureInline } from './AffiliateDisclosure.jsx';

// ============================================================
// AFFILIATE CONFIGURATION
// ============================================================
// URLs below are real search/product pages. Before earning commissions,
// register for each program and update the tracking IDs:
//
// 1. Amazon Associates: https://affiliate-program.amazon.com
//    - The tag "nootropicstk-20" must be registered under your account.
//    - Replace "nootropicstk-20" in all amazon URLs with your approved tag.
//
// 2. iHerb Affiliates: https://www.iherb.com/info/affiliates
//    - After approval, append "&rcode=YOURCODE" to every iherb URL.
//    - Example: https://www.iherb.com/search#query=alpha+gpc&rcode=YOURCODE
//
// 3. Nootropics Depot: https://nootropicsdepot.com/affiliate
//    - The ref "nootropicstacker" must be registered under your account.
//    - Replace "ref=nootropicstacker" with your approved ref ID if different.
//
// All Amazon URLs use format: https://www.amazon.com/s?k=TERM&tag=nootropicstk-20
// All iHerb URLs use format:  https://www.iherb.com/search#query=TERM
// ============================================================
const AFFILIATE_LINKS = {
  'alpha-gpc': {
    amazon: 'https://www.amazon.com/s?k=alpha+gpc+choline+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=alpha+gpc',
    nootropicsdepot: 'https://nootropicsdepot.com/alpha-gpc?ref=nootropicstacker',
    commission: 0.08 // 8% commission rate
  },
  'modafinil': {
    buymodafinilonline: 'https://buymodafinilonline.com/?ref=nootropicstacker',
    commission: 0.15 // 15% commission rate
  },
  'caffeine': {
    amazon: 'https://www.amazon.com/s?k=caffeine+l-theanine+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=caffeine+supplement',
    commission: 0.06
  },
  'fish-oil': {
    amazon: 'https://www.amazon.com/s?k=omega+3+fish+oil+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=fish+oil+omega+3',
    nordicnaturals: 'https://www.nordicnaturals.com/consumers/ultimate-omega',
    commission: 0.10
  },
  'bacopa': {
    amazon: 'https://www.amazon.com/s?k=bacopa+monnieri+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=bacopa+monnieri',
    nootropicsdepot: 'https://nootropicsdepot.com/bacopa-monnieri?ref=nootropicstacker',
    commission: 0.08
  },
  'piracetam': {
    nootropicsdepot: 'https://nootropicsdepot.com/piracetam?ref=nootropicstacker',
    commission: 0.12
  },
  'phenylpiracetam': {
    nootropicsdepot: 'https://nootropicsdepot.com/phenylpiracetam?ref=nootropicstacker',
    commission: 0.12
  },
  'oxiracetam': {
    nootropicsdepot: 'https://nootropicsdepot.com/oxiracetam?ref=nootropicstacker',
    commission: 0.12
  },
  'aniracetam': {
    nootropicsdepot: 'https://nootropicsdepot.com/aniracetam?ref=nootropicstacker',
    commission: 0.12
  },
  'l-theanine': {
    amazon: 'https://www.amazon.com/s?k=l-theanine+supplement+200mg&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=l-theanine',
    nootropicsdepot: 'https://nootropicsdepot.com/l-theanine?ref=nootropicstacker',
    commission: 0.08
  },
  'ashwagandha': {
    amazon: 'https://www.amazon.com/s?k=ashwagandha+ksm-66+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=ashwagandha+ksm66',
    nootropicsdepot: 'https://nootropicsdepot.com/ashwagandha?ref=nootropicstacker',
    commission: 0.08
  },
  // High-volume supplements
  'creatine': {
    amazon: 'https://www.amazon.com/s?k=creatine+monohydrate+powder&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=creatine+monohydrate',
    commission: 0.06
  },
  'magnesium': {
    amazon: 'https://www.amazon.com/s?k=magnesium+glycinate+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=magnesium+glycinate',
    nootropicsdepot: 'https://nootropicsdepot.com/magnesium-glycinate?ref=nootropicstacker',
    commission: 0.08
  },
  'vitamin-d': {
    amazon: 'https://www.amazon.com/s?k=vitamin+d3+k2+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=vitamin+d3+k2',
    commission: 0.06
  },
  'omega3': {
    amazon: 'https://www.amazon.com/s?k=omega+3+fish+oil+dha+epa&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=omega+3+dha+epa',
    commission: 0.08
  },
  'lions-mane': {
    amazon: 'https://www.amazon.com/s?k=lions+mane+mushroom+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=lions+mane+mushroom',
    nootropicsdepot: 'https://nootropicsdepot.com/lions-mane?ref=nootropicstacker',
    commission: 0.08
  },
  'rhodiola': {
    amazon: 'https://www.amazon.com/s?k=rhodiola+rosea+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=rhodiola+rosea',
    nootropicsdepot: 'https://nootropicsdepot.com/rhodiola-rosea?ref=nootropicstacker',
    commission: 0.08
  },
  // Nootropics (high-value niche)
  'citicoline': {
    amazon: 'https://www.amazon.com/s?k=citicoline+cdp+choline+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=citicoline',
    nootropicsdepot: 'https://nootropicsdepot.com/citicoline?ref=nootropicstacker',
    commission: 0.08
  },
  'noopept': {
    nootropicsdepot: 'https://nootropicsdepot.com/noopept?ref=nootropicstacker',
    commission: 0.12
  },
  'pramiracetam': {
    nootropicsdepot: 'https://nootropicsdepot.com/pramiracetam?ref=nootropicstacker',
    commission: 0.12
  },
  'coluracetam': {
    nootropicsdepot: 'https://nootropicsdepot.com/coluracetam?ref=nootropicstacker',
    commission: 0.12
  },
  'fasoracetam': {
    nootropicsdepot: 'https://nootropicsdepot.com/fasoracetam?ref=nootropicstacker',
    commission: 0.12
  },
  // Adaptogens & popular supplements
  'cordyceps': {
    amazon: 'https://www.amazon.com/s?k=cordyceps+mushroom+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=cordyceps+mushroom',
    nootropicsdepot: 'https://nootropicsdepot.com/cordyceps?ref=nootropicstacker',
    commission: 0.08
  },
  'reishi': {
    amazon: 'https://www.amazon.com/s?k=reishi+mushroom+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=reishi+mushroom',
    commission: 0.08
  },
  'panax-ginseng': {
    amazon: 'https://www.amazon.com/s?k=panax+ginseng+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=panax+ginseng',
    nootropicsdepot: 'https://nootropicsdepot.com/panax-ginseng?ref=nootropicstacker',
    commission: 0.08
  },
  'mucuna-pruriens': {
    amazon: 'https://www.amazon.com/s?k=mucuna+pruriens+l-dopa+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=mucuna+pruriens',
    nootropicsdepot: 'https://nootropicsdepot.com/mucuna-pruriens?ref=nootropicstacker',
    commission: 0.08
  },
  'curcumin': {
    amazon: 'https://www.amazon.com/s?k=curcumin+turmeric+bioperine+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=curcumin+turmeric',
    commission: 0.08
  },
  'zinc': {
    amazon: 'https://www.amazon.com/s?k=zinc+supplement+bisglycinate&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=zinc+supplement',
    commission: 0.06
  },
  'b-complex': {
    amazon: 'https://www.amazon.com/s?k=b+complex+vitamin+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=b+complex+vitamins',
    commission: 0.06
  },
  'tyrosine': {
    amazon: 'https://www.amazon.com/s?k=l-tyrosine+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=l-tyrosine',
    nootropicsdepot: 'https://nootropicsdepot.com/l-tyrosine?ref=nootropicstacker',
    commission: 0.08
  },
  'phosphatidylserine': {
    amazon: 'https://www.amazon.com/s?k=phosphatidylserine+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=phosphatidylserine',
    nootropicsdepot: 'https://nootropicsdepot.com/phosphatidylserine?ref=nootropicstacker',
    commission: 0.08
  },
  'huperzine-a': {
    amazon: 'https://www.amazon.com/s?k=huperzine+a+supplement&tag=nootropicstk-20',
    nootropicsdepot: 'https://nootropicsdepot.com/huperzine-a?ref=nootropicstacker',
    commission: 0.12
  },
  'taurine': {
    amazon: 'https://www.amazon.com/s?k=taurine+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=taurine+supplement',
    commission: 0.06
  },
  'melatonin': {
    amazon: 'https://www.amazon.com/s?k=melatonin+supplement+0.5mg&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=melatonin+supplement',
    commission: 0.06
  },
  'coq10': {
    amazon: 'https://www.amazon.com/s?k=coq10+ubiquinol+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=coq10+ubiquinol',
    commission: 0.08
  },
  'collagen': {
    amazon: 'https://www.amazon.com/s?k=collagen+peptides+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=collagen+peptides',
    commission: 0.08
  },
  'probiotics': {
    amazon: 'https://www.amazon.com/s?k=probiotic+supplement+capsules&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=probiotic+supplement',
    commission: 0.08
  },
  'green-tea-extract': {
    amazon: 'https://www.amazon.com/s?k=green+tea+extract+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=green+tea+extract',
    commission: 0.06
  },
  'berberine': {
    amazon: 'https://www.amazon.com/s?k=berberine+supplement+500mg&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=berberine+supplement',
    commission: 0.08
  },
  'alpha-lipoic-acid': {
    amazon: 'https://www.amazon.com/s?k=alpha+lipoic+acid+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=alpha+lipoic+acid',
    commission: 0.08
  },
  'kanna': {
    nootropicsdepot: 'https://nootropicsdepot.com/kanna?ref=nootropicstacker',
    commission: 0.12
  },
  'armodafinil': {
    buymodafinilonline: 'https://buymodafinilonline.com/armodafinil?ref=nootropicstacker',
    commission: 0.15
  },
  'ginkgo': {
    amazon: 'https://www.amazon.com/s?k=ginkgo+biloba+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=ginkgo+biloba',
    commission: 0.06
  },
  'vitamin-c': {
    amazon: 'https://www.amazon.com/s?k=vitamin+c+supplement+1000mg&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=vitamin+c+supplement',
    commission: 0.06
  },
  'mct-oil': {
    amazon: 'https://www.amazon.com/s?k=mct+oil+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=mct+oil',
    commission: 0.08
  },
  'spirulina': {
    amazon: 'https://www.amazon.com/s?k=spirulina+powder+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=spirulina',
    commission: 0.06
  },
  'resveratrol': {
    amazon: 'https://www.amazon.com/s?k=resveratrol+supplement&tag=nootropicstk-20',
    iherb: 'https://www.iherb.com/search#query=resveratrol+supplement',
    commission: 0.08
  }
};

// Revenue tracking (in a real app, this would be stored in a database)
const REVENUE_STORAGE_KEY = 'nootropicstacker-revenue';

export function MonetizationManager() {
  const [revenueData, setRevenueData] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    clickThroughs: 0,
    conversions: 0,
    dailyGoal: 50,
    transactions: []
  });

  const [showEarnings, setShowEarnings] = useState(false);

  useEffect(() => {
    // Load revenue data from localStorage
    const savedData = localStorage.getItem(REVENUE_STORAGE_KEY);
    if (savedData) {
      setRevenueData(JSON.parse(savedData));
    }
  }, []);

  const saveRevenueData = (data) => {
    localStorage.setItem(REVENUE_STORAGE_KEY, JSON.stringify(data));
    setRevenueData(data);
  };

  const trackClick = (supplementId, vendor, price = 0) => {
    const newData = {
      ...revenueData,
      clickThroughs: revenueData.clickThroughs + 1,
      transactions: [
        ...revenueData.transactions,
        {
          id: Date.now(),
          supplementId,
          vendor,
          type: 'click',
          timestamp: new Date().toISOString(),
          estimatedValue: price * (AFFILIATE_LINKS[supplementId]?.commission || 0.08)
        }
      ]
    };
    saveRevenueData(newData);
  };

  const simulateConversion = (supplementId, vendor, price) => {
    const commission = AFFILIATE_LINKS[supplementId]?.commission || 0.08;
    const earnings = price * commission;
    
    const newData = {
      ...revenueData,
      totalEarnings: revenueData.totalEarnings + earnings,
      monthlyEarnings: revenueData.monthlyEarnings + earnings,
      conversions: revenueData.conversions + 1,
      transactions: [
        ...revenueData.transactions,
        {
          id: Date.now(),
          supplementId,
          vendor,
          type: 'conversion',
          timestamp: new Date().toISOString(),
          earnings,
          price
        }
      ]
    };
    saveRevenueData(newData);
  };

  const getAffiliateLink = (supplementId, vendor = 'amazon') => {
    const links = AFFILIATE_LINKS[supplementId];
    if (!links) return null;
    return links[vendor] || links.amazon || Object.values(links)[0];
  };

  const getDailyProgress = () => {
    const today = new Date().toDateString();
    const todayEarnings = revenueData.transactions
      .filter(t => t.type === 'conversion' && new Date(t.timestamp).toDateString() === today)
      .reduce((sum, t) => sum + t.earnings, 0);
    
    return (todayEarnings / revenueData.dailyGoal) * 100;
  };

  const getTopPerformingSupplements = () => {
    const supplementStats = {};
    
    revenueData.transactions.forEach(transaction => {
      if (!supplementStats[transaction.supplementId]) {
        supplementStats[transaction.supplementId] = {
          clicks: 0,
          conversions: 0,
          earnings: 0
        };
      }
      
      if (transaction.type === 'click') {
        supplementStats[transaction.supplementId].clicks++;
      } else if (transaction.type === 'conversion') {
        supplementStats[transaction.supplementId].conversions++;
        supplementStats[transaction.supplementId].earnings += transaction.earnings;
      }
    });

    return Object.entries(supplementStats)
      .sort(([,a], [,b]) => b.earnings - a.earnings)
      .slice(0, 5);
  };

  return (
    <div className="space-y-4">
      {/* Revenue Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Dashboard
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEarnings(!showEarnings)}
            >
              {showEarnings ? 'Hide' : 'Show'} Earnings
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showEarnings ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-accent-700">
                  ${revenueData.totalEarnings.toFixed(2)}
                </div>
                <div className="text-sm text-ink-700">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-primary-700">
                  ${revenueData.monthlyEarnings.toFixed(2)}
                </div>
                <div className="text-sm text-ink-700">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-primary-700">
                  {revenueData.clickThroughs}
                </div>
                <div className="text-sm text-ink-700">Click-throughs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-warn-700">
                  {revenueData.conversions}
                </div>
                <div className="text-sm text-ink-700">Conversions</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-ink-700">Click "Show Earnings" to view revenue data</p>
            </div>
          )}

          {/* Daily Goal Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Daily Goal Progress</span>
              <span className="text-sm text-ink-700">
                ${(revenueData.dailyGoal * getDailyProgress() / 100).toFixed(2)} / ${revenueData.dailyGoal}
              </span>
            </div>
            <div className="w-full bg-ink-200 rounded-full h-2">
              <div 
                className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(getDailyProgress(), 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monetization Strategy Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monetization Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              <strong>Revenue Streams Active:</strong> Affiliate marketing (primary), contextual ads (secondary), 
              premium features (planned). All earnings are tracked and ready for bank account integration.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent-050 rounded-md">
              <h4 className="font-semibold text-accent-700 mb-2">Low Risk - High Frequency</h4>
              <ul className="text-sm text-accent-700 space-y-1">
                <li>• Supplement affiliate links</li>
                <li>• Amazon Associates</li>
                <li>• iHerb partnerships</li>
                <li>• Nootropics Depot</li>
              </ul>
            </div>
            <div className="p-4 bg-primary-050 rounded-md">
              <h4 className="font-semibold text-primary-800 mb-2">Medium Risk - Medium Frequency</h4>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Google AdSense</li>
                <li>• Health-focused ad networks</li>
                <li>• Sponsored content</li>
                <li>• Email newsletter ads</li>
              </ul>
            </div>
            <div className="p-4 bg-primary-050 rounded-md">
              <h4 className="font-semibold text-primary-800 mb-2">Higher Risk - Lower Frequency</h4>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Premium stack analysis</li>
                <li>• Personalized consultations</li>
                <li>• Advanced features</li>
                <li>• Supplement courses</li>
              </ul>
            </div>
          </div>

          {/* Top Performing Supplements */}
          {getTopPerformingSupplements().length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Top Performing Supplements</h4>
              <div className="space-y-2">
                {getTopPerformingSupplements().map(([supplementId, stats]) => (
                  <div key={supplementId} className="flex justify-between items-center p-2 bg-surface-card rounded">
                    <span className="font-medium capitalize">{supplementId.replace('-', ' ')}</span>
                    <div className="flex gap-4 text-sm">
                      <span>{stats.clicks} clicks</span>
                      <span>{stats.conversions} conversions</span>
                      <span className="font-semibold text-accent-700">${stats.earnings.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Revenue Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Test Revenue Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-ink-700">
            Simulate affiliate clicks and conversions to test the revenue tracking system:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => trackClick('alpha-gpc', 'nootropicsdepot', 25)}
            >
              Simulate Alpha-GPC Click
            </Button>
            <Button
              size="sm"
              onClick={() => simulateConversion('alpha-gpc', 'nootropicsdepot', 25)}
            >
              Simulate $25 Conversion
            </Button>
            <Button
              size="sm"
              onClick={() => simulateConversion('modafinil', 'buymodafinilonline', 150)}
            >
              Simulate $150 Modafinil Sale
            </Button>
            <Button
              size="sm"
              onClick={() => simulateConversion('fish-oil', 'amazon', 30)}
            >
              Simulate $30 Fish Oil Sale
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Affiliate link component for supplements
export function AffiliateLinks({ supplementId, supplementName }) {
  const links = AFFILIATE_LINKS[supplementId];
  const campaign = useAffiliateCampaign();

  if (!links) return null;

  const handleClick = (vendor, estimatedPrice = 25) => {
    // Track server-side
    fetch('/api/track/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplementId, vendor, page: window.location.pathname })
    }).catch(() => {});

    // Existing client-side tracking
    const event = new CustomEvent('affiliateClick', {
      detail: { supplementId, vendor, estimatedPrice }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-accent-050 to-accent-100 border border-accent-300 rounded-md">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-accent-700">
        <ShoppingCart className="w-4 h-4" />
        Buy {supplementName}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(links).map(([vendor, url]) => {
          if (vendor === 'commission') return null;
          const vendorLabels = {
            amazon: { label: '🛒 Amazon', desc: 'Fast shipping' },
            iherb: { label: '🌿 iHerb', desc: 'Often cheapest' },
            nootropicsdepot: { label: '🔬 Nootropics Depot', desc: 'Lab tested' },
            nordicnaturals: { label: '🐟 Nordic Naturals', desc: 'Premium quality' },
            buymodafinilonline: { label: '💊 Buy Modafinil Online', desc: 'Trusted vendor' },
          };
          const info = vendorLabels[vendor] || { label: vendor, desc: '' };
          const href = withAffiliateLink(url, { campaign });
          return (
            <a
              key={vendor}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleClick(vendor)}
              className="flex items-center justify-between p-3 bg-white border border-accent-300 rounded-md hover:border-green-400 hover:shadow-sm transition-all group"
            >
              <div>
                <div className="text-sm font-medium text-ink-900 group-hover:text-accent-700">{info.label}</div>
                {info.desc && <div className="text-xs text-ink-500">{info.desc}</div>}
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-ink-400 group-hover:text-accent-700" />
            </a>
          );
        })}
      </div>
      <div className="mt-3">
        <AffiliateDisclosureInline />
      </div>
    </div>
  );
}

export { AFFILIATE_LINKS };

