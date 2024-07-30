import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
import axios from "axios";
import AppContext from "../../context/AppContext.jsx";
import {
  Divider,
  Input,
  Button,
  Form,
  Row,
  Col,
  Select,
  Checkbox,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const CreateStaff = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const { authToken, user } = useContext(AppContext);
  const navigate = useNavigate();

  // const [formData, setFormData] = useState({
  //   first_name: "",
  //   last_name: "",
  //   phone: "",
  //   email: "",
  //   house_number: "",
  //   street: "",
  //   landmark: "",
  //   city: "",
  //   country: "",
  //   role: "",
  //   password: "",
  //   avatar: "",
  //   retypePassword: "",
  // });
  const fields = [
    {
      id: "first_name",
      label: "Last Name",
      placeholder: "First Name",
      type: "text",
    },
    {
      id: "last_name",
      label: "Last Name",
      placeholder: "Last Name",
      type: "text",
    },
    {
      id: "avatar",
      label: "avatar",
      placeholder: "Image",
      type: "file",
    },
    {
      id: "phone",
      label: "Phone",
      placeholder: "Phone",
      type: "text",
    },
    {
      id: "email",
      label: "Email",
      placeholder: "Email",
      type: "text",
    },
    {
      id: "house_number",
      label: "House Number",
      placeholder: "House Number",
      type: "text",
    },
    {
      id: "street",
      label: "Street",
      placeholder: "Street",
      type: "text",
    },
    {
      id: "landmark",
      label: "Landmark",
      placeholder: "Landmark",
      type: "text",
    },
    {
      id: "city",
      label: "City",
      placeholder: "City",
      type: "text",
    },
    {
      id: "country",
      label: "Country",
      placeholder: "Country",
      type: "text",
    },
    {
      id: "role",
      label: "Role",
      placeholder: "Role",
      type: "text",
    },
    {
      id: "password",
      label: "Password",
      placeholder: "Password",
      type: "password",
    },
    {
      id: "retypePassword",
      label: "Re-type Password",
      placeholder: "Re-type Password",
      type: "password",
    },
  ];

  const roleOptions = [
    { label: "Select role", value: "" },
    { label: "Products Manager", value: "products_manager" },
    { label: "Store Manager", value: "store_manager" },
    { label: "Cashier", value: "cashier" },
  ];

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [fields, form]);

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

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   form.resetFields();
  //   setFormData({
  //     first_name: "",
  //     last_name: "",
  //     phone: "",
  //     email: "",
  //     house_number: "",
  //     street: "",
  //     landmark: "",
  //     city: "",
  //     country: "",
  //     role: "",
  //     password: "",
  //     retypePassword: "",
  //   });
  // };

  const handleSubmit = async () => {
    setIsLoading(true);
    await addNewRecord();
    setIsLoading(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const addNewRecord = async () => {
    try {
      const requestData = form.getFieldsValue();

      const formData = new FormData();
      formData.append("first_name", requestData.first_name);
      formData.append("last_name", requestData.last_name);
      formData.append("phone", requestData.phone);
      formData.append("email", requestData.email);
      formData.append("house_number", requestData.house_number);
      formData.append("street", requestData.street);
      formData.append("landmark", requestData.landmark);
      formData.append("city", requestData.city);
      formData.append("country", requestData.country);
      formData.append("role", requestData.role);
      formData.append("password", requestData.password);
      formData.append("avatar", requestData.avatar);

      const response = await axios.post(
        `https://cashify-wzfy.onrender.com/api/v1/staffs`,
        formData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );

      if (response?.data?.code === 600) {
        form.resetFields();
        // setFormData({
        //   first_name: "",
        //   last_name: "",
        //   phone: "",
        //   email: "",
        //   house_number: "",
        //   street: "",
        //   landmark: "",
        //   city: "",
        //   country: "",
        //   role: "",
        //   password: "",
        //   avatar: "",
        //   retypePassword: "",
        // });
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
            // initialValues={formData}
            onFinish={handleSubmit}
          >
            <Row gutter={[20]}>
              <Col xs={24} sm={24} md={16} lg={18} xl={18}>
                <Row gutter={16}>
                  {Object.keys(fields).map((field) => (
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
