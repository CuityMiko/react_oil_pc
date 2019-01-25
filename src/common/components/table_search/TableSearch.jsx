/**
 * 表格查询组件
 * 查询条件组件说明：组件暴露search、reset两个事件、colNum参数，设置每行显示的条件个数，默认为4，可选值为3,4,6,8数值型
 * 查询条件当children传入，只有一个children时，组件直接填充children，当查询条件不止一个children时，组件会根据children
 * 个数判断查询条件显示几行，循环遍历显示children，当children个数大于（colNum-1）时除查询重置按钮之外还会有展开收起按钮（小于（colNum-1）时没有），
 * 默认展示（colNum-1）个条件，点击展开将条件全展示（此时按钮跟条件各占一行），点击收起部分条件隐藏（此时按钮和条件同处一行）
 * 组件调用：推荐 <div><Form><TableSearch search={this.search} reset={this.reset} colNum={4}><Form.Item></Form.Item></TableSearch></Form></div>，
 * ps：<Form.Item></Form.Item>为一个children，可传多个children，其中'文案说明'和'输入框'作为整体一个children传入
*/

import React, {Component} from 'react';
import {Row, Col, Button, Icon} from 'antd';
import PropTypes from 'prop-types';

import './table_search.less';

class TableSearch extends Component {
    // 数据类型
    static propTypes = {
        search: PropTypes.func,
        reset:PropTypes.func,
        colNum:PropTypes.oneOf([2,3,4,6,8])
    };

    // 默认参数
    static defaultProps = {
        // 默认一行显示4列查询条件
        colNum:4
    };

    // 状态参数
    state = {
        // 收起还是展开，isOpen为true显示展开后的，即文案为收起
        isOpen:false,

    };

    // 组件暴露的search函数
    search = ()=> {
        this.props.search();
    };

    // 组件暴露的reset函数
    reset = ()=> {
        this.props.reset();
    };

    // 将行数、列数转换为数组形式，方便map方法使用，循环显示行-列
    convertArr = (num) => {
        var _arr = [];
        for(let i = 0; i < num; i++) {
            _arr.push(i);
        }
        return _arr;
    };

    // 点击展开/收起，修改state中的isOpen状态值
    toggleClick = () => {
        const { isOpen } = this.state;
        this.setState({
            isOpen: !isOpen
        });
    };

    // 绑定渲染'展开'操作，一行默认4列，至少4个查询条件才会有'展开'操作
    bindOpenHtml = () => {
        const { colNum, children } = this.props;
        if(children && children.length > parseInt(colNum - 1)){
            return (
                <a className="a-left" onClick={this.toggleClick}>
                    展开 <Icon type="down" />
                </a>
            )
        }else {
            return (
                ''
            )
        }
    };

    // 绑定渲染'收起'操作，一行默认4列，至少4个查询条件才会有'收起'操作
    bindCloseHtml = () => {
        const { colNum, children } = this.props;
        if(children && children.length > parseInt(colNum - 1)){
            return (
                <a className="a-left" onClick={this.toggleClick}>
                    收起 <Icon type="up" />
                </a>
            )
        }else {
            return (
                ''
            )
        }
    };

    // 绑定渲染children数组,一个children时为对象，多个children为数组
    bindSearchHtml = () => {
        const { colNum, children } = this.props;
        const colWidthCompute = parseInt( 24 / colNum );
        if(children.length){
            // 计算查询条件显示的行数
            let rowNum = children.length % colNum == 0 ?children.length / colNum :Math.ceil(children.length / colNum);
            let rowArr = this.convertArr(rowNum);
            let colArr = this.convertArr(colNum);
            return rowArr.map((ritem, rindex) => {
                return (
                    <Row gutter={{ xs: 8, md: 24, lg: 32 }} key={rindex} type="flex" align="middle" className="row-spacing">
                        {
                            colArr.map((citem, cindex) => {
                                  if((colNum*ritem + citem) < children.length){
                                      return (
                                          <Col md={colWidthCompute} xs={24} lg={colWidthCompute} key={cindex}>
                                              {children[(colNum*ritem + citem)]}
                                          </Col>
                                      )
                                  }
                                }
                            )
                        }
                    </Row>
                )
            })
        }else{
            return (
                <Row gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" align="middle" className="row-spacing">
                    <Col md={colWidthCompute} xs={24} lg={colWidthCompute}>
                        {children}
                    </Col>
                </Row>
             )
        }
    };

    // 渲染所有的children和按钮，isOpen为true显示
    rendAll(){
        const { colNum } = this.props;
        const colWidthCompute = parseInt( 24 / colNum );
        const availedWidth = parseInt( 24 - colWidthCompute );
        return (
            <div className="search-condition-container">
                {this.bindSearchHtml()}
                <Row type="flex" align="middle" className="row-spacing">
                    <Col md={availedWidth} xs={24} lg={availedWidth} className="col-btn">
                    </Col>
                    <Col md={colWidthCompute} xs={24} lg={colWidthCompute} className="col-btn">
                        <Button type="primary" onClick={this.search}>查询</Button>
                        <Button type="default" onClick={this.reset}>重置</Button>
                        {this.bindCloseHtml()}
                    </Col>
                </Row>
            </div>
        )
    }

    // 默认显示渲染三个条件及按钮，isOpen为false显示，一个children时为对象，多个children为数组
    renderThree(){
        const { colNum,children } = this.props;
        const colWidthCompute = parseInt( 24 / colNum );
        const availedWidth = parseInt( 24 - 2 * colWidthCompute );
        let colArr = this.convertArr(colNum);
        if(children.length){
            return (
              <div className="search-condition-container">
                <Row gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" align="middle" className="row-spacing">
                    {
                        colArr.map((citem, cindex) => {
                                if(citem < parseInt(colNum - 1)){
                                    return (
                                        <Col md={colWidthCompute} xs={24} lg={colWidthCompute} key={cindex}>
                                            {children[citem]?children[citem]:''}
                                        </Col>
                                    );

                                }
                            }
                        )
                    }
                    <Col md={colWidthCompute} xs={24} lg={colWidthCompute} className="col-btn">
                        <Button type="primary" onClick={this.search}>查询</Button>
                        <Button type="default" onClick={this.reset}>重置</Button>
                        {this.bindOpenHtml()}
                    </Col>
                </Row>
              </div>
            )
        }else{
            return (
              <div className="search-condition-container">
                <Row gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" align="middle" className="row-spacing">
                    <Col md={colWidthCompute} xs={24} lg={colWidthCompute}>
                        {children}
                    </Col>
                    <Col md={availedWidth} xs={24} lg={availedWidth}>
                    </Col>
                    <Col md={colWidthCompute} xs={24} lg={colWidthCompute} className="col-btn">
                        <Button type="primary" onClick={this.search}>查询</Button>
                        <Button type="default" onClick={this.reset}>重置</Button>
                    </Col>
                </Row>
              </div>
            )
        }
    }

    // 根据isOpen判断默认显示条件个数还是全部显示
    render(){
        const { isOpen } = this.state;
        return isOpen ? this.rendAll() : this.renderThree();
    }

}

export default TableSearch;