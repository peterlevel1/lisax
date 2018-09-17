import styles from './RequestParams.less';
import { Form, Table, Button, Input, Icon, Checkbox, Select } from 'antd';
import { REQUEST_PARAM_TYPES } from '../../../utils/constants';
import { getUniqueId, addKey, isIndentType } from '../../../utils/common';

const COLUMNS_REQUEST_PARAMS = addKey([
  {
    width: 120,
    title: '操作',
    dataIndex: '_op',
    render(text, record, index) {
      const { addRequestParam, delRequestParam } = record._methods;

      // console.log('record.type: ', record.type, /^object|array[object]$/.test(record.type));
      if (isIndentType(record.type)) {
        return (
          <Button.Group size='small'>
            <Button onClick={() => addRequestParam(record.key)}><Icon type='plus' /></Button>
            <Button onClick={() => delRequestParam(record.key)}><Icon type='minus' /></Button>
          </Button.Group>
        );
      }

      return <Button size='small' onClick={() => delRequestParam(record.key)}><Icon type='minus' /></Button>
    }
  },
  {
    width: 200,
    title: '参数名称',
    dataIndex: 'name',
    render(text, record, index) {
      const { getFieldDecorator, getNameIndent } = record._methods;
      const style = { paddingLeft: 11 + 16 * record._nameIndent };

      return (
        <Form.Item>
          {
            getFieldDecorator(`requestParams-${record.key}-name`, {
              initialValue: record.name
            })(
              <Input style={style} />
            )
          }
        </Form.Item>
      );
    }
  },
  {
    width: 100,
    title: '是否必须',
    dataIndex: 'required',
    render(text, record, index) {
      const { getFieldDecorator } = record._methods;

      return (
        <Form.Item>
          {
            getFieldDecorator(`requestParams-${record.key}-required`, {
              initialValue: record.required,
              valuePropName: 'checked'
            })(
              <Checkbox />
            )
          }
        </Form.Item>
      );
    }
  },
  {
    width: 200,
    title: '类型',
    dataIndex: 'type',
    render(text, record, index) {
      const { getFieldDecorator, onChangeTableItemType } = record._methods;

      return (
        <Form.Item>
          {
            getFieldDecorator(`requestParams-${record.key}-type`, {
              initialValue: record.type
            })(
              <Select style={{ width: 150 }} onChange={onChangeTableItemType('requestParams')}>
                {
                  REQUEST_PARAM_TYPES.map(value => (
                    <Select.Option key={value} value={value}>{value}</Select.Option>
                  ))
                }
              </Select>
            )
          }
        </Form.Item>
      );
    }
  },
  {
    width: 200,
    title: '默认值',
    dataIndex: 'defaultValue',
    render(text, record, index) {
      const { getFieldDecorator } = record._methods;

      return (
        <Form.Item>
          {
            getFieldDecorator(`requestParams-${record.key}-defaultValue`, {
              initialValue: record.defaultValue
            })(
              <Input />
            )
          }
        </Form.Item>
      );
    }
  },
  {
    width: 200,
    title: '描述',
    dataIndex: 'desc',
    render(text, record, index) {
      const { getFieldDecorator } = record._methods;

      return (
        <Form.Item>
          {
            getFieldDecorator(`requestParams-${record.key}-desc`, {
              initialValue: record.desc
            })(
              <Input />
            )
          }
        </Form.Item>
      );
    }
  },
]);

export default function RequestParams({ form, data, addRequestParam, delRequestParam, getNameIndent, onChangeTableItemType }) {
  const { getFieldDecorator } = form;
  const dataSource = data.requestParams.map(one => {
    const item = { ...one };
    item._methods = { getFieldDecorator, addRequestParam, delRequestParam, getNameIndent, onChangeTableItemType };
    return item;
  });

  return (
    <section className={styles.container}>
      <h3>请求参数</h3>
      <Table
        bordered
        columns={COLUMNS_REQUEST_PARAMS}
        dataSource={dataSource}
        pagination={false}
      />
      <footer>
        <Button size='small' onClick={() => addRequestParam()}><Icon type='plus' /></Button>
      </footer>
    </section>
  )
}
