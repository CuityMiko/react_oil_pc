/**
* 左右留白使用说明
* 用于元素之间间隔处理，暴露size属性值，默认为l-md，可选值l-sm、l-md、l-lg、l-xl、l-2xl、l-3xl、l-4xl、l-5xl，
* 使用方法import引入，调用 <WingBlank size="l-sm"></WingBlank>,中间可
* 插入其他元素，作为children传入
*/

import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './wing_blank.less';

class WingBlank extends Component {
    // 数据类型
    static propTypes = {
        size: PropTypes.oneOf(['l-sm', 'l-md', 'l-lg', 'l-xl', 'l-2xl', 'l-3xl', 'l-4xl', 'l-5xl'])
    };

    // 默认参数
    static defaultProps = {
        size: 'l-md'
    };

    render() {
        const { size, children } = this.props;
        const classNameDefined = classnames(size);
        return (
            <div className={classNameDefined}>
                {children}
            </div>
        )
    }

}

export default WingBlank;