import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "@/components/Layout";
import axios from "axios";


export default function newProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    
    async function createProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price};
        await axios.post('/api/products', data);
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }
    
    return (
        <Layout>
            <form onSubmit={createProduct}>
                <h1>New Product</h1>
                <label>Product Name</label>
                <input value={title} onChange={ev => setTitle(ev.target.value)} type="text" placeholder="product name"/>
                <label>Description</label>
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder="description"/>
                <label>Price (in USD)</label>
                <input value={price} onChange={ev => setPrice(ev.target.value)} type="number" placeholder="price"/>
                <button className="btn-primary">Save</button>
            </form>
        </Layout>
    )
}