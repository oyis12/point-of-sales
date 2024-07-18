// Receipt.js
import React, { useEffect } from "react";

const Receipt = React.forwardRef((props, ref) => {
  const { cart, total } = props;

  const receiptWidth = "80mm"; // Specify the width here

//   useEffect(() => {
//     if (cart.length >= 6) {
//       setWatermarkClass("top-50%");
//     } else {
//       setWatermarkClass("");
//     }
//   }, [cart]);

  return (
    <div className="p-4 relative" ref={ref} style={{ width: receiptWidth, margin: "auto" }}>
      <div>
        <h2 className="text-xl font-bold mb-2 text-center">Company name</h2>
        <p className="text-center">
          Address: Lorem ipsum, dolor sit amet consectetur adipisicing elit
        </p>
      </div>
      <div className="text-center">
        {"*".repeat(Math.floor(parseInt(receiptWidth) / 1.6))}
      </div>
      <div className="mb-4">
        <div className="flex justify-between">
          <h2 className="font-bold text-xs">Description</h2>
          <h2 className="font-bold text-xs">Price</h2>
        </div>
        <div className="relative">
          <h2 className="watermark">Company name</h2>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex">
                <span>{index + 1}.</span>
                <span>{item.name}</span>
              </div>
              <div className="flex">
                <div className="w-18 text-left">
                  <span>Qty: {item.quantity}</span>
                </div>
                <div className="w-20 text-right">
                  <span>{item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        {"*".repeat(Math.floor(parseInt(receiptWidth) / 1.6))}
      </div>
      <div className="flex justify-between font-bold">
        <span>Total Amount:</span>
        <span>{total}</span>
      </div>
      <div className="text-center">
        {"*".repeat(Math.floor(parseInt(receiptWidth) / 1.6))}
      </div>
      <h2 className="text-center font-bold">THANK YOU!</h2>
    </div>
  );
});

export default Receipt;
