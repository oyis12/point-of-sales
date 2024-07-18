import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Modal,
  Button,
  Form,
  Select,
  message,
  Tooltip,
} from "antd";
import AppContext from "../../context/AppContext.jsx";
import { RiEditLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import Ring from "../../components/loader/Ring.jsx";

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openVariation, setOpenVariation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [form] = Form.useForm();
  const { authToken } = useContext(AppContext);

  const fields = [
    {
      id: "name",
      label: "Product Name",
      placeholder: "Product Name",
      type: "text",
    },
    {
      id: "product_type",
      label: "Product Type",
      placeholder: "Product Type",
      type: "text",
    },
    {
      id: "manufacturer",
      label: "Manufacturer",
      placeholder: "Manufacturer",
      type: "text",
    },
    {
      id: "description",
      label: "Product Description",
      placeholder: "Product Description",
      type: "textarea",
      className:
        "form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
    },
  ];

  const variation = [
    {
      id: "image",
      label: "Image",
      placeholder: "Image URL",
      type: "file",
    },
    {
      id: "size",
      label: "Size",
      placeholder: "Size",
      type: "text",
    },
    {
      id: "color",
      label: "Color",
      placeholder: "Color",
      type: "text",
    },
    {
      id: "weight",
      label: "Weight",
      placeholder: "Weight",
      type: "text",
    },
    {
      id: "alias",
      label: "Alias",
      placeholder: "Alias",
      type: "text",
    },
    {
      id: "bulk_type",
      label: "Bulk Type",
      placeholder: "Bulk Type",
      type: "text",
    },
    {
      id: "packaging",
      label: "Packaging",
      placeholder: "Packaging",
      type: "text",
    },
    {
      id: "other_details",
      label: "Other Details",
      placeholder: "Other Details",
      type: "textarea",
      className:
        "form-textarea textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const openModal = () => {
    setOpenVariation(true);
  };

  const closeModal = () => {
    setOpenVariation(false);
  };

  const columns = [
    {
      key: "1",
      title: "S/N",
      render: (_, __, index) => index + 1,
    },
    {
      key: "2",
      title: "Product ID",
      dataIndex: "product_id",
    },
    {
      key: "3",
      title: "Product Name",
      dataIndex: "name",
    },
    {
      key: "4",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "5",
      title: "Categories",
      dataIndex: "categories",
      render: (_, record) => {
        return (
          <div>
            {record.categories ? (
              record.categories.map((cat) => (
                <p key={cat.cat_id} className="text-sm">
                  {cat.name}
                </p>
              ))
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    // {
    //   key: "6",
    //   title: "Status",
    //   dataIndex: "status",
    // },
    {
      key: "7",
      title: "Action",
      dataIndex: "action",
      width: 30,
      render: (_, record) => (
        <div className="flex gap-5">
          <Tooltip placement="bottom" title="Edit Product">
            <RiEditLine
              size={20}
              className="cursor-pointer text-green-700 ml-4"
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          <Tooltip placement="bottom" title="View Product">
            <FaRegEye
              size={20}
              className="cursor-pointer"
              onClick={() => onView(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const getCategory = async () => {
    try {
      const response = await axios.get(
        `https://pos-wpvg.onrender.com/api/v1/categories/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = response.data.data;
      const categories = data.products_categories.map((category) => ({
        id: category.category_id,
        name: category.name,
      }));
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!authToken) return;
    getCategory();
  }, [authToken]);

  const options = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const addProduct = async () => {
    try {
      const requestData = form.getFieldsValue();
      const category_id = form.getFieldValue("category");

      const response = await axios.post(
        `https://pos-wpvg.onrender.com/api/v1/products/${category_id}`,
        requestData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response);
      message.success("Product added successfully");
      handleCancel();
      getAllProduct(); // Refresh the product list after adding
    } catch (error) {
      console.error("Error while adding new record:", error);
      message.error("Failed to add product");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await addProduct();
    setIsLoading(false);
  };

  const getAllProduct = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://pos-wpvg.onrender.com/api/v1/products/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const sourcedData = response.data.data.map((product) => ({
        key: product.product_id, // Add unique key prop here
        name: product.name,
        description: product.description,
        product_id: product.product_id,
        categories: product.categories, // Include categories field
      }));
      setDataSource(sourcedData);
    } catch (error) {
      console.error("Error while getting records:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const productByCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://pos-wpvg.onrender.com/api/v1/products/${categoryId}/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (Array.isArray(response.data.data.category_products)) {
        const sourcedData = response.data.data.category_products.map(
          (product) => ({
            key: product.product_id, // Add unique key prop here
            name: product.name,
            description: product.description,
            product_id: product.product_id,
          })
        );
        setDataSource(sourcedData.length > 0 ? sourcedData : []);
        if (sourcedData.length === 0) {
          message.info("No products found for this category");
        }
      } else {
        console.error(
          "Expected an array but got:",
          response.data.data.category_products
        );
      }
    } catch (error) {
      console.error("Error while getting records:", error);
    }
    setIsLoading(false);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategoryId(value);
    if (value) {
      if (value === "all") {
        getAllProduct();
      } else {
        productByCategory(value);
      }
    } else {
      getAllProduct();
    }
  };

  return (
    <div className="p-4 relative top-14">
      <div className="flex justify-between mt-5">
        <p className="font-bold">Products</p>

        <Select
          defaultValue="all"
          style={{ width: 240 }}
          onChange={handleCategoryChange}
          options={[{ value: "all", label: "All Categories" }, ...options]}
        />

        <div>
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
            Add Product
          </Button>
          <Button
            type="button"
            onClick={openModal}
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
            Add Variation
          </Button>
        </div>
      </div>
      {/* ANT TABLE STARTS */}
      <div className="mt-4">
        <div className="relative overflow-x-auto shadow-sm">
          <header className="App-header">
            {/* <Modal
              title="Add New Product"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
            >
              <Form
                form={form}
                name="productForm"
                onFinish={handleSubmit}
                initialValues={{
                  category: "",
                  ...fields.reduce(
                    (acc, field) => ({ ...acc, [field.id]: "" }),
                    {}
                  ),
                }}
              >
                <Form.Item
                  name="category"
                  rules={[
                    { required: true, message: "Please select a category!" },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={[
                      { value: "", label: "Please select a category" },
                      ...options,
                    ]}
                  />
                </Form.Item>
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
                    <Input placeholder={field.placeholder} type={field.type} />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-blue-700"
                    loading={isLoading}
                    style={{ outline: "none" }}
                  >
                    {isLoading ? "Please wait..." : "Submit"}
                  </Button>
                </Form.Item>
              </Form>
            </Modal> */}

            <Modal
              title="Add Product"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  loading={isLoading}
                  onClick={handleSubmit}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Add
                </Button>,
              ]}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit} // Assuming handleSubmit handles form submission
              >
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                >
                  <Select
                    placeholder="Select a category"
                    onChange={(value) => setSelectedCategoryId(value)}
                    options={options}
                  />
                </Form.Item>

                {fields.map((field) => (
                  <Form.Item
                    key={field.id}
                    name={field.id}
                    label={field.label}
                    rules={[
                      {
                        required: true,
                        message: `Please enter ${field.label.toLowerCase()}`,
                      },
                    ]}
                  >
                    {field.type === "textarea" ? (
                      <Input.TextArea
                        placeholder={field.placeholder}
                        className={field.className}
                      />
                    ) : (
                      <Input
                        placeholder={field.placeholder}
                        type={field.type}
                      />
                    )}
                  </Form.Item>
                ))}
              </Form>
            </Modal>

            {/* variation */}
            <Modal
      title="Add Product Variation"
      open={openVariation}
      onCancel={closeModal}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Add
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit} // Assuming handleSubmit handles form submission
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {variation.map((field) => (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[
              {
                required: true,
                message: `Please enter ${field.label.toLowerCase()}`,
              },
            ]}
            className="col-span-1"
          >
            {field.type === "textarea" ? (
              <Input.TextArea
                placeholder={field.placeholder}
                className={field.className || "textarea"}
              />
            ) : (
              <Input
                placeholder={field.placeholder}
                type={field.type}
              />
            )}
          </Form.Item>
        ))}
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
      {/* ANT TABLE ENDS */}
    </div>
  );
};

export default Product;
