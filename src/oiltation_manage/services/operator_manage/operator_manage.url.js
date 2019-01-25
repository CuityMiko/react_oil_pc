import q from "q";

/**
 * 查询员工列表
 */
const queryStaffListUrl = '/api/mer/staff/query-list';

/**
 * 新增员工
 */
const staffSaveUrl = '/api/mer/staff/save';

/**
 * 查询员工信息
 */
const staffGetInfoUrl = '/api/mer/staff/get-info';

/*
* 注销员工
* */
const staffLogoutUrl = '/api/mer/staff/logout';

/*
* 启用员工
* */
const staffEnableUrl = '/api/mer/staff/enable';

/*
* 修改员工信息 -- 管理者
* */
const staffModifyUrl = '/api/mer/staff/modify';

/*
* 查询当前用户角色
* */
const roleQueryListUrl = '/api/mer/role/query-list';


/*
*  修改员工信息 -- 个人
* */
const staffSelfModifyUrl = '/api/mer/staff/self-modify';

/*
* 重置密码
* */
const selfRestPwdUrl = '/api/mer/staff/self-reset-pwd';

export default {
    queryStaffListUrl,
    staffSaveUrl,
    staffGetInfoUrl,
    staffLogoutUrl,
    staffEnableUrl,
    staffModifyUrl,
    roleQueryListUrl,
    staffSelfModifyUrl,
    selfRestPwdUrl
}