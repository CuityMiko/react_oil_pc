import React, {Component} from 'react';
import {connect} from "react-redux";
import {receiveData} from '@/base/redux/actions';
import {Table, Button, message, Modal} from 'antd';
import moment from 'moment';

import DetailShowComplex from '@/common/components/detail_show/DetailShowComplex';
import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import RefundModal from '@/data_center/components/RefundModal';

import alipay from '@/data_center/assets/images/alipay.png';
import wechat from '@/data_center/assets/images/wechat.png';
import disel_pay from '@/data_center/assets/images/disel_pay.png';
import petrol_pay from '@/data_center/assets/images/petrol_pay.png';
import dataCenterService from '@/data_center/services/data_center.service';
import {Form} from "antd/lib/index";

class ConsumerOrdersDetail extends Component {
  state = {
    // orderId
    orderId: '',
    // 订单信息
    orderInfo: new Map(),
    // 退款订单
    refundOrders: [],
    // 会员信息
    memberInfoMap: new Map(),
    // 支付状态为1(支付成功)/3(部分退款)时显示退款按钮，支付状态为4(全额退款)/3(部分退款)时显示退款table
    status: 0,
    // 支付订单的会员ID，为null或是0时不显示会员信息
    memberId: 0,
    // 退款模态框默认关闭
    visible: false,
    // 可退金额
    returnableAmount: 0,
    // 订单号
    orderNumber: '',
    //退款弹出框的退款按钮是否可点击
    refundClick:true
  };

  componentDidMount() {
    let orderId = this.props.params.orderId;
    this.setState({
      orderId: orderId
    });
    this.getSimpleOrderDetailFun(orderId, 0);
  }

  // 详情请求接口 flag为0时表示从订单列表进来请求接口，为1时表示刷新状态
  getSimpleOrderDetailFun = (orderId, flag) => {
    let _this = this;
    dataCenterService.getSimpleOrderDetail(orderId)
      .then((res) => {
        if (flag === 1) {
          message.success('刷新订单状态成功');
        }
        _this.setState({
          status: res.status,
          refundOrders: res.refundOrders,
          memberId: res.memberId,
          returnableAmount: res.returnableAmount,
          orderNumber: res.orderNumber
        });
        // 初始化面包屑
        _this.initBreadcrum(res);
        _this.bindOrderInfo(res);
        if (res.memberId) {
          _this.bindMemberInfo(res);
        }
      })
      .catch((err) => {
        console.log(err)
      })
  };

  // 初始化面包屑
  initBreadcrum = (res) => {
    const {receiveData} = this.props;
    const {
      orderId
    } = this.props.params;
    const breadcrumbdata = {
      routes: [
        {title: '首页'},
        {title: '订单列表', path: '/main/data_center'},
        {title: '消费订单详情', path: '/main/data_center/consumer_orders_detail/' + orderId}
      ],
      children: this.bindChildren(res)
    };
    receiveData(breadcrumbdata, 'breadcrumb')
  };

  bindChildren = (res) => {
    let _headerDataMap = this.bindHeaderData(res);
    return (
      <div className="consumer-order-detail-show-box">
        <DetailShowComplex headerHave btnTitle colNum={3} data={_headerDataMap} direction="level"
                           titleName={`单号：${res.orderNumber}`}
                           customClass="consumer-order-detail-show"
        >
          {
            (res.status === 1 || res.status === 3) ? (
              <div>
                <Button type="default" onClick={this.refundFun}>退款</Button>
                <Button type="primary" onClick={this.refresh}>刷新</Button>
              </div>
            ) : (
              <Button type="primary" onClick={this.refresh}>刷新</Button>
            )
          }
        </DetailShowComplex>
      </div>
    )
  };

  // 绑定头部数据
  bindHeaderData = (res) => {
    let headerDataMap = new Map();
    // 油品
    let pros = '-';
    if (res.goodsList) {
      let goodsList = res.goodsList;
      pros = goodsList.filter(g => g.skuName != null).map(item => item.skuName).join('/')
    }
    headerDataMap.set('油站名称', res.merchant.name)
      .set('加油员', res.opStaff ? res.opStaff.realname : '-')
      .set('移动支付单号', res.outOrderNumber || '-')
      .set('油品', pros)
      .set('支付方式', this.getPayEntry(res.payEntryText));
    return headerDataMap;
  };

  // 绑定订单信息
  bindOrderInfo = (res) => {
    let orderInfo = new Map();
    orderInfo.set('订单金额', this.judgeAmount(res.amount))
      .set('顾客实付', this.judgeAmount(res.realPayAmount))
      .set('优惠', this.judgeAmount(res.discountAmount))
      .set('订单状态', this.judgeOrderStatus(res.status))
      .set('支付时间', res.payTime ? (moment(res.payTime).format('YYYY.MM.DD HH:mm:ss')) : '-');
    this.setState({
      orderInfo
    });
    return orderInfo;
  };

  // 绑定会员信息
  bindMemberInfo = (res) => {
    let memberInfoMap = new Map();
    memberInfoMap.set('会员手机号', res.memberConsumptionResponse.mobile)
      .set('本次积分', res.memberConsumptionResponse.usedScore || '-')
      .set('优惠券', res.memberConsumptionResponse.coupons ? res.memberConsumptionResponse.coupons.name : '-');
    this.setState({
      memberInfoMap
    });
    return memberInfoMap;
  };

