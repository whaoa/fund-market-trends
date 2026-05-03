import { RefreshIcon } from '#/components/icons/Refresh';
import { formatDate } from '#/libs/util';

interface ActionBarProps {
  fetching: boolean;
  time: number;
  refresh: () => Promise<unknown>;
}

export function UpdatedTimeBar(props: ActionBarProps) {
  const { fetching, time, refresh } = props;

  return (
    <div className="flex items-center px-1 py-1 text-sm">
      <p className="flex-1 py-1 text-t-secondary tabular-nums">
        <span className="max-md:hidden">更新时间：</span>
        {time ? formatDate(time, `yyyy-MM-dd HH:mm:ss (z)`) : '--'}
      </p>
      <button
        className={(
          'inline-flex items-center border-b border-b-transparent disabled:text-t-secondary'
          + ' hover:border-b-t-primary active:text-t-secondary active:border-b-t-secondary'
        )}
        disabled={fetching}
        onClick={() => refresh()}
      >
        <RefreshIcon className="mr-1 h-3.5 w-3.5" />
        <span>刷新</span>
      </button>
    </div>
  );
}
