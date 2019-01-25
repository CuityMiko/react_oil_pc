import React from 'react';
import { Layout } from 'antd';
import {Link} from 'react-router-dom';

import logo from '@/base/assets/images/logo_dark.png'

const { Header } = Layout;

class PHeader extends React.Component {
    render() {
        return (
            <Header>
                <div>
                    <img src={logo} style={{height: 40}} alt="logo" />
                    <span style={{marginLeft: 10, fontWeight: "bolder", fontSize: 16}}>找回密码</span>
                    <Link to="/login/index" style={{float: 'right', marginRight: 5}}>返回登录</Link>
                </div>
            </Header>
        );
    }
}

export default PHeader;