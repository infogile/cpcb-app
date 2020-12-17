export interface ILoginRequestState {
  type: String;
  username: string;
  password: string;
}

interface IResponse {
  token: string;
}

export interface ILoginResponseState {
  type: String;
  response: IResponse;
}
