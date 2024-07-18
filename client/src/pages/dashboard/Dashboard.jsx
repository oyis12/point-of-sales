import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import  AppContext  from "../../context/AppContext.jsx";
import axios from "axios";

const Dashboard = () => {
  const { authToken, user} =  useContext(AppContext); 
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate= useNavigate()
  const prevStoredUserData = useRef(null);
  const storedUserData = user;
  const [ allStaffs, setAllStaffs ] = useState()


  //console.log(storedUserData)

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://pos-wpvg.onrender.com/api/v1/staffs/all`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `bearer ${authToken}`,
          },
        }
      );
      const allStaffs = response.data.data.company_staffs.length
      setAllStaffs(allStaffs)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(()=>{
    const checkUserDataAndNavigate = () => {
    if (storedUserData !== prevStoredUserData.current) {
      prevStoredUserData.current = storedUserData;
    if (storedUserData && storedUserData.company) {
      const dataObj = storedUserData.company;
      if (Object.keys(dataObj).length === 0) {
        navigate("/company-setup");
      } else {
        navigate("/dashboard");
      }
    
    }else {
      console.error("Stored user data is undefined or null.");
    }
  }
}
checkUserDataAndNavigate();
return () => {
  // Clean-up function to prevent memory leaks
  prevStoredUserData.current = null;
};
  },[ navigate])

  const day = currentDate.toLocaleDateString("en-US", { weekday: "long" });
  const date = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const content = [
    {
      id: 1,
      name: "Suppliers",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="30"
          fill="orange"
          className="bi bi-person-fill"
          viewBox="0 0 16 16"
        >
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        </svg>
      ),
      count: 4,
    },
    {
      id: 2,
      name: "Invoice",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="purple"
          className="bi bi-cart-fill"
          viewBox="0 0 16 16"
        >
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
        </svg>
      ),
      count: 2,
    },
    {
      id: 3,
      name: "Current Month Sales",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="green"
          className="bi bi-cash-stack"
          viewBox="0 0 16 16"
        >
          <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
          <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
        </svg>
      ),
      count: 2000000000,
    },
    {
      id: 4,
      name: "Last 3 Months Record",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="orange"
          className="bi bi-calculator"
          viewBox="0 0 16 16"
        >
          <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
          <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
        </svg>
      ),
      count: 0,
    },
    {
      id: 5,
      name: "Last 6 Months Record",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="blue"
          className="bi bi-calendar3"
          viewBox="0 0 16 16"
        >
          <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
          <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
        </svg>
      ),
      count: 0,
    },
    {
      id: 6,
      name: "Staffs",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-people-fill"
          viewBox="0 0 16 16"
        >
          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
        </svg>
      ),
      count: allStaffs,
    },
    {
      id: 7,
      name: "Available Products",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="purple"
          className="bi bi-bag-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
        </svg>
      ),
      count: 4,
    },
    {
      id: 8,
      name: "Current Year Revenue",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="green"
          className="bi bi-bank"
          viewBox="0 0 16 16"
        >
          <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z" />
        </svg>
      ),
      count: 0,
    },
    {
      id: 9,
      name: "Current Year Revenue",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="red"
          className="bi bi-shop"
          viewBox="0 0 16 16"
        >
          <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
        </svg>
      ),
      count: 3,
    },
  ];

  function formatCount(e) {
    if (e.hasOwnProperty("count")) {
      if (e.count >= 1000000) {
        return (
          (e.count / 1000000).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          }) + ",000,000"
        );
      } else if (e.count >= 1000) {
        return (
          (e.count / 1000).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          }) + ",000"
        );
      } else {
        return e.count;
      }
    } else {
      return "";
    }
  }

  return (
    <div className="p-4 relative top-14">
      <div className="grid lg:grid-cols-4 gap-6 md:grid-cols-2">
        <div className="flex bg-emerald-200 p-3 rounded">
          <div className="bg-emerald-500 p-3 rounded h-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-currency-dollar font-bold"
              viewBox="0 0 16 16"
            >
              <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="font-bold">Today's Sales</h2>
            <h2 className="font-bold text-xl">N5,000.00</h2>
          </div>
        </div>
        <div className="flex bg-rose-200 p-3 rounded">
          <div className="bg-rose-500 p-3 rounded h-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-calendar3"
              viewBox="0 0 16 16"
            >
              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="font-bold">Expired</h2>
            <h2 className="font-bold text-xl">0</h2>
          </div>
        </div>
        <div className="flex bg-yellow-200 p-3 rounded">
          <div className="bg-yellow-500 p-3 rounded h-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-receipt"
              viewBox="0 0 16 16"
            >
              <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
              <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="font-bold">Today's Invoice</h2>
            <h2 className="font-bold text-xl">0</h2>
          </div>
        </div>
        <div className="flex bg-teal-200 p-3 rounded">
          <div className="bg-teal-500 p-3 rounded h-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-bag-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="font-bold">New Product</h2>
            <h2 className="font-bold text-xl">4</h2>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          {content.map((e) => (
            <div key={e.id} className="flex p-3 justify-between mb-5 bg-white shadow-md">
              <div>
                <h3 className="text-gray-400 text-sm">{e.name}</h3>
                <h3 className="font-bold text-lg">{formatCount(e)}</h3>
              </div>
              <div>{e.icon}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 shadow-sm p-3">
        <div>
          <h2 className="flex text-2xl text-blue-600">
            Today's &nbsp;
            <span className="font-bold text-red-700 text-2xl">
              ({day}, {date})
            </span>
            &nbsp;
             Transaction
          </h2>
        </div>
        <div className="mt-4">
        <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs uppercase text-black bg-gray-50 ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            order id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            customer
                        </th>
                        <th scope="col" className="px-6 py-3">
                            payment
                        </th>
                        <th scope="col" className="px-6 py-3">
                            amount
                        </th>
                        <th scope="col" className="px-6 py-3">
                            attendant
                        </th>
                        <th scope="col" className="px-6 py-3">
                            status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* Table rows go here */}
                </tbody>
            </table>
            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 px-2" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 ">1-10</span> of <span className="font-semibold text-gray-900 ">1000</span></span>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    {/* Pagination links go here */}
                </ul>
            </nav>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
