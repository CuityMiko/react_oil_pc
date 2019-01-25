import React, {Component} from 'react';
import {connect} from 'react-redux';

import { receiveData } from '@/base/redux/actions';
import AppTabs from '@/common/components/app_tabs/AppTabs';
// 积分列表
import PointList from './containers/PointList';
// 在线兑换
import OnlineVerification from './containers/OnlineVerification';
// 兑换记录
import ExchangeRecord from './containers/ExchangeRecord';

class PointMall extends Component {
    state = {
        title: '积分商城',
        currentTab: 'jifen'
    }

    componentWillMount() {
        // 初始化面包屑
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '积分商城',
            routes: [
                {title: '会员中心'},
                {title: '积分商城', path: '/main/member_center/point_mall'}
            ],
            children: this.bindTabs()
        }
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    /**
     * 切换tab项触发事件
     */
    changeContent = (key) => {
        this.setState({
            currentTab: key
        })
    }

    /**
     * 绑定Tabs数据源
     */
    bindTabs = () => {
        let tabobj = {
            defaultActiveKey: 'jifen'
        }
        let tabs = [
            {
                key: 'jifen',
                title: '积分商城',
                handleClick: this.changeContent
            },
            {
                key: 'hexiao',
                title: '核销提货码',
                handleClick: this.changeContent
            }
        ]
        return (
            <div>
                <AppTabs tabobj={tabobj} tabs={tabs}/>
            </div>
        )
    }

    /**
     * 绑定当前Tab
     */
    bindCurrentTab = () => {
        const {currentTab} = this.state;
        const {history} = this.props;
        switch (currentTab) {
            case 'jifen':
                return (
                    <PointList history={history}/>
                )
            case 'hexiao':
                return (
                    <div>
                        <OnlineVerification history={history}/>
                        <ExchangeRecord history={history}/>
                    </div>
                )
            default:
                break;
        }
    }

    render() {
        return (
            <div>
                {this.bindCurrentTab()}
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(PointMall);