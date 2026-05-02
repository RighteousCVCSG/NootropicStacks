import React, { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react';
import { analyzeStackSafety, recommendSupplements, calculateStackScore } from '../utils/stackAnalyzer.js';
import { track } from '../lib/analytics.js';

const StackContext = createContext();
const STORAGE_KEY = 'nootropicstacker-stack';

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

  // Persist stack to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stack));
    } catch {
      // ignore quota errors
    }
  }, [state.stack]);

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

    dispatch({
      type: ACTIONS.ADD_SUPPLEMENT,
      payload: {
        supplementId: supplement.id,
        dosage: dosage || (supplement.dosage.min + supplement.dosage.max) / 2,
        timing: supplement.dosage.timing,
        addedAt: new Date().toISOString()
      }
    });
    setDrawerOpen(true);
    track('stack_add', { supplement_id: supplement.id });
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

