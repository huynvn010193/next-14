import ProductAddForm from "@/app/products/_components/product-add-form";

export interface ProducePageProps {}

export default function ProducePageProps(props: ProducePageProps) {
  return (
    <div>
      <h1>Thêm sản phẩm</h1>
      <ProductAddForm />
    </div>
  );
}
