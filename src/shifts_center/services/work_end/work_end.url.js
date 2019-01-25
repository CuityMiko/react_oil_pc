/**
 * 班结管理接口请求url
 */

// 班结记录列表
const findShiftRecordListUrl = '/api/mer/gas/work/find-shift-record-list';

// 单条班结记录下载
const exportShiftRecordUrl = '/api/mer/gas/work/export-shift-record/';

// 汇总班结记录下载
const exportShiftCollectUrl = '/api/mer/gas/work/export-shift-collect';

// 获取首次开班
const getShiftStartDateUrl = '/api/mer/gas/work/get-shift-start-date';

// 班结
const saveShiftUrl = '/api/mer/gas/work/save-shift/';

// 首页班结统计
const getHandoverWorkStatisticsUrl = '/api/mer/order-statistics/gas-shift-amount';

export default {
    findShiftRecordListUrl,
    exportShiftRecordUrl,
    exportShiftCollectUrl,
    getShiftStartDateUrl,
    saveShiftUrl,
    getHandoverWorkStatisticsUrl
}
