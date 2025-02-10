import { useEffect, useState } from "react";
import "./css/cart.css";
import Header from "./header";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const getCart = () => {
      const token = localStorage.getItem("authToken");

      fetch("https://outside-friend-jump-convicted.trycloudflare.com/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((d) => {
          if (d && d.items) {
            setCart(d.items);
            const total = d.items.reduce(
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
  }, [cart]);

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
                src={`https://outside-friend-jump-convicted.trycloudflare.com/${item.productId.image}`}
                loading="lazy"
                alt={item.productId.title}
                className="product-image"
              />
            </li>
          ))}
        </ul>
      )}

      <div className="cart-total">
        <h3>Total Price: ₹{totalPrice}</h3>
      </div>
      <br />
      <br />
      <div className="button-container">
        <Link to="/Makeorder">
          <button className="btn">Order</button>
        </Link>
      </div>
    </>
  );
}
