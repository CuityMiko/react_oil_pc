import React from "react";
import { Upload, Icon, message } from 'antd';
import PropTypes from 'prop-types';
import {UploadUrl} from '@/common/services/common/common.url';

class UploadAvatar extends React.Component {
    static propTypes = {
        headimgUrl: PropTypes.string,
        changeAvatar: PropTypes.func
    }

    state = {
        loading: false
    };

    handleChange = (info) => {
        const {changeAvatar} = this.props;
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
        }
        if (info.file.status === 'done') {
            this.setState({
                loading: false
            })
            // 更改父级图片
            changeAvatar(info.file.response.data.results[0].url);
        }
    }

    beforeUpload = (file) => {
        const isFileType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isFileType) {
            message.error('你只能上传jpeg或者png格式的图片!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('图片需小于5MB!');
        }
        return isFileType && isLt5M;
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传头像</div>
            </div>
        );
        const {headimgUrl} = this.props;
        return (
            <Upload
                name="files"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={UploadUrl}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
            >
                {headimgUrl ? <img className="preview-avart-img" src={headimgUrl} alt="avatar" /> : uploadButton}
            </Upload>
        );
    }
}

export default UploadAvatar;