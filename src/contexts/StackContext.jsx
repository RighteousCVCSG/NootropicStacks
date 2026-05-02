import React, { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { analyzeStackSafety, recommendSupplements, calculateStackScore } from '../utils/stackAnalyzer.js';
import { track } from '../lib/analytics.js';

const StackContext = createContext();
const STORAGE_KEY = 'nootropicstacker-stack';
const STORAGE_KEY_NAME = 'nootropicstacker-stack-name';

function loadPersistedStack() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      entry => entry && typeof entry.supplementId === 'string' && typeof entry.dosage === 'number'
    );
  } catch {
    return [];
  }
}

function loadPersistedStackName() {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(STORAGE_KEY_NAME) || '';
  } catch {
    return '';
  }
}

// Builds a smart-default placeholder name from the user's selected goals.
// Empty string when no goals are selected — caller falls back to "My Stack".
const GOAL_NAME_MAP = {
  energy:     'Energy',
  mood:       'Mood',
  balance:    'Calm',
  creativity: 'Creative',
  socialness: 'Social',
  learning:   'Memory',
  study:      'Focus',
  // legacy/alias
  focus:      'Focus',
  sleep:      'Sleep',
};

export function suggestStackName(userGoals = []) {
  const labels = (userGoals || [])
    .map((g) => GOAL_NAME_MAP[g])
    .filter(Boolean)
    .slice(0, 2);
  if (labels.length === 0) return '';
  if (labels.length === 1) return `${labels[0]} Stack`;
  return `${labels[0]} & ${labels[1]} Stack`;
}

// Initial state
const initialState = {
  stack: loadPersistedStack(),
  userGoals: ['energy', 'focus'], // Default goals
  safetyAnalysis: null,
  recommendations: [],
  stackScore: null
};

// Action types
const ACTIONS = {
  ADD_SUPPLEMENT: 'ADD_SUPPLEMENT',
  REMOVE_SUPPLEMENT: 'REMOVE_SUPPLEMENT',
  UPDATE_DOSAGE: 'UPDATE_DOSAGE',
  SET_USER_GOALS: 'SET_USER_GOALS',
  UPDATE_ANALYSIS: 'UPDATE_ANALYSIS',
  LOAD_STACK: 'LOAD_STACK'
};

// Reducer function
function stackReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_SUPPLEMENT:
      const newStack = [...state.stack, action.payload];
      return {
        ...state,
        stack: newStack
      };
    
    case ACTIONS.REMOVE_SUPPLEMENT:
      return {
        ...state,
        stack: state.stack.filter(item => item.supplementId !== action.payload)
      };
    
    case ACTIONS.UPDATE_DOSAGE:
      return {
        ...state,
        stack: state.stack.map(item =>
          item.supplementId === action.payload.supplementId
            ? { ...item, dosage: action.payload.dosage }
            : item
        )
      };
    
    case ACTIONS.SET_USER_GOALS:
      return {
        ...state,
        userGoals: action.payload
      };
    
    case ACTIONS.UPDATE_ANALYSIS:
      return {
        ...state,
        safetyAnalysis: action.payload.safetyAnalysis,
        recommendations: action.payload.recommendations,
        stackScore: action.payload.stackScore
      };
    
    case ACTIONS.LOAD_STACK:
      return {
        ...state,
        stack: action.payload
      };
    
    default:
      return state;
  }
}

