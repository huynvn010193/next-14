NextJS có 2 loại: ảnh lưu trong source code và ảnh từ bên ngoài
Dùng <Link> khi hover vào có thấy đường link hiển thị -> còn dùng function chuyển trang thì ko có.
redirect: chỉ chạy ở Server component. Vẫn có thể chạy trong client Comp nhưng không chạy trong event handler.

13. Next.js render components của chúng ta như thế nào?
    https://www.youtube.com/watch?v=iBH-ofQ5aI8&list=PLFfVmM19UNqn1ZIWvxn1artfz-C6dgAFb&index=14

https://github.com/duthanhduoc/nextjs-free

-- 21/08/2024
Cài đặt:

- npx shadcn-ui@latest add form
- Dùng hook và dùng sự kiện là phải use client.

trong file .env nếu ko có tiền tố NEXT_PUBLIC thì chỉ chạy dc phía server.

- 18: Quản lý authentication:

* Tạo 1 Router handler trong NextJS: app -> api - auth.

- Cookie chỉ lấy dc trong:

1. router handler
2. trong page.

- 22/10: cài package: date fns
-> Càng hạn chết client component thì website load càng nhanh.
