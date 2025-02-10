import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";

export default function MakeOrder() {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

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

  const handleOrder2 = () => {
    const token = localStorage.getItem("authToken");

    fetch(
      "https://outside-friend-jump-convicted.trycloudflare.com/place-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Order placed successfully") {
          alert("✅ Order placed successfully!");
        } else {
          alert("Failed to place order: " + (data.message || "Unknown error"));
        }
      })
      .catch((err) => {
        alert("Network error. Please try again.");
      });
  };

  const handleOrder = () => {
    const token = localStorage.getItem("authToken");
    fetch(`https://outside-friend-jump-convicted.trycloudflare.com/order`, {
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
      <h1 className="cart-title">Make Order</h1>
      {cart.length === 0 ? (
        <p className="empty-cart"> order is empty.</p>
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
          <button className="btn" onClick={handleOrder2}>
            Order
          </button>

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
        </ul>
      )}
    </>
  );
}
