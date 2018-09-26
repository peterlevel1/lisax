import { Component } from 'react';
import styles from '../styles/login.less';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@connect()
@Form.create()
class Login extends Component {

  onSubmit = () => {
    const { form } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const params = { ...values, rememberme: 0 };

      this.props.dispatch({
        type: 'app/login',
        payload: params
      });

    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h1>用户登录</h1>
          </header>
          <Form className={styles.form}>
            <FormItem {...formItemLayout} label='用户名'>
              {
                getFieldDecorator('username', {
                  rules: [
                    { required: true, message: '必填' },
                    { max: 30, message: '最多不超过30个字符' }
                  ]
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label='密码'>
              {
                getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '必填' },
                    { max: 20, message: '最多不超过20个字符' }
                  ]
                })(
                  <Input type='password' />
                )
              }
            </FormItem>
            <FormItem wrapperCol={{ span: 14, offset: 6 }}>
              <Button type='primary' onClick={this.onSubmit}>确定</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

export default Login;