  // 判断金额
  judgeAmount = (amount) => {
    if (amount) {
      return `￥${Number(amount).toFixed(2)}`;
    } else {
      return '￥0.00';
    }
  };

  // 判断订单状态
  judgeOrderStatus = (status) => {
    switch (status) {
      case 0:
        return <div className="pay-status-box not-pay-box">待支付</div>;
      case 1:
        return <div className="pay-status-box">支付成功</div>;
      case 2:
        return <div className="pay-status-box not-pay-box">支付中</div>;
      case 3:
        return <div className="pay-status-box refund-box">部分退款</div>;
      case 4:
        return <div className="pay-status-box refund-box">全额退款</div>;
      case 5:
        return <div className="pay-status-box close-box">已关闭</div>;
      default:
        return '-';
    }
  };

  // 判断支付方式
  getPayEntry = (payEntryText) => {
    if (payEntryText.indexOf('微信') > -1) {
      return <div className="pay-entry-display"><img src={wechat} alt=""/>微信支付</div>
    } else if (payEntryText.indexOf('支付宝') > -1) {
      return <div className="pay-entry-display"><img src={alipay} alt=""/>支付宝</div>
    } else if (payEntryText.indexOf('汽油卡') > -1) {
      return <div className="pay-entry-display"><img src={petrol_pay} alt=""/>汽油卡支付</div>
    } else if (payEntryText.indexOf('柴油卡') > -1) {
      return <div className="pay-entry-display"><img src={disel_pay} alt=""/>柴油卡支付</div>
    } else {
      return '-'
    }
  };

  // 刷新
  refresh = () => {
    const {orderId} = this.state;
    this.getSimpleOrderDetailFun(orderId, 1);
  };

  // 退款
  refundFun = () => {
    this.setState({
      visible: true
    })
  };

  //获取表单数据
  getFormData = (form) => {
    this.form = form;
  };

  handleCancel = () => {
    this.setState({
      visible: false
    })
  };

  handleSubmit = (e) => {
    console.log(e,'eeee')
    const {orderNumber, orderId,refundClick} = this.state;
    let _this = this;
    this.form.validateFields((err, values) => {
      if (values.amount && values.password) {
        let postData = {
          orderNumber: orderNumber,
          amount: Number(values.amount),
          password: values.password
        };
        _this.setState({
          refundClick:false
        });
        dataCenterService.refund(postData)
          .then(res => {
            message.success('退款成功');
            _this.setState({
              visible: false,
              refundClick:true
            });
            _this.getSimpleOrderDetailFun(orderId, 0);
          }).catch(err => {
          // message.error('退款失败');
          _this.setState({
            visible: false,
            refundClick:true
          })
        })
      }

    })
  };

  render() {
    const {
      orderInfo,
      refundOrders,
      memberInfoMap,
      status,
      memberId,
      visible,
      returnableAmount,
      orderNumber,
      refundClick
    } = this.state;

    const columns = [
      {
        title: '退款订单号',
        dataIndex: 'refundNumber',
        key: 'refundNumber'
      },
      {
        title: '退款时间',
        dataIndex: 'refundTime',
        key: 'refundTime',
        render: (text) => {
          return text ? (moment(text).format('YYYY.MM.DD HH:mm:ss')) : '-'
        }
      },
      {
        title: '退款状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          return text === 1 ? '成功' : '失败'
        }
      },
      {
        title: '退款金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (text) => {
          if (text != null) {
            return '￥' + Number(text).toFixed(2)
          } else {
            return '￥0.00'
          }
        }
      },
      {
        title: '退款积分',
        dataIndex: 'score',
        key: 'score',
        render: (text) => {
          return text || '-'
        }
      },
    ];

    return (
      <div className="consumer-order-detail-container">
        <Panel title="订单信息">
          <DetailShowComplex colNum={3} data={orderInfo} direction="level">
          </DetailShowComplex>
          {
            (status === 3 || status === 4) ? (
              <div>
                <WhiteSpace size="v-lg"/>
                <Table locale={{emptyText: '暂无数据'}}
                       dataSource={refundOrders}
                       rowKey={record => record.id}
                       columns={columns}
                       scroll={{x: 800}}
                       pagination={false}
                >
                </Table>
              </div>
            ) : ('')
          }
        </Panel>
        {
          memberId ? (
            <div>
              <WhiteSpace size="v-lg"/>
              <Panel title="会员信息">
                <DetailShowComplex colNum={3} data={memberInfoMap} direction="level">
                </DetailShowComplex>
              </Panel>
            </div>
          ) : ('')
        }
        <Modal
          title="退款"
          visible={visible}
          okText="确定"
          cancelText="取消"
          onOk={refundClick?this.handleSubmit:''}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <RefundModal orderNumber={orderNumber} returnableAmount={returnableAmount} ref={this.getFormData}/>
        </Modal>
      </div>
    )
  }
}

export default connect(state => ({UserInfo: state.UserInfo}), {receiveData})(Form.create()(ConsumerOrdersDetail));
