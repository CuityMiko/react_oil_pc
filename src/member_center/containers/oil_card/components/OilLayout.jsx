/**
 * 布局组件，以加油卡布局为准
 * - valTitle：数据标题
 * - valIcon：图标
 * - valAmount：数据数量
 * - leftText、rightText布局下发的左右文本string，
 * - leftClick、rightClick左右文本点击事件、onChange开关点击事件
 * colNum:行内数量,默认为3，可选值为3、4、6，带icon推荐3，不带icon都可以
 * showPositionTop:左右对齐的方式，可选值'showSpaceAround','showCenter'，默认showSpaceAround
 * showPosition：可选值showCenter、showSpaceBetween，定义左右icon与文本是水平居中showCenter还是两边分散showSpaceBetween，默认两边分散
 * showTextAlign：右侧上下文本是左对齐还是右对齐alignLeft、alignRight、alignCenter，默认右对齐
 * prefixCls：默认样式 flex space-between
 * 使用方法：<OilLayout valIcon="**" valTitle="***"
 *         valAmount="***" onChange={this.switchOnChangeChai}
 *         leftClick={this.rechargeClickChai} leftText="***"
 *         rightClick={this.PointClickChai}
 *         rightText="***"></OilLayout>
 */
import React, {Component} from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from 'react-redux';
import { Row, Col, Switch, Button } from "antd";

import "./oil_layout.less";

class OilLayout extends Component{
    // 定义数据类型
    static propTypes = {
        // 以加油卡布局为例，下面这些参数可以直接默认
        colNum: PropTypes.oneOf([3,4,6]),
        showPosition:PropTypes.oneOf(['showSpaceBetween','showCenter']),
        showPositionTop:PropTypes.oneOf(['showSpaceAround','showCenter']),
        showTextAlign:PropTypes.oneOf(['alignRight','alignLeft','alignCenter']),
        // 根据需要传参数，加油卡布局下面参数需全传
        leftText: PropTypes.string,
        rightText: PropTypes.string,
        valIcon:PropTypes.string,
        valTitle:PropTypes.string,
        valAmount:PropTypes.string,
        onChange:PropTypes.func,
        leftClick:PropTypes.func,
        rightClick:PropTypes.func,
        defaultChecked: PropTypes.bool
    };

    // 定义默认值
    static defaultProps = {
        // DataCard组件属性
        prefixCls: "wb-datacard",
        imgSize: "imgsize",
        colNum: 3,
        // 在icon存在的情况下定义左右icon与文本是水平居中showCenter还是两边分散showSpaceBetween，默认两边分散
        showPosition:"showSpaceBetween",
        // 右侧上下文本是左对齐还是右对齐alignLeft、alignRight、alignCenter，默认右对齐
        showTextAlign:"alignLeft",
        showPositionTop:"showSpaceAround",

        //新增属性
        leftText:" ",
        rightText:" ",
        valIcon:" ",
        valTitle:" ",
        valAmount:" "
    };

    state = {
        checked: false,
        loading: false
    }

    componentDidMount() {
        const {defaultChecked} = this.props;
        this.setState({checked: defaultChecked});
    }

    // 按钮的事件
    onChange = (val)=>{
        const {checked} = this.state;
        this.setState({loading: true});
        this.props.onChange(!checked, (flag) => {
            if (flag != undefined) {
                this.setState({checked: flag, loading: false})
            }
        });
    };

    // 下-左文本-事件处理
    leftClick = ()=>{
        this.props.leftClick();
    };
    // 下-右文本事件处理
    rightClick = ()=>{
        this.props.rightClick();
    };

    render(){
        // 手机端还是电脑端
        const {responsive} = this.props;
        const {checked, loading} = this.state;
        const oilCardContainer = classNames('data-card-complex-row',
            {'oil-card-container-mobile':responsive.data.isMobile}
        );

        const { prefixCls, imgSize, className, style, showPosition,
            showPositionTop,valIcon,valTitle,valAmount,colNum,
            showTextAlign, leftText, rightText} = this.props;
        const wrapCls = classNames(prefixCls, className,'pos-style',
            {'show-space-between':showPosition=='showSpaceBetween'},
            {'show-center':showPosition=='showCenter'}
            );
        const topLayout = classNames(prefixCls, className,'top-container',
            {'show-space-around':showPositionTop=='showSpaceAround'},
            {'show-center':showPositionTop=='showCenter'}
            );
        const imgSizeCls = classNames(`${prefixCls}-${imgSize}`,
            className, style);
        const colWidthCompute = parseInt( 24 / colNum );
        const alignName = classNames(
            {'align-right':showTextAlign=='alignRight'},
            {'align-left':showTextAlign=='alignLeft'},
            {'align-center':showTextAlign=='alignCenter'},
        );
        return (
            <div className="data-card-complex-container">
              <Row className={oilCardContainer}>
               <Col className="oil-card-container" md={colWidthCompute} lg={colWidthCompute} sm={12} xs={24} >
                   <Row>
                       <Col className={topLayout} style={{display:'flex',alignItems:'flex-start'}}>
                           <Col className={wrapCls} type="flex" style={{display:'flex',alignItems:'flex-start'}}>
                               <img
                                   src={valIcon}
                                   alt=""
                                   className={imgSizeCls}
                                   style={style}
                               />
                               <Col className={alignName}>
                                   <Row className="title-style">
                                       <Col>{valTitle}</Col>
                                   </Row>
                                   <Row className="txt-style">
                                       <Col style={{cursor: 'default'}}>{valAmount}</Col>
                                   </Row>
                               </Col>
                           </Col>
                           <Col className="pos-style">
                               <Switch checkedChildren="开" unCheckedChildren="关" checked={checked} loading={loading} onChange={this.onChange} />
                           </Col>
                       </Col>
                   </Row>
                   <Row className="oil-layout-bottom">
                       <Col>
                           <Col className="left-line txt-style" md={12} lg={12} xs={12} type="flex" align="middle" justify="center" onClick={this.leftClick}>{leftText}</Col>
                           <Col className="txt-style" md={12} lg={12} xs={12} type="flex" align="middle" justify="center" onClick={this.rightClick}>{rightText}</Col>
                       </Col>
                   </Row>
               </Col>
              </Row>
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
)(OilLayout);
