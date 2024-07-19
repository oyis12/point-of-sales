// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { UserOutlined, UploadOutlined } from "@ant-design/icons";
// import { Input, Button, Form, message, Divider, Upload } from "antd";
// import axios from "axios";

// const AdminSetup = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     phone: "",
//     email: "",
//     house_number: "",
//     street: "",
//     landmark: "",
//     city: "",
//     country: "",
//     avatar: null,
//     password: "",
//     retypePassword: "",
//   });

//   const navigate = useNavigate();
//   const currentYear = new Date().getFullYear();

//   const handleChange = (id, value) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [id]: value,
//     }));
//   };

//   const normFile = (e) => {
//     console.log("Upload event:", e);
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e?.fileList;
//   };

//   const handleSubmit = async () => {
//     if (formData.password !== formData.retypePassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     const { avatar, ...postData } = formData;

//     try {
//       setIsLoading(true);
//       // const formDataToSend = new FormData();
//       Object.keys(postData).forEach((key) => {
//         formData.append(key, postData[key]);
//       });
//       if (avatar) {
//         formData.append("avatar", avatar.file.originFileObj);
//       }
//       const response = await axios.post(
//         "https://cashify-wzfy.onrender.com/api/v1/admin",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log("Response:", response.data);
//       message.success(response.data.msg);
//       navigate("/");
//     } catch (error) {
//       console.error("Failed to add admin:", error);
//       console.log("Response:", error);
//       alert("Failed to add admin. Please try again.");
//     }
//     setIsLoading(false);
//   };

//   const fields = [
//     {
//       id: "first_name",
//       placeholder: "First Name",
//       type: "text",
//       value: formData.first_name,
//       prefix: <UserOutlined />,
//     },
//     {
//       id: "last_name",
//       placeholder: "Last Name",
//       type: "text",
//       value: formData.last_name,
//     },
//     {
//       id: "phone",
//       placeholder: "Phone",
//       type: "text",
//       value: formData.phone,
//     },
//     {
//       id: "email",
//       placeholder: "example@gmail.com",
//       type: "email",
//       value: formData.email,
//     },
//     {
//       id: "house_number",
//       placeholder: "House 5",
//       type: "text",
//       value: formData.house_number,
//     },
//     {
//       id: "street",
//       placeholder: "Street Name",
//       type: "text",
//       value: formData.street,
//     },
//     {
//       id: "landmark",
//       placeholder: "Landmark",
//       type: "text",
//       value: formData.landmark,
//     },
//     {
//       id: "city",
//       placeholder: "City",
//       type: "text",
//       value: formData.city,
//     },
//     {
//       id: "country",
//       placeholder: "Country",
//       type: "text",
//       value: formData.country,
//     },
//     {
//       id: "avatar",
//       placeholder: "Avatar URL",
//       type: "file",
//       value: formData.avatar,
//     },
//     {
//       id: "password",
//       placeholder: "8+ Character required",
//       type: "password",
//       value: formData.password,
//     },
//     {
//       id: "retypePassword",
//       placeholder: "Re-Type Password",
//       type: "password",
//       value: formData.retypePassword,
//     },
//   ];

//   const handleNext = () => {
//     setStep((prevStep) => prevStep + 1);
//   };

//   const handlePrevious = () => {
//     setStep((prevStep) => prevStep - 1);
//   };

