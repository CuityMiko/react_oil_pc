import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import operatorManagerUrls from './operator_manage.url';

/**
 * 请求员工列表
 * @param {*} data
 */
const QueryStaffList = function (params) {
    const deferred = q.defer();
    httpHelper.get(operatorManagerUrls.queryStaffListUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/*
* 新增员工信息
* */
const staffSave = function (params) {
    const deferred = q.defer();
    httpHelper.post(operatorManagerUrls.staffSaveUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/*
* 查询员工
* */
const staffGetInfo = function (params) {
    const deferred = q.defer();
    let url = `${operatorManagerUrls.staffGetInfoUrl}/${params}`
    httpHelper.get(url).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/*
* 注销员工
* */
const staffLogout = function (params) {
    const deferred = q.defer();
    httpHelper.post(operatorManagerUrls.staffLogoutUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/*
* 启用员工
* */
const staffEnable = function (params) {
    const deferred = q.defer();
    httpHelper.post(operatorManagerUrls.staffEnableUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/*
* 修改员工信息 -- 管理者
* */
const staffModify = function (params) {
    const deferred = q.defer();
    httpHelper.post(operatorManagerUrls.staffModifyUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/*
* 获取角色列表
* */
const roleQueryList = function () {
    const deferred = q.defer();
    httpHelper.get(operatorManagerUrls.roleQueryListUrl).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

//个人信息
/*
* 修改员工信息 -- 个人
* */
const staffSelfModify = function (params) {
    const deferred = q.defer();
    httpHelper.post(operatorManagerUrls.staffSelfModifyUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/*
* 修改密码
* */
const selfRestPwd = function (params) {
    const deferred = q.defer();
    httpHelper.post(operatorManagerUrls.selfRestPwdUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};


export default {
    QueryStaffList,
    staffSave,
    staffModify,
    staffLogout,
    staffEnable,
    staffGetInfo,
    roleQueryList,
    staffSelfModify,
    selfRestPwd
}
