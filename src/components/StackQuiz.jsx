import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles, Brain, Zap, Heart, Moon, Shield, Plus, ShoppingCart, AlertTriangle, BookOpen } from 'lucide-react';
import { supplements } from '../data/supplements.js';
import { useStack } from '../contexts/StackContext.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateUtms, withIherbRef } from '@/lib/affiliate.js';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { track } from '../lib/analytics.js';

const QUESTIONS = [
  {
    id: 'primary_goal',
    title: 'What is your primary goal?',
    subtitle: 'Choose the one that matters most to you right now.',
    options: [
      { value: 'focus', label: 'Focus & Concentration', icon: Brain, description: 'Better attention, deeper work sessions' },
      { value: 'energy', label: 'Energy & Motivation', icon: Zap, description: 'More drive, less fatigue' },
      { value: 'mood', label: 'Mood & Stress Relief', icon: Heart, description: 'Calmer, happier, less anxious' },
      { value: 'memory', label: 'Memory & Learning', icon: BookOpen, description: 'Better recall, faster learning' },
      { value: 'sleep', label: 'Sleep Quality', icon: Moon, description: 'Fall asleep faster, deeper rest' },
      { value: 'overall', label: 'Overall Brain Health', icon: Shield, description: 'Long-term cognitive protection' },
    ],
  },
  {
    id: 'secondary_goal',
    title: 'What else is important to you?',
    subtitle: 'Pick a secondary benefit.',
    options: [
      { value: 'creativity', label: 'Creativity', description: 'Novel thinking, flow states' },
      { value: 'social', label: 'Social Confidence', description: 'Better conversations, less social anxiety' },
      { value: 'study', label: 'Study Performance', description: 'Exam prep, information retention' },
      { value: 'physical', label: 'Physical Performance', description: 'Workout energy, recovery' },
      { value: 'longevity', label: 'Anti-Aging', description: 'Neuroprotection, cellular health' },
      { value: 'none', label: 'Just the primary goal', description: 'Keep it simple' },
    ],
  },
  {
    id: 'experience',
    title: 'How experienced are you with nootropics?',
    subtitle: 'This helps us recommend appropriate supplements.',
    options: [
      { value: 'beginner', label: 'Complete Beginner', description: 'Never taken nootropics before' },
      { value: 'some', label: 'Some Experience', description: 'Tried a few supplements (vitamins, fish oil, etc.)' },
      { value: 'experienced', label: 'Experienced', description: 'Regularly use nootropic supplements' },
      { value: 'advanced', label: 'Advanced', description: 'Familiar with racetams, stacking protocols, etc.' },
    ],
  },
  {
    id: 'sensitivity',
    title: 'Do you have any sensitivities?',
    subtitle: 'Select all that apply.',
    multi: true,
    options: [
      { value: 'caffeine', label: 'Caffeine Sensitive', description: 'Jittery or anxious from coffee' },
      { value: 'stimulant', label: 'Stimulant Sensitive', description: 'React strongly to energy supplements' },
      { value: 'sleep_issues', label: 'Sleep Problems', description: 'Difficulty falling or staying asleep' },
      { value: 'stomach', label: 'Sensitive Stomach', description: 'Supplements upset your stomach' },
      { value: 'none', label: 'No Sensitivities', description: 'I tolerate supplements well' },
    ],
  },
  {
    id: 'budget',
    title: 'What is your monthly supplement budget?',
    subtitle: 'We\'ll tailor the stack size to your budget.',
    options: [
      { value: 'low', label: 'Under $30/month', description: '2–3 supplements' },
      { value: 'medium', label: '$30–60/month', description: '3–5 supplements' },
      { value: 'high', label: '$60–100/month', description: '5–8 supplements' },
      { value: 'unlimited', label: '$100+/month', description: 'Whatever works best' },
    ],
  },
];

