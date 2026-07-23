import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { ROLE_LABELS } from '@/lib/auth/rbac';
import { PageHeader, EmptyState } from '@/components/ui';

export const metadata = { title: 'Users' };
export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await requireSession();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('profiles').select('*').order('full_name');
  const users = data ?? [];
  const isAdmin = session.role === 'admin';

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={isAdmin ? 'Organization users and roles.' : 'Read-only. Only an Administrator can add users or change roles.'}
      />
      {users.length === 0 ? (
        <EmptyState title="No users" message="Organization members appear here." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-steel-200 text-sm">
            <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
              <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-steel-50">
                  <td className="px-3 py-3 font-medium text-steel-900">{u.full_name}</td>
                  <td className="px-3 py-3">{ROLE_LABELS[u.role]}</td>
                  <td className="px-3 py-3">{u.active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
