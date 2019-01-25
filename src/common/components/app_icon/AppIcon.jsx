/**
 * Icon图标组件
 * 1、与iconfont结合
 * 2、iconfont图标地址：http://iconfont.cn/manage/index?manage_type=myprojects&projectId=962199
 * 3、采用iconfont的Symbol方式
 * 4、地址在config.js配置
 * 5、参数：type: iconfont类型，styleobj: 样式对象
 */

import React from 'react'
import {Icon} from 'antd'
import PropTypes from 'prop-types'

import Conf from './config';

class AppIcon extends React.Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        style: PropTypes.object
    }

    static defaultProps = {
        style: {
            fontSize: 15
        }
    }

    render() {
        const MyIcon = Icon.createFromIconfontCN({
            scriptUrl: Conf.oil_station_url
        });

        const {type, style} = this.props;

        return (
            <MyIcon type={type} style={style}/>
        ) 
    }
}

export default AppIcon;