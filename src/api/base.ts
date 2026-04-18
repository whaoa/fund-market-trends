import { batchQueryByCodesWithTencent } from '#/libs/tencent';

/**
 * 获取货币汇率
 * @link https://stockapp.finance.qq.com/#mod=list&id=exchange&module=ER&type=ALL
 * @param currencies
 * @example getCurrencyExchangeRate(['USD-CNY'])
 */
async function getCurrencyExchangeRateList(currencies: string[]) {
  if (!currencies.length) {
    return [];
  }

  const codes = currencies.map((str) => (
    `wh${str.replace('-', '').toUpperCase()}`
  ));

  const resp = await batchQueryByCodesWithTencent(codes);

  return resp.map(({ values }) => {
    const currency = currencies[codes.indexOf(`wh${values[2]!}`)];
    const [source, target] = currency?.split('-') || '';
    return {
      source: source?.toUpperCase() || '',
      target: target?.toUpperCase() || '',
      nav: Number(values[3]),
      change: Number(values[12]),
      changePercent: Number(values[13]),
    };
  });
}

/**
 * 获取指定币种兑特定币种的涨幅比例
 * @param currencies
 * @example getCurrenciesToCnyChangePercent(['USD'], 'CNY')
 */
export async function getCurrencyChangePercentMap(currencies: string[], base = 'CNY') {
  const codes = currencies.map((currency) => `${currency}-${base}`);
  const rates = await getCurrencyExchangeRateList(codes);
  const map: Record<string, number> = {};
  rates.forEach((item) => {
    if (item.source) {
      map[item.source] = item.changePercent;
    }
  });
  return map;
}
