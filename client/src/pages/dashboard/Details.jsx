import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AppContext from "../../context/AppContext";
import { Divider } from "antd";
import Ring from "../../components/loader/Ring";

const Details = ({ staffId, supplierId, type }) => {
  const [details, setDetails] = useState({});
  const { authToken } = useContext(AppContext);

  const fetchStaff = async () => {
    setDetails({});
    try {
      const response = await axios.get(
        `https://pos-wpvg.onrender.com/api/v1/staffs/${staffId}/single`,
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
        `https://pos-wpvg.onrender.com/api/v1/suppliers/${supplierId}/single`,
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
        <div>
          <div className="w-40 h-40 bg-black mb-5 m-auto"></div>
          <Divider>
            <h2 className="text-xs font-bold">
              {type === "user" ? "USER DETAILS" : "SUPPLIER DETAILS"}
            </h2>
          </Divider>
          <div className="flex justify-between mb-5 w-96">
            <h2 className="text-xl mb-2 font-extrabold uppercase">
              {details?.first_name}
            </h2>
            <h2 className="text-xl mb-2 font-extrabold uppercase">
              {details?.last_name}
            </h2>
          </div>
          <div>
            <div className="flex justify-between mb-2 text-left">
              <h2 className="font-extrabold text-sm">PHONE:</h2>
              <span className="text-sm flex font-bold">{details?.phone}</span>
            </div>
            <div className="flex justify-between mb-2 text-left">
              <h2 className="font-extrabold text-sm">EMAIL:</h2>
              <span className="text-sm flex font-bold">{details?.email}</span>
            </div>
          </div>
          <div>
            <Divider>
              <h2 className="text-xs font-bold">ADDRESS</h2>
            </Divider>
            <div className="flex justify-between mb-2 text-left">
              <h2 className="font-extrabold text-sm">HOUSE NO:</h2>{" "}
              <span className="text-sm flex font-bold text-left">
                {details?.address?.house_number}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-left">
              <h2 className="font-extrabold text-sm">STREET:</h2>
              <span className="text-sm flex font-bold text-left">
                {details?.address?.street}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-left">
              <h2 className="font-extrabold text-sm">LANDMARK:</h2>
              <span className="text-sm flex font-bold text-left">
                {details?.address?.landmark}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-left">
              <h2 className="font-extrabold text-sm">CITY:</h2>
              <span className="text-sm flex font-bold text-left">
                {details?.address?.city}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-left">
              <h2 className="font-extrabold text-sm">COUNTRY:</h2>
              <span className="text-sm flex font-bold text-left">
                {details?.address?.country}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
