import { useEffect, useState } from "react";
import Header from "./header";
import "./css/order.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      const token = localStorage.getItem("authToken");

      fetch(
        "https://outside-friend-jump-convicted.trycloudflare.com/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.log(err));
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Header />
      <h1 className="cart-title">My Orders</h1>
      {orders.length === 0 ? (
        <p className="empty-cart">No orders placed yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <h3>Order ID: {order._id}</h3>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <ul>
                {order.products.map((item, index) => (
                  <li key={index}>
                    <img
                      src={`https://outside-friend-jump-convicted.trycloudflare.com/${item.product.image}`}
                      alt={item.product.title}
                      width="50"
                    />
                    <span>
                      {item.product.title} - ₹{item.product.price} x{" "}
                      {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
