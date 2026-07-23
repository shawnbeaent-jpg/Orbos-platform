import { listClaims, type ClaimFilter } from '@/lib/queries/claims';
import { PageHeader, EmptyState } from '@/components/ui';
import { ClaimsTable } from '@/components/ClaimsTable';

export const metadata = { title: 'Claims' };
export const dynamic = 'force-dynamic';

export default async function ClaimsPage({ searchParams }: { searchParams: { filter?: string } }) {
  const filter: ClaimFilter = searchParams.filter === 'blocking-open' ? 'blocking-open' : 'all';
  const claims = await listClaims({ filter });

  return (
    <div>
      <PageHeader
        title="Claims"
        subtitle={filter === 'blocking-open' ? 'Open blocking claims' : 'All claims'}
      />
      {claims.length === 0 ? (
        <EmptyState title="No claims" message="Damage, shortage, wrong-item, wrong-finish, and storage claims appear here." />
      ) : (
        <ClaimsTable claims={claims} />
      )}
    </div>
  );
}
