
/** DetailShowSimple.jsx表示单独详情组件，不带头部标题，头部按钮，尾部标题；详情部分可水平多列排布也可垂直一列排布，一列排布时支持居左和居中排布
 *  DetailShowComplex.jsx表示复合详情组件，可以根据需要包含头部标题，头部按钮，尾部标题；详情部分可水平多列排布也可垂直一列排布，一列排布时支持居左和居中排布
*
 * 复合详情展示组件参数说明：暴露属性direction（方向：横向-level、纵向-vertical）、data数据源（必须以map的key-value形式传data）、
 * headerHave（是否有头部，布尔值，默认false）、footerHave（是否有尾部，布尔值，默认false）、
 * titleName（头部标题名称，字符串，默认为空）、btnTitle（是否有头部按钮，默认false）；
* 详情垂直居左显示还是垂直居中显示showPosition：showLeft、showCenter、colNum（水平排列时一行几列，可选值3,4）
 *
 * 复合详情组件包含详情部分-头部标题-头部右上角按钮-底部按钮，根据需要传参，分组展示详情可以多个复合详情组件形式使用；
 * 当前详情组件支持文本、jpg/png图片、地图（ps：如需使用地图需要map数据对应，可参考默认data）
 *
 * 使用方法：ps：map对象的value目前仅考虑数字和字符串，图片或经纬度需为字符串
 * （1）有标题，标题包含按钮，有尾部
 * <DetailShowComplex headerHave={true} footerHave={true} titleName="标题11" btnTitle={true}
 * data ={data} direction="vertical" showPosition="showCenter">
 *   <div>头部按钮</div>    <div>尾部按钮</div>
 </DetailShowComplex>
 （2）有标题，标题不包含按钮，有尾部
 <DetailShowComplex headerHave={true} footerHave={true} titleName="标题12" data ={data} direction="vertical" showPosition="showLeft">
    <div>尾部按钮</div>
 </DetailShowComplex>
 （3）无标题，有尾部
 <DetailShowComplex headerHave={false} footerHave={true} data ={data} direction="vertical" showPosition="showLeft">
    <div>尾部按钮</div>
 </DetailShowComplex>
 （4）有标题，无尾部
 <DetailShowComplex headerHave={true} footerHave={false} titleName="标题13" btnTitle={true} data ={data} direction="vertical" showPosition="showLeft">
    <div>头部按钮</div>
 </DetailShowComplex>
 （5）无标题，无尾部，也可直接使用DetailShowSimple.jsx组件
 <DetailShowComplex headerHave={false} footerHave={false} data ={data} direction="vertical" showPosition="showLeft">
 </DetailShowComplex>
 或者：
 <DetailShowComplex data ={data} direction="vertical" showPosition="showLeft">
 </DetailShowComplex>
 * */

import React, {Component} from 'react';
import {Row, Col} from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import WhiteSpace from '../../components/white_space/WhiteSpace';
import AppMap from '@/common/components/app_map/AppMap';

import './detail_show.less';

class DetailShowComplex extends Component {
    // 数据类型
    static propTypes = {
        // 类似panel
        headerHave:PropTypes.bool,
        footerHave:PropTypes.bool,
        titleName:PropTypes.string,
        btnTitle:PropTypes.bool,
        //会员卡详情的卡券特殊处理
        labelClick: PropTypes.func,
        direction:PropTypes.oneOf(['level','vertical']),
        showPosition:PropTypes.oneOf(['showLeft','showCenter']),
        colNum:PropTypes.oneOf([3,4]),
        data:PropTypes.object.isRequired,   //数据源map类型
        // 如 data:new Map([['会员名称','付晓晓'],['头像','http://**/mC0JBmEN.jpg'], ['地址3','33.27,116.57 ']])
        // 默认地址对应的value中前一个为latitude(维度)，后一个为longitude(经度)值,即经纬度拼成一个字符串对应key的一个value
        customClass: PropTypes.string
    };

    //默认参数
    static defaultProps = {
        // 类似panel
        headerHave:false,
        footerHave:false,
        titleName:'',
        btnTitle:false,

        // 默认纵向排列、
        direction : 'vertical',
        // 居中显示
        showPosition : 'showCenter',
        // 默认一行显示4列
        colNum:4,
        // 数据源，map形式
       /* data: new Map([
            ['会员名称','付晓晓付晓晓'],
            ['头像','http://techuangjiangx-files.oss-cn-hangzhou.aliyuncs.com/1543804958960/20181203/mC0JBmEN.jpg'],
            ['地址3','33.27+116.57 ']
        // 默认地址对应的value中前一个为latitude(维度)，后一个为longitude(经度)值
        ])*/
    };

    // 将行数、列数转换为数组形式，方便map方法使用，循环显示行-列
    convertArr = (num) => {
        var _arr = [];
        for(let i = 0; i < num; i++) {
            _arr.push(i);
        }
        return _arr;
    };

    labelClick = ()=> {
        this.props.labelClick();
    };

    // 定义一个函数，用于判断是直接渲染value还是渲染img还是渲染地图
    renderValueTo = (currentKey,currentValue) => {
        if(currentValue && currentValue.length &&
            currentValue.slice(currentValue.lastIndexOf('.')+1,currentValue.length) == 'jpg'
            || currentValue && currentValue.length &&
            currentValue.slice(currentValue.lastIndexOf('.')+1,currentValue.length) == 'png'
            || currentValue && currentValue.length &&
            currentValue.slice(currentValue.lastIndexOf('.')+1,currentValue.length) == 'jpeg'){
            return (
                <Col className="value-line"> <img className="show-img" src={currentValue} alt="" /></Col>
            )
        }else if(currentValue && currentValue.length && currentValue.lastIndexOf('+')>-1){
            const latitude = currentValue.slice(0,currentValue.indexOf('+'));
            const longitude = currentValue.slice(currentValue.indexOf('+')+1,currentValue.length);
            return (
                <Col className="value-line">
                   <AppMap lnglat={[longitude, latitude]} maptype="read" />
                </Col>
            )
        }else if(currentKey=='领取赠送'){
                if(currentValue && currentValue.indexOf('积分,')>-1 && currentValue.split('积分,').length==2){
                    return (
                        <Col className="value-line value-line-gift-coupon">
                            <span>{currentValue.slice(0,currentValue.indexOf('积分,')+1)}</span>
                            <span onClick={this.labelClick}>{currentValue.slice(currentValue.indexOf('积分')+1)}</span>
                        </Col>
                    )
                }else if(currentValue && currentValue.indexOf('积分')>-1 && currentValue.split('积分,').length==1){
                    return (
                        <Col className="value-line value-line-gift-coupon">{currentValue}</Col>
                    )
                }else{
                    return (
                        <Col className="value-line value-line-gift-coupon" onClick={this.labelClick}>{currentValue}</Col>
                    )
                }
        }else{
             return (
                <Col className="value-line">{currentValue}</Col>
            )
        }
    };

    // 详情水平展示，一行多列，direction为Level
    renderLevel = () => {
        const { colNum, data } = this.props;
        const colWidthCompute = parseInt(24 / colNum);
        let count = data.size;
        let keysL = [];
        let valuesL = [];
        let mapIndexs = 0;
        if (count > 0) {
            // 计算查询条件显示的行数
            let rowNum = count % colNum == 0 ? count / colNum : Math.ceil( count / colNum);
            let rowArr = this.convertArr(rowNum);
            let colArr = this.convertArr(colNum);
            data.forEach(function (currentValue, index, data) {
                keysL.push(index);
                valuesL.push(currentValue);
            });
            return rowArr.map((ritem, rindex) => {
                return (
                    <Row gutter={{ xs: 8, md: 24, lg: 32 }} key={rindex} type="flex" align="middle"
                         className="row-spacing row-detail-l">
                        {
                            colArr.map((citem, cindex) => {
                                    if ((colNum * ritem + citem) < count) {
                                        return (
                                            <Col md={colWidthCompute} xs={24} lg={colWidthCompute} type="flex" align="start"
                                                key={cindex}>
                                                <Col className="key-line">{keysL[mapIndexs]} :</Col>
                                                { this.renderValueTo(keysL[mapIndexs],valuesL[mapIndexs++]) }
                                            </Col>
                                        )
                                    }
                                }
                            )
                        }
                    </Row>
                )
            })
        } else {
            return (
                <Row gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" align="middle" className="row-spacing">
                    <Col md={colWidthCompute} xs={24} lg={colWidthCompute} className="no-data-detail">
                        暂无数据
                    </Col>
                </Row>
            )
        }
    };