function getRecommendedStack(answers) {
  const { primary_goal, secondary_goal, experience, sensitivity, budget } = answers;
  const sensitivities = sensitivity || [];

  const isCaffeineSensitive = sensitivities.includes('caffeine') || sensitivities.includes('stimulant');
  const isBeginner = experience === 'beginner' || experience === 'some';
  const maxSupplements = budget === 'low' ? 3 : budget === 'medium' ? 5 : budget === 'high' ? 7 : 10;

  const goalStacks = {
    focus: [
      { id: 'l-theanine', reason: 'Promotes calm focus without drowsiness', priority: 1 },
      { id: 'citicoline', reason: 'Boosts acetylcholine for sustained attention', priority: 2 },
      { id: 'bacopa', reason: 'Enhances memory formation and focus over time', priority: 3 },
      { id: 'lions-mane', reason: 'Supports nerve growth factor for cognitive clarity', priority: 4 },
      { id: 'caffeine', reason: 'Immediate focus and alertness boost', priority: 5 },
    ],
    energy: [
      { id: 'creatine', reason: 'Cellular energy for brain and body', priority: 1 },
      { id: 'cordyceps', reason: 'Natural energy and endurance booster', priority: 2 },
      { id: 'tyrosine', reason: 'Supports dopamine for drive and motivation', priority: 3 },
      { id: 'b-complex', reason: 'Essential for energy metabolism', priority: 4 },
      { id: 'coq10', reason: 'Mitochondrial energy production', priority: 5 },
    ],
    mood: [
      { id: 'ashwagandha', reason: 'Reduces cortisol and anxiety', priority: 1 },
      { id: 'magnesium', reason: 'Calming mineral most people are deficient in', priority: 2 },
      { id: 'l-theanine', reason: 'Promotes relaxation without sedation', priority: 3 },
      { id: 'rhodiola', reason: 'Adaptogen that balances stress response', priority: 4 },
      { id: 'omega3', reason: 'Supports brain health and mood regulation', priority: 5 },
    ],
    memory: [
      { id: 'bacopa', reason: 'Clinically proven to improve memory', priority: 1 },
      { id: 'lions-mane', reason: 'Stimulates nerve growth factor', priority: 2 },
      { id: 'alpha-gpc', reason: 'Potent choline source for memory formation', priority: 3 },
      { id: 'phosphatidylserine', reason: 'Supports memory and cognitive function', priority: 4 },
      { id: 'ginkgo', reason: 'Improves blood flow to the brain', priority: 5 },
    ],
    sleep: [
      { id: 'magnesium', reason: 'Promotes muscle relaxation and sleep onset', priority: 1 },
      { id: 'l-theanine', reason: 'Calms the mind for easier sleep', priority: 2 },
      { id: 'ashwagandha', reason: 'Reduces bedtime anxiety and cortisol', priority: 3 },
      { id: 'melatonin', reason: 'Regulates sleep-wake cycle', priority: 4 },
      { id: 'reishi', reason: 'Adaptogenic mushroom that supports deep sleep', priority: 5 },
    ],
    overall: [
      { id: 'omega3', reason: 'Foundation for brain cell membrane health', priority: 1 },
      { id: 'vitamin-d', reason: 'Essential vitamin most people lack', priority: 2 },
      { id: 'magnesium', reason: 'Involved in 300+ enzymatic reactions', priority: 3 },
      { id: 'lions-mane', reason: 'Neuroprotective and supports NGF', priority: 4 },
      { id: 'creatine', reason: 'Cellular energy and neuroprotection', priority: 5 },
    ],
  };

  let recommended = [...(goalStacks[primary_goal] || goalStacks.overall)];

  const secondaryMap = {
    creativity: [{ id: 'aniracetam', reason: 'Enhances creative thinking' }],
    social: [{ id: 'kanna', reason: 'Reduces social anxiety naturally' }],
    study: [{ id: 'noopept', reason: 'Rapid cognitive enhancement for study sessions' }],
    physical: [{ id: 'creatine', reason: 'Dual brain and muscle performance' }],
    longevity: [{ id: 'resveratrol', reason: 'Powerful antioxidant for healthy aging' }],
  };
  if (secondary_goal && secondary_goal !== 'none' && secondaryMap[secondary_goal]) {
    secondaryMap[secondary_goal].forEach(item => {
      if (!recommended.find(r => r.id === item.id)) recommended.push({ ...item, priority: 6 });
    });
  }

  if (isCaffeineSensitive) recommended = recommended.filter(r => r.id !== 'caffeine');
  let strippedAdvanced = 0;
  if (isBeginner) {
    const advancedIds = ['noopept', 'aniracetam', 'piracetam', 'phenylpiracetam', 'modafinil', 'armodafinil'];
    const before = recommended.length;
    recommended = recommended.filter(r => !advancedIds.includes(r.id));
    strippedAdvanced = before - recommended.length;
  }

  recommended = recommended.sort((a, b) => a.priority - b.priority).slice(0, maxSupplements);

  return {
    items: recommended.map(rec => {
      const supplement = supplements.find(s => s.id === rec.id);
      return { ...rec, supplement };
    }).filter(r => r.supplement),
    strippedAdvanced,
  };
}

