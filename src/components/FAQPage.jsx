import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { HelpCircle } from 'lucide-react';
import { JsonLd } from './JsonLd.jsx';
import { buildFAQSchema } from '../lib/schema/builders.js';

const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is nootropic stacking?',
        a: 'Nootropic stacking is the practice of combining two or more cognitive-enhancing supplements to achieve better results than any single supplement alone. The idea is that different compounds work through different mechanisms — so combining them can cover more ground. For example, pairing caffeine with L-theanine gives you alertness without the jitters, because they complement each other\'s effects.'
      },
      {
        q: 'How do I build my first stack?',
        a: 'Start simple. Pick one or two well-researched compounds that match your primary goal (focus, memory, mood, etc.). Use the Stack Builder on our homepage to select supplements, set your goals, and see how they score together. Add one supplement at a time, give it at least two weeks, and track how you feel before adding the next one.'
      },
      {
        q: 'What\'s a good beginner stack?',
        a: 'Start with three: caffeine (100mg) + L-theanine (200mg) for focus, and creatine (5g/day) for cognitive baseline. Add lion\'s mane after 2 weeks if you want to support long-term neuroplasticity. Avoid racetams, modafinil, or complex multi-supplement stacks until you understand how the basics affect you.'
      },
      {
        q: 'Is NootropicStacker free to use?',
        a: 'Yes. The Stack Builder, Stack Score, supplement library, quiz, comparison tools, and all blog content are completely free. We plan to offer a premium tier in the future with features like saved stacks, daily logging, and A/B stack testing.'
      },
      {
        q: 'What does the Stack Score measure?',
        a: 'The Stack Score (0-100) rates your supplement combination across four dimensions: Synergy (do these supplements enhance each other?), Coverage (does the stack address your goals?), Balance (is there unnecessary overlap or overkill?), and Efficiency (is the stack lean and purposeful?). It\'s an optimization tool, not medical advice.'
      },
      {
        q: 'What makes NootropicStacker different from other supplement sites?',
        a: 'Most supplement sites sell you something. We don\'t sell supplements — we help you build stacks. The Stack Score system objectively rates your stack across synergy, coverage, balance, and efficiency. The interaction database flags conflicts before they become problems. And every buy button goes to third-party retailers where you can compare prices.'
      }
    ]
  },
  {
    category: 'Supplements & Safety',
    questions: [
      {
        q: 'Are nootropics safe?',
        a: 'Most well-researched nootropics like caffeine, L-theanine, creatine, and bacopa monnieri have strong safety profiles when used at recommended doses. However, "nootropics" is a broad category — some compounds have more research behind them than others. Always start with low doses, introduce one supplement at a time, and pay attention to how your body responds. This site provides educational information, not medical advice.'
      },
      {
        q: 'Do nootropics actually work?',
        a: 'Depends heavily on the compound. Some have strong clinical evidence (creatine for cognition, omega-3 DHA for brain health, caffeine for alertness, bacopa for memory). Others have promising but limited evidence (lion\'s mane, alpha-GPC). And some are more hype than substance. The Stack Score methodology is based on verified mechanisms.'
      },
      {
        q: 'Is it safe to combine multiple nootropics?',
        a: 'Yes, with caveats. Start with one supplement, add one at a time, and give each 2-week assessment periods before adding the next. The main risks are stacking multiple stimulants (additive anxiety and elevated heart rate) or multiple serotonergic compounds (serotonin syndrome risk). Use the interaction checker in the stack builder to identify potential conflicts before they become problems.'
      },
      {
        q: 'Can I take multiple nootropics at the same time?',
        a: 'Yes, that\'s the whole point of stacking. But do it intentionally. Some combinations are synergistic (caffeine + L-theanine, racetams + choline sources), while others are redundant or even conflicting. Our Stack Score system flags these interactions automatically so you can build smarter stacks.'
      },
      {
        q: 'Are nootropics legal?',
        a: 'Most common nootropics are legal dietary supplements in the US (L-theanine, creatine, lion\'s mane, bacopa, etc.). Modafinil and armodafinil are Schedule IV prescription medications — legal to possess with a prescription, not legal to buy without one. Piracetam is in a legal gray area in the US (not FDA-approved as a supplement but not scheduled). Phenibut is legal in the US but controlled in some European countries.'
      },
      {
        q: 'What are racetams and do I need a choline source with them?',
        a: 'Racetams (piracetam, aniracetam, oxiracetam, etc.) are synthetic nootropics that enhance acetylcholine signaling in the brain. Because they increase acetylcholine turnover, pairing them with a choline source like Alpha-GPC or Citicoline is standard practice — it provides the raw material your brain needs and can prevent the headaches some people experience with racetams alone.'
      },
      {
        q: 'Why do I get a headache from racetams?',
        a: 'The "racetam headache" is the most common side effect and is almost always caused by acetylcholine depletion. Racetams increase acetylcholine turnover in the brain, and if your diet doesn\'t supply enough choline, levels drop. Solution: add a choline source (Alpha-GPC 300mg or Citicoline 250mg) to your racetam stack.'
      },
      {
        q: 'Do I need to cycle off supplements?',
        a: 'Required for stimulants (caffeine, phenylpiracetam) to prevent tolerance. Recommended for adaptogens (ashwagandha, rhodiola) — 8-12 weeks on, 4 weeks off. Optional for foundational compounds (omega-3, creatine, lion\'s mane) that can be taken continuously.'
      },
      {
        q: 'Should I cycle my nootropics?',
        a: 'Some compounds benefit from cycling (taking breaks to prevent tolerance). Caffeine is the classic example — regular breaks maintain its effectiveness. Stimulating compounds like phenylpiracetam are often cycled. But others like creatine, omega-3s, and bacopa are typically taken continuously. There\'s no one-size-fits-all rule; it depends on the specific mechanism of action.'
      },
      {
        q: 'Can I take nootropics with coffee?',
        a: 'Yes. Coffee already contains caffeine and some protective polyphenols. If you\'re adding caffeine supplements, account for the caffeine already in your coffee to avoid over-stimulation. L-theanine pairs especially well with coffee\'s caffeine. Avoid adding additional stimulants on top of an already-caffeinated state.'
      }
    ]
  },
  {
    category: 'Specific Supplements',
    questions: [
      {
        q: 'What\'s the best nootropic for studying?',
        a: 'For studying: L-theanine + caffeine for focus sessions, bacopa for long-term memory formation, lion\'s mane for neuroplasticity. Avoid high-dose stimulants for active learning — moderate anxiety actually impairs memory encoding. Check out the Student Stack guide in the blog for a full protocol.'
      },
      {
        q: 'What\'s the difference between Alpha-GPC and Citicoline?',
        a: 'Both are choline sources but with different secondary benefits. Alpha-GPC converts more directly to choline and may have slight growth hormone benefits. Citicoline also provides cytidine (which converts to uridine), supporting dopamine receptor health and cell membranes. Many people find citicoline gentler; some find alpha-GPC more noticeable. Both work — personal preference and budget dictate choice.'
      },
      {
        q: 'What\'s the difference between Ashwagandha KSM-66 and Sensoril?',
        a: 'Both are branded ashwagandha extracts but from different plant parts with different standardization. KSM-66 uses only root extract, standardized to 5% withanolides — the form used in most clinical trials, generally preferred for testosterone and cognitive benefits. Sensoril uses both root and leaf, standardized to 10% withanolides — often preferred for stress and sleep. KSM-66 is more extensively studied.'
      },
      {
        q: 'How long does it take for nootropics to work?',
        a: 'Varies enormously. Caffeine: 30-45 minutes. Tyrosine: 1-2 hours. Rhodiola: 30 minutes. These are acute effects. Bacopa requires 8-12 weeks of consistent use. Lion\'s mane requires 4-8 weeks. Creatine requires 3-5 days of loading. Most people quit bacopa before it has a chance to work — don\'t.'
      },
      {
        q: 'How long does it take to feel effects?',
        a: 'It depends on the compound. Caffeine and L-theanine work within 30-60 minutes. Racetams and noopept often show acute effects within hours. But many nootropics — bacopa monnieri, lion\'s mane, ashwagandha — are cumulative and take 4-12 weeks of consistent use to show their full effects. Don\'t judge a supplement after three days.'
      },
      {
        q: 'What\'s the best time to take nootropics?',
        a: 'Cognitive enhancers and stimulants: morning or pre-work session. Adaptogens: morning with food. Fat-soluble supplements (lion\'s mane, bacopa, ashwagandha): with meals for better absorption. Sleep-support compounds (magnesium, L-theanine for sleep): 30-60 min before bed. Bacopa is tolerated best in the evening by some people. The Daily Protocol tool in the stack builder generates a personalized timing schedule.'
      },
      {
        q: 'How much does a good nootropic stack cost per month?',
        a: 'A well-designed beginner stack (caffeine/theanine, creatine, lion\'s mane) costs $40-60/month. An intermediate stack (adding alpha-GPC, bacopa, ashwagandha) runs $80-120/month. Premium stacks with high-quality branded ingredients (KSM-66, Suntheanine, Cognizin) can reach $150-200/month. The Stack Builder shows estimated monthly costs as you build.'
      }
    ]
  },
  {
    category: 'Using NootropicStacker',
    questions: [
      {
        q: 'How does the Stack Quiz work?',
        a: 'The quiz asks 5 questions about your goals, experience level, and preferences, then recommends a personalized stack based on your answers. It\'s a good starting point if you\'re new to nootropics or want a quick suggestion. You can always modify the recommended stack afterward.'
      },
      {
        q: 'What do the supplement effect scores mean?',
        a: 'Each supplement has effect ratings (0-9.5) across categories like energy, mood, focus, creativity, and more. These scores are based on research literature and community experience. Higher scores mean stronger effects in that area. When you stack multiple supplements, effects combine with diminishing returns — so three high-energy supplements won\'t give you 3x the energy.'
      },
      {
        q: 'Can I compare supplements side by side?',
        a: 'Yes. Navigate to the Supplement Library, select supplements you want to compare, and use the comparison feature to see their effects, dosages, and profiles side by side. This is useful when choosing between similar compounds — like deciding between Alpha-GPC and Citicoline for your choline source.'
      },
      {
        q: 'Where do you get your supplement data?',
        a: 'Our supplement database draws from published research, established references like Examine.com, and protocols from well-known biohackers and researchers. Effect scores represent general consensus from available evidence, not guarantees of individual results. We currently track 195 supplements.'
      },
      {
        q: 'Does the Stack Builder save my stack automatically?',
        a: 'Your stack persists in your browser session as you build. If you create a free account, you can save named stacks and reload them in future sessions. Without an account, your stack resets when you close the tab. Account creation is free and requires only an email address.'
      },
      {
        q: 'What is the interaction checker and how does it work?',
        a: 'The interaction checker is built into the Stack Builder and runs automatically as you add supplements. It scans your stack against a database of 60+ known interactions — flagging combinations that are synergistic (shown as positive signals) or potentially problematic (shown as warnings). High-severity warnings appear in red; moderate warnings in orange. The interaction database covers stimulant stacking, serotonergic combinations, and common choline-acetylcholine dynamics.'
      },
      {
        q: 'Can I share my stack with someone else?',
        a: 'Stack sharing is on our roadmap. Currently you can screenshot your stack or copy the supplement list manually. When sharing launches, you\'ll be able to generate a link that pre-loads your stack in the builder for anyone you send it to — useful for sharing protocols with a coach, doctor, or fellow biohacker.'
      }
    ]
  }
];

export function FAQPage() {
  const flatFaqs = faqData.flatMap((category) =>
    category.questions.map((item) => ({ question: item.q, answer: item.a }))
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <JsonLd data={buildFAQSchema(flatFaqs)} />

      <div>
        <h1 className="text-2xl font-semibold text-ink-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          Frequently Asked Questions
        </h1>
        <p className="text-ink-700 mt-2">Everything you need to know about nootropic stacking and using NootropicStacker.</p>
      </div>

      {faqData.map((category, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-lg">{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((item, j) => (
                <AccordionItem key={j} value={`${i}-${j}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-ink-700 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
