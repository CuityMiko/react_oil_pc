/**
 * 会员列表请求接口Url
 */
// 会员列表
export const listMbrUrl = '/api/mbr/queryList';
// 详情
export const detailMbrUrl = '/api/mbr/member-detail';
// 删除
export const delteMbrUrl = '/api/mbr/delete-mbr';
// 新增会员量
export const amountMbrUrl = '/api/mbr/find-mbr-total';
// 导出
export const exportMbrUrl = '/api/mbr/export-mbr';

// 储值统计
export const storedCountUrl = '/api/mer/stored-list/find-stored-count';

// 储值列表
export const storedListUrl = '/api/mer/stored-list/query-list';

// 积分统计
export const scoreCountUrl = '/api/mer/mbr-score/score/count';

// 积分列表
export const scoreListUrl = '/api/mer/mbr-score/query-score/list';

// 手动修改积分
export const editScoreUrl = '/api/mer/mbr-score/hand-modify';

// 首页用到的新增会员数量统计
export const newTotalMbrUrl = '/api/mbr-statistics/increased-total';

// 查询导入列表
export const mbrImportListUrl = '/api/mbr/import/find-list';

// 导入-获取验证码
export const codeImportUrl = '/api/mbr/import/msg';

// 导入-校验验证码
export const verifyCodeImportUrl = '/api/mbr/import/msg/valid';

// 导入-会员上传excel
export const mbrUploadImportUrl = '/api/mbr/import/upload';

// 导入-上传结果
export const resultUploadImportUrl = '/api/mbr/import/status';