class Api {

  constructor(private readonly baseUrl: string, private readonly onUnauthenticated: Function) { }

  async exchange({ path, method, body }: { path: string, method: string, body: any | undefined }): Promise<Response> {
    try {
      const response = await fetch(this.fullUrl(path), {
        method: method,
        headers: {
          "content-type": "application/json"
        },
        body: body ? JSON.stringify(body) : null,
        credentials: "include"
      });
      if (response.status == 401) {
        this.onUnauthenticated();
      }
      const json = this.hasJsonContent(response.headers) ? await response.json() : null;
      return new Response(response.ok, json);
    } catch (e) {
      return new Response(false, {
        errors: ["UNKNOWN_ERROR"],
        message: e instanceof Error ? e.message : e
      });
    }
  }

  private hasJsonContent(headers: Headers): boolean {
    const contentType = headers.get('content-type');
    return contentType != null && contentType.includes("application/json");
  }

  private fullUrl(path: string): string {
    return `${this.baseUrl}/${path}`;
  }

  post(path: string, body: any | undefined = null): Promise<Response> {
    return this.exchange({ path, method: "POST", body });
  }

  put(path: string, body: any | undefined = null): Promise<Response> {
    return this.exchange({ path, method: "PUT", body });
  }

  get(path: string): Promise<Response> {
    return this.exchange({ path, method: "GET", body: null });
  }

  delete(path: string, body: any | undefined = null): Promise<Response> {
    return this.exchange({ path, method: "DELETE", body });
  }
}

export class Response {
  constructor(readonly success: boolean, readonly data: any | undefined) {

  }

  errors(): string[] {
    return this.data?.errors ?? [];
  }
}

export const api = new Api(import.meta.env.VITE_API_BASE_URL,
  () => {
    setTimeout(() => location.href = "/sign-in", 500);
  }
);