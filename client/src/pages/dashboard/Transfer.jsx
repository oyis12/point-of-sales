import React, { useState } from "react";
import { Select, Input, Button, Form } from "antd";

const Transfer = () => {
  const products = localStorage.getItem("products");
  const batches = localStorage.getItem("batches");
  const product = JSON.parse(products);
  const productNameOptions =
    products?.length > 0
      ? product.map((x) => ({
          value: x.productName,
          label: x.productName,
          id: x.id,
        }))
      : [];
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleChange = (value, option) => {
    setSelectedProductId(option.id);
  };

  const [form] = Form.useForm();

  const onFinish = (values) => {
    addNewRecord(values);
    form.resetFields();
  };

  const store_1 = [
    {
      value: "sahad",
      label: "Sahad",
    },
    {
      value: "h-medix",
      label: "H-medix",
    },
    {
      value: "kfc",
      label: "KFC",
    },
  ];

  const store_2 = [
    {
      value: "toyota",
      label: "Toyota",
    },
    {
      value: "apple",
      label: "Apple",
    },
    {
      value: "kfc",
      label: "KFC",
    },
  ];

  return (
    <div className="p-4 relative top-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2 text-2xl">Transfer from</h3>
          <Select
            defaultValue="Select Store"
            style={{
              width: "100%",
            }}
            onChange={handleChange}
            options={store_1}
          />
        </div>
        <div>
          <h3 className="font-bold mb-2 text-2xl">Transfer to</h3>
          <Select
            defaultValue="Select Store"
            style={{
              width: "100%",
            }}
            onChange={handleChange}
            options={store_2}
          />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-2xl text-center mt-10">Transfer details</h3>

        <div className="mt-8">
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
               <Form.Item>
               <Select
                  defaultValue="Select Product"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChange}
                  options={productNameOptions}
                />
               </Form.Item>
           
          
                <Form.Item>
                <Input
                  value={selectedProductId || ""}
                  disabled
                  placeholder="Prodcut ID"
                  style={{ background: "transparent", color: "#000000" }}
                />
                </Form.Item>
              
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item>
                <Input
                  placeholder="Product Quantity"
                  disabled
                  style={{ background: "transparent", color: "#000000" }}
                />
              </Form.Item>
              <Form.Item>
                <Input placeholder="Product Amount"
                  disabled
                  style={{ background: "transparent", color: "#000000" }}/>
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item>
                <Input
                  placeholder="Quantity to Transfer"
                  type="number"
                />
              </Form.Item>
              <Form.Item>
                <Input placeholder="Product Amount"
                  disabled
                  style={{ background: "transparent", color: "#000000" }}/>
              </Form.Item>
            </div>
            <Button  htmlType="submit">
                Transfer
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
