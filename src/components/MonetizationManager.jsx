import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { ExternalLink, DollarSign, TrendingUp, Users, Eye } from 'lucide-react';

// ============================================================
// AFFILIATE CONFIGURATION — UPDATE THESE WITH REAL AFFILIATE IDs
// ============================================================
// After signing up for affiliate programs, replace the placeholder
// URLs below with your real affiliate links:
//
// 1. Nootropics Depot (15% commission): https://nootropicsdepot.com/affiliate-program/
// 2. Amazon Associates (1-6%): https://affiliate-program.amazon.com/signup
// 3. iHerb (5-10%): https://www.iherb.com/info/affiliates
// 4. Thorne (10-20%): https://www.thorne.com/affiliate
// 5. Life Extension (6-12%): https://www.lifeextension.com/aff
//
// URL format examples:
//   amazon: 'https://amzn.to/YOUR_REAL_SHORT_LINK'
//   iherb: 'https://www.iherb.com/pr/product-name/12345?rcode=YOUR_CODE'
//   nootropicsdepot: 'https://nootropicsdepot.com/product/?ref=YOUR_REF_ID'
// ============================================================
const AFFILIATE_LINKS = {
  'alpha-gpc': {
    amazon: 'https://amzn.to/3supplement-alpha-gpc',
    iherb: 'https://iherb.co/supplement-alpha-gpc',
    nootropicsdepot: 'https://nootropicsdepot.com/alpha-gpc?ref=nootropicstacker',
    commission: 0.08 // 8% commission rate
  },
  'modafinil': {
    buymodafinilonline: 'https://buymodafinilonline.com/?ref=nootropicstacker',
    commission: 0.15 // 15% commission rate
  },
  'caffeine': {
    amazon: 'https://amzn.to/3supplement-caffeine',
    iherb: 'https://iherb.co/supplement-caffeine',
    commission: 0.06
  },
  'fish-oil': {
    amazon: 'https://amzn.to/3supplement-fish-oil',
    iherb: 'https://iherb.co/supplement-fish-oil',
    nordicnaturals: 'https://nordicnaturals.com/?ref=nootropicstacker',
    commission: 0.10
  },
  'bacopa': {
    amazon: 'https://amzn.to/3supplement-bacopa',
    iherb: 'https://iherb.co/supplement-bacopa',
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
    amazon: 'https://amzn.to/3supplement-theanine',
    iherb: 'https://iherb.co/supplement-theanine',
    nootropicsdepot: 'https://nootropicsdepot.com/l-theanine?ref=nootropicstacker',
    commission: 0.08
  },
  'ashwagandha': {
    amazon: 'https://amzn.to/3supplement-ashwagandha',
    iherb: 'https://iherb.co/supplement-ashwagandha',
    nootropicsdepot: 'https://nootropicsdepot.com/ashwagandha?ref=nootropicstacker',
    commission: 0.08
  },
  // High-volume supplements
  'creatine': {
    amazon: 'https://amzn.to/3supplement-creatine',
    iherb: 'https://iherb.co/supplement-creatine',
    commission: 0.06
  },
  'magnesium': {
    amazon: 'https://amzn.to/3supplement-magnesium',
    iherb: 'https://iherb.co/supplement-magnesium',
    nootropicsdepot: 'https://nootropicsdepot.com/magnesium-glycinate?ref=nootropicstacker',
    commission: 0.08
  },
  'vitamin-d': {
    amazon: 'https://amzn.to/3supplement-vitamin-d',
    iherb: 'https://iherb.co/supplement-vitamin-d',
    commission: 0.06
  },
  'omega3': {
    amazon: 'https://amzn.to/3supplement-omega3',
    iherb: 'https://iherb.co/supplement-omega3',
    commission: 0.08
  },
  'lions-mane': {
    amazon: 'https://amzn.to/3supplement-lions-mane',
    iherb: 'https://iherb.co/supplement-lions-mane',
    nootropicsdepot: 'https://nootropicsdepot.com/lions-mane?ref=nootropicstacker',
    commission: 0.08
  },
  'rhodiola': {
    amazon: 'https://amzn.to/3supplement-rhodiola',
    iherb: 'https://iherb.co/supplement-rhodiola',
    nootropicsdepot: 'https://nootropicsdepot.com/rhodiola-rosea?ref=nootropicstacker',
    commission: 0.08
  },
  // Nootropics (high-value niche)
  'citicoline': {
    amazon: 'https://amzn.to/3supplement-citicoline',
    iherb: 'https://iherb.co/supplement-citicoline',
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
    amazon: 'https://amzn.to/3supplement-cordyceps',
    iherb: 'https://iherb.co/supplement-cordyceps',
    nootropicsdepot: 'https://nootropicsdepot.com/cordyceps?ref=nootropicstacker',
    commission: 0.08
  },
  'reishi': {
    amazon: 'https://amzn.to/3supplement-reishi',
    iherb: 'https://iherb.co/supplement-reishi',
    commission: 0.08
  },
  'panax-ginseng': {
    amazon: 'https://amzn.to/3supplement-ginseng',
    iherb: 'https://iherb.co/supplement-ginseng',
    nootropicsdepot: 'https://nootropicsdepot.com/panax-ginseng?ref=nootropicstacker',
    commission: 0.08
  },
  'mucuna-pruriens': {
    amazon: 'https://amzn.to/3supplement-mucuna',
    iherb: 'https://iherb.co/supplement-mucuna',
    nootropicsdepot: 'https://nootropicsdepot.com/mucuna-pruriens?ref=nootropicstacker',
    commission: 0.08
  },
  'curcumin': {
    amazon: 'https://amzn.to/3supplement-curcumin',
    iherb: 'https://iherb.co/supplement-curcumin',
    commission: 0.08
  },
  'zinc': {
    amazon: 'https://amzn.to/3supplement-zinc',
    iherb: 'https://iherb.co/supplement-zinc',
    commission: 0.06
  },
  'b-complex': {
    amazon: 'https://amzn.to/3supplement-b-complex',
    iherb: 'https://iherb.co/supplement-b-complex',
    commission: 0.06
  },
  'tyrosine': {
    amazon: 'https://amzn.to/3supplement-tyrosine',
    iherb: 'https://iherb.co/supplement-tyrosine',
    nootropicsdepot: 'https://nootropicsdepot.com/l-tyrosine?ref=nootropicstacker',
    commission: 0.08
  },
  'phosphatidylserine': {
    amazon: 'https://amzn.to/3supplement-ps',
    iherb: 'https://iherb.co/supplement-ps',
    nootropicsdepot: 'https://nootropicsdepot.com/phosphatidylserine?ref=nootropicstacker',
    commission: 0.08
  },
  'huperzine-a': {
    amazon: 'https://amzn.to/3supplement-huperzine',
    nootropicsdepot: 'https://nootropicsdepot.com/huperzine-a?ref=nootropicstacker',
    commission: 0.12
  },
  'taurine': {
    amazon: 'https://amzn.to/3supplement-taurine',
    iherb: 'https://iherb.co/supplement-taurine',
    commission: 0.06
  },
  'melatonin': {
    amazon: 'https://amzn.to/3supplement-melatonin',
    iherb: 'https://iherb.co/supplement-melatonin',
    commission: 0.06
  },
  'coq10': {
    amazon: 'https://amzn.to/3supplement-coq10',
    iherb: 'https://iherb.co/supplement-coq10',
    commission: 0.08
  },
  'collagen': {
    amazon: 'https://amzn.to/3supplement-collagen',
    iherb: 'https://iherb.co/supplement-collagen',
    commission: 0.08
  },
  'probiotics': {
    amazon: 'https://amzn.to/3supplement-probiotics',
    iherb: 'https://iherb.co/supplement-probiotics',
    commission: 0.08
  },
  'green-tea-extract': {
    amazon: 'https://amzn.to/3supplement-green-tea',
    iherb: 'https://iherb.co/supplement-green-tea',
    commission: 0.06
  },
  'berberine': {
    amazon: 'https://amzn.to/3supplement-berberine',
    iherb: 'https://iherb.co/supplement-berberine',
    commission: 0.08
  },
  'alpha-lipoic-acid': {
    amazon: 'https://amzn.to/3supplement-ala',
    iherb: 'https://iherb.co/supplement-ala',
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
    amazon: 'https://amzn.to/3supplement-ginkgo',
    iherb: 'https://iherb.co/supplement-ginkgo',
    commission: 0.06
  },
  'vitamin-c': {
    amazon: 'https://amzn.to/3supplement-vitamin-c',
    iherb: 'https://iherb.co/supplement-vitamin-c',
    commission: 0.06
  },
  'mct-oil': {
    amazon: 'https://amzn.to/3supplement-mct-oil',
    iherb: 'https://iherb.co/supplement-mct-oil',
    commission: 0.08
  },
  'spirulina': {
    amazon: 'https://amzn.to/3supplement-spirulina',
    iherb: 'https://iherb.co/supplement-spirulina',
    commission: 0.06
  },
  'resveratrol': {
    amazon: 'https://amzn.to/3supplement-resveratrol',
    iherb: 'https://iherb.co/supplement-resveratrol',
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
                <div className="text-2xl font-bold text-green-600">
                  ${revenueData.totalEarnings.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${revenueData.monthlyEarnings.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {revenueData.clickThroughs}
                </div>
                <div className="text-sm text-gray-600">Click-throughs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {revenueData.conversions}
                </div>
                <div className="text-sm text-gray-600">Conversions</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">Click "Show Earnings" to view revenue data</p>
            </div>
          )}

          {/* Daily Goal Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Daily Goal Progress</span>
              <span className="text-sm text-gray-600">
                ${(revenueData.dailyGoal * getDailyProgress() / 100).toFixed(2)} / ${revenueData.dailyGoal}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
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
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Low Risk - High Frequency</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Supplement affiliate links</li>
                <li>• Amazon Associates</li>
                <li>• iHerb partnerships</li>
                <li>• Nootropics Depot</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Medium Risk - Medium Frequency</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Google AdSense</li>
                <li>• Health-focused ad networks</li>
                <li>• Sponsored content</li>
                <li>• Email newsletter ads</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Higher Risk - Lower Frequency</h4>
              <ul className="text-sm text-purple-700 space-y-1">
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
                  <div key={supplementId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium capitalize">{supplementId.replace('-', ' ')}</span>
                    <div className="flex gap-4 text-sm">
                      <span>{stats.clicks} clicks</span>
                      <span>{stats.conversions} conversions</span>
                      <span className="font-bold text-green-600">${stats.earnings.toFixed(2)}</span>
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
          <p className="text-sm text-gray-600">
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
  
  if (!links) return null;

  const handleClick = (vendor, estimatedPrice = 25) => {
    // Track the click
    const event = new CustomEvent('affiliateClick', {
      detail: { supplementId, vendor, estimatedPrice }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold mb-2 flex items-center gap-2">
        <ExternalLink className="w-4 h-4" />
        Where to Buy {supplementName}
      </h4>
      <div className="flex flex-wrap gap-2">
        {Object.entries(links).map(([vendor, url]) => {
          if (vendor === 'commission') return null;
          
          return (
            <Button
              key={vendor}
              variant="outline"
              size="sm"
              onClick={() => {
                handleClick(vendor);
                window.open(url, '_blank');
              }}
              className="capitalize"
            >
              {vendor === 'nootropicsdepot' ? 'Nootropics Depot' : vendor}
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-gray-600 mt-2">
        * These are affiliate links. We earn a small commission at no extra cost to you.
      </p>
    </div>
  );
}

export { AFFILIATE_LINKS };

