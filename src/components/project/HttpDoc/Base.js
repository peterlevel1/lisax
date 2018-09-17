import styles from './Base.less';
import { Form, Input, Select, Row, Col } from 'antd';
import { REQUEST_METHODS } from '../../../utils/constants';

export default function Base({ form, data, formItemLayout, formItemLayout2 }) {
  const { getFieldDecorator } = form;

  return (
    <header className={styles.base}>
      <h3>基本信息</h3>
      <Row>
        <Col span={6}>
          <Form.Item {...formItemLayout} label='方法'>
            {
              getFieldDecorator('requestMethod', {
                initialValue: data.requestMethod,
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
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item {...formItemLayout2} label='路径'>
            {
              getFieldDecorator('requestUrl', {
                initialValue: data.requestUrl,
              })(
                <Input />
              )
            }
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item {...formItemLayout2} label='简述'>
            {
              getFieldDecorator('desc', {
                initialValue: data.desc,
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
