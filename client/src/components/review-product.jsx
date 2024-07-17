import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faStar } from "@fortawesome/free-solid-svg-icons";

export const ReviewProduct = ({ productName, cancelReview }) => {
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <div className="relative flex flex-col gap-3 bg-white p-10 rounded-lg max-h-[80vh] overflow-auto">
      <FontAwesomeIcon
        icon={faXmark}
        onClick={cancelReview}
        className="absolute top-5 right-5 text-2xl cursor-pointer"
      />
      <h2 className="text-3xl font-bold">Review Product</h2>
      <p className="text-xl">What do you think about the {productName}?</p>

      <div className="my-3 flex flex-col items-center">
        <div className="w-full flex justify-between">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={`cursor-pointer text-4xl ${
                  starValue <= (hover || rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => handleRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>
        <textarea
          className="mt-5 p-3 w-full h-32 border-2 border-gray-300 rounded-md focus:outline-none focus:border-purple-500 resize-none"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
      </div>

      <div className="mt-5 flex justify-around">
        <button
          onClick={cancelReview}
          className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
        >
          Cancel
        </button>
        <button className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
          Save Review
        </button>
      </div>
    </div>
  );
};
