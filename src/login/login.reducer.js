/**
 * 登录
 */

 // 登录
 import Login from './containers/login/redux/reducers';

 // 找回密码
 import FindPwssword from './containers/find_pwssword/redux/reducers';

 export default {
    ...Login,
    ...FindPwssword
 }