// Product 모델 정의
import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: String,
  description: String,
  author: String,
  password: String,
  status: { type: String, default: "FOR_SALE" },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
