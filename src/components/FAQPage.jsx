import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { HelpCircle } from 'lucide-react';
import { faqData } from '../data/faqData.js';

export function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.flatMap(category =>
          category.questions.map(q => ({
            "@type": "Question",
            "name": q.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.a
            }
          }))
        )
      }) }} />

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
    </div>
  );
}
