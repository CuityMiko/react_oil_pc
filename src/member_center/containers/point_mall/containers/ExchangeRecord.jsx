import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {
    Row, Col, Form, Input, Select, Button, Pagination, Modal, message, DatePicker,
    Table, Divider, Tag
} from 'antd';
import PubSub from 'pubsub-js';
import moment from 'moment';

import TableSearch from '@/common/components/table_search/TableSearch';
import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import {receiveData} from '@/base/redux/actions';
import pointMallService from '@/member_center/services/point_mall/point_mall.service';
import PointMallEvent from '../point_mall.event';

import "./record_and_verification.less"

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const {Column} = Table;


class PointList extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    state = {
        dataSource: [],
        pagination: {},     //分页
        pageSize: 10,       //默认每页数据
        pageNO: 1,          // 初始页
    };

    componentDidMount() {
        const _self = this;
        _self.fetch({
            pageNO: _self.state.pageNO,
            pageSize: _self.state.pageSize
        });
        // 监听核销结果
        PointMallEvent.sub_verificationResult((result) => {
            if (result && result.success) {
                _self.fetch({
                    pageNO: _self.state.pageNO,
                    pageSize: _self.state.pageSize
                });
            }
        })
    }

    // 表单查询函数
    search = () => {
        this.fetch({
            pageNO: this.state.pageNO,
            pageSize: this.state.pageSize
        });
    };

    // 表单重置函数
    reset = () => {
        // 清空查询条件
        this.props.form.resetFields();
        this.fetch({
            pageNO: this.state.pageNO,
            pageSize: this.state.pageSize
        });
    };

    //分页
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            pageNO: pagination.current,
            pageSize: pagination.pageSize,
            ...filters,
        });
    };

    //分页查询列表
    fetch = (params = {}) => {
        this.props.form.validateFields((err, values) => {
            // 设置参数
            let postData = {};
            postData.mobile = values.mobile;
            //如果选择了时间,对时间格式化
            if (values.time) {
                postData.startTime = Number(values.time[0].format("x"));
                postData.endTime = Number(values.time[1].format("x"));
            }
            //查询积分兑换列表
            pointMallService.queryScoreRecordList(Object.assign({...params}, {...postData})).then(res => {
                const pagination = {...this.state.pagination};
                pagination.total = res.total;
                this.setState({
                    dataSource: res.items,
                    pagination
                }).catch(
                    (err) => {
                        console.log('err');
                    }
                )
            })
        })
    };

    render() {
        const {
            dataSource,
            pagination
        } = this.state;
        const {getFieldDecorator} = this.props.form;

        return (
            <div className="exchange-record">
                <Panel>
                    <WhiteSpace size="v-lg" />
                    <Form>
                        <TableSearch search={this.search} reset={this.reset} colNum={3}>
                            <FormItem label="手机号">
                                {getFieldDecorator('mobile', {
                                    rules: [{pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '手机格式不正确'}]
                                })(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </FormItem>
                            <FormItem label="兑换时间">
                                {getFieldDecorator('time', {
                                    // rules: [{required: true, message: '请选择兑换时间'}]
                                })(
                                    <RangePicker allowClear={false}
                                        showTime={{
                                            defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                                        }}
                                        allowClear={false}
                                        format="YYYY-MM-DD HH:mm"
                                    />
                                )}
                            </FormItem>
                        </TableSearch>
                    </Form>
                    <WhiteSpace size="v-lg" />
                    <Table
                        dataSource={dataSource}
                        rowKey='id'
                        onChange={this.handleTableChange}
                        pagination={pagination}
                        locale={{emptyText:'暂无数据'}}
                        scroll={{x: 1000}}
                    >
                        <Column
                            title="兑换时间"
                            dataIndex="exchangeTime"
                            key="exchangeTime"
                            render={(text) => {
                                let time = text ? moment(text).format("YYYY-MM-DD HH:mm") : null
                                return time;
                            }}
                        />
                        <Column
                            title="手机号"
                            dataIndex="mobile"
                            key="mobile"
                        />
                        <Column
                            title="兑换商品"
                            dataIndex="goodsName"
                            key="goodsName"
                            render={(text, record) => {
                                let imageDiv = null;
                                if (record.imageUrl) {
                                    imageDiv = (<img src={record.imageUrl[0]} />)
                                }
                                return (
                                    <div className="goods-name-div">
                                        {imageDiv}
                                        <span>{text}</span>
                                    </div>
                                )
                            }}
                        />
                        <Column
                            title="所需积分"
                            dataIndex="score"
                            key="score"
                        />
                        <Column
                            title="提货码"
                            dataIndex="code"
                            key="code"
                        />
                        <Column
                            title="提货时间"
                            dataIndex="useTime"
                            key="useTime"
                            render={(text) => {
                                let time = text ? moment(text).format("YYYY-MM-DD HH:mm") : null
                                return time;
                            }}
                        />
                        <Column
                            title="提货状态"
                            dataIndex="status"
                            key="status"
                            render={(text) => {
                                let status = text == 1 ? '已提货' : '未提货';
                                let isUse = text == 1 ? 'is-used' : null;
                                const statusClass = classnames('stauts-div', isUse);
                                return (
                                    <div className={statusClass}>
                                        {status}
                                    </div>
                                )
                            }}
                        />
                    </Table>
                </Panel>
            </div>
        )
    }
}

export default connect(state => ({}), {})(Form.create()(PointList));