//   const startIndex = (step - 1) * 6;
//   const endIndex = Math.min(startIndex + 6, fields.length);
//   const currentFields = fields.slice(startIndex, endIndex);

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-full max-w-2xl shadow-md rounded px-5 pt-4 pb-8 mb-4">
//         <div className="text-center pt-3">
//           <h2 className="logo-font text-3xl font-semibold text-blue-500 cursor-pointer hover:text-blue-700">
//             Cashify
//           </h2>
//         </div>
//         <Form
//           onFinish={
//             step === Math.ceil(fields.length / 6) ? handleSubmit : handleNext
//           }
//         >
//           <div className="text-center mb-6">
//             <h1 className="text-2xl">
//               <Divider>Admin Setup</Divider>
//             </h1>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {currentFields.map((field) => (
//               <div key={field.id} className="flex flex-col mb-3">
//                 {field.type === "password" ? (
//                   <Input.Password
//                     id={field.id}
//                     placeholder={field.placeholder}
//                     visibilityToggle
//                     onChange={(e) => handleChange(field.id, e.target.value)}
//                   />
//                 ) : field.type === "file" ? (
//                   <Upload
//                     name="avatar"
//                     listType="picture"
//                     beforeUpload={() => false}
//                     onChange={(info) => handleChange(field.id, info)}
//                   >
//                     <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
//                       Click to upload
//                     </Button>
//                   </Upload>
//                 ) : (
//                   <Input
//                     id={field.id}
//                     placeholder={field.placeholder}
//                     type={field.type}
//                     value={field.value}
//                     prefix={field.prefix}
//                     allowClear
//                     onChange={(e) => handleChange(field.id, e.target.value)}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-between mt-3">
//             {step === 1 ? null : (
//               <Button
//                 type="primary"
//                 className="bg-blue-600"
//                 onClick={handlePrevious}
//                 style={{ marginRight: 8 }}
//               >
//                 Previous
//               </Button>
//             )}
//             <Button
//               type="primary"
//               className="bg-blue-600"
//               htmlType="submit"
//               loading={isLoading}
//             >
//               {step === Math.ceil(fields.length / 6) ? "Submit" : "Next"}
//             </Button>
//           </div>
//           <div className="mt-2 text-right">
//             <Link to="/" className="text-base text-center">
//               Already have an account? Login
//             </Link>
//           </div>
//           <div className="mt-5 text-center">
//             <p className="text-sky-500 text-xs">&copy; Cashify {currentYear}</p>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default AdminSetup;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Input, Button, Form, message } from "antd";
import axios from "axios";

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
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
    avatar: null,
    password: "",
    retypePassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (id, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.retypePassword) {
      alert("Passwords do not match");
      return;
    }

    const {...postData } = formData;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://pos-wpvg.onrender.com/api/v1/admin",
        postData
      );
      // localStorage.setItem("data", JSON.stringify(response.data));
      console.log("Response:", response.data);
      message.success(response.data.msg);
      navigate("/");
    } catch (error) {
      console.error("Failed to add admin:", error);
      console.log("Response:", error);
      alert("Failed to add admin. Please try again.");
    }
    setIsLoading(false);
  };

  const fields = [
    {
      id: "first_name",
      placeholder: "First Name",
      type: "text",
      value: formData.first_name,
      prefix: <UserOutlined />,
    },
    {
      id: "last_name",
      placeholder: "Last Name",
      type: "text",
      value: formData.last_name,
    },
    {
      id: "phone",
      placeholder: "Phone",
      type: "text",
      value: formData.phone,
    },
    {
      id: "email",
      placeholder: "example@gmail.com",
      type: "email",
      value: formData.email,
    },
    {
      id: "house_number",
      placeholder: "House 5",
      type: "text",
      value: formData.house_number,
    },
    {
      id: "street",
      placeholder: "Street Name",
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
      id: "country",
      placeholder: "Country",
      type: "text",
      value: formData.country,
    },
    {
      id: "avatar",
      placeholder: "Avatar URL",
      type: "file",
      value: null,
    },
    {
      id: "password",
      placeholder: "8+ Character required",
      type: "password",
      value: formData.password,
    },
    {
      id: "retypePassword",
      placeholder: "Re-Type Password",
      type: "password",
      value: formData.retypePassword,
    },
  ];

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const startIndex = (step - 1) * 6;
  const endIndex = Math.min(startIndex + 6, fields.length);
  const currentFields = fields.slice(startIndex, endIndex);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-2xl">
        <Form
          onFinish={
            step === Math.ceil(fields.length / 6) ? handleSubmit : handleNext
          }
          className="shadow-md rounded px-5 pt-4 pb-8 mb-4"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl">Admin Setup</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentFields.map((field) => (
              <div key={field.id} className="flex flex-col mb-3">
                {field.type === "password" ? (
                  <Input.Password
                    id={field.id}
                    placeholder={field.placeholder}
                    visibilityToggle
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                ) : (
                  <Input
                    id={field.id}
                    placeholder={field.placeholder}
                    type={field.type}
                    value={field.value}
                    prefix={field.prefix}
                    allowClear
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}
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
              // style={{ marginRight: 8 }}
            >
              {step === Math.ceil(fields.length / 6) ? "Submit" : "Next"}
            </Button>
          </div>
          <div className="mt-2 text-right">
            <Link to="/" className="text-base text-center">
              Already have an account? Login
            </Link>
          </div>
          <div className="mt-5 text-center">
            <p className="text-sky-500 text-xs">&copy;StorePower 2024</p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AdminSetup;