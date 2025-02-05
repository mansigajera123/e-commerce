import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./header";
import Login from "./login";
import SignUp from "./signup";
import Product from "./product";
import AddProduct from "./addproduct";
import EditProduct from "./editProduct";
import DetailView from "./DetailView";
import Cart from "./cart";
import AllProduct from "./AllProduct";
import ForgotPassword from "./forgotPAssword";
import ResetPassword from "./resetpassword";
import Payment from "./payment";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/allProduct",
      element: <AllProduct />,
    },
    {
      path: "/product",
      element: <Product />,
    },
    {
      path: "/addproduct",
      element: <AddProduct />,
    },
    {
      path: "/edit/:id",
      element: <EditProduct />,
    },
    {
      path: "/detail/:id",
      element: <DetailView />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPassword />,
    },
    {
      path: "/payment",
      element: <Payment />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
