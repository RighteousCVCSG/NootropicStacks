// Stack analysis and recommendation system
import { supplements, goals } from "../data/supplements.js";

// Define diminishing returns curve parameters
const DIMINISHING_RETURNS_THRESHOLD = 6.0; // Point where effects start to diminish significantly
const DIMINISHING_RETURNS_FACTOR = 0.5; // How much new effects are reduced after threshold
const MAX_EFFECT_CAP = 9.5; // Absolute maximum effect level for any single goal

// Define synergistic bonuses
const SYNERGISTIC_PAIRS = {
  "caffeine": {
    "l-theanine": 0.2 // 20% bonus to focus/energy when combined
  },
  "piracetam": {
    "alpha-gpc": 0.15,
    "citicoline": 0.15
  },
  "bacopa-monnieri": {
    "lions-mane": 0.1
  }
};

// Calculate total effects of a supplement stack with diminishing returns
export function calculateStackEffects(stack) {
  const totalEffects = {
    energy: 0,
    mood: 0,
    balance: 0,
    creativity: 0,
    socialness: 0,
    learning: 0,
    study: 0
  };

  const addedSupplements = new Set(); // To track supplements already processed for synergy

  stack.forEach(stackItem => {
    const supplement = supplements.find(s => s.id === stackItem.supplementId);
    if (supplement) {
      addedSupplements.add(supplement.id);

      // Calculate dosage multiplier (1.0 = recommended dose)
      const avgDose = (supplement.dosage.min + supplement.dosage.max) / 2;
      const dosageMultiplier = stackItem.dosage / avgDose;

      Object.keys(totalEffects).forEach(effect => {
        let effectValue = supplement.effects[effect] || 0;

        // Apply diminishing returns
        if (totalEffects[effect] >= DIMINISHING_RETURNS_THRESHOLD && effectValue > 0) {
          const excess = totalEffects[effect] - DIMINISHING_RETURNS_THRESHOLD;
          // Linear decay: reduce effect contribution based on how far past the threshold
          effectValue *= (1 - (excess / (MAX_EFFECT_CAP - DIMINISHING_RETURNS_THRESHOLD)) * DIMINISHING_RETURNS_FACTOR);
          effectValue = Math.max(0, effectValue); // Ensure effect doesn't become negative
        }

        totalEffects[effect] += effectValue * dosageMultiplier;

        // Apply synergy bonuses after initial addition
        for (const existingId of addedSupplements) {
          if (SYNERGISTIC_PAIRS[existingId] && SYNERGISTIC_PAIRS[existingId][supplement.id]) {
            const bonus = SYNERGISTIC_PAIRS[existingId][supplement.id];
            totalEffects[effect] += (supplement.effects[effect] || 0) * bonus; // Apply bonus to the current supplement's effect
          }
          if (SYNERGISTIC_PAIRS[supplement.id] && SYNERGISTIC_PAIRS[supplement.id][existingId]) {
            const bonus = SYNERGISTIC_PAIRS[supplement.id][existingId];
            const existingSupplement = supplements.find(s => s.id === existingId);
            if (existingSupplement) {
              totalEffects[effect] += (existingSupplement.effects[effect] || 0) * bonus; // Apply bonus to the existing supplement's effect
            }
          }
        }

        // Cap the total effect at MAX_EFFECT_CAP
        totalEffects[effect] = Math.min(totalEffects[effect], MAX_EFFECT_CAP);
      });
    }
  });

  return totalEffects;
}

