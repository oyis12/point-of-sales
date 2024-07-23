import React, { useEffect, useState, useContext } from "react";
import { Table, Input, Modal, Button, Form, Tooltip, message } from "antd";
import axios from "axios";
import { RiEditLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import AppContext from "../../context/AppContext.jsx";
import Ring from "../../components/loader/Ring.jsx";

const { TextArea } = Input;

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedInData, setLoggedInData] = useState({ user: null, token: "" });
  // const [categories, setCategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  // const [currentDate, setCurrentDate] = useState(new Date());
  const [modalTitle, setModalTitle] = useState("Add New Category");
  const [isLoading, setIsLoading] = useState(false);
  const [position] = useState("start");
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const { authToken, user } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFormData({
      name: "",
      description: "",
    });
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [loggedInData]);

  const handleInputChange = (e, fieldId) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldId]: value,
    }));
  };

  const columns = [
    {
      key: "1",
      title: "S/N",
      render: (_, record, index) => index + 1,
      width: 50, // Adjust width as needed
    },
    {
      key: "2",
      title: "Category ID",
      dataIndex: "category_id",
      width: 150, // Adjust width as needed
    },
    {
      key: "3",
      title: "Name",
      dataIndex: "name",
      width: 150, // Adjust width as needed
    },
    {
      key: "4",
      title: "Description",
      dataIndex: "description",
      width: 400, // Increase width for description
    },
    {
      key: "5",
      title: "Action",
      dataIndex: "action",
      width: 30, // Reduce width for action
      render: (_, record) => {
        return (
          <div className="flex gap-2">
            <Tooltip placement="bottom" title={"Edit Category"}>
              <RiEditLine
                size={20}
                className="cursor-pointer text-green-700"
                onClick={() => onEdit(record)}
              />
            </Tooltip>

            <Tooltip placement="bottom" title={"View Category"}>
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

  const fields = [
    {
      id: "name",
      label: "Category Name",
      placeholder: "Category Name",
      type: "text",
      value: formData.name,
    },
    {
      id: "description",
      label: "Category Description",
      placeholder: "Category Description",
      type: "textarea",
      value: formData.description,
    },
  ];

  const addNewRecord = async () => {
    setIsLoading(true);

    try {
      const requestData = {
        ...formData,
      };
      const response = await axios.post(
        `https://cashify-wzfy.onrender.com/api/v1/categories`,
        requestData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );

      if (response?.data.code === 600) {
        message.success(response.data.msg);
        fetchData();
        form.resetFields();
        setFormData({
          name: "",
          description: "",
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.log("Error while adding new record:", error);
    }

    setIsLoading(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://cashify-wzfy.onrender.com/api/v1/categories/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );

      const newData = response.data.data.products_categories.map(
        (category) => ({
          ...category,
          key: category.category_id,
          category_id: category.category_id,
          name: category.name,
          description: category.description,
        })
      );

      setDataSource(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onEdit = (record) => {
    setFormData({
      name: record.name,
      description: record.description,
    });
    setModalTitle("Edit Category");
    setIsModalOpen(true);
    setEditIndex(record.key);
  };

  const onView = (record) => {
    console.log("View record:", record);
    // Implement the view functionality
  };

  return (
    <div className="p-4 relative top-14">
      <div className="flex justify-between mt-5">
        <p className="font-bold">Product Category List</p>
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
          Add Category
        </Button>
      </div>

      <div className="mt-4">
        <div className="relative overflow-x-auto shadow-md">
          <header className="App-header">
            <Modal
              title={modalTitle}
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
            >
              <Form
                form={form}
                name="storeForm"
                initialValues={formData}
                onFinish={addNewRecord}
              >
                {fields.map((field) => (
                  <Form.Item
                    key={field.id}
                    name={field.id}
                    rules={[
                      {
                        required: true,
                        message: `Please input your ${field.placeholder}!`,
                      },
                    ]}
                  >
                    {field.type === "textarea" ? (
                      <TextArea
                        placeholder={field.placeholder}
                        value={formData[field.id]}
                        onChange={(e) => handleInputChange(e, field.id)}
                      />
                    ) : (
                      <Input
                        placeholder={field.placeholder}
                        type={field.type}
                        value={formData[field.id]}
                        onChange={(e) => handleInputChange(e, field.id)}
                      />
                    )}
                  </Form.Item>
                ))}
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

            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <Ring />
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                size="middle"
              />
            )}
          </header>
        </div>
      </div>
    </div>
  );
};

export default Category;
