import { Component } from 'react';
import styles from './HttpDoc.less';
import { Form, Button } from 'antd';
import { findIndex, getUniqueId } from '../../utils/common';
import Base from './HttpDoc/Base';
import RequestParams from './HttpDoc/RequestParams';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const formItemLayout2 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

@Form.create({
  onValuesChange(props, values) {
    Object.keys(values).forEach(key => {
      const value = values[key];
      const arr = key.split('-');

      switch (arr.length) {
        case 1:
          props.data[arr[0]] = value;
        break;

        case 3:
          if (arr[0] === 'requestParams') {
            const item = props.data.requestParams.find(one => one.key === arr[1]);
            item[arr[2]] = value;
          }
        break;
      }
    });
  }
})
class HttpDoc extends Component {
  render() {
    if (!this.props.data) {
      return null;
    }

    const commonProps = {
      ...this.props,
      formItemLayout,
      formItemLayout2,
    };
    window._form = this.props.form;

    return (
      <Form className={styles.container}>
        <Base {...commonProps} />
        <RequestParams {...commonProps} />
      </Form>
    );
  }
}

export default HttpDoc;
