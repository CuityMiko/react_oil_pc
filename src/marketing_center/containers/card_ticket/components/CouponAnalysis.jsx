/**
 * 营销分析
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Row, Col, Icon,message } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import { receiveData } from '@/base/redux/actions';
import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import DataCard from '@/common/components/data_card/DataCard';
import TableUser from '@/common/components/table_user/TableUser';
import putInNum1 from '@/marketing_center/assets/images/put-in-num-1.png';
import getIn2 from '@/marketing_center/assets/images/get-in-2.png';
import verif3 from '@/marketing_center/assets/images/verif-3.png';
import pushConsume4 from '@/marketing_center/assets/images/push-consume-4.png';
import sumOfMoney5 from '@/marketing_center/assets/images/sum-of-money-5.png';
import perTransf6 from '@/marketing_center/assets/images/per-transf-6.png';
import CouponAnalysisEcharts from '@/marketing_center/containers/card_ticket/components/CouponAnalysisEcharts';
import NoData from '@/common/components/no_data/NoData';

import CouponService from '@/marketing_center/services/card_ticket/card_ticket.service';

class CouponAnalysis extends Component {
    state = {
        // icon集合
        icons:{
            putInNum1:putInNum1,
            getIn2:getIn2,
            verif3:verif3,
            pushConsume4:pushConsume4,
            sumOfMoney5:sumOfMoney5,
            perTransf6:perTransf6
        },
        // 图表数据
        detailData:{
            x:[],
            y:[]
        },
        arrX:[],
        arrY:[],
        // 统计数据
        dataTotal:[],
        // 活动拉新数据
        detailDataNew:{
            titleText:'活动拉新效果',
            numText:'人数',
            perText:'占比',
            dataItems:[
                {
                    title:'拉新人数占比',
                    num:0,
                    per:'0%'
                },
                {
                    title:'回头客人数占比',
                    num:0,
                    per:'0%'
                },
                {
                    title:'挽回流失人数占比',
                    num:0,
                    per:'0%'
                }
            ]
        },
        // 活动留存数据
        detailDataRetain:{
            titleText:'活动留存效果',
            numText:'人数',
            perText:'转化',
            dataItems:[
                {
                    title:'7天内',
                    num:0,
                    per:'0%'
                },
                {
                    title:'1月内',
                    num:0,
                    per:'0%'
                },
                {
                    title:'3月内',
                    num:0,
                    per:'0%'
                }
            ]
        }
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const {id, couponNumber, couponName} = this.props.query;
        const breadcrumbdata = {
            title: '营销分析',
            routes: [
                {title: '营销中心', path: ''},
                {title: '卡券营销', path: '/main/marketing_center/card_ticket'},
                {title: '营销分析', path: '/main/marketing_center/coupon_analysis?id='+id+
                '&couponNumber='+couponNumber+'&couponName='+couponName}
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        const {id, couponNumber, couponName} = this.props.query;
        const {icons} = this.state;
        // 卡券营销分析-表格渲染数据
          CouponService.effectViewCoupon(couponNumber).then(res => {
            this.setState({
                detailDataNew:res.detailDataNew,
                detailDataRetain:res.detailDataRetain
              });
          }).catch(result => {
              this.setState({
                  detailDataNew:result.data.detailDataNew,
                  detailDataRetain:result.data.detailDataRetain
              })
          })
       // 卡券统计-数字卡片数据
        CouponService.couponCount(couponNumber,icons).then(res => {
            this.setState({
                dataTotal:res
            });
        }).catch(result => {
            this.setState({
                dataTotal: result.data
            })
        })

        // 卡券统计-图表数据
        CouponService.couponCountChart(id).then(res => {
            this.setState({
                detailData:res,
                // arrX:res.arrX,
                // arrY:res.arrY
            });
        }).catch(err => {
          console.log(err)
        })
    }

    render() {
        // const {responsive,menu,LoginUserInfo} = this.props;
        const {detailData,dataTotal,detailDataNew,detailDataRetain} = this.state;
        // console.log(detailData,'detailData-detailData')
        const {id, couponNumber, couponName} = this.props.query;
        // 营销分析图表option
    /*    const option = {
            title: {
                text: '卡券领取张数折线图',
                left: '50%',
                show: false,
                textAlign: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                backgroundColor: 'rgba(255,255,255,1)',
                padding: [5, 10],
                textStyle: {
                    color:'rgba(0, 0, 0, 0.85)'
                },
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
            },
            legend: {
                right: 20,
                orient: 'vertical',
                selectedMode:false
            },
            xAxis: {
                type: 'category',
                data: arrX,
                boundaryGap: false,
                splitLine: {
                    show: true,
                    interval: 'auto',
                    lineStyle: {
                        color: ['#D4DFF5']
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color:'#d9d9d9'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 14,
                        color:'rgba(0, 0, 0, 0.65)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: ['#D4DFF5']
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color:'#d9d9d9'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 14,
                        color:'rgba(0, 0, 0, 0.65)'
                    }
                }
            },
            series: [{
                name: couponName,
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: 6,
                data: arrY,
               /!* areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(216, 244, 247,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(216, 244, 247,1)'
                        }], false)
                    }
                },*!/
                itemStyle: {
                    normal: {
                        color:'#1890ff'
                    }
                },
                lineStyle: {
                    normal: {
                        width: 3
                    }
                }
            }]
        };*/
        return (
            <div className="coupon-analysis">
                <WingBlank size="l-3xl">
                    <WhiteSpace size="v-xl" />
                    <Row>
                        <Col md={8}>
                            <div className="coupon-desc">
                                <Icon type="exclamation-circle"/>
                                <span className="name-coupon">卡券名称：</span>
                                <span className="name-coupon-desc">{couponName}</span>
                            </div>
                        </Col>
                        <Col md={12} offset={4}>
                            <div className="set-tip">
                                <Icon type="exclamation-circle"/>
                                <span>活动数据统计从开始时间至当前时间，如活动已结束则统计到截止时间</span>
                            </div>
                        </Col>
                    </Row>
                    <WhiteSpace size="v-lg" />
                    <Row>
                        <Col>
                            <DataCard data={dataTotal} colNum={3} />
                        </Col>
                    </Row>
                    <WhiteSpace size="v-lg" />
                    <Row>
                        <Col md={12} className="chart-content">
                            卡券领取张数折线图
                            <WhiteSpace size="v-xl" />
                           {/* <ReactEcharts
                                option={option}
                                style={{height: '360px', width: '100%'}}
                                className={'react_for_echarts'}
                            />*/}
                            {
                                detailData.x.length <= 0 || detailData.y.length <= 0 ? (
                                    <NoData />
                                ) : ( <CouponAnalysisEcharts data={detailData} name={couponName} />)
                            }
                            {/*<CouponAnalysisEcharts data={detailData} name={couponName} />*/}
                        </Col>

                        <Col md={11} offset={1} className="tables-content">
                            <div className="tables">
                                <TableUser detailData={detailDataNew}></TableUser>
                            </div>
                            <div className="tables">
                                <TableUser detailData={detailDataRetain}></TableUser>
                            </div>
                        </Col>
                        <WhiteSpace size="v-xl" />
                    </Row>
                    <WhiteSpace size="v-xl" />
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => {
        const {responsive, menu} = state.AppData;
        const LoginUserInfo = state.LoginUserInfo;
        return {
            responsive,
            menu,
            LoginUserInfo
        }
    }, {receiveData})(CouponAnalysis);
