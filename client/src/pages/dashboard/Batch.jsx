import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext.jsx";
import axios from "axios";
import { RiEditLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { Table, Input, Modal, Button, Form, Tooltip, message } from "antd";

const Batch = () => {
  const { authToken, user } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [batches, setBatches] = useState([]);
  const [dataSource, setDataSource] = useState([])
  const [modalTitle, setModalTitle] = useState("Add Product Details");
  const [form] = Form.useForm();

  const test = localStorage.getItem("products");
  const parsedTest = JSON.parse(test);

  const productNames =
    test?.length > 0 ? parsedTest.map((x) => x.productName) : [];
  // const productIDs = parsedTest.map((x) => x.id);

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
      id: "productName",
      label: "Product Name",
      placeholder: "Select an option edited",
      type: "select",
      value: "",
      options: ["Select an option", ...productNames],
    },
    {
      id: "productID",
      label: "Product ID",
      placeholder: "Product ID",
      type: "text",
      value: "",
    },
    {
      id: "batchNumber",
      label: "Batch Number",
      placeholder: "Batch Number",
      type: "text",
      value: "",
    },
    {
      id: "quantity",
      label: "Quantity",
      placeholder: "Quantity",
      type: "text",
      value: "",
    },
    {
      id: "price",
      label: "Price",
      placeholder: "Price",
      type: "text",
      value: "",
    },
    {
      id: "mani_date",
      label: "Manifacturing Date",
      placeholder: "Manifacturing Date",
      type: "date",
      value: "",
    },
    {
      id: "ex_date",
      label: "Expairing Date",
      placeholder: "Expairing Date",
      type: "date",
      value: "",
    },
    {
      id: "sp_date",
      label: "Supply Date",
      placeholder: "Supply Date",
      type: "date",
      value: "",
    },
  ];

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

  const [formData, setFormData] = useState(fields);

  // const toggleModal = (visible, editMode = false) => {
  //   // setShowModal(visible);
  //   if (!visible) {
  //     setFormData(fields.map((field) => ({ ...field, value: "" })));
  //     setEditIndex(null);
  //     setModalTitle("Add Product Details");
  //   } else {
  //     setModalTitle(editMode ? "Edit Product Details" : "Add Product Details");
  //   }
  // };

  // const handleChange = (index, e) => {
  //   const updatedFormData = [...formData];
  //   updatedFormData[index].value = e;

  //   if (formData[index].id === "productName") {
  //     const productName = e;
  //     const matchingProduct = parsedTest.find(
  //       (product) => product.productName === productName
  //     );
  //     if (matchingProduct) {
  //       updatedFormData.find((field) => field.id === "productID").value =
  //         matchingProduct.id;
  //     }
  //   }

  //   setFormData(updatedFormData);
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newBatch = {};
  //   formData.forEach((field) => {
  //     newBatch[field.id] = field.value;
  //   });

  //   if (editIndex !== null) {
  //     newBatch.batchSerialNumber = batches[editIndex].batchSerialNumber;
  //     const updatedBatch = [...batches];
  //     updatedBatch[editIndex] = newBatch;
  //     setBatches(updatedBatch);
  //   } else {
  //     const productName = newBatch.productName;
  //     const productNameCount = batches.filter(
  //       (batch) => batch.productName === productName
  //     ).length;
  //     newBatch.batchSerialNumber = `${productName
  //       .substring(0, 3)
  //       .toUpperCase()}${productNameCount + 1}`;

  //     setBatches([...batches, newBatch]);
  //   }
  //   toggleModal(false);
  //   setFormData(fields.map((field) => ({ ...field, value: "" })));
  //   setEditIndex(null);
  // };

  // const handleEdit = (index) => {
  //   setEditIndex(index);
  //   setFormData(
  //     fields.map((field) => ({
  //       ...field,
  //       value: batches[index][field.id] || "",
  //     }))
  //   );
  //   setModalTitle("Edit Product Details");
  //   toggleModal(true, true);
  // };

  // const handleDelete = (index) => {
  //   if (window.confirm("Are you sure you want to delete this batch?")) {
  //     const updatedBatch = batches.filter((_, i) => i !== index);
  //     setBatches(updatedBatch);
  //   }
  // };

  return (
    <div className="p-4 relative top-14">
      <div className="flex justify-between mt-5">
        <p className="font-bold">Batch Details</p>
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
          Add Batch Details
        </Button>
      </div>

      <Modal
        title={modalTitle}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      />

      <div className="mt-4">
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          size="middle"
        />
      </div>
    </div>
  );
};

export default Batch;
