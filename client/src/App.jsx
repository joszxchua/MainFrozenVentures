import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./context/user-context";
import { OrderContextProvider } from "./context/order-context";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { Home } from "./pages/home";
import { Sign } from "./pages/Sign/sign";
import { Settings } from "./pages/settings/settings";
import { Shop } from "./pages/shop";
import { Cart } from "./pages/cart";
import { Order } from "./pages/order";
import { OrderInvoice } from "./pages/order-invoice";
import { ProductDetails } from "./pages/product-details";
import { OrderDetails } from "./pages/order-details";
import { PurchaseHistory } from "./pages/purchase-history";
import { HomeSeller } from "./pages/seller/home-seller";
import { ManageProduct } from "./pages/seller/manage-product";

function App() {
  return (
    <>
      <UserContextProvider>
        <OrderContextProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign" element={<Sign />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Order />} />
              <Route path="/order-invoice" element={<OrderInvoice />} />
              <Route
                path="/product-details/:productId"
                element={<ProductDetails />}
              />
              <Route
                path="/order-details/:orderId"
                element={<OrderDetails />}
              />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
              <Route path="/home-seller" element={<HomeSeller />} />
              <Route
                path="/manage-product/:productId"
                element={<ManageProduct />}
              />
            </Routes>
            <Footer />
          </Router>
        </OrderContextProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
