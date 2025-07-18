import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { X, ExternalLink } from 'lucide-react';

// Contextual ads based on supplement categories and user goals
const CONTEXTUAL_ADS = {
  nootropics: [
    {
      id: 'nootropics-depot-1',
      title: 'Premium Nootropics - Lab Tested',
      description: 'Third-party tested racetams, modafinil alternatives, and cognitive enhancers. Free shipping over $50.',
      url: 'https://nootropicsdepot.com/?ref=supplement-stacker',
      image: '/ads/nootropics-depot.jpg',
      cpc: 2.50,
      category: 'nootropic'
    },
    {
      id: 'mind-nutrition-1',
      title: 'Natural Cognitive Enhancers',
      description: 'Bacopa, Lion\'s Mane, and other natural nootropics. Organic and sustainably sourced.',
      url: 'https://mindnutrition.com/?ref=supplement-stacker',
      image: '/ads/mind-nutrition.jpg',
      cpc: 1.80,
      category: 'nootropic'
    }
  ],
  energy: [
    {
      id: 'athletic-greens-1',
      title: 'AG1 - All-in-One Nutrition',
      description: 'Comprehensive daily nutrition with 75 vitamins, minerals, and whole food ingredients.',
      url: 'https://athleticgreens.com/?ref=supplement-stacker',
      image: '/ads/athletic-greens.jpg',
      cpc: 3.20,
      category: 'energy'
    },
    {
      id: 'four-sigmatic-1',
      title: 'Mushroom Coffee & Adaptogens',
      description: 'Lion\'s Mane coffee, Cordyceps elixirs, and adaptogenic blends for sustained energy.',
      url: 'https://foursigmatic.com/?ref=supplement-stacker',
      image: '/ads/four-sigmatic.jpg',
      cpc: 2.10,
      category: 'adaptogen'
    }
  ],
  health: [
    {
      id: 'thorne-1',
      title: 'Thorne Health - Practitioner Grade',
      description: 'NSF certified supplements trusted by healthcare professionals. Personalized recommendations.',
      url: 'https://thorne.com/?ref=supplement-stacker',
      image: '/ads/thorne.jpg',
      cpc: 2.80,
      category: 'health'
    },
    {
      id: 'life-extension-1',
      title: 'Life Extension - Science-Based',
      description: 'Research-backed longevity supplements. Over 40 years of innovation in healthy aging.',
      url: 'https://lifeextension.com/?ref=supplement-stacker',
      image: '/ads/life-extension.jpg',
      cpc: 2.40,
      category: 'longevity'
    }
  ]
};

// Google AdSense placeholder component
export function GoogleAdSense({ slot, format = 'auto', responsive = true }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.log('AdSense not loaded');
    }
  }, []);

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR-ADSENSE-ID"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

