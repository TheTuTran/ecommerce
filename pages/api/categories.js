import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/CategorySchema";
import { isAdminRequest } from "./auth/[...nextauth]"; 

export default async function handler(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
    };
    
    // if method is post, create a category
    if (method == 'POST') {
        const {name, parentCategory, properties} = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || undefined,
            properties,
        })
        res.json(categoryDoc);
    };

    // if method is put, update category
    if (method === 'PUT') {
        const {name, parentCategory, properties, _id} = req.body;
        // specify an object of what we want to update then data we want to update
        const categoryDoc = await Category.updateOne({_id}, {
            name,
            parent: parentCategory || undefined,
            properties,
        })
        res.json(categoryDoc);
    };

    // if method is delete, create a product
    if (method === 'DELETE') {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok');
    };
}