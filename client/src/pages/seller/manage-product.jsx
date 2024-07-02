import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { EditProduct } from "../../components/edit-product";
import { SuccessMessage } from "../../components/success-message";
import { ErrorMessage } from "../../components/error-message";
import { Confirmation } from "../../components/confirmation";
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
  const navigate = useNavigate();
  const { register, handleSubmit, control, reset } = useForm();

  const [product, setProduct] = useState({});
  const [sizes, setSizes] = useState([]);
  const [addingSize, setAddingSize] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [removeSizeId, setRemoveSizeId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (user.accountId) {
        try {
          const productResponse = await axios.post(
            "http://localhost:8081/product/productFetch",
            { accountId: user.accountId, productId }
          );
          if (productResponse.data.status === 1) {
            setProduct(productResponse.data.product);
          }

          const sizesResponse = await axios.post(
            "http://localhost:8081/product/productSizesFetch",
            { productId }
          );
          if (sizesResponse.data.status === 1) {
            setSizes(sizesResponse.data.products);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user.accountId, productId]);

  const handleEditProduct = () => setShowEditProduct(true);
  const handleCancelEditProduct = () => setShowEditProduct(false);

  const handleSuccess = (title, message, updatedProduct) => {
    setShowEditProduct(false);
    setMessageTitle(title);
    setMessage(message);
    setProduct(updatedProduct);

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
    try {
      if (confirmationTitle === "Remove Size") {
        const response = await axios.post(
          "http://localhost:8081/product/deleteSize",
          { sizeId: removeSizeId }
        );
        if (response.data.status === "success") {
          setMessageTitle("Success");
          setMessage(response.data.message);
          setSizes((prevSizes) =>
            prevSizes.filter((size) => size.sizeID !== removeSizeId)
          );
        } else {
          setMessageTitle("Error");
          setMessage(response.data.message);
        }
      } else {
        const response = await axios.post(
          "http://localhost:8081/product/deleteProduct",
          { productId }
        );
        if (response.data.status === "success") {
          setMessageTitle("Success");
          setMessage(response.data.message);

          setTimeout(() => {
            navigate("/home-seller");
          }, 3000);
        } else {
          setMessageTitle("Error");
          setMessage(response.data.message);
        }
      }
    } catch (error) {
      setMessageTitle("Error");
      setMessage("Something went wrong");
    }

    setConfirmationTitle("");
    setConfirmationMessage("");

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const handleAddSize = () => setAddingSize(true);
  const handleCancelAddSize = () => {
    setAddingSize(false);
    reset();
  };

  const onSubmit = async (data) => {
    setAddingSize(false);
    try {
      const response = await axios.post(
        "http://localhost:8081/product/addProductSize",
        {
          productId,
          size: `${data.size} ${data.sizeUnit.value}`,
          price: data.price,
          stock: data.stock,
        }
      );
      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
        setSizes((prevSizes) => [
          ...prevSizes,
          {
            sizeID: response.data.sizeID,
            size: `${data.size} ${data.sizeUnit.value}`,
            price: data.price,
            stock: data.stock,
          },
        ]);
      } else {
        setMessageTitle("Error");
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error adding size:", error);
    }

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
                <span className="font-bold">Allergens:</span>
                {product.allergens}
              </p>

              <p className="text-justify text-xl">{product.description}</p>

              <button
                onClick={handleEditProduct}
                className="w-fit bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Edit Product
              </button>
            </div>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <h2 className="text-2xl font-bold">
              Product's Size, Price and Stocks
            </h2>

            <button
              onClick={handleAddSize}
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Add Size
            </button>
          </div>

          {addingSize && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-5 flex items-center gap-10 border-2 border-primary rounded-lg p-5"
            >
              <div className="w-full">
                <label className="font-bold">Size</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="border-2 border-primary rounded-lg px-2 py-1 mr-2"
                    {...register("size", { required: true })}
                  />
                  <Controller
                    name="sizeUnit"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={sizeOptions}
                        className="w-full text-black"
                      />
                    )}
                    rules={{ required: true }}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col">
                <label className="font-bold">Price</label>
                <input
                  type="text"
                  step="0.01"
                  className="border-2 border-primary rounded-lg px-2 py-1"
                  {...register("price", { required: true })}
                />
              </div>

              <div className="w-full flex flex-col">
                <label className="font-bold">Stock</label>
                <input
                  type="text"
                  className="border-2 border-primary rounded-lg px-2 py-1"
                  {...register("stock", { required: true })}
                />
              </div>

              <div className="w-[50%] flex justify-end mt-5 gap-2">
                <button
                  type="button"
                  onClick={handleCancelAddSize}
                  className="bg-red-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-red-200 hover:bg-white duration-300 hover:text-red-200 ease-in-out"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <button
                  type="submit"
                  className="bg-green-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-green-200 hover:bg-white duration-300 hover:text-green-200 ease-in-out"
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
            </form>
          )}

          <div className="mt-5 flex flex-col gap-5">
            {sizes.length > 0 ? (
              sizes.map((size) => (
                <div
                  key={size.sizeID}
                  className="border-2 border-primary rounded-lg flex justify-between items-center py-2 px-5"
                >
                  <p className="w-full text-lg">
                    <span className="font-bold">Size:</span> {size.size}
                  </p>
                  <p className="w-full text-lg">
                    <span className="font-bold">Price:</span> Php {size.price.toFixed(2)}
                  </p>
                  <p className="w-full text-lg">
                    <span className="font-bold">Stock:</span> {size.stock}
                  </p>
                  <button
                    onClick={() => handleRemoveSize(size)}
                    className="bg-red-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-red-200 hover:bg-white duration-300 hover:text-red-200 ease-in-out"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center">No sizes available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
