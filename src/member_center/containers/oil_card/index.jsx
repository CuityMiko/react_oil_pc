import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Row, Col, message, Modal } from 'antd';

import { receiveData } from '@/base/redux/actions';
import OilLayout from './components/OilLayout';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import OilCardService from '@/member_center/services/oil_card/oil_card.service';

const confirm = Modal.confirm;

class OilCard extends Component {
    state = {
        title: '加油卡',
        cards: []
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '加油卡',
            routes: [
                {title: '会员中心'},
                {title: '加油卡', path: '/main/member_center/oil_card'}
            ],
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        OilCardService.ListCard().then((res)=>{
            this.setState({cards: res});
        });
    }

    /**
     * 获取图片
     */
    getImage = (id) => {
        if (id) {
            return require(`../../assets/images/card-${id}-icon.png`);
        }
    }

    /**
     * 获取油卡类型
     */
    getType = (id) => {
        switch (id) {
            case 1:
                return '汽油';
            case 2:
                return '柴油';
            default:
                return '';
        }
    }

    /**
     * 切换开关
     */
    switchOnChange = (val, id, callback) => {
        const enable = val ? 1 : 0;
        const _content = val ? '将开启领取该油卡的入口，新会员可领取' : '将关闭领取该油卡的入口，不影响已领取的会员使用';
        const _operate = val ? '开启' : '关闭';
        const _title = `确认要${_operate}${this.getType(id)}卡？`;
        confirm({
            title: _title,
            cancelText: '取消',
            okText: '确定',
            content: _content,
            onOk() {
                OilCardService.SwitchCard({
                    enable,
                    id
                }).then((res)=>{
                    callback(val);
                    message.success('设置成功');
                }).catch(err => {
                    callback(!val);
                    // Modal.warning({
                    //     title: '无法关闭该油卡',
                    //     content: err, // '会员中心必须有一张以上油卡处于开启状态'
                    //     okText: '确定'
                    // });
                });
            },
            onCancel() {
                callback(!val);
            }
        });
    }

    /**
     * 点击规则
     */
    ruleClick = (e, id, flag) => {
        switch (flag) {
            case 'recharge': // 充值规则
                this.props.history.push(`/main/member_center/oil_card/store_rule/${id}`);
                break;
            case 'point': // 积分规则
                this.props.history.push(`/main/member_center/oil_card/point_rule/${id}`);
                break;
            default:
                break;
        }
    }

    render() {
        const {cards} = this.state;
        return (
            <div className="oil-card-container-container">
                <div className="layout-oli-content">
                    <WhiteSpace size="v-2xl" />
                    <WingBlank size="l-3xl">
                        <Row className="qi-chai-layout">
                            {
                                cards.map((card, index) => {
                                    return (
                                        <Col className="qi-layout-content" key={index}>
                                            <OilLayout valIcon={this.getImage(card.id)} defaultChecked={card.enable > 0} valTitle={card.name} valAmount={`适用于${card.skus}${this.getType(card.id)}`} onChange={(val, callback) => this.switchOnChange(val, card.id, callback)} leftClick={(e) => this.ruleClick(e, card.id, 'recharge')} leftText="充值规则" rightClick={(e) => this.ruleClick(e, card.id, 'point')} rightText="积分规则" />
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </WingBlank>
                    <WhiteSpace size="v-2xl" />
                </div>
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(OilCard);