    // 详情垂直展示，一行一列，direction为vertical,垂直排列即一行一列形式，再根据showPosition居左还是居右进行判断，样式调整
    renderVertical() {
        const { showPosition, data } = this.props;
        const colNum = 1;
        const colWidthCompute = parseInt(24 / colNum);
        let typeAlign ;
        let widthVerticalLeft = false;
        if (showPosition == 'showLeft') {
            typeAlign = 'start';
            widthVerticalLeft = true;
        } else if (showPosition == 'showCenter') {
            typeAlign = 'center';
        }
        const rowDetailLeft = classnames(
            {'row-detail-v-left':showPosition=='showLeft'},
            {'width-vertical-left':widthVerticalLeft}
            );
        let count = data.size;
        let keys = [];
        let values = [];
        let mapIndex = 0;
        if (count > 0) {
            // 计算查询条件显示的行数，垂直展示时，map中有多少键值对就有多少行
            let rowNum = count;
            let rowArr = this.convertArr(rowNum);
            let colArr = this.convertArr(colNum);
            data.forEach(function (currentValue, index, data) {
                keys.push(index);
                values.push(currentValue);
            });
            return rowArr.map((ritem, rindex) => {
                return (
                    <Row gutter={{ xs: 8, md: 24, lg: 32 }} key={rindex} type="flex" align="middle" justify={typeAlign}
                         className="row-spacing row-detail-v" >
                        {
                            colArr.map((citem, cindex) => {
                                    if ((colNum * ritem + citem) < count) {
                                        return (
                                            <Col md={colWidthCompute} xs={24} lg={colWidthCompute} type="flex" align="middle"
                                                 justify={typeAlign} key={cindex} className={rowDetailLeft}>
                                                <Col className="key-line key-line-left">{keys[mapIndex]} :</Col>
                                                { this.renderValueTo(keys[mapIndex],values[mapIndex++]) }
                                            </Col>
                                        )
                                    }
                                }
                            )
                        }
                    </Row>
                )
            })
        } else {
            return (
                <Row gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" align="middle" className="row-spacing">
                    <Col md={colWidthCompute} xs={24} lg={colWidthCompute} className="no-data-detail">
                        暂无数据
                    </Col>
                </Row>
            )
        }
    }

    // 根据横向排列字段、纵向排列字段等判断显示render哪个函数，
    // 将不同渲染结果分别写在各自的render函数中，如renderVertical()、renderLevel()等
    render(){
        // 手机端还是电脑端
        const {responsive, customClass} = this.props;
        const detailContentContainer = classnames('gutter-example','panel-container','details-content-container',
            {'mobile-detail-style':responsive.data.isMobile}, customClass);
        const {direction, headerHave,footerHave,btnTitle,titleName,children } = this.props;
        let panelFooter;
        let panelHeader;
        if(headerHave && btnTitle){
            if(children[0]|| children){
                panelHeader = <Row gutter={0} type="flex" align="middle" className="panel-header-style">
                    <Col className="panel-header" md={10} xs={10} lg={8}>
                        {titleName}
                    </Col>
                    <Col className="col-btn-title" md={14} xs={14} lg={16}>
                        {children[0] || children}
                    </Col>
                </Row>
            }
        }else if(headerHave && !btnTitle){
            panelHeader = <Row gutter={0} type="flex" align="middle" className="panel-header-style">
                <Col className="panel-header" md={6} xs={10} lg={6}>
                    {titleName}
                </Col>
            </Row>
        }else if(!headerHave && !btnTitle) {
            panelHeader = <Row gutter={0} type="flex" align="middle" />;
        }

        if(btnTitle && footerHave){
            panelFooter = <Row className="panel-footer" gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" justify="center">
                {children[1]}
            </Row>;
        }else if(!btnTitle && footerHave){
            panelFooter = <Row className="panel-footer" gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" justify="center">
                {children[0] || children}
            </Row>;
        } else if(!btnTitle && !footerHave){
            panelFooter = <Row className="panel-footer" gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" justify="center">
            </Row>;
        }
        return (
            <div className={detailContentContainer}>
                {panelHeader}
                {headerHave ? (
                        <WhiteSpace />
                    ):''
                }
                <Row gutter={0}>
                    <Col className="panel-body" md={24} xs={24} lg={24}>
                        { direction==='vertical' ? this.renderVertical() : this.renderLevel()}
                    </Col>
                </Row>
                {footerHave ? (
                    <WhiteSpace />
                ):''
                }
                {panelFooter}
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
)(DetailShowComplex);