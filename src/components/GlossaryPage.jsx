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
