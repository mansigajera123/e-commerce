import { useEffect, useState } from "react";
import Header from "./header";
import "./css/order.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      const token = localStorage.getItem("authToken");

      fetch("https://logos-annex-qualifying-bob.trycloudflare.com/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const successfulOrders = data.filter(
            (order) => order.paymentStatus === "success"
          );
          setOrders(successfulOrders);
        })
        .catch((err) => console.log(err));
    };

    fetchOrders();
  }, []);

  const generatePdf = (id) => {
    const token = localStorage.getItem("authToken");

    fetch(
      `https://logos-annex-qualifying-bob.trycloudflare.com/order-invoice/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch invoice");
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `order-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading invoice:", error));
  };

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
                      src={`https://logos-annex-qualifying-bob.trycloudflare.com/${item.product.image}`}
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
              <h4 className="payment-status">{order.paymentStatus}</h4>

              <button
                className="invoice-button"
                onClick={() => generatePdf(order._id)}
              >
                Download Invoice
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
