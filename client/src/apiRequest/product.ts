import http from "@/lib/http";
import {
  CreateProductBodyType,
  ProductResType,
} from "@/schemaValidations/product.schema";

const productApiRequest = {
  get: () => http.get("/products"),
  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>("/products", body),
};

export default productApiRequest;
