import styles from './Base.less';
import { Form, Input, Select, Row, Col } from 'antd';
import { REQUEST_METHODS } from '../../../utils/constants';

export default function Base({ form, data, formItemLayout, formItemLayout2 }) {
  const { getFieldDecorator } = form;

  return (
    <header className={styles.base}>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item {...formItemLayout} label='方法'>
            {
              getFieldDecorator('request-method', {
                initialValue: data.request.method,
              })(
                <Select style={{ width: '100%' }}>
                  {
                    REQUEST_METHODS.map((value, i) => (
                      <Select.Option key={value} value={value}>{value}</Select.Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item {...formItemLayout2} label='路径'>
            {
              getFieldDecorator('request-url', {
                initialValue: data.request.url,
              })(
                <Input />
              )
            }
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...formItemLayout2} label='简述'>
            {
              getFieldDecorator('request-desc', {
                initialValue: data.request.desc,
              })(
                <textarea className={styles.desc} />
              )
            }
          </Form.Item>
        </Col>
      </Row>
    </header>
  );
}
