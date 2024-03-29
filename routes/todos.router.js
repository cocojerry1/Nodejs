import express from "express";

import Product from "../schemas/todos.schemas.js";

import bcrypt from "bcrypt";

import { asyncMiddleware } from '../middlewares/error-handler.middleware.js';


const router = express.Router();
const FOR_SALE = "FOR_SALE";
 const SOLD_OUT = "SOLD_OUT";

// 상품등록
router.post("/products", asyncMiddleware(async (req, res) => {

    const { name, description, author, password } = req.body;

    if (!name || !description || !author || !password) {
      return res.status(400).json({ errorMessage: "모든 필드를 입력해야 합니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const product = new Product({
      name,
      description,
      author,
      password: hashedPassword,
      status: FOR_SALE
    });
    await product.save();

    return res.status(201).json({ product });
  }));

// 상품목록조회
router.get("/products", asyncMiddleware(async (req, res) =>  {

    const products = await Product.find().select('name author status createdAt').sort("-createdAt");
    return res.status(200).json({ products });
  }));

// 상세조회
router.get("/products/:productId", asyncMiddleware(async (req, res) =>{
  
    const { productId } = req.params;
    const product = await Product.findById(productId).select('-password');
    if (!product) {
      return res.status(404).json({ errorMessage: "상품이 존재하지 않습니다." });
    }

    return res.status(200).json({ product });
  }));

// 상품 정보 수정
router.patch("/products/:productId", asyncMiddleware(async (req, res) =>  {

    const { productId } = req.params;
    const { name, description, status, password } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ errorMessage: "상품이 존재하지 않습니다." });
    }

    const isMatch = await bcrypt.compare(password, product.password);
    if (!isMatch) {
      return res.status(403).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (status && ["FOR_SALE", "SOLD_OUT"].includes(status)) {
      product.status = status;
    }

    await product.save();
    
    const updatedProduct = {
      name: product.name,
      description: product.description,
      status: product.status,
      password: password  
    };

    return res.status(200).json({ updatedProduct });
  }));
// 삭제
router.delete("/products/:productId", asyncMiddleware(async (req, res) => {
  
    const { productId } = req.params;
    const { password } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: "상품이 존재하지 않습니다." });
    }

    const isMatch = await bcrypt.compare(password, product.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    await Product.deleteOne({ _id: productId });
    return res.status(200).json({});
  }));

export default router;
