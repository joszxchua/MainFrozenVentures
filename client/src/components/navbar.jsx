import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useNavigate, useLocation } from "react-router-dom";
import { SideCart } from "./side-cart";
import { Menu } from "../pages/menu/menu";
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const { user } = useContext(UserContext);
  const [accountInfo, setAccountInfo] = useState(null);
  const [showSideCart, setShowSideCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const sideCartRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleTitleClick = () => {
    navigate("/");
  };

  const handleShopClick = () => {
    navigate("/shop");
  };

  const handleSignClick = () => {
    navigate("/sign");
  };

  const handleCartClick = () => {
    setShowSideCart(true);
  };

  const handleClickOutside = (event) => {
    if (sideCartRef.current && !sideCartRef.current.contains(event.target)) {
      setShowSideCart(false);
    }
  };

  const handleCloseSideCart = () => {
    setShowSideCart(false);
  };

  const handleViewCartClick = () => {
    setShowSideCart(false);
    navigate("/cart");
  };

  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState);
  };

  useEffect(() => {
    if (showSideCart) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSideCart]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/account/accountFetch",
            {
              accountId: user.accountId,
            }
          );
          if (response.data.status === 1) {
            const userData = response.data.account;
            setAccountInfo(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user?.accountId]);

  if (location.pathname === "/sign") {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 p-5 bg-white w-full flex justify-between z-50">
      {showSideCart && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 backdrop-blur-sm">
          <SideCart
            ref={sideCartRef}
            closeSideCart={handleCloseSideCart}
            cartClick={handleViewCartClick}
          />
        </div>
      )}
      <div
        onClick={handleTitleClick}
        className="flex items-center gap-x-2 cursor-pointer hover:text-purple-200 duration-300 ease-in-out"
      >
        <img src={logo} alt="Logo" className="w-9" />
        <h1 className="font-inter font-bold text-2xl">FrozenVentures</h1>
      </div>

      <div className="flex items-center gap-6">
        <p
          onClick={handleShopClick}
          className="font-inter font-bold text-lg cursor-pointer hover:text-purple-200 duration-300 ease-in-out"
        >
          Shop
        </p>
        <p
          onClick={handleCartClick}
          className="font-inter font-bold text-lg cursor-pointer hover:text-purple-200 duration-300 ease-in-out"
        >
          Cart
        </p>
        {!user?.accountId ? (
          <button
            onClick={handleSignClick}
            className="bg-purple-200 text-white font-inter font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
          >
            Sign In
          </button>
        ) : (
          <div onClick={toggleMenu} className="relative flex items-center gap-3 font-inter cursor-pointer p-2 rounded-lg hover:bg-purple-200 hover:text-white duration-300 ease-in-out">
            {!accountInfo?.profileImage ? (
              <FontAwesomeIcon icon={faUserCircle} className="text-4xl" />
            ) : (
              <div>IBAHIN TO GAWING PROFILE PICTURE</div>
            )}
            <div>
              <p className="font-bold text-sm">
                {accountInfo?.firstName} {accountInfo?.lastName}
              </p>
              <p className="text-sm">{accountInfo?.userRole}</p>
            </div>

            {showMenu && <Menu ref={menuRef} />}
          </div>
        )}
      </div>
    </div>
  );
};
