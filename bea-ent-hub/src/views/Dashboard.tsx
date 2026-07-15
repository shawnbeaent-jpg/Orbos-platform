import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Radio, TrendingUp, ListChecks, Wallet } from 'lucide-react';
import { useApp, useCurrentArtist } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, StatTile, formatCents, statusTone } from '../components/ui';
import { UserRole } from '../types';

const GROWTH_SERIES = [
  { month: 'Feb', listeners: 96_000 },
  { month: 'Mar', listeners: 112_400 },
  { month: 'Apr', listeners: 128_900 },
  { month: 'May', listeners: 149_200 },
  { month: 'Jun', listeners: 168_500 },
  { month: 'Jul', listeners: 184_320 },
];

const Dashboard: React.FC = () => {
  const { currentUser, tasks, bookings, invoices, beats, commissionDefaultPct } = useApp();
  const artist = useCurrentArtist();
  const role = currentUser?.role;

  const myTasks = tasks.filter((t) => (artist ? t.artistId === artist.id : true));
  const openTasks = myTasks.filter((t) => t.status !== 'Completed').length;
  const upcomingBooking = bookings.find((b) => b.status === 'Confirmed');
  const totalCommission = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + Math.round((i.amountCents * commissionDefaultPct) / 100), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Live Stream · Command Hub"
        title={`Welcome back, ${currentUser?.name.split(' ')[0]}`}
        description={
          role === UserRole.MANAGER || role === UserRole.ADMIN
            ? `Full-spectrum visibility across the roster. Currently viewing metrics for ${artist?.name ?? 'the roster'}.`
            : `Here is what's moving across your desk today.`
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Monthly Listeners" value={artist ? artist.monthlyListeners.toLocaleString() : '—'} delta={artist ? `+${artist.followerGrowthPct}% MoM` : undefined} />
        <StatTile label="Open Tasks" value={String(openTasks)} delta={`${myTasks.length} total tracked`} positive={openTasks < 5} />
        <StatTile label="Beat Submissions" value={String(beats.length)} delta={`${beats.filter((b) => b.status === 'Placed').length} placed`} />
        <StatTile
          label={role === UserRole.MANAGER || role === UserRole.ADMIN ? 'Commission Tracked' : 'Next Payout'}
          value={formatCents(totalCommission || 125_000)}
          delta={`${commissionDefaultPct}% default rate`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <SectionTitle sub="6-month trailing streaming growth">Social & Streaming Growth</SectionTitle>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <TrendingUp size={14} />
              <span className="text-xs font-medium">Trending up</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_SERIES} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D6A63C" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#D6A63C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#48484a" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#48484a" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(214,166,60,0.3)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#EFD08A' }}
                />
                <Area type="monotone" dataKey="listeners" stroke="#D6A63C" strokeWidth={2} fill="url(#goldFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle sub="Currently pulsing">
            <span className="inline-flex items-center gap-2">
              <Radio size={16} className="animate-pulse-gold text-gold-400" /> Live Indicators
            </span>
          </SectionTitle>
          <div className="space-y-3">
            {upcomingBooking && (
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <p className="label-mono mb-1">Next Confirmed Gig</p>
                <p className="text-sm text-charcoal-500">{upcomingBooking.title}</p>
                <p className="text-xs text-charcoal-600">{upcomingBooking.location} · {upcomingBooking.date}</p>
              </div>
            )}
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="label-mono mb-1">Contract Pipeline</p>
              <p className="text-sm text-charcoal-500">
                {bookings.filter((b) => b.contractStatus === 'Sent').length} awaiting signature
              </p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="label-mono mb-1">Producer Pipeline</p>
              <p className="text-sm text-charcoal-500">
                {beats.filter((b) => b.status === 'Under Review').length} beats under review
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <SectionTitle sub="Across all rollout phases">
            <span className="inline-flex items-center gap-2">
              <ListChecks size={16} className="text-gold-400" /> Task Progress
            </span>
          </SectionTitle>
          <div className="space-y-2">
            {myTasks.slice(0, 6).map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm text-charcoal-500">{task.description}</p>
                  <p className="label-mono">Day {task.dayNumber} · {task.date}</p>
                </div>
                <Badge tone={statusTone(task.status)}>{task.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {(role === UserRole.MANAGER || role === UserRole.ADMIN) && (
        <div className="mt-6">
          <Card>
            <SectionTitle sub="Estimated based on paid invoices this cycle">
              <span className="inline-flex items-center gap-2">
                <Wallet size={16} className="text-gold-400" /> Commission Tracking
              </span>
            </SectionTitle>
            <p className="text-2xl font-serif text-gold-100">{formatCents(totalCommission)}</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
