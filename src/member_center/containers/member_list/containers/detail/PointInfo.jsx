import React, {Component, Fragment} from 'react';
import { Form, DatePicker, Select, Row, Col, Table } from 'antd';
import moment from 'moment';

import DataCard from '@/common/components/data_card/DataCard';
import TableSearch from '@/common/components/table_search/TableSearch';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';

import availScore from '@/member_center/assets/images/avail-score.png';
import totalScore from '@/member_center/assets/images/total-score.png';

import MemberListService from '@/member_center/services/member_list/member_list.service';

const FormItem = Form.Item;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const  Option  = Select.Option;

class PointInfoContainer extends Component {

    state = {
        icons:{
            availScore:availScore,
            totalScore:totalScore
        },
        // 当前页码
        pageNo: 1,
        // 每页显示的条数
        pageSize: 20,
        // 总共的数据条数
        total: 0,
        dataCardCount:[],
        dataSourceList:[]
    };

    componentDidMount() {
        const _self =this;
        const {memberId} = _self.props;
        const {pageNo,pageSize} = _self.state;
        // 积分账户统计
        _self.countData(memberId);
        // 积分列表接口
        const condition = {
            pageNo: pageNo,
            pageSize: pageSize,
            memberId:memberId,
            startTime:'',
            endTime:'',
            type:''
        };
        // 列表接口
        _self.listData(condition);
    }

    // 储值账户-统计-接口-汽油
    countData = (id)=>{
        const {icons} = this.state;
        MemberListService.scoreCount(id,icons).then((res)=>{
            this.setState({
                dataCardCount: res,
            })
        }).catch((res) => {
            this.setState({
                dataCardCount: res.dataCardCount,
            })
        });
    };

    // 列表请求接口
    listData = (condition)=>{
        MemberListService.scoreList({
            pageNO: condition.pageNo,
            pageSize: condition.pageSize,
            memberId:condition.memberId,
            startTime:condition.startTime,
            endTime:condition.endTime,
            type:condition.type
        }).then((res)=>{
            this.setState({
                dataSourceList: res.items,
                total:res.total
            })
        }).catch(
            (err) => {
                console.log('err');
            }
        );
    };
    // 页码改变后的回调函数
    onChange = (page) => {
        const {pageSize} = this.state;
        const {memberId} = this.props;
        this.setState({
            pageNo: page
        });
        const getParams = this.props.form;
        const time = getParams.getFieldValue('time');
        const status = getParams.getFieldValue('status');
        const condition = {
            pageNo: page,
            pageSize: pageSize,
            memberId:memberId,
            // startTime:time && time.length && time[0] ? moment(time[0]).valueOf() : '',
            // moment 转换时间戳默认是从当前时间的时分秒开始，实际上应该是00:00:00-23:59:59
            startTime:time && time.length && time[0] ? new Date((moment(Number(time[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime() : '',
            endTime:time && time.length && time[1] ? new Date((moment(Number(time[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 23:59:59').getTime() : '',
            type:status
        };
        this.listData(condition);
    };
    // 表单查询函数
    search = ()=>{
        const _self =this;
        _self.setState({
            pageNo:1
        })
        const {memberId} = _self.props;
        const {pageNo,pageSize} = _self.state;
        const getParams = _self.props.form;
        const time = getParams.getFieldValue('time');
        const status = getParams.getFieldValue('status');
        const condition = {
            pageNo: 1,
            pageSize: pageSize,
            memberId:memberId,
            // startTime:time && time.length && time[0] ? moment(time[0]).valueOf() : '',
            // moment 转换时间戳默认是从当前时间的时分秒开始，实际上应该是00:00:00-23:59:59
            startTime:time && time.length && time[0] ? new Date((moment(Number(time[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime() : '',
            endTime:time && time.length && time[1] ? new Date((moment(Number(time[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 23:59:59').getTime() : '',
            type:status
        };
        // 列表接口
        _self.listData(condition);
    };

    // 表单重置函数
    reset = ()=>{
        const _self =this;
        _self.setState({
            pageNo:1
        })
        // 清空查询条件
        this.props.form.resetFields();
        const {memberId} = _self.props;
        const {pageNo,pageSize} = _self.state;
        const condition = {
            pageNo: 1,
            pageSize: pageSize,
            memberId:memberId,
            startTime:'',
            endTime:'',
            type:''
        };
        // 列表接口
        _self.listData(condition);
    };

    render() {
        const {dataSourceList,dataCardCount,total, pageSize, pageNo} = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render:(text, record, index) => {
                    return index + 1
                }
            },
            {
                title: '交易时间',
                dataIndex: 'tradeTime',
                key: 'tradeTime',
                render:(text, record, index) => {
                    if(text){
                        return moment(Number(text)).format('YYYY.MM.DD HH:mm:ss');
                    }else{
                        return '--';
                    }
                }
            },
            {
                title: '交易类型',
                dataIndex: 'typeText',
                key: 'typeText',
                render:(text, record, index) => {
                    if(text){
                        return text;
                    }else{
                        return '--';
                    }
                }
            },
            {
                title: '交易积分',
                dataIndex: 'score',
                key: 'score',
                render:(text, record, index) => {
                    if(text){
                        return text;
                    }else{
                        return '0';
                    }
                }
            },
           {
                title: '交易后积分',
                dataIndex: 'postTradeBalance',
                key: 'postTradeBalance',
                render:(text, record, index) => {
                    if(text){
                        return text;
                    }else{
                        return '0';
                    }
                }
            }
        ];
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                md:{ span:6},
            },
            wrapperCol: {
                md:{ span:16},
            }
        };
        return (
            <div className="point-info-container">
                <WingBlank size="l-3xl">
                    <WhiteSpace size="v-xl" />
                    <DataCard data={dataCardCount} colNum={3}></DataCard>
                    <WhiteSpace size="v-lg" />
                    <Form>
                        <TableSearch search={this.search} reset={this.reset} colNum={3}>
                            <Form.Item {...formItemLayout} label="时间">
                                {getFieldDecorator('time')(
                                    <RangePicker allowClear={false} placeholder={[
                                        '开始时间','结束时间'
                                    ]} format='YYYY.MM.DD' />
                                )}
                            </Form.Item>
                            <FormItem {...formItemLayout} label="交易类型">
                                {getFieldDecorator('status')(
                                    <Select placeholder="请选择" onChange={this.handleChange}>
                                        <Option value="0">积分累计</Option>
                                        <Option value="1">积分兑换</Option>
                                        <Option value="2">充值赠送</Option>
                                        <Option value="3">退款扣除</Option>
                                        <Option value="4">开卡注册</Option>
                                        <Option value="7">会员导入</Option>
                                        <Option value="5">手动修改</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </TableSearch>
                    </Form>
                    <Row className="mobile-table">
                        <Col>
                            <Table scroll={{ x:800}} dataSource={dataSourceList} locale={{emptyText:'暂无数据'}}
                                   pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChange}} columns={columns} />
                        </Col>
                    </Row>
                    <WhiteSpace size="v-xl" />
                </WingBlank>
            </div>
        )
    }

}

export default Form.create()(PointInfoContainer)