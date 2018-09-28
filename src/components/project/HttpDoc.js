import { Component } from 'react';
import styles from './HttpDoc.less';
import { Form, Button, Icon } from 'antd';
import { findIndex, getUniqueId, isIndentType } from '../../utils/common';
import Base from './HttpDoc/Base';
import TableParams from './HttpDoc/TableParams';

const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 }, };
const formItemLayout2 = { labelCol: { span: 4 }, wrapperCol: { span: 20 }, };

@Form.create({
  onValuesChange(props, values) {
    const data = props.data;

    Object.keys(values).forEach(itemKey => {
      const value = values[itemKey];
      const arr = itemKey.split('-');
      const [ a, b, c, d ] = arr;

      switch (arr.length) {
        case 2:
          data[a][b] = value;
        break;

        case 4:
          if (b === 'params') {
            const item = data[a].params.find(one => one.key === c);
            item[d] = value;
          }
        break;
      }
    });
  }
})
class HttpDoc extends Component {

  update() {
    this.props.onAction({ type: 'freshTree' });
  }

  onChangeItemType = (value) => {
    if (isIndentType(value)) {
      setTimeout(() => this.update(), 200);
    }
  }

  addParam = (key) => {
    const data = this.props.data;
    const keyArr = key.split('-');
    const params = data[keyArr[0]][keyArr[1]];
    const item = {
      key: getUniqueId(),
      name: '',
      required: false,
      type: '',
      defaultValue: '',
      desc: '',
      _nameIndent: 0
    };

    if (keyArr.length === 2) {
      params.push(item);
    } else {
      const index = params.findIndex(item => item.key === keyArr[2]);
      const target = params[index];

      item._nameIndent = target._nameIndent + 1;

      let start = index, len = params.length, end = index;
      while (++end < len) {
        if (params[end]._nameIndent < item._nameIndent) {
          break;
        }
      }

      params.splice(end, 0, item);
    }

    this.update();
  }

  delParam = (key) => {
    const data = this.props.data;
    const keyArr = key.split('-');
    const params = data[keyArr[0]][keyArr[1]];
    const index = params.findIndex(item => item.key === keyArr[2]);
    const target = params[index];

    if (!isIndentType(target.type)) {
      params.splice(index, 1);
      this.update();
      return;
    }

    let start = index, len = params.length, end = start;
    while (++end < len) {
      if (params[end]._nameIndent <= target._nameIndent) {
        break;
      }
    }

    data[keyArr[0]][keyArr[1]] = [ ...params.slice(0, start), ...params.slice(end, len) ];

    this.update();
  }

  getParamsItemMethods() {
    return {
      addParam: this.addParam,
      delParam: this.delParam,
      onChangeItemType: this.onChangeItemType,
      getFieldDecorator: this.props.form.getFieldDecorator
    };
  }

  render() {
    const commonProps = { ...this.props, formItemLayout, formItemLayout2 };
    const data = this.props.data;

    const dataSourceReq = data.request.params.map(one => {
      return { ...one, _methods: this.getParamsItemMethods() };
    });

    return (
      <Form className={styles.container}>
        <div>
          <h3>基本信息</h3>
          <Base {...commonProps} />
        </div>
        <div>
          <h3>REQUEST</h3>
          <TableParams {...commonProps} dataSource={dataSourceReq} prefix='request-params'  />
          <footer>
            <Button onClick={() => this.addParam('request-params')}>
              <Icon type='plus' />
            </Button>
          </footer>
        </div>
        <div>
          <h3>RESPONSE</h3>
        </div>
      </Form>
    );
  }
}

export default HttpDoc;
