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
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
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
  const [selectedProductId, setSelectedProductId] = useState("");
  const [variation, setVariation] = useState([
    { id: "product_id", label: "Product ID", options: [] },
  ]);
  const [form] = Form.useForm();
  const { authToken, user } = useContext(AppContext);

  const { Option } = Select;

  const fields = [
    {
      id: "name",
      label: "Product Name",
      placeholder: "Product Name",
      type: "text",
    },
    {
      id: "image",
      label: "Image",
      placeholder: "Image URL",
      type: "file",
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

  const variations = [
    {
      id: "product_id",
      label: "Product ID",
      placeholder: "Select Product ID",
      type: "select",
      options: [], // This will be populated dynamically
    },
    {
      id: "product_name",
      label: "Product Name",
      placeholder: "Product Name",
      type: "text",
      disabled: true, // Initially disabled until a product ID is selected
    },
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
    form.resetFields();
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const columns = [
    {
      key: "1",
      title: "S/N",
      render: (_, __, index) => index + 1,
    },
    {
      key: "5",
      title: "Image",
      dataIndex: "image",
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

  const addProductVariation = async () => {
    try {
      const productId = form.getFieldValue("product_id");
      const requestData = form.getFieldsValue();

      if (!productId) {
        console.error("Product ID is undefined or null");
        return;
      }

      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("product_name", requestData.product_name);
      formData.append("image", requestData.image[0]?.originFileObj);
      formData.append("size", requestData.size);
      formData.append("color", requestData.color);
      formData.append("weight", requestData.weight);
      formData.append("alias", requestData.alias);
      formData.append("bulk_type", requestData.bulk_type);
      formData.append("packaging", requestData.packaging);
      formData.append("other_details", requestData.other_details);

      const response = await axios.post(
        `https://cashify-wzfy.onrender.com/api/v1/products/${productId}/variation`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Response:", response.data);
      if (response === 600) {
        closeModal();
        getAllProduct()
      }
      
    } catch (error) {
      console.error("Error while adding product variation:", error);
    }
  };

  useEffect(() => {
    if (Array.isArray(selectedProductId) && selectedProductId.length > 0) {
      const productIdOptions = selectedProductId.map((product) => ({
        value: product.product_id,
        label: product.product_id,
      }));

      // Update variation state with options
      setVariation((prevVariation) =>
        prevVariation.map((field) => {
          if (field.id === "product_id") {
            return { ...field, options: productIdOptions };
          }
          return field;
        })
      );
    } else {
      // Handle case where selectedProductId is not an array or is empty
      // Reset options for 'product_id' field
      setVariation((prevVariation) =>
        prevVariation.map((field) => {
          if (field.id === "product_id") {
            return { ...field, options: [] };
          }
          return field;
        })
      );
    }
  }, [selectedProductId]);

  const handleProductIdChange = (productId) => {
    // Find the product name corresponding to the selected product ID
    const selectedProduct = selectedProductId.find(
      (product) => product.product_id === productId
    );
    if (selectedProduct) {
      form.setFieldsValue({
        product_name: selectedProduct.name,
      });
    } else {
      form.setFieldsValue({
        product_name: "",
      });
    }
  };

  const getCategory = async () => {
    try {
      const response = await axios.get(
        `https://cashify-wzfy.onrender.com/api/v1/categories/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = response.data.data;
      // console.log(response.data.data)
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

  // const addProduct = async () => {
  //   try {
  //     // Retrieve form data
  //     const requestData = form.getFieldsValue();
  //     const category_id = form.getFieldValue("category");
  
  //     // Create a FormData object
  //     const formData = new FormData();
  //     formData.append("name", requestData.product_name);
  //     if (requestData.image && requestData.image.length > 0) {
  //       formData.append("image", requestData.image[0]?.originFileObj);
  //     }
  //     formData.append("manufacturer", requestData.manufacturer);
  //     formData.append("description", requestData.description);
  
  //     // POST request to the API
  //     const response = await axios.post(
  //       `https://cashify-wzfy.onrender.com/api/v1/products/${category_id}`,
  //       formData,
  //       {
  //         headers: {
  //           "X-Requested-With": "XMLHttpRequest",
  //           Authorization: `Bearer ${authToken}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  
  //     // Handle successful response
  //     console.log(response);
  //     message.success("Product added successfully");
  //     handleCancel(); // Close form/modal
  //     getAllProduct(); // Refresh product list
  //   } catch (error) {
  //     // Handle errors
  //     console.error("Error while adding new record:", error);
  //     message.error("Failed to add product");
  //   }
  // };

 
  const addProduct = async () => {
    try {
      // Retrieve form data
      const requestData = form.getFieldsValue();
      const category_id = form.getFieldValue("category");
  
      // Debugging: Print the retrieved form data
      console.log("Form Data:", requestData);
  
      // Create a FormData object
      const formData = new FormData();
  
      // Append fields to FormData
      if (requestData.name) {
        formData.append("name", requestData.name);
      } else {
        throw new Error("Product name is required");
      }
  
      if (requestData.image && requestData.image.length > 0) {
        formData.append("image", requestData.image[0]?.originFileObj);
      } else {
        console.warn("No image file provided");
      }
  
      if (requestData.product_type) {
        formData.append("product_type", requestData.product_type);
      } else {
        throw new Error("Product type is required");
      }
  
      if (requestData.manufacturer) {
        formData.append("manufacturer", requestData.manufacturer);
      } else {
        throw new Error("Manufacturer is required");
      }
  
      if (requestData.description) {
        formData.append("description", requestData.description);
      } else {
        console.warn("Description not provided");
      }
  
      // Debugging: Print the FormData entries
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      // POST request to the API
      const response = await axios.post(
        `https://cashify-wzfy.onrender.com/api/v1/products/${category_id}`,
        formData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // Handle successful response
      console.log("Response:", response);
      message.success("Product added successfully");
      handleCancel(); // Close form/modal
      getAllProduct(); // Refresh product list
    } catch (error) {
      // Handle errors
      console.error("Error while adding new record:", error);
      message.error(`Failed to add product: ${error.message}`);
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
        `https://cashify-wzfy.onrender.com/api/v1/products/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // console.log(response)
      const sourcedData = response.data.data.map((product) => ({
        key: product.product_id, // Add unique key prop here
        name: product.name,
        description: product.description,
        product_id: product.product_id,
        categories: product.categories, // Include categories field
        image: product.product_image,
      }));
      setDataSource(sourcedData);
      setSelectedProductId(sourcedData);
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
        `https://cashify-wzfy.onrender.com/api/v1/products/${categoryId}/all`,
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
                className="mb-0"
                onFinish={handleSubmit} // Assuming handleSubmit handles form submission
              >
                <Form.Item
                  name="category"
                  // label="Category"
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
                    // label={field.label}
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
                    ) : field.type === "file" ? (
                      <Form.Item
                      name="image"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      noStyle
                    >
                      <Upload
                        name="image"
                        listType="picture"
                        beforeUpload={false}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          style={{ width: "100%" }}
                        >
                          Click to upload
                        </Button>
                      </Upload>
                    </Form.Item>
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

            <Modal
              title="Add Product Variation"
              open={openVariation}
              onCancel={closeModal}
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  loading={isLoading}
                  onClick={addProductVariation}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isLoading ? "Please wait..." : "Add Variation"}
                </Button>,
              ]}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={addProductVariation}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {variations.map((field) => (
                  <Form.Item
                    key={field.id}
                    name={field.id}
                    rules={[
                      {
                        required: true,
                        message: `Please enter ${field.label.toLowerCase()}`,
                      },
                    ]}
                    className="col-span-1"
                  >
                    {field.type === "select" ? (
                      <Select
                        placeholder={field.placeholder}
                        onChange={(value) => handleProductIdChange(value)}
                      >
                        {variation
                          .find((field) => field.id === "product_id")
                          ?.options.map((option, index) => (
                            <Option key={index} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                      </Select>
                    ) : field.type === "text" ? (
                      <Input
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                      />
                    ) : field.type === "file" ? (
                      <Form.Item
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                      >
                        <Upload
                          name="image"
                          listType="picture"
                          beforeUpload={false}
                        >
                          <Button
                            icon={<UploadOutlined />}
                            style={{ width: "100%" }}
                          >
                            Click to upload
                          </Button>
                        </Upload>
                      </Form.Item>
                    ) : (
                      <Input.TextArea
                        placeholder={field.placeholder}
                        className={field.className || "textarea"}
                      />
                    )}
                  </Form.Item>
                ))}

                {/* Add bulk_type field as a select tag */}
                <Form.Item
                  key="bulk_type"
                  name="bulk_type"
                  rules={[
                    {
                      required: true,
                      message: "Please select a bulk type",
                    },
                  ]}
                  className="col-span-1"
                >
                  <Select defaultValue="carton">
                    <Option value="carton">Carton</Option>
                    <Option value="bulk">Bulk</Option>
                    <Option value="pack">Pack</Option>
                    <Option value="roll">Roll</Option>
                    <Option value="wrap">Wrap</Option>
                    <Option value="dozen">Dozen</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Modal>

          
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <Ring />
              </div>
            ) : dataSource.length === 0 ? (
              <div className="text-center text-gray-500 mt-4 h-96 flex justify-center items-center">
                No data available
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
