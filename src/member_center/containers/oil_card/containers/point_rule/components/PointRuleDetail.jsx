/**
 * 积分规则详情
 */
import React from 'react';
import {message, Row, Col, Button, Modal} from 'antd';
import PropTypes from 'prop-types';

import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import PointRuleService from '@/member_center/services/oil_card/point_rule/point_rule.service';

const confirm = Modal.confirm;

class PointRuleDetail extends React.Component {
    static propTypes = {
        data: PropTypes.object,
        reload: PropTypes.func,
        modify: PropTypes.func,
        cardid: PropTypes.string
    }

    state = {
        title: '积分规则-编辑'
    }

    /**
     * 详情页按钮组
     */
    detailBtns = (data) => {
        return (
            <div>
                <Button onClick={() => this.delete(data.id)}>删 除</Button>
                <Button type="primary" onClick={() => this.modify(data)}>编 辑</Button>
            </div>
        )
    }

    /**
     * 删除
     */
    delete = (id) => {
        const _self = this;
        const {cardid} = this.props;
        confirm({
            title: '确认要删除该积分规则？',
            cancelText: '取消',
            okText: '确定',
            onOk() {
                PointRuleService.DeletePointRule(parseInt(cardid), id).then((res)=>{
                    message.success('删除成功', 2).then(() => {
                        // 重新加载列表
                        _self.props.reload();
                    });
                });
            }
        });
    }

    /**
     * 编辑
     */
    modify = (data) => {
        this.props.modify(data);
    }

    render() {
        const {data} = this.props;
        return (
            <Panel title={data.name} innerType="inner" bordered={true} headerBtnHtml={this.detailBtns(data)}>
                <Row>
                    <Col lg={2} md={8} xs={24}>
                        <span>油品：</span>
                    </Col>
                    <Col lg={8} md={8} xs={24}>
                        <span>{data.skus}</span>
                    </Col>
                </Row>
                <WhiteSpace />
                <Row>
                    <Col lg={8} md={8} xs={24}>
                        <span>每消费{data.amount}元赠送{data.score}积分</span>
                    </Col>
                </Row>
            </Panel>
        )
    }
}

export default PointRuleDetail;