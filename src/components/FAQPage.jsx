import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { HelpCircle } from 'lucide-react';

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
        q: 'Is NootropicStacker free to use?',
        a: 'Yes. The Stack Builder, Stack Score, supplement library, quiz, comparison tools, and all blog content are completely free. We plan to offer a premium tier in the future with features like saved stacks, daily logging, and A/B stack testing.'
      },
      {
        q: 'What does the Stack Score measure?',
        a: 'The Stack Score (0-100) rates your supplement combination across four dimensions: Synergy (do these supplements enhance each other?), Coverage (does the stack address your goals?), Balance (is there unnecessary overlap or overkill?), and Efficiency (is the stack lean and purposeful?). It\'s an optimization tool, not medical advice.'
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
        q: 'Can I take multiple nootropics at the same time?',
        a: 'Yes, that\'s the whole point of stacking. But do it intentionally. Some combinations are synergistic (caffeine + L-theanine, racetams + choline sources), while others are redundant or even conflicting. Our Stack Score system flags these interactions automatically so you can build smarter stacks.'
      },
      {
        q: 'What are racetams and do I need a choline source with them?',
        a: 'Racetams (piracetam, aniracetam, oxiracetam, etc.) are synthetic nootropics that enhance acetylcholine signaling in the brain. Because they increase acetylcholine turnover, pairing them with a choline source like Alpha-GPC or Citicoline is standard practice — it provides the raw material your brain needs and can prevent the headaches some people experience with racetams alone.'
      },
      {
        q: 'How long does it take to feel effects?',
        a: 'It depends on the compound. Caffeine and L-theanine work within 30-60 minutes. Racetams and noopept often show acute effects within hours. But many nootropics — bacopa monnieri, lion\'s mane, ashwagandha — are cumulative and take 4-12 weeks of consistent use to show their full effects. Don\'t judge a supplement after three days.'
      },
      {
        q: 'Should I cycle my nootropics?',
        a: 'Some compounds benefit from cycling (taking breaks to prevent tolerance). Caffeine is the classic example — regular breaks maintain its effectiveness. Stimulating compounds like phenylpiracetam are often cycled. But others like creatine, omega-3s, and bacopa are typically taken continuously. There\'s no one-size-fits-all rule; it depends on the specific mechanism of action.'
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
      }
    ]
  }
];

export function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 mt-2">Everything you need to know about nootropic stacking and using NootropicStacker.</p>
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
                  <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqData.flatMap(cat =>
              cat.questions.map(q => ({
                '@type': 'Question',
                name: q.q,
                acceptedAnswer: { '@type': 'Answer', text: q.a }
              }))
            )
          })
        }}
      />
    </div>
  );
}
