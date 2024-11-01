import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { normalizePath } from "./utils";
import { redirect } from "next/navigation";

type CustomOptions = RequestInit & { baseUrl?: string | undefined };

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
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private token = "";
  private _expiresAt = new Date().toISOString();
  get value() {
    return this.token;
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Can't set session token on server");
    }
    this.token = token;
  }
  get expiresAt() {
    return this._expiresAt;
  }
  set expiresAt(expiresAt: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Can't set session token on server");
    }
    this._expiresAt = expiresAt;
  }
}

export const clientSessionToken = new SessionToken();

// TODO: biến này check để call logout 1 lần.
let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: CustomOptions | undefined
) => {
  // TODO: nếu body là FormData thì không cần JSON.stringify
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  // TODO: nếu body là FormData thì không cần "Content-Type"
  const baseHeader =
    body instanceof FormData
      ? {
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        }
      : {
          "Content-Type": "application/json",
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        };

  // TODO: nếu api call lên NextServer thì phải truyền baseUrl: "",
  // Còn call lên server thì không cần truyền.
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  // TODO: nếu mà ko truyền header vào options thì lấy header mặc định
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
      if (typeof window !== "undefined") {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeader,
            } as any,
          });
          await clientLogoutRequest;
          clientSessionToken.value = "";

          clientSessionToken.expiresAt = new Date().toISOString();

          // TODO: khi gọi API logout thì set lại bằng null
          clientLogoutRequest = null;
          location.href = "/login";
        }
      } else {
        // TODO: trường hợp logout ở server.
        // Khi gọi server component gọi lên server thì sẽ truyền sessionToken trong Authorization header. (xem accountApiRequest.me)
        const sessionToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  // TODO: Đảm bảo logic dưới đây chỉ chạy ở client (browser) - trường hợp Login và Logout.
  if (typeof window !== "undefined") {
    // set token khi cái url thỏa điều kiện
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      clientSessionToken.value = (payload as LoginResType).data.token;
      clientSessionToken.expiresAt = (payload as LoginResType).data.expiresAt;
    } else if ("/auth/logout" === normalizePath(url)) {
      clientSessionToken.value = "";
      clientSessionToken.expiresAt = new Date().toISOString();
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
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
