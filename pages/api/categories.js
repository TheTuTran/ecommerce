import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/CategorySchema";

export default async function handler(req, res) {
    const {method} = req;
    await mongooseConnect();

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
    };
    
    // if method is post, create a category
    if (method == 'POST') {
        const {name, parentCategory} = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory,
        })
        res.json(categoryDoc);
    };

    // if method is put, update category
    if (method === 'PUT') {
        const {name, parentCategory, _id} = req.body;
        // specify an object of what we want to update then data we want to update
        const categoryDoc = await Category.updateOne({_id}, {
            name,
            parent: parentCategory,
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