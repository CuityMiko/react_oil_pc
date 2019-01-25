import React, {Component} from 'react';
import PropsType from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Tabs, message, Input, Button, } from 'antd';
import copy from 'copy-to-clipboard';
import * as QrCode from 'qrcode.react';

import { receiveData } from '@/base/redux/actions';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import QrcodeDownload from '@/common/components/qrcodedownload/QrcodeDownload';

const TabPane = Tabs.TabPane;

class H5Link extends Component {
    // 状态参数
    state = {
        title: '',
        showDowload: false,

    };

    handelChange = ()=>{};

    // 复制
    copyUrl = () => {
        const {url} = this.props;
        copy(url);
        message.success('复制成功，如果失败，请在输入框内手动复制.');
    };

    /**
     * 下载二维码
     */
    qrDownLoad = () => {
        this.setState({showDowload: true})
    }

    render() {
        // 手机端还是电脑端
        const {responsive,url} = this.props;
        const {showDowload} = this.state;
        return (
            <div className="h5-link-container">
                <Tabs defaultActiveKey="1" onChange={key => this.handelChange(key)} size="">
                    <TabPane tab="二维码" key="1">
                        <div>扫一扫，进入会员中心</div>
                        <WhiteSpace size="v-xl" />
                        <div className="qrcode-container">
                            <QrCode value={url} size={200} />
                        </div>
                        <WhiteSpace size="v-xl" />
                        <Button type="primary" className="down-load-qrcode" onClick={this.qrDownLoad}>下载二维码</Button>
                    </TabPane>
                    <TabPane tab="H5链接" key="2">
                        <div>通过将下面的链接放置在微信公众号一级/二级菜单，<br/>关注公众号的会员可以直接进入个人会员中心</div>
                        <WhiteSpace size="v-xl" />
                        <Input value={url} style={{width:'80%'}} />
                        <WhiteSpace size="v-xl" />
                        <Button type="primary" onClick={this.copyUrl}>复制</Button>
                    </TabPane>
                </Tabs>
                {/*下载二维码*/}
                <QrcodeDownload isShow={showDowload} url={url} name='h5二维码'></QrcodeDownload>
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
)(H5Link);
