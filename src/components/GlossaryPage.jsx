import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Search, BookOpen } from 'lucide-react';

const glossaryTerms = [
  { term: 'Acetylcholine', definition: 'A neurotransmitter involved in memory, learning, and muscle contraction. Many nootropics (racetams, choline sources) work by enhancing acetylcholine signaling.', tags: ['neurotransmitter'] },
  { term: 'Adaptogen', definition: 'A class of herbs and mushrooms that help the body resist physical, chemical, and biological stress. Examples include ashwagandha, rhodiola, and reishi. They work by modulating the HPA axis and cortisol response.', tags: ['category'] },
  { term: 'Alpha-GPC', definition: 'Alpha-glycerophosphocholine. A highly bioavailable choline source that crosses the blood-brain barrier. Commonly paired with racetams to support acetylcholine production.', tags: ['compound', 'choline'] },
  { term: 'Bioavailability', definition: 'The proportion of a substance that enters circulation and reaches its target site when introduced into the body. Higher bioavailability means more of the compound actually gets used. Piperine increases curcumin bioavailability by 2000%.', tags: ['concept'] },
  { term: 'Blood-Brain Barrier (BBB)', definition: 'A selective membrane that separates circulating blood from brain tissue. Only certain molecules can cross it. Many nootropics are specifically designed or selected because they pass through the BBB effectively.', tags: ['concept'] },
  { term: 'Choline', definition: 'An essential nutrient and precursor to acetylcholine. Dietary choline is often insufficient for optimal brain function, which is why choline supplements (Alpha-GPC, Citicoline) are foundational in many stacks.', tags: ['nutrient'] },
  { term: 'Citicoline (CDP-Choline)', definition: 'Cytidine diphosphate-choline. A choline source that also provides cytidine (which converts to uridine). Supports both acetylcholine synthesis and cell membrane integrity. Some prefer it over Alpha-GPC for its additional neuroprotective properties.', tags: ['compound', 'choline'] },
  { term: 'Cortisol', definition: 'The body\'s primary stress hormone, produced by the adrenal glands. Chronically elevated cortisol impairs memory, reduces focus, and disrupts sleep. Adaptogens like ashwagandha lower cortisol levels.', tags: ['hormone'] },
  { term: 'Cycling', definition: 'The practice of taking scheduled breaks from a supplement to prevent tolerance buildup and maintain effectiveness. Common with stimulants like caffeine and phenylpiracetam. Typical cycles: 5 days on / 2 days off, or 4 weeks on / 1 week off.', tags: ['practice'] },
  { term: 'Diminishing Returns', definition: 'The principle that adding more of the same type of supplement produces progressively smaller benefits. Stacking three stimulants doesn\'t triple your focus — it just increases side effects. Smart stacking targets different mechanisms instead.', tags: ['concept'] },
  { term: 'Dopamine', definition: 'A neurotransmitter associated with motivation, reward, focus, and pleasure. Compounds like tyrosine, mucuna pruriens, and modafinil influence dopamine pathways. Too much dopamine stimulation can cause anxiety and tolerance.', tags: ['neurotransmitter'] },
  { term: 'GABA (Gamma-Aminobutyric Acid)', definition: 'The brain\'s primary inhibitory neurotransmitter. GABA promotes calm, reduces anxiety, and supports sleep. Compounds like phenibut, valerian, and kava work by enhancing GABA signaling. Direct GABA supplements have poor blood-brain barrier penetration.', tags: ['neurotransmitter'] },
  { term: 'Half-Life', definition: 'The time it takes for half of a substance to be eliminated from the body. Important for timing doses. Caffeine has a half-life of 5-6 hours; piracetam about 5 hours; modafinil 12-15 hours.', tags: ['concept'] },
  { term: 'HPLC (High-Performance Liquid Chromatography)', definition: 'An analytical testing method used to identify and quantify specific compounds in a supplement. The gold standard for verifying that a product contains what it claims. Look for "standardized by HPLC" on quality products.', tags: ['testing'] },
  { term: 'Mechanism of Action', definition: 'How a compound produces its effects at the biological level. Understanding mechanisms helps build better stacks — you want supplements that work through different mechanisms rather than stacking multiple compounds on the same pathway.', tags: ['concept'] },
  { term: 'Neuroplasticity', definition: 'The brain\'s ability to form new neural connections and reorganize existing ones. Lion\'s mane mushroom supports neuroplasticity through Nerve Growth Factor (NGF). Enhanced neuroplasticity is linked to better learning and recovery from brain injury.', tags: ['concept'] },
  { term: 'Nootropic', definition: 'A substance that enhances cognitive function — memory, focus, creativity, or motivation — with minimal side effects. Coined in 1972 by Romanian psychologist Corneliu Giurgea after developing piracetam. His original criteria required the substance to also protect the brain and have very low toxicity.', tags: ['concept'] },
  { term: 'NGF (Nerve Growth Factor)', definition: 'A protein that promotes the growth, maintenance, and survival of neurons. Lion\'s mane mushroom is the most well-known natural NGF stimulator. Higher NGF levels support learning, memory, and neural repair.', tags: ['protein'] },
  { term: 'Racetam', definition: 'A family of synthetic nootropics derived from piracetam, the first nootropic ever created. Members include aniracetam, oxiracetam, pramiracetam, and phenylpiracetam. They primarily enhance acetylcholine and glutamate signaling. Best paired with a choline source.', tags: ['category'] },
  { term: 'Serotonin', definition: 'A neurotransmitter involved in mood regulation, sleep, and appetite. 5-HTP and L-tryptophan are direct serotonin precursors. Caution: stacking multiple serotonergic compounds can risk serotonin syndrome, a potentially serious condition.', tags: ['neurotransmitter'] },
  { term: 'Spent Marc', definition: 'Plant residue left after bioactive compounds have been extracted. Some supplement suppliers repackage spent marc as extract. It passes species identification tests but contains minimal active compounds. A key quality concern in the supplement industry.', tags: ['quality'] },
  { term: 'Stack', definition: 'A combination of two or more supplements taken together for a specific purpose. A "focus stack" might include caffeine, L-theanine, and a choline source. Effective stacking combines compounds with complementary mechanisms and minimal redundancy.', tags: ['concept'] },
  { term: 'Standardized Extract', definition: 'An extract guaranteed to contain a specific percentage of the active compound. For example, "standardized to 5% withanolides" means each serving contains a verified amount of ashwagandha\'s primary bioactive. More reliable than extract ratio claims (10:1, 100:1).', tags: ['quality'] },
  { term: 'Synergy', definition: 'When two supplements produce a combined effect greater than the sum of their individual effects. The classic example: caffeine + L-theanine provides better focus and alertness than either alone, because L-theanine smooths caffeine\'s stimulatory edge.', tags: ['concept'] },
  { term: 'Vagus Nerve', definition: 'The longest cranial nerve, connecting the brain to the gut and other organs. A key pathway in the gut-brain axis. Vagus nerve signaling is how gut bacteria can influence mood, anxiety, and cognitive function.', tags: ['anatomy'] },
  { term: 'Withanolides', definition: 'The primary bioactive compounds in ashwagandha. Responsible for its adaptogenic, anti-anxiety, and cognitive benefits. Quality ashwagandha supplements are standardized to withanolide content (typically 2.5-5%).', tags: ['compound'] },
  { term: 'Adenosine', definition: 'A neurotransmitter that builds up in the brain throughout the day, creating "sleep pressure" — the feeling of tiredness. Caffeine works primarily by blocking adenosine receptors, masking fatigue without actually clearing the adenosine itself. During sleep, adenosine is metabolized and cleared, which is why proper sleep is essential for restored alertness.', tags: ['neurotransmitter'] },
  { term: 'Anandamide', definition: 'An endogenous cannabinoid (endocannabinoid) sometimes called the "bliss molecule" because of its role in mood, pleasure, and the "runner\'s high." Levels are elevated by aerobic exercise and certain foods like dark chocolate. CBD may indirectly support anandamide signaling by inhibiting the enzyme (FAAH) that breaks it down.', tags: ['neurotransmitter'] },
  { term: 'BDNF (Brain-Derived Neurotrophic Factor)', definition: 'A protein that supports the survival, growth, and differentiation of neurons and synapses. BDNF is central to neuroplasticity, learning, and long-term memory formation. Levels are increased by aerobic exercise, lion\'s mane, omega-3 DHA, and certain compounds like noopept.', tags: ['protein'] },
  { term: 'Glutamate', definition: 'The brain\'s primary excitatory neurotransmitter, essential for learning, memory, and synaptic plasticity. Racetams modulate AMPA glutamate receptors to enhance cognition. Excessive glutamate signaling can cause excitotoxicity — neuronal damage from overstimulation — which is why glutamatergic compounds should not be megadosed.', tags: ['neurotransmitter'] },
  { term: 'Histamine', definition: 'A neurotransmitter best known for allergy responses but also a key regulator of wakefulness and arousal in the brain. Modafinil partially exerts its wake-promoting effects by elevating histamine in the hypothalamus. Sedating antihistamines that cross the blood-brain barrier cause drowsiness by blocking this system.', tags: ['neurotransmitter'] },
  { term: 'HPA Axis', definition: 'The hypothalamic-pituitary-adrenal axis: a feedback loop between three glands that governs the body\'s stress response and cortisol release. Chronic activation of the HPA axis underlies stress-related cognitive impairment, fatigue, and mood issues. Adaptogens like ashwagandha and rhodiola work by helping normalize HPA axis activity.', tags: ['anatomy'] },
  { term: 'Norepinephrine (Noradrenaline)', definition: 'A neurotransmitter and stress hormone that drives focus, alertness, and the fight-or-flight response. L-tyrosine is its dietary precursor, which is why tyrosine supplementation can support cognition under stress. Most stimulants — including caffeine, modafinil, and amphetamines — increase norepinephrine activity.', tags: ['neurotransmitter'] },
  { term: 'Oxytocin', definition: 'A hormone and neuropeptide central to social bonding, trust, and emotional connection. Released during physical touch, eye contact, and meaningful social interaction. Some adaptogens and lifestyle practices may support healthy oxytocin levels, contributing to overall wellbeing and stress resilience.', tags: ['hormone'] },
  { term: 'Aniracetam', definition: 'A fat-soluble racetam often reported to combine cognitive enhancement with mild anxiolytic (anti-anxiety) effects. It modulates AMPA glutamate receptors and has activity at D2 dopamine and 5-HT2A serotonin receptors. Because it is fat-soluble, it should be taken with a meal containing fat, and pairing with a choline source is recommended.', tags: ['compound', 'racetam'] },
  { term: 'Bacosides', definition: 'The primary bioactive saponins in bacopa monnieri, responsible for its memory-enhancing and neuroprotective effects. Quality bacopa supplements are standardized to 45-55% bacosides. Effects build over 8-12 weeks of daily use, which makes consistency more important than dose with this herb.', tags: ['compound'] },
  { term: 'Beta-Glucans', definition: 'Polysaccharides found in the cell walls of medicinal mushrooms like lion\'s mane, reishi, and turkey tail. They serve as both quality markers and active immune-modulating compounds. High-quality mushroom extracts are standardized to 20-30% beta-glucans, distinguishing real fruiting-body extracts from grain-heavy mycelium products.', tags: ['compound', 'quality'] },
  { term: 'Black Pepper Extract (BioPerine/Piperine)', definition: 'Piperine is the active alkaloid in black pepper that inhibits liver enzymes responsible for metabolizing many supplements, dramatically increasing their bioavailability. Most famously, piperine increases curcumin absorption by roughly 20x. BioPerine is a standardized branded form used in many quality formulations.', tags: ['compound'] },
  { term: 'Caffeine Anhydrous', definition: 'Dehydrated, powdered caffeine commonly used in supplements and pre-workouts. Compared to caffeine from coffee, anhydrous caffeine offers faster, more consistent absorption and precise dosing. The tradeoff is the loss of beneficial coffee polyphenols and the easier potential to overshoot a dose.', tags: ['compound'] },
  { term: 'Creatine Monohydrate', definition: 'The most studied and cost-effective form of creatine. Daily use saturates muscle and brain creatine stores over 3-5 days at standard doses (3-5g). Unlike for athletic performance, no loading phase is required to capture cognitive benefits, which appear most pronounced under sleep deprivation and mental fatigue.', tags: ['compound'] },
  { term: 'Curcumin', definition: 'The primary active polyphenol in turmeric, with potent anti-inflammatory and neuroprotective properties. Standard curcumin has extremely poor bioavailability — most is excreted unchanged. Effective formulations pair it with piperine or use phospholipid complexes like Longvida or Meriva to increase absorption many-fold.', tags: ['compound'] },
  { term: 'Erinacines', definition: 'Bioactive diterpenoids found primarily in the mycelium of lion\'s mane mushroom. They cross the blood-brain barrier and stimulate Nerve Growth Factor (NGF) synthesis. High-quality lion\'s mane products specify both erinacine (mycelium) and hericenone (fruiting body) content rather than just total mushroom weight.', tags: ['compound'] },
  { term: 'Eurycomanone', definition: 'The primary bioactive quassinoid in tongkat ali (Eurycoma longifolia) and the most reliable marker of extract quality. Many products on the market under-deliver on eurycomanone content. Look for standardized extracts (such as 2% eurycomanone) rather than vague "10:1" or "200:1" ratio claims.', tags: ['compound'] },
  { term: 'Ginsenosides', definition: 'The bioactive saponins in ginseng species (panax, American, Korean) responsible for cognitive and adaptogenic effects. Quality panax ginseng is standardized to 5-8% ginsenosides. Different ginsenosides (Rg1, Rb1, Rd) have somewhat different effects, so total percentage is a useful but incomplete quality signal.', tags: ['compound'] },
  { term: 'Hericenones', definition: 'Bioactive aromatic compounds found in the fruiting body of lion\'s mane mushroom. Like erinacines from the mycelium, they stimulate NGF synthesis but through a different chemical class. The best lion\'s mane products use a dual extract that captures both fruiting body (hericenones) and mycelium (erinacines).', tags: ['compound'] },
  { term: 'KSM-66', definition: 'A branded, clinically studied ashwagandha root extract standardized to a minimum 5% withanolides. Produced via a green-chemistry, milk-free extraction process and used in the majority of modern human clinical trials on ashwagandha for stress, sleep, and cognition. Considered a gold-standard form for evidence-based use.', tags: ['compound', 'quality'] },
  { term: 'L-Tyrosine', definition: 'A non-essential amino acid that serves as the precursor to dopamine, norepinephrine, and thyroid hormone. Tyrosine supplementation is most beneficial under conditions that deplete catecholamines — acute stress, sleep deprivation, cold exposure, or stimulant use. NALT (N-Acetyl L-Tyrosine) is a more soluble form, though plain L-tyrosine is generally better absorbed.', tags: ['compound'] },
  { term: 'Longvida', definition: 'A patented phospholipid-based curcumin formulation engineered for substantially higher bioavailability and brain penetration than standard curcumin. Designed using solid lipid particle technology so that free curcumin reaches systemic circulation rather than being conjugated and excreted in the gut.', tags: ['compound', 'quality'] },
  { term: 'Mucuna Pruriens', definition: 'A tropical legume containing naturally occurring L-DOPA, the direct precursor to dopamine. Used traditionally in Ayurveda and modern stacks for mood, motivation, and libido. Requires careful dosing and cycling because sustained high-dose L-DOPA can downregulate dopamine receptors.', tags: ['compound'] },
  { term: 'N-Acetyl Cysteine (NAC)', definition: 'A precursor to glutathione, the body\'s master antioxidant. NAC has antioxidant and neuroprotective properties and is sometimes included in nootropic stacks for long-term cognitive protection. It also has well-documented uses in respiratory and liver health.', tags: ['compound'] },
  { term: 'Noopept', definition: 'A synthetic peptide-derived nootropic structurally related to the racetams but active at much lower doses (10-30mg vs. grams). It has been shown to elevate BDNF and NGF levels and is often described as having a faster-onset, more noticeable effect than piracetam, though the underlying research base is smaller.', tags: ['compound'] },
  { term: 'NMN (Nicotinamide Mononucleotide)', definition: 'A direct precursor to NAD+, a coenzyme central to cellular energy production and DNA repair. NAD+ levels decline with age, and NMN supplementation aims to restore them. Compared to NR, NMN is one step closer to NAD+ in the biosynthesis pathway.', tags: ['compound'] },
  { term: 'NR (Nicotinamide Riboside)', definition: 'Another NAD+ precursor and the first to be extensively studied in human clinical trials. Well-tolerated and effective at raising blood NAD+ levels. Often discussed alongside NMN for mitochondrial health, healthy aging, and cellular energy.', tags: ['compound'] },
  { term: 'Oxiracetam', definition: 'A racetam often described as having mild stimulant-like properties and pronounced effects on verbal fluency, logical thinking, and memory recall. Sometimes called the "study drug" racetam. Like other racetams, it benefits from being paired with a choline source.', tags: ['compound', 'racetam'] },
  { term: 'Phenylpiracetam', definition: 'A phenylated derivative of piracetam considered the most potent of the common racetams, with significant stimulant-like effects on focus and physical performance. Banned by WADA in competitive sports. Tolerance builds rapidly (often within 2-3 days of consecutive use), which makes strict cycling essential.', tags: ['compound', 'racetam'] },
  { term: 'Phosphatidylcholine', definition: 'A major phospholipid in cell membranes throughout the body and the brain. It serves as both a structural component of neuronal membranes and a source of choline for acetylcholine synthesis. Found naturally in egg yolks and soy lecithin.', tags: ['compound', 'choline'] },
  { term: 'Pramiracetam', definition: 'An oil-soluble racetam reported to have particularly strong memory-enhancing effects, though with a less stimulating subjective profile than phenylpiracetam. It is more expensive and less commonly used than piracetam, partly because dose-for-dose it is much more potent.', tags: ['compound', 'racetam'] },
  { term: 'Pterostilbene', definition: 'A naturally occurring resveratrol analog found in blueberries, with higher bioavailability and a longer half-life than resveratrol itself. Acts as a neuroprotective antioxidant and is sometimes included in cognitive longevity stacks alongside compounds like NMN or NR.', tags: ['compound'] },
  { term: 'Salidroside', definition: 'One of the two primary bioactive compounds in rhodiola rosea, alongside rosavin. Salidroside is most associated with rhodiola\'s anti-fatigue, energy, and stress-resilience effects. Quality rhodiola extracts are standardized to specific salidroside-to-rosavin ratios (often 1:3).', tags: ['compound'] },
  { term: 'Sensoril', definition: 'A branded ashwagandha extract derived from both the root and leaf, standardized to a minimum 10% withanolides. Its profile is distinct from KSM-66 — generally considered more sedating and stress-targeted, while KSM-66 is often used for daytime stress and performance.', tags: ['compound', 'quality'] },
  { term: 'Suntheanine', definition: 'A patented, fermentation-produced form of pure L-theanine at 99%+ purity. Used in most clinical trials investigating L-theanine for stress, focus, and the caffeine-theanine combination. Commodity L-theanine may contain a racemic mix of L- and D-theanine, with only the L-form being bioactive.', tags: ['compound', 'quality'] },
  { term: 'Uridine', definition: 'A nucleotide that converts to cytidine in the brain and supports dopamine receptor synthesis and neuronal cell membrane health. Uridine monophosphate is the common supplemental form. It is the foundation of the "Mr. Happy Stack," combining uridine with choline (alpha-GPC or CDP-choline) and omega-3 DHA.', tags: ['compound'] },
  { term: 'Vinpocetine', definition: 'A semi-synthetic compound derived from vincamine in the periwinkle plant. It is reported to improve cerebral blood flow and brain glucose utilization and is widely used in Eastern European medical practice for cognitive support. Should be avoided by those on blood thinners due to mild antiplatelet effects.', tags: ['compound'] },
  { term: 'Bioavailability Enhancement', definition: 'Deliberate strategies to improve how much of a supplement actually reaches systemic circulation. Common tactics include taking fat-soluble compounds with meals containing fat, using piperine to inhibit metabolic enzymes, and choosing better extract forms (e.g., Longvida curcumin over standard curcumin).', tags: ['concept'] },
  { term: 'Cholinergic', definition: 'Describes compounds, receptors, or pathways involving acetylcholine. Cholinergic supplements include alpha-GPC, citicoline, huperzine-A, and the racetams (which work indirectly through acetylcholine signaling). Boosting cholinergic activity supports memory, focus, and learning.', tags: ['concept'] },
  { term: 'Chronobiology', definition: 'The study of biological time cycles such as circadian and ultradian rhythms. Relevant to nootropics because hormones (cortisol, melatonin), sleep pressure (adenosine), and cognitive performance vary predictably across the day. Smart stacking aligns supplement timing with these natural cycles.', tags: ['concept'] },
  { term: 'Cognitive Reserve', definition: 'The brain\'s capacity to resist damage or age-related decline, built up through education, mental challenge, exercise, social engagement, and neuroprotective habits. Many long-term nootropic strategies aim to support cognitive reserve rather than produce immediate, perceptible cognitive boosts.', tags: ['concept'] },
  { term: 'Compounding Tolerances', definition: 'A pitfall of complex stacks: when several supplements all develop tolerance simultaneously, simply cycling one compound is no longer enough. The whole stack may need a coordinated washout to recover sensitivity, which is why minimalist stacks are often more sustainable.', tags: ['concept'] },
  { term: 'Dopaminergic', definition: 'Relating to dopamine pathways and signaling. Dopaminergic compounds include L-tyrosine, mucuna pruriens, stimulants like caffeine and modafinil, and certain adaptogens. Dopaminergic stacking supports motivation and focus but carries higher tolerance and downregulation risks than other categories.', tags: ['concept'] },
  { term: 'Evidence Tiers', definition: 'A practical hierarchy for evaluating supplement research: meta-analyses and systematic reviews are the strongest, followed by randomized controlled trials, observational studies, case reports, and finally anecdote. Most nootropic claims sit in the lower tiers, which warrants healthy skepticism even for well-marketed products.', tags: ['concept'] },
  { term: 'Excitotoxicity', definition: 'Neuronal damage caused by excessive glutamate signaling, where overstimulation leads to calcium overload and cell death. It is a theoretical concern with very high doses of glutamatergic racetams, and one reason why "more is better" is a poor strategy with cognitive enhancers.', tags: ['concept'] },
  { term: 'First-Pass Metabolism', definition: 'The metabolism of an orally taken compound by the gut wall and liver before it reaches systemic circulation. High first-pass metabolism reduces the effective dose and is a major reason oral curcumin, resveratrol, and many polyphenols have such low bioavailability without enhancement.', tags: ['concept'] },
  { term: 'Front-Loading', definition: 'Taking a higher initial dose at the start of a supplement protocol to reach effective tissue levels more quickly. Common with creatine (20g/day for 5-7 days) and sometimes used with bacopa. After saturation, users drop to a lower maintenance dose.', tags: ['practice'] },
  { term: 'GABAergic', definition: 'Relating to GABA pathways and signaling. GABAergic compounds promote calm and reduce anxiety, and include magnesium (especially glycinate and threonate), L-theanine, phenibut, valerian, and benzodiazepines (prescription only). Potent GABAergic compounds carry tolerance and dependence risks.', tags: ['concept'] },
  { term: 'Gut Microbiome', definition: 'The community of bacteria, fungi, and other microorganisms in the digestive tract. Increasingly linked to mood, cognition, and inflammation through the gut-brain axis (largely via the vagus nerve and microbial metabolites). Supports the case for diet, fiber, and fermented foods as foundational nootropics.', tags: ['concept'] },
  { term: 'Lipid Peroxidation', definition: 'Oxidative damage to the fatty acids in cell membranes, particularly relevant for the brain, which is exceptionally lipid-rich. Antioxidant compounds like CoQ10, resveratrol, pterostilbene, and curcumin help defend against this damage and are common pillars of long-term cognitive protection stacks.', tags: ['concept'] },
  { term: 'Microdosing', definition: 'Taking sub-perceptual or near-threshold doses of an active compound on a structured schedule. Originally popularized with psychedelics, the term is also applied to low-dose modafinil or stimulant protocols intended to capture some benefit while minimizing side effects and tolerance.', tags: ['practice'] },
  { term: 'Mr. Happy Stack', definition: 'A popular nootropic combination targeting dopaminergic and cholinergic systems simultaneously: uridine monophosphate, alpha-GPC (or CDP-choline), and omega-3 DHA. Designed around the idea that uridine supports dopamine receptor synthesis while choline and DHA build healthy neuronal membranes.', tags: ['concept'] },
  { term: 'Neurogenesis', definition: 'The formation of new neurons. Once thought impossible in adult brains, it is now known to occur in the hippocampus throughout life. Aerobic exercise, lion\'s mane, BDNF-elevating activity, sleep, and learning all support hippocampal neurogenesis.', tags: ['concept'] },
  { term: 'Neuroprotection', definition: 'Strategies and compounds that protect neurons from damage, oxidative stress, inflammation, and premature death. Many well-known nootropics — lion\'s mane, bacopa, curcumin, omega-3s, NAC — have neuroprotective effects as a primary or secondary mechanism alongside their cognitive benefits.', tags: ['concept'] },
  { term: 'On/Off Protocol', definition: 'A structured schedule that alternates supplement use with rest periods to prevent tolerance and let receptors reset. Common patterns include 5 days on / 2 days off (matching a workweek) or 4 weeks on / 1 week off. Most relevant for stimulants, dopaminergics, and GABAergics.', tags: ['practice'] },
  { term: 'Orthomolecular Medicine', definition: 'A therapeutic approach that uses nutrients — vitamins, minerals, amino acids — at doses higher than typical dietary intake. The philosophy underlies many vitamin- and mineral-based nootropic protocols, though it remains controversial within mainstream medicine.', tags: ['concept'] },
  { term: 'Peak Plasma Concentration (Cmax)', definition: 'The highest blood concentration a compound reaches after dosing, and the time to reach it (Tmax). Knowing Cmax/Tmax helps time stack components so that synergistic compounds peak together, which matters for combinations like caffeine + L-theanine.', tags: ['concept'] },
  { term: 'Polypharmacy Risk', definition: 'The cumulative risk that comes with taking many supplements simultaneously: hidden interactions, additive side effects, and difficulty isolating the cause when something feels off. A reason to keep stacks lean and to introduce changes one variable at a time.', tags: ['concept'] },
  { term: 'Potentiation', definition: 'When one compound enhances the effect of another beyond what simple addition would predict. Piperine potentiates curcumin (by inhibiting its metabolism); L-theanine potentiates caffeine (by smoothing its stimulatory profile). Potentiation is the goal of intelligent stacking.', tags: ['concept'] },
  { term: 'Pre-Frontal Cortex (PFC)', definition: 'The brain region behind the forehead responsible for executive functions: working memory, decision-making, planning, and focused attention. Most cognitive-enhancing nootropics target the PFC directly or indirectly via dopaminergic, cholinergic, or noradrenergic input.', tags: ['anatomy'] },
  { term: 'Racetam Headache', definition: 'A common side effect of racetam use, generally attributed to increased acetylcholine demand outpacing supply. Usually resolved by adding a quality choline source (alpha-GPC or citicoline). If headaches persist despite adequate choline, the dose or compound may not be a fit.', tags: ['concept'] },
  { term: 'Rebound Effect', definition: 'A temporary worsening of the symptoms a supplement was suppressing, occurring when use is stopped. Caffeine produces rebound headaches and fatigue; some sleep aids cause rebound insomnia. Tapering rather than abruptly stopping helps minimize rebound effects.', tags: ['concept'] },
  { term: 'Serotonin Syndrome', definition: 'A rare but potentially serious condition caused by excessive serotonergic activity, typically from combining multiple serotonin-affecting compounds (5-HTP, SSRIs, SNRIs, MAOIs, St. John\'s Wort, MDMA). Symptoms include agitation, tremor, sweating, elevated heart rate, and in severe cases, hyperthermia and confusion. Always research interactions before stacking serotonergics.', tags: ['concept'] },
  { term: 'Stacking Principles', definition: 'Guidelines for combining supplements effectively: diversify mechanisms rather than doubling up on one pathway, avoid redundancy (e.g., two strong stimulants), respect interactions, start with a minimal stack, and add one compound at a time so you can attribute effects accurately.', tags: ['concept'] },
  { term: 'Tachyphylaxis', definition: 'Rapid tolerance development, sometimes within hours or days of repeated dosing. Particularly relevant with potent stimulants like phenylpiracetam, where users may notice diminishing returns after just 2-3 consecutive days. Strict cycling is the primary countermeasure.', tags: ['concept'] },
  { term: 'Thermogenic', definition: 'Compounds that increase metabolic rate and heat production. Many stimulant nootropics — caffeine, L-tyrosine in stress contexts, some ephedra alternatives — have thermogenic properties as a side effect, which can be useful for energy or problematic when stacked carelessly with other stimulants.', tags: ['concept'] },
  { term: 'Tolerance', definition: 'A reduced response to a substance after repeated use, requiring higher doses for the same effect. Driven by receptor downregulation, enzyme induction, or compensatory neurochemistry. Managed through cycling, dose rotation, mechanism diversity, and washout periods rather than dose escalation.', tags: ['concept'] },
  { term: 'Washout Period', definition: 'A planned break from a supplement to allow receptor sensitivity and downstream pathways to reset. Typical washouts run 1-4 weeks depending on the compound and how long it has been used. Often built into longer-term protocols rather than reserved as a fix when tolerance becomes obvious.', tags: ['practice'] },
  { term: 'Certificate of Analysis (CoA)', definition: 'A lab-test document verifying a supplement batch\'s identity, potency, and purity (heavy metals, microbes, residual solvents). Quality companies publish CoAs on a per-batch basis. The presence — and transparency — of CoAs is one of the strongest signals of a trustworthy brand.', tags: ['quality'] },
  { term: 'cGMP (Current Good Manufacturing Practices)', definition: 'FDA manufacturing quality standards for dietary supplements. cGMP-certified facilities follow documented procedures for sourcing, testing, production, and record-keeping. cGMP is a baseline expectation rather than a premium credential, but its absence is a serious red flag.', tags: ['quality'] },
  { term: 'Heavy Metal Testing', definition: 'Testing finished products for contaminants like lead, mercury, arsenic, and cadmium. Especially important for mushroom supplements (which bioaccumulate metals), greens powders, and herbs sourced from regions with industrial contamination. Quality brands publish heavy-metal results on their CoAs.', tags: ['quality'] },
  { term: 'Mycelium on Grain (MOG)', definition: 'A common production method where mushroom mycelium is grown on a grain substrate and the entire mass is dried and powdered together. The result is a product diluted by significant grain starch, often with low beta-glucan content. Many "mushroom" supplements on the market are MOG, which is why fruiting-body extracts standardized to beta-glucans command higher trust.', tags: ['quality'] },
  { term: 'NSF Certified', definition: 'A third-party certification from NSF International verifying that a supplement\'s contents match its label and that it is free of unlabeled or banned substances. Stricter than basic cGMP and widely used by professional and Olympic athletes who must avoid contamination-driven failed drug tests.', tags: ['quality'] },
  { term: 'Proprietary Blend', definition: 'A label format that lists ingredients together under a blend name with only the total weight, not the dose of each individual ingredient. This obscures under-dosing and makes it impossible to compare to clinical research. Transparent, fully disclosed labels are a hallmark of higher-quality supplements.', tags: ['quality'] },
  { term: 'USP Verified', definition: 'A certification mark from the United States Pharmacopeia confirming a supplement\'s ingredient identity, declared potency, purity, and manufacturing quality. Considered one of the highest consumer trust marks in the U.S. supplement market, though relatively few products carry it.', tags: ['quality'] },
];

export function GlossaryPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return glossaryTerms;
    const q = search.toLowerCase();
    return glossaryTerms.filter(
      t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q))
    );
  }, [search]);

  // Group by first letter
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(term => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filtered]);

  const letters = Object.keys(grouped).sort();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Nootropics Glossary
        </h1>
        <p className="text-gray-600 mt-2">Key terms, compounds, and concepts in nootropic stacking — explained plainly.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search terms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Letter nav */}
      <div className="flex flex-wrap gap-1">
        {letters.map(letter => (
          <a
            key={letter}
            href={`#glossary-${letter}`}
            className="w-8 h-8 flex items-center justify-center rounded text-sm font-medium bg-gray-100 hover:bg-blue-100 hover:text-blue-700 transition-colors"
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Terms */}
      {letters.map(letter => (
        <div key={letter} id={`glossary-${letter}`}>
          <h2 className="text-lg font-bold text-gray-400 mb-2 border-b pb-1">{letter}</h2>
          <div className="space-y-3">
            {grouped[letter].map(item => (
              <Card key={item.term} className="hover:shadow-sm transition-shadow">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.term}</h3>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.definition}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs capitalize">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-8">No terms match your search.</p>
      )}
    </div>
  );
}
