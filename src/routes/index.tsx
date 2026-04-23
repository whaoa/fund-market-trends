import { createFileRoute } from '@tanstack/react-router';

import { useQuery } from '@tanstack/react-query';

import { getCurrentTrending } from '#/api/trending';
import { RefreshIcon } from '#/components/icons/Refresh';
import { CardContent, CardHeader, CardRoot } from '#/components/ui/Card';
import { FundChangeBadge, FundChangeText } from '#/components/ui/FundChangeText';
import { AUTO_REFRESH_INTERVAL } from '#/libs/constant';
import { formatFundChange } from '#/libs/fund';
import { cn, float, formatDate } from '#/libs/util';

import type { TrendingItem } from '#/api/trending';
import type { PropsWithChildren, PropsWithClassName } from '#/types/react';

export const Route = createFileRoute('/')({
  component: DashboardRoute,
});

function DashboardRoute() {
  const query = useQuery({
    queryKey: ['trending', 'current'],
    queryFn: getCurrentTrending,
    refetchInterval: AUTO_REFRESH_INTERVAL,
  });

  return (
    <>
      <ActionBar fetching={query.isFetching} time={query.dataUpdatedAt} refresh={query.refetch} />
      <FundGridView className="mt-3" loading={query.isLoading} trending={query.data} />
    </>
  );
}

interface ActionBarProps {
  fetching: boolean;
  time: number;
  refresh: () => Promise<unknown>;
}

function ActionBar(props: ActionBarProps) {
  const { fetching, time, refresh } = props;

  return (
    <div className="flex items-center px-1 py-1 text-sm">
      <p className="flex-1 py-1 text-t-secondary">
        <span className="max-md:hidden">Updated at: </span>
        {time ? formatDate(time, `MMM dd, yyyy 'at' HH:mm:ss z`) : '--'}
      </p>
      <button
        className={(
          'inline-flex items-center border-b border-b-transparent disabled:text-t-secondary'
          + ' hover:border-b-t-primary active:text-t-secondary active:border-b-t-secondary'
        )}
        disabled={fetching}
        onClick={() => refresh()}
      >
        <RefreshIcon className="mr-1 w-3.5 h-3.w-3.5" />
        <span>Refresh</span>
      </button>
    </div>
  );
}

interface FundGridViewProps extends PropsWithClassName {
  loading: boolean;
  trending?: Awaited<ReturnType<typeof getCurrentTrending>>;
}

function FundGridView(props: FundGridViewProps) {
  const { className, loading, trending } = props;

  return (
    <div className={cn('grid grid-cols-1 gap-3 md:grid-cols-2', className)}>
      <FundGroupCard className="min-h-[746px] md:row-span-2" title="China" loading={loading} funds={trending?.China}>
        Mainland + Hong Kong indices
      </FundGroupCard>
      <FundGroupCard title="United States" loading={loading} funds={trending?.UnitedStates}>
        S&P 500, Nasdaq and Dow
      </FundGroupCard>
      <FundGroupCard title="Japan" loading={loading} funds={trending?.Japan}>
        Nikkei 225
      </FundGroupCard>
    </div>
  );
}

interface FundGroupCardProps extends PropsWithClassName, PropsWithChildren {
  title: string;
  loading?: boolean;
  funds?: TrendingItem[];
}

function FundGroupCard(props: FundGroupCardProps) {
  const { className, children, title, loading, funds } = props;

  const avg = funds
    ? funds.reduce((v, i) => v.add(i.changePercent), float(0)).div(funds.length).toNumber()
    : Number.NaN;

  return (
    <CardRoot className={className}>
      <CardHeader className="flex items-center">
        <div className="flex-1">
          <h3 className="font-bold">{title}</h3>
          <p className="mt-1 text-sm teth-secondary">{children}</p>
        </div>
        <FundChangeBadge className={loading ? 'hidden' : ''} change={avg}>
          {`Avg: ${formatFundChange(avg, true)}%`}
        </FundChangeBadge>
      </CardHeader>

      <CardContent>
        {funds?.length ? <FundTableView funds={funds || []} /> : (
          <div className="py-6 text-center text-sm text-t-secondary">
            {loading ? 'Loading...' : 'No data'}
          </div>
        )}
      </CardContent>
    </CardRoot>
  );
}

function FundTableView(props: { funds: TrendingItem[] }) {
  const { funds } = props;

  return (
    <>
      <div className="flex text-xs text-t-secondary">
        <span className="w-3/5">Index</span>
        <span className="w-2/5 text-right">Change</span>
      </div>
      {funds.map((fund, index) => (
        <div key={fund.code} className={cn('flex flex-wrap py-3', index > 0 && 'border-t border-t-g-border')}>
          <span className="w-3/5">
            <span className="font-bold text-sm">{fund.name}</span>
            <span className="ml-2 text-xs text-t-secondary">{fund.code}</span>
          </span>
          <FundChangeText className="w-2/5 text-right font-bold text-sm" change={fund.change}>
            {`${formatFundChange(Number(fund.changePercent), true)}%`}
          </FundChangeText>
          <span className="mt-1 w-1/2 text-xs text-t-secondary">{`Value: ${fund.nav}`}</span>
          <FundChangeText className="mt-1 w-1/2 text-right text-xs" change={fund.change}>
            {formatFundChange(fund.change)}
          </FundChangeText>
        </div>
      ))}
    </>
  );
}
