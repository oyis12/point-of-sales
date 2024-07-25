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
        <h2 className="text-xl font-bold mb-2">Company name</h2>
        <p className="receipt">
          Address: Lorem ipsum, dolor sit amet consectetur adipisicing elit
        </p>
        <p className="receipt">
          Phone: 08055120900, 08055120900
        </p>
        <p className="receipt">
          Email: testStore@gmail.com
        </p>
      </div>
      <div className="mt-3">
        <div className="flex justify-between">
          <p className="receipt">20-Jul-2024:</p>
          <p className="receipt">10 : 39 AM</p>
        </div>
        <div className="flex justify-between">
          <p className="receipt">Cashier:</p>
          <p className="receipt">MARTHA ADA</p>
        </div>
        <div className="flex justify-between">
          <p className="receipt">Receipt No:</p>
          <p className="receipt">2160015975</p>
        </div>
      </div>
      <div className="text-center">
        {"*".repeat(Math.floor(parseInt(receiptWidth) / 1.6))}
      </div>
      <div className="mb-4">
        <div className="flex justify-between">
          <h2 className="font-bold receipt">Description</h2>
          <h2 className="font-bold receipt">Price</h2>
        </div>
        <div className="relative">
          {/* <h2 className="watermark">Company name</h2> */}
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex">
                <span className="receipt">{index + 1}.</span>
                <span className="receipt">{item.name}</span>
              </div>
              <div className="flex">
                <div className="w-18 text-left">
                  <span className="receipt">Qty: {item.quantity}</span>
                </div>
                <div className="w-20 text-right">
                  <span className="receipt">{item.price * item.quantity}</span>
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
      <h2 className="italic">Thanks for coming. We'll love to serve you again.</h2>
      <h2 className="font-bold">No refund after payment</h2>
    </div>
  );
});

export default Receipt;
