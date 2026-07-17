export interface OneCClient {
  get<T>(resource: string): Promise<T>;
  post<TBody, TResult>(resource: string, body: TBody): Promise<TResult>;
}

export class MockOneCClient implements OneCClient {
  async get<T>(_resource: string): Promise<T> {
    throw new Error('MockOneCClient.get must be handled by a repository adapter');
  }

  async post<TBody, TResult>(_resource: string, body: TBody): Promise<TResult> {
    return { success: true, payload: body } as TResult;
  }
}

export const oneCClient = new MockOneCClient();
