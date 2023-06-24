import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/ProductSchema";

export default async function handler(req, res) {
    const {method} = req;
    await mongooseConnect();
    
    // Grabs from database
    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({_id: req.query.id}))
        } else {
            res.json(await Product.find());
        }
    };

    // if method is post, create a product
    if (method == 'POST') {
        const {
            title, 
            description, 
            price, 
            images, 
            category, 
            properties,
        } = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category, properties
        })
        res.json(productDoc);
    };

    // if method is put, update product
    if (method === 'PUT') {
        const {title, description, price, images, category, properties, _id} = req.body;
        await Product.updateOne({_id}, {title, description, price, images, category, properties})
        res.json(true);
    };

    // if method is delete, create a product
    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id})
            res.json(true);
        }
    };
};
  