// Context Provider
export function StackProvider({ children }) {
  const [state, dispatch] = useReducer(stackReducer, initialState);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stackName, setStackNameState] = useState(loadPersistedStackName);

  // Persist stack to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stack));
    } catch {
      // ignore quota errors
    }
  }, [state.stack]);

  // Persist stack name alongside the stack itself.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (stackName) {
        window.localStorage.setItem(STORAGE_KEY_NAME, stackName);
      } else {
        window.localStorage.removeItem(STORAGE_KEY_NAME);
      }
    } catch {
      // ignore
    }
  }, [stackName]);

  const setStackName = (name) => {
    setStackNameState(typeof name === 'string' ? name.slice(0, 80) : '');
  };

  // Update analysis whenever stack or goals change
  useEffect(() => {
    const safetyAnalysis = analyzeStackSafety(state.stack);
    const recommendations = recommendSupplements(state.stack, state.userGoals);
    const stackScore = calculateStackScore(state.stack, state.userGoals);

    dispatch({
      type: ACTIONS.UPDATE_ANALYSIS,
      payload: { safetyAnalysis, recommendations, stackScore }
    });
  }, [state.stack, state.userGoals]);

  // Actions
  const addSupplement = (supplement, dosage) => {
    const existingItem = state.stack.find(item => item.supplementId === supplement.id);
    if (existingItem) {
      return false;
    }

    const newItem = {
      supplementId: supplement.id,
      dosage: dosage || (supplement.dosage.min + supplement.dosage.max) / 2,
      timing: supplement.dosage.timing,
      addedAt: new Date().toISOString(),
    };

    // Compute the score delta synchronously so the toast can show ↑Δ.
    const oldScore = state.stackScore?.headlineScores?.overall ?? null;
    const nextStack = [...state.stack, newItem];
    const nextScore =
      calculateStackScore(nextStack, state.userGoals)?.headlineScores?.overall ?? null;
    const delta =
      oldScore != null && nextScore != null ? nextScore - oldScore : null;
    const arrow = delta == null ? '' : delta > 0 ? ' ↑' : delta < 0 ? ' ↓' : '';
    const deltaTxt =
      delta == null || Math.abs(delta) < 0.05 ? '' : `${arrow}${Math.abs(delta).toFixed(1)}`;

    dispatch({ type: ACTIONS.ADD_SUPPLEMENT, payload: newItem });
    track('stack_add', { supplement_id: supplement.id });

    toast.success(`${supplement.name} added`, {
      description:
        nextScore != null
          ? `Stack Score ${nextScore.toFixed(1)}${deltaTxt}`
          : 'View your stack to see the synergy analysis.',
      duration: 2500,
      action: {
        label: 'View Stack',
        onClick: () => setDrawerOpen(true),
      },
    });
    return true;
  };

  const removeSupplement = (supplementId) => {
    dispatch({
      type: ACTIONS.REMOVE_SUPPLEMENT,
      payload: supplementId
    });
  };

  const updateDosage = (supplementId, dosage) => {
    dispatch({
      type: ACTIONS.UPDATE_DOSAGE,
      payload: { supplementId, dosage }
    });
  };

  const setUserGoals = (goals) => {
    dispatch({
      type: ACTIONS.SET_USER_GOALS,
      payload: goals
    });
  };

  const clearStack = () => {
    dispatch({
      type: ACTIONS.LOAD_STACK,
      payload: []
    });
    setStackNameState('');
  };

  const loadStack = (stackItems) => {
    dispatch({
      type: ACTIONS.LOAD_STACK,
      payload: stackItems.map(item => ({
        supplementId: item.supplementId,
        dosage: item.dosage,
        addedAt: new Date().toISOString()
      }))
    });
  };

  const hasSupplement = useMemo(
    () => (supplementId) => state.stack.some(item => item.supplementId === supplementId),
    [state.stack]
  );

  const itemCount = state.stack.length;

  const value = {
    stack: state.stack,
    userGoals: state.userGoals,
    safetyAnalysis: state.safetyAnalysis,
    recommendations: state.recommendations,
    stackScore: state.stackScore,
    stackName,
    setStackName,
    addSupplement,
    removeSupplement,
    updateDosage,
    setUserGoals,
    clearStack,
    loadStack,
    hasSupplement,
    itemCount,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    toggleDrawer: () => setDrawerOpen(prev => !prev)
  };
  return (
    <StackContext.Provider value={value}>
      {children}
    </StackContext.Provider>
  );
}

// Custom hook to use the stack context
export function useStack() {
  const context = useContext(StackContext);
  if (!context) {
    throw new Error('useStack must be used within a StackProvider');
  }
  return context;
}

