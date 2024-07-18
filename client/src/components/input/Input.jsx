// components/input/Input.js
import React from "react";
import { Input } from 'antd';

const CustomInput = ({ label, id, placeholder, type, value, onChange, readOnly }) => {
  return (
    <div className="mb-5">
      <label className="block text-gray-700 text-sm font-bold">{label}</label>
      <Input 
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
};

export default CustomInput;
