import productApiRequest from "@/apiRequest/product";
import ProductAddForm from "@/app/products/_components/product-add-form";

import { cache } from "react";
import type { Metadata, ResolvingMetadata } from "next";

const getDetail = cache(productApiRequest.getDetail);

type Props = {
  params: { id: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const { payload } = await getDetail(Number(params.id));
  const product = payload.data;

  return {
    title: "Edit sản phẩm: " + product.name,
    description: product.description,
  };
}

export default async function ProductEdit({ params, searchParams }: Props) {
  let product = undefined;
  try {
    const { payload } = await getDetail(Number(params.id));
    product = payload.data;
  } catch (error) {
    console.log("error", error);
  }

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && <ProductAddForm product={product} />}
    </div>
  );
}
