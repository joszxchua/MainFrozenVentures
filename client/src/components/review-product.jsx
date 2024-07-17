import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faStar } from "@fortawesome/free-solid-svg-icons";

export const ReviewProduct = ({ cancelReview, order, onResult }) => {
  const { user } = useContext(UserContext);
  const { register, handleSubmit, setValue } = useForm();
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const [hover, setHover] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleRating = (rate) => {
    setRating(rate);
    setValue("rating", rate);
  };

  const onSubmit = async (data) => {
    if (rating === 0) {
      setRatingError(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/order/reviewProduct",
        {
          ...data,
          accountId: user.accountId,
          orderId: order.orderID,
          productId: order.productID,
          sizeId: order.sizeID,
        }
      );
      if (response.data.status === "success") {
        onResult("Success", response.data.message);
      } else if (response.data.status === "error") {
        onResult("Error", response.data.message);
      }
    } catch (error) {
      onResult("Error", "Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col gap-3 bg-white p-10 rounded-lg max-h-[80vh] overflow-auto"
    >
      <FontAwesomeIcon
        icon={faXmark}
        onClick={cancelReview}
        className="absolute top-5 right-5 text-2xl cursor-pointer"
      />
      <h2 className="text-3xl font-bold">Review Product</h2>
      <p className="text-xl">What do you think about the {order.name}?</p>

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
        {ratingError && (
          <span className="my-3 text-red-500 text-sm">Rating is required</span>
        )}
        <textarea
          className="my-3 p-3 w-full h-32 border-2 border-gray-300 rounded-md focus:outline-none focus:border-purple-500 resize-none"
          placeholder="Write your review here..."
          {...register("reviewText")}
        ></textarea>
      </div>

      <div className="my-2 flex justify-around">
        <button
          onClick={cancelReview}
          className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
        >
          {isLoading ? "Loading..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
};
