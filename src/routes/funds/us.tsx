import { createFileRoute } from '@tanstack/react-router';

import { useQuery } from '@tanstack/react-query';

import { batchCalculateFundChangePercent, getUnitedStatesFundList } from '#/api/fund';
import { CardContent, CardHeader, CardRoot } from '#/components/ui/Card';
import { FundChangeBadge, FundChangeText } from '#/components/ui/FundChangeText';
import { UpdatedTimeBar } from '#/components/ui/UpdatedTimeBar';
import { AUTO_REFRESH_INTERVAL } from '#/libs/constant';
import { formatFundChange } from '#/libs/fund';
import { cn, float, formatDate } from '#/libs/util';

import type { PropsWithClassName } from '#/types/react';

export const Route = createFileRoute('/funds/us')({
  component: RouteComponent,
});

function RouteComponent() {
  const funds = useQuery({
    queryKey: ['funds', 'us'],
    queryFn: getUnitedStatesFundList,
  });

  const changes = useQuery({
    queryKey: ['funds-changes', 'us'],
    queryFn: () => batchCalculateFundChangePercent(
      funds?.data?.map((f) => f.holding) || [],
    ),
    enabled: !!funds?.data?.length,
    refetchInterval: AUTO_REFRESH_INTERVAL,
  });

  return (
    <>
      <UpdatedTimeBar
        fetching={changes.isFetching}
        time={changes.dataUpdatedAt}
        refresh={changes.refetch}
      />
      <UnitedStatesFundsCard
        className="mt-3"
        loading={funds.isLoading}
        funds={funds?.data}
        changes={changes?.data}
      />
    </>
  );
}

interface UnitedStatesFundsCardProps extends PropsWithClassName {
  loading: boolean;
  funds?: Awaited<ReturnType<typeof getUnitedStatesFundList>>;
  changes?: Awaited<ReturnType<typeof batchCalculateFundChangePercent>>;
}

function UnitedStatesFundsCard(props: UnitedStatesFundsCardProps) {
  const { className, loading, funds, changes } = props;

  const avg = changes?.length
    ? changes.reduce((v, i) => v.add(Number(i.change) || 0), float(0))
        .div(changes.length)
        .toNumber()
    : Number.NaN;

  return (
    <CardRoot className={className}>
      <CardHeader className="flex items-center">
        <div className="flex-1">
          <h2 className="font-bold text-base">美国基金</h2>
          <p className="mt-1 text-sm text-t-secondary">
            根据基金公司公布的最新季度报告以及上一年的年度报告中提供的持仓信息并结合货币汇率估算实时涨跌幅度。
          </p>
        </div>
        <FundChangeBadge className={loading ? 'hidden' : ''} change={avg}>
          {`均值：${formatFundChange(avg, true)}%`}
        </FundChangeBadge>
      </CardHeader>

      <CardContent>
        {(loading || !funds?.length) ? (
          <div className="py-6 text-center text-sm text-t-secondary">
            {loading ? '加载中…' : '暂无数据'}
          </div>
        ) : (
          <FundsTableView funds={funds} changes={changes} />
        )}
      </CardContent>
    </CardRoot>
  );
}

interface FundsTableViewProps {
  funds: Awaited<ReturnType<typeof getUnitedStatesFundList>>;
  changes?: Awaited<ReturnType<typeof batchCalculateFundChangePercent>>;
}

function FundsTableView(props: FundsTableViewProps) {
  const { funds, changes } = props;

  return (
    <>
      <div className="hidden md:flex text-xs mb-2 text-t-secondary">
        <span className="w-3/5">基金</span>
        <span className="w-1/5 text-right">预估涨跌幅</span>
        <span className="w-1/5 text-right">更新时间</span>
      </div>
      {funds.map((fund, index) => {
        const change = changes?.[index];
        return (
          <div
            key={fund.code}
            className={cn('flex flex-wrap py-3', index > 0 && 'border-t border-t-g-border')}
            onClick={() => {
              /* eslint-disable no-console */
              console.group(`[${fund.code}] ${fund.name}`);
              console.table(fund.holding);
              console.groupEnd();
              /* eslint-enable no-console */
            }}
          >
            <span className="w-full md:w-3/5">
              <span className="font-bold text-sm">{fund.name}</span>
              <span className="ml-2 text-xs text-t-secondary">{fund.code}</span>
            </span>
            <div className="mt-2 w-1/2 md:mt-0 md:w-1/5 md:text-right">
              <p className="text-xs text-t-secondary md:hidden">预估涨跌幅</p>
              <FundChangeText
                className="font-bold text-sm"
                change={change?.change || 0}
              >
                {change?.change ? `${formatFundChange(change?.change || 0, true)}%` : '--'}
              </FundChangeText>
            </div>
            <div className="mt-2 w-1/2 text-right md:mt-0 md:w-1/5">
              <p className="text-xs text-t-secondary md:hidden">更新时间</p>
              <span className="text-xs text-t-secondary tabular-nums md:text-sm">
                {change?.time ? formatDate(change.time, 'MM-dd HH:mm:ss') : '--'}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}
