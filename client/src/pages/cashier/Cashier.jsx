import React, { useContext } from "react";
import Menu from "./Menu";
import logo from "../../assets/image/logo.webp";
import Time from "../../components/time/Time";
// import AppContext from "../../context/AppContext.jsx";
import { useAppContext } from '../../context/AppContext';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Card, Select, Input } from "antd";
import { AudioOutlined } from "@ant-design/icons";

const { Search } = Input;
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

const onSearch = (value, _e, info) => console.log(info?.source, value);

const Cashier = () => {
    const { user, toggle, handleToggle, logout } = useAppContext();
    const navigate = useNavigate();
  
    const toggleDropdown = () => {
      const dropdown = document.getElementById("userDropdown");
      dropdown.classList.toggle("hidden");
    };
  
    const handleLogout = () => {
      logout(navigate);
    };

  return (
    <div>
      <div className="flex justify-between p-3 fixed w-screen top-0 h-14 bg-white z-10">
        <div className="flex justify-between align-middle items-center">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
          <h3 className="text-2xl ml-2 font-semibold">{user.full_name}</h3>
        </div>
        
        <Menu />

        <div className="flex justify-between align-middle items-center mr-2">
          <Time/>
          <div className="relative ml-2">
            <img
              id="avatarButton"
              type="button"
              data-dropdown-toggle="userDropdown"
              data-dropdown-placement="bottom-start"
              className="w-10 h-10 rounded-full cursor-pointer"
              src={logo}
              alt="User dropdown"
              onClick={toggleDropdown}
            />

            <div
              id="userDropdown"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-56 dark:bg-gray-700 dark:divide-gray-600 absolute right-10"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="avatarButton"
              >
                <li>
                  <Link
                    to="profile"
                    onClick={toggleDropdown}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
              <div className="py-1">
                <Link
                  to="#"
                  onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  <button
                    className="text-red-600 border-none font-bold text-lg"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
      <div className="flex justify-between pb-2 fixed w-[62.8%] top-[49px] bg-white z-10 pt-5 ml-8">
        <div>
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{
              width: 500,
            }}
          />
        </div>
        <div>
          <Select
            defaultValue="lucy"
            style={{
              width: 300,
            }}
            options={[
              {
                value: "lucy",
                label: "Lucy",
              },
            ]}
          />
        </div>
      </div>
      </div>
      <Outlet/>
    </div>
  );
};

export default Cashier;
