import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';

const CreateRecordModal = ({ visible, addNewRecord, onCancel }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    addNewRecord(values);
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title="Create New Record"
      okText="Create"
      cancelText="Cancel"
      okType='dashed'
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onFinish(values);
        });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="storeLocation"
          label="Store Location"
          rules={[{ required: true, message: 'Please enter store location' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="noProduct"
          label="No of Product"
          rules={[{ required: true, message: 'Please enter number of product' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="costVAlue"
          label="Cost value"
          rules={[{ required: true, message: 'Please enter cost value of the store' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sellingValue"
          label="Selling value"
          rules={[{ required: true, message: 'Please enter selling value of the store' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the description' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateRecordModal