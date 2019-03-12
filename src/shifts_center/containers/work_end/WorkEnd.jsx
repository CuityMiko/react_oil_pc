import React, { Component } from 'react';
import {connect} from 'react-redux';
import { receiveData } from '@/base/redux/actions';

import { Button, Form, Select, Table, DatePicker, Row, Col, Modal, message, Progress } from 'antd';
import locale from "antd/lib/date-picker/locale/zh_CN";
import moment from 'moment';
import 'moment/locale/zh-cn';

import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import TableSearch from '@/common/components/table_search/TableSearch';

import workEndService from '@/shifts_center/services/work_end/work_end.service';

import set_first_start_time_icon from '@/shifts_center/assets/images/set_first_start_time_icon.png';

const { RangePicker } = DatePicker;
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class WorkEnd extends Component {

    state = {
        // 记录列表数据
        dataSource: [],
        // 当前页码
        pageNo: 1,
        // 每页显示的条数
        pageSize: 20,
        // 总共的数据条数
        total: 0,
        // 首次开班时间
        firstStartTime: '',
        // 设置首次开班时间弹窗是否可见
        setFirstStartTimeModal: false,
        // 进度条弹窗是否可见
        progressModal: false,
        // 进度条进度
        percent: 0
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '班结管理',
            routes: [
                {title: '班结管理', path: '/main/work_end'}
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb');
    }

    componentDidMount() {
        this.findShiftRecordListFun({});
        this.getShiftStartDateFun();
    }

    // 查询班结记录列表
    findShiftRecordListFun = ({pageNo=1, pageSize=20, startDate='', endDate='', payEntry=''}) => {
        workEndService.findShiftRecordList({
            pageNo: pageNo,
            pageSize: pageSize,
            startDate: startDate,
            endDate: endDate,
            payEntry: payEntry
        })
            .then((res) => {
                if(res.shiftRecordList) {
                    let shiftRecordList = res.shiftRecordList.items;
                    if(shiftRecordList) {
                        shiftRecordList.unshift({
                            startDate: '-',
                            endDate: '-',
                            realPay: res.shiftRecordSum.realPay,
                            discountAmount: res.shiftRecordSum.discountAmount,
                            rechargeAmount: res.shiftRecordSum.rechargeAmount,
                            giftAmount: res.shiftRecordSum.giftAmount,
                            giftScore: res.shiftRecordSum.giftScore,
                            consumeScore: res.shiftRecordSum.consumeScore
                        });
                    }
                    this.setState({
                        dataSource: shiftRecordList,
                        total: res.shiftRecordList.total
                    })
                } else {
                    this.setState({
                        dataSource: res.shiftRecordList
                    })
                }
            })
            .catch((err) => {

            })
    };

    // 获取表单中的值
    getFieldValueFun = () => {
        let time = this.props.form.getFieldValue('time');
        let startDate = '';
        let endDate = '';
        if(time) {
            startDate = moment(time[0]).format('x');
            endDate = moment(time[1]).format('x');
        }
        return {
            payEntry: this.props.form.getFieldValue('payEntry'),
            startDate: startDate,
            endDate: endDate
        };
    };

    // 页码改变后的回调函数
    onChange = (page) => {
        this.setState({
            pageNo: page
        });
        let fieldValueData = this.getFieldValueFun();
        this.findShiftRecordListFun({
            pageNo: page,
            startDate: fieldValueData.startDate,
            endDate: fieldValueData.endDate,
            payEntry: fieldValueData.payEntry
        });
    };

    // 表单查询函数
    search = () => {
        this.setState({
            pageNo: 1
        });
        let fieldValueData = this.getFieldValueFun();
        this.findShiftRecordListFun({
            startDate: fieldValueData.startDate,
            endDate: fieldValueData.endDate,
            payEntry: fieldValueData.payEntry
        })
    };

    // 表单重置函数
    reset = () => {
        // 清空查询条件
        this.props.form.resetFields();
        this.findShiftRecordListFun({});
    };

    // 单条班结记录下载
    exportShiftRecordFun = shiftRecordId => {
        workEndService.exportShiftRecord(shiftRecordId)
    };

    // 汇总班结记录下载
    exportShiftCollectFun = () => {
        let fieldValueData = this.getFieldValueFun();
        workEndService.exportShiftCollect({
            startDate: fieldValueData.startDate,
            endDate: fieldValueData.endDate,
            payEntry: fieldValueData.payEntry || ''
        })
    };

    // 获取首次开班时间
    getShiftStartDateFun = () => {
        workEndService.getShiftStartDate()
            .then((res) => {
                if(res) {
                    this.setState({
                        firstStartTime: res
                    })
                }
            })
            .catch((err) => {

            })
    };

    // 班结
    saveShiftFun = (flag) => {
        this.props.form.resetFields('firstTime');
        this.setState({
            percent: 0
        });
        const {firstStartTime, percent} = this.state;
        let _this = this;
        if(firstStartTime) {
            confirm({
                title: '确认班结吗？',
                content: '确认后将生成上次班结时间到现在的班结记录',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.setState({
                        progressModal: true
                    });
                    let intervalId = setInterval(() => {
                        if(percent >= 95) {
                            clearInterval(intervalId)
                        }
                        _this.setState((prevState) => {
                            return {
                                percent: prevState.percent + 5
                            }
                        })
                    }, 100);
                    workEndService.saveShift(firstStartTime)
                        .then((res) => {
                            clearInterval(intervalId);
                            _this.setState({
                                percent: 100,
                                progressModal: false
                            });
                            message.success('班结记录生成成功');
                            _this.findShiftRecordListFun({});
                            _this.getShiftStartDateFun();
                        })
                        .catch((err) => {

                        })
                },
                onCancel() {

                },
            });
        } else {
            this.showModal()
        }
    };

    // 弹出首次开班时间弹窗
    showModal = () => {
        this.setState({
            setFirstStartTimeModal: true
        })
    };

    // 设置首次开班时间弹窗确定事件
    handleOk = (e) => {
        let firstStartTime = this.props.form.getFieldValue('firstTime');
        let _this = this;
        if(firstStartTime) {
            this.setState({
                firstStartTime
            }, () => {
                _this.saveShiftFun()
            });
            this.setState({
                setFirstStartTimeModal: false
            })
        } else {
            message.warning('请选择首次班结时间');
        }
    };

    // 设置首次开班时间弹窗确定事件
    handleCancel = (e) => {
        this.setState({
            setFirstStartTimeModal: false
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        const {
            dataSource,
            total,
            pageNo,
            pageSize,
            setFirstStartTimeModal,
            progressModal,
            percent
        } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
                md: {span: 8},
                lg: {span: 8},
                xl: {span: 6},
                xxl: {span: 4}
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
                md: {span: 8},
                lg: {span: 8},
                xl: {span: 6},
                xxl: {span: 4}
            },
        };

        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => {
                    return index === 0 ? '合计' : index
                }
            },
            {
                title: '开班时间',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (text, record, index) => {
                    if(index === 0) {
                        return '-'
                    } else {
                        return text ? moment(text).format('YYYY.MM.DD HH:mm:ss') : '-'
                    }
                }
            },
            {
                title: '班结时间',
                dataIndex: 'endDate',
                key: 'endDate',
                render: (text, record, index) => {
                    if(index === 0) {
                        return '-'
                    } else {
                        return text ? moment(text).format('YYYY.MM.DD HH:mm:ss') : '-'
                    }
                }
            },
            {
                title: '消费汇总(￥)',
                children: [
                    {
                        title: '实收总额',
                        dataIndex: 'realPay',
                        key: 'realPay',
                        render: (text) => {
                            if(text != null) {
                                return Number(text).toFixed(2)
                            } else {
                                return '0.00'
                            }
                        }
                    },
                    {
                        title: '优惠总额',
                        dataIndex: 'discountAmount',
                        key: 'discountAmount',
                        render: (text) => {
                            if(text != null) {
                                return Number(text).toFixed(2)
                            } else {
                                return '0.00'
                            }
                        }
                    }
                ]
            },
            {
                title: '充值汇总(￥)',
                children: [
                    {
                        title: '充值总额',
                        dataIndex: 'rechargeAmount',
                        key: 'rechargeAmount',
                        render: (text) => {
                            if(text != null) {
                                return Number(text).toFixed(2)
                            } else {
                                return '0.00'
                            }
                        }
                    },
                    {
                        title: '赠送总额',
                        dataIndex: 'giftAmount',
                        key: 'giftAmount',
                        render: (text) => {
                            if(text != null) {
                                return Number(text).toFixed(2)
                            } else {
                                return '0.00'
                            }
                        }
                    }
                ]
            },
            {
                title: '积分汇总(分)',
                children: [
                    {
                        title: '赠送积分',
                        dataIndex: 'giftScore',
                        key: 'giftScore'
                    },
                    {
                        title: '消耗积分',
                        dataIndex: 'consumeScore',
                        key: 'consumeScore'
                    }
                ]
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record, index) => {
                    return (
                        <span>
                            {
                                index === 0 ? (
                                    <a href="javascript:;" onClick={this.exportShiftCollectFun}>汇总下载</a>
                                ) : (
                                    <a href="javascript:;"
                                       onClick={() => {this.exportShiftRecordFun(record.shiftRecordId)}}
                                    >下载</a>
                                )
                            }
                        </span>
                    )
                }
            }
        ];

        const titleLayout = {
            xs: {span: 12},
            sm: {span: 6},
            md: {span: 4},
            lg: {span: 3},
            xl: {span: 2},
            xxl: {span: 2}
        };

        return (
            <div>
                <Panel title="班结操作">
                    <Button className="button" type="primary" onClick={this.saveShiftFun}>班结</Button>
                    <Modal
                        title="请设置"
                        visible={setFirstStartTimeModal}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        bodyStyle={{textAlign: 'center'}}
                        okText="确认"
                        cancelText="取消"
                        destroyOnClose={true}
                    >
                        <img className="set-first-start-time-icon" src={set_first_start_time_icon} alt="" />
                        <WhiteSpace size="v-lg" />
                        <div>首次班结时间</div>
                        <WhiteSpace size="v-lg" />
                        <Form>
                            <FormItem>
                                {getFieldDecorator('firstTime')(
                                    <DatePicker
                                        showTime
                                        locale={locale}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="请选择时间"
                                    />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                    <Modal
                        visible={progressModal}
                        bodyStyle={{textAlign: 'center'}}
                        footer={null}
                        closable={false}
                        destroyOnClose={true}
                    >
                        <Progress type="circle" percent={percent} />
                    </Modal>
                </Panel>
                <WhiteSpace size="v-lg" />
                <Panel title="班结记录">
                    <Row>
                        <Col {...titleLayout}>时间维度：</Col>
                        <Col {...titleLayout}>按班结</Col>
                    </Row>
                    <WhiteSpace size="v-lg" />
                    <Form>
                        <TableSearch search={this.search} reset={this.reset} colNum={2}>
                            <FormItem {...formItemLayout} label="交班时间：">
                                {getFieldDecorator('time')(
                                    <RangePicker showTime allowClear={false} format="YYYY-MM-DD HH:mm:ss" locale={locale} />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="支付方式：">
                                {getFieldDecorator('payEntry')(
                                    <Select placeholder="请选择">
                                        <Option value={null}>全部</Option>
                                        <Option value={0}>微信支付</Option>
                                        {/*<Option value={1}>支付宝</Option>*/}
                                        <Option value={6}>会员卡</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </TableSearch>
                    </Form>
                    <WhiteSpace size="v-lg" />
                    <div className="scroll-table">
                        <Table locale={{emptyText: '暂无数据'}}
                               dataSource={dataSource}
                               rowKey= {record => record.shiftRecordId}
                               columns={columns}
                               scroll={{ x: 1000 }}
                               pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChange}}
                        >
                        </Table>
                    </div>
                </Panel>
            </div>
        )
    }
}

export default connect(
    state => ({LoginUserInfo: state.LoginUserInfo}), 
    {receiveData}
)(Form.create()(WorkEnd));