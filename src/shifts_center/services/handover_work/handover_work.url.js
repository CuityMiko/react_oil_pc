/**
 * 交接班接口请求url
 */

// 查询加油员列表
const findWorkUserListUrl = '/api/mer/gas/work/find-work-user-list';

// 修改工作状态
const modifyWorkStatusUrl = '/api/mer/gas/work/modify-work-status';

// 自动续班设置
const modifyAutoWorkStatusUrl = '/api/mer/gas/work/modify-auto-work-status/';

// 获取加油员姓名和id
const findWorkUserUrl = '/api/mer/gas/work/find-work-user';

// 查询加油员交班记录列表
const findWorkRecordListUrl = '/api/mer/gas/work/find-work-record-list';

// 下载交班小票
const getWorkRecordUrl = '/api/mer/gas/work/get-work-record/';

export default {
    findWorkUserListUrl,
    modifyWorkStatusUrl,
    modifyAutoWorkStatusUrl,
    findWorkUserUrl,
    findWorkRecordListUrl,
    getWorkRecordUrl
}