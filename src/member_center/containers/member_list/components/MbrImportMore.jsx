import React, {Component} from 'react';
import PropsType from 'prop-types';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import classNames from 'classnames';
import { message,Button,Form,Upload,Icon,Modal } from 'antd';

import { receiveData } from '@/base/redux/actions';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
// import {mbrUploadImportUrl} from '@/member_center/services/member_list/member_list.url';
import {UploadUrl} from '@/common/services/common/common.url';
import MemberListService from '@/member_center/services/member_list/member_list.service';

const Dragger = Upload.Dragger;

class MbrImportMore extends Component {
    // 定义数据类型
    static propTypes = {
        // 弹窗形式调用时候的回调函数,拿到上传成功后的数据
        getUploadResult: PropTypes.func,
    };
    // 状态参数
    state = {
        title: '',
        // link:'http://chuangjiangx.oss-cn-hangzhou.aliyuncs.com/member/%E4%BC%9A%E5%91%98%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls',
        link:'http://yunque.oss-cn-hangzhou.aliyuncs.com/mbr-server/%E4%BC%9A%E5%91%98%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls',
        fileList: [],
        // 控制上传功能是否可用，默认可用
        cannotClick:false,
        // 确定按钮是否可点击
        // cannotConfirmClick:false
    };

    render() {
        // 手机端还是电脑端
        const {responsive,getUploadResult} = this.props;
        const {fileList} = this.state;
        const {link,cannotClick} = this.state;
        const _self = this;
        const props = {
            name: 'files',
            multiple: false,
            directory:false,
            // fileList: fileList,
            defaultFileList:fileList,
            // showUploadList:{ showPreviewIcon: true, showRemoveIcon: false },
            showUploadList:true,
            accept:".xls,.xlsx,.csv,application/vnd.ms-excel",
            // onRemove:false,
            disabled:cannotClick,
            // action: '//jsonplaceholder.typicode.com/posts/',
            // 上传文件通用url
            action:UploadUrl,
            onRemove(){
                // 移除已上传文件后，上传功能可用
                _self.setState({
                    cannotClick:false
                })
                getUploadResult({
                    finishedTotal:0,
                    errorTotal:0
                });
            },
            beforeUpload(info){

            },
            onChange(info) {
                if(info.fileList.length>=1){
                    // 已上传一个文件后，上传功能不可用
                    _self.setState({
                        cannotClick:true,
                        // cannotConfirmClick:true
                    })
                }

                const status = info.file.status;
                if (status !== 'uploading') {

                }
                if (status === 'done') {
                    message.success(`${info.file.name} 上传成功.`);
                    if(info.file.response.data && info.file.response.data.results){
                        if(info.file.response.data.results[0].url){
                            MemberListService.mbrUploadImport({
                                uploadUrl:info.file.response.data.results[0].url
                            }).then((res) => {
                                // console.log(res, '上传之后的接口数据');
                                if(res){
                                    MemberListService.resultUploadImport(res).then((res) => {
                                        // console.log(res, '上传结果');
                                        // 将上传结果回传给导入列表页面，点击确定时弹出
                                        getUploadResult(res);
                                    }).catch((result) => {
                                        console.log(result)
                                    });
                                }
                            }).catch((result) => {
                                console.log(result)
                            });
                        }
                    }
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败.`);
                }
            },
        };
        return (
            <div className="import-more-container">

                    <div className="step-upload">
                        <div className="step1-upload">①</div>
                        <div className="step-text">
                            <div>您需先创建会员批量数据导入的模版， </div>
                            <div>点击<a className="download-excel" href={link} target='_blank'>下载Excel模板</a></div>
                        </div>
                    </div>
                   <WhiteSpace size="v-lg" />
                    <div className="step-upload">
                        <div className="step2-upload">②</div>
                        <div className="step-text">
                            <div>如果您已按照要求整理了会员导入数据，</div>
                            <div>则在下方直接导入</div>
                        </div>
                    </div>
                <WhiteSpace size="v-lg" />
                    <div className="upload-excel">
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                            <p className="ant-upload-hint">支持.xlsx .xls</p>
                        </Dragger>
                    </div>

            </div>
        )
    }
}
export default Form.create()(MbrImportMore);
