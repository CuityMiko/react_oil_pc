/**
 * 数据卡片组件
 * data：数据
 * -----title：数据标题
 * -----icon：是否有图标
 * -----amount：数据数量
 * colNum:行内数量,默认为4，可选值为3、4、6、8，带icon推荐3/4，不带icon都可以
 * showPosition：可选值showCenter、showSpaceBetween，定义左右icon与文本是水平居中showCenter还是两边分散showSpaceBetween，默认两边分散
 * showTextAlign:右侧上下文本是左对齐还是右对齐alignLeft、alignRight、alignCenter，默认右对齐
 * prefixCls：默认样式 flex space-between
 * data = [{'title':'*','amount':'**','icon':'****'},{'title':'*','amount':'**','icon':'***'}];
 * 使用方法：<DataCard data={data} showPosition="showSpaceBetween" colNum={3}></DataCard>或者
 *  <DataCard data={data1}></DataCard>
 */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {connect} from 'react-redux';
import {Row, Col} from "antd";

import WhiteSpace from '@/common/components/white_space/WhiteSpace';

import "./data_card.less";

class DataCard extends React.Component {
    // 定义数据类型
    static propTypes = {
        data: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isrequired,
                amount: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]),
                icon: PropTypes.string
            })
        ),
        colNum: PropTypes.oneOf([3, 4, 6, 8]),
        showPosition: PropTypes.oneOf(['showSpaceBetween', 'showCenter']),
        showTextAlign: PropTypes.oneOf(['alignRight', 'alignLeft', 'alignCenter']),
    };

    // 定义默认值
    static defaultProps = {
        prefixCls: "wb-datacard",
        imgSize: "imgsize",
        data: [],
        colNum: 4,
        // 在icon存在的情况下定义左右icon与文本是水平居中showCenter还是两边分散showSpaceBetween，默认两边分散
        showPosition: 'showSpaceBetween',
        //  右侧上下文本是左对齐还是右对齐alignLeft、alignRight、alignCenter，默认右对齐
        showTextAlign: 'alignRight'
    };

    render() {
        // 判断终端
        const {responsive} = this.props;
        // console.log(responsive,'卡片data')
        const {data, prefixCls, imgSize, className, style, showPosition, colNum, showTextAlign} = this.props;
        const wrapCls = classNames(prefixCls, className, 'v-spacing','card-data-content',
            {'show-space-between': showPosition == 'showSpaceBetween'},
            {'show-center': showPosition == 'showCenter'}
        );
        const imgSizeCls = classNames(`${prefixCls}-${imgSize}`, className, style);
        const colWidthCompute = parseInt(24 / colNum);
        const alignName = classNames('v-spacing',
            {'align-right': showTextAlign == 'alignRight'},
            {'align-left': showTextAlign == 'alignLeft'},
            {'align-center': showTextAlign == 'alignCenter'},
        );
        return (
            <div className="data-card-container">
                <Row gutter={{xs: 8, md: 24, lg: 32}} className={responsive.data.isMobile ? 'data-card-mobile card-data-content-parent' : 'card-data-content-parent'}>
                    {data.length > 0 &&
                    data.map((val, index) => {
                        return val.icon ? (
                            <Col md={24} lg={colWidthCompute} xs={24} className="card-data-content-p"
                                 key={index}>
                                <Col className={wrapCls} type="flex">
                                    <img
                                        src={val.icon}
                                        alt=""
                                        className={imgSizeCls}
                                        style={style}
                                    />
                                    <Col className={alignName}>
                                        <Row><Col className="desc-text">{val.title}</Col></Row>
                                        <WhiteSpace />
                                        <Row className="amount-style amount-count-style"><Col>{val.amount}</Col></Row>
                                    </Col>
                                </Col>
                            </Col>
                        ) : (
                            <Col className={alignName} md={24} lg={colWidthCompute} sm={16} xs={24}
                                 key={index}>
                                <Row><Col className="desc-text">{val.title}</Col></Row>
                                <WhiteSpace />
                                <Row><Col className="amount-style amount-count-style">{val.amount}</Col></Row>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        );
    }
}

export default connect(
    state => {
        // responsiveData: state.responsiveData
        const {responsive} = state.AppData;
        return {
            responsive
        }
    }
)(DataCard);