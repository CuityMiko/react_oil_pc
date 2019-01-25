// 首页
import Home from './containers/main/redux/reducers';

// 修改密码
import UpdatePassword from './containers/update_password/redux/reducers';

// 个人信息
import PersonalInfo from './containers/personal_info/redux/reducers';

export default {
    ...Home,
    ...UpdatePassword,
    ...PersonalInfo
}