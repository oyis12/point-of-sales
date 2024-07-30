import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Input,
  Modal,
  Button,
  Form,
  Row,
  Col,
  Select,
  Tooltip,
  Checkbox,
  message,
} from "antd";
import { RiEditLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { MdAssignmentReturn } from "react-icons/md";
import axios from "axios";
import Details from "./Details";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext.jsx";
import Ring from "../../components/loader/Ring.jsx";

const { Option } = Select;

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getInfo, setGetInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("Create New Staff");
  const [dataSource, setDataSource] = useState([]);
  const [staffDetails, setStaffDetail] = useState({});
  const [assignModal, setAssignModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();
  const { authToken, user } = useContext(AppContext);

  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    avatar: "",
    phone: "",
    email: "",
    house_number: "",
    street: "",
    landmark: "",
    city: "",
    country: "",
    avatar: "",
    role: "",
    password: "",
    retypePassword: "",
    status: "",
  });

  const roleOptions = [
    { label: "Select role", value: "" },
    { label: "Products Manager", value: "stock_manager" },
    { label: "Store Manager", value: "shop_manager" },
    { label: "Cashier", value: "cashier" },
  ];

  const statusOptions = [
    { label: "Select status", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Relieved", value: "relieved" },
    { label: "Suspended", value: "suspended" },
  ];

  const columns = [
    {
      key: "1",
      title: "S/N",
      render: (_, record, index) => index + 1,
    },
    {
      key: "2",
      title: "Staff ID",
      dataIndex: "id",
    },
    {
      key: "6",
      title: "Image",
      dataIndex: "avatar",
      className:"flex justify-center",
      render: (avatar) => <img src={avatar} alt="Product" style={{ width: 50, height: 50 }}/>,
    },
    {
      key: "3",
      title: "Staff ID",
      dataIndex: "id",
    },
    {
      key: "4",
      title: "First Name",
      dataIndex: "first_name",
    },
    {
      key: "5",
      title: "Last Name",
      dataIndex: "last_name",
    },
    {
      key: "6",
      title: "Status",
      dataIndex: "status",
    },
    {
      key: "7",
      title: "Role",
      dataIndex: "role",
    },
    {
      key: "8",
      title: "Assigned Store ?",
      dataIndex: "assigned",
      render: (assigned) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Checkbox checked={assigned} readOnly />
        </div>
      ),
    },
    {
      key: "9",
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex gap-5">
          <Tooltip placement="bottom" title="Edit Profile">
            <RiEditLine
              size={20}
              className="cursor-pointer text-green-700 ml-4"
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          <Tooltip placement="bottom" title="View Profile">
            <FaRegEye
              size={20}
              className="cursor-pointer"
              onClick={() => onView(record)}
            />
          </Tooltip>

          <Tooltip placement="bottom" title="Assign Staff">
            <MdAssignmentReturn
              size={20}
              className="cursor-pointer"
              onClick={() => onAssign(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    form.setFieldsValue(formData);
    assignForm.setFieldsValue();
  }, [formData, form]);

  useEffect(() => {
    user;
    authToken;
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://cashify-wzfy.onrender.com/api/v1/staffs/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );

      const newData = response.data.data.company_staffs.map((staff) => ({
        ...staff,
        id: staff.id,
        first_name: staff.first_name,
        last_name: staff.last_name,
        phone: staff.phone,
        email: staff.email,
        avatar: staff.avatar,
        role: staff.previleges.includes(112)
          ? "products manager"
          : staff.previleges.includes(113)
          ? "store manager"
          : staff.previleges.includes(114)
          ? "cashier"
          : "user",
        status: staff.status || "inactive",
        assigned: staff.office && Object.keys(staff.office).length > 0,
      }));
      setDataSource(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      id: "",
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
      status: "",
      avatar: "",
    });
  };

  const onEdit = (record) => {
    setModalTitle("Edit Staff");
    setIsModalOpen(true);
    setFormData({
      id: record.id,
      first_name: record.first_name,
      last_name: record.last_name,
      house_number: record.address?.house_number || "",
      street: record.address?.street || "",
      landmark: record.address?.landmark || "",
      city: record.address?.city || "",
      country: record.address?.country || "",
      status: record.status || "",
      role: record.role || "",
      avatar: record.avatar?.avatar || "",
    });
    form.setFieldsValue({
      ...formData,
      id: record.id,
      status: record.status,
    });
  };

  const onView = (record) => {
    setGetInfo(true);
    setStaffDetail(record);
  };

  const onAssign = async (record) => {
    setAssignModal(true);
    const userID = record.id;
    setSelectedStaffId(userID);
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
      const storesData = response.data.data.stores || [];
      setStores(storesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStoreChange = (value) => {
    setSelectedStoreId(value);
  };
// console.log(selectedStoreId)
  const assignStaff = async () => {
    const loggedInData = user.company;

    if (!loggedInData || !selectedStaffId || !selectedStoreId || !authToken) {
      console.error("Missing required data");
      return;
    }

    const requestData = {
      store_id: selectedStoreId,
      staff_id: selectedStaffId,
    };

    try {
      setIsLoading(true);

      const response = await axios.put(
        // `https://cashify-wzfy.onrender.com/api/v1/staffs/assign?staff_id=${selectedStaffId}&store_id=${selectedStoreId}`,
        `https://cashify-wzfy.onrender.com/api/v1/staffs/assign?staff_id=${selectedStaffId}&store_id=${selectedStoreId}`,
        requestData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );

      setSelectedStaffId(null);
      setSelectedStoreId(null);
      setAssignModal(false);
      fetchData();
      message.success(response.data.msg);
    } catch (error) {
      console.error("Error:", error.response?.data?.msg || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseAssign = () => {
    setAssignModal(false);
    setSelectedStoreId(null);
    assignForm.resetFields();
  };

  const onClose = () => {
    setGetInfo(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (modalTitle === "Edit Staff") {
      await updateRecord();
    } else {
      await addNewRecord();
    }
    setIsLoading(false);
    setIsModalOpen(false);
  };

  const addNewRecord = async () => {
    console.log('first')
  }

  const updateRecord = async () => {
    const staffID = formData.id;
    try {
      const { id, ...requestData } = formData;
      const response = await axios.put(
        `https://cashify-wzfy.onrender.com/api/v1/staffs/${staffID}/update`,
        requestData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );

      if (response?.data?.code === 600) {
        fetchData();
      }
    } catch (error) {
      console.error("Error while updating record:", error);
    }
  };

  return (
    <div className="p-4 relative top-14">
      <div className="flex justify-between mt-5">
        <p className="font-bold">Staff Information</p>
        <Link
          to="createstaff"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Create User Account
        </Link>
      </div>

      <div className="mt-4">
        <div className="relative overflow-x-auto shadow-sm">
          <header className="App-header">
            <Modal width={500} open={getInfo} onCancel={onClose} footer={null}>
              <Details staffId={staffDetails?.id} type="user" />
            </Modal>

            <Modal
              open={assignModal}
              onCancel={onCloseAssign}
              footer={null}
              title="Assign Staff"
            >
              <Form
                onFinish={assignStaff}
                form={assignForm}
                name="storeForm"
                initialValues={{ store_id: "" }}
              >
                <Form.Item>
                  <Select
                    onChange={handleStoreChange}
                    placeholder="Select a store"
                    value={selectedStoreId}
                    style={{ width: "100%" }}
                  >
                    <Option value="">Select a store</Option>
                    {stores && stores.length > 0 ? (
                      stores.map((store) => (
                        <Option key={store.id} value={store.id}>
                          {store.id} - {store.address.city}
                        </Option>
                      ))
                    ) : (
                      <Option value="">Select a store</Option>
                    )}
                  </Select>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-700"
                  loading={isLoading}
                >
                  {isLoading ? "Please wait..." : "Submit"}
                </Button>
              </Form>
            </Modal>

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
                onFinish={handleSubmit}
              >
                <Row gutter={16}>
                  {Object.keys(formData).map((field) =>
                    field === "role" || field === "status" ? (
                      <Col span={12} key={field}>
                        <Form.Item
                          name={field}
                          rules={[
                            {
                              required: true,
                              message: `Please select a ${field.replace(
                                "_",
                                " "
                              )}!`,
                            },
                          ]}
                        >
                          <Select
                            placeholder={field.replace("_", " ")}
                            value={formData[field]}
                            onChange={(value) =>
                              handleInputChange(field, value)
                            }
                          >
                            {(field === "role"
                              ? roleOptions
                              : statusOptions
                            ).map((option) => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    ) : (
                      <Col span={12} key={field}>
                        <Form.Item
                          name={field}
                          rules={[
                            {
                              required: true,
                              message: `Please input your ${field.replace(
                                "_",
                                " "
                              )}!`,
                            },
                          ]}
                        >
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
                            disabled={
                              field === "id" && modalTitle === "Edit Staff"
                            }
                          />
                        </Form.Item>
                      </Col>
                    )
                  )}
                </Row>
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
              </Form>
            </Modal>

            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <Ring />
              </div>
            ) : dataSource.length === 0 ? (
              <div className="text-center text-gray-500 mt-4 h-96 flex justify-center items-center">No data available</div>
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
        {/* <Outlet /> */}
      </div>
    </div>
  );
};

export default Users;
