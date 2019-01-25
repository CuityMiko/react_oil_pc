import React from 'react';
import { Row, Col, Tabs, Radio } from 'antd';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import moment from 'moment';
import classNames from 'classnames';

import MemberConsumePieEcharts from './components/MemberConsumePieEcharts';
import WorkEndEcharts from './components/WorkEndEcharts';
import Panel from '@/common/components/panel/Panel';
import { receiveData } from '@/base/redux/actions';
import DataCard from '@/common/components/data_card/DataCard';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import totalConsume1 from '@/main/assets/images/total-consume-1.png';
import totalRecharge2 from '@/main/assets/images/total-recharge-2.png';
import totalMbrNew3 from '@/main/assets/images/total-mbr-new-3.png';
import MemberListService from '@/member_center/services/member_list/member_list.service';
import DataCenterService from '@/data_center/services/data_center.service';
import WorkEndService from '@/shifts_center/services/work_end/work_end.service';
import NoData from '@/common/components/no_data/NoData';

import './main.less';

class Home extends React.Component {
    state = {
        // 统计数据
        dataTotal:[
            {
                'title':'消费总额',
                'amount':'￥0.00',
                'icon':totalConsume1
            },
            {
                'title':'充值总额',
                'amount':'￥0.00',
                'icon':totalRecharge2
            },
            {
                'title':'新增会员',
                'amount':0,
                'icon':totalMbrNew3
            }
        ],
        keyActive: '1',
        dateStart: '',
        dateEnd: '',
        workendData: {
            x: [],
            y: []
        }, // 班结统计数据
        MemberConsumeData: {
            x: [],
            y: []
        } // 会员消费统计数据
    }
    componentWillMount() {
        const {receiveData} = this.props;
        receiveData(null, 'breadcrumb');
    }

    componentDidMount() {
        // 今天-开始时间-结束时间
        let todayStart = moment().startOf('day').format('x');
        let todayEnd = moment().endOf('day').format('x');
        this.setState({
            dateStart: todayStart,
            dateEnd: todayEnd
        }, () => {
            // 统计
            this.consumeTotalData();
        })
        // 绑定班结数据源
        this.bindWorkEndData();
        // 绑定会员消费统计数据源
        this.binMemberConsumeData();
    }

    /**
     * 绑定班结数据源
     */
    bindWorkEndData = () => {
        WorkEndService.getHandoverWorkStatistics().then(res => {
            res = res.sort((x, y) => x.endTime - y.endTime);
            let result = res.map(c=>({
                startTime: moment(c.startTime).format('MM.DD HH:mm'),
                endTime: moment(c.endTime).format('MM.DD HH:mm'),
                amount: c.amount
            }))
            let workendData = {
                x: result.map(c => c.endTime),
                y: result.map(c => c.amount)
            }
            this.setState({workendData});
        })
    }
    
    /**
     * 绑定会员消费统计数据源
     */
    binMemberConsumeData = () => {
        // 获取消费统计
        DataCenterService.getMemberConsumeData().then(res => {
            let MemberConsumeData = {
                x: [],
                y: []
            }
            if (res != null) {
                const memberConsumptiveTotal = res.memberConsumptiveTotal || 0; // 会员消费
                const nonMemberConsumptiveTotal = res.nonMemberConsumptiveTotal || 0; // 非会员消费
                let x = [`非会员消费: ￥${nonMemberConsumptiveTotal}`, `会员消费: ￥${memberConsumptiveTotal}`];
                let y = [
                    {value: nonMemberConsumptiveTotal, name: `非会员消费: ￥${nonMemberConsumptiveTotal}`},
                    {value: memberConsumptiveTotal, name: `会员消费: ￥${memberConsumptiveTotal}`}
                ]
                MemberConsumeData = {x, y};
            }
            this.setState({MemberConsumeData});
        })
    }

    // 订单金额统计请求接口
    consumeTotalData = ()=>{
        const {dateStart, dateEnd} = this.state;
        let dataCount = [];
        let obj1 ={};
        let obj2 = {};
        let obj3 = {};
        DataCenterService.getOrderTotal({
            dateStart,
            dateEnd,
        }).then((res)=>{
            obj1 = {
                'title':'消费总额',
                'amount':'￥'+res.totalConsumptiveAmount,
                'icon':totalConsume1
            }
            obj2 = {
                'title':'充值总额',
                'amount':'￥'+res.totalRechargeAmount,
                'icon':totalRecharge2
            }
            dataCount.push(obj1);
            dataCount.push(obj2);
            MemberListService.newTotalMbr({
                dateStart,
                dateEnd,
            }).then((res)=>{
                obj3 = {
                    'title':'新增会员',
                    'amount':res,
                    'icon':totalMbrNew3
                }
                dataCount.push(obj3);
                this.setState({
                    dataTotal : dataCount
                })
            }).catch(
                (err) => {
                    console.log('err');
                }
            );
        }).catch(
            (err) => {
                console.log('err');
            }
        );
    };

