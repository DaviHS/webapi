import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "./products.service";

const productService = new ProductService();

export const getProductsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const products = await productService.getAllProducts();
    reply.send(products);
  } catch (err) {
    reply.status(500).send(err);
  }
};

export const createProductHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await productService.createProduct(req.body);
    reply.send(result);
  } catch (err) {
    reply.status(400).send(err);
  }
};
