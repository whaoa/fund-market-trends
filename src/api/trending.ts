import { batchQueryByCodesWithTencent } from '#/libs/tencent';
import { float, request } from '#/libs/util';

interface TrendingItem {
  /** 代码 */
  code: string;
  /** 名称 */
  name: string;
  /** 单位净值 */
  nav: number;
  /** 涨跌净值 */
  change: number;
  /** 涨跌幅度 */
  changePercent: number;
}

export type { TrendingItem };

/**
 * 通过 腾讯证券 API 获取行情信息
 * @link https://stockapp.finance.qq.com/
 */
async function getTrending(codes: string[]): Promise<TrendingItem[]> {
  const result = await batchQueryByCodesWithTencent(codes.map((code) => `s_${code}`));

  return result.map(({ values }) => ({
    code: values[2] || '',
    name: values[1] || '',
    nav: Number(values[3]),
    change: Number(values[4]),
    changePercent: Number(values[5]),
  }));
}

interface StockTrendingApiResp {
  code: number;
  data: Record<
    'asia' | 'america',
    Array<{ qtcode: string; code: string; name: string; zxj: string; zdf: string }>
  >;
}

/**
 * 通过 腾讯证券 API 获取全球股市行情
 * @link https://stockapp.finance.qq.com/#mod=list&id=indices&module=GIDX&type=ALL
 */
async function getStockTrending(codes: string[]): Promise<TrendingItem[]> {
  if (!codes.length) {
    return [];
  }

  const resp = await request<StockTrendingApiResp>(
    'https://proxy.finance.qq.com/ifzqgtimg/appstock/app/rank/indexRankDetail2',
    {
      method: 'GET',
      query: { _: Date.now() },
      responseType: 'json',
    },
  );

  if (resp.code !== 0 || !resp?.data) {
    throw new Error('can not get global stock trending');
  }

  return [...Object.values(resp.data.asia), ...Object.values(resp.data.america)]
    .filter((item) => codes.includes(item.qtcode))
    .map((item) => {
      const nav = Number(item.zxj);
      const percent = Number(item.zdf);
      return {
        code: item.code,
        name: item.name.length > 5 ? item.name.replace('指数', '') : item.name,
        nav,
        change: float(nav).sub(float(nav).div(float(percent).div(100).add(1))).toNumber(2),
        changePercent: percent,
      };
    });
}

export async function getCurrentTrending() {
  const [us, china, japan] = await Promise.all([
    getTrending([
      'us.INX', // 标普500
      'us.IXIC', // 纳斯达克
      'us.NDX', // 纳斯达克100
      'us.DJI', // 道琼斯
    ]),
    getTrending([
      'sh000001', // 上证指数
      'sz399001', // 深证成指
      'sz399006', // 创业板指
      'sh000300', // 沪深300
      'sh000688', // 科创50
      'sh000016', // 上证50
      'sh000905', // 中证500
      'hkHSI', // 恒生指数
      'hkHSTECH', // 恒生科技
    ]),
    getStockTrending([
      'gzN225', // 日经225
    ]),
  ]);
  return { UnitedStates: us, China: china, Japan: japan };
}
