import React from 'react'
import { useNavigate } from "react-router-dom";

const Restricted = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1); // Go back to the previous page
      };
  return (
    <div>
        <h2>Unauthorized Access</h2>
      <p>You do not have permission to view this page.</p>
      <button onClick={goBack}>Go Back</button>
    </div>
  )
}

export default Restricted