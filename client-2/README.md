git commit --amend --no edit

- Biến môi trường: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

* Ở server thì chỉ có server truy cập. còn ở browser thì server và client đều truy cập dc
* Ở browser phải bắt đầu bằng NEXT_PUBLIC

Độ ưu tiên khi chạy biến môi trường
1 process.env
2 .env.$(NODE_ENV).local
3 .env.local (Not checked when NODE_ENV is test.)
4 .env.$(NODE_ENV)
5 .env

- Tạo file config.ts -> validate giá trị từ .env, và dùng biến từ file này. validate sẽ dùng zod.
  admin@order.com - 123456
