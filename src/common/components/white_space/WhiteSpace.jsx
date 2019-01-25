/**
* 上下留白说明： 用于元素之间间隔处理，
* 暴露size属性值，默认为v-md，可选值v-2xs、v-xs、v-sm、v-md、v-lg、v-sxl、v-xl、v-2xl、v-3xl、v-4xl,
* 使用方法import引入，调用 <WhiteSpace size="v-xs" />
*/

import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './white_space.less';

class WhiteSpace extends Component {
    // 数据类型
    static propTypes = {
        size: PropTypes.oneOf(['v-2xs', 'v-xs', 'v-sm', 'v-md', 'v-lg', 'v-sxl' , 'v-xl', 'v-2xl', 'v-3xl', 'v-4xl'])
    };

    // 默认参数
    static defaultProps = {
        size: 'v-md'
    };

    render() {
        const { size } = this.props;
        const classNameDefined = classnames(size);
        return (
            <div className={classNameDefined}></div>
        )
    }
}

export default WhiteSpace;
