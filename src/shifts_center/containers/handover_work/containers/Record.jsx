import React, { Component } from 'react';
import {connect} from 'react-redux';

import { DatePicker, Form, Select, Table, Icon, Tooltip } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import Panel from '@/common/components/panel/Panel';
import TableSearch from '@/common/components/table_search/TableSearch';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';

import handoverWorkService from '@/shifts_center/services/handover_work/handover_work.service';
import signinTicket from '@/shifts_center/containers/handover_work/js/signinTicket';

const { RangePicker } = DatePicker;
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

class Record extends Component {
    state = {
        // 交班记录列表数据
        recordData: [],
        // 加油员姓名和id列表
        workUser: [],
        // 当前页码
        pageNo: 1,
        // 每页显示的条数
        pageSize: 20,
        // 总共的数据条数
        total: 0
    };

    componentDidMount() {
        this.findWorkRecordListFun({});
        this.findWorkUserFun();
    }

    // 获取加油员姓名和id
    findWorkUserFun = () => {
        handoverWorkService.findWorkUser()
            .then((res) => {
                this.setState({
                    workUser: res
                })
            })
            .catch((err) => {
                console.log(err)
            })
    };

    // 查询加油员交班记录列表
    findWorkRecordListFun = ({pageNo=1, pageSize=20, startDate='', endDate='', staffId=''}) => {
        handoverWorkService.findWorkRecordList({
            pageNO: pageNo,
            pageSize: pageSize,
            startDate: startDate,
            endDate: endDate,
            staffId: staffId
        })
            .then((res) => {
                this.setState({
                    recordData: res.items,
                    total: res.total
                })
            })
            .catch((err) => {
                console.log(err)
            })
    };

    // 表单查询函数
    search = () => {
        this.setState({
            pageNo: 1
        });
        let fieldValueData = this.getFieldValueFun();
        this.findWorkRecordListFun({
            startDate: fieldValueData.startDate,
            endDate: fieldValueData.endDate,
            staffId: fieldValueData.staffId
        })
    };

    // 表单重置函数
    reset = () => {
        // 清空查询条件
        this.props.form.resetFields();
        this.findWorkRecordListFun({});
    };

    // 下载交班小票
    downloadTicket = (workRecordId) => {
        handoverWorkService.getWorkRecord(workRecordId)
            .then((res) => {
                let downloadTicketsData = {
                    userName: res.userName, // 员工姓名
                    startDate: moment(res.startDate).format('YYYY.MM.DD HH:mm:ss'), // 上班时间
                    endDate: moment(res.endDate).format('YYYY.MM.DD HH:mm:ss'), // 交班时间
                    orderList: res.orderList, // 收银总金额
                    mbrCardSpec: res.mbrCardSpec, // 会员卡消费总额
                    proSkuCount: res.proSkuCount, // 油品消费统计
                    orderAmount: res.orderAmount, // 订单金额合计
                    discountAmount: res.discountAmount, // 优惠金额合计
                    realPayAmount: res.realPayAmount // 实付金额合计
                };
                signinTicket(downloadTicketsData);
            })
            .catch((err) => {
                console.log(err)
            })
    };

    // 页码改变后的回调函数
    onChange = (page) => {
        this.setState({
            pageNo: page
        });
        let fieldValueData = this.getFieldValueFun();
        this.findWorkRecordListFun({
            pageNo: page,
            startDate: fieldValueData.startDate,
            endDate: fieldValueData.endDate,
            staffId: fieldValueData.staffId
        });
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
            staffId: this.props.form.getFieldValue('staffId'),
            startDate: startDate,
            endDate: endDate
        };
    };

    render() {
        const {
            recordData,
            workUser,
            total,
            pageSize,
            pageNo
        } = this.state;

        const {getFieldDecorator} = this.props.form;

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
                title: '姓名',
                dataIndex: 'realname',
                key: 'realname'
            },
            {
                title: '交班时间',
                dataIndex: 'endDate',
                key: 'endDate',
                render: (text) => {
                    return text ? moment(text).format('YYYY.MM.DD HH:mm:ss') : ''
                }
            },
            {
                title: () => {
                    return (
                        <div>订单金额
                            <Tooltip title="微信、支付宝、储值卡三种消费金额之和(含优惠)">
                                <Icon style={{color: '#FFBA18', marginLeft: '4px'}} type="exclamation-circle" />
                            </Tooltip>
                        </div>
                    )
                },
                dataIndex: 'orderAmount',
                key: 'orderAmount',
                render: (text) => {
                    if(text != null) {
                        return '￥' + Number(text).toFixed(2)
                    } else {
                        return '￥0.00'
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => {
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => {this.downloadTicket(record.workRecordId)}}>下载交班小票</a>
                        </span>
                    )
                }
            }
        ];

        return (
            <div className="record-shift-content">
                <Panel title="交班记录">
                    <Form>
                        <TableSearch search={this.search} reset={this.reset} colNum={3}>
                            <FormItem label="交班时间：" >
                                {getFieldDecorator('time')(
                                    <RangePicker showTime allowClear={false} onChange={this.onChange1} format="YYYY-MM-DD HH:mm:ss" locale={locale} />
                                )}
                            </FormItem>
                            <FormItem label="加油员：">
                                {getFieldDecorator('staffId')(
                                    <Select placeholder="请选择">
                                        <Option value={null}>全部</Option>
                                        {
                                            workUser.map((worker, index) => {
                                                return (
                                                    <Option key={index} value={worker.staffId}>{worker.userName}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </TableSearch>
                    </Form>
                    <WhiteSpace size="v-lg" />
                    <Table locale={{emptyText: '暂无数据'}}
                           dataSource={recordData}
                           rowKey= {record => record.workRecordId}
                           columns={columns}
                           scroll={{ x: 800 }}
                           pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChange}}
                    >
                    </Table>
                </Panel>
            </div>
        )
    }
}

export default connect(state => ({}), {})(Form.create()(Record));