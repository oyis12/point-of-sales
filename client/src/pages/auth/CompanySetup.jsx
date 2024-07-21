// import  { useState, useEffect, useRef, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input, Button, Form, message, Divider, Upload } from "antd";
// import { UploadOutlined } from '@ant-design/icons';
// import axios from "axios";
// import  AppContext  from "../../context/AppContext.jsx";

// const CompanySetup = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { authenticate, loginStatus, authError,authToken, user} =  useContext(AppContext); 
//   const [step, setStep] = useState(1);

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     house_number: "",
//     street: "",
//     landmark: "",
//     city: "",
//     country: "",
//     avatar: null,
//   });
//   const fields = [
//     {
//       id: "name",
//       label: "Company Name",
//       placeholder: "Company Name",
//       type: "text",
//       value: formData.name,
//     },
//     {
//       id: "phone",
//       label: "Phone",
//       placeholder: "Phone",
//       type: "text",
//       value: formData.phone,
//     },
//     {
//       id: "email",
//       label: "Email",
//       placeholder: "example@gmail.com",
//       type: "email",
//       value: formData.email,
//     },
//     {
//       id: "house_number",
//       label: "House number",
//       placeholder: "house number",
//       type: "text",
//       value: formData.house_number,
//     },
//     {
//       id: "street",
//       label: "street",
//       placeholder: "Street",
//       type: "text",
//       value: formData.street,
//     },
//     {
//       id: "landmark",
//       label: "Land mark",
//       placeholder: "land mark",
//       type: "text",
//       value: formData.landmark,
//     },
//     {
//       id: "country",
//       label: "Country",
//       placeholder: "Country",
//       type: "text",
//       value: formData.country,
//     },
//     {
//       id: "city",
//       label: "City",
//       placeholder: "city",
//       type: "text",
//       value: formData.city,
//     },
//     {
//       id: "avatar",
//       label: "Avatar",
//       placeholder: "Upload avatar",
//       type: "file",
//       value: formData.avatar,
//     },
//   ];

//   const handleChange = (id, value) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [id]: value,
//     }));
//   };

//   const normFile = (e) => {
//     console.log('Upload event:', e);
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e?.fileList;
//   };

//   const navigate= useNavigate()
//   const prevStoredUserData = useRef(null);
//   const currentYear = new Date().getFullYear()

//   const storedUserData = user
//   const storedToken = authToken
//   //console.log(storedToken)

//   useEffect(()=>{
//     const checkUserDataAndNavigate = () => {
//    if (storedUserData !== prevStoredUserData.current) {
//       prevStoredUserData.current = storedUserData;
//     if (storedUserData && storedUserData.company) {
//       const dataObj = storedUserData.company;
//       if (Object.keys(dataObj).length !== 0) {
//         navigate("/dashboard");
//       } else {
//         navigate("/company-setup");
//       }
    
//     }else {
//       console.error("Stored user data is undefined or null.");
//     }
//   }
// }
// checkUserDataAndNavigate();
// return () => {
//   // Clean-up function to prevent memory leaks
//   prevStoredUserData.current = null;
// };
//   },[navigate])
  
//   const token = `bearer ${storedToken}`;


//   const handleSubmit = async() => {
//     setIsLoading(true);
//     const {...postData } = formData;

//     try {
//       const response = await axios.post("https://cashify-wzfy.onrender.com/api/v1/company", postData, {
//         headers: {
//           "X-Requested-With": "XMLHttpRequest",
//           token,
//         }
//       })
//       //console.log("Response:", response.data);
//       message.success(response.data.msg);
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Error:", error);
//       message.error('An error occurred. Please try again.');
//     }  
//     setIsLoading(false);
//   };


//   const handleNext = () => {
//     setStep((prevStep) => prevStep + 1);
//   };

//   const handlePrevious = () => {
//     setStep((prevStep) => prevStep - 1);
//   };

//   const startIndex = (step - 1) * 4;
//   const endIndex = Math.min(startIndex + 4, fields.length);
//   const currentFields = fields.slice(startIndex, endIndex);

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-full max-w-2xl shadow-md rounded px-5 pt-4 pb-8 mb-4">
//       <h2 className="logo-font text-center font-semibold text-2xl text-blue-600 hover:text-blue-700">Cashify</h2>

//         <Form
//           onFinish={
//             step === Math.ceil(fields.length / 3) ? handleSubmit : handleNext
//           }
//           // className="shadow-md rounded px-5 pt-4 pb-8 mb-4"
//         >
//           <div className="text-center mb-6">
//             <h1 className="text-2xl"><Divider>Company Profile Setup</Divider></h1>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {currentFields.map((field) => (
//               <div key={field.id} className="flex flex-col mb-3">
//                 { field.type === "file" ? (
//                   <Upload
//                     name={field.id}
//                     action="/upload.do"
//                     listType="picture"
//                     onChange={(info) => normFile(field.id, info)}
//                   >
//                     <Button icon={<UploadOutlined />} style={{width: '100%'}}>Click to upload</Button>
//                   </Upload>
//                 ) : (<Input
//                   id={field.id}
//                   placeholder={field.placeholder}
//                   type={field.type}
//                   value={field.value}
//                   prefix={field.prefix}
//                   allowClear
//                   onChange={(e) => handleChange(field.id, e.target.value)}
//                 />)}
                  
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
//               {step === Math.ceil(fields.length / 4) ? "Submit" : "Next"}
//             </Button>
//           </div>
//           <div className="mt-5 text-center">
//           <p className="text-sky-500 text-xs">&copy; Cashify {currentYear}</p>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default CompanySetup;

import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form, message, Divider, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import AppContext from "../../context/AppContext.jsx";

const CompanySetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate, loginStatus, authError, authToken, user } = useContext(AppContext); 
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

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const navigate = useNavigate();
  const prevStoredUserData = useRef(null);
  const currentYear = new Date().getFullYear();

  const storedUserData = user;
  const storedToken = authToken;

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
      prevStoredUserData.current = storedUserData;
    };
  }, [storedUserData, navigate]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://cashify-wzfy.onrender.com/api/v1/accounts/create-company",
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          house_number: formData.house_number,
          street: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          country: formData.country,
        },
        {
          headers: {
            "Authorization": `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        message.success("Company created successfully");
        navigate("/dashboard");
      } else {
        message.error("Failed to create company. Please try again.");
      }
    } catch (error) {
      console.error("Error during company creation:", error);
      message.error("Failed to create company. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="container w-full mx-auto flex justify-center items-center">
      <div className="flex flex-col items-center justify-center w-full sm:w-2/3">
        <div className="mt-8 p-8 bg-white rounded-lg shadow-md w-full sm:w-2/3">
          <h1 className="text-2xl font-bold text-center mb-4">Company Setup</h1>
          <Form
            name="company-setup"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            {fields.map((field) => (
              <Form.Item key={field.id} label={field.label}>
                {field.type === "file" ? (
                  <Form.Item name={field.id} valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                    <Upload name="logo" action="/upload.do" listType="picture">
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                ) : (
                  <Input
                    type={field.type}
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}
              </Form.Item>
            ))}
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form>
        </div>
        <Divider className="my-4" />
        <footer className="text-center mt-4">
          &copy; {currentYear} Cashify
        </footer>
      </div>
    </div>
  );
};

export default CompanySetup;

