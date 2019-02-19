import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import TableSearch from '@/common/components/table_search/TableSearch';
import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import GoodesCard from "../components/goods_card/GoodsCard";
import WrappedInventoryEditForm from "../components/inventory_edit_form/InventroyEditForm";
import NoData from '@/common/components/no_data/NoData';
import {receiveData} from '@/base/redux/actions';

import {Row, Col, Form, Input, Select, Button, Pagination, Modal, List, Card, message} from 'antd'

import pointMallService from '@/member_center/services/point_mall/point_mall.service'

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        md: {span: 6},
    },
    wrapperCol: {
        md: {span: 16},
    }
};

class PointList extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    state = {
        title: '积分商城列表',
        current: 1,
        total: 500,
        pageSize: 24,
        cardData: {
            status: 0
        },
        visible: false,
        checkedCardData: [],    //选中的卡片数据
        dataSource: []
    };


    componentDidMount() {
        const {current, pageSize} = this.state;
        this.fetch({
            pageNO: current,
            pageSize: pageSize,
        });
    }

    // 新增活动
    newActivity = () => {
        this.props.history.push('/main/member_center/point_mall/add_point_activity')
    }

    // 表单查询函数
    search = () => {
        console.log('search');
        const {pageSize, current} = this.state;
        this.fetch({
            pageNO: 1, // 重置表单
            pageSize: pageSize,
        });
    };

    // 表单重置函数
    reset = () => {
        // 清空查询条件
        const {current, pageSize} = this.state;
        this.props.form.resetFields();
        this.fetch({
            pageNO: current,
            pageSize: pageSize,
        });
    };

    //分页
    onChange = (page, pageSize) => {
        console.log(page, 'page', pageSize);
        this.setState({
            current: page,
        });
        this.fetch({
            pageNO: page,
            pageSize: pageSize,
        });
    };

    //分页查询列表
    fetch = (params = {}) => {
        this.props.form.validateFields((err, values) => {
            console.log(values, 'values');
            // 设置参数
            let postData = {};
            postData.goodsName = values.goodsName;
            //如果没有选择状态则传-1
            if (values.status || values.status == 0) {
                postData.status = values.status;
            } else {
                postData.status = -1
            }

            //查询积分商城活动列表
            pointMallService.queryScoreExchangeList(Object.assign({...params}, {...postData})).then(res => {
                console.log(res, '查询积分商城活动列表');
                // const pagination = {...this.state.pagination};
                // pagination.total = res.total;
                let total = res.total;
                this.setState({
                    dataSource: res.items,
                    total: total
                }).catch(
                    (err) => {
                        console.log('err');
                    }
                )
            })
        })
    };

    //卡片操作
    onOption = (cardData) => {
        const {id} = cardData;
        const {current, pageSize} = this.state;
        //非进行中
        const _self = this;
        if (cardData.status !== 1) {
            //删除
            Modal.confirm({
                title: '确定要删除此活动',
                content: '删除后不再显示此活动',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    pointMallService.scoreExchangeDel(id).then((res) => {
                        _self.fetch({
                            pageNO: current,
                            pageSize: pageSize,
                        });
                        message.success('删除此活动成功');
                        console.log('删除此活动成功');
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            });
        } else {
            //提前结束
            Modal.confirm({
                title: '确定要提前结束此活动',
                content: '',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    pointMallService.scoreExchangeEarlyEnd(id).then((res) => {
                        message.success('提前结束活动成功');
                        _self.fetch({
                            pageNO: current,
                            pageSize: pageSize,
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            });
        }
    };

    onEdit = (cardData) => {
        console.log(cardData, 'cardData');
        this.setState({
            visible: true,
            checkedCardData: cardData
        });
    };

    //跳转详情页
    onShowDetail = (id) => {
        const {history} = this.props;
        history.push('/main/member_center/point_mall/detail_point_activity/' + id)
    }

    //获取表单数据
    getFormData = (form) => {
        this.form = form;
    };

    //模态框操作
    handleSubmit = () => {
        const {checkedCardData, current, pageSize} = this.state;
        const _self = this;
        this.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if(!err){
                let postData = {};
                postData.inventory = Number(values.inventory);
                postData.type = values.type;
                postData.id = checkedCardData.id;
                postData.skuId = checkedCardData.skuId;
                pointMallService.scoreExchangeModifyInventory(
                    Object.assign({}, {...postData})
                ).then(res => {
                    _self.setState({
                        visible: false,
                        checkedCardData: []
                    });
                    message.success('修改库存成功');
                    _self.fetch({
                        pageNO: current,
                        pageSize: pageSize,
                    });
                }).catch(err => {
                    console.log(err);
                })
            }
        })
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        const {
            total,
            pageSize,
            current,
            checkedCardData,
            dataSource
        } = this.state;
        const {getFieldDecorator} = this.props.form;

        //card
        const cardsElements = [];
        const cardLayout = {
            xs: {span: 24},
            sm: {span: 12},
            md: {span: 8},
            lg: {span: 8},
            xl: {span: 6},
            xxl: {span: 4}
        };
        if (dataSource) {
            console.log(dataSource, 'dataSource');
            for (let item of dataSource) {
                cardsElements.push(
                    <Col {...cardLayout} key={item.id}>
                        <GoodesCard
                            id={item.id}
                            skuId={item.skuId}
                            name={item.name}
                            imageUrls={item.imageUrls ? item.imageUrls[0] : null}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            score={item.score}
                            alreadyCount={item.alreadyCount}
                            count={item.count}
                            status={item.status}
                            onOption={this.onOption}
                            onShowDetail={this.onShowDetail}
                            onEdit={this.onEdit}
                        />
                    </Col>
                )
            }
        }

        return (
            <div>
                <Panel>
                    <Form>
                        <TableSearch search={this.search} reset={this.reset} colNum={4}>
                            <FormItem label="商品名称">
                                {getFieldDecorator('goodsName')(
                                    <Input placeholder="请输入商品名称" />
                                )}
                            </FormItem>
                            <FormItem label="活动状态">
                                {getFieldDecorator('status')(
                                    <Select placeholder="请选择">
                                        <Option value={0}>未开始</Option>
                                        <Option value={1}>进行中</Option>
                                        <Option value={2}>已结束</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </TableSearch>
                        <Button type="primary" onClick={this.newActivity}>新增活动</Button>
                    </Form>
                    {
                        dataSource ? (
                            <div/>
                        ) : (
                            <NoData/>
                        )
                    }
                </Panel>
                {
                    dataSource ? (
                        <div>
                            <WhiteSpace size="v-lg" />
                            <Row gutter={16}>
                                {cardsElements}
                            </Row>
                            <WhiteSpace size="v-lg" />
                            <Row type="flex" justify="end">
                                <Col>
                                    <Pagination current={current} onChange={this.onChange} total={total}
                                                pageSize={pageSize} />
                                </Col>
                            </Row>
                        </div>
                    ) : (
                      <div/>
                    )
                }

                <Modal
                    title="修改活动库存"
                    visible={this.state.visible}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <WrappedInventoryEditForm name={checkedCardData.name} count={checkedCardData.count} ref={this.getFormData} />
                </Modal>
            </div>
        )
    }
}

export default connect(state => ({}), {})(Form.create()(PointList));