import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIceCream, faXmark } from "@fortawesome/free-solid-svg-icons";

const allergenOptions = [
  { value: "milk", label: "Milk" },
  { value: "egg", label: "Egg" },
  { value: "peanut", label: "Peanut" },
  { value: "treeNut", label: "Tree Nut" },
  { value: "soy", label: "Soy" },
  { value: "wheat", label: "Wheat" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
];

const sizeOptions = [
  { value: "oz", label: "Oz" },
  { value: "cup", label: "Cup" },
  { value: "pint", label: "Pint" },
  { value: "quart", label: "Quart" },
  { value: "gallon", label: "Gallon" },
  { value: "lbs", label: "Lbs" },
  { value: "liters", label: "Liters" },
];

export const EditProduct = ({
  productId,
  product,
  cancelEditProduct,
  onSuccess,
  onError,
}) => {
  const { user } = useContext(UserContext);
  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (product) {
      setProductImage(product.productImage);
      setProductImagePreview(
        `http://localhost:8081/productImages/${product.productImage}`
      );
      setValue("name", product.name);
      setValue("brand", product.brand);
      setValue("flavor", product.flavor);
      setValue("description", product.description);
      setValue(
        "allergens",
        product.allergens.split(",").map((allergen) => ({
          value: allergen,
          label: allergen.charAt(0).toUpperCase() + allergen.slice(1),
        }))
      );
    }
  }, [product, setValue]);

  const handleSelectImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setProductImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    if (!productImage) {
      onError("Error", "Product image is empty");
      return;
    }

    setIsLoading(true);

    try {
      let allergens = product.allergens;
      if (data.allergens) {
        allergens = data.allergens.map((allergen) => allergen.value).join(", ");
      }

      const formData = new FormData();
      formData.append("accountId", user.accountId);
      formData.append("productId", productId);
      formData.append("productImage", productImage);
      formData.append("name", data.name);
      formData.append("brand", data.brand);
      formData.append("flavor", data.flavor);
      formData.append("description", data.description);
      formData.append("allergens", allergens);

      const response = await axios.post(
        "http://localhost:8081/product/editProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === "success") {
        const updatedProduct = {
          productId: productId,
          productImage: productImage,
          name: data.name,
          brand: data.brand,
          flavor: data.flavor,
          description: data.description,
          allergens: allergens,
        };

        onSuccess("Success", response.data.message, updatedProduct);
      } else if (response.data.status === "error") {
        onError("Error", response.data.message);
      }
    } catch (error) {
      onError("Error", "Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 bg-white p-10 rounded-lg max-h-[80vh] overflow-auto">
      <div className="relative text-4xl">
        <h2 className="font-bold">Edit Product</h2>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={cancelEditProduct}
          className="absolute top-0 right-0 shadow-2xl cursor-pointer"
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 items-center justify-center">
          {productImagePreview ? (
            <img
              onClick={handleSelectImage}
              src={productImagePreview}
              alt="Product Image"
              className="rounded-lg w-60 h-60 object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faIceCream}
              onClick={handleSelectImage}
              className="w-[200px] h-[200px] p-5 text-purple-200 shadow-2xl cursor-pointer rounded-lg"
            />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={handleSelectImage}
            className="font-bold px-4 py-2 bg-purple-200 border-2 border-purple-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-purple-200 duration-300"
          >
            Select Image
          </button>
        </div>

        <div className="w-full mt-5 grid grid-cols-[400px_400px] gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Product Name:</label>
              <input
                type="text"
                {...register("name", {
                  required: "Product Name is required",
                })}
                className="px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Product Brand:</label>
              <input
                type="text"
                {...register("brand", {
                  required: "Product Brand is required",
                })}
                className="px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              />
              {errors.brand && (
                <span className="text-red-500 text-sm">
                  {errors.brand.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Flavor:</label>
              <input
                type="text"
                {...register("flavor", { required: "Flavor is required" })}
                className="px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              />
              {errors.flavor && (
                <span className="text-red-500 text-sm">
                  {errors.flavor.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Description:</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="h-[135px] resize-none px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Allergens:</label>
              <Controller
                name="allergens"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={allergenOptions}
                    className="basic-multi-select rounded-lg w-full outline-purple-200"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.allergens && (
                <span className="text-red-500 text-sm">
                  {errors.allergens.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-around">
          <button
            type="button"
            onClick={cancelEditProduct}
            className="font-bold px-4 py-2 bg-gray-200 border-2 border-gray-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-gray-200 duration-300"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="font-bold px-4 py-2 bg-purple-200 border-2 border-purple-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-purple-200 duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Editing product..." : "Edit Product"}
          </button>
        </div>
      </form>
    </div>
  );
};
