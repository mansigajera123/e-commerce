import { useEffect, useState } from "react";
import "./cart.css";
import Header from "./header";
import { useLocation, useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = location.state || {};

  useEffect(() => {
    const getCart = () => {
      const token = localStorage.getItem("authToken");

      fetch("https://pink-places-build.loca.lt/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((cartData) => {
          if (cartData && cartData.items) {
            setCart(cartData.items);
            const total = cartData.items.reduce(
              (acc, item) => acc + item.productId.price * item.quantity,
              0
            );
            setTotalPrice(total);
          } else {
            setCart([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching cart:", err);
          setCart([]);
        });
    };

    getCart();
  }, [message, cart]);

  const handleOrder = () => {
    const token = localStorage.getItem("authToken");
    fetch(`https://pink-places-build.loca.lt/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: cart }),
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "order.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.log(err));
  };

  const handlePayment = () => {
    navigate("/payment", { state: { totalPrice } });
  };

  if (cart === null) {
    return <h1 className="loading">Loading...</h1>;
  }

  return (
    <>
      <Header />
      <h1 className="cart-title">My Cart</h1>
      {cart.length === 0 ? (
        <p className="empty-cart"> cart is empty.</p>
      ) : (
        <ul className="cart-items">
          {cart.map((item) => (
            <li key={item.productId._id} className="cart-item">
              <div className="item-details">
                <h2 className="product-title">{item.productId.title}</h2>
                <p className="product-quantity">Quantity: {item.quantity}</p>
                <p className="product-price">Price: ₹{item.productId.price}</p>
              </div>
              <img
                src={`https://pink-places-build.loca.lt/${item.productId.image}`}
                loading="lazy"
                alt={item.productId.title}
                className="product-image"
              />
            </li>
          ))}
        </ul>
      )}
      <br />
      <div className="cart-total">
        <h3>Total Price: ₹{totalPrice}</h3>
      </div>
      <button
        className="btn"
        type="order"
        onClick={handleOrder}
        disabled={totalPrice <= 0}
      >
        Bill
      </button>
      <button
        className="btn"
        onClick={handlePayment}
        disabled={totalPrice <= 0}
      >
        Proceed to Payment
      </button>
    </>
  );
}
