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
Bài 36: Ở Server component khi ta gọi API trong try...catch mà trong API đó có redirect thì sẽ throw ra 1 lỗi và dừng redirect.

- Cách 1: ko dùng try catch khi call API.

* Các trường hợp hết hạn access token:

1. Đang dùng thì hết hạn: chúng ta sẽ không để trường hợp này xảy ra -> bằng cách set 1 setinterval check token liên tục để refresh token trước khi nó hết hạn.
2. Lâu ngày không vào web -> vào lại thì hết hạn.

caching router của NextJS tồn tại 30s.

clip 43: đoạn http://localhost:3000/manage/dashboard -> nên copy paste vì nếu gõ tay: code sẽ chạy vào Layout -> Comp Refresh-token => lúc này sẽ xóa lun localstorage

http://localhost:3000/manage/dashboard

- Trong trang login có 2 phần có useEffect: 1 trong login và 2 là trong NavItem: Do phần bên login chạy trước nên localStorage đã bị xóa. -> Khắc phục: tạo 1 context API
  bên app-provider.tsx
