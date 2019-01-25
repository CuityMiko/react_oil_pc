/**
 * 轮播中心详情
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Form,Row, Col, Button,Icon,message} from 'antd';
import moment from 'moment';

import { receiveData } from '@/base/redux/actions';
import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';

import BannerCenterService from '@/marketing_center/services/banner_center/banner_center.service';

import './banner_center.less';

const FormItem = Form.Item;

class BannerCenterDetail extends Component {
    state = {
        title: '轮播中心',
        // 0-1-2-未开始-进行中-已结束，根据状态判断按钮显示情况
        detailData:{}
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '轮播中心',
            routes: [
                {title: '营销中心', path: ''},
                {title: '轮播中心', path: '/main/marketing_center/banner_center_detail'}
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        // 详情接口
        BannerCenterService.noticeDetail().then(res => {
            this.setState({
                detailData:res
            });
        }).catch(err => {
            console.log(err)
        })
    }

    edit = ()=>{
        this.props.history.push('/main/marketing_center/banner_center/1');
    }

    end = ()=>{
        // 详情接口
        const {detailData} = this.state;
     BannerCenterService.noticeOperate({
         id: detailData.id?detailData.id:'',
         title: detailData.title,
         startTime: detailData.startTime,
         endTime: detailData.endTime,
         content: detailData.content,
         url: detailData.url,
         isDeleted:1
     }).then(res => {
         message.success('提前结束成功');
      // 提前结束后调详情接口刷新页面，对应状态和按钮文案改变
          BannerCenterService.noticeDetail().then(res => {
               this.setState({
                 detailData:res
              });
            }).catch(err => {
                 console.log(err)
           })
      }).catch(err => {
          console.log(err);
          message.success('提前结束失败');
      })
    }

render() {
  const {responsive} = this.props;
  let isMobile = responsive.data.isMobile;
  const { getFieldDecorator } = this.props.form;
  const {detailData} = this.state;
  const formItemLayout = {
      labelCol: {
          xs:{span:6},
          md:{ span:4,offset:2},
          lg:{ span:4,offset:2},
      },
      wrapperCol: {
          xs:{span:16},
          md:{ span:16},
          lg:{ span:16},
      }
  };
  let formOptionalLabel = {
      'outLinkLabel' : (<span><span>外部链接</span><span className="optional-style"></span></span>),
  };
  const styleMobile = {
      h5Width:{
          // width:isMobile?'100%':'calc(100% - 324px)'
      },
      h5Preview:{
          display:isMobile?'none':'inline-block'
      }
  };

  const headerBtnHtmlEdit = (
      <Button className="" onClick={this.edit} type="primary" htmlType="submit">编辑</Button>
  );
  const headerBtnHtmlEnd = (
      <Button className="" onClick={this.end} type="default" htmlType="submit">提前结束</Button>
  );

  return (
      <div className="base-edit">
          <div className="content">
              <Row gutter={16}>
                  <Col md={8} xs={24} className={responsive.data.isMobile?'mobile-preview common-mbr-preview':'computer-preview common-mbr-preview'}>
                      <div className="scrollable-container" ref={(node) => { this.container = node; }}>
                          <div>
                              <div className="exhibition">
                                  <div className="preview-h5" style={styleMobile.h5Preview}>
                                      <div className="h5-title">轮播示例<span>(图中数据仅为示例)</span></div>
                                      <div className="h5-base-back">
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </Col>
                  <Col md={16} xs={24} className={responsive.data.isMobile?'mobile-set common-mbr-set':'computer-set common-mbr-set'}>
                      <div className={isMobile?'mobile-set-style common-set':'computer-set-style common-set'} style={styleMobile.h5Width}>
                          <Form onSubmit={this.save}>
                              {
                                  detailData.status==1 && (
                                      <Panel panelHeader={true} panelFooter={false} title="轮播设置" headerBtnHtml={headerBtnHtmlEnd}>
                                          <WhiteSpace size="v-xl" />
                                          <div className="set-tip">
                                              <Icon type="exclamation-circle" />
                                              <span>如通知示例所示，蓝色区域为显示位置，可通过配置外部链接点击跳转</span>
                                          </div>
                                          <WhiteSpace size="v-lg" />
                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label="轮播状态:" className={detailData.status==1?'status-style':''}>
                                                  {getFieldDecorator('status', {
                                                  })(
                                                      <div>{detailData.status?detailData.status==0?'未开始':detailData.status==1?'进行中':detailData.status==2?'已结束':'--':'未开始'}</div>
                                                  )}
                                              </FormItem>
                                          </div>

                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label="轮播标题:">
                                                  {getFieldDecorator('title',{
                                                  })(
                                                      <div>{detailData.title?detailData.title:'--'}</div>
                                                  )}
                                              </FormItem>
                                          </div>

                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label="轮播时间:">
                                                  {getFieldDecorator('time', {
                                                  })(
                                                      <div>{(detailData.startTime && detailData.endTime) ?
                                                          ((moment(Number(detailData.startTime)).format('YYYY.MM.DD')) +
                                                              '-'+ (moment(Number(detailData.endTime)).format('YYYY.MM.DD'))):'--'}
                                                      </div>
                                                  )}
                                              </FormItem>
                                          </div>

                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label="内容:">
                                                  {getFieldDecorator('contentText', {
                                                  })(
                                                      <div>{detailData.content?detailData.content:'--'}</div>
                                                  )}
                                              </FormItem>
                                          </div>

                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label={formOptionalLabel.outLinkLabel}>
                                                  {getFieldDecorator('outLink', {
                                                  })(
                                                      <div>{detailData.url?detailData.url:'--'}</div>
                                                  )}
                                              </FormItem>
                                          </div>
                                      </Panel>
                                  )
                              }

                              {
                                  detailData.status!=1 && (
                                      <Panel panelHeader={true} panelFooter={false} title="轮播设置" headerBtnHtml={headerBtnHtmlEdit}>
                                          <WhiteSpace size="v-xl" />
                                          <div className="set-tip">
                                              <Icon type="exclamation-circle" />
                                              <span>如通知示例所示，蓝色区域为显示位置，可通过配置外部链接点击跳转</span>
                                          </div>
                                          <WhiteSpace size="v-lg" />

                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label="轮播状态:" className={detailData.status==1?'status-style':''}>
                                                  {getFieldDecorator('status', {
                                                  })(
                                                      <div>{detailData.status?detailData.status==0?'未开始':detailData.status==1?'进行中':detailData.status==2?'已结束':'--':'未开始'}</div>
                                                  )}
                                              </FormItem>
                                          </div>
                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label="轮播标题:">
                                                  {getFieldDecorator('title',{
                                                  })(
                                                      <div>{detailData.title?detailData.title:'--'}</div>
                                                  )}
                                              </FormItem>
                                          </div>

                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label="轮播时间:">
                                                  {getFieldDecorator('time', {
                                                  })(
                                                      <div>
                                                          {(detailData.startTime && detailData.endTime) ?
                                                              ((moment(Number(detailData.startTime)).format('YYYY.MM.DD')) +
                                                                  '-'+ (moment(Number(detailData.endTime)).format('YYYY.MM.DD'))):'--'}
                                                      </div>
                                                  )}
                                              </FormItem>
                                          </div>

                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label="内容:">
                                                  {getFieldDecorator('contentText', {
                                                  })(
                                                      <div>{detailData.content?detailData.content:'--'}</div>
                                                  )}
                                              </FormItem>
                                          </div>

                                          <div className="row-col-container">
                                              <FormItem {...formItemLayout} label={formOptionalLabel.outLinkLabel}>
                                                  {getFieldDecorator('outLink', {
                                                  })(
                                                      <div>{detailData.url?detailData.url:'--'}</div>
                                                  )}
                                              </FormItem>
                                          </div>
                                      </Panel>
                                  )
                              }
                          </Form>
                      </div>
                  </Col>
              </Row>
          </div>
      </div>
  )
}
}
export default connect(
state => {
  const {responsive, menu} = state.AppData;
  return {
      responsive
  }
}, {receiveData})(Form.create()(BannerCenterDetail));