    // 按钮控制tab
    handleModeChange = (e) => {
        // 按钮控制tab的激活状态，tab栏隐藏
        // 今天-开始时间-结束时间
        let todayStart = moment().startOf('day').format('x');
        let todayEnd = moment().endOf('day').format('x');
        // 昨日-开始时间-结束时间
        let yesDayStart = ((moment().startOf('day').subtract('days', 1)).format('x'))
        let yesDayEnd = (moment().endOf('day').subtract('days', 1).format('x'))
        // 当月-开始时间-结束时间
        let monthNowStart = moment().startOf('month').format('x');
        let monthNowEnd = moment().endOf('month').format('x');
        // 上月-开始时间-结束时间
        let monthYesStart = (moment().subtract('month', 1).format('YYYY-MM') + '-01')
        monthYesStart = new Date(monthYesStart + ' 00:00:00').getTime();
        let monthYesEnd = (moment(monthYesStart).subtract('month', -1).add('days', -1).format('YYYY-MM-DD'))
        monthYesEnd = new Date(monthYesEnd + ' 23:59:59').getTime();
        if (e.target.value == 1) {
            this.setState({
                keyActive: '1',
                dateStart: todayStart,
                dateEnd: todayEnd
            }, () => {
                // 统计
                this.consumeTotalData();
            })
        } else if (e.target.value == 2) {
            // 将昨天的时间戳传给接口，统计数据，两个接口同时调并把数据统一到state的数据中
            this.setState({
                keyActive: '2',
                dateStart: yesDayStart,
                dateEnd: yesDayEnd
            }, () => {
                // 统计
                this.consumeTotalData();
            })
        } else if (e.target.value == 3) {
            // 将本月的时间戳传给接口，统计数据，两个接口同时调并把数据统一到state的数据中
            this.setState({
                keyActive: '3',
                dateStart: monthNowStart,
                dateEnd: monthNowEnd
            }, () => {
                // 统计
                this.consumeTotalData();
            })
        } else if (e.target.value == 4) {
            // 将上月的时间戳传给接口，统计数据，两个接口同时调并把数据统一到state的数据中
            this.setState({
                keyActive: '4',
                dateStart: monthYesStart,
                dateEnd: monthYesEnd
            }, () => {
                // 统计
                this.consumeTotalData();
            })
        }
    };

    render() {
        const {dataTotal, keyActive, workendData, MemberConsumeData} = this.state;
        const {responsive} = this.props;
        let isMobile = responsive.data.isMobile;
        const mainContentStyle = classNames('main-content-container',
            {'main-content-container-mobile': isMobile},{'main-content-container-computer':!isMobile});
        const headerBtnHtml = (
            <Row gutter={16} className="btn-container-main">
                <Radio.Group onChange={this.handleModeChange} value={keyActive} style={{}}>
                    <Col md={6} lg={6} xs={6} className="date-select"><Radio.Button value="1">今日</Radio.Button></Col>
                    <Col md={6} lg={6} xs={6} className="date-select"><Radio.Button value="2">昨日</Radio.Button></Col>
                    <Col md={6} lg={6} xs={6} className="date-select"><Radio.Button value="3">本月</Radio.Button></Col>
                    <Col md={6} lg={6} xs={6} className="date-select"><Radio.Button value="4">上月</Radio.Button></Col>
                </Radio.Group>
                <Tabs activeKey={keyActive}>
                </Tabs>
            </Row>
        );
        return (
            <div className={mainContentStyle}>
                <Row gutter={16} className="main-top-container">
                    <Col md={24} lg={19} xs={24}>
                        <div className="main-data-content">
                            {/*<WingBlank size="l-xl">*/}
                                {/*<WhiteSpace size="v-lg" />*/}
                                <Panel title="数据概览" bordered={true} headerBtnHtml={isMobile?null:headerBtnHtml} innerType="inner">
                                    {
                                        isMobile && (
                                            headerBtnHtml
                                        )
                                    }
                                    <DataCard data={dataTotal} colNum={3} />
                                </Panel>
                        </div>
                    </Col>
                    <Col md={24} lg={5} xs={24}>
                        <Panel title="常用功能" bordered={true} innerType="inner">
                            <Row gutter={16}>
                                <Col md={11} lg={11} xs={11} className="des-item">
                                    <Link to='/main/data_center'>订单列表</Link>
                                    </Col>
                                <Col md={13} lg={13} xs={13} className="des-item">
                                    <Link to='/main/marketing_center/card_ticket'>卡券营销</Link>
                                </Col>
                            </Row>
                            <WhiteSpace size="v-lg" />
                            <Row gutter={16}>
                                <Col md={11} lg={11} xs={11} className="des-item">
                                    <Link to='/main/marketing_center/per_rise_minus'>每升立减</Link>
                                </Col>
                                <Col md={13} lg={13} xs={13} className="des-item">
                                    <Link to='/main/marketing_center/after_payment'>支付后营销</Link>
                                </Col>
                            </Row>
                        </Panel>
                    </Col>
                </Row>

                <WhiteSpace size="v-lg" />
                <Row gutter={16} className="chart-content-container">
                    <Col className="chart-content" md={12}>
                        <div className="">
                            <Panel title="最近7天班结统计" bordered={true} innerType="inner">
                                {
                                    workendData.x.length <= 0 || workendData.y.length<=0 ? (
                                        <NoData />
                                    ) : (<WorkEndEcharts data={workendData} />)
                                }
                            </Panel>
                        </div>
                    </Col>
                    <Col className="chart-content" md={12}>
                        <div className="">
                            <Panel title="本月会员消费占比" bordered={true} innerType="inner">
                                {
                                    MemberConsumeData.x.length <= 0 || MemberConsumeData.y.length<=0 ? (
                                        <NoData />
                                    ) : (<MemberConsumePieEcharts data={MemberConsumeData}/>)
                                }
                            </Panel>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(state => {
    const {responsive} = state.AppData;
    return {
        responsive,
    }
}, {receiveData})(Home);