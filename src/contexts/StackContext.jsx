import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { analyzeStackSafety, recommendSupplements, calculateStackScore } from '../utils/stackAnalyzer.js';

const StackContext = createContext();

// Initial state
const initialState = {
  stack: [],
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
    // Check if supplement is already in stack
    const existingItem = state.stack.find(item => item.supplementId === supplement.id);
    if (existingItem) {
      return false; // Already in stack
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
    loadStack
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

