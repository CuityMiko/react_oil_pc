import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import WhiteSpace from '../white_space/WhiteSpace'

class BreadcrumbCustom extends React.Component {
    render() {
        const first = <Breadcrumb.Item>{this.props.first}</Breadcrumb.Item> || '';
        const second = <Breadcrumb.Item>{this.props.second}</Breadcrumb.Item> || '';
        const third = <Breadcrumb.Item>{this.props.third}</Breadcrumb.Item> || '';
        return (
            <span>
                <WhiteSpace size="v-sxl" />
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={'/main/index'}>首页</Link></Breadcrumb.Item>
                        {first}
                        {second}
                        {third}
                </Breadcrumb>
                <WhiteSpace />
            </span>
        )
    }
}

export default BreadcrumbCustom;
