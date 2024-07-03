import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { MenuDropdown } from "./menu-dropdown";
import { useNavigate, useLocation } from "react-router-dom";
import { SideCart } from "./side-cart";
import logo from "/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const { user } = useContext(UserContext);
  const [accountInfo, setAccountInfo] = useState(null);
  const [showSideCart, setShowSideCart] = useState(false);
  const sideCartRef = useRef(null);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const menuDropdownRef = useRef(null);
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
    } else if (
      menuDropdownRef.current &&
      !menuDropdownRef.current.contains(event.target)
    ) {
      setShowMenuDropdown(false);
    }
  };

  const handleCloseSideCart = () => {
    setShowSideCart(false);
  };

  const handleViewCartClick = () => {
    setShowSideCart(false);
    navigate("/cart");
  };

  const toggleMenuDropdown = () => {
    setShowMenuDropdown((prev) => !prev);
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
    if (showMenuDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenuDropdown]);

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

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (location.pathname === "/sign") {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 ${
        user?.accountId ? "p-2" : "p-5"
      } bg-white w-full flex justify-between z-40`}
    >
      {showMenuDropdown && <MenuDropdown ref={menuDropdownRef} />}
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
          <div
            className="flex items-center gap-3 font-inter p-2 cursor-pointer"
            onClick={toggleMenuDropdown}
          >
            {!accountInfo?.profilePicture ? (
              <FontAwesomeIcon icon={faUserCircle} className="text-4xl" />
            ) : (
              <img
                src={`http://localhost:8081/profileImages/${accountInfo.profilePicture}`}
                alt="Profile"
                className="w-9 h-9 rounded-full"
              />
            )}
            <div>
              <p className="font-bold text-sm">
                {accountInfo?.firstName} {accountInfo?.lastName}
              </p>
              <p className="text-sm">
                {capitalizeFirstLetter(accountInfo?.userRole)}
              </p>
            </div>
            <FontAwesomeIcon
              icon={showMenuDropdown ? faChevronUp : faChevronDown}
              className="cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};