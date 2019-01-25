import React, {Component} from 'react';
import {Form, DatePicker, Select, Row, Col, Table, Tabs, Radio} from 'antd';
import moment from 'moment';

import DataCard from '@/common/components/data_card/DataCard';
import TableSearch from '@/common/components/table_search/TableSearch';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import NoData from '@/common/components/no_data/NoData';

import availMoney from '@/member_center/assets/images/avail-money.png';
import totalMoney from '@/member_center/assets/images/total-money.png';

import MemberListService from '@/member_center/services/member_list/member_list.service';

const FormItem = Form.Item;
const { RangePicker} = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class AccountInfoContainer extends Component {
    // 状态
    state = {
        keyActive: '1',
        icons: {
            availMoney: availMoney,
            totalMoney: totalMoney
        },
        // 当前页码
        pageNo: 1,
        // 每页显示的条数
        pageSize: 20,
        // 总共的数据条数
        total: 0,
        dataCardQi: [],
        dataCardChai: [],
        dataSource: []
    };

    componentDidMount() {
        const _self = this;
        setTimeout(function () {
            const {gasCardId,dieselCardId, memberId} = _self.props;
            const {pageNo,pageSize} = _self.state;
            // 开通汽油卡的情况-包括只开通汽油卡和汽油-柴油卡都开通
            if(gasCardId){
                // 汽油储值账户
                _self.countData(gasCardId);
                // 汽油卡储值列表接口
                const conditionQi = {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    memberId: memberId,
                    cardId: gasCardId,
                    beginTime: '',
                    endTime: '',
                    tradeType: ''
                };
                _self.listData(conditionQi);
            }
            // 只有柴油卡的情况
            if(!gasCardId && dieselCardId){
                // 柴油储值账户-统计
                _self.countData(dieselCardId);
                // 柴油卡储值列表接口
                const conditionChai = {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    memberId: memberId,
                    cardId: dieselCardId,
                    beginTime: '',
                    endTime: '',
                    tradeType: ''
                };
                _self.listData(conditionChai);
            }
        }, 800)
    }

    // 储值账户-统计-接口-汽油
    countData = (id) => {
        const {icons} = this.state;
        MemberListService.storedCount(id, icons).then((res) => {
            this.setState({
                dataCardQi: res.dataTotalStoredQi,
                dataCardChai: res.dataTotalStoredChai
            })
        }).catch((res) => {
            this.setState({
                dataCardQi: res.dataTotalStoredQi,
                dataCardChai: res.dataTotalStoredChai
            })
        });
    };

    // 储值列表请求接口
    listData = (condition) => {
        MemberListService.storedList({
            pageNO: condition.pageNo,
            pageSize: condition.pageSize,
            memberId: condition.memberId,
            cardId: condition.cardId,
            beginTime: condition.beginTime,
            endTime: condition.endTime,
            tradeType: condition.tradeType
        }).then((res) => {
            this.setState({
                dataSource: res.items,
                total:res.total
            })
        }).catch(
            (err) => {
                console.log('err');
            }
        );
    };

    // 表单查询函数
    searchQi = () => {
        const _self = this;
        _self.setState({
            pageNo:1
        })
        const {gasCardId, memberId} = _self.props;
        const {pageNo,pageSize} = _self.state;
        const getParams = _self.props.form;
        const timeQi = getParams.getFieldValue('timeQi');
        // 状态值
        const statusQi = getParams.getFieldValue('statusQi');
        // 汽油卡储值列表接口
        const conditionQi = {
            // pageNo: pageNo,
            pageNo: 1,
            pageSize: pageSize,
            memberId: memberId,
            cardId: gasCardId,
            beginTime: timeQi && timeQi[0] ? new Date((moment(Number(timeQi[0])).format('YYYY.MM.DD')) +' 00:00:00').getTime() : '',
            endTime: timeQi && timeQi[1] ? new Date((moment(Number(timeQi[1])).format('YYYY.MM.DD')) +' 23:59:59').getTime() : '',
            tradeType: statusQi?statusQi:''
        };
        _self.listData(conditionQi);
    };

    // 表单重置函数
    resetQi = () => {
        // 清空查询条件
        this.props.form.resetFields();
        const _self = this;
        _self.setState({
            pageNo:1
        })
        const {gasCardId, memberId} = _self.props;
        const {pageNo,pageSize} = _self.state;
        // 汽油卡储值列表接口
        const conditionQi = {
            // pageNo: pageNo,
            pageNo: 1,
            pageSize: pageSize,
            memberId: memberId,
            cardId: gasCardId,
            beginTime: '',
            endTime: '',
            tradeType: ''
        };
        _self.listData(conditionQi);
    };

    // 表单查询函数
    searchChai = () => {
        const _self = this;
        _self.setState({
            pageNo:1
        })
        const {dieselCardId, memberId} = _self.props;
        const {pageNo,pageSize} = _self.state;
        const getParams = _self.props.form;
        const timeChai = getParams.getFieldValue('timeChai');
        // 状态值
        const statusChai = getParams.getFieldValue('statusChai');
        // 柴油卡储值列表接口
        const conditionChai = {
            // pageNo: pageNo,
            pageNo: 1,
            pageSize: pageSize,
            memberId: memberId,
            cardId: dieselCardId,
            // new Date((moment(Number(values.time[0])).format('YYYY.MM.DD')) +' 00:00:00').getTime()
            beginTime: timeChai && timeChai[0] ? new Date((moment(Number(timeChai[0])).format('YYYY.MM.DD')) +' 00:00:00').getTime() : '',
            endTime: timeChai && timeChai[1] ? new Date((moment(Number(timeChai[1])).format('YYYY.MM.DD')) +' 23:59:59').getTime() : '',
            tradeType: statusChai?statusChai:''
        };
        _self.listData(conditionChai);
    };

    // 表单重置函数
    resetChai = () => {
        // 清空查询条件
        this.props.form.resetFields();
        const _self = this;
        _self.setState({
            pageNo:1
        })
        const {dieselCardId, memberId} = _self.props;
        const {pageNo,pageSize} = _self.state;
        // 柴油卡储值列表接口
        const conditionChai = {
            // pageNo: pageNo,
            pageNo: 1,
            pageSize: pageSize,
            memberId: memberId,
            cardId: dieselCardId,
            beginTime: '',
            endTime: '',
            tradeType: ''
        };
        _self.listData(conditionChai);
    };
    // 按钮控制tab
    handleModeChange = (e) => {
        const _self = this;
        _self.setState({
            pageNo:1
        })
        const {gasCardId, dieselCardId, memberId} = _self.props;
        const {pageNo,pageSize} = _self.state;
        const getParams = _self.props.form;
        const timeQi = getParams.getFieldValue('timeQi');
        // 状态值
        const statusQi = getParams.getFieldValue('statusQi');
        const timeChai = getParams.getFieldValue('timeChai');
        // 状态值
        const statusChai = getParams.getFieldValue('statusChai');
        // 按钮控制tab的激活状态，tab栏隐藏
        if (e.target.value == 1) {
            this.setState({
                keyActive: '1'
            });
            // 汽油储值账户-统计
            _self.countData(gasCardId);
            // 汽油卡储值列表接口
            const conditionQi = {
                pageNo: pageNo,
                pageSize: pageSize,
                memberId: memberId,
                cardId: gasCardId,
                beginTime: timeQi && timeQi[0] ? new Date((moment(Number(timeQi[0])).format('YYYY.MM.DD')) +' 00:00:00').getTime() : '',
                endTime: timeQi && timeQi[1] ? new Date((moment(Number(timeQi[1])).format('YYYY.MM.DD')) +' 23:59:59').getTime() : '',
                tradeType: statusQi?statusQi:''
            };
            _self.listData(conditionQi);

        } else if (e.target.value == 2) {
            this.setState({
                keyActive: '2'
            });
            // 柴油储值账户-统计
            _self.countData(dieselCardId);
            // 柴油卡储值列表接口
            const conditionChai = {
                pageNo: pageNo,
                pageSize: pageSize,
                memberId: memberId,
                cardId: dieselCardId,
                beginTime: timeChai && timeChai[0] ? new Date((moment(Number(timeChai[0])).format('YYYY.MM.DD')) +' 00:00:00').getTime() : '',
                endTime: timeChai && timeChai[1] ? new Date((moment(Number(timeChai[1])).format('YYYY.MM.DD')) +' 23:59:59').getTime() : '',
                tradeType: statusChai?statusChai:''
            };
            _self.listData(conditionChai);
        }
    };

    // 页码改变后的回调函数
    onChangePageQi = (page) => {
        const {pageSize} = this.state;
        const {gasCardId,memberId} = this.props;
        const getParams = this.props.form;
        const timeQi = getParams.getFieldValue('timeQi');
        // 状态值
        const statusQi = getParams.getFieldValue('statusQi');
        this.setState({
            pageNo: page
        });
        const conditionQi = {
            pageNo: page,
            pageSize: pageSize,
            memberId: memberId,
            cardId: gasCardId,
            beginTime: timeQi && timeQi[0] ? new Date((moment(Number(timeQi[0])).format('YYYY.MM.DD')) +' 00:00:00').getTime() : '',
            endTime: timeQi && timeQi[1] ? new Date((moment(Number(timeQi[1])).format('YYYY.MM.DD')) +' 23:59:59').getTime() : '',
            tradeType: statusQi?statusQi:''
        };
        this.listData(conditionQi);
    }

    onChangePageChai = (page) => {
        const {pageSize} = this.state;
        const {dieselCardId,memberId} = this.props;
        const getParams = this.props.form;
        const timeChai = getParams.getFieldValue('timeChai');
        // 状态值
        const statusChai = getParams.getFieldValue('statusChai');
        this.setState({
            pageNo: page
        });
        const conditionChai = {
            pageNo: page,
            pageSize: pageSize,
            memberId: memberId,
            cardId: dieselCardId,
            beginTime: timeChai && timeChai[0] ? new Date((moment(Number(timeChai[0])).format('YYYY.MM.DD')) +' 00:00:00').getTime() : '',
            endTime: timeChai && timeChai[1] ? new Date((moment(Number(timeChai[1])).format('YYYY.MM.DD')) +' 23:59:59').getTime() : '',
            tradeType: statusChai?statusChai:''
        };
        this.listData(conditionChai);
    }

    // 定义一个函数，用于判断柴油-汽油储值账户
    renderValueQiChai = () => {
        const {getFieldDecorator} = this.props.form;
        const {keyActive, dataCardQi, dataCardChai, dataSource,total, pageSize, pageNo} = this.state;
        const formItemLayout = {
            labelCol: {
                md: {span: 6},
            },
            wrapperCol: {
                md: {span: 16},
            }
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: '交易单号',
                dataIndex: 'tradeNumber',
                key: 'tradeNumber',
                render: (text, record, index) => {
                    if (text) {
                        return text;
                    } else {
                        return '--';
                    }
                }
            },
            {
                title: '交易时间',
                dataIndex: 'tradeTime',
                key: 'tradeTime',
                render: (text, record, index) => {
                    if (text) {
                        return moment(Number(text)).format('YYYY.MM.DD HH:mm:ss')
                    } else {
                        return '--'
                    }
                }
            },
            {
                title: '交易类型',
                dataIndex: 'typeText',
                key: 'typeText',
                render: (text, record, index) => {
                    if (text) {
                        return text;
                    } else {
                        return '--';
                    }
                }
            },
            {
                title: '交易金额',
                dataIndex: 'amount',
                key: 'amount',
                render: (text, record, index) => {
                    if (text) {
                        return '￥' + text;
                    } else {
                        return '0';
                    }
                }
            },
            {
                title: '赠送金额',
                dataIndex: 'giftAmount',
                key: 'giftAmount',
                render: (text, record, index) => {
                    if (text) {
                        return '￥' + text;
                    } else {
                        return '0';
                    }
                }
            }
        ];
          return (
              <WingBlank size="l-3xl">
                  <WhiteSpace size="v-xl"/>
                  <Radio.Group onChange={this.handleModeChange} value={keyActive} style={{marginBottom: 8}}>
                      <Radio.Button value="1">汽油卡</Radio.Button>
                      <Radio.Button value="2">柴油卡</Radio.Button>
                  </Radio.Group>
                  <Tabs activeKey={keyActive}>
                      <TabPane tab="Tab 1" key="1">
                          <DataCard data={dataCardQi} colNum={3}></DataCard>
                          <WhiteSpace size="v-lg" />
                          <Form>
                              <TableSearch search={this.searchQi} reset={this.resetQi} colNum={3}>
                                  <Form.Item {...formItemLayout} label="时间">
                                      {getFieldDecorator('timeQi')(
                                          <RangePicker allowClear={false} placeholder={[
                                              '开始时间', '结束时间'
                                          ]} onChange={this.onChange}/>
                                      )}
                                  </Form.Item>
                                  <FormItem {...formItemLayout} label="交易类型">
                                      {getFieldDecorator('statusQi')(
                                          <Select placeholder="请选择" onChange={this.handleChange}>
                                              <Option value="1">充值</Option>
                                              <Option value="2">消费</Option>
                                              <Option value="3">消费退款退回</Option>
                                              <Option value="4">充值赠送</Option>
                                              <Option value="7">导入</Option>
                                          </Select>
                                      )}
                                  </FormItem>
                              </TableSearch>
                          </Form>
                          <Row className="mobile-table">
                              <Col>
                                  <Table scroll={{ x:800}} dataSource={dataSource} locale={{emptyText: '暂无数据'}}
                                         pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChangePageQi}} columns={columns}/>
                              </Col>
                          </Row>
                          <WhiteSpace size="v-xl"/>
                      </TabPane>
                      <TabPane tab="Tab 2" key="2">
                          <DataCard data={dataCardChai} colNum={3}></DataCard>
                          <WhiteSpace size="v-lg"/>
                          <Form>
                              <TableSearch search={this.searchChai} reset={this.resetChai} colNum={3}>
                                  <Form.Item {...formItemLayout} label="时间">
                                      {getFieldDecorator('timeChai')(
                                          <RangePicker allowClear={false} placeholder={[
                                              '开始时间', '结束时间'
                                          ]} onChange={this.onChange}/>
                                      )}
                                  </Form.Item>
                                  <FormItem {...formItemLayout} label="交易类型">
                                      {getFieldDecorator('statusChai')(
                                          <Select placeholder="请选择" onChange={this.handleChange}>
                                              <Option value="1">充值</Option>
                                              <Option value="2">消费</Option>
                                              <Option value="3">消费退款退回</Option>
                                              <Option value="4">充值赠送</Option>
                                              <Option value="7">导入</Option>
                                          </Select>
                                      )}
                                  </FormItem>
                              </TableSearch>
                          </Form>
                          <Row>
                              <Col>
                                  <Table scroll={{ x:800}} dataSource={dataSource} locale={{emptyText: '暂无数据'}}
                                         pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChangePageChai}}
                                         columns={columns}/>
                              </Col>
                          </Row>
                          <WhiteSpace size="v-xl"/>
                      </TabPane>
                  </Tabs>
              </WingBlank>
          )
    };

    // 定义一个函数，用于判断汽油储值账户
    renderValueQi = () => {
        const {getFieldDecorator} = this.props.form;
        const { dataCardQi, dataSource,total, pageSize, pageNo} = this.state;
        const formItemLayout = {
            labelCol: {
                md: {span: 6},
            },
            wrapperCol: {
                md: {span: 16},
            }
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: '交易单号',
                dataIndex: 'tradeNumber',
                key: 'tradeNumber',
                render: (text, record, index) => {
                    if (text) {
                        return text;
                    } else {
                        return '--';
                    }
                }
            },
            {
                title: '交易时间',
                dataIndex: 'tradeTime',
                key: 'tradeTime',
                render: (text, record, index) => {
                    if (text) {
                        return moment(Number(text)).format('YYYY.MM.DD HH:mm:ss')
                    } else {
                        return '--'
                    }
                }
            },
            {
                title: '交易类型',
                dataIndex: 'typeText',
                key: 'typeText',
                render: (text, record, index) => {
                    if (text) {
                        return text;
                    } else {
                        return '--';
                    }
                }
            },
            {
                title: '交易金额',
                dataIndex: 'amount',
                key: 'amount',
                render: (text, record, index) => {
                    if (text) {
                        return '￥' + text;
                    } else {
                        return '0';
                    }
                }
            },
            {
                title: '赠送金额',
                dataIndex: 'giftAmount',
                key: 'giftAmount',
                render: (text, record, index) => {
                    if (text) {
                        return '￥' + text;
                    } else {
                        return '0';
                    }
                }
            }
        ];
        return (
            <WingBlank size="l-3xl">
                <WhiteSpace size="v-xl"/>
                <DataCard data={dataCardQi} colNum={3}></DataCard>
                <WhiteSpace size="v-lg"/>
                <Form>
                    <TableSearch search={this.searchQi} reset={this.resetQi} colNum={3}>
                        <Form.Item {...formItemLayout} label="时间">
                            {getFieldDecorator('timeQi')(
                                <RangePicker allowClear={false} placeholder={[
                                    '开始时间', '结束时间'
                                ]} onChange={this.onChange}/>
                            )}
                        </Form.Item>
                        <FormItem {...formItemLayout} label="交易类型">
                            {getFieldDecorator('statusQi')(
                                <Select placeholder="请选择" onChange={this.handleChange}>
                                    <Option value="1">充值</Option>
                                    <Option value="2">消费</Option>
                                    <Option value="3">消费退款退回</Option>
                                    <Option value="4">充值赠送</Option>
                                    <Option value="7">导入</Option>
                                </Select>
                            )}
                        </FormItem>
                    </TableSearch>
                </Form>
                <Row>
                    <Col>
                        <Table scroll={{ x:800}} dataSource={dataSource} locale={{emptyText: '暂无数据'}}
                               pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChangePageQi}}
                               columns={columns}/>
                    </Col>
                </Row>
                <WhiteSpace size="v-xl"/>
            </WingBlank>
        )
    };

    // 定义一个函数，用于判断柴油储值账户
    renderValueChai = () => {
        const {getFieldDecorator} = this.props.form;
        const { dataCardChai, dataSource,total, pageSize, pageNo} = this.state;
        const formItemLayout = {
            labelCol: {
                md: {span: 6},
            },
            wrapperCol: {
                md: {span: 16},
            }
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: '交易单号',
                dataIndex: 'tradeNumber',
                key: 'tradeNumber',
                render: (text, record, index) => {
                    if (text) {
                        return text;
                    } else {
                        return '--';
                    }
                }
            },
            {
                title: '交易时间',
                dataIndex: 'tradeTime',
                key: 'tradeTime',
                render: (text, record, index) => {
                    if (text) {
                        return moment(Number(text)).format('YYYY.MM.DD HH:mm:ss')
                    } else {
                        return '--'
                    }
                }
            },
            {
                title: '交易类型',
                dataIndex: 'typeText',
                key: 'typeText',
                render: (text, record, index) => {
                    if (text) {
                        return text;
                    } else {
                        return '--';
                    }
                }
            },
            {
                title: '交易金额',
                dataIndex: 'amount',
                key: 'amount',
                render: (text, record, index) => {
                    if (text) {
                        return '￥' + text;
                    } else {
                        return '0';
                    }
                }
            },
            {
                title: '赠送金额',
                dataIndex: 'giftAmount',
                key: 'giftAmount',
                render: (text, record, index) => {
                    if (text) {
                        return '￥' + text;
                    } else {
                        return '0';
                    }
                }
            }
        ];
        return (
            <WingBlank size="l-3xl">
                <WhiteSpace size="v-xl"/>
                <DataCard data={dataCardChai} colNum={3}></DataCard>
                <WhiteSpace size="v-lg"/>
                <Form>
                    <TableSearch search={this.searchChai} reset={this.resetChai} colNum={3}>
                        <Form.Item {...formItemLayout} label="时间">
                            {getFieldDecorator('timeChai')(
                                <RangePicker allowClear={false} placeholder={[
                                    '开始时间', '结束时间'
                                ]} onChange={this.onChange}/>
                            )}
                        </Form.Item>
                        <FormItem {...formItemLayout} label="交易类型">
                            {getFieldDecorator('statusChai')(
                                <Select placeholder="请选择" onChange={this.handleChange}>
                                    <Option value="1">充值</Option>
                                    <Option value="2">消费</Option>
                                    <Option value="3">消费退款退回</Option>
                                    <Option value="4">充值赠送</Option>
                                    <Option value="7">导入</Option>
                                </Select>
                            )}
                        </FormItem>
                    </TableSearch>
                </Form>
                <Row>
                    <Col>
                        <Table scroll={{ x:800}} dataSource={dataSource} locale={{emptyText: '暂无数据'}}
                               pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChangePageChai}}
                               columns={columns}/>
                    </Col>
                </Row>
                <WhiteSpace size="v-xl"/>
            </WingBlank>
        )
    };

    renderNoValue = () => {
        return (
            <NoData />
        )
    }

    render() {
        const {gasCardId, dieselCardId} = this.props;
        return (
            <div className="account-info-container">
                { (gasCardId && dieselCardId) ? this.renderValueQiChai() : (gasCardId && !dieselCardId)?
                    this.renderValueQi():(!gasCardId && dieselCardId)?this.renderValueChai():this.renderNoValue()}
            </div>
        )
    }
}

export default Form.create()(AccountInfoContainer)