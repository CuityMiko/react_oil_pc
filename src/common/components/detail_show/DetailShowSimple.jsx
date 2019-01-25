/** Detail.jsx表示单独详情组件，不带头部标题，头部按钮，尾部标题；
 *  DetailShow.jsx表示复合详情组件，可以根据需要包含头部标题，头部按钮，尾部标题；
 *
 * 单独详情展示组件参数说明：暴露属性direction（方向：横向-level、纵向-vertical）、data数据源（必须以map的key-value形式传data）；
 * 详情垂直居左显示还是垂直居中显示showPosition：showLeft、showCenter、colNum（水平排列时一行几列，可选值3,4）；
 *
 * 单独详情组件只写了详情部分，如需要头部标题及右上角按钮或者底部按钮，可将panel组件包裹在DetailShowSimple组件外面使用（或者使用DetailShowComplex.jsx组件），
 * 分组展示详情可以多个panel形式使用（或者多个DetailShow.jsx组件）；
 * 当前详情组件支持文本、jpg/png图片、地图（ps：如需使用地图需要map数据对应，可参考默认data）
 *
 * 使用方法：ps：map对象的value目前仅考虑数字和字符串，图片或经纬度需为字符串
 * <DetailShowSimple data ={data} direction="vertical" showPosition="showCenter">
  </DetailShowSimple>
 * */

import React, {Component} from 'react';
import ReactQMap from 'react-qmap';
import {Row, Col} from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import './detail_show.less';

class DetailShowSimple extends Component {
    // 数据类型
    static propTypes = {
        direction:PropTypes.oneOf(['level','vertical']),
        showPosition:PropTypes.oneOf(['showLeft','showCenter']),
        colNum:PropTypes.oneOf([3,4]),
        data:PropTypes.object   //数据源map类型
        // 如 data:new Map([['会员名称','付晓晓'],['头像','http://**/mC0JBmEN.jpg'], ['地址3','33.27,116.57 ']])
        // 默认地址对应的value中前一个为latitude(维度)，后一个为longitude(经度)值,即经纬度拼成一个字符串对应key的一个value
    };

    //默认参数
    static defaultProps = {
        // 默认纵向排列、
        direction : 'vertical',
        // 居中显示
        showPosition : 'showCenter',
        // 默认一行显示4列
        colNum:4,
        // 数据源，map形式
        data: new Map([
            ['会员名称','付晓晓付晓晓'],
            ['头像','http://techuangjiangx-files.oss-cn-hangzhou.aliyuncs.com/1543804958960/20181203/mC0JBmEN.jpg'],
            ['会员卡号','888912368968'],
            ['手机号','18790987688'],
            ['性别','男'],
            ['生日','2018-09-12'],
            ['注册时间','2018-09-12 20:08:12'],
            ['最近更新','2018-09-12 20:08:12'],
            ['地址','30.53786+104.07265'],
            ['地址2','30.20+120.20'],
            ['地址3','33.27+116.57 ']
            // 默认地址对应的value中前一个为latitude(维度)，后一个为longitude(经度)值
        ])
    };

    // 将行数、列数转换为数组形式，方便map方法使用，循环显示行-列
    convertArr = (num) => {
        var _arr = [];
        for(let i = 0; i < num; i++) {
            _arr.push(i);
        }
        return _arr;
    };

