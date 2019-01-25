import React, { Component } from 'react';
import { Layout, notification, Icon, Spin, LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { connect } from 'react-redux';

import SiderCustom from '@/common/components/menu/SiderCustom';
import HeaderCustom from '@/common/components/header/HeaderCustom';
import { receiveData } from '@/base/redux/actions';
import Routers from '@/base/routes/router';
import routes from '@/base/routes/route';
import utils from './utils/'
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import ContentHeader from '@/common/components/content_header/ContentHeader';
import {SetUserLoginInfoAction} from '../login/containers/login/redux/actions';
import {GetUserInfoAction} from '@/oiltation_manage/containers/operator_manage/redux/actions';
import {Redirect} from 'react-router-dom';

const { Content, Footer } = Layout;

class App extends Component {
    state = {
        collapsed: false,
        pathname: ''
    };
    
    componentWillMount() {
        this.CheckLogin();
        this.getClientWidth();
        window.onresize = () => {
            this.getClientWidth();
        }
    }

    /**
     * 检测登录
     */
    CheckLogin = () => {
        setTimeout(() => {
            const { SetUserLoginInfoAction, LoginUserInfo, history } = this.props;
            const login_userinfo_store = sessionStorage.getItem('login_userinfo');
            if (login_userinfo_store) {
                if (!LoginUserInfo) {
                    SetUserLoginInfoAction();
                    // if (!this.judgeOutPathName()) {
                    //     history.push('/');
                    // }
                }
                // 获取用户信息并放入状态
                this.bindInitReduxState();
            } else {
                history.push('/login/index');
            }
        }, 100)
    }

    judgeOutPathName = () => {
        const outPathNames = ['/main/authorize_center'];
        const {pathname} = this.props.location;
        return outPathNames.indexOf(pathname) > -1;
    }

    /**
     * 初始化Redux状态
     */
    bindInitReduxState = () => {
        const {GetUserInfoAction, LoginUserInfo} = this.props;
        if (LoginUserInfo != null) {
            // 获取用户信息
            if (LoginUserInfo.staffId) {
                GetUserInfoAction(LoginUserInfo.staffId)
            }
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            pathname: newProps.history.location.pathname
        })
    }

    componentDidMount() {
        /**
         * 首次打开项目展示内容
         */
        // const openNotification = () => {
        //     notification.open({
        //       message: '欢迎光临',
        //       description: (
        //           <div>
        //               <p>
        //                 欢迎进入油站后台管理管理系统
        //               </p>
        //           </div>
        //       ),
        //       icon: <Icon type="smile-circle" style={{ color: 'red' }} />,
        //       duration: 0,
        //     });
        //     localStorage.setItem('isFirst', JSON.stringify(true));
        // };
        // const isFirst = JSON.parse(localStorage.getItem('isFirst'));
        // !isFirst && openNotification();
    }

    /**
     * 获取当前浏览器宽度并设置responsive管理响应式
     */
    getClientWidth = () => {
        const { receiveData } = this.props;
        receiveData({isMobile: utils.judgeIsMobile()}, 'responsive');
    };

    toggle = () => {
        const { receiveData } = this.props;
        receiveData({Collapsed: !this.state.collapsed}, 'menu');
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    render() {
        const { responsive, breadcrumb, requestLoading, LoginUserInfo } = this.props;
        const { pathname } = this.state;
        const login_userinfo_store = sessionStorage.getItem('login_userinfo');
        if (login_userinfo_store == undefined || login_userinfo_store == null) {
            return (
                <Redirect to="/login/index" />
            )
        }
        return (
            <LocaleProvider locale={zh_CN}>
                <Layout>
                    {!responsive.data.isMobile && <SiderCustom pathname={pathname} collapsed={this.state.collapsed} menus={routes.menus} others={routes.others}/>}
                    <Layout style={{flexDirection: 'column'}}>
                        <Spin tip={requestLoading.title} spinning={requestLoading.operate == 'open' ? true : false}>
                            <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={LoginUserInfo || {}} menus={routes.menus} others={routes.others}/>
                                <Content style={{ overflow: 'initial', flex: '1 1 0' }}>
                                    {breadcrumb && breadcrumb.data ? (<ContentHeader {...breadcrumb.data}/>) : null}
                                    <WingBlank size="l-xl">
                                        <WhiteSpace size="v-lg" />
                                        <Routers LoginUserInfo={LoginUserInfo}/>
                                    </WingBlank>
                                    <WhiteSpace size="v-lg" />
                                </Content>
                            {/* <Footer style={{ textAlign: 'center' }}>
                            oilStation-manage-frontend ©{new Date().getFullYear()} Created by CJ-FE
                            </Footer> */}
                        </Spin>
                    </Layout>

                    {
                        // 手机端对滚动很慢的处理
                        responsive.data.isMobile && (
                            <style>
                            {`
                                #root{
                                    height: auto;
                                }
                            `}
                            </style>
                        )
                    }
                </Layout>
            </LocaleProvider>
        );
    }
}

export default connect(
    state => {
        const { responsive = {data: {}}, menu = {data: {}}, breadcrumb = {data: {}} } = state.AppData;
        return {responsive, menu, breadcrumb, requestLoading: state.requestLoading, LoginUserInfo: state.LoginUserInfo};
    },
    {receiveData, SetUserLoginInfoAction, GetUserInfoAction}
)(App);
