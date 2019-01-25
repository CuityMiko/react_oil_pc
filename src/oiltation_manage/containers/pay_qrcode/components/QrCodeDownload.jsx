import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Button,Select } from 'antd';

import { receiveData } from '@/base/redux/actions';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';

const Option = Select.Option;

class QrCodeDownload extends Component {
    // 状态参数
    state = {
        size: '150',
        base64Url:''
    }
    componentDidMount(){
        this.handleChange(150);
    }
    /**
     * 切换尺寸
     */
    handleChange = (val) => {
        const {url} = this.props;
        let _self = this;
        let base64Url='';
        _self.setState({
            size: val
        })
        // 将每个二维码的url转换成base64位形式，传给下载二维码页面
        _self.main(url,val, function(base64){
            base64Url =base64;
            _self.setState({
                base64Url:base64Url
            })
        });
    }

    // 二维码的链接形式转换为base64位形式，这样a的download才能自动下载
    main=(src, size,cb)=> {
        var image = new Image();
        image.src = src + '?v=' + Math.random(); // 处理缓存
        image.crossOrigin = "*";  // 支持跨域图片
        image.onload = function(){
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

    render() {
        // 手机端还是电脑端
        const {responsive,url,name} = this.props;
        const {size,base64Url} = this.state;
        return (
            <div className="qrcode-download-container">
                <div style={{textAlign:'center'}}>
                    <Select defaultValue={size} style={{ width: 240 }} size="large" onChange={this.handleChange}>
                        <Option value="150">150px</Option>
                        <Option value="200">200px</Option>
                        <Option value="250">250px</Option>
                        <Option value="300">300px</Option>
                        <Option value="350">350px</Option>
                        <Option value="400">400px</Option>
                    </Select>
                    <WhiteSpace size="v-sxl"/>
                    <a href={base64Url} download={name}>
                        <div className="download-qrcode-container">
                            <img src={base64Url} alt="qrcode" style={{width:Number(size),height:Number(size)}}/>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <Button type="primary">下载</Button>
                        </div>
                    </a>
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
    },{receiveData}
)(QrCodeDownload);
