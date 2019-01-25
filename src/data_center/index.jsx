import React, { Component } from 'react';
import {connect} from 'react-redux';

import { receiveData } from '@/base/redux/actions';
import AppTabs from '@/common/components/app_tabs/AppTabs';
// 消费订单
import ConsumerOrders from './containers/ConsumerOrders';
// 充值订单
import RechargeOrders from './containers/RechargeOrders';

class DataCenter extends Component {
    state = {
        currentTab: 'consumerOrders'
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '订单列表',
            routes: [
                {title: '订单列表', path: '/main/data_center'}
            ],
            children: this.bindTabs()
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    /**
     * 绑定tabs数据源
     */
    bindTabs = () => {
        let tabobj = {
            defaultActiveKey: 'consumerOrders'
        };
        let tabs = [
            {
                key: 'consumerOrders',
                title: '消费订单',
                handleClick: this.changeContent
            },
            {
                key: 'rechargeOrders',
                title: '充值订单',
                handleClick: this.changeContent
            }
        ];
        return (
            <div>
                <AppTabs tabobj={tabobj} tabs={tabs} />
            </div>
        )
    };

    /**
     * 切换tab项触发事件
     */
    changeContent = (key) => {
        this.setState({
            currentTab: key
        })
    };

    /**
     * 绑定当前tab
     */
    bindCurrentTab = () => {
        const { currentTab } = this.state;

        const {
            history
        } = this.props;

        switch (currentTab) {
            case 'consumerOrders':
                return (
                    <div>
                        <ConsumerOrders history={history} />
                    </div>
                );
            case 'rechargeOrders':
                return (
                    <div>
                        <RechargeOrders />
                    </div>
                );
            default:
                break;
        }
    };

    render() {
        return (
            <div>
                {this.bindCurrentTab()}
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(DataCenter);