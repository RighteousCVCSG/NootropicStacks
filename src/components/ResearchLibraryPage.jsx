import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { ArrowRight, BookOpen, ExternalLink, Search, FlaskConical, AlertTriangle, BookOpenCheck } from 'lucide-react';

const EVIDENCE_ORDER = {
  'Meta-Analysis': 0,
  'RCT': 1,
  'Observational': 2,
  'Animal': 3,
};

const EVIDENCE_BADGE = {
  'Meta-Analysis': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'RCT': 'bg-blue-100 text-blue-800 border-blue-300',
  'Observational': 'bg-amber-100 text-amber-800 border-amber-300',
  'Animal': 'bg-slate-100 text-slate-600 border-slate-300',
};

const studies = [
  {
    id: 'bacopa-memory-meta',
    title: 'Meta-analysis of randomized controlled trials on Bacopa monnieri for cognitive function',
    journal: 'Journal of Ethnopharmacology',
    year: 2014,
    supplement: 'Bacopa Monnieri',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
    relevance: 'This meta-analysis pooled data from nine randomized controlled trials examining Bacopa\'s effects on healthy adults. It provides the strongest consolidated evidence for Bacopa as a memory-enhancing supplement. The analysis controlled for placebo effects across a broad population range.',
    keyFindings: 'Bacopa significantly improved speed of visual information processing, learning rate, and memory consolidation compared to placebo. Effects were most pronounced after 12 weeks of continuous use, with the 300mg standardized extract consistently outperforming lower doses.',
    applicability: 'For supplementation purposes, 300mg of a 50% bacosides extract taken daily with food for a minimum of 8-12 weeks is the evidence-backed protocol. Shorter durations are unlikely to produce the memory benefits observed in clinical trials.',
    tags: ['memory', 'bacopa', 'meta-analysis', 'learning', 'cognitive function'],
    evidenceQuality: 'Meta-Analysis',
  },
  {
    id: 'lions-mane-ngf',
    title: 'Nerve Growth Factor-inducing activity of Hericium erinaceus in 1321N1 human astrocytoma cells',
    journal: 'Biological & Pharmaceutical Bulletin',
    year: 2008,
    supplement: 'Lion\'s Mane',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/18250410/',
    relevance: 'This foundational study identified the active compounds in Lion\'s Mane (hericenones and erinacines) responsible for stimulating Nerve Growth Factor synthesis. It established the mechanistic basis for Lion\'s Mane as a neuroplasticity supplement and launched the subsequent wave of human research.',
    keyFindings: 'Hericenones C, D, and E extracted from Lion\'s Mane fruiting bodies significantly induced NGF synthesis in human astrocytoma cells. The compounds were able to cross the blood-brain barrier in animal models, supporting their potential for in-vivo neurological effects.',
    applicability: 'Fruiting body extracts are preferred over mycelium-based products, as hericenones are concentrated in the fruiting body. Doses of 500-1000mg of a standardized fruiting body extract are commonly used in practice based on this mechanistic evidence.',
    tags: ['lion\'s mane', 'ngf', 'neuroplasticity', 'nerve growth factor', 'mushroom'],
    evidenceQuality: 'Observational',
  },
  {
    id: 'ashwagandha-cortisol-rct',
    title: 'A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of Ashwagandha root in reducing stress and anxiety in adults',
    journal: 'Indian Journal of Psychological Medicine',
    year: 2012,
    supplement: 'Ashwagandha (KSM-66)',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/23439798/',
    relevance: 'This landmark double-blind RCT on KSM-66 Ashwagandha is the most-cited human trial for the adaptogen\'s stress and cortisol effects. It directly measured serum cortisol levels alongside validated stress and anxiety questionnaires in 64 adults over 60 days.',
    keyFindings: 'The KSM-66 group showed a 27.9% reduction in serum cortisol versus 7.9% in the placebo group (p<0.0001). Stress scores (PSS scale) improved by 44% versus 5.5% for placebo. No serious adverse events were reported at 300mg twice daily.',
    applicability: 'The 600mg/day dose split into two 300mg doses is the validated protocol for cortisol reduction and stress management. KSM-66 and Sensoril are the two clinically studied extract forms — generic ashwagandha powder is not equivalent to these standardized extracts.',
    tags: ['ashwagandha', 'cortisol', 'stress', 'anxiety', 'ksm-66', 'adaptogen'],
    evidenceQuality: 'RCT',
  },
  {
    id: 'ltheanine-caffeine-focus',
    title: 'The combined effects of L-theanine and caffeine on cognitive performance and mood',
    journal: 'Nutritional Neuroscience',
    year: 2010,
    supplement: 'L-Theanine',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/21040626/',
    relevance: 'This RCT is the primary evidence base for the now-classic L-Theanine and caffeine combination. It examined the synergistic interaction between 97mg caffeine and 40mg L-theanine versus each compound alone, directly measuring multiple cognitive domains.',
    keyFindings: 'The combination significantly improved accuracy on a rapid visual information processing task and reduced susceptibility to distracting stimuli compared to either compound alone or placebo. Self-reported alertness was higher and headaches lower with the combination than caffeine alone.',
    applicability: 'A 2:1 ratio of L-theanine to caffeine (e.g., 200mg L-theanine with 100mg caffeine) is the practical protocol derived from this research. L-Theanine meaningfully modulates caffeine\'s stimulant effects without blunting the focus benefit — making it the most accessible entry-level nootropic stack.',
    tags: ['l-theanine', 'caffeine', 'focus', 'attention', 'combination', 'alertness'],
    evidenceQuality: 'RCT',
  },
  {
    id: 'alpha-gpc-alzheimers',
    title: 'Multicenter clinical trial of the memory-enhancing effects of choline alphoscerate vs. placebo in patients with probable Alzheimer\'s disease',
    journal: 'Aging: Clinical and Experimental Research',
    year: 2003,
    supplement: 'Alpha GPC',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/12945733/',
    relevance: 'This large-scale Italian multicenter trial (261 participants) investigated Alpha GPC (choline alphoscerate) in diagnosed Alzheimer\'s patients over 180 days. It remains the most comprehensive human trial demonstrating Alpha GPC\'s ability to improve cholinergic transmission and cognitive scores.',
    keyFindings: 'Alpha GPC at 400mg three times daily significantly improved Alzheimer\'s Disease Assessment Scale cognitive subscale (ADAS-cog) scores compared to placebo at both 90 and 180 days. The drug was well-tolerated with no significant adverse events relative to placebo.',
    applicability: 'For healthy adults, lower doses of 300-600mg are typically used for acetylcholine support. The Alzheimer\'s trial dose (1200mg/day) establishes a strong safety ceiling. Alpha GPC is particularly useful when stacked with acetylcholinesterase inhibitors like Huperzine A.',
    tags: ['alpha gpc', 'choline', 'alzheimer\'s', 'acetylcholine', 'memory', 'prevention'],
    evidenceQuality: 'RCT',
  },
  {
    id: 'omega3-depression-meta',
    title: 'Omega-3 fatty acids and major depression: a primer for the mental health professional',
    journal: 'Lipids in Health and Disease',
    year: 2004,
    supplement: 'Omega-3 DHA',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/15555759/',
    relevance: 'This review synthesizes evidence linking EPA and DHA omega-3 fatty acids to depressive disorders and brain structure. It connects epidemiological data (lower fish consumption correlating with higher depression rates) to mechanistic evidence involving neuronal membrane fluidity and neurotransmitter signaling.',
    keyFindings: 'Nations with higher fish consumption have significantly lower rates of major depression. DHA constitutes 40% of the brain\'s polyunsaturated fatty acids; deficiencies impair neuronal membrane function, serotonin receptor density, and BDNF levels. EPA shows the strongest evidence for mood-related effects in clinical populations.',
    applicability: '1-2g combined EPA+DHA daily is the commonly recommended dose for mood and cognitive support. Algae-based omega-3 provides DHA without the fish source, making it suitable for vegans. Omega-3 is a high-value foundation supplement given its safety profile, low cost, and multiple mechanisms of action.',
    tags: ['omega-3', 'dha', 'epa', 'depression', 'mood', 'brain health', 'neuroplasticity'],
    evidenceQuality: 'Observational',
  },
  {
    id: 'phosphatidylserine-cognitive-decline',
    title: 'Double-blind, placebo-controlled study of phosphatidylserine in age-associated memory impairment',
    journal: 'Neurology',
    year: 1991,
    supplement: 'Phosphatidylserine',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/1944904/',
    relevance: 'This double-blind trial in 149 individuals with age-associated memory impairment was instrumental in earning phosphatidylserine an FDA-qualified health claim. It tested 100mg three times daily over 12 weeks in a population with objectively confirmed memory deficits.',
    keyFindings: 'Phosphatidylserine-treated subjects improved significantly on neuropsychological tests of learning and memory. Those with the most pronounced baseline impairment showed the greatest improvement. Responders were categorized as performing like individuals approximately 12 years younger in memory tasks after treatment.',
    applicability: 'The validated protocol is 100mg three times daily (300mg total) taken with meals. Benefits appear most pronounced for individuals with early signs of memory decline. For healthy younger adults, 100mg once or twice daily is commonly used for stress and working memory support.',
    tags: ['phosphatidylserine', 'memory', 'cognitive decline', 'aging', 'neuronal membrane'],
    evidenceQuality: 'RCT',
  },
  {
    id: 'rhodiola-fatigue-rct',
    title: 'Randomized trial of Rhodiola rosea extract in students with stress-related fatigue',
    journal: 'Phytomedicine',
    year: 2009,
    supplement: 'Rhodiola Rosea',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/19216852/',
    relevance: 'This double-blind RCT examined Rhodiola rosea in 60 students experiencing burnout and stress-related fatigue during examination periods — a practically relevant test population. It assessed both subjective fatigue measures and objective performance indicators.',
    keyFindings: 'Rhodiola significantly reduced mental fatigue, improved well-being, and enhanced performance on cognitive tests including Stroop tests and arithmetic tasks compared to placebo. Effects were noted within the first week of supplementation. The extract standardized to 3% rosavins was used.',
    applicability: '200-400mg of a standardized Rhodiola extract (3% rosavins, 1% salidroside) taken in the morning is the evidence-based protocol. Rhodiola is best cycled (e.g., 5 days on, 2 days off) to prevent tolerance. Avoid evening dosing as it can interfere with sleep due to mild stimulant properties.',
    tags: ['rhodiola', 'fatigue', 'stress', 'adaptogen', 'mental performance', 'burnout'],
    evidenceQuality: 'RCT',
  },
  {
    id: 'magnesium-sleep-rct',
    title: 'The effect of magnesium supplementation on primary insomnia in elderly: A double-blind placebo-controlled clinical trial',
    journal: 'Journal of Research in Medical Sciences',
    year: 2012,
    supplement: 'Magnesium Glycinate',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/23853635/',
    relevance: 'This double-blind RCT in 46 elderly individuals with insomnia evaluated magnesium supplementation on objective sleep measures including polysomnography, serum cortisol, and renin levels over 8 weeks. It is one of the cleanest human trials for magnesium\'s sleep mechanisms.',
    keyFindings: 'Magnesium significantly improved subjective sleep quality, sleep onset time, sleep efficiency, and morning cortisol levels versus placebo. Serum melatonin rose and serum cortisol fell in the magnesium group. Sleep time increased by 17 minutes on average versus controls.',
    applicability: 'Magnesium glycinate or threonate are the preferred forms for sleep and anxiety purposes due to their superior bioavailability and gentleness on digestion. 200-400mg elemental magnesium taken 30-60 minutes before bed is the practical protocol derived from this evidence.',
    tags: ['magnesium', 'sleep', 'insomnia', 'cortisol', 'melatonin', 'anxiety'],
    evidenceQuality: 'RCT',
  },
  {
    id: 'creatine-brain-energy',
    title: 'Oral creatine monohydrate supplementation improves brain performance: a double-blind, placebo-controlled, cross-over trial',
    journal: 'Proceedings of the Royal Society B',
    year: 2003,
    supplement: 'Creatine Monohydrate',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/14561278/',
    relevance: 'This crossover RCT directly tested whether creatine supplementation improves brain energy metabolism and cognitive performance in healthy adults. It used 31P-MRS brain imaging to confirm creatine\'s effect on cerebral phosphocreatine levels alongside cognitive tests.',
    keyFindings: 'Creatine supplementation (5g/day for 6 weeks) significantly improved working memory performance and intelligence test scores. Brain creatine levels measurably increased on imaging. Effects were most pronounced on tasks requiring high mental effort and processing speed under load.',
    applicability: '3-5g/day of creatine monohydrate is the established cognitive protocol — the same dose used for athletic performance. No loading phase is necessary for cognitive benefits. Creatine is particularly useful for vegetarians (who have lower baseline brain creatine) and for maintaining cognition during sleep deprivation.',
    tags: ['creatine', 'working memory', 'brain energy', 'atp', 'cognitive performance'],
    evidenceQuality: 'RCT',
  },
  {
    id: 'nmn-aging-rct',
    title: 'Nicotinamide mononucleotide supplementation reverses vascular dysfunction and oxidative stress with aging in mice',
    journal: 'Cell Metabolism',
    year: 2016,
    supplement: 'NMN',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/27304508/',
    relevance: 'This study demonstrated that NMN reverses age-related vascular dysfunction in mice by restoring NAD+ levels and mitochondrial function. It became one of the foundational papers launching the NMN supplementation trend and informed subsequent human pilot trials now underway.',
    keyFindings: 'NMN supplementation restored NAD+ levels in aged mice to those of younger animals, reversed declines in endurance capacity, improved arterial function, and reduced oxidative stress markers. Muscle mitochondrial function normalized toward youthful baseline after 8 weeks of treatment.',
    applicability: 'Human NMN research is still emerging, with trials suggesting 250-500mg/day is well tolerated and increases blood NAD+ levels. Until larger human RCTs are complete, NMN is best considered a longevity-oriented intervention rather than an acute cognitive enhancer. Sublingual forms may improve bioavailability.',
    tags: ['nmn', 'nad+', 'aging', 'longevity', 'mitochondria', 'cellular energy'],
    evidenceQuality: 'Animal',
  },
  {
    id: 'coq10-mitochondria',
    title: 'Coenzyme Q10 in the treatment of hypertension: a meta-analysis of the clinical trials',
    journal: 'Journal of Human Hypertension',
    year: 2007,
    supplement: 'CoQ10',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/17287847/',
    relevance: 'This meta-analysis of 12 clinical trials covering 362 patients investigated CoQ10\'s effects on blood pressure and cardiovascular markers. While focused on cardiovascular outcomes, the meta-analysis also establishes CoQ10\'s safety profile and mitochondrial mechanisms relevant to brain energy support.',
    keyFindings: 'CoQ10 supplementation reduced systolic blood pressure by up to 17mmHg and diastolic by up to 10mmHg without significant adverse effects. The effect was attributed to improved mitochondrial function and reduced oxidative stress — mechanisms directly applicable to brain energy metabolism.',
    applicability: '100-300mg/day of CoQ10 in ubiquinol form (preferred for those over 40) is the evidence-based range. CoQ10 is depleted by statin medications, making supplementation particularly relevant for statin users. It stacks well with NMN and omega-3 as part of a mitochondrial support protocol.',
    tags: ['coq10', 'mitochondria', 'energy', 'ubiquinol', 'antioxidant', 'statins'],
    evidenceQuality: 'Meta-Analysis',
  },
  {
    id: 'citicoline-stroke',
    title: 'Citicoline in the treatment of acute ischemic stroke: an international, randomized, multicentre, placebo-controlled study',
    journal: 'Journal of Neurology, Neurosurgery & Psychiatry',
    year: 2000,
    supplement: 'Citicoline',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/10896698/',
    relevance: 'This international multicentre RCT tested citicoline (CDP-choline) in 259 acute ischemic stroke patients, establishing citicoline\'s neuroprotective mechanisms at a clinical level. The study provides the strongest mechanistic evidence for citicoline\'s role in supporting neuronal membrane integrity.',
    keyFindings: 'Citicoline-treated patients showed significantly better neurological outcomes at 12 weeks, with a higher proportion achieving complete or near-complete recovery on the Barthel Index. Citicoline reduced infarct volume on imaging and demonstrated neuroprotective effects through membrane phospholipid restoration.',
    applicability: 'For healthy adults using citicoline as a nootropic, 250-500mg/day is the standard range. Citicoline is exceptionally well tolerated and provides a choline source that also supports dopamine synthesis — making it arguably superior to Alpha GPC as an all-around choline supplement for daily use.',
    tags: ['citicoline', 'cdp-choline', 'neuroprotection', 'choline', 'stroke', 'neuronal membrane'],
    evidenceQuality: 'RCT',
  },
  {
    id: 'panax-ginseng-working-memory',
    title: 'Dose-dependent effects of Panax ginseng on cognitive performance and mood following acute administration in healthy young volunteers',
    journal: 'Nutritional Neuroscience',
    year: 2010,
    supplement: 'Panax Ginseng',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/20681974/',
    relevance: 'This dose-ranging RCT in healthy volunteers tested three doses of Panax ginseng (200mg, 400mg, 600mg) versus placebo on the same day in a crossover design. It established the acute cognitive effects of ginseng on working memory and attention — relevant for single-dose supplementation.',
    keyFindings: '200mg of standardized Panax ginseng significantly improved working memory accuracy and quality of memory on a Cognitive Drug Research battery. Higher doses did not produce proportionally greater effects, suggesting a non-linear dose-response. Calmness ratings increased at 400mg.',
    applicability: '200-400mg of a standardized Panax ginseng extract (containing ginsenosides) appears to be the optimal dose range for working memory support. Ginseng can be taken acutely before cognitively demanding tasks or as a daily supplement. Cycle with Rhodiola for a complementary adaptogenic pairing.',
    tags: ['panax ginseng', 'working memory', 'attention', 'ginsenosides', 'adaptogen', 'focus'],
    evidenceQuality: 'RCT',
  },
  {
    id: 'melatonin-sleep-meta',
    title: 'Meta-analysis: Melatonin for the treatment of primary sleep disorders',
    journal: 'PLOS ONE',
    year: 2013,
    supplement: 'Melatonin',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/23930130/',
    relevance: 'This meta-analysis synthesized 19 studies covering 1683 subjects on melatonin\'s effects on primary sleep disorders. It is the most comprehensive quantitative review of melatonin\'s efficacy for sleep onset, duration, and quality — directly informing dosing recommendations.',
    keyFindings: 'Melatonin significantly reduced sleep onset latency by 7.06 minutes, increased total sleep time by 8.25 minutes, and improved overall sleep quality versus placebo. Effect sizes were modest but consistent across studies. Doses above 0.5mg did not improve efficacy — suggesting most commercial doses (3-10mg) are far higher than necessary.',
    applicability: '0.5-1mg taken 30-60 minutes before bed is the evidence-supported dose for sleep onset — dramatically lower than most commercial products. Higher doses may cause grogginess and next-day sedation without improving sleep quality. Melatonin is most effective for circadian rhythm disruption (jet lag, shift work) rather than chronic insomnia.',
    tags: ['melatonin', 'sleep', 'sleep onset', 'circadian', 'insomnia', 'jet lag'],
    evidenceQuality: 'Meta-Analysis',
  },
];

