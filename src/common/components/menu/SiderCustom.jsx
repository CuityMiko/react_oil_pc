import React, {Component} from 'react';
import {Layout} from 'antd';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import SiderMenu from './SiderMenu';
import menubg from './assets/images/menuBg.png';
import logo from '@/base/assets/images/logo_light.png';
import logo_small from '@/base/assets/images/logo_light_small.png';
import routes from '@/base/routes/route';

const {Sider} = Layout;

const siderMenuStyle = {
    backgroundImage: `url(${menubg})`,
    overflowY: 'auto',
    height: '100%',
    width: '256px',
    maxWidth: '256px',
    minWidth: '256px'
};

class SiderCustom extends Component {
    static propTypes = {
        menus: PropTypes.array.isRequired,
        others: PropTypes.array.isRequired,
        pathname: PropTypes.string
    }

    static getDerivedStateFromProps(props, state) {
        if (props.collapsed !== state.collapsed) {
            const state1 = SiderCustom.setMenuOpen(props);
            const state2 = SiderCustom.onCollapse(props.collapsed);
            return {
                ...state1,
                ...state2,
                firstHide: state.collapsed !== props.collapsed && props.collapsed, // 两个不等时赋值props属性值否则为false
                openKey: state.openKey || (!props.collapsed && state1.openKey)
            }
        }
        return null;
    };

    static setMenuOpen = props => {
        const {pathname} = props.location;
        return {
            openKey: pathname.substr(0, pathname.lastIndexOf('/')),
            selectedKey: pathname
        };
    };

    static onCollapse = (collapsed) => {
        return {
            collapsed,
            // firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        };
    };

    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };

    componentDidUpdate() {
        const {selectedKey} = this.state;
        if (selectedKey != '') {
            let hashpath = window.location.hash.substring(1, window.location.hash.length);
            if (hashpath.indexOf('?') < 0) {
                if (selectedKey != hashpath) {
                    this.setState({selectedKey: hashpath})
                }
            } else {
                let _hashpath = hashpath.split('?')[0];
                if (selectedKey != _hashpath) {
                    this.setState({selectedKey: _hashpath})
                }
            }
        }
    }

    componentDidMount() {
        const state = SiderCustom.setMenuOpen(this.props);
        this.setState(state);
    }

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        const {popoverHide} = this.props; // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };

    render() {
        const {menus, collapsed} = this.props;
        const {selectedKey} = this.state;
        const loginClass = ClassNames('custom-logo', {'logo-center': collapsed});
        return (
            <div className="sider-menu-custom" style={{height: '100%'}}>
                <Sider
                    theme="light"
                    trigger={null}
                    breakpoint="lg"
                    collapsed={collapsed}
                    style={siderMenuStyle}
                >
                    <div className={loginClass} id="logo">
                        <div>
                            {collapsed ? (<img src={logo_small} alt="logo" />) : <img src={logo} alt="logo" />}
                        </div>
                    </div>
                    <SiderMenu
                        theme="dark"
                        style={{backgroundColor: `rgba(255,255,255,0)`}}
                        menus={menus}
                        onClick={this.menuClick}
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        openKeys={this.state.firstHide ? null : [this.state.openKey]}
                        onOpenChange={this.openMenu}
                    />
                </Sider>
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    .sider-menu-custom .ant-menu-dark, .ant-menu-dark .ant-menu-sub {
                        color: hsla(0,0%,100%,.65);
                        background: #001529;
                        }
                    .sider-menu-custom .ant-menu-dark .ant-menu-inline.ant-menu-sub {
                         background: rgba(255,255,255,0);
                         box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45) inset;
                        }
                    `}
                </style>
            </div>
        )
    }
}

export default withRouter(SiderCustom);