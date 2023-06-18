import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/CategorySchema";

export default async function handler(req, res) {
    const {method} = req;
    await mongooseConnect();
    
    // if method is post, create a category
    if (method == 'POST') {
        const {name} = req.body;
        const categoryDoc = await Category.create({
            name
        })
        res.json(categoryDoc);
    };
}