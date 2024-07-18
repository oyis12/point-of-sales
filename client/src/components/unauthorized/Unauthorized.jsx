import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Unauthorized = () => {
  const { user } = useAppContext();

  return (
    <div className="flex justify-center items-center h-screen align-middle flex-col">
      <h1>Unauthorized</h1>
      <p className="text-sm text-gray-600">You do not have access to this page.</p>

      <Link
            
         to={`${user.previleges.includes(114) ? "/cashier/pos" : "/dashboard"}`}
          >
            Go back to {user.previleges.includes(114) ? "POS" : "Dashboard"}
      </Link>
    </div>
  );
};

export default Unauthorized;

