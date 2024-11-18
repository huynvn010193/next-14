"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import DeleteProduct from "./delete-product";
import { ProductListResType } from "@/schemaValidations/product.schema";
import { isClient } from "@/lib/http";

type ProductType = {
  product: ProductListResType["data"][0];
};

export default function ProductEditButton({ product }: ProductType) {
  const isAuthenticated =
    isClient() && Boolean(localStorage.getItem("sessionToken"));

  if (!isAuthenticated) return null;

  return (
    <div className='flex space-x-2 items-start'>
      <Link href={`/products/${product.id}/edit`}>
        <Button variant={"outline"}>Edit</Button>
      </Link>
      <DeleteProduct product={product} />
    </div>
  );
}
