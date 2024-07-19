import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Input,
  Modal,
  Button,
  Form,
  Tooltip,
  Select,
  message,
} from "antd";
import axios from "axios";
import { RiEditLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import AppContext from "../../context/AppContext.jsx";
import Ring from "../../components/loader/Ring.jsx";
import Details from "./Details.jsx";

const { Option } = Select;

const Suppliers = () => {
  const { authToken, user } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position] = useState("start");
  const [dataSource, setDataSource] = useState([]);
  const [modalTitle, setModalTitle] = useState("Add New Supplier");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [getInfo, setGetInfo] = useState(false);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    house_number: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    goods: "",
  });

  const goodsOptions = ["product_id_1", "product_id_2", "product_id_3"];

  const fields = [
    {
      id: "first_name",
      placeholder: "First Name",
      type: "text",
      value: formData.first_name,
    },
    {
      id: "last_name",
      placeholder: "Last Name",
      type: "text",
      value: formData.last_name,
    },
    {
      id: "email",
      placeholder: "Email",
      type: "email",
      value: formData.email,
    },
    {
      id: "phone",
      placeholder: "Phone",
      type: "text",
      value: formData.phone,
    },
    {
      id: "house_number",
      placeholder: "House Number",
      type: "text",
      value: formData.house_number,
    },
    {
      id: "street",
      placeholder: "Street",
      type: "text",
      value: formData.street,
    },
    {
      id: "landmark",
      placeholder: "Landmark",
      type: "text",
      value: formData.landmark,
    },
    {
      id: "city",
      placeholder: "City",
      type: "text",
      value: formData.city,
    },
    {
      id: "state",
      placeholder: "State",
      type: "text",
      value: formData.state,
    },
    {
      id: "country",
      placeholder: "Country",
      type: "text",
      value: formData.country,
    },
    {
      id: "goods",
      placeholder: "Goods",
      type: "select",
      value: formData.goods,
    },
  ];

  const columns = [
    {
      key: "1",
      title: "S/N",
      render: (_, record, index) => index + 1,
      width: 50, // Adjust width as needed
    },
    {
      key: "2",
      title: "Supplier ID",
      dataIndex: "supplier_id",
      // width: 150, // Adjust width as needed
    },
    {
      key: "3",
      title: "First Name",
      dataIndex: "first_name",
      // width: 150, // Adjust width as needed
    },
    {
      key: "4",
      title: "Last Name",
      dataIndex: "last_name",
      // width: 150, // Adjust width as needed
    },
    {
      key: "5",
      title: "Email",
      dataIndex: "email",
      // width: 400, // Increase width for description
    },
    {
      key: "6",
      title: "Phone",
      dataIndex: "phone",
      // width: 400, // Increase width for description
    },
    {
      key: "7",
      title: "House Number",
      dataIndex: "house_number",
      // width: 400, // Increase width for description
    },
    {
      key: "8",
      title: "Street",
      dataIndex: "street",
      // width: 400, // Increase width for description
    },
    {
      key: "9",
      title: "Landmark",
      dataIndex: "landmark",
      // width: 400, // Increase width for description
    },
    {
      key: "10",
      title: "City",
      dataIndex: "city",
      // width: 400, // Increase width for description
    },
    {
      key: "11",
      title: "Country",
      dataIndex: "country",
      // width: 400, // Increase width for description
    },
    {
      key: "12",
      title: "Status",
      dataIndex: "status",
      // width: 400, // Increase width for description
    },
    {
      key: "13",
      title: "Action",
      dataIndex: "action",
      width: 30, // Reduce width for action
      render: (_, record) => {
        return (
          <div className="flex gap-2">
            <Tooltip placement="bottom" title={"Edit Supplier"}>
              <RiEditLine
                size={20}
                className="cursor-pointer text-green-700"
                onClick={() => onEdit(record)}
              />
            </Tooltip>

            <Tooltip placement="bottom" title={"View Supplier"}>
              <FaRegEye
                size={20}
                className="cursor-pointer"
                onClick={() => onView(record)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onView = (record) => {
    setGetInfo(true);
    setSelectedSupplier(record);
    // console.log(record.supplier_id)
  };

  const onClose = () => {
    setGetInfo(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleInputChange = (e, fieldId) => {
    setFormData({
      ...formData,
      [fieldId]: e.target ? e.target.value : e,
    });
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const addNewRecord = async () => {
    setIsLoading(true);

    try {
      const requestData = {
        ...formData,
      };
      const response = await axios.post(
        `https://cashify-wzfy.onrender.com/api/v1/suppliers`,
        requestData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );
      console.log(response);
      message.success("Supplier added successfully");
      handleCancel();
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        house_number: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        country: "",
        goods: "",
      });
    } catch (error) {
      console.error("Error while adding new record:", error);
      message.error("Failed to add supplier");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://cashify-wzfy.onrender.com/api/v1/suppliers/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );
      const newData = response.data.data.suppliers.map((supplier) => ({
        ...supplier,
        first_name: supplier.first_name,
        last_name: supplier.last_name,
        phone: supplier.phone,
        house_number: supplier.address.house_number,
        street: supplier.address.street,
        landmark: supplier.address.landmark,
        city: supplier.address.city,
        country: supplier.address.country,
        status: supplier.status,
      }));
      message.success("Success");
      // console.log(newData)
      setDataSource(newData);
    } catch (error) {
      message.error("Fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [authToken]);

  const onEdit = (record) => {
    setModalTitle("Edit Staff");
    setIsModalOpen(true);
    setFormData({
      id: record.id,
      phone: record.phone,
      email: record.email,
      house_number: record.address?.house_number || "",
      street: record.address?.street || "",
      landmark: record.address?.landmark || "",
      city: record.address?.city || "",
      country: record.address?.country || "",
      goodsOptions: ["product_id", "product_id"],
    });
    form.setFieldsValue({
      ...formData,
      id: record.id,
      status: record.status,
    });
  };

  return (
    <div className="p-4 relative top-14">
      <div className="flex justify-between mt-5">
        <p className="font-bold">Supplier Information</p>
        <Button
          type="button"
          onClick={showModal}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-plus-circle-fill mr-4 mb-1"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
          </svg>
          Add Supplier
        </Button>
      </div>

      <Modal open={getInfo} onCancel={onClose} footer={null}>
        <Details supplierId={selectedSupplier?.supplier_id} type="supplier" />
      </Modal>

      <Modal
        title={modalTitle}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          handleCancel();
          setFormData({
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            house_number: "",
            street: "",
            landmark: "",
            city: "",
            state: "",
            country: "",
            goods: "",
          });
        }}
      >
        <Form
          form={form}
          name="supplierForm"
          initialValues={formData}
          onFinish={addNewRecord}
          layout="vertical"
        >
          <div className="grid grid-cols-2 gap-4">
            {fields
              .filter(
                (field) =>
                  !(
                    modalTitle === "Edit Staff" &&
                    ["first_name", "last_name", "state"].includes(field.id)
                  )
              )
              .map((field) => (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={field.label}
                  rules={[
                    {
                      required: true,
                      message: `Please input your ${field.placeholder}!`,
                    },
                  ]}
                >
                  {field.type === "select" ? (
                    <Select
                      placeholder={field.placeholder}
                      onChange={(value) => handleInputChange(value, field.id)}
                    >
                      {goodsOptions.map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      placeholder={field.placeholder}
                      type={field.type}
                      onChange={(e) => handleInputChange(e, field.id)}
                    />
                  )}
                </Form.Item>
              ))}
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-700"
              loading={isLoading}
              iconposition={position}
              value="end"
              style={{ outline: "none" }}
            >
              {isLoading ? "Please wait..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {isLoading || dataSource.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <Ring />
        </div>
      ) : (
        // Display table when not loading
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          size="middle"
        />
      )}
    </div>
  );
};

export default Suppliers;
