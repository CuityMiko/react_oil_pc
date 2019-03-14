/**
 * 下载二维码组件,后台返回二维码的情况下，前端直接展示二维码，同时提供根据不同尺寸大小下载的功能
 * 传参：
 *  1、url：后端生成的二维码图片地址
 *  2、isShow：显示下载弹窗
 *  3、codeName：下载二维码名称
 */

import React, {Component} from 'react';
import * as QrCode from 'qrcode.react';
import {Select, Modal} from 'antd';
import PropTypes from 'prop-types';

import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import styles from './qrcode_download_img.module.less';

const Option = Select.Option;

class DownLoadImg extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        isShow: PropTypes.bool,
        codeName: PropTypes.string,
        afterClose: PropTypes.func
    }

    static defaultProps = {
        isShow: false,
        codeName: '二维码'
    };

    state = {
        size: '150'
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isShow) {
            this.setState({visible: newProps.isShow})
        }
    }

    /**
     * 切换尺寸
     */
    handleChange = (val, callbak) => {
        const {url} = this.props;
        this.setState({size: val})
        // this.main(url, val, callbak);
    }
    // 二维码的链接形式转换为base64位形式，下载本地需要base64
    main = (src, size, cb) => {
        var image = new Image();
        image.src = src + '?v=' + Math.random(); // 处理缓存
        image.crossOrigin = "*";  // 支持跨域图片
        image.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            var ctx = canvas.getContext("2d");
            // ctx.drawImage(image, 0, 0, image.width, image.height);
            ctx.drawImage(image, 0, 0, size, size);
            var dataURL = canvas.toDataURL("image/png");  // 可选其他值 image/jpeg
            cb && cb(dataURL);
        }
    }

    /**
     * 下载
     */
    handleOkDownload = () => {
        const {url} = this.props;
        const {size} = this.state;
        const {codeName} = this.props;
        var type = 'png';
        var filename = codeName + '-' + size + '.' + type;
        this.main(url,size, (imgData) => {
            // 图片导出为 png 格式
            var _fixType = function (type) {
                type = type.toLowerCase().replace(/jpg/i, 'jpg');
                var r = type.match(/png|jpg|bmp|gif/)[0];
                return 'image/' + r;
            };
            // 加工image data，替换mime type
            imgData = imgData.replace(_fixType(type), 'image/octet-stream');
            //下载后的二维码名称
            //创建具有指定的命名空间URI元素和限定名称。
            var saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            saveLink.href = imgData;
            saveLink.download = filename;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            saveLink.dispatchEvent(event);
        });
    }

    /**
     * 取消
     */
    handleCancelDownload = () => {
        this.setState({visible: false})
    }

    // 模态框关闭之后的处理
    afterClose = () => {
        if (this.props.afterClose) {
            this.props.afterClose()
        }
    }

    render() {
        const {size, visible} = this.state;
        const {url} = this.props;
        return (
            <Modal
                title="下载二维码"
                visible={visible}
                onOk={this.handleOkDownload}
                okText="下载"
                onCancel={this.handleCancelDownload}
                afterClose={this.afterClose}
                destroyOnClose={true}>
                <div className={styles.qrcode_download_container}>
                    <Select defaultValue={size} style={{width: 240}} size="large" onChange={this.handleChange}>
                        <Option value="150">150px</Option>
                        <Option value="200">200px</Option>
                        <Option value="250">250px</Option>
                        <Option value="300">300px</Option>
                        <Option value="350">350px</Option>
                        <Option value="400">400px</Option>
                    </Select>
                    <WhiteSpace size="v-sxl"/>
                    <div className="download-qrcode-container">
                        <img src={url} alt="" style={{width: Number(size), height: Number(size)}}/>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default DownLoadImg;