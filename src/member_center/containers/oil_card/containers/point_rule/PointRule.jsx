import React from 'react';
import {message, Tooltip, Icon, Popover, Button, Switch, Row, Col} from 'antd';
import {connect} from 'react-redux';
import ClassNames from 'classnames';
import QueueAnim from 'rc-queue-anim';

import {receiveData} from '@/base/redux/actions';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import OperateForm from './components/OperateForm';
import Utils from '@/base/utils/index';
import PointRuleService from '@/member_center/services/oil_card/point_rule/point_rule.service';
import PointRuleDetail from './components/PointRuleDetail';
import OilService from '@/oil_manage/services/oil_manage.service';
import OilCardService from '@/member_center/services/oil_card/oil_card.service';

class PointRule extends React.Component {
    state = {
        title: '积分规则',
        checked: true,
        loading: false,
        isShowForm: false,
        isEditForm: false, //是否是编辑按钮
        formTitle: '',
        pointrules: [],
        skus: [],
        currentData: null,
        usedSkuids: [],
        addDisabled: false
    }

    componentWillMount() {
        const {receiveData, params} = this.props;
        const title = `${this.getCardName(params.cardid)}卡积分规则`;
        this.setState({title})
        const breadcrumbdata = {
            title,
            routes: [
                {title: '会员中心'},
                {title: '加油卡', path: '/main/member_center/oil_card'},
                {title: title}
            ],
            tip: {
                pc: <Tooltip placement="right" title='通过所属油品消费可累计对应积分，积分可兑换商品或服务'>
                    <Icon type="exclamation-circle" style={{fontSize: '16px', color: '#FFA800', marginLeft: 5}} />
                </Tooltip>,
                mobile: <Popover
                    content="通过所属油品消费可累计对应积分，积分可兑换商品或服务"
                    trigger="click"
                    placement="bottomLeft"
                >
                    <Icon type="exclamation-circle" style={{fontSize: '16px', color: '#FFA800', marginLeft: 5}} />
                </Popover>
            }
        }
        receiveData(breadcrumbdata, 'breadcrumb');
    }

    componentDidMount() {
        // 绑定初始化数据
        this.bindInitData();
    }

    /**
     * 查询卡种配置
     */
    GetCardConfig = () => {
        const {params} = this.props;
        OilCardService.GetCardConfig(params.cardid).then(res => {
            if (res != null) {
                this.setState({
                    checked: res.storedPayScoreSwitch > 0
                })
            }
        })
    }

    /**
     * 获取油品SKU
     */
    GetOilSkus = (usedSkuids) => {
        const _self = this;
        const {params} = this.props;
        OilService.GetOilSkus({cardSpecId: parseInt(params.cardid)}).then(res => {
            if (res != null && res.length > 0) {
                const result = res.map(sku => ({
                    id: sku.id,
                    name: sku.skuName,
                    disabled: usedSkuids.indexOf(sku.id) > -1
                }))
                const disablelen = result.filter(s => s.disabled == true);
                if (disablelen.length == result.length) {
                    _self.setState({addDisabled: true});
                }
                _self.setState({skus: result});
            }
        })
    }

    /**
     * 获取已经使用的sku id
     */
    GetUsedSkuids = (res) => {
        let usedSkuids = [];
        const _self = this;
        res.map(sku => {
            usedSkuids = usedSkuids.concat(sku.skuids)
        })
        usedSkuids = Utils.arrUniq(usedSkuids);
        _self.setState({usedSkuids}, () => {
            // 获取油品SKU
            _self.GetOilSkus(usedSkuids);
        })
    }

    /**
     * 绑定初始化数据
     */
    bindInitData = () => {
        // 获取积分规则列表
        this.GetPointRuleList();
        // 查询卡种配置
        this.GetCardConfig();
    }

    /**
     * 获取积分规则列表
     */
    GetPointRuleList = () => {
        const {params} = this.props;
        const _self = this;
        PointRuleService.GetPointRuleList(params.cardid).then(res => {
            if (res != null) {
                // 获取已经使用的sku
                _self.GetUsedSkuids(res);
                _self.setState({
                    pointrules: res
                }, () => {
                    if (res.length <= 0) {
                        _self.setState({
                            isShowForm: true,
                            formTitle: `规则一`,
                            currentData: null
                        });
                    }
                })
            } else {
                _self.setState({
                    isShowForm: true,
                    formTitle: `规则一`,
                    currentData: null
                });
            }
        })
    }

