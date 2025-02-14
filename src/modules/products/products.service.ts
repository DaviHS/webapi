import { poolPromise } from "../../config/db";
import { productSchema } from "./products.schema";
import sql from "mssql";

export class ProductService {
  async getAllProducts() {
    try {
      const conn = await poolPromise; 
      const result = await conn.request().query("SELECT ID, NAME, PRICE FROM PRODUCTS");
      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw new Error("Erro ao buscar produtos no banco de dados.");
    }
  }

  async createProduct(data: any) {
    try {
      const product = productSchema.parse(data);

      const pool = await poolPromise; 

      await pool.request()
        .input("name", sql.VarChar, product.name)
        .input("price", sql.Decimal(10, 2), product.price)
        .query("INSERT INTO PRODUCTS (NAME, PRICE) VALUES (@name, @price)");

      return { message: "Produto criado com sucesso!" };
    } catch (error) {
      console.error("Erro ao criar produto:", error);

      if (error instanceof sql.RequestError) {
        throw new Error("Erro ao inserir produto no banco de dados.");
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Erro desconhecido ao criar produto.");
    }
  }
}
