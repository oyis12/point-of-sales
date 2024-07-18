import React, { useState, useRef } from "react";
import { Card, Button, Modal } from "antd";
import { useReactToPrint } from "react-to-print";
import Receipt from "../../components/receipt/Receipt"; // Adjust the import path as needed
import product_default from "../../assets/image/product_default.png";
import { IoCloseOutline, IoAdd } from "react-icons/io5";
import { RiSubtractFill } from "react-icons/ri";

const Pos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const receiptRef = useRef();
  const total = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const products = [
    {
      name: "Rice",
      price: 2000,
      image:
        "https://abcsupermarket.af/abc/image/cache/catalog/Grocery/Noodles/11-04-2023/indomin%20curry%20flavour%2060g%20089686122138%20p%20110%20indonesia-500x500.jpg",
    },
    {
      name: "Beans",
      price: 1500,
      image: null,
    },
    {
      name: "Yam",
      price: 3000,
      image:
        "https://farmbox.ng/wp-content/uploads/2021/06/Yam-Big-Farmbox.png",
    },
    {
      name: "Corn",
      price: 1200,
      image: null,
    },
    {
      name: "Sugar",
      price: 800,
      image: null,
    },
    {
      name: "Milk",
      price: 2500,
      image: "https://example.com/milk.jpg",
    },
    {
      name: "Apple",
      price: 1000,
      image: "https://example.com/apple.jpg",
    },
    {
      name: "Rice Premium",
      price: 2200,
      image: null,
    },
    {
      name: "Corn Sweet",
      price: 1300,
      image: "https://example.com/corn_sweet.jpg",
    },
    {
      name: "Sugar Brown",
      price: 900,
      image: null,
    },
    {
      name: "Milk Skim",
      price: 2600,
      image: null,
    },
    {
      name: "Apple Green",
      price: 1100,
      image: null,
    },
    {
      name: "Rice Organic",
      price: 2400,
      image: null,
    },
    {
      name: "Corn Baby",
      price: 1400,
      image: null,
    },
    {
      name: "Sugar White",
      price: 850,
      image: null,
    },
    {
      name: "Milk Whole",
      price: 2700,
      image: null,
    },
    {
      name: "Apple Red",
      price: 1200,
      image: null,
    },
  ];

  const logReceipt = () => {
    console.log("Receipt:");
    cart.forEach((item, index) => {
      console.log(
        `${index + 1}. ${item.name} - Quantity: ${item.quantity} - Price: ${
          item.price
        } - Total: ${item.price * item.quantity}`
      );
    });
    console.log(`Total Amount: ${total}`);
    setIsModalVisible(true);
  };

  const handleProductClick = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.name === product.name
    );
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) => {
        if (index === existingProductIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handlePlusClick = (index) => {
    const updatedCart = cart.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          quantity: item.quantity + 1,
          total: item.price * (item.quantity + 1),
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handleMinusClick = (index) => {
    const updatedCart = cart.map((item, idx) => {
      if (idx === index && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handleRemoveClick = (index) => {
    const updatedCart = cart.filter((_, idx) => idx !== index);
    setCart(updatedCart);
  };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  return (
    <div className="p-4 relative top-14 pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative">
        <div className="lg:col-span-2 p-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative top-10">
            {products.map((product, index) => (
              <div
                key={index}
                className="p-2"
                onClick={() => handleProductClick(product)}
              >
                <Card
                  hoverable
                  style={{ width: "100%", height: 200 }}
                  className="p-1"
                  cover={
                    product.image ? (
                      <img
                        alt={product.name}
                        src={product.image}
                        style={{
                          width: "100%",
                          height: 90,
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <img
                        alt={product.name}
                        src={product_default}
                        style={{
                          width: "100%",
                          height: 90,
                          objectFit: "contain",
                        }}
                      />
                    )
                  }
                >
                  <div className="text-center">
                    <h3 className="font-semibold m-0">{product.name}</h3>
                    <h3 className="text-white bg rounded m-0 p-1">
                      &#x20A6; {product.price}
                    </h3>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1 p-4 lg:fixed right-4 w-full lg:w-1/4 top-24">
          <h2 className="text-xl font-bold">Cart</h2>
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <div className="cart-container">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="p-2 border-b border-gray flex items-center relative justify-between"
                >
                  <div className="flex">
                    <img
                      alt={item.name}
                      src={item.image || product_default}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "contain",
                      }}
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-sm">&#x20A6; {item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <div
                        className="text-white bg-red-800 cursor-pointer"
                        onClick={() => handleMinusClick(index)}
                      >
                        <RiSubtractFill />
                      </div>
                      <div>{item.quantity}</div>
                      <div
                        className="text-white bg-blue-800 cursor-pointer"
                        onClick={() => handlePlusClick(index)}
                      >
                        <IoAdd />
                      </div>
                    </div>
                    <Button
                      type="danger"
                      className="ml-4"
                      onClick={() => handleRemoveClick(index)}
                    >
                      <IoCloseOutline />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-4">
                <span>Total:</span>
                <span>&#x20A6; {total}</span>
              </div>
              <Button
                type="primary"
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  logReceipt();
                }}
              >
                Check out
              </Button>
            </div>
          )}
        </div>
      </div>
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button key="print" type="primary" className="bg-blue-700" onClick={handlePrint}>
            Print
          </Button>,
        ]}
      >
        <Receipt ref={receiptRef} cart={cart} total={total} />
      </Modal>
    </div>
  );
};

export default Pos;
