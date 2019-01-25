/**
 * 单个支付二维码布局组件，参数：dataSource数据源，对象形式，leftClick，centerClick，rightClick布局下面操作对应的事件
 * 调用方法：
 *    <PayQrCode dataSource={item} key={item.id} leftClick={this.leftClick} centerClick={this.centerClick}
 rightClick={this.rightClick} />
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {Form, Input, Select, Modal, Row, message, Col, Button, Table, Divider} from 'antd';
import * as QrCode from 'qrcode.react';

import {receiveData} from '@/base/redux/actions';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import QrcodeDownload from '@/common/components/qrcodedownload/QrcodeDownload';
import QrcodeDownloadImg from '@/common/components/qrcodedownloadimg/QrcodeDownloadImg';
import QrCodeDownload from './QrCodeDownload';

import './qrcode_show.less';

const FormItem = Form.Item;
const Option = Select.Option;

class PayQrCode extends Component {
    // 定义数据类型
    static propTypes = {
        // 以支付二维码布局为例，下面这些参数可以直接默认
        dataSource: PropTypes.shape({
            // 页面上需要显示的字段
            id:PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            url:PropTypes.string,
            nameOne:PropTypes.string,
            nameTwo:PropTypes.string,
            desc:PropTypes.string,
            leftText: PropTypes.string,
            centerText: PropTypes.string,
            rightText: PropTypes.string
        }),
        leftClick: PropTypes.func,
        rightClick: PropTypes.func,
        centerClick: PropTypes.func,
    };

    // 定义默认值
    static defaultProps = {
        dataSource: {
            // 二维码存放位置,传url参数前端对应生成二维码
            // id:1,
            // url:'--',
            // nameOne: '--',
            // nameTwo: '--',
            // desc: '--',
            // leftText: '下载',
            // centerText: '注销',
            // rightText: '修改'
        }
    };

    state = {
        visibleDownload:false
    }

    // 页面布局bottom操作-左-如下载
    leftClick = (e, id, url, name) => {
        e.preventDefault();
        e.stopPropagation();
        var _self = this;
        _self.showModalDownload('下载二维码',id,url,name);
    };

    // 修改库存模态框
    showModalDownload = (title,id,url,name) => {
        this.setState({
            visibleDownload: true,
            modalTitle: title,
            couponName:name,
            id:id,
            url:url,
        });
    };

    // 下载按钮
    handleSubmitDownload=()=>{
    };

    // 取消按钮
    handleCancelDownload = ()=>{
        this.setState({
            visibleDownload: false,
        });
    };

    // 弹出框关闭
    afterCloseModal = () => {

    };

    // 页面布局bottom操作-中-如注销
    centerClick = (e,id) => {
        this.props.centerClick(e,id);
    };

    // 页面布局bottom操作-右-如修改
    rightClick = (e,id) => {
        this.props.rightClick(e,id);
    };

    render() {
        const {dataSource} = this.props;
        const {visibleDownload,url,couponName} = this.state;
        return (
            <div className="qr-code-show">
                <Row className="code-top" type="flex" justify="center" align="top">
                    <Col style={{width:'100px'}}>
                        {/*<QrCode value={dataSource.url} size={100} />*/}
                        <img src={dataSource.url} style={{width:'100px'}} alt=""/>
                    </Col>
                    <Col style={{width:'calc(100% - 100px)',paddingLeft:'4px'}}>
                        <div className="title-one">
                            <div className="title-one-prefix"></div>
                            <span>{dataSource.nameOne}</span>
                        </div>
                        <div className="title-two">{dataSource.nameTwo}</div>
                        <div className="desc">{dataSource.desc}</div>
                    </Col>

                </Row>
                <Row className="code-bottom">
                    <Col>
                        <Col className="left-line txt-style" md={8} lg={8} xs={8} type="flex"
                             align="middle" justify="center"
                             onClick={(e) => {
                                 this.leftClick(e, dataSource.id,dataSource.url, dataSource.nameOne)
                             }}>{dataSource.leftText}</Col>
                        <Col className="left-line txt-style" md={8} lg={8} xs={8} type="flex"
                             align="middle" justify="center"
                             onClick={(e) => {
                                 this.centerClick(e, dataSource.id)
                             }}>{dataSource.centerText}</Col>
                        <Col className="txt-style" md={8} lg={8} xs={8} type="flex"
                             align="middle" justify="center"
                             onClick={(e) => {
                                 this.rightClick(e, dataSource.id)
                             }}>{dataSource.rightText}</Col>
                    </Col>
                </Row>
                {/*下载二维码*/}
                <Modal
                    title="下载二维码"
                    visible={visibleDownload}
                    // okText="下载"
                    // cancelText="取消"
                    footer = {null}
                    onOk={this.handleSubmitDownload}
                    afterClose={this.afterCloseModal}
                    onCancel={this.handleCancelDownload}
                    destroyOnClose={true}
                >
                    <QrCodeDownload ref='download' url={url} name={couponName} />
                </Modal>

            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(Form.create()(PayQrCode));