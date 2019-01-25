import React from "react";
import { Upload, Icon, message } from 'antd';
import PropTypes from 'prop-types';
import {UploadUrl} from '@/common/services/common/common.url';

class Avatar extends React.Component {
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
            return;
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
        const isJPGorisPNG = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPGorisPNG) {
            message.error('You can only upload JPG file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
        }
        return isJPGorisPNG && isLt5M;
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

export default Avatar;