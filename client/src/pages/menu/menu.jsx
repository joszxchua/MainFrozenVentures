import React, { useContext, useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { useNavigate } from "react-router-dom";

export const Menu = forwardRef((props, ref) => {
  const { user, clearUser } = useContext(UserContext);
  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    profileImage: "",
  });
  const navigate = useNavigate();

  return (
    <div className="fixed top-[10vh] right-0" ref={ref}>
      <ul className="menu-list">
        <li>
          <p>Show Profile</p>
        </li>
        <li>
          <p>Purchase History</p>
        </li>
        <li>
          <p>Sign Out</p>
        </li>
      </ul>
    </div>
  );
});
