// Stack analysis and recommendation system
import { supplements, goals } from "../data/supplements.js";
import { INTERACTION_TYPES, getInteraction, getStackInteractions } from "../data/interactions.js";
import { MECHANISM_GROUPS, countByMechanismGroup } from "../data/mechanismGroups.js";

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

// ============================================================
// STACK SCORE SYSTEM
// ============================================================

const GRADE_MAP = [
  { min: 90, grade: 'A', label: 'Optimized' },
  { min: 80, grade: 'B', label: 'Strong' },
  { min: 70, grade: 'C', label: 'Good' },
  { min: 60, grade: 'D', label: 'Needs Work' },
  { min: 0, grade: 'F', label: 'Unbalanced' },
];

function getGrade(score) {
  for (const entry of GRADE_MAP) {
    if (score >= entry.min) return entry;
  }
  return GRADE_MAP[GRADE_MAP.length - 1];
}

// --- Synergy sub-score (0-25) ---
function calculateSynergyScore(supplementIds) {
  if (supplementIds.length < 2) return { score: 0, interactions: [], details: 'Add at least 2 supplements to see synergy' };

  const interactions = getStackInteractions(supplementIds);
  let rawScore = 0;
  interactions.forEach(({ type }) => {
    const t = INTERACTION_TYPES[type.toUpperCase()];
    if (t) rawScore += t.score;
  });

  // Normalize: max possible score scales with pair count, but cap at 25
  const pairCount = (supplementIds.length * (supplementIds.length - 1)) / 2;
  // Best case: all pairs synergistic (+3 each)
  const maxPossible = pairCount * 3;
  const normalized = maxPossible > 0 ? Math.max(0, Math.min(25, (rawScore / maxPossible) * 25)) : 0;

  return {
    score: Math.round(normalized * 10) / 10,
    interactions,
    rawScore,
    details: interactions.length === 0
      ? 'No known interactions between these supplements'
      : `${interactions.filter(i => i.type === 'synergistic').length} synergistic, ${interactions.filter(i => i.type === 'redundant' || i.type === 'conflicting').length} problematic`
  };
}

// --- Coverage sub-score (0-25) ---
function calculateCoverageScore(stack, userGoals) {
  if (userGoals.length === 0 || stack.length === 0) return { score: 0, goalCoverage: {}, details: 'Set goals and add supplements' };

  const effects = calculateStackEffects(stack);
  const goalCoverage = {};
  let goalsMet = 0;
  let strongCoverage = 0;

  userGoals.forEach(goal => {
    const value = effects[goal] || 0;
    goalCoverage[goal] = value;
    if (value > 4) {
      goalsMet++;
      if (value > 6) strongCoverage++;
    }
  });

  let score = (goalsMet / userGoals.length) * 25;
  // Bonus for strong coverage across all goals
  if (strongCoverage === userGoals.length && userGoals.length > 0) {
    score = Math.min(25, score + 2);
  }

  return {
    score: Math.round(score * 10) / 10,
    goalCoverage,
    goalsMet,
    totalGoals: userGoals.length,
    details: `${goalsMet}/${userGoals.length} goals covered`
  };
}

// --- Balance sub-score (0-25) ---
function calculateBalanceScore(supplementIds, stack) {
  if (supplementIds.length === 0) return { score: 0, penalties: [], details: 'Add supplements' };

  let score = 25;
  const penalties = [];
  const effects = calculateStackEffects(stack);

  // Category stacking penalty
  const groupCounts = countByMechanismGroup(supplementIds);
  for (const [groupId, { label, count }] of Object.entries(groupCounts)) {
    if (count >= 4) {
      score -= 6;
      penalties.push(`${count} ${label} — significant overlap`);
    } else if (count === 3) {
      score -= 3;
      penalties.push(`3 ${label} — some redundancy`);
    }
  }

  // Effect ceiling penalty
  Object.entries(effects).forEach(([effect, value]) => {
    if (value > 9.0) {
      score -= 4;
      penalties.push(`${effect} at ${value.toFixed(1)} — overkill`);
    } else if (value > 8.0) {
      score -= 2;
      penalties.push(`${effect} at ${value.toFixed(1)} — running hot`);
    }
  });

  // Opposing force penalty
  if (effects.energy > 7) {
    const sleepIds = MECHANISM_GROUPS.sleepAids.supplements;
    const hasSleepSupps = supplementIds.some(id => sleepIds.includes(id));
    if (hasSleepSupps) {
      score -= 4;
      penalties.push('High energy + sleep aids — working against each other');
    }
  }

  return {
    score: Math.max(0, Math.round(score * 10) / 10),
    penalties,
    groupCounts,
    details: penalties.length === 0 ? 'Well-balanced stack' : `${penalties.length} balance issue${penalties.length > 1 ? 's' : ''}`
  };
}

