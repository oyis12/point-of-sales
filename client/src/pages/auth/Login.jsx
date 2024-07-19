import { useState, useContext , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, Flex, Input, Button, Form, message, Divider } from "antd";
import { MailOutlined, KeyOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import  AppContext  from "../../context/AppContext.jsx";

const Login = () => {
  const { authenticate, loginStatus, authError,authToken, user} =  useContext(AppContext); 
  const [isLoading, setIsLoading] = useState(false);
  const [position] = useState('start');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear()

  const fields = [
    {
      id: "email",
      label: "Email",
      placeholder: "Email",
      type: "email",
      value: "",
      prefix: <MailOutlined />,
    },
    {
      id: "password",
      label: "Password",
      placeholder: "Password",
      type: "password",
      value: "",
    }
  ];

  const [formData, setFormData] = useState(fields);

  const handleChange = (index, e) => {
    const datas = [...formData];
    datas[index].value = e;
    setFormData(datas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      email: formData[0].value,
      password: formData[1].value
    };

    // Use the authenticate function from context
    await authenticate(userData.email, userData.password);

    setIsLoading(false);
  };

  useEffect(() => {
    if (loginStatus === "authenticated") {
      message.success("Login successful!");
      const companyObj = user.company;
      if (Object.keys(companyObj).length === 0 && companyObj.constructor === Object) {
        navigate("/company-setup");
      } else  if (user.previleges.includes(114)) {
        navigate("/cashier/pos")
      }else{
        navigate("/dashboard");
      }
    } else if (loginStatus === "failed" && authError) {
      message.error(authError);
    } 
  }, [loginStatus, authError, navigate]);

 

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-96 shadow-md rounded px-5 pt-4 pb-8 mb-4">
        <h2 className="logo-font text-center font-semibold text-2xl text-blue-600 hover:text-blue-700">Cashify</h2>
        <Form onFinish={handleSubmit}>
          <div className="text-center mb-6">
            <h1 className="text-2xl">
              <Divider>Login</Divider>
            </h1>
          </div>
          <Form.Item>
            {formData.map((field, index) => (
              field.type === "password" ? (
                <Input.Password
                  key={field.id}
                  size="large"
                  required
                  label={field.label}
                  id={field.id}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  prefix={<KeyOutlined />}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  className="mb-4"
                />
              ) : (
                <Input
                  key={field.id}
                  size="large"
                  required
                  label={field.label}
                  id={field.id}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  prefix={field.prefix}
                  className="mb-4"
                />
              )
            ))}
          </Form.Item>
          <div className="flex justify-between mb-4 items-center">
            <Checkbox className="capitalize">Remember </Checkbox>
            <Link to="/forget-password" className="text-base">
              Forgot Password?
            </Link>
          </div>
          <Flex
            vertical
            gap="small"
            style={{
              width: '100%',
            }}
          >
            <Button
              size="large"
              type="primary"
              block
              className="bg-blue-600"
              onClick={handleSubmit}
              loading={isLoading}
              iconposition={position}
              value="end"
              style={{ outline: 'none' }}
            >
              {isLoading ? "Please wait..." : "Sign in"}
            </Button>
          </Flex>
          <div className="mt-2 text-right">
            <Link to="/admin-set-up" className="text-base text-center">
              Setup a Company
            </Link>
          </div>
          <div className="mt-5 text-center">
            <p className="text-sky-500 text-xs">&copy; Cashify {currentYear}</p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
