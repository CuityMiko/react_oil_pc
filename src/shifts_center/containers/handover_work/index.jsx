import React, { Component } from 'react';
import { connect } from 'react-redux';

import { receiveData } from '@/base/redux/actions';
import AppTabs from '@/common/components/app_tabs/AppTabs';
// 交班管理
import Management from './containers/Management';
// 交班记录
import Record from './containers/Record';

class HandoverWork extends Component {
    state = {
        currentTab: 'management'
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '交接班',
            routes: [
                {title: '交接班', path: '/main/handover_work'}
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
            defaultActiveKey: 'management'
        };
        let tabs = [
            {
                key: 'management',
                title: '交班管理',
                handleClick: this.changeContent
            },
            {
                key: 'record',
                title: '交班记录',
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

        switch (currentTab) {
            case 'management':
                return (
                  <div>
                      <Management />
                  </div>
                );
            case 'record':
                return (
                    <div>
                        <Record />
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

export default connect(
    state => {
        const {responsive, menu} = state.AppData;
        return {
            responsive,
            menu
        }
    },
    {receiveData}
)(HandoverWork);