import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
import axios from "axios";
import AppContext from "../../context/AppContext.jsx";
import { Divider, Input, Button, Form, Row, Col, Select, Checkbox } from "antd";

const CreateStaff = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const { authToken, user } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    house_number: "",
    street: "",
    landmark: "",
    city: "",
    country: "",
    role: "",
    password: "",
    retypePassword: "",
  });

  const roleOptions = [
    { label: "Select role", value: "" },
    { label: "Products Manager", value: "stock_manager" },
    { label: "Store Manager", value: "shop_manager" },
    { label: "Cashier", value: "cashier" },
  ];

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  useEffect(() => {
    user;
    authToken;
  }, []);

  const handleInputChange = (fieldId, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldId]: value,
    }));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      house_number: "",
      street: "",
      landmark: "",
      city: "",
      country: "",
      role: "",
      password: "",
      retypePassword: "",
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await addNewRecord();
    setIsLoading(false);
  };

  const addNewRecord = async () => {
    try {
      const requestData = {
        ...formData,
      };
      const response = await axios.post(
        `https://cashify-wzfy.onrender.com/api/v1/staffs`,
        requestData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );

      if (response?.data?.code === 600) {
        form.resetFields();
        setFormData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          house_number: "",
          street: "",
          landmark: "",
          city: "",
          country: "",
          role: "",
          password: "",
          retypePassword: "",
        });
        navigate("/dashboard/staffs");
      }
    } catch (error) {
      console.error("Error while adding new record:", error);
    }
  };
  return (
    <div className="p-10 relative flex justify-center items-center h-screen">
      <div className="relative shadow-sm ">
        <header className="App-header">
          <Form
            form={form}
            name="storeForm"
            initialValues={formData}
            onFinish={handleSubmit}
          >
            <Row gutter={[20]}>
              <Col xs={24} sm={24} md={16} lg={18} xl={18}>
                <Row gutter={16}>
                  {Object.keys(formData).map((field) => (
                    <Col span={12} key={field}>
                      <Form.Item
                        name={field}
                        rules={[
                          {
                            required: true,
                            message: `Please ${
                              field === "role" || field === "status"
                                ? "select"
                                : "input"
                            } your ${field.replace("_", " ")}!`,
                          },
                        ]}
                      >
                        {field === "role" || field === "status" ? (
                          <Select
                            placeholder={field.replace("_", " ")}
                            value={formData[field]}
                            onChange={(value) =>
                              handleInputChange(field, value)
                            }
                          >
                            {field === "role"
                              ? roleOptions.map((option) => (
                                  <Option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </Option>
                                ))
                              : null}
                          </Select>
                        ) : (
                          <Input
                            placeholder={field.replace("_", " ")}
                            type={
                              field === "password" || field === "retypePassword"
                                ? "password"
                                : "text"
                            }
                            value={formData[field]}
                            onChange={(e) =>
                              handleInputChange(field, e.target.value)
                            }
                          />
                        )}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                <div className="flex justify-end">
                  <div className="">
                    <Divider className="text-center font-bold mb-7">
                      Assign Previledge:
                    </Divider>
                    <Checkbox.Group style={{ width: "100%" }}>
                      <div className="flex flex-wrap">
                        <Checkbox
                          style={{ marginRight: "15px", marginBottom: "15px" }}
                          value="Option1"
                        >
                          can edit
                        </Checkbox>
                        <Checkbox
                          style={{ marginRight: "15px", marginBottom: "10px" }}
                          value="Option2"
                        >
                          can create
                        </Checkbox>
                        <Checkbox
                          style={{ marginRight: "15px", marginBottom: "10px" }}
                          value="Option3"
                        >
                          can see staff
                        </Checkbox>
                        <Checkbox
                          style={{ marginBottom: "15px" }}
                          value="Option4"
                        >
                          Assign role
                        </Checkbox>
                      </div>
                    </Checkbox.Group>
                  </div>
                </div>
              </Col>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-700"
                  loading={isLoading}
                >
                  {isLoading ? "Please wait..." : "Submit"}
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </header>
      </div>
    </div>
  );
};

export default CreateStaff;
