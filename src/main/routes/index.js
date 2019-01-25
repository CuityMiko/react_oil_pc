/**
 * 首页
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 首页
 */
const Home = Loadable({ 
    loader: () => import('../containers/main/Home.jsx'),
    loading: Loading
});

/**
 * 修改密码
 */
const UpdatePassword = Loadable({ 
    loader: () => import('../containers/update_password/UpdatePassword.jsx'),
    loading: Loading
});

/**
 * 个人信息
 */
const PersonalInfo = Loadable({ 
    loader: () => import('../containers/personal_info/PersonalInfo.jsx'),
    loading: Loading
});

export default {
    Home,
    UpdatePassword,
    PersonalInfo
}