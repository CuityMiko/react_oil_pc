import axios from 'axios'
import { message } from 'antd';
import store from '@/base/redux/store';
import {requestLoading} from '@/base/redux/actions';
import {LoginOutAction} from '@/login/containers/login/redux/actions';

// 创建axios实例
const service = axios.create({
  timeout: 100000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // config.url = config.url.replace('api', 'merchant');
  if (config.headers.isLoading == undefined) {
    store.dispatch(requestLoading({operate: 'open'}))
  }
  // 设置请求报文头
  try {
    // 获取状态管理内的token
    if (store.getState() && store.getState().LoginUserInfo && store.getState().LoginUserInfo.token) {
      config.headers['Token'] = store.getState().LoginUserInfo.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
  } catch (error) {
  }
  return config
}, error => {
  message.warn(error.message, 2)
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    store.dispatch(requestLoading({operate: 'close'}));
    if (response.data.errCode == '000006') { // 登录过期
      store.dispatch(LoginOutAction('loginout'));
      window.location.href = `${window.location.origin}#/login/index`;
    }
    return response;
  },
  error => {
    store.dispatch(requestLoading({operate: 'close'}));
    // 提示错误信息
    message.warn(error.message, 2)
    return Promise.reject(error)
  }
)

export default service;