// Contextual ad component
export function ContextualAd({ category, userGoals = [], position = 'sidebar' }) {
  const [currentAd, setCurrentAd] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [impressionTracked, setImpressionTracked] = useState(false);

  useEffect(() => {
    // Select appropriate ad based on category and user goals
    let relevantAds = [];
    
    if (category && CONTEXTUAL_ADS[category]) {
      relevantAds = [...CONTEXTUAL_ADS[category]];
    }
    
    // Add ads based on user goals
    userGoals.forEach(goal => {
      if (goal === 'energy' && CONTEXTUAL_ADS.energy) {
        relevantAds = [...relevantAds, ...CONTEXTUAL_ADS.energy];
      }
      if ((goal === 'learning' || goal === 'study') && CONTEXTUAL_ADS.nootropics) {
        relevantAds = [...relevantAds, ...CONTEXTUAL_ADS.nootropics];
      }
    });

    // Fallback to health ads if no specific category
    if (relevantAds.length === 0) {
      relevantAds = CONTEXTUAL_ADS.health;
    }

    // Select random ad from relevant ads
    if (relevantAds.length > 0) {
      const randomAd = relevantAds[Math.floor(Math.random() * relevantAds.length)];
      setCurrentAd(randomAd);
    }
  }, [category, userGoals]);

  useEffect(() => {
    // Track impression after 1 second of visibility
    if (currentAd && isVisible && !impressionTracked) {
      const timer = setTimeout(() => {
        trackImpression(currentAd);
        setImpressionTracked(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentAd, isVisible, impressionTracked]);

  const trackImpression = (ad) => {
    // Track ad impression
    const event = new CustomEvent('adImpression', {
      detail: { 
        adId: ad.id, 
        category: ad.category, 
        position,
        estimatedRevenue: ad.cpc * 0.1 // Estimated impression value
      }
    });
    window.dispatchEvent(event);
  };

  const trackClick = (ad) => {
    // Track ad click
    const event = new CustomEvent('adClick', {
      detail: { 
        adId: ad.id, 
        category: ad.category, 
        position,
        revenue: ad.cpc
      }
    });
    window.dispatchEvent(event);
  };

  const handleAdClick = () => {
    if (currentAd) {
      trackClick(currentAd);
      window.open(currentAd.url, '_blank');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentAd || !isVisible) {
    return null;
  }

  const isCompact = position === 'inline' || position === 'mobile';

  return (
    <Card className={`relative ${isCompact ? 'mb-4' : 'mb-6'} border-blue-200 bg-blue-50`}>
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          Sponsored
        </Badge>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <CardContent className={`${isCompact ? 'p-4' : 'p-6'} pt-8`}>
        <div 
          className="cursor-pointer"
          onClick={handleAdClick}
        >
          <div className={`flex ${isCompact ? 'flex-row gap-4' : 'flex-col'}`}>
            {currentAd.image && (
              <div className={`${isCompact ? 'w-16 h-16' : 'w-full h-32'} bg-gray-200 rounded-lg mb-3 flex items-center justify-center`}>
                <span className="text-gray-500 text-sm">Ad Image</span>
              </div>
            )}
            
            <div className="flex-1">
              <h3 className={`font-semibold text-blue-900 mb-2 ${isCompact ? 'text-sm' : 'text-lg'}`}>
                {currentAd.title}
              </h3>
              <p className={`text-blue-700 mb-3 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {currentAd.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {currentAd.category}
                </Badge>
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Ad revenue tracking component
export function AdRevenueTracker() {
  const [adRevenue, setAdRevenue] = useState({
    totalImpressions: 0,
    totalClicks: 0,
    totalRevenue: 0,
    dailyRevenue: 0,
    ctr: 0
  });

  useEffect(() => {
    const handleAdImpression = (event) => {
      const { estimatedRevenue } = event.detail;
      setAdRevenue(prev => ({
        ...prev,
        totalImpressions: prev.totalImpressions + 1,
        totalRevenue: prev.totalRevenue + estimatedRevenue,
        dailyRevenue: prev.dailyRevenue + estimatedRevenue,
        ctr: prev.totalClicks / (prev.totalImpressions + 1) * 100
      }));
    };

    const handleAdClick = (event) => {
      const { revenue } = event.detail;
      setAdRevenue(prev => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
        totalRevenue: prev.totalRevenue + revenue,
        dailyRevenue: prev.dailyRevenue + revenue,
        ctr: (prev.totalClicks + 1) / prev.totalImpressions * 100
      }));
    };

    window.addEventListener('adImpression', handleAdImpression);
    window.addEventListener('adClick', handleAdClick);

    return () => {
      window.removeEventListener('adImpression', handleAdImpression);
      window.removeEventListener('adClick', handleAdClick);
    };
  }, []);

  return adRevenue;
}

// Smart ad placement component
export function SmartAdPlacement({ supplements, userGoals, stackSize }) {
  // Determine optimal ad placement based on user behavior
  const shouldShowAd = () => {
    // Show ads after user has engaged with the tool
    if (stackSize >= 2) return true;
    if (supplements.length > 5) return true;
    return Math.random() > 0.7; // 30% chance for new users
  };

  const getAdCategory = () => {
    if (userGoals.includes('energy')) return 'energy';
    if (userGoals.includes('learning') || userGoals.includes('study')) return 'nootropics';
    return 'health';
  };

  if (!shouldShowAd()) return null;

  return (
    <ContextualAd 
      category={getAdCategory()} 
      userGoals={userGoals}
      position="smart"
    />
  );
}

export { CONTEXTUAL_ADS };

