import React, {Component} from 'react';
import {
    Form, Message, Cascader, Button,
} from 'antd';

import UploadAvatar from "@/common/components/upload_avatar/UploadAvatar";
import oiltationInformationService
    from '@/oiltation_manage/services/oiltation_information/oiltation_information.service';
import AppMap from '@/common/components/app_map/AppMap';

const FormItem = Form.Item;

class OiltationInfoForm extends Component {
    state = {
        headimgUrl: '',
        formData: null,
        longitude: '',
        latitude: '',
        address: '',
        provinceId: '',
        cityId: '',
        provinceCityIds: [],
        option: [],
        addressPrefix: ''
    };

    /**
     * 改变头像
     */
    changeAvatar = (imgurl) => {
        this.setState({
            headimgUrl: imgurl
        })
    }

    componentWillMount() {
        oiltationInformationService.merchantGetInfo().then(res => {
            console.log(res, 'res');
            let _provinceCityIds = [];
            _provinceCityIds.push(res.provinceId);
            _provinceCityIds.push(res.cityId);
            this.setState({
                formData: res,
                headimgUrl: res.logoUrl || '',
                provinceCityIds: _provinceCityIds
            })
            // console.log(this.state.formData.cityMergerName.split(','), 'city');
        }).catch(err => {
            console.log(err)
        })
    }

    componentDidMount() {
        oiltationInformationService.merCommonRegion().then(res => {
            this.setState({
                option: res
            })
        }).catch(err => {
            console.log(err);
        })
    }

    /**
     * 提交
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {headimgUrl, formData, longitude, latitude, address, provinceId, cityId} = this.state;
                let logoUrl = headimgUrl ? headimgUrl : formData.logoUrl;
                let submitData = {
                    'contactMobile': formData.contactMobile,
                    'contactName': formData.contactName,
                    'logoUrl': logoUrl,
                    "address": address,
                    "cityId": cityId,
                    'provinceId': provinceId,
                    'latitude': latitude,
                    'longitude': longitude,
                    'name': formData.name,
                }
                oiltationInformationService.merchantModifyInfo(Object.assign({}, {...submitData})).then(res => {
                    Message.success('修改成功')
                    this.props.history.push('/main/oiltation_manage/oiltation_information')
                }).catch(err => {
                    console.log(err)
                })
            }
        });
    };

    //省市选择
    onChange = (value, data) => {
        console.log(value, data);
        let _label = data[0].label + data[1].label;
        console.log(_label)
        this.setState({
            provinceId: value[0],
            cityId: value[1],
            addressPrefix: _label
        })
    }

    //取消
    onCancel = () => {
        this.props.history.push('/main/oiltation_manage/oiltation_information')
    }

    // 点击地图图标
    clickMarker = (longitude, latitude, address) => {
        this.setState({longitude, latitude, address});
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {headimgUrl, formData, provinceCityIds, addressPrefix} = this.state;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4, offset: 2},
                md: {span: 4, offset: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
                md: {span: 10},
            },
        };

        //按钮位置
        const formTailLayout = {
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16, offset: 6},
                md: {span: 10, offset: 9},
            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="联系人">
                    <div>{formData ? formData.contactName : ''}</div>
                </FormItem>
                <FormItem {...formItemLayout} label="油站电话">
                    <div>{formData ? formData.contactMobile : ''}</div>
                </FormItem>
                <FormItem {...formItemLayout} label={"油站logo"}>
                    {getFieldDecorator('headimgUrl')(
                        <UploadAvatar headimgUrl={headimgUrl}
                                      changeAvatar={this.changeAvatar} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="省/市">
                    {getFieldDecorator('cityMergerName', {
                            initialValue: formData ? provinceCityIds : null
                        }
                    )(
                        <Cascader options={this.state.option}
                                  onChange={this.onChange}
                                  placeholder="请选择省/市"
                        />
                    )}
                </FormItem>
                <FormItem>
                     <AppMap maptype="write" title="详细地址" clickMarker={this.clickMarker} form={this.props.form} />
                </FormItem>
                <FormItem {...formTailLayout}>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                    <Button type="default" onClick={this.onCancel}>
                        取消
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(OiltationInfoForm);