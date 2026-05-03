import { createFileRoute, Link } from '@tanstack/react-router';

import { useQuery } from '@tanstack/react-query';

import { getCurrentTrending } from '#/api/trending';
import { CardContent, CardHeader, CardRoot } from '#/components/ui/Card';
import { FundChangeBadge, FundChangeText } from '#/components/ui/FundChangeText';
import { UpdatedTimeBar } from '#/components/ui/UpdatedTimeBar';
import { AUTO_REFRESH_INTERVAL } from '#/libs/constant';
import { formatFundChange } from '#/libs/fund';
import { cn, float } from '#/libs/util';

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
      <UpdatedTimeBar
        fetching={query.isFetching}
        time={query.dataUpdatedAt}
        refresh={query.refetch}
      />
      <FundGridView className="mt-3" loading={query.isLoading} trending={query.data} />
    </>
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
      <FundGroupCard
        className="min-h-[746px] md:row-span-2"
        title="中国"
        description="大陆 + 香港指数"
        funds={trending?.China}
        loading={loading}
      />

      <FundGroupCard
        title="美国"
        description="标普 500, 纳斯达克以及道琼斯"
        funds={trending?.UnitedStates}
        loading={loading}
      >
        <div className="mt-3 p-2 text-center">
          <Link
            className="text-sm text-t-secondary underline hover:text-t-primary"
            to="/funds/us"
          >
            热门基金
          </Link>
        </div>
      </FundGroupCard>

      <FundGroupCard
        title="日本"
        description="日经指数"
        funds={trending?.Japan}
        loading={loading}
      />
    </div>
  );
}

interface FundGroupCardProps extends PropsWithClassName, PropsWithChildren {
  title: string;
  description?: string;
  funds?: TrendingItem[];
  loading?: boolean;
}

function FundGroupCard(props: FundGroupCardProps) {
  const { className, children, title, description, loading, funds } = props;

  const avg = funds
    ? funds.reduce((v, i) => v.add(i.changePercent), float(0)).div(funds.length).toNumber()
    : Number.NaN;

  return (
    <CardRoot className={className}>
      <CardHeader className="flex items-center">
        <div className="flex-1">
          <h3 className="font-bold">{title}</h3>
          <p className="mt-1 text-sm teth-secondary">{description}</p>
        </div>
        <FundChangeBadge className={loading ? 'hidden' : ''} change={avg}>
          {`均值：${formatFundChange(avg, true)}%`}
        </FundChangeBadge>
      </CardHeader>

      <CardContent>
        {funds?.length ? <FundTableView funds={funds || []} /> : (
          <div className="py-6 text-center text-sm text-t-secondary">
            {loading ? '加载中…' : '暂无数据'}
          </div>
        )}
        {children}
      </CardContent>
    </CardRoot>
  );
}

function FundTableView(props: { funds: TrendingItem[] }) {
  const { funds } = props;

  return (
    <>
      <div className="flex text-xs text-t-secondary">
        <span className="w-3/5">指数</span>
        <span className="w-2/5 text-right">涨跌幅</span>
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
          <span className="mt-1 w-1/2 text-xs text-t-secondary">{`净值：${fund.nav}`}</span>
          <FundChangeText className="mt-1 w-1/2 text-right text-xs" change={fund.change}>
            {formatFundChange(fund.change)}
          </FundChangeText>
        </div>
      ))}
    </>
  );
}
