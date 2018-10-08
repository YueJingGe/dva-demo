import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';
const FormItem = Form.Item;

const UserItem = (props) => {
  const { record, form, ...rest} = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.onOk(record.id, values);
      }
    });
  }
  
  return (
    <Modal {...rest} onOk={handleSubmit}>
      <Form>
        <FormItem {...formItemLayout} label="name">
          {getFieldDecorator('name', {
            initialValue: record.name,
            rules: [{ required: true, message: 'Please input your name!' }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="email">
          {getFieldDecorator('email', {
            initialValue: record.email,
            rules: [{ required: true, message: 'Please input your E-mail!' }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="website">
          {getFieldDecorator('website', {
            initialValue: record.website,
            rules: [{ required: true, message: 'Please input your website!' }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="phone">
          {getFieldDecorator('phone', {
            initialValue: record.phone,
            rules: [{ required: true, message: 'Please input your phone!' }],
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};

UserItem.propTypes = {
  record: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Form.create()(UserItem);
