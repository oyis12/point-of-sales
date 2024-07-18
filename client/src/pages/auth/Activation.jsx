import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";

function Activation() {
    const fields = [
        {
          id: "companyName",
          label: "Company Name",
          placeholder: "Company Name",
          type: "text",
          value: "",
        },
        {
          id: "activationCode",
          label: "Activation code",
          placeholder: "Activation Code",
          type: "text",
          value: "",
        }
      ];
      const [formData, setFormData] = useState(fields);

      const navigate = useNavigate()

      const handleChange = (index, e) => {
        const datas = [...formData];
        datas[index].value = e;
        setFormData(datas);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/"); // Navigate to the next page
      };
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="w-full max-w-96">
            <form
              onSubmit={handleSubmit}
              className="shadow-md rounded px-5 pt-4 pb-8 mb-4"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl">Product Activation</h1>
              </div>
              {formData.map((field, index) => (
                <Input
                  key={field.id}
                  label={field.label}
                  id={field.id}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={field.value} // Use formData to set the value
                  onChange={(e) => handleChange(index, e.target.value)} // Pass the handleChange function
                />
              ))}
              <div className="flex justify-end">
                <Button type="submit" className="w-full">
                  Activate Now
                </Button>
              </div>
              <div className="mt-5 text-center">
                <p className="text-sky-500 text-xs">&copy;StorePower 2024</p>
              </div>
            </form>
          </div>
        </div>
      );
    };

export default Activation