    /**
     * 获取卡种名称
     */
    getCardName = (cardid) => {
        switch (cardid) {
            case '1':
                return '汽油';
            case '2':
                return '柴油';
            default:
                break;
        }
    }

    /**
     * 新增积分规则
     */
    addPointRule = (e) => {
        e.preventDefault();
        const {pointrules} = this.state;
        this.refs.operateForm.resetFields();
        this.setState({
            isShowForm: true,
            formTitle: `规则${Utils.matchNumber((pointrules.length + 1))}`,
            currentData: null
        });
    }

    /**
     * 切换积分开关
     */
    onChange = (val) => {
        this.setState({loading: true});
        const {params} = this.props;
        OilCardService.SetCardConfig({
            cardSpecId: params.cardid,
            storedPayScoreSwitch: val ? 1 : 0
        }).then(res => {
            message.success('设置成功', 2)
            this.setState({checked: val, loading: false})
        }).catch(err => {
            this.setState({checked: !val, loading: false})
        })
    };

    /**
     * 表单取消
     */
    cancelOperateForm = () => {
        const _self = this;
        this.setState({
            isShowForm: false,
            isEditForm: false
        })
    }

    /**
     * 重新加载列表数据
     */
    reloadList = () => {
        this.setState({isShowForm: false, isEditForm: false});
        this.bindInitData();
    }

    /**
     * 修改规则
     */
    modifyPointRule = (data) => {
        // this.refs.modifyForm.resetFields();
        console.log(data, 'data');
        this.setState({
            isEditForm: true,
            formTitle: '',
            currentData: data
        });
    }

    render() {
        const {params} = this.props;
        const {loading, checked, isShowForm, isEditForm, pointrules, formTitle, skus, currentData, addDisabled} = this.state;
        const classnames = ClassNames('animated fadeInRight', {
            'operate-hide': !isShowForm,
            'operate-show': isShowForm
        });
        return (
            <div className="point-rule-container">
                <WingBlank size="l-3xl">
                    <WhiteSpace size="v-xl" />
                    <Row type="flex" justify="space-between">
                        <Col md={2}>
                            {
                                addDisabled ? null : (<Button type="primary" onClick={this.addPointRule}>新增规则</Button>)
                            }
                        </Col>
                        <Col md={8} style={{textAlign: 'right', marginTop: 5}}>
                            {this.getCardName(params.cardid)}卡储值余额消费是否积分&nbsp;&nbsp;<Switch checkedChildren="开"
                                                                                            unCheckedChildren="关"
                                                                                            checked={checked}
                                                                                            loading={loading}
                                                                                            onChange={this.onChange} />
                        </Col>
                    </Row>
                    <WhiteSpace size="v-xl" />
                    <div className={classnames}>
                        <OperateForm title={formTitle} currentData={currentData} cardid={params.cardid}
                                     ref="operateForm" skus={skus} cancelOperateForm={this.cancelOperateForm}
                                     reload={this.reloadList} />
                        <WhiteSpace size="v-xl" />
                    </div>
                    <QueueAnim type="left">
                        {
                            pointrules.map((rule, index) => {
                                return (
                                    <div key={index}>
                                        {(isEditForm && rule.id == (currentData? currentData.id : ''))
                                            ?
                                            <OperateForm title={formTitle} currentData={currentData}
                                                         cardid={params.cardid} ref="modifyForm" skus={skus}
                                                         cancelOperateForm={this.cancelOperateForm}
                                                         reload={this.reloadList} />
                                            :
                                            <PointRuleDetail cardid={params.cardid} data={rule} reload={this.reloadList}
                                                             modify={this.modifyPointRule} />
                                        }
                                        <WhiteSpace size="v-xl" />
                                    </div>
                                )
                            })
                        }
                    </QueueAnim>
                    {pointrules.length > 0 ? null : <WhiteSpace size="v-xl" />}
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => ({}),
    {receiveData}
)(PointRule);