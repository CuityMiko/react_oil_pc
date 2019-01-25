/*用来承载基本信息-储值账户-积分账户-的tab*/
import React,{Component} from 'react';
import { Tabs } from 'antd';
import {connect} from 'react-redux';

import { receiveData } from '@/base/redux/actions';
import DetailShowComplex from '@/common/components/detail_show/DetailShowComplex';
import AccountInfoContainer from '@/member_center/containers/member_list/containers/detail/AccountInfo';
import PointInfoContainer from '@/member_center/containers/member_list/containers/detail/PointInfo';
import AppTabs from '@/common/components/app_tabs/AppTabs';

import MemberListService from '@/member_center/services/member_list/member_list.service';

const TabPane = Tabs.TabPane;

class DetailContainer extends Component {
    // 状态值
    state = {
        title:'会员详情',
        dataDetailBasic:new Map(),
        currentTab: 'store-account',
        gasCardId:0,
        dieselCardId:0
    };

    componentDidMount() {
        // 基本详情
        this.basicDetailData(this.props.params.memberId);
    }

    // 初始化面包屑-会员详情-tab
    initBreadcrum = () => {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '会员详情',
            routes: [
                {title: '会员中心'},
                {title: '会员列表', path: '/main/member_center/member_list'},
                {title: '会员详情', path: '/main/member_center/member_detail'+'/'+this.props.params.memberId}
            ],
            children: this.bindTabs()
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    };

    // 基本详情接口
    basicDetailData = (memberId)=>{
        MemberListService.detailMbr(memberId).then((res)=>{
            this.setState({
                dataDetailBasic: res.dataDetailBasic,
                gasCardId:res.gasCardId,
                dieselCardId:res.dieselCardId,
            });
            // 先获取详情数据再渲染元素
            this.initBreadcrum();
        }).catch((result) => {
            this.setState({
                dataDetailBasic: result.data.dataDetailBasic
            })
        });
    };

    // 切换tab项触发事件
    changeContent = (key) => {
        this.setState({
            currentTab: key
        })
    };
    // 绑定Tabs数据源
    bindTabs = () => {
        let tabobj = {
            defaultActiveKey: 'store-account'
        };
        let tabs = [
            {
                key: 'store-account',
                title: '储值账户',
                handleClick: this.changeContent
            },
            {
                key: 'score-account',
                title: '积分账户',
                handleClick: this.changeContent
            }
        ];
        return (
            <div className="basic-info-container">
                <DetailShowComplex headerHave={false} footerHave={false} data ={this.state.dataDetailBasic} direction="level" colNum={3}>
                </DetailShowComplex>
                <AppTabs tabobj={tabobj} tabs={tabs}/>
            </div>
        )
    };

     // 绑定当前Tab
    bindCurrentTab = () => {
        const {currentTab,gasCardId,dieselCardId} = this.state;
        const {memberId} = this.props.params;
        const {history} = this.props;
        switch (currentTab) {
            case 'store-account':
                return (
                    <AccountInfoContainer memberId={memberId} gasCardId={gasCardId} dieselCardId={dieselCardId} history={history}/>
                );
            case 'score-account':
                return (
                    <div>
                        <PointInfoContainer memberId={memberId} history={history}/>
                    </div>
                );
            default:
                break;
        }
    };

    render() {
        return (
            <div className="detail-content-container">
                {this.bindCurrentTab()}
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(DetailContainer);