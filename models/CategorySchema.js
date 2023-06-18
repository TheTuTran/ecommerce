import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
    name: {type: String, required: true},
});

export const Product = models.Product || model('Product', ProductSchema);