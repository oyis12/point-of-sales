import React, { useEffect, useState, useContext } from "react";
import { Table, Input, Modal, Button, Form, message } from "antd";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import AppContext from "../../context/AppContext.jsx";
import axios from "axios";
import Ring from "../../components/loader/Ring.jsx";

const Store = () => {
  const [modalTitle, setModalTitle] = useState("Create New Store");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position] = useState("start");
  const [dataSource, setDataSource] = useState([]);
  const { authToken } = useContext(AppContext);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    house_number: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
  });

  const showModal = () => {
    setModalTitle("Create New Store");
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleInputChange = (e, fieldId) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldId]: value,
    }));
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://cashify-wzfy.onrender.com/api/v1/stores/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );
      const newData = response.data.data.stores.map((store) => ({
        ...store,
        house_number: store.address.house_number,
        street: store.address.street,
        landmark: store.address.landmark,
        city: store.address.city,
        state: store.address.state,
        country: store.address.country,
        status: store.status,
      }));

      setDataSource(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authToken]);

  const addNewRecord = async () => {
    setIsLoading(true);

    try {
      const requestData = {
        ...formData,
      };
      const response = await axios.post(
        `https://cashify-wzfy.onrender.com/api/v1/stores`,
        requestData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );

      if (response?.data?.code === 600) {
        message.success(response.data.msg);
        fetchData();
      }
      handleCancel();
      setFormData({
        house_number: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        country: "",
      });
    } catch (error) {
      message.error("Error while adding new record", error);

      console.error("Error while adding new record:", error);
    }
    setIsLoading(false);
  };

  const fields = [
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
  ];

  const columns = [
    {
      key: "1",
      title: "S/N",
      render: (_, record, index) => index + 1,
    },
    {
      key: "2",
      title: "House Number",
      dataIndex: "house_number",
    },
    {
      key: "2",
      title: "Street",
      dataIndex: "street",
    },
    {
      key: "3",
      title: "landmark",
      dataIndex: "landmark",
    },
    {
      key: "4",
      title: "City",
      dataIndex: "city",
    },
    {
      key: "5",
      title: "State",
      dataIndex: "state",
    },
    {
      key: "6",
      title: "Country",
      dataIndex: "country",
    },
    {
      key: "7",
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "";
        let textColor = "";
        let textSize = "";
        let textCenter = "";
        if (status === "open") {
          color = "green";
          textColor = "white";
          textCenter = "center";
          textSize = "15px";
        } else if (status === "closed") {
          color = "red";
          textColor = "white";
          textCenter = "center";
          textSize = "15px";
        } else {
          color = "gray";
          textColor = "white";
          textCenter = "center";
          textSize = "15px";
        }
        return {
          props: {
            style: {
              backgroundColor: color,
              color: textColor,
              textAlign: textCenter,
              fontSize: textSize,
            },
          },
          children: status,
        };
      },
    },
    {
      key: "8",
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <div className="flex gap-5">
            <RiDeleteBinLine
              size={20}
              className="cursor-pointer text-red-600"
              onClick={() => onDelete(record)}
            />
            <RiEditLine
              size={20}
              className="cursor-pointer text-green-700 ml-4"
              onClick={() => onEdit(record)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 relative top-14">
      <div className="flex justify-between mt-5">
        <p className="font-bold">Store Data</p>
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
          Add Store
        </Button>
      </div>
      {/* ANT TABLE STARTS */}
      <div className="mt-4">
        <div className="relative overflow-x-auto shadow-sm">
          <header className="App-header">
            <Modal
              title={modalTitle}
              open={isModalOpen}
              onCancel={() => {
                handleCancel();
                setFormData({
                  house_number: "",
                  street: "",
                  landmark: "",
                  city: "",
                  state: "",
                  country: "",
                });
              }}
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
                    <Input
                      placeholder={field.placeholder}
                      type={field.type}
                      onChange={(e) => handleInputChange(e, field.id)}
                    />
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
              // Display table when not loading
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
      {/* ANT TABLE ENDS */}
    </div>
  );
};

export default Store;
