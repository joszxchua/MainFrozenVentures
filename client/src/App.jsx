import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./context/user-context";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { Home } from "./pages/home";
import { Sign } from "./pages/Sign/sign";
import { Settings } from "./pages/settings/settings";
import { Shop } from "./pages/shop";
import { Cart } from "./pages/cart";
import { ProductDetails } from "./pages/product-details";
import { PurchaseHistory } from "./pages/purchase-history";
import { HomeSeller } from "./pages/seller/home-seller";
import { ManageProduct } from "./pages/seller/manage-product";

function App() {
  return (
    <>
      <UserContextProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product-details" element={<ProductDetails />} />
            <Route path="/purchase-history" element={<PurchaseHistory />} />
            <Route path="/home-seller" element={<HomeSeller />} />
            <Route
              path="/manage-product/:productId"
              element={<ManageProduct />}
            />
          </Routes>
          <Footer />
        </Router>
      </UserContextProvider>
    </>
  );
}

export default App;
