/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { normalizePath } from "./utils";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

// TODO: viết hàm Promise delay
export const promiseDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// TODO: kiểu dữ liệu giống như format API trã về.
type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  // TODO: payload lúc nào cũng có message và 1 kiểu dữ liệu chưa biết.
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({
    status,
    payload,
    message = "Lỗi HTTP",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload, message: "Lỗi thực thể" });
    this.status = status;
    this.payload = payload;
  }
}

// TODO: biến này check để call logout 1 lần.
let clientLogoutRequest: null | Promise<any> = null;

export const isClient = typeof window !== "undefined";

type baseHeaderType = {
  [key: string]: string;
};

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: CustomOptions | undefined
) => {
  // TODO: nếu body là FormData (là kiểu dữ liệu dùng cho upload file) thì không cần JSON.stringify. còn ko thì phải JSON.stringify.
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const baseHeader: baseHeaderType =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

  if (isClient) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      baseHeader.Authorization = `Bearer ${accessToken}`;
    }
  }

  // TODO: nếu api call lên NextServer thì phải truyền baseUrl vào tham số options: "",
  // Còn call lên server thì không cần truyền.
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  // TODO: nếu mà url bắt đầu bằng "/" thì bỏ đi ký tự đầu tiên. còn không thì giữ nguyên.
  const fullUrl = `${baseUrl}/${normalizePath(url)}`;

  // TODO: nếu mà ko truyền header vào options thì lấy header mặc định (baseHeader).
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeader,
      ...options?.headers,
    } as any, // TODO: ép kiểu về any để chấp nhật "Content-Type" ko cần truyền
    body,
    method,
  });

  const payload: Response = await res.json();

  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as { status: 422; payload: EntityErrorPayload }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      // TODO: chỉ chạy trên browser, trường hợp logout ở client.
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: null, // logout sẽ cho phép luôn luôn thành công.
            headers: {
              ...baseHeader,
            } as any,
          });

          try {
            await clientLogoutRequest;
          } catch (error) {
            console.error("Lỗi logout", error);
          } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // TODO: khi gọi API logout thì set lại bằng null
            clientLogoutRequest = null;

            // TODO: Vì accessToekn đã bị xóa nên phải redirect về trang login.nếu sửa dụng API có accessToekn thì sẽ bị
            // vòng lặp vô hạn.
            location.href = "/login";
          }
        }
      } else {
        // TODO: trường hợp logout ở server.
        // Khi gọi server component gọi lên server thì sẽ truyền accessToekn trong Authorization header. (xem accountApiRequest.me)
        const accessToekn = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`logout?accessToekn=${accessToekn}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  // TODO: Đảm bảo logic dưới đây chỉ chạy ở client (browser) - trường hợp Login và Logout.
  if (isClient) {
    const normalizedUrl = normalizePath(url);

    // set token khi cái url thỏa điều kiện
    if ("api/auth/login" === normalizedUrl) {
      const { accessToken, refreshToken } = (payload as LoginResType).data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else if ("api/auth/logout" === normalizedUrl) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