// Check for dangerous interactions and overdosing
export function analyzeStackSafety(stack) {
  const warnings = [];
  const totalEffects = calculateStackEffects(stack);
  
  // Check for 9.5+ in any category (dangerous levels)
  Object.entries(totalEffects).forEach(([effect, value]) => {
    if (value >= MAX_EFFECT_CAP) {
      warnings.push({
        type: 'overdose',
        severity: 'high',
        message: `Dangerous ${effect} levels (${value.toFixed(1)}/${MAX_EFFECT_CAP}). Risk of adverse effects.`,
        category: effect
      });
    } else if (value >= 8.0) {
      warnings.push({
        type: 'high-dose',
        severity: 'medium',
        message: `High ${effect} levels (${value.toFixed(1)}/${MAX_EFFECT_CAP}). Monitor for side effects.`,
        category: effect
      });
    }
  });

  // Check for specific dangerous combinations
  const supplementIds = stack.map(item => item.supplementId);
  
  // Multiple stimulants warning
  const stimulants = ['caffeine', 'phenylpiracetam', 'modafinil', 'panax-ginseng', 'cordyceps', 'armodafinil'];
  const stimulantCount = supplementIds.filter(id => stimulants.includes(id)).length;
  if (stimulantCount >= 3) {
    warnings.push({
      type: 'interaction',
      severity: 'high',
      message: 'Multiple stimulants detected. Risk of anxiety, jitters, and crash.',
      category: 'energy'
    });
  }

  // Blood thinner interactions
  const bloodThinnerInteractors = ['omega3', 'curcumin', 'resveratrol', 'ginkgo', 'panax-ginseng', 'vinpocetine'];
  const bloodThinnerCount = supplementIds.filter(id => bloodThinnerInteractors.includes(id)).length;
  if (bloodThinnerCount >= 3) {
    warnings.push({
      type: 'interaction',
      severity: 'medium',
      message: 'Multiple supplements that may affect blood clotting. Consult healthcare provider.',
      category: 'safety'
    });
  }

  // Excessive adaptogens
  const adaptogens = ['ashwagandha', 'rhodiola', 'panax-ginseng', 'mucuna-pruriens', 'cordyceps', 'reishi'];
  const adaptogenCount = supplementIds.filter(id => adaptogens.includes(id)).length;
  if (adaptogenCount >= 4) {
    warnings.push({
      type: 'interaction',
      severity: 'medium',
      message: 'Many adaptogens in stack. May cause unpredictable hormone effects.',
      category: 'balance'
    });
  }

  // Sleep disruption warning
  if (totalEffects.energy >= 7 && supplementIds.includes('melatonin')) {
    warnings.push({
      type: 'interaction',
      severity: 'medium',
      message: 'High energy supplements with melatonin may cause sleep disruption.',
      category: 'sleep'
    });
  }

  // Hormone interactions
  const hormoneAffecting = ['dhea', 'ashwagandha', 'mucuna-pruriens'];
  const hormoneCount = supplementIds.filter(id => hormoneAffecting.includes(id)).length;
  if (hormoneCount >= 2) {
    warnings.push({
      type: 'interaction',
      severity: 'medium',
      message: 'Multiple hormone-affecting supplements. Monitor for hormonal imbalances.',
      category: 'hormone'
    });
  }

  return {
    totalEffects,
    warnings,
    safetyScore: calculateSafetyScore(warnings, totalEffects)
  };
}

// Calculate overall safety score (0-100)
function calculateSafetyScore(warnings, totalEffects) {
  let score = 100;
  
  // Deduct points for warnings
  warnings.forEach(warning => {
    switch (warning.severity) {
      case 'high':
        score -= 30;
        break;
      case 'medium':
        score -= 15;
        break;
      case 'low':
        score -= 5;
        break;
    }
  });

  // Deduct points for extreme values
  Object.values(totalEffects).forEach(value => {
    if (Math.abs(value) > 8) {
      score -= 10;
    }
  });

  return Math.max(0, score);
}

