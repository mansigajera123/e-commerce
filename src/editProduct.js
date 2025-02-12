import { useEffect, useState } from "react";
import "./css/addproduct.css";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setproductData] = useState({
    title: "",
    image: null,
    price: 0,
    description: "",
    category: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`https://logos-annex-qualifying-bob.trycloudflare.com/detail/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setproductData({
          title: data.title,
          image: null,
          price: data.price,
          description: data.description,
          category: data.category,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const dataHandler = (identifier, value) => {
    setproductData((prevState) => {
      return {
        ...prevState,
        [identifier]: value,
      };
    });
  };

  const EditProduct = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("description", productData.description);
    formData.append("image", productData.image);
    fetch(`https://logos-annex-qualifying-bob.trycloudflare.com/edit/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },

      body: formData,
    })
      .then((res) => res.json())
      .then((user) => {
        setproductData({
          title: "",
          image: null,
          price: 0,
          description: "",
          category: "",
        });
        navigate("/product");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <div className="add-product-container">
        <form className="add-product-form" onSubmit={EditProduct}>
          <h1>Edit Product</h1>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={productData.title}
            onChange={(e) => dataHandler("title", e.target.value)}
          />
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            onChange={(e) => dataHandler("image", e.target.files[0])}
          />
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={(e) => dataHandler("price", e.target.value)}
          />
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={productData.description}
            onChange={(e) => dataHandler("description", e.target.value)}
          />
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={(e) => dataHandler("category", e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Kids">Kids</option>
            <option value="Kitchen Item">Kitchen Item</option>
            <option value="Beauty Product">Beauty Product</option>
          </select>
          <br />
          <br />

          <button type="submit">Add Product</button>
        </form>
      </div>
    </>
  );
}
