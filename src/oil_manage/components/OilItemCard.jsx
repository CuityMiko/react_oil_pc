import React, {Component} from 'react'
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from 'react-redux';
import { Row, Col } from "antd";

import WhiteSpace from '@/common/components/white_space/WhiteSpace';

import "./oilitem_card.less";

class OilItemCard extends Component {

    // 定义数据类型
    static propTypes = {
        colNum: PropTypes.oneOf([3,4,6]),
        // 根据需要传参数，加油卡布局下面参数需全传
        leftText: PropTypes.string,
        rightText: PropTypes.string,
        leftClick:PropTypes.func,
        rightClick:PropTypes.func,
        data:PropTypes.object
    };

    // 定义默认值
    static defaultProps = {
        colNum: 6,
        //新增属性
        leftText:" ",
        rightText:" ",
        valIcon:" ",
        valTitle:" ",
        valAmount:" ",
        data:{
            name:'',
            typeText:'',
            text:'',
            amount:'',
            leftText:" ",
            rightText:" ",
        }
    };

    state = {
        title: '油品管理-组件'
    };

    // 下-左文本-事件处理
    leftClick = ()=>{
        this.props.leftClick();
    };
    // 下-右文本事件处理
    rightClick = ()=>{
        this.props.rightClick();
    };
    render() {
        // 手机端还是电脑端
        const {responsive,colNum,leftText,rightText,data} = this.props;
        const oilCardContainer = classNames('data-card-complex-row',
            {'oil-card-container-mobile':responsive.data.isMobile}
        );
        const colWidthCompute = parseInt( 24 / colNum );
        return (
            <div className="oil-manage-component-container">
                <WhiteSpace size="v-xl" />
                <div className={oilCardContainer}>
                    <div className="oils-container" md={colWidthCompute} lg={colWidthCompute} xs={24} >
                        <WhiteSpace size="v-xl" />
                        <Row className="oils-top">
                            <Col className="oil-name">
                                <p className="oil-name-text">
                                    {data.name && data.name.length>4?data.name.slice(0,4):data.name}
                                </p>
                            </Col>
                            <Col className="oil-type">
                                <p className="oil-type-icon">{data.typeText}</p>
                                <span className="oil-type-text">{data.text}</span>
                            </Col>
                            <Col className="oil-price">
                                <span>￥</span>
                                <span>{data.amount}</span>
                                <span>/L</span>
                            </Col>
                        </Row>
                        <WhiteSpace size="v-lg" />
                        <Row className="oil-layout-bottom">
                            <Col>
                                <Col className="left-line txt-style" md={12} lg={12} xs={12} type="flex" align="middle" justify="center" onClick={this.leftClick}>{data.leftText}</Col>
                                <Col className="right-line txt-style" md={12} lg={12} xs={12} type="flex" align="middle" justify="center" onClick={this.rightClick}>{data.rightText}</Col>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => {
        const {responsive} = state.AppData;
        return {
            responsive
        }
    }
)(OilItemCard);