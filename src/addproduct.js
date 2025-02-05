import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";

export default function AddProduct() {
  const [productData, setProductData] = useState({
    title: "",
    image: null,
    price: 0,
    description: "",
    category: "",
  });

  const navigate = useNavigate();

  const dataHandler = (identifier, value) => {
    setProductData((prevState) => ({
      ...prevState,
      [identifier]: value,
    }));
  };

  const AddProduct = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("image", productData.image);

    fetch("https://pink-places-build.loca.lt/addproduct", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setProductData({
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
        <form className="add-product-form" onSubmit={AddProduct}>
          <h1>Add Product</h1>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            onChange={(e) => dataHandler("title", e.target.value)}
            required
          />
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            onChange={(e) => dataHandler("image", e.target.files[0])}
            required
          />
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            onChange={(e) => dataHandler("price", e.target.value)}
            required
          />
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            onChange={(e) => dataHandler("description", e.target.value)}
            required
          />
          {/* <label htmlFor="category">Category</label>
          <input
            type="text"
            name="category"
            onChange={(e) => dataHandler("category", e.target.value)}
            required
          /> */}

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
          </select>

          <button type="submit">Add Product</button>
        </form>
      </div>
    </>
  );
}
