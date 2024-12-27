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

Có 2 loại page: static rendering và dynamic rendering.

- Dynamic rendering: không build ra html sẵn.-> Mỗi 1 lần request thì mới tạo ra html -> tăng work lost lên server.
- Khi ta dùng dynamic function trong component tree (children, parent component, hoặc layout...): cookies, headers, search params (?a=1&b=2). -> thì chuyển page thành
  dynamic rendering.

- Do set là http readonly -> nếu muốn xóa thì phải thông qua next server.
- Có 2 cách khi useQuery xử lý thành công

1. sử dụng useEffect fetch data
2. custom fucntion trong hook sử dụng useQuery (useAccountMe).

Important: Bài 35.
