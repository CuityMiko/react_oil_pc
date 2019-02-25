import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { receiveData } from '@/base/redux/actions';

import { DatePicker, Form, Select, Table, Button, Input } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import Panel from '@/common/components/panel/Panel';
import TableSearch from '@/common/components/table_search/TableSearch';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import NumberCard from '@/common/components/number_card/NumberCard';

import dataCenterService from '@/data_center/services/data_center.service';

const { RangePicker } = DatePicker;
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

class ConsumerOrders extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    state = {
        // 消费订单列表数据
        orderData: [],
        // 当前页码
        pageNo: 1,
        // 每页显示的条数
        pageSize: 20,
        // 总共的数据条数
        total: 0,
        // 订单汇总数据
        numberData: new Map()
    };

    componentDidMount() {
        this.getOrderConsumeCountFun({});
        this.querySimpleOrderFun({});
    }

    // 查询消费订单列表
    querySimpleOrderFun = ({pageNo=1, pageSize=20, payTimeStart='', payTimeEnd='', orderNumberFilter='', statusFilter=''}) => {
        dataCenterService.querySimpleOrder({
            pageNO: pageNo,
            pageSize: pageSize,
            payTimeStart: payTimeStart,
            payTimeEnd: payTimeEnd,
            orderNumberFilter: orderNumberFilter,
            statusFilter: statusFilter
        })
            .then((res) => {
                this.setState({
                    orderData: res.items,
                    total: res.total
                })
            })
            .catch((err) => {
                console.log(err)
            })
    };

    // 查询消费订单汇总数据
    getOrderConsumeCountFun = ({payTimeStart='', payTimeEnd='', orderNumberFilter='', statusFilter=''}) => {
        dataCenterService.getOrderConsumeCount({
            payTimeStart: payTimeStart,
            payTimeEnd: payTimeEnd,
            orderNumberFilter: orderNumberFilter,
            statusFilter: statusFilter
        })
            .then((res) => {
                this.setState({
                    numberData: new Map().set('订单总额', `￥${Number(res.orderTotalAmount).toFixed(2)}`)
                        .set('订单总数', res.orderNum)
                        .set('优惠总额', `￥${Number(res.discountPrice).toFixed(2)}`)
                        .set('油站实收', `￥${Number(res.paidIn).toFixed(2)}`)
                        .set('扣款金额', `汽：￥${Number(res.chargeAmount.gasoline).toFixed(2)} 柴：￥${Number(res.chargeAmount.diesel).toFixed(2)}`)
                        .set('退款总额', `￥${Number(res.refundAmount).toFixed(2)}`)
                })
            })
            .catch((err) => {
                console.log(err)
            })
    };

    // 查询消费订单详情
    getSimpleOrderDetailFun = (orderId) => {
        this.props.history.push(`/main/data_center/consumer_orders_detail/${orderId}`);
    };

    // 导出消费订单列表
    exportSimpleOrderFun = () => {
        let fieldValueData = this.getFieldValueFun();
        dataCenterService.exportSimpleOrder({
            payTimeStart: fieldValueData.payTimeStart,
            payTimeEnd: fieldValueData.payTimeEnd,
            statusFilter: fieldValueData.statusFilter || '',
            orderNumberFilter: fieldValueData.orderNumberFilter || ''
        })
    };

    // 表单查询函数
    search = () => {
        this.setState({
            pageNo: 1
        });
        let fieldValueData = this.getFieldValueFun();
        this.getOrderConsumeCountFun({
            payTimeStart: fieldValueData.payTimeStart,
            payTimeEnd: fieldValueData.payTimeEnd,
            statusFilter: fieldValueData.statusFilter,
            orderNumberFilter: fieldValueData.orderNumberFilter
        });
        this.querySimpleOrderFun({
            payTimeStart: fieldValueData.payTimeStart,
            payTimeEnd: fieldValueData.payTimeEnd,
            statusFilter: fieldValueData.statusFilter,
            orderNumberFilter: fieldValueData.orderNumberFilter
        })
    };

    // 表单重置函数
    reset = () => {
        // 清空查询条件
        this.props.form.resetFields();
        this.getOrderConsumeCountFun({});
        this.querySimpleOrderFun({});
    };

    // 页码改变后的回调函数
    onChange = (page) => {
        this.setState({
            pageNo: page
        });
        let fieldValueData = this.getFieldValueFun();
        this.querySimpleOrderFun({
            pageNo: page,
            payTimeStart: fieldValueData.payTimeStart,
            payTimeEnd: fieldValueData.payTimeEnd,
            statusFilter: fieldValueData.statusFilter,
            orderNumberFilter: fieldValueData.orderNumberFilter
        });
    };

    // 获取表单中的值
    getFieldValueFun = () => {
        let time = this.props.form.getFieldValue('time');
        let payTimeStart = '';
        let payTimeEnd = '';
        if(time) {
            payTimeStart = moment(time[0]).format('x');
            payTimeEnd = moment(time[1]).format('x');
        }
        return {
            statusFilter: this.props.form.getFieldValue('statusFilter'),
            orderNumberFilter: this.props.form.getFieldValue('orderNumberFilter'),
            payTimeStart: payTimeStart,
            payTimeEnd: payTimeEnd
        };
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        const {
            orderData,
            total,
            pageSize,
            pageNo,
            numberData
        } = this.state;

        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => {
                    return index + 1
                }
            },
            {
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber'
            },
            // {
            //     title: '移动支付订单号',
            //     dataIndex: 'outOrderNumber',
            //     key: 'outOrderNumber',
            //     render: (text) => {
            //         return text || '-'
            //     }
            // },
            {
                title: '订单金额',
                dataIndex: 'amount',
                key: 'amount',
                render: (text) => {
                    if(text != null) {
                        return '￥' + Number(text).toFixed(2)
                    } else {
                        return '￥0.00'
                    }
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text) => {
                    switch (text) {
                        case 0:
                            return <div className="pay-status-icon not-pay">待支付</div>;
                        case 1:
                            return <div className="pay-status-icon">支付成功</div>;
                        case 2:
                            return <div className="pay-status-icon not-pay">支付中</div>;
                        case 3:
                            return <div className="pay-status-icon refund">部分退款</div>;
                        case 4:
                            return <div className="pay-status-icon refund">全额退款</div>;
                        case 5:
                            return <div className="pay-status-icon close">已关闭</div>;
                        default:
                            return '-';
                    }
                }
            },
            {
                title: '支付时间',
                dataIndex: 'payTime',
                key: 'payTime',
                render: (text) => {
                    return text ? moment(text).format('YYYY.MM.DD HH:mm') : '-'
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => {
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => {this.getSimpleOrderDetailFun(record.id)}}>查看详情</a>
                        </span>
                    )
                }
            }
        ];

        return (
            <div className="consumer-order-container">
                <Panel>
                    <Form>
                        <TableSearch search={this.search} reset={this.reset} colNum={2}>
                            <FormItem label="支付时间：" >
                                {getFieldDecorator('time')(
                                    <RangePicker showTime allowClear={false} format="YYYY-MM-DD HH:mm:ss" locale={locale} />
                                )}
                            </FormItem>
                            <FormItem label="订单号：" >
                                {getFieldDecorator('orderNumberFilter')(
                                    <Input placeholder="请输入订单号" />
                                )}
                            </FormItem>
                            <FormItem label="支付状态：">
                                {getFieldDecorator('statusFilter')(
                                    <Select placeholder="请选择">
                                        <Option value={null}>全部</Option>
                                        <Option value={1}>待支付</Option>
                                        <Option value={2}>支付成功</Option>
                                        <Option value={4}>支付中</Option>
                                        <Option value={8}>部分退款</Option>
                                        <Option value={16}>全额退款</Option>
                                        <Option value={32}>已关闭</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </TableSearch>
                        <Button type="primary" onClick={this.exportSimpleOrderFun}>导出</Button>
                    </Form>
                    <WhiteSpace size="v-lg" />
                    <NumberCard numberData={numberData} />
                    <div className="scroll-table">
                        <Table locale={{emptyText: '暂无数据'}}
                               dataSource={orderData}
                               rowKey= {record => record.id}
                               columns={columns}
                               scroll={{ x: 800 }}
                               pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChange}}
                        >
                        </Table>
                    </div>
                </Panel>
            </div>
        );
    }
}

export default connect(state => ({
    LoginUserInfo: state.LoginUserInfo
}), {receiveData})(Form.create()(ConsumerOrders));