const supplementOptions = Array.from(new Set(studies.map(s => s.supplement))).sort();
const evidenceOptions = ['Meta-Analysis', 'RCT', 'Observational', 'Animal'];

export function ResearchLibraryPage() {
  const [query, setQuery] = useState('');
  const [supplementFilter, setSupplementFilter] = useState('all');
  const [evidenceFilter, setEvidenceFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return studies.filter(study => {
      const matchesQuery = !q ||
        study.title.toLowerCase().includes(q) ||
        study.supplement.toLowerCase().includes(q) ||
        study.tags.some(t => t.toLowerCase().includes(q)) ||
        study.journal.toLowerCase().includes(q);
      const matchesSupplement = supplementFilter === 'all' || study.supplement === supplementFilter;
      const matchesEvidence = evidenceFilter === 'all' || study.evidenceQuality === evidenceFilter;
      return matchesQuery && matchesSupplement && matchesEvidence;
    });
  }, [query, supplementFilter, evidenceFilter]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="w-5 h-5 text-blue-600" />
          <Badge variant="outline" className="text-xs">Research Library</Badge>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Nootropics Research Library</h1>
        <p className="text-gray-600 mt-2">
          Peer-reviewed studies with plain-English summaries — so you know what the evidence actually says.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by supplement, keyword, or journal..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={supplementFilter} onValueChange={setSupplementFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Supplements" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Supplements</SelectItem>
            {supplementOptions.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={evidenceFilter} onValueChange={setEvidenceFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Evidence Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Evidence Types</SelectItem>
            {evidenceOptions.map(e => (
              <SelectItem key={e} value={e}>{e}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-gray-500">
        Showing {filtered.length} of {studies.length} studies
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-14 text-center">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-1">No studies match your filters</p>
          <p className="text-sm text-gray-400">Try a different keyword or clear the filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(study => (
            <div key={study.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="p-5 pb-3">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className={`text-xs border ${EVIDENCE_BADGE[study.evidenceQuality]}`}>
                    {study.evidenceQuality}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                    {study.supplement}
                  </Badge>
                  <span className="text-xs text-gray-400 ml-auto">
                    {study.journal} &middot; {study.year}
                  </span>
                </div>

                <a
                  href={study.pubmedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-2"
                >
                  <h2 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-blue-700 transition-colors">
                    {study.title}
                  </h2>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors mt-0.5" />
                </a>

                <div className="flex flex-wrap gap-1 mt-3">
                  {study.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 px-5">
                <Accordion type="single" collapsible>
                  <AccordionItem value="relevance">
                    <AccordionTrigger className="text-xs font-medium text-gray-500 py-3 hover:no-underline hover:text-gray-900">
                      Relevance
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600 leading-relaxed">{study.relevance}</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="findings">
                    <AccordionTrigger className="text-xs font-medium text-gray-500 py-3 hover:no-underline hover:text-gray-900">
                      Key Findings
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600 leading-relaxed">{study.keyFindings}</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="applicability">
                    <AccordionTrigger className="text-xs font-medium text-gray-500 py-3 hover:no-underline hover:text-gray-900">
                      Supplementation Takeaway
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600 leading-relaxed">{study.applicability}</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      )}

      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>Educational purposes only.</strong> Summaries are simplified interpretations for general education. Read the full studies before making any health decisions. This content does not constitute medical advice.
        </AlertDescription>
      </Alert>

      <Separator className="bg-gray-200" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/start-here" className="p-6 rounded-xl border border-gray-200 bg-white text-center hover:border-blue-300 hover:shadow-sm transition-all">
          <BookOpenCheck className="w-6 h-6 text-blue-600 mx-auto mb-3" />
          <h2 className="font-semibold text-gray-900 mb-2">New to nootropics?</h2>
          <p className="text-xs text-gray-500 mb-4">
            Start with our beginner's guide before diving into the research.
          </p>
          <span className="text-sm text-blue-600 flex items-center justify-center gap-1">
            Start Here <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
        <Link to="/" className="p-6 rounded-xl border border-blue-200 bg-blue-50 text-center hover:border-blue-400 hover:shadow-sm transition-all">
          <FlaskConical className="w-6 h-6 text-blue-600 mx-auto mb-3" />
          <h2 className="font-semibold text-gray-900 mb-2">Build your stack</h2>
          <p className="text-xs text-gray-500 mb-4">
            Use the research to inform a personalized nootropic protocol.
          </p>
          <span className="text-sm text-blue-600 flex items-center justify-center gap-1">
            Stack Builder <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
