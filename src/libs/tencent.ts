import { request } from './util';

/**
 * 解析腾讯证券返回数据
 * @link https://github.com/chengzuopeng/stock-sdk/blob/master/src/core/request.ts#L311
 * @param response
 */
function decodeTencentResponse(response: ArrayBuffer) {
  return new TextDecoder('gbk')
    .decode(response)
    .split(';')
    .map((row) => row.trim())
    .filter((row) => (row.length > 0 && row.includes('=')))
    .map((row) => {
      const [key = '', values = ''] = row.split('=');
      return { key, values: values.replace(/^"(.+)?"$/, '$1').split('~') };
    });
}

/**
 * 从腾讯证券 API 批量查询数据
 * - 全球外汇汇率 [wh]: https://stockapp.finance.qq.com/#mod=list&id=exchange&module=ER&type=ALL
 * - 市场交易状态 [marketStat]: https://gu.qq.com/jj014002
 * - 股票简要信息 [s_(sh|sz|us|hk)]: https://stockapp.finance.qq.com
 * - 股票完整信息 [sh|sz|us|hk]: https://stockapp.finance.qq.com
 * - 基金简要信息 [jj]: https://gu.qq.com/jj014002
 * - 基金完整信息 [s_jj]: https://gu.qq.com/jj014002
 * @param codes
 */
export async function batchQueryByCodesWithTencent(codes: string[]) {
  const buffer = await request('https://qt.gtimg.cn/', {
    method: 'GET',
    query: { q: codes.join(','), _: Date.now() },
    responseType: 'arrayBuffer',
  });
  return decodeTencentResponse(buffer);
}
