import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form, message, Divider } from "antd";
import axios from "axios";

const CompanySetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    house_number: "",
    street: "",
    landmark: "",
    city: "",
    country: "",
    avatar: null,
  });
  const fields = [
    {
      id: "name",
      label: "Company Name",
      placeholder: "Company Name",
      type: "text",
      value: formData.name,
    },
    {
      id: "phone",
      label: "Phone",
      placeholder: "Phone",
      type: "text",
      value: formData.phone,
    },
    {
      id: "email",
      label: "Email",
      placeholder: "example@gmail.com",
      type: "email",
      value: formData.email,
    },
    {
      id: "house_number",
      label: "House number",
      placeholder: "house number",
      type: "text",
      value: formData.house_number,
    },
    {
      id: "street",
      label: "street",
      placeholder: "Street",
      type: "text",
      value: formData.street,
    },
    {
      id: "landmark",
      label: "Land mark",
      placeholder: "land mark",
      type: "text",
      value: formData.landmark,
    },
    {
      id: "country",
      label: "Country",
      placeholder: "Country",
      type: "text",
      value: formData.country,
    },
    {
      id: "city",
      label: "City",
      placeholder: "city",
      type: "text",
      value: formData.city,
    },
    {
      id: "avatar",
      label: "Avatar",
      placeholder: "Upload avatar",
      type: "file",
      value: formData.avatar,
    },
  ];

  const handleChange = (id, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const navigate = useNavigate();
  const prevStoredUserData = useRef(null);
  const currentYear = new Date().getFullYear();

  const storedUserData = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  console.log(storedToken);

  useEffect(() => {
    const checkUserDataAndNavigate = () => {
      if (storedUserData !== prevStoredUserData.current) {
        prevStoredUserData.current = storedUserData;
        if (storedUserData && storedUserData.company) {
          const dataObj = storedUserData.company;
          if (Object.keys(dataObj).length !== 0) {
            navigate("/dashboard");
          } else {
            navigate("/company-setup");
          }
        } else {
          console.error("Stored user data is undefined or null.");
        }
      }
    };
    checkUserDataAndNavigate();
    return () => {
      // Clean-up function to prevent memory leaks
      prevStoredUserData.current = null;
    };
  }, [navigate]);

  const token = `bearer ${storedToken}`;

  const handleSubmit = async () => {
    setIsLoading(true);
    const { ...postData } = formData;

    try {
      const response = await axios.post(
        "https://cashify-wzfy.onrender.com/api/v1/company",
        postData,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            token,
          },
        }
      );
      //console.log("Response:", response.data);
      message.success(response.data.msg);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
    setIsLoading(false);
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const startIndex = (step - 1) * 4;
  const endIndex = Math.min(startIndex + 4, fields.length);
  const currentFields = fields.slice(startIndex, endIndex);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-2xl shadow-md rounded px-5 pt-4 pb-8 mb-4">
        <div className="text-center pt-3">
          <h2 className="logo-font text-3xl font-semibold text-blue-500 cursor-pointer hover:text-blue-700">
            Cashify
          </h2>
        </div>
        <Form
          onFinish={
            step === Math.ceil(fields.length / 3) ? handleSubmit : handleNext
          }
          // className="shadow-md rounded px-5 pt-4 pb-8 mb-4"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl">
              <Divider>Company Profile Setup</Divider>
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentFields.map((field) => (
              <div key={field.id} className="flex flex-col mb-3">
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={field.value}
                  prefix={field.prefix}
                  allowClear
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            {step === 1 ? null : (
              <Button
                type="primary"
                className="bg-blue-600"
                onClick={handlePrevious}
                style={{ marginRight: 8 }}
              >
                Previous
              </Button>
            )}
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={isLoading}
            >
              {step === Math.ceil(fields.length / 4) ? "Submit" : "Next"}
            </Button>
          </div>
          <div className="mt-5 text-center">
          <p className="text-sky-500 text-xs">&copy; Cashify {currentYear}</p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CompanySetup;
