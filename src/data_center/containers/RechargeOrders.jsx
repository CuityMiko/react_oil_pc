import React, { Component } from 'react';
import {connect} from 'react-redux';
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


class RechargeOrders extends Component {
    state = {
        // 充值订单列表数据
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
        this.getOrderRechargeCountFun({});
        this.queryRechargeOrderFun({});
    }

    // 查询充值订单列表
    queryRechargeOrderFun = ({pageNo=1, pageSize=20, payTimeStart='', payTimeEnd='', orderNumberFilter='', mobile='', cardSpecId=''}) => {
        dataCenterService.queryRechargeOrder({
            pageNO: pageNo,
            pageSize: pageSize,
            payTimeStart: payTimeStart,
            payTimeEnd: payTimeEnd,
            orderNumberFilter: orderNumberFilter,
            mobile: mobile,
            cardSpecId: cardSpecId
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

    // 查询统计订单汇总数据
    getOrderRechargeCountFun = ({payTimeStart='', payTimeEnd='', orderNumberFilter='', mobile='', cardSpecId=''}) => {
        dataCenterService.getOrderRechargeCount({
            payTimeStart: payTimeStart,
            payTimeEnd: payTimeEnd,
            orderNumberFilter: orderNumberFilter,
            mobile: mobile,
            cardSpecId: cardSpecId
        })
            .then((res) => {
                this.setState({
                    numberData: new Map().set('实储总额', `￥${Number(res.realStorageAmount).toFixed(2)}`)
                        .set('赠送金额', `￥${Number(res.giftAmount).toFixed(2)}`)
                        .set('储值总额', `￥${Number(res.totalAmount).toFixed(2)}`)
                        .set('储值余额', `￥${Number(res.storedValueBalance).toFixed(2)}`)
                })
            })
            .catch((err) => {
                console.log(err)
            })
    };

    // 导出充值订单列表
    exportRechargeOrderFun = () => {
        let fieldValueData = this.getFieldValueFun();
        dataCenterService.exportRechargeOrder({
            payTimeStart: fieldValueData.payTimeStart,
            payTimeEnd: fieldValueData.payTimeEnd,
            orderNumberFilter: fieldValueData.orderNumberFilter || '',
            mobile: fieldValueData.mobile || '',
            cardSpecId: fieldValueData.cardSpecId || ''
        })
    };

    // 表单查询函数
    search = () => {
        this.setState({
            pageNo: 1
        });
        let fieldValueData = this.getFieldValueFun();
        this.getOrderRechargeCountFun({
            payTimeStart: fieldValueData.payTimeStart,
            payTimeEnd: fieldValueData.payTimeEnd,
            orderNumberFilter: fieldValueData.orderNumberFilter,
            mobile: fieldValueData.mobile,
            cardSpecId: fieldValueData.cardSpecId
        });
        this.queryRechargeOrderFun({
            payTimeStart: fieldValueData.payTimeStart,
            payTimeEnd: fieldValueData.payTimeEnd,
            orderNumberFilter: fieldValueData.orderNumberFilter,
            mobile: fieldValueData.mobile,
            cardSpecId: fieldValueData.cardSpecId
        })
    };

    // 表单重置函数
    reset = () => {
        // 清空查询条件
        this.props.form.resetFields();
        this.getOrderRechargeCountFun({});
        this.queryRechargeOrderFun({});
    };

    // 页码改变后的回调函数
    onChange = (page) => {
        this.setState({
            pageNo: page
        });
        let fieldValueData = this.getFieldValueFun();
        this.queryRechargeOrderFun({
            pageNo: page,
            payTimeStart: fieldValueData.payTimeStart,
            payTimeEnd: fieldValueData.payTimeEnd,
            orderNumberFilter: fieldValueData.orderNumberFilter,
            mobile: fieldValueData.mobile,
            cardSpecId: fieldValueData.cardSpecId
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
            mobile: this.props.form.getFieldValue('mobile'),
            cardSpecId: this.props.form.getFieldValue('cardSpecId'),
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
                title: '充值单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber'
            },
            {
                title: '会员手机号',
                dataIndex: 'mobile',
                key: 'mobile'
            },
            {
                title: '充值卡种',
                dataIndex: 'cardSpecId',
                key: 'cardSpecId',
                render: (text) => {
                    switch (text) {
                        case 1:
                            return '汽油卡';
                        case 2:
                            return '柴油卡';
                        default:
                            return '-';
                    }
                }
            },
            {
                title: '充值金额',
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
                title: '赠送金额',
                dataIndex: 'giftContent',
                key: 'giftContent',
                render: (text, record, index) => {
                    // giftType 0 送金额；1 送积分；2 送卡券
                    switch (record.giftType) {
                        case 0:
                            if(text != null) {
                                return '￥' + Number(text).toFixed(2)
                            } else {
                                return '￥0.00'
                            }
                        case 1:
                            return text;
                        case 2:
                            return text;
                        default:
                            return '-';
                    }
                }
            },
            {
                title: '充值方式',
                dataIndex: 'payEntry',
                key: 'payEntry',
                render: (text) => {
                    switch (text) {
                        case 0:
                            return '微信支付';
                        case 1:
                            return '支付宝';
                        case 6:
                            return '会员卡';
                        default:
                            break;
                    }
                }
            },
            {
                title: '充值时间',
                dataIndex: 'payTime',
                key: 'payTime',
                render: (text) => {
                    return text ? moment(text).format('YYYY.MM.DD HH:mm') : '-'
                }
            }
        ];

        return (
            <div className="consumer-order-container">
                <Panel>
                    <Form>
                        <TableSearch search={this.search} reset={this.reset} colNum={2}>
                            <FormItem label="充值单号：" >
                                {getFieldDecorator('orderNumberFilter')(
                                    <Input placeholder="请输入充值单号" />
                                )}
                            </FormItem>
                            <FormItem label="充值时间：" >
                                {getFieldDecorator('time')(
                                    <RangePicker showTime allowClear={false} format="YYYY-MM-DD HH:mm:ss" locale={locale} />
                                )}
                            </FormItem>
                            <FormItem label="会员手机号：" >
                                {getFieldDecorator('mobile')(
                                    <Input placeholder="请输入会员手机号" />
                                )}
                            </FormItem>
                            <FormItem label="选择卡种：">
                                {getFieldDecorator('cardSpecId')(
                                    <Select placeholder="请选择">
                                        <Option value={null}>全部</Option>
                                        <Option value={1}>汽油卡</Option>
                                        <Option value={2}>柴油卡</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </TableSearch>
                        <Button type="primary" onClick={this.exportRechargeOrderFun}>导出</Button>
                    </Form>
                    <WhiteSpace size="v-lg" />
                    <NumberCard numberData={numberData} />
                    <div className="scroll-table">
                        <Table locale={{emptyText: '暂无数据'}}
                               dataSource={orderData}
                               rowKey= {record => record.id}
                               columns={columns}
                               scroll={{ x: 1000 }}
                               pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChange}}
                        >
                        </Table>
                    </div>
                </Panel>
            </div>
        );
    }
}

export default connect(state => ({}), {receiveData})(Form.create()(RechargeOrders));