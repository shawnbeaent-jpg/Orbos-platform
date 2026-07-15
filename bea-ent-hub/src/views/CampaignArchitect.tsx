import React, { useState } from 'react';
import { Sparkles, Wand2, CheckCircle2, Circle } from 'lucide-react';
import { useApp, useCurrentArtist } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, statusTone } from '../components/ui';
import { LyricalDNAResult, RolloutGoal, RolloutStrategy } from '../types';

const GOALS: RolloutGoal[] = ['Single', 'EP', 'Album', 'Tour'];
const STRATEGIES: RolloutStrategy[] = ['Executive Infiltration', 'Neural Viral Blitz', 'Slow Burn Legacy', 'Grassroots Ascension'];

const SENTIMENT_KEYWORDS: Record<string, LyricalDNAResult['sentiment']> = {
  love: 'Romantic', heart: 'Romantic', miss: 'Romantic',
  cry: 'Melancholic', alone: 'Melancholic', gone: 'Melancholic',
  rise: 'Defiant', win: 'Defiant', crown: 'Defiant', throne: 'Defiant',
  mirror: 'Introspective', think: 'Introspective', wonder: 'Introspective',
  fire: 'Aggressive', war: 'Aggressive', grind: 'Aggressive',
};

function analyzeLyrics(lyrics: string): LyricalDNAResult {
  const words = lyrics.toLowerCase().split(/\W+/).filter(Boolean);
  const counts: Record<string, number> = {};
  for (const w of words) {
    const sentiment = SENTIMENT_KEYWORDS[w];
    if (sentiment) counts[sentiment] = (counts[sentiment] ?? 0) + 1;
  }
  const sentiment = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as LyricalDNAResult['sentiment']) ?? 'Euphoric';
  const uniqueWords = Array.from(new Set(words.filter((w) => w.length > 4))).slice(0, 6);
  return {
    sentiment,
    narratives: ['Personal transformation arc', 'Tension between ambition and loyalty', 'Nostalgia for origin city'],
    targetDemographic: '18–29, urban & suburban Southeast, high short-form video engagement',
    keywordSuggestions: uniqueWords.length > 0 ? uniqueWords : ['legacy', 'momentum', 'skyline', 'proof'],
  };
}

const CampaignArchitect: React.FC = () => {
  const { campaigns, addCampaign, toggleMilestone } = useApp();
  const artist = useCurrentArtist();
  const [goal, setGoal] = useState<RolloutGoal>('Single');
  const [strategy, setStrategy] = useState<RolloutStrategy>('Executive Infiltration');
  const [lyrics, setLyrics] = useState('');
  const [dna, setDna] = useState<LyricalDNAResult | null>(null);

  const artistCampaigns = campaigns.filter((c) => (artist ? c.artistId === artist.id : true));

  const handleGenerate = () => {
    if (!artist) return;
    addCampaign({
      id: `camp-${Date.now()}`,
      artistId: artist.id,
      title: `${artist.name} — ${goal} Rollout`,
      goal,
      strategy,
      phase: 'Awareness',
      progressPct: 4,
      milestones: [
        { id: `ms-${Date.now()}-1`, label: 'Define rollout messaging pillars', done: false, dueDate: '2026-08-01' },
        { id: `ms-${Date.now()}-2`, label: 'Lock creative asset batch', done: false, dueDate: '2026-08-08' },
        { id: `ms-${Date.now()}-3`, label: 'Curator + press seeding wave', done: false, dueDate: '2026-08-15' },
      ],
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="AI Rollout Planner"
        title="Campaign Architect"
        description="Blueprint a multi-phase rollout and extract the lyrical DNA of your next release before you spend a dollar promoting it."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle sub="Select goal & strategy, then generate a phased roadmap">
            <span className="inline-flex items-center gap-2"><Sparkles size={16} className="text-gold-400" /> Rollout Blueprint</span>
          </SectionTitle>
          <div className="mb-4">
            <p className="label-mono mb-2">Release Goal</p>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <button key={g} onClick={() => setGoal(g)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${goal === g ? 'border-gold-500/50 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-500 hover:border-gold-500/30'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <p className="label-mono mb-2">Rollout Strategy</p>
            <div className="flex flex-wrap gap-2">
              {STRATEGIES.map((s) => (
                <button key={s} onClick={() => setStrategy(s)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${strategy === s ? 'border-gold-500/50 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-500 hover:border-gold-500/30'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerate} className="btn-gold w-full">
            <Wand2 size={15} /> Generate Roadmap Tactics
          </button>
        </Card>

        <Card>
          <SectionTitle sub="Paste lyrics to extract themes, sentiment, and targeting">
            <span className="inline-flex items-center gap-2"><Sparkles size={16} className="text-gold-400" /> Lyrical DNA Analyzer</span>
          </SectionTitle>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Paste your verse or hook here..."
            rows={5}
            className="input-dark mb-3 resize-none"
          />
          <button onClick={() => setDna(analyzeLyrics(lyrics || 'rise fire crown mirror'))} className="btn-ghost w-full">
            Analyze Lyrical DNA
          </button>
          {dna && (
            <div className="mt-4 space-y-3 rounded-lg border border-gold-500/20 bg-gold-500/5 p-4">
              <div>
                <p className="label-mono mb-1">Core Sentiment</p>
                <Badge tone="gold">{dna.sentiment}</Badge>
              </div>
              <div>
                <p className="label-mono mb-1">Narratives</p>
                <ul className="list-inside list-disc text-xs text-charcoal-500">
                  {dna.narratives.map((n) => <li key={n}>{n}</li>)}
                </ul>
              </div>
              <div>
                <p className="label-mono mb-1">Target Demographic</p>
                <p className="text-xs text-charcoal-500">{dna.targetDemographic}</p>
              </div>
              <div>
                <p className="label-mono mb-1">Keyword Suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {dna.keywordSuggestions.map((k) => <Badge key={k}>{k}</Badge>)}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 space-y-4">
        {artistCampaigns.map((c) => (
          <Card key={c.id}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-serif text-lg text-gold-100">{c.title}</p>
                <p className="label-mono mt-0.5">{c.goal} · {c.strategy}</p>
              </div>
              <Badge tone={statusTone(c.phase === 'Conversion' ? 'Completed' : 'Pending')}>{c.phase}</Badge>
            </div>
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300" style={{ width: `${c.progressPct}%` }} />
            </div>
            <div className="space-y-1.5">
              {c.milestones.map((m) => (
                <button key={m.id} onClick={() => toggleMilestone(c.id, m.id)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-white/[0.03]">
                  {m.done ? <CheckCircle2 size={16} className="text-gold-400" /> : <Circle size={16} className="text-charcoal-600" />}
                  <span className={m.done ? 'text-charcoal-600 line-through' : 'text-charcoal-500'}>{m.label}</span>
                  <span className="label-mono ml-auto">{m.dueDate}</span>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignArchitect;
