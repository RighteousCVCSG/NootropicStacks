import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { ArrowRight, ArrowLeft, Sparkles, Brain, Zap, Heart, Moon, Shield, Plus, ShoppingCart, AlertTriangle } from 'lucide-react';
import { supplements } from '../data/supplements.js';
import { useStack } from '../contexts/StackContext.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { SEOOptimizer } from './SEOOptimizer.jsx';

const QUESTIONS = [
  {
    id: 'primary_goal',
    title: 'What is your primary goal?',
    subtitle: 'Choose the one that matters most to you right now.',
    options: [
      { value: 'focus', label: 'Focus & Concentration', icon: Brain, description: 'Better attention, deeper work sessions' },
      { value: 'energy', label: 'Energy & Motivation', icon: Zap, description: 'More drive, less fatigue' },
      { value: 'mood', label: 'Mood & Stress Relief', icon: Heart, description: 'Calmer, happier, less anxious' },
      { value: 'memory', label: 'Memory & Learning', icon: Brain, description: 'Better recall, faster learning' },
      { value: 'sleep', label: 'Sleep Quality', icon: Moon, description: 'Fall asleep faster, deeper rest' },
      { value: 'overall', label: 'Overall Brain Health', icon: Shield, description: 'Long-term cognitive protection' },
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    id: 'budget',
    title: 'What is your monthly supplement budget?',
    subtitle: 'We\'ll tailor the stack size to your budget.',
    options: [
      { value: 'low', label: 'Under $30/month', description: '2-3 supplements' },
      { value: 'medium', label: '$30-60/month', description: '3-5 supplements' },
      { value: 'high', label: '$60-100/month', description: '5-8 supplements' },
      { value: 'unlimited', label: '$100+/month', description: 'Whatever works best' },
    ]
  }
];

// Stack recommendation engine
function getRecommendedStack(answers) {
  const { primary_goal, secondary_goal, experience, sensitivity, budget } = answers;
  const sensitivities = sensitivity || [];

  const isCaffeineSensitive = sensitivities.includes('caffeine') || sensitivities.includes('stimulant');
  const hasSleepIssues = sensitivities.includes('sleep_issues');
  const isBeginner = experience === 'beginner' || experience === 'some';
  const maxSupplements = budget === 'low' ? 3 : budget === 'medium' ? 5 : budget === 'high' ? 7 : 10;

  let recommended = [];

  // Core foundation based on primary goal
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

  recommended = [...(goalStacks[primary_goal] || goalStacks.overall)];

  // Add secondary goal supplements (avoid duplicates)
  const secondaryMap = {
    creativity: [{ id: 'aniracetam', reason: 'Enhances creative thinking' }],
    social: [{ id: 'kanna', reason: 'Reduces social anxiety naturally' }],
    study: [{ id: 'noopept', reason: 'Rapid cognitive enhancement for study sessions' }],
    physical: [{ id: 'creatine', reason: 'Dual brain and muscle performance' }],
    longevity: [{ id: 'resveratrol', reason: 'Powerful antioxidant for healthy aging' }],
  };

  if (secondary_goal && secondary_goal !== 'none' && secondaryMap[secondary_goal]) {
    secondaryMap[secondary_goal].forEach(item => {
      if (!recommended.find(r => r.id === item.id)) {
        recommended.push({ ...item, priority: 6 });
      }
    });
  }

  // Filter out caffeine for sensitive users
  if (isCaffeineSensitive) {
    recommended = recommended.filter(r => r.id !== 'caffeine');
  }

  // For beginners, remove advanced supplements
  if (isBeginner) {
    const advancedIds = ['noopept', 'aniracetam', 'piracetam', 'phenylpiracetam', 'modafinil', 'armodafinil'];
    recommended = recommended.filter(r => !advancedIds.includes(r.id));
  }

  // Trim to budget
  recommended = recommended
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxSupplements);

  // Enrich with full supplement data
  return recommended.map(rec => {
    const supplement = supplements.find(s => s.id === rec.id);
    return { ...rec, supplement };
  }).filter(r => r.supplement);
}

export function StackQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const { addSupplement, stack } = useStack();

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

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
      setAnswers({ ...answers, [currentQuestion.id]: value });
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleMultiNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const isSelected = (value) => {
    if (currentQuestion.multi) {
      return (answers[currentQuestion.id] || []).includes(value);
    }
    return answers[currentQuestion.id] === value;
  };

  if (showResults) {
    const recommended = getRecommendedStack(answers);

    return (
      <>
        <SEOOptimizer
          page="home"
          customTitle="Your Personalized Nootropic Stack | NootropicStacker"
          customDescription="Get a personalized supplement stack recommendation based on your goals, experience, and sensitivities."
        />
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Your Personalized Stack</h2>
            <p className="text-gray-600">
              Based on your answers, here's our recommended starting stack.
            </p>
          </div>

          <div className="space-y-4">
            {recommended.map((rec, index) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                        <Link to={`/supplements/${rec.id}`} className="text-lg font-bold hover:text-blue-600">
                          {rec.supplement.name}
                        </Link>
                        <Badge className="text-xs">{rec.supplement.category.replace('-', ' ')}</Badge>
                      </div>
                      <p className="text-sm text-green-700 font-medium mb-1">{rec.reason}</p>
                      <p className="text-sm text-gray-600">{rec.supplement.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Dosage: {rec.supplement.dosage.min}-{rec.supplement.dosage.max} {rec.supplement.dosage.unit} • {rec.supplement.dosage.timing}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => addSupplement(rec.supplement)}
                        disabled={stack.some(s => s.supplementId === rec.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {stack.some(s => s.supplementId === rec.id) ? 'Added' : 'Add'}
                      </Button>
                      {AFFILIATE_LINKS[rec.id] && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-700 border-green-300"
                          onClick={() => {
                            const links = AFFILIATE_LINKS[rec.id];
                            const url = links.nootropicsdepot || links.amazon || links.iherb || Object.values(links).find(v => typeof v === 'string');
                            if (url) window.open(url, '_blank');
                          }}
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Buy
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Next step:</strong> Add these supplements to your stack using the buttons above,
              then visit the <Link to="/" className="font-semibold underline">Stack Builder</Link> to
              see real-time effects, interaction warnings, and fine-tune your dosages.
            </AlertDescription>
          </Alert>

          <Alert className="border-gray-200 bg-gray-50">
            <AlertTriangle className="h-4 w-4 text-gray-600" />
            <AlertDescription className="text-gray-700">
              <strong>Disclaimer:</strong> These recommendations are for educational purposes only.
              Always consult a healthcare professional before starting any supplement regimen.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => { setShowResults(false); setStep(0); setAnswers({}); }}>
              Retake Quiz
            </Button>
            <Link to="/">
              <Button>
                <Sparkles className="w-4 h-4 mr-2" />
                Open Stack Builder
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Nootropic Stack Quiz — Find Your Perfect Stack | NootropicStacker"
        customDescription="Answer 5 quick questions to get a personalized nootropic supplement stack recommendation based on your goals and experience."
      />
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {step + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
            <p className="text-gray-600">{currentQuestion.subtitle}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      isSelected(option.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                      <span className="font-semibold">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </button>
                );
              })}
            </div>

            {currentQuestion.multi && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleMultiNext}
                  disabled={!(answers[currentQuestion.id]?.length > 0)}
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
            Skip quiz → use Stack Builder
          </Link>
        </div>
      </div>
    </>
  );
}
