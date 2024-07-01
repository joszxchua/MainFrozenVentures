import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { EditProduct } from "../../components/edit-product";
import { SuccessMessage } from "../../components/success-message";
import { ErrorMessage } from "../../components/error-message";
import { Confirmation } from "../../components/confirmation";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";

const sizeOptions = [
  { value: "oz", label: "Oz" },
  { value: "cup", label: "Cup" },
  { value: "pint", label: "Pint" },
  { value: "quart", label: "Quart" },
  { value: "gallon", label: "Gallon" },
  { value: "lbs", label: "Lbs" },
  { value: "liters", label: "Liters" },
];

export const ManageProduct = () => {
  const { user } = useContext(UserContext);
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [sizes, setSizes] = useState([]);
  const [addingSize, setAddingSize] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [removeSizeId, setRemoveSizeId] = useState("");
  const { register, handleSubmit, control, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/product/productFetch",
            {
              accountId: user.accountId,
              productId: productId,
            }
          );
          if (response.data.status === 1) {
            const productData = response.data.product;
            setProduct(productData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId, productId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/product/productSizesFetch",
            {
              productId: productId,
            }
          );
          if (response.data.status === 1) {
            const sizesData = response.data.products;
            setSizes(Array.isArray(sizesData) ? sizesData : [sizesData]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId]);

  const handleAddSize = () => {
    setAddingSize(true);
  };

  const handleCancelAddSize = () => {
    setAddingSize(false);
    reset();
  };

  const handleEditProduct = () => {
    setShowEditProduct(true);
  };

  const handleCancelEditProduct = () => {
    setShowEditProduct(false);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/product/addProductSize",
        {
          productId: productId,
          size: `${data.size} ${data.sizeUnit.value}`,
          price: data.price,
          stock: data.stock,
        }
      );
      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
      } else if (response.data.status === "error") {
        setMessageTitle("Error");
        setMessage(response.data.message);
      }
    } catch (error) {}

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
      setAddingSize(false);
    }, 3000);
  };

  const handleSuccess = (title, message) => {
    setShowEditProduct(false);
    setMessageTitle(title);
    setMessage(message);

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const handleError = (title, message) => {
    setMessageTitle(title);
    setMessage(message);

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const handleRemoveSize = (size) => {
    setConfirmationTitle("Remove Size");
    setConfirmationMessage(`Are you sure you want to remove ${size.size}?`);
    setRemoveSizeId(size.sizeID);
  };

  const handleRemoveProduct = () => {
    setConfirmationTitle("Remove Product");
    setConfirmationMessage(`Are you sure you want to remove ${product.name}?`);
  };

  const handleCancelConfirmation = () => {
    setConfirmationTitle("");
    setConfirmationMessage("");
    setRemoveSizeId("");
  };

  const handleYesConfirmation = async () => {
    if (confirmationTitle === "Remove Size") {
      try {
        const response = await axios.post(
          "http://localhost:8081/product/deleteSize",
          { sizeId: removeSizeId }
        );
        if (response.data.status === "success") {
          setMessageTitle("Success");
          setMessage(response.data.message);

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else if (response.data.status === "error") {
          setMessageTitle("Error");
          setMessage(response.data.message);
        }
      } catch (error) {
        setMessageTitle("Error");
        setMessage("Something went wrong");
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8081/product/deleteProduct",
          { productId: productId }
        );
        if (response.data.status === "success") {
          setMessageTitle("Success");
          setMessage(response.data.message);

          setTimeout(() => {
            navigate("/home-seller");
          }, 3000);
        } else if (response.data.status === "error") {
          setMessageTitle("Error");
          setMessage(response.data.message);
        }
      } catch (error) {
        setMessageTitle("Error");
        setMessage("Something went wrong");
      }
    }

    setConfirmationTitle("");
    setConfirmationMessage("");

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="mt-20 font-inter px-10 pb-10">
      {messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      {confirmationTitle && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-30">
          <Confirmation
            confirmationTitle={confirmationTitle}
            confirmationMessage={confirmationMessage}
            cancelConfirmation={handleCancelConfirmation}
            yesConfirmation={handleYesConfirmation}
          />
        </div>
      )}

      {showEditProduct && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-30">
          <EditProduct
            productId={productId}
            product={product}
            cancelEditProduct={handleCancelEditProduct}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold">Manage Product</h1>
        <button
          onClick={handleRemoveProduct}
          className="bg-red-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-red-200 hover:bg-white duration-300 hover:text-red-200 ease-in-out"
        >
          Remove This Product
        </button>
      </div>

      <div className="mt-10 flex gap-20">
        <div className="w-full">
          <div className="flex gap-5">
            <img
              src={`http://localhost:8081/productImages/${product.productImage}`}
              alt="Product Image"
              className="w-[300px] rounded-2xl"
            />

            <div className="w-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-semibold">{product.name}</h2>
                <p className="text-gray-200 text-xl">{product.brand}</p>
              </div>

              <p className="text-2xl">
                <span className="font-bold">Flavor:</span> {product.flavor}
              </p>

              <p className="text-2xl">
                <span className="font-bold">Allergens:</span>{" "}
                {product.allergens}
              </p>

              <p className="text-justify text-xl">{product.description}</p>

              <div className="flex justify-end">
                <button
                  onClick={handleEditProduct}
                  className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 rounded-lg shadow-2xl p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold">Product Sizes</h2>
              <button
                onClick={addingSize ? handleCancelAddSize : handleAddSize}
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                {addingSize ? "Cancel" : "Add Size"}
              </button>
            </div>

            {sizes.length > 0 ? (
              <div className="p-5">
                <div className="flex justify-between text-center text-2xl font-bold  border-b pb-5 mb-5">
                  <p className="w-full">Size</p>
                  <p className="w-full">Price</p>
                  <p className="w-full">Stocks</p>
                  <p className="w-full"></p>
                </div>

                {addingSize && (
                  <form
                    className="flex justify-between"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="w-full flex gap-5 px-10">
                      <input
                        type="number"
                        {...register("size", { required: "Size is required" })}
                        className="px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-[50%] outline-purple-200"
                      />
                      <Controller
                        name="sizeUnit"
                        control={control}
                        rules={{ required: "Size Unit is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={sizeOptions}
                            className="basic-single rounded-lg w-full outline-purple-200"
                            classNamePrefix="select"
                          />
                        )}
                      />
                    </div>

                    <div className="w-full flex flex-col gap-2 text-xl px-10">
                      <input
                        type="number"
                        {...register("price", {
                          required: "Price is required",
                        })}
                        className="px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
                      />
                    </div>

                    <div className="w-full flex flex-col gap-2 text-xl px-10">
                      <input
                        type="number"
                        {...register("stock", {
                          required: "Stock is required",
                        })}
                        className="px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
                      />
                    </div>

                    <div className="w-full flex justify-center gap-2 text-xl px-10">
                      <button
                        type="button"
                        onClick={handleCancelAddSize}
                        className="w-full bg-red-100 text-red-200 px-3 py-1 rounded-lg border-2 border-red-200"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                      <button
                        type="submit"
                        className="w-full bg-green-100 text-green-200 px-3 py-1 rounded-lg border-2 border-green-200"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    </div>
                  </form>
                )}
                {sizes.map((size) => (
                  <div
                    key={size.sizeID}
                    className="flex justify-between items-center text-center text-xl py-5"
                  >
                    <p className="w-full">{size.size}</p>
                    <p className="w-full">Php {size.price}</p>
                    <p className="w-full">{size.stock} items left</p>
                    <div className="w-full">
                      <button
                        onClick={() => {
                          handleRemoveSize(size);
                        }}
                        className="cursor-pointer px-3 py-2 rounded-full hover:bg-gray-100 hover:text-red-200 duration-300 ease-in-out"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No sizes available</p>
            )}
          </div>
        </div>

        <div className="w-[50%]  rounded-lg p-10 shadow-2xl">
          <h2 className="text-3xl font-semibold border-b-2 pb-5 mb-5">
            Reviews
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <img
                src={`http://localhost:8081/productImages/${product.productImage}`}
                alt="Product Image"
                className="w-[50px] h-[50px] rounded-full"
              />

              <div className="w-full">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Pedro Mapagmahal</h3>
                  <p>
                    <span className="font-semibold">Rating:</span> 3/5
                  </p>
                </div>

                <p className="text-justify">
                  I absolutely love this vanilla ice cream! The flavor is
                  incredibly rich and authentic, with just the right amount of
                  sweetness. The texture is smooth and creamy, making every bite
                  a delight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
