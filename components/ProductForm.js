import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);

    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price};
        if (_id) {
            await axios.put('/api/products', {...data, _id});
            toast.success('Product updated!');
        } else {
            await axios.post('/api/products', data);
            toast.success('Product created!');
        }
        setGoToProducts(true);
    };

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {    
                return [...oldImages, ...res.data.links]
            });
        }
    };

    if (goToProducts) {
        router.push('/products');
    };
    
    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input value={title} onChange={ev => setTitle(ev.target.value)} type="text" placeholder="product name"/>
            <label>
                Photos
            </label>
            <div className="mb-2">
                {!!images?.length && images.map(link => {
                    <div key={link}>
                        {link}
                    </div>
                })}
                <label className="cursor-pointer w-24 h-24 border flex text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 transition hover:brightness-50 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
                {!images?.length && (
                    <div>
                        No photos in this product
                    </div>
                )}
            </div>
            <label>Description</label>
            <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder="description"/>
            <label>Price (in USD)</label>
            <input value={price} onChange={ev => setPrice(ev.target.value)} type="number" placeholder="price"/>
            <button className="btn-primary">Save</button>
        </form>
    );
}