// Recommend supplements based on user goals
export function recommendSupplements(currentStack, userGoals, maxRecommendations = 5) {
  const currentSupplementIds = currentStack.map(item => item.supplementId);
  const currentEffects = calculateStackEffects(currentStack);
  
  // Calculate goal priorities (higher weight = more important)
  const goalWeights = {};
  userGoals.forEach((goal, index) => {
    goalWeights[goal] = userGoals.length - index; // First goal gets highest weight
  });

  // Score each supplement not in current stack
  const recommendations = supplements
    .filter(supplement => !currentSupplementIds.includes(supplement.id))
    .map(supplement => {
      let score = 0;
      
      // Score based on how well it matches user goals
      userGoals.forEach(goal => {
        const effectValue = supplement.effects[goal] || 0;
        const currentValue = currentEffects[goal] || 0;
        const weight = goalWeights[goal] || 1;
        
        // Bonus for positive effects in desired areas
        if (effectValue > 0) {
          score += effectValue * weight;
        }
        
        // Bonus for filling gaps (low current values in desired areas)
        if (currentValue < 5 && effectValue > 0) {
          score += (5 - currentValue) * weight * 0.5;
        }
        
        // Penalty for pushing already high values higher
        if (currentValue > DIMINISHING_RETURNS_THRESHOLD && effectValue > 0) {
          score -= effectValue * weight * 0.5; // Increased penalty for adding to high values
        }
      });
      
      // Penalty for potential safety issues
      const testStack = [...currentStack, { supplementId: supplement.id, dosage: (supplement.dosage.min + supplement.dosage.max) / 2 }];
      const safetyAnalysis = analyzeStackSafety(testStack);
      score -= (100 - safetyAnalysis.safetyScore) * 0.1;
      
      return {
        supplement,
        score,
        reasoning: generateRecommendationReasoning(supplement, currentEffects, userGoals)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations);

  return recommendations;
}

// Generate human-readable reasoning for recommendations
function generateRecommendationReasoning(supplement, currentEffects, userGoals) {
  const reasons = [];
  
  userGoals.forEach(goal => {
    const effectValue = supplement.effects[goal] || 0;
    const currentValue = currentEffects[goal] || 0;
    
    if (effectValue > 5) {
      reasons.push(`Strong ${goal} enhancement (+${effectValue})`);
    } else if (effectValue > 2) {
      reasons.push(`Moderate ${goal} support (+${effectValue})`);
    }
    
    if (currentValue < 3 && effectValue > 0) {
      reasons.push(`Fills gap in ${goal} (currently low)`);
    }
  });
  
  // Add category-specific benefits
  if (supplement.category === 'adaptogen') {
    reasons.push('Helps with stress management');
  } else if (supplement.category === 'nootropic') {
    reasons.push('Cognitive enhancement');
  } else if (supplement.category === 'longevity') {
    reasons.push('Anti-aging benefits');
  }
  
  return reasons.slice(0, 3); // Limit to top 3 reasons
}

// Get supplements by category
export function getSupplementsByCategory(category) {
  return supplements.filter(supplement => supplement.category === category);
}

// Search supplements by name or benefits
export function searchSupplements(query) {
  const lowercaseQuery = query.toLowerCase();
  return supplements.filter(supplement => 
    supplement.name.toLowerCase().includes(lowercaseQuery) ||
    supplement.description.toLowerCase().includes(lowercaseQuery) ||
    supplement.benefits.some(benefit => benefit.toLowerCase().includes(lowercaseQuery))
  );
}

// Get supplement by ID
export function getSupplementById(id) {
  return supplements.find(supplement => supplement.id === id);
}

// Calculate optimal dosage based on goals
export function calculateOptimalDosage(supplement, userGoals, currentStack) {
  const baseMin = supplement.dosage.min;
  const baseMax = supplement.dosage.max;
  
  // Start with middle of range
  let optimalDosage = (baseMin + baseMax) / 2;
  
  // Adjust based on how well it matches user goals
  const goalMatch = userGoals.reduce((sum, goal) => {
    return sum + (supplement.effects[goal] || 0);
  }, 0) / userGoals.length;
  
  if (goalMatch > 5) {
    // High goal match - lean toward higher dose
    optimalDosage = baseMin + (baseMax - baseMin) * 0.7;
  } else if (goalMatch < 3) {
    // Low goal match - lean toward lower dose
    optimalDosage = baseMin + (baseMax - baseMin) * 0.3;
  }
  
  // Safety check - reduce if would cause dangerous levels
  const testStack = [...currentStack, { supplementId: supplement.id, dosage: optimalDosage }];
  const safetyAnalysis = analyzeStackSafety(testStack);
  
  if (safetyAnalysis.warnings.some(w => w.severity === 'high')) {
    optimalDosage = baseMin; // Use minimum dose if safety concerns
  }
  
  return Math.round(optimalDosage);
}

