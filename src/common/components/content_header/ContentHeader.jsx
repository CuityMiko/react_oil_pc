/**
 * 公共内容头部组件
 * 适用于面包屑加标题场景
 * 参数：
 *  1、title: 显示标题 （如果不指定则不显示标题）
 *  2、routes: {title: 面包屑显示标题, path: 面包屑对应路由url(如果没有则不指定path项)}
 *  3、children：标题下其他内容React Element
 *  4、如果页面没有面包屑，则在redux状态管理中breadcrumb指定为null，例如：首页：receiveData(null, 'breadcrumb')
 *  5、面包屑尽量在componentWillMount钩子中声明，在componentWillUnmount钩子中重置状态
 *  6、tipTitle:标题title下的说明文字
 */
import React from 'react';
import {Link} from 'react-router-dom';
import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';

class ContentHeader extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        tipTitle:PropTypes.string,
        routes: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                path: PropTypes.string
            })
        ),
        children: PropTypes.element,
        tip: PropTypes.object
    }

    judgeIsMobile = () => {
        let {title, routes, children, responsive, tip, tipTitle} = this.props;
        routes = routes == null || undefined ? [] : routes;
        const _home = routes.find(route => route.title === '首页');
        if (!_home)
            routes.unshift({title: '首页', path: '/main/index'});
        if (responsive.data.isMobile) {
            return (
                <WingBlank size="l-xl">
                    <WhiteSpace size="v-md" />
                    {title && title != '' ? (<h3 style={{fontWeight: "500", fontSize: '12'}}>{title}{tip && tip.mobile ? tip.mobile : null}
                        {tipTitle&& (<div className="tip-title-style">{tipTitle}</div>)}
                    </h3>) : null}
                    {children ? children : null}
                </WingBlank>
            )
        } else {
            return (
                <WingBlank size="l-xl">
                    <WhiteSpace size="v-md" />
                    <Breadcrumb>
                        {
                            routes.map((route, index) => (<Breadcrumb.Item key={index}>{route.path ? (<Link to={route.path}>{route.title}</Link>) : (<span style={{color: '#8C8C8C'}}>{route.title}</span>)}</Breadcrumb.Item>))
                        }
                    </Breadcrumb>
                    <WhiteSpace size="v-sm" />
                    {title && title != '' ? (<h2 style={{fontWeight: "500", fontSize: '16'}}>{title}{tip && tip.pc ? tip.pc : null}
                        {tipTitle&& (<div className="tip-title-style">{tipTitle}</div>)}
                    </h2>) : null}
                    {children ? children : null}
                </WingBlank>
            )
        }
    }

    render() {
        return (
            <div className="content-header-container" style={{backgroundColor: '#ffff', marginTop: '1px', paddingBottom: '1px'}}>
                {this.judgeIsMobile()}
            </div>
        )
    }
}

export default connect(
    state => {
        const {responsive} = state.AppData;
        return {
            responsive
        }
    },
    {}
)(ContentHeader);