// --- Efficiency sub-score (0-25) ---
function calculateEfficiencyScore(supplementIds, stack, userGoals) {
  if (supplementIds.length === 0) return { score: 0, details: 'Add supplements' };

  const count = supplementIds.length;
  let score;
  if (count <= 3) score = 25;
  else if (count <= 6) score = 20;
  else if (count <= 9) score = 15;
  else if (count <= 12) score = 10;
  else score = 5;

  // Check if each supplement contributes to at least one goal
  let deadWeight = 0;
  if (userGoals.length > 0) {
    supplementIds.forEach(id => {
      const supp = supplements.find(s => s.id === id);
      if (supp) {
        const contributesToGoal = userGoals.some(goal => (supp.effects[goal] || 0) > 2);
        if (!contributesToGoal) deadWeight++;
      }
    });

    if (deadWeight === 0 && count > 0) {
      score = Math.min(25, score + 5);
    } else {
      score -= deadWeight * 3;
    }
  }

  return {
    score: Math.max(0, Math.round(score * 10) / 10),
    deadWeight,
    supplementCount: count,
    details: deadWeight > 0 ? `${deadWeight} supplement${deadWeight > 1 ? 's' : ''} not aligned with your goals` : 'Every supplement earns its spot'
  };
}

// --- Optimization tips ---
function generateTip(synergy, coverage, balance, efficiency, supplementIds, userGoals) {
  // Find the weakest sub-score and give a targeted tip
  const scores = [
    { name: 'synergy', score: synergy.score, max: 25 },
    { name: 'coverage', score: coverage.score, max: 25 },
    { name: 'balance', score: balance.score, max: 25 },
    { name: 'efficiency', score: efficiency.score, max: 25 },
  ];
  scores.sort((a, b) => (a.score / a.max) - (b.score / b.max));
  const weakest = scores[0];

  if (supplementIds.length === 0) return 'Add supplements to start building your stack score';
  if (supplementIds.length === 1) return 'Add a second supplement to unlock synergy scoring';

  // Check for specific actionable tips
  const hasRacetam = supplementIds.some(id => MECHANISM_GROUPS.racetams.supplements.includes(id));
  const hasCholine = supplementIds.some(id => MECHANISM_GROUPS.cholinergics.supplements.includes(id));
  if (hasRacetam && !hasCholine) {
    return 'Adding a choline source (Alpha-GPC or Citicoline) would boost synergy with your racetam';
  }

  if (weakest.name === 'balance' && balance.penalties.length > 0) {
    return balance.penalties[0];
  }
  if (weakest.name === 'coverage' && coverage.goalsMet < coverage.totalGoals) {
    const uncovered = userGoals.filter(g => (coverage.goalCoverage[g] || 0) <= 4);
    if (uncovered.length > 0) return `Your ${uncovered[0]} goal needs more support`;
  }
  if (weakest.name === 'efficiency' && efficiency.deadWeight > 0) {
    return `${efficiency.deadWeight} supplement${efficiency.deadWeight > 1 ? 's' : ''} not contributing to your goals — consider swapping`;
  }
  if (weakest.name === 'synergy') {
    const conflicts = synergy.interactions.filter(i => i.type === 'conflicting');
    if (conflicts.length > 0) return `${conflicts[0].supplements.join(' + ')} are working against each other`;
    const redundant = synergy.interactions.filter(i => i.type === 'redundant');
    if (redundant.length > 0) return `${redundant[0].supplements.join(' + ')} overlap — one would do`;
  }

  // Generic positive feedback
  const total = synergy.score + coverage.score + balance.score + efficiency.score;
  if (total >= 80) return 'Solid stack — well-balanced across your goals';
  if (total >= 60) return 'Good foundation — check sub-scores for optimization ideas';
  return 'Keep refining — small changes can make a big difference';
}

// === MAIN: Calculate full Stack Score ===
export function calculateStackScore(stack, userGoals) {
  const supplementIds = stack.map(item => item.supplementId);

  const synergy = calculateSynergyScore(supplementIds);
  const coverage = calculateCoverageScore(stack, userGoals);
  const balance = calculateBalanceScore(supplementIds, stack);
  const efficiency = calculateEfficiencyScore(supplementIds, stack, userGoals);

  const total = Math.round(synergy.score + coverage.score + balance.score + efficiency.score);
  const gradeInfo = getGrade(total);
  const tip = generateTip(synergy, coverage, balance, efficiency, supplementIds, userGoals);

  return {
    total,
    grade: gradeInfo.grade,
    gradeLabel: gradeInfo.label,
    synergy,
    coverage,
    balance,
    efficiency,
    tip,
    supplementCount: supplementIds.length,
    goalCount: userGoals.length,
  };
}

