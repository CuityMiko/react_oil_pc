import React, {Component} from 'react';
import {Menu, Icon, Layout, Popover, Drawer} from 'antd';
import screenfull from 'screenfull';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import avater from './assets/images/default_avater.png';
import SiderCustom from '@/common/components/menu/SiderCustom';
import {LoginOutAction} from '@/login/containers/login/redux/actions';

const {Header} = Layout;
const SubMenu = Menu.SubMenu;

class HeaderCustom extends Component {
    static propTypes = {
        menus: PropTypes.array.isRequired,
        others: PropTypes.array.isRequired
    }

    state = {
        user: '',
        visible: false,
    };

    componentDidMount() {
        const _user = JSON.parse(sessionStorage.getItem('login_userinfo')) || '';
        this.setState({
            user: _user
        });
    };

    screenFull = () => {
        if (screenfull.enabled) {
            screenfull.request();
        }

    };
    
    // 点击菜单操作
    menuClick = e => {
        e.key === 'personalinfo' && this.personal_info();
        e.key === 'modifypwd' && this.update_password();
        e.key === 'logout' && this.logout();
    };

    // 个人信息
    personal_info = () => {
        this.props.history.push('/main/personal_info');
    }

    // 修改密码
    update_password = () => {
        this.props.history.push('/main/update_password');
    }

    // 退出登录
    logout = () => {
        const {LoginOutAction} = this.props;
        sessionStorage.removeItem('login_userinfo');
        LoginOutAction();
        this.props.history.push('/login/index');
    };

    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    }
    
    handleVisibleChange = (visible) => {
        this.setState({visible});
    };

    render() {
        const {responsive, path, menus, UserInfo, others} = this.props;
        return (
            <div className="header-custom">
                <Header className="custom-theme header" style={{position: 'relative'}}>
                    {
                        responsive.data.isMobile ? (
                            <div>
                                <Icon type="bars" className="header__trigger custom-trigger"
                                      onClick={() => this.setState({visible: true})} />
                                <Drawer
                                    placement="left"
                                    closable={false}
                                    visible={this.state.visible}
                                    maskClosable={true}
                                    destroyOnClose={true}
                                    onClose={this.onClose}
                                    style={{height: '100%', padding: 0, width: '100%'}}
                                    width={200}
                                >
                                    <SiderCustom menus={menus} others={others} path={path} popoverHide={this.popoverHide} />
                                </Drawer>
                            </div>
                        ) : (
                            <Icon
                                className="header__trigger custom-trigger"
                                type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.props.toggle}
                            />
                        )
                    }
                    <Menu
                        mode="horizontal"
                        style={{lineHeight: '64px', top: 0, right: '20px', position: 'absolute', backgroundColor: 'white'}}
                        onClick={this.menuClick}

                    >
                        {/* <Menu.Item key="full" onClick={this.screenFull} >
                        <Icon type="arrows-alt" onClick={this.screenFull} />
                    </Menu.Item> */}
                        <SubMenu style={{backgroundColor: 'white'}} title={
                            <div>
                            <span className="avatar">
                                {UserInfo != null && UserInfo.headimgUrl ? <img src={UserInfo.headimgUrl} alt="头像" /> : <img src={avater} alt="头像" /> }
                                <i className="on bottom b-white" />
                            </span>
                                <span className="h-username">{UserInfo != null && UserInfo.realname ? UserInfo.realname : '测试'}</span>
                            </div>
                        }>
                            <Menu.Item key="personalinfo" style={{backgroundColor: 'white'}} ><span><Icon
                                type="user" />个人信息</span></Menu.Item>
                            <Menu.Item key="modifypwd"  style={{backgroundColor: 'white'}}><span><Icon
                                type="setting" />修改密码</span></Menu.Item>
                            <Menu.Item key="logout"  style={{backgroundColor: 'white'}}><span><Icon
                                type="poweroff" />退出登录</span></Menu.Item>
                        </SubMenu>
                    </Menu>
                </Header>
                <style>
                    {`
                    .header-custom .ant-menu-submenu-popup {
                         background-color: white;
                       }
                    `}
                </style>
            </div>


        )
    }
}

export default withRouter(connect(state => {
    const {responsive = {data: {}}} = state.AppData;
    return {
        responsive,
        UserInfo: state.UserInfo
    }
}, {LoginOutAction})(HeaderCustom));
