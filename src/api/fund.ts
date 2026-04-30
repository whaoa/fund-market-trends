import { batchQueryByCodesWithTencent } from '#/libs/tencent';
import { float, parseDate, request, tz } from '#/libs/util';

import { getCurrencyChangePercentMap } from './base';
import { getLegacyFundHolding } from './holdings';

/**
 * 获取美股主动基金列表
 */
async function getFundList(codes: string[]) {
  const resp = await batchQueryByCodesWithTencent(codes.map((code) => `s_jj${code}`));

  return resp.map(({ values }) => ({
    /** 基金代码 */
    code: values[0] || '',
    /** 基金名称 */
    name: values[1] || '',
    /** 净值更新日期 */
    date: values[2]?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') || '',
    /** 单位净值 */
    nav: Number(values[3]) || 0,
    /** 涨幅 */
    change: Number(values[6]) || 0,
    /** 涨跌幅度 */
    changePercent: values[5] || '0.00',
    /** 历史涨跌 */
    changes: {
      /** 近一月 */
      m1: values[14] || '0.00',
      /** 近三月 */
      m3: values[8] || '0.00',
      /** 今年以来 */
      y: values[29] || '0.00',
      /** 近半年 */
      yh: values[32] || '0.00',
      /** 近一年 */
      y1: values[10] || '0.00',
      /** 近三年 */
      y3: values[34] || '0.00',
      /** 成立以来 */
      all: values[33] || '0.00',
    },
  }));
}

interface FundHoldingApiResp {
  code: number;
  msg: string;
  data: {
    /** 公布时间 */
    report_time: string;
    /** 重仓股票分布 */
    stock: Array<{
      code: string | null;
      jump_code: string | null;
      name: string;
      ratio: string;
      rate: string | null;
    }>;
  };
}

/**
 * 通过 腾讯证券 API 获取基金持仓股票
 * @link https://gu.qq.com/jj014002
 * @example getFundHoldingStocks('014002')
 */
async function getFundHoldingInformation(code: string) {
  const resp = await request<FundHoldingApiResp>(
    'https://zxg.txfund.com/ifzqgtimg/appstock/fund/baseInfo/asset',
    {
      method: 'GET',
      query: { code: `jj${code}`, _: Date.now() },
      responseType: 'json',
    },
  );

  if (resp.code !== 0 || !resp?.data) {
    throw new Error(`can not get fund holding stocks for ${code}`);
  }

  return {
    /** 公布日期 */
    date: resp.data.report_time,
    /** 重仓股票 */
    stocks: resp.data.stock.map((item) => ({
      /** 内部股票代码 */
      id: item.jump_code || null,
      /** 股票名称 */
      name: item.name,
      /** 持仓比例 */
      ratio: item.ratio,
    })),
  };
}

/**
 * 获取美股主动基金列表
 */
export async function getUnitedStatesFundList() {
  const funds = await getFundList([
    '014002', // 浦银安盛全球智能科技 C
    '021842', // 国富全球科技互联混合 C
    '017731', // 嘉实全球产业升级股票发起式 C
    '012922', // 易方达全球成长精选混合 C
    '018147', // 建信新兴市场混合 C
    '024239', // 华夏全球科技先锋混合 C
    '018036', // 长城全球新能源车股票发起式 C
    '002891', // 华夏移动互联混合
    '008254', // 华宝致远混合 C
    '016702', // 银华海外数字经济量化选股混合发起式 C
    '000043', // 嘉实美国成长股票
    '021277', // 广发全球精选股票 人民币C
    '017437', // 华宝纳斯达克精选股票 C
  ]);

  const holdings = await Promise.all(
    funds.map((fund) => getFundHoldingInformation(fund.code)),
  );

  return funds.map((fund, index) => ({
    /** 基金代码 */
    code: fund.code,
    /** 基金名称 */
    name: fund.name.replace(/\(QDII(-LOF)?\)(人民币)?([CA])?/i, ' $3'),
    /** 基金持仓 */
    holding: [
      ...holdings[index]!.stocks,
      ...getLegacyFundHolding(fund.code, holdings[index]!.stocks).stocks,
    ],
  }));
}

/**
 * 根据持仓信息批量计算基金涨幅
 * @param holdings
 */
export async function batchCalculateFundChangePercent(
  holdings: Awaited<ReturnType<typeof getUnitedStatesFundList>>[number]['holding'][],
) {
  // 用于保存 code - id 的映射对象
  const codes: Record<string, string> = {};

  holdings.forEach((stocks) => stocks.forEach((stock) => {
    if (stock.id) {
      const code = stock.id.replace(/\.[^.]+$/, '');
      codes[code] = stock.id;
    }
  }));

  const [currencies, stocks] = await Promise.all([
    // 查询货币汇率
    getCurrencyChangePercentMap(['USD', 'HKD'], 'CNY'),
    // 查询所有股票信息
    batchQueryByCodesWithTencent(Object.keys(codes)),
  ]);

  // 用于保存 id - info 的映射对象
  const context: Record<string, { time: number; change: number }> = {};

  stocks.forEach((stock) => {
    const id = codes[stock.key.replace('v_', '')];
    if (!id) {
      return;
    }

    const dt = stock.values[30]!;
    // 根据货币汇率计算基准
    let base = 0;
    // 根据时区计算更新时间
    let date: Date | undefined;

    switch (true) {
      case id.startsWith('sh'):
      case id.startsWith('sz'):
        date = parseDate(dt, 'yyyyMMddHHmmss', 0, { in: tz('Asia/Shanghai') });
        break;
      case id.startsWith('hk'):
        base = currencies.HKD || 0;
        date = parseDate(dt, 'yyyy/MM/dd HH:mm:ss', 0, { in: tz('Asia/Hong_Kong') });
        break;
      case id.startsWith('us'):
        base = currencies.USD || 0;
        date = parseDate(dt, 'yyyy-MM-dd HH:mm:ss', 0, { in: tz('America/New_York') });
        break;
    }

    // 保存股票信息到 context 对象中
    context[id] = {
      time: (date || new Date()).getTime(),
      change: float(stock.values[32]).mul(float(1).sub(base)).toNumber(),
    };
  });

  return holdings.map((stocks) => {
    let time = 0;
    let change = float(0);

    stocks.forEach((stock) => {
      const value = context[stock.id || ''];
      if (!value) {
        return;
      }
      // 计算最晚的更新时间
      time = Math.max(time, value.time);
      // 累计持仓股票涨幅，涨幅 = 权重系数 (持仓比例 / 100) * 涨幅
      change = change.add(float(stock.ratio).div(100).mul(value.change));
    });

    return { time, change: change.toNumber() };
  });
}
