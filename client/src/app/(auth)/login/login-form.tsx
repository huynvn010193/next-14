"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import envConfig from "@/config";
import { useToast } from "@/components/ui/use-toast";

interface LoginFormProps {}

export default function LoginForm(props: LoginFormProps) {
  const { toast } = useToast();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    try {
      const result = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      ).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload: payload,
        };
        if (!res.ok) {
          throw data;
        }
        return data;
      });
      toast({
        description: result.payload.message,
      });
    } catch (error: any) {
      const errors = (error as any).payload.errors as {
        field: string;
        message: string;
      }[];
      const status = error.status as number;
      if (status === 422) {
        for (const error of errors) {
          form.setError(error.field as keyof LoginBodyType, {
            type: "server",
            message: error.message,
          });
        }
      } else {
        toast({
          title: "Lỗi",
          description: error.payload.message,
          variant: "destructive",
        });
      }
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log(error);
        })}
        className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
        noValidate
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='!mt-8 w-full'>
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
