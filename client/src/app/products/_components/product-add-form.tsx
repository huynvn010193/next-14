"use client";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import authApiRequest from "@/apiRequest/auth";
import { useRouter } from "next/navigation";
import { clientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import {
  CreateProductBody,
  CreateProductBodyType,
  ProductResType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.schema";
import productApiRequest from "@/apiRequest/product";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { set } from "date-fns";

type Product = ProductResType["data"];

type ProductAddProps = {
  product?: Product;
};

export default function ProductAddForm({ product }: ProductAddProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  // const { setSessionToken } = useAppContext();
  const router = useRouter();
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ?? 0,
      description: product?.description ?? "",
      image: product?.image ?? "",
    },
  });

  const [file, setFile] = useState<File | null>(null);

  // FIXME: image lấy từ form defaultValues
  const image = form.watch("image");

  const createProduct = async (values: CreateProductBodyType) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      const uploadImageResult = await productApiRequest.uploadImage(formData);
      const imageUrl = uploadImageResult.payload.data;
      const result = await productApiRequest.create({
        ...values,
        image: imageUrl,
      });
      toast({
        description: result.payload.message,
      });
      router.push("/products");
      router.refresh();
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (_values: UpdateProductBodyType) => {
    if (!product) return;
    setLoading(true);
    let values = _values;
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file as Blob);
        const uploadImageResult = await productApiRequest.uploadImage(formData);
        const imageUrl = uploadImageResult.payload.data;
        values = {
          ...values,
          image: imageUrl,
        };
      }

      const result = await productApiRequest.update(product.id, values);
      toast({
        description: result.payload.message,
      });
      // router.push("/products");
      router.refresh();
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  };

  // 2. Define a submit handler.
  async function onSubmit(values: CreateProductBodyType) {
    if (loading) return;
    if (product) {
      updateProduct(values);
    } else {
      createProduct(values);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log(error);
          console.log(form.getValues("image"));
        })}
        className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
        noValidate
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder='Tên' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input placeholder='giá' type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder='mô tả' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  ref={inputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      field.onChange("http://localhost:3000/" + file.name);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(file || image) && (
          <div>
            <Image
              src={file ? URL.createObjectURL(file) : image} // TODO: cú pháp chuyển từ file ảnh sang src, sử dụng dấu ! cuối cùng để bảo ko thể undefined
              width={128}
              height={128}
              alt='preview'
              className='w-32 h-32 object-cover'
            />
            <Button
              variant={"destructive"}
              size={"sm"}
              type='button'
              onClick={() => {
                setFile(null);
                form.setValue("image", "");
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
            >
              Xóa hình ảnh
            </Button>
          </div>
        )}
        <Button type='submit' className='!mt-8 w-full'>
          {product ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
        </Button>
      </form>
    </Form>
  );
}
