import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PageHeader, Card, EmptyState } from '@/components/ui';

export const metadata = { title: 'Readiness Rules' };
export const dynamic = 'force-dynamic';

function RuleRows({ rules }: { rules: Record<string, unknown> }) {
  const entries = Object.entries(rules);
  if (entries.length === 0) return <p className="text-sm text-steel-500">No rules configured.</p>;
  return (
    <dl className="divide-y divide-steel-100">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center justify-between py-2 text-sm">
          <dt className="text-steel-600">{key.replace(/_/g, ' ')}</dt>
          <dd className="font-semibold text-steel-900">
            {typeof value === 'boolean' ? (value ? 'On' : 'Off') : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default async function ReadinessRulesPage() {
  const supabase = createSupabaseServerClient();
  const { data: org } = await supabase.from('organizations').select('*').limit(1).maybeSingle();

  if (!org) {
    return (
      <div>
        <PageHeader title="Readiness Rules" />
        <EmptyState title="No organization found" message="Organization readiness rules will appear here." />
      </div>
    );
  }

  const readinessRules = (org.readiness_rules ?? {}) as Record<string, unknown>;
  const highEndRules = (org.high_end_material_rules ?? {}) as Record<string, unknown>;

  return (
    <div>
      <PageHeader
        title="Readiness Rules"
        subtitle="These controls are enforced server-side in the readiness gate. Changing them is an Administrator action."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-steel-500">Base readiness rules</h2>
          <RuleRows rules={readinessRules} />
        </Card>
        <Card>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-steel-500">High-end material rules</h2>
          <RuleRows rules={highEndRules} />
          <div className="mt-3 flex items-center justify-between border-t border-steel-100 pt-3 text-sm">
            <span className="text-steel-600">Allow approved deferred-template exceptions</span>
            <span className="font-semibold text-steel-900">
              {org.allow_approved_deferred_template_exceptions ? 'On' : 'Off (strict whole-project gate)'}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