function OptionButton({ option, selected, onClick }) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-md border text-left transition-colors ${
        selected
          ? 'border-primary-500 bg-primary-050'
          : 'border-ink-200 bg-surface-card hover:border-primary-300'
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-4 h-4 text-primary-700" />}
        <span className="text-sm font-semibold text-ink-900">{option.label}</span>
      </div>
      <p className="text-xs text-ink-700 leading-snug">{option.description}</p>
    </button>
  );
}

export function StackQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [tracked, setTracked] = useState({ start: false, complete: false });
  const { addSupplement, stack } = useStack();

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  // Fire quiz_start once at mount
  React.useEffect(() => {
    if (!tracked.start) {
      track('quiz_start');
      setTracked(t => ({ ...t, start: true }));
    }
  }, [tracked.start]);

  const handleAnswer = (value) => {
    if (currentQuestion.multi) {
      const current = answers[currentQuestion.id] || [];
      if (value === 'none') {
        setAnswers({ ...answers, [currentQuestion.id]: ['none'] });
      } else {
        const filtered = current.filter(v => v !== 'none');
        const updated = filtered.includes(value)
          ? filtered.filter(v => v !== value)
          : [...filtered, value];
        setAnswers({ ...answers, [currentQuestion.id]: updated });
      }
    } else {
      const next = { ...answers, [currentQuestion.id]: value };
      setAnswers(next);
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setShowResults(true);
        if (!tracked.complete) {
          track('quiz_complete', { primary_goal: next.primary_goal, experience: next.experience });
          setTracked(t => ({ ...t, complete: true }));
        }
      }
    }
  };

  const handleMultiNext = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setShowResults(true);
  };

  const isSelected = (value) => {
    if (currentQuestion.multi) return (answers[currentQuestion.id] || []).includes(value);
    return answers[currentQuestion.id] === value;
  };

  if (showResults) {
    const { items: recommended, strippedAdvanced } = getRecommendedStack(answers);

    return (
      <>
        <SEOOptimizer
          page="quiz"
          customTitle="Your Personalized Nootropic Stack | NootropicStacker"
          customDescription="Get a personalized supplement stack recommendation based on your goals, experience, and sensitivities."
        />
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <div className="text-center">
            <Sparkles className="w-6 h-6 text-primary-700 mx-auto mb-2" />
            <h1 className="text-xl sm:text-2xl font-semibold text-ink-900">Your personalized stack</h1>
            <p className="text-sm text-ink-700 mt-1">
              Based on your answers, here's a starting stack you can refine in the builder.
            </p>
          </div>

          <div className="space-y-2">
            {recommended.map((rec, index) => (
              <div key={rec.id} className="rounded-md bg-surface-card border border-ink-200 p-3 hover:border-primary-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-semibold bg-primary-050 text-primary-800 border border-primary-300">{index + 1}</span>
                      <Link to={`/supplements/${rec.id}`} className="text-sm font-semibold text-ink-900 hover:text-primary-700">
                        {rec.supplement.name}
                      </Link>
                      <span className="text-[10px] uppercase tracking-wider text-ink-500">{rec.supplement.category.replace('-', ' ')}</span>
                    </div>
                    <p className="text-xs text-accent-700 font-medium mb-1">{rec.reason}</p>
                    <p className="text-xs text-ink-700 line-clamp-2 leading-snug">{rec.supplement.description}</p>
                    <p className="mt-1 text-[11px] text-ink-500 font-mono">
                      {rec.supplement.dosage.min}–{rec.supplement.dosage.max} {rec.supplement.dosage.unit} · {rec.supplement.dosage.timing}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => addSupplement(rec.supplement)}
                      disabled={stack.some(s => s.supplementId === rec.id)}
                      className="inline-flex items-center justify-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium bg-primary-050 hover:bg-primary-100 text-primary-800 border border-primary-300 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {stack.some(s => s.supplementId === rec.id) ? 'Added' : 'Add'}
                    </button>
                    {AFFILIATE_LINKS[rec.id] && (
                      <button
                        type="button"
                        onClick={() => {
                          const links = AFFILIATE_LINKS[rec.id];
                          const url = links.nootropicsdepot || (
                            links.amazon ? withAffiliateUtms(links.amazon, { campaign: `quiz-${rec.id}` }) : (
                              (links.iherb && withIherbRef(links.iherb)) || Object.values(links).find(v => typeof v === 'string')
                            )
                          );
                          if (url) window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="inline-flex items-center justify-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium border border-accent-500 text-accent-700 hover:bg-accent-050 transition-colors"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Buy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {strippedAdvanced > 0 && (
            <p className="text-xs text-ink-500 italic">
              Hid {strippedAdvanced} advanced supplement{strippedAdvanced === 1 ? '' : 's'} (racetams) since you're newer to nootropics. Switch the experience level to see them.
            </p>
          )}

          <div className="rounded-md border border-primary-300 bg-primary-050 p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary-700 mt-0.5 shrink-0" />
              <p className="text-xs text-primary-800 leading-snug">
                <span className="font-semibold">Next step:</span> add these supplements to your stack, then open the{' '}
                <Link to="/build" className="font-semibold underline">Stack Builder</Link> for real-time effects, interaction warnings, and dose tuning.
              </p>
            </div>
          </div>

          <div className="rounded-md border border-ink-200 bg-surface-card p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-ink-500 mt-0.5 shrink-0" />
              <p className="text-xs text-ink-700 leading-snug">
                <span className="font-semibold">Disclaimer:</span> educational tool only. Consult a healthcare professional before starting any supplement regimen.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setShowResults(false); setStep(0); setAnswers({}); }}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-semibold text-ink-700 hover:text-ink-900 bg-surface-card border border-ink-200 hover:border-primary-300 transition-colors"
            >
              Retake quiz
            </button>
            <Link
              to="/build"
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold bg-primary-700 text-white hover:bg-primary-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Open Stack Builder
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOOptimizer
        page="quiz"
        customTitle="Stack Quiz — Find Your Starting Nootropic Stack | NootropicStacker"
        customDescription="Five quick questions and you get a personalized nootropic stack matched to your goals, experience level, and sensitivities."
      />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {/* Progress strip */}
        <div>
          <div className="flex justify-between text-[11px] text-ink-500 mb-1">
            <span>Question {step + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface-sunk overflow-hidden">
            <div className="h-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-md bg-surface-card border border-ink-200 p-3 sm:p-4">
          <h1 className="text-lg sm:text-xl font-semibold text-ink-900">{currentQuestion.title}</h1>
          <p className="text-xs text-ink-700 mt-0.5 mb-3">{currentQuestion.subtitle}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentQuestion.options.map(option => (
              <OptionButton
                key={option.value}
                option={option}
                selected={isSelected(option.value)}
                onClick={() => handleAnswer(option.value)}
              />
            ))}
          </div>

          {currentQuestion.multi && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleMultiNext}
                disabled={!(answers[currentQuestion.id]?.length > 0)}
                className="inline-flex items-center justify-center gap-1 h-8 px-3 rounded-md text-xs font-semibold bg-primary-700 text-white hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-ink-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <Link to="/build" className="text-xs text-ink-500 hover:text-ink-900">
            Skip quiz → use Stack Builder
          </Link>
        </div>
      </div>
    </>
  );
}
