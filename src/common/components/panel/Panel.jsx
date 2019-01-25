/**
 * panel 组件
 * panelHeader:是否有头部
 * title:头部标题，可以为字符串，也可以为node类型
 * headerBtnHtml:头部右侧按钮html
 * panelFooter:是否有底部
 * footerBtnHtml:底部按钮html
 * innerType:内部卡片头部样式灰色 type = "inner"唯一可选项
 * bordered: 是否有边框
 */

import React from "react";
import PropTypes from "prop-types";
import { Card } from "antd";

import "./panel.less";

class Panel extends React.Component {
  // 定义数据类型
  static propTypes = {
    panelHeader: PropTypes.bool,
    headerBtnHtml: PropTypes.element,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    panelFooter: PropTypes.bool,
    footerBtnHtml: PropTypes.element,
    bordered: PropTypes.bool,
    innerType: PropTypes.oneOf(["inner",""]) // 枚举
  };

  // 定义默认值
  static defaultProps = {
    panelHeader: true,
    headerBtnHtml: undefined,
    title: "",
    panelFooter: false,
    footerBtnHtml: undefined,
    innerType: "",
    bordered: false
  };

  render() {
    const {
      panelHeader,
      title,
      children,
      headerBtnHtml,
      panelFooter,
      footerBtnHtml,
      innerType,
      bordered
    } = this.props;
    return (
      <div>
        {panelHeader ? (
          <Card
            title={title}
            type={innerType}
            bordered={bordered}
            extra={headerBtnHtml}
          >
            {children}
          </Card>
        ) : (
          <Card bordered={false}>{children}</Card>
        )}

        {panelFooter && footerBtnHtml && (
          <div className="footer-p fill-base">{footerBtnHtml}</div>
        )}
      </div>
    );
  }
}

export default Panel;
