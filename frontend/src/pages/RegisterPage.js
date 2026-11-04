import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { validateEmail, validateFullName, validatePassword, validatePasswordConfirmation, validateRole, validateUsername } from './registrationValidation';

const ruleFor = (validate) => ({
  validator: (_, value) => {
    const error = validate(value);
    return error ? Promise.reject(new Error(error)) : Promise.resolve();
  },
});

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await authService.register(values);
      message.success('Registration successful');
      navigate('/login');
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          (err.response ? 'Registration failed. Please check your details and try again.' : 'Cannot reach the server. Check that the backend is running and try again.')
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h2>Register Account</h2>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item name="fullName" label="Full Name" rules={[ruleFor(validateFullName)]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[ruleFor(validateEmail)]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label="Username" rules={[ruleFor(validateUsername)]}>
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Role" rules={[ruleFor(validateRole)]}>
          <Select placeholder="Choose your role">
            <Select.Option value="ROLE_DEVELOPER">Developer</Select.Option>
            <Select.Option value="ROLE_MANAGER">Manager</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[ruleFor(validatePassword)]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[({ getFieldValue }) => ruleFor((value) => validatePasswordConfirmation(getFieldValue('password'), value))]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Sign Up</Button>
      </Form>
    </div>
  );
};

export default RegisterPage;
