import styles from './TableParams.less';
import { Form, Table, Button, Input, Icon, Checkbox, Select } from 'antd';
import { REQUEST_PARAM_TYPES } from '../../../utils/constants';
import { getUniqueId, addKey, isIndentType } from '../../../utils/common';

function getColumns(prefix) {
  return addKey([
    {
      width: 120,
      title: '操作',
      dataIndex: '_op',
      render(text, item, index) {
        const { addParam, delParam } = item._methods;

        if (isIndentType(item.type)) {
          return (
            <Button.Group size='small'>
              <Button onClick={() => addParam(`${prefix}-${item.key}`)}><Icon type='plus' /></Button>
              <Button onClick={() => delParam(`${prefix}-${item.key}`)}><Icon type='minus' /></Button>
            </Button.Group>
          );
        }

        return <Button size='small' onClick={() => delParam(`${prefix}-${item.key}`)}><Icon type='minus' /></Button>
      }
    },
    {
      width: 200,
      title: '参数名称',
      dataIndex: 'name',
      render(text, item, index) {
        const { getFieldDecorator } = item._methods;
        const style = { paddingLeft: 11 + 16 * item._nameIndent };

        return (
          <Form.Item>
            {
              getFieldDecorator(`${prefix}-${item.key}-name`, {
                initialValue: item.name
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
      render(text, item, index) {
        const { getFieldDecorator } = item._methods;

        return (
          <Form.Item>
            {
              getFieldDecorator(`${prefix}-${item.key}-required`, {
                initialValue: item.required,
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
      render(text, item, index) {
        const { getFieldDecorator, onChangeItemType } = item._methods;

        return (
          <Form.Item>
            {
              getFieldDecorator(`${prefix}-${item.key}-type`, {
                initialValue: item.type
              })(
                <Select style={{ width: 150 }} onChange={onChangeItemType}>
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
      render(text, item, index) {
        const { getFieldDecorator } = item._methods;

        return (
          <Form.Item>
            {
              getFieldDecorator(`${prefix}-${item.key}-defaultValue`, {
                initialValue: item.defaultValue
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
      render(text, item, index) {
        const { getFieldDecorator } = item._methods;

        return (
          <Form.Item>
            {
              getFieldDecorator(`${prefix}-${item.key}-desc`, {
                initialValue: item.desc
              })(
                <Input />
              )
            }
          </Form.Item>
        );
      }
    },
  ]);
}

export default function TableParams({ dataSource, prefix }) {
  return (
    <section className={styles.container}>
      <Table
        bordered
        columns={getColumns(prefix)}
        dataSource={dataSource}
        pagination={false}
      />
    </section>
  );
}
