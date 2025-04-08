import * as grpcWeb from 'grpc-web';

import * as auth_pb from './auth_pb'; // proto import: "auth.proto"


export class AuthServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  registerUser(
    request: auth_pb.RegisterUserRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.RegisterUserResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.RegisterUserResponse>;

  loginUser(
    request: auth_pb.LoginUserRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.LoginUserResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.LoginUserResponse>;

  validateToken(
    request: auth_pb.ValidateTokenRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.ValidateTokenResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.ValidateTokenResponse>;

}

export class AuthServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  registerUser(
    request: auth_pb.RegisterUserRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.RegisterUserResponse>;

  loginUser(
    request: auth_pb.LoginUserRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.LoginUserResponse>;

  validateToken(
    request: auth_pb.ValidateTokenRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.ValidateTokenResponse>;

}

