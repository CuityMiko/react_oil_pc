/**
 * 地图组件
 * 参数：
 *  1、title：write状态下使用，文本框名称
 *  2、lnglat：经纬度，read状态下使用，[经度、纬度]
 *  3、clickMarker：点击地图图标触发事件，write状态下使用
 *  4、maptype：地图状态，read：只读状态、write：编辑状态
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Input, Button, Row, Col, Form, Alert} from 'antd';

var map, geolocation, curCityCode, auto, currLng, currLat;

const FormItem = Form.Item;

class AppMap extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        lnglat: PropTypes.array,
        clickMarker: PropTypes.func,
        maptype: PropTypes.oneOf(['read', 'write'])
    }

    state = {
        address: '', // 地址
        longitude: '', // 经度
        latitude: '' // 纬度
    }

    componentDidMount() {
        // 初始化地图
        this.initMap();
    }

    /**
     * 初始化地图
     */
    initMap = () => {
        const {maptype} = this.props;
        if (maptype == 'read') {
            // 根据经纬度加载地图
            const _dw = [120.220885, 30.206752];
            const _selmap = new window.AMap.Map('ampcontainer2', {
                resizeEnable: true,
                center: _dw,
                zoom: 20
            });
            // Marker
            new window.AMap.Marker({
                map: _selmap,
                position: _dw
            });
        } else {
            // 加载地图，调用浏览器定位服务
            map = new window.AMap.Map('ampcontainer', {
                resizeEnable: true,
                zoom: 20
            });

            // 输入提示
            auto = new window.AMap.Autocomplete({
                input: 'address'
            });

            map.plugin('AMap.Geolocation', function() {
                geolocation = new window.AMap.Geolocation({
                    enableHighAccuracy: true,
                    timeout: 10000,
                    buttonOffset: new window.AMap.Pixel(10, 20),
                    zoomToAccuracy: true,
                    buttonPosition:'RB'
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                window.AMap.event.addListener(geolocation, 'complete', function(data) { // 返回定位信息
                    if (data && data.position && data.addressComponent) {
                        curCityCode = data.addressComponent.citycode;
                        currLng = data.position.getLng();
                        currLat = data.position.getLat();
                    }
                });
            });
        }
    }

    /**
     * 搜索
     */
    search = () => {
        const {getFieldValue, setFieldsValue} = this.props.form;
        const {clickMarker} = this.props;
        const _self = this;
        if (getFieldValue('address')) {
            window.AMap.service(['AMap.PlaceSearch'], function() {
                var placeSearch = new window.AMap.PlaceSearch({ // 构造地点查询类
                    pageSize: 5,
                    pageIndex: 1,
                    city: curCityCode, //城市
                    map: map
                });
                // 关键字查询
                placeSearch.search(getFieldValue('address'));
                // 点击Mark事件
                window.AMap.event.addListener(placeSearch, 'markerClick', function(e) {
                    _self.setState({
                        longitude: e.data.location.lng,
                        latitude: e.data.location.lat,
                        address: e.data.adname + e.data.address
                    })
                    clickMarker(e.data.location.lng, e.data.location.lat, e.data.adname + e.data.address)
                    setFieldsValue({['address']: e.data.adname + e.data.address})
                })
            });
        }
    }

    /**
     * 选择地图方式
     */
    SelectMap = () => {
        const {maptype, title} = this.props;
        if (maptype == 'write') {
            const {getFieldDecorator} = this.props.form;
            const formItemLayout = {
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 4, offset: 2},
                    md: {span: 4, offset: 5}
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                    md: {span: 10}
                },
            };
            const formTailLayout = {
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16, offset: 6},
                    md: {span: 10, offset: 9}
                },
            };
            return (
                <div>
                    <FormItem {...formItemLayout} label={title}>
                        {getFieldDecorator('addressdiv',
                        )(
                            <Row>
                                <Col span={18}>
                                    <FormItem>
                                        {getFieldDecorator('address',
                                        )(
                                            <Input placeholder={`请输入${title}`} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5} offset={1}>
                                    <Button type="primary" onClick={this.search}>搜索</Button>
                                </Col>
                            </Row>
                        )}
                    </FormItem>
                    <FormItem {...formTailLayout}>
                        <Alert message="请在地图上点击具体位置以确认地址" type="info" showIcon />
                    </FormItem>
                    <FormItem {...formTailLayout} label="">
                        {getFieldDecorator('ampcontainer',
                        )(
                            <div style={{height: 240}}></div>
                        )}
                    </FormItem>
                </div>
            )
        } else {
            return (
                <div id="ampcontainer2" style={{height: 240}}></div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.SelectMap()}
                {
                    <style>
                        {
                            `.amap-logo {
                                display: none !important;
                            }
                            .amap-copyright {
                                display: none !important;
                            }`
                        }
                    </style>
                }
            </div>
        )
    }
}

export default AppMap;