    // 定义一个函数，用于判断是直接渲染value还是渲染img或者radio
    renderValueTo = (currentValue) => {
        if(currentValue && currentValue.length &&
            currentValue.slice(currentValue.lastIndexOf('.')+1,currentValue.length) == 'jpg'
            || currentValue && currentValue.length &&
            currentValue.slice(currentValue.lastIndexOf('.')+1,currentValue.length) == 'png'
            || currentValue && currentValue.length &&
            currentValue.slice(currentValue.lastIndexOf('.')+1,currentValue.length) == 'jpeg'){
            return (
                <Col className="value-line"> <img className="show-img" src={currentValue} alt=""/></Col>
            )
        }else if(currentValue && currentValue.length && currentValue.lastIndexOf('+')>-1){
            const latitude = currentValue.slice(0,currentValue.indexOf('+'));
            const longitude = currentValue.slice(currentValue.indexOf('+')+1,currentValue.length);
            return (
                <Col className="value-line">
                    <ReactQMap className="add-map"
                               center={{latitude:latitude, longitude:longitude}} mySpot={{latitude:latitude, longitude:longitude}}
                               initialOptions={{zoomControl: true, mapTypeControl: true}}
                               apiKey="xxxxxx-xxxxx-xxxxx-xxxxxx"
                               style={{height: 300}}
                    />
                </Col>
            )
        }else{
            return (
                <Col className="value-line">{currentValue}</Col>
            )
        }
    };

    // 详情水平展示，direction为Level
    renderLevel = () => {
        // 手机端还是电脑端
        const {responsive} = this.props;
        const detailContentContainer = classnames('panel-container','details-content-container',
            {'mobile-detail-style':responsive.data.isMobile});
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
                  <div className={detailContentContainer}>
                    <Row gutter={{ xs: 8, md: 24, lg: 32 }} key={rindex} type="flex" align="middle"
                         className="row-spacing row-detail-l">
                        {
                            colArr.map((citem, cindex) => {
                                    if ((colNum * ritem + citem) < count) {
                                        return (
                                            <Col md={colWidthCompute} xs={24} lg={colWidthCompute} type="flex" align="start"
                                                 key={cindex}>
                                                <Col className="key-line">{keysL[mapIndexs]} :</Col>
                                                { this.renderValueTo(valuesL[mapIndexs++]) }
                                            </Col>
                                        )
                                    }
                                }
                            )
                        }
                    </Row>
                  </div>
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

    // 详情垂直展示，direction为vertical,垂直排列即一行一列形式，再根据showPosition居左还是居右进行判断，样式调整
    renderVertical() {
        // 手机端还是电脑端
        const {responsive} = this.props;
        const detailContentContainer = classnames('panel-container','details-content-container',
            {'mobile-detail-style':responsive.data.isMobile});
        const { showPosition, data } = this.props;
        const colNum = 1;
        const colWidthCompute = parseInt(24 / colNum);
        let typeAlign ;
        if (showPosition == 'showLeft') {
            typeAlign = 'start';
        } else if (showPosition == 'showCenter') {
            typeAlign = 'center';
        }
        const rowDetailLeft = classnames( {'row-detail-v-left':showPosition=='showLeft'});
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
                  <div className={detailContentContainer}>
                    <Row gutter={{ xs: 8, md: 24, lg: 32 }} key={rindex} type="flex" align="middle" justify={typeAlign}
                         className="row-spacing row-detail-v">
                        {
                            colArr.map((citem, cindex) => {
                                    if ((colNum * ritem + citem) < count) {
                                        return (
                                            <Col md={colWidthCompute} xs={24} lg={colWidthCompute} type="flex" align="middle"
                                                 justify={typeAlign} key={cindex} className={rowDetailLeft}>
                                                <Col className="key-line key-line-left">{keys[mapIndex]} :</Col>
                                                { this.renderValueTo(values[mapIndex++]) }
                                            </Col>
                                        )
                                    }
                                }
                            )
                        }
                    </Row>
                  </div>
                )
            })
        } else {
            return (
              <div className="panel-container">
                <Row gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" align="middle" className="row-spacing">
                    <Col md={colWidthCompute} xs={24} lg={colWidthCompute} className="no-data-detail">
                        暂无数据
                    </Col>
                </Row>
              </div>
            )
        }
    }

    // 根据是否分组字段、横向排列字段、纵向排列字段等判断显示render哪个函数，
    // 将不同渲染结果分别写在各自的render函数中，如renderVertical()、renderLevel()等
    render(){
        const { direction } = this.props;
        return direction==='vertical' ? this.renderVertical() : this.renderLevel();
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
)(DetailShowSimple);