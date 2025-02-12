import { useEffect, useState } from "react";
import "./css/cart.css";
import Header from "./header";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    const token = localStorage.getItem("authToken");

    fetch("https://logos-annex-qualifying-bob.trycloudflare.com/cart", {
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

  const deleteCartItem = (productId) => {
    const token = localStorage.getItem("authToken");

    fetch(
      `https://logos-annex-qualifying-bob.trycloudflare.com/cart/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then(() => {
        setCart((prevCart) =>
          prevCart.filter((item) => item.productId._id !== productId)
        );
        fetchCart();
      })
      .catch((err) => console.error("Error deleting item:", err));
  };

  if (cart === null) {
    return <h1 className="loading">Loading...</h1>;
  }

  return (
    <>
      <Header />
      <h1 className="cart-title">My Cart</h1>
      {cart.length === 0 ? (
        <p className="empty-cart">Cart is empty.</p>
      ) : (
        <ul className="cart-items">
          {cart.map((item) => (
            <li key={item.productId._id} className="cart-item">
              <div className="item-details">
                <h2 className="product-title">{item.productId.title}</h2>
                <p className="product-quantity">Quantity: {item.quantity}</p>
                <p className="product-price">Price: ₹{item.productId.price}</p>
                <button
                  className="delete-btn"
                  onClick={() => deleteCartItem(item.productId._id)}
                >
                  <FaTrash />
                </button>
              </div>
              <img
                src={`https://logos-annex-qualifying-bob.trycloudflare.com/${item.productId.image}`}
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
      <div className="button-container">
        <Link to="/Makeorder">
          <button className="btn" disabled={totalPrice <= 0}>
            Order
          </button>
        </Link>
      </div>
    </>
  );
}
