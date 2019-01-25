/**
 * 暂无数据
 * 参数：
 *  1、title：显示内容
 */
import React from 'react';
import {Divider} from 'antd';
import PropTypes from 'prop-types';

class NoData extends React.Component {
    static propTypes = {
        title: PropTypes.string
    }

    static defaultProps = {
        title: '暂无数据'
    }

    render() {
        const {title} = this.props;
        return <Divider style={{color: '#d2d2d2'}}>{title}</Divider>;
    }
}

export default NoData;