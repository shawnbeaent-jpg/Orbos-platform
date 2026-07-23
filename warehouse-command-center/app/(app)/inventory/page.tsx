import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PageHeader, EmptyState } from '@/components/ui';
import { formatQuantity } from '@/lib/format';

export const metadata = { title: 'Warehouse Inventory' };
export const dynamic = 'force-dynamic';

export default async function InventoryPage({ searchParams }: { searchParams: { filter?: string } }) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('warehouse_inventory').select('*').eq('active', true).order('name');
  let items = data ?? [];
  const lowOnly = searchParams.filter === 'low';
  if (lowOnly) items = items.filter((i) => i.on_hand_quantity <= i.reorder_point);

  return (
    <div>
      <PageHeader
        title="Shared Warehouse Inventory"
        subtitle={lowOnly ? 'Low-stock items' : 'Shared stock and consumables. Balances are derived from the transaction ledger.'}
      />
      {items.length === 0 ? (
        <EmptyState
          title="No inventory items"
          message="Shared consumables and stock appear here with on-hand, committed, and available balances plus reorder points."
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-steel-200 text-sm">
            <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
              <tr>
                <th className="px-3 py-3">Item</th>
                <th className="px-3 py-3">Zone</th>
                <th className="px-3 py-3 text-right">On hand</th>
                <th className="px-3 py-3 text-right">Committed</th>
                <th className="px-3 py-3 text-right">Available</th>
                <th className="px-3 py-3 text-right">Reorder pt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {items.map((i) => {
                const available = i.on_hand_quantity - i.committed_quantity;
                const low = i.on_hand_quantity <= i.reorder_point;
                return (
                  <tr key={i.id} className={low ? 'bg-status-delayed/5' : 'hover:bg-steel-50'}>
                    <td className="px-3 py-3">
                      <div className="font-medium text-steel-900">{i.name}</div>
                      <div className="text-xs text-steel-500">{i.sku ?? '—'}</div>
                    </td>
                    <td className="px-3 py-3 text-xs text-steel-600">{i.warehouse_zone ?? '—'}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatQuantity(i.on_hand_quantity, i.unit)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatQuantity(i.committed_quantity)}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">{formatQuantity(available)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {formatQuantity(i.reorder_point)}
                      {low ? <span className="ml-1 text-status-delayed">low</span> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
