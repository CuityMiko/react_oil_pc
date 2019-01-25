import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, Modal, message, Form, Row, Col} from 'antd';

import { receiveData } from '@/base/redux/actions';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import OilItemCard from './components/OilItemCard';
import OilOperate from './components/OilOperate';
import OilService from './services/oil_manage.service';
import NoData from '@/common/components/no_data/NoData';

const confirm = Modal.confirm;
const {create} = Form;

class OilManage extends Component {
    state = {
        title: '油品管理',
        visible: false,
        oillist: [],
        oildata: null,
        // 品类
        categorys: []
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '油品管理',
            routes: [
                {title: '油品管理', path: '/main/oil_manage'}
            ]
        }
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        // 获取品类
        this.getCategorysFun();
        // 获取油品列表
        this.GetOilListData();
    }

    /**
     * 获取油品列表
     */
    GetOilListData = () => {
        OilService.GetOilList().then(res => {
            if (res != null && res.length > 0) {
                this.setState({oillist: res});
            }
        })
    };

    // 获取品类
    getCategorysFun = () => {
        OilService.GetCategorys()
            .then(res => {
                this.setState({
                    categorys: res
                })
            })
            .catch(err => {
                console.log(err)
            })
    };

    /**
     * 打开模态框
     */
    showModal = (title) => {
        this.setState({
            visible: true,
            title
        });
    };

    /**
     * 确定
     */
    handleOk = () => {
        const {oildata} = this.state;
        this.refs.oilOperateForm.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    visible: false,
                });
                let _oildata = {
                    price: parseFloat(values.oilprice).toFixed(2),
                    skuName: values.oilname,
                    proId: parseInt(values.oiltype)
                }
                if (oildata != null) { // 编辑
                    _oildata.id = oildata.id
                }
                OilService.OperateSku(_oildata).then(res => {
                    message.success('保存成功', 1);
                    // 关闭模态框
                    this.setState({visible: false});
                    // 获取油品列表
                    this.GetOilListData();
                })
            }
        });
    };

    /**
     * 取消
     */
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    /**
     * 关闭模态框后操作
     */
    afterClose = () => {
        this.setState({oildata: null})
    }

    /**
     * 新增油品
     */
    addOilSku = (e) => {
        this.showModal('新增油品');
    }

    /**
     * 编辑油品
     */
    updateOilSku = (sku) => {
        let _oildata = {
            oiltype: sku.proId,
            oilname: sku.skuName,
            oilprice: sku.price,
            id: sku.id
        }
        this.setState({
            oildata: _oildata
        })
        this.showModal('编辑油品');
    }

    /**
     * 删除油品
     */
    deleteOilSku = (sku) => {
        let _self = this;
        confirm({
            title: '确认要删除该油品？',
            cancelText: '取消',
            okText: '确定',
            onOk() {
                OilService.DelOilSku(sku.id).then((res)=>{
                    message.success('删除成功', 2).then(() => {
                        // 获取油品列表
                        _self.GetOilListData();
                    });
                });
            }
        });
    }
    // 渲染数据
    renderDataList = () => {
        const {oillist} = this.state;
        const cardLayout = {
            xs: {span: 24},
            sm: {span: 12},
            md: {span: 8},
            lg: {span: 8},
            xl: {span: 6},
            xxl: {span: 4}
        };
        if (oillist && oillist.length > 0) {
            return oillist.map(oil => {
                return oil.skus.map((sku, index) => {
                    let data = {
                        name: sku.skuName,
                        typeText: sku.proId == 1 ? '汽' : '柴',
                        text: oil.name,
                        amount: sku.price,
                        leftText:"编辑",
                        rightText:"删除",
                    }
                    return (
                        <Col {...cardLayout} key={index}>
                            <OilItemCard data={data} key={index}
                                         leftClick={() => {this.updateOilSku(sku)}}
                                         rightClick={() => {this.deleteOilSku(sku)}}>
                            </OilItemCard>
                        </Col>

                    )
                })
            })
        }else {
            return <NoData />;
        }

    };
    render() {
        const {visible, title, oildata, categorys} = this.state;
        return (
            <div className="oil-manage-container">
                <div>
                    <WingBlank size="l-3xl">
                        <WhiteSpace size="v-xl" />
                        <Button type="primary" onClick={this.addOilSku}>新增油品</Button>
                        <div className="mobile-container-style">
                            <Row gutter={16}>
                                {this.renderDataList()}
                            </Row>
                        </div>
                        <WhiteSpace size="v-xl" />
                    </WingBlank>
                </div>

                {/*新增、编辑模态框*/}
                <OilOperate ref="oilOperateForm" categorys={categorys} afterClose={this.afterClose} title={title} oildata={oildata} visible={visible} handleOk={this.handleOk} handleCancel={this.handleCancel}></OilOperate>
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(create()(OilManage));