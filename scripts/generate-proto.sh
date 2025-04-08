#!/bin/bash

# Create the proto directory if it doesn't exist
mkdir -p src/proto

# Generate JavaScript code
protoc -I=src/proto \
  --js_out=import_style=commonjs,binary:src/proto \
  --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:src/proto \
  src/proto/auth.proto 