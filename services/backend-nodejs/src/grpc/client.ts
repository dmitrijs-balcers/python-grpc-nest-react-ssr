import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ProtoGrpcType } from './generated/example_service';
import { ExampleServiceClient } from './generated/example/ExampleService';

/**
 * gRPC Client for connecting to the Python backend service
 */
@Injectable()
export class GrpcClient implements OnModuleInit, OnModuleDestroy {
  private client: ExampleServiceClient | null = null;
  private readonly serverAddress: string;

  constructor() {
    this.serverAddress = process.env.GRPC_SERVER_ADDRESS || 'localhost:50051';
  }

  /**
   * Initialize the gRPC client by loading proto and creating connection
   * Called automatically when the module is initialized
   */
  async onModuleInit(): Promise<void> {
    await this.initialize();
  }

  /**
   * Initialize the gRPC client by loading proto and creating connection
   */
  async initialize(): Promise<void> {
    const PROTO_PATH = path.resolve(__dirname, '../../../../shared/proto/example_service.proto');
    
    console.log(`📁 Loading proto file from: ${PROTO_PATH}`);
    
    // Load proto file with appropriate options
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: false,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    // Load the gRPC package definition
    const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
    
    // Create the client instance
    this.client = new proto.example.ExampleService(
      this.serverAddress,
      grpc.credentials.createInsecure()
    );
    
    console.log(`✅ gRPC client initialized and connected to ${this.serverAddress}`);
  }

  /**
   * Get the gRPC client instance
   * @throws Error if client is not initialized
   */
  getClient(): ExampleServiceClient {
    if (!this.client) {
      throw new Error('gRPC client not initialized. Call initialize() first.');
    }
    return this.client;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.client !== null;
  }

  /**
   * Close the client connection
   * Called automatically when the module is destroyed
   */
  onModuleDestroy(): void {
    this.close();
  }

  /**
   * Close the client connection
   */
  close(): void {
    if (this.client) {
      grpc.closeClient(this.client);
      this.client = null;
      console.log('✅ gRPC client connection closed');
    }
  }
}

export default GrpcClient;
