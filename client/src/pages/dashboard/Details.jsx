import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AppContext from "../../context/AppContext";
import { Divider } from "antd";
import Ring from "../../components/loader/Ring";

const Details = ({ staffId, supplierId, type }) => {
  const [details, setDetails] = useState({});
  const { authToken, formatDate } = useContext(AppContext);

  const fetchStaff = async () => {
    setDetails({});
    try {
      const response = await axios.get(
        `https://cashify-wzfy.onrender.com/api/v1/staffs/${staffId}/single`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = response.data.data;
      setDetails(data);
    } catch (error) {
      console.error("Error fetching staff details:", error);
    }
  };

  const fetchSupplier = async () => {
    setDetails({});
    try {
      const response = await axios.get(
        `https://cashify-wzfy.onrender.com/api/v1/suppliers/${supplierId}/single`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = response.data.data;
      setDetails(data);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
    }
  };

  useEffect(() => {
    if (type === "supplier" && supplierId) {
      fetchSupplier();
    } else if (type === "user" && staffId) {
      fetchStaff();
    }
  }, [type, staffId, supplierId]);

  return (
    <div className="flex flex-col justify-center items-center">
      {Object.keys(details).length === 0 ? (
        <Ring />
      ) : (
     <div className="container mx-auto p-2 flex justify-center">
      <div className="card w-full">
        <div className="image flex flex-col justify-center items-center">
        <Divider>
           <h2 className="text-xs font-bold">
              {type === "user" ? "USER DETAILS" : "SUPPLIER DETAILS"}
          </h2>
       </Divider>
          <button className="btn bg-gray-800 rounded-full overflow-hidden">
            <img src="https://i.imgur.com/wvxPV9S.png" alt="Profile" className="h-36 w-36 object-cover transform transition-transform duration-500 hover:scale-150" />
          </button>
          <span className="name mt-3 text-lg font-bold">{details?.first_name}  {details?.last_name}</span>
          <span className="idd text-sm font-semibold">{details?.email}</span>
          <div className="flex flex-row justify-center items-center gap-2">
            <span className="idd1 text-xs">{details?.phone}</span>
            <span><i className="fa fa-copy"></i></span>
          </div>
          <div className="text mt-3 text-sm text-gray-600">
            <span>House No:  {details?.address?.house_number}</span>
          </div>
          <div className="text mt-3 text-sm text-gray-600">
            <span>Street:  {details?.address?.street}</span>
          </div>
          <div className="text mt-3 text-sm text-gray-600">
            <span>Landmark:  {details?.address?.landmark}</span>
          </div>
          <div className="text mt-3 text-sm text-gray-600">
            <span>City:  {details?.address?.city}</span>
          </div>
          <div className="text mt-3 text-sm text-gray-600">
            <span>Country:  {details?.address?.country}</span>
          </div>
          <div className="flex mt-2">
            <button className="btn1 bg-black text-gray-400 font-medium py-2 px-6 rounded-md">Edit Record</button>
          </div>
          {/* <div className="gap-3 mt-3 icons flex flex-row justify-center items-center">
            <span><i className="fa fa-twitter"></i></span>
            <span><i className="fa fa-facebook-f"></i></span>
            <span><i className="fa fa-instagram"></i></span>
            <span><i className="fa fa-linkedin"></i></span>
          </div> */}
          <div className="px-2 rounded mt-4 date bg-gray-300">
            <span className="join text-sm font-bold text-gray-600">{formatDate(details?.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
      )}
    </div>
  );
};

export default Details;
