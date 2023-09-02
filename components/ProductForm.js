import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [goToProducts, setGoToProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );
  const router = useRouter();
  const propertiesToFill = [];

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    try {
      if (_id) {
        await axios.put("/api/products", { ...data, _id });
        toast.success("Product updated!");
      } else {
        await axios.post("/api/products", data);
        toast.success("Product created!");
      }
      setGoToProducts(true);
    } catch (err) {
      toast.error(
        "Product could not be saved. Please make sure there is a name, category, and price assigned."
      );
    }
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propertyName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propertyName] = value;
      return newProductProps;
    });
  }

  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCatInfo = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCatInfo.properties);
      catInfo = parentCatInfo;
    }
  }

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        type="text"
        placeholder="product name"
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((property, index) => (
          <div key={index}>
            <label>
              {property.name[0].toUpperCase() + property.name.substring(1)}
            </label>
            <div>
              <select
                value={productProperties[property.name]}
                onChange={(ev) =>
                  setProductProp(property.name, ev.target.value)
                }
              >
                {property.values.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-sm" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="flex items-center h-24">
            <Spinner />
          </div>
        )}
        <label className="text-primary cursor-pointer w-24 h-24 border flex flex-col text-sm gap-1 rounded-lg transition hover:brightness-50 items-center justify-center bg-white shadow-sm border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Add Image
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
        placeholder="description"
      />
      <label>Price (in USD)</label>
      <input
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
        type="number"
        placeholder="price"
      />
      <button className="btn-primary">Save</button>
    </form>
  );
}
