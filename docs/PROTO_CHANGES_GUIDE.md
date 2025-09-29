# Proto File Changes - Quick Guide

## When You Modify `shared/proto/example_service.proto`

The proto file is the **single source of truth** for both Python and Node.js services. When you make changes to it, follow these steps:

## 🔄 What Happens Automatically

### For Node.js Service
TypeScript types are **automatically regenerated** when you run:
- `npm run dev` - Types regenerate before running
- `npm run build` - Types regenerate before building

**You don't need to do anything!** The types will be in sync.

## 🛠️ Manual Type Regeneration (if needed)

### Node.js Service

```bash
cd services/backend-nodejs
npm run generate-proto
```

This will:
1. Clean the `src/grpc/generated/` directory
2. Generate fresh TypeScript types from the proto file
3. Types automatically convert snake_case → camelCase

### Python Service

```bash
cd services/backend-python
python -m grpc_tools.protoc \
  -I../../shared/proto \
  --python_out=proto_generated \
  --grpc_python_out=proto_generated \
  ../../shared/proto/example_service.proto
```

Or if you have a generation script:
```bash
# From project root
npm run generate-proto
```

## 📝 Example Workflow

### Adding a New RPC Method

1. **Update proto file** (`shared/proto/example_service.proto`):
   ```protobuf
   service ExampleService {
     rpc GetUser(GetUserRequest) returns (GetUserResponse);
     rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
     rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
     
     // NEW METHOD
     rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);
   }
   
   message DeleteUserRequest {
     int32 user_id = 1;
   }
   
   message DeleteUserResponse {
     bool success = 1;
   }
   ```

2. **For Node.js** - Types regenerate automatically:
   ```bash
   cd services/backend-nodejs
   npm run dev  # Types are regenerated automatically
   ```
   
   Then add the method to `src/services/user.service.ts`:
   ```typescript
   async deleteUser(userId: number): Promise<boolean> {
     const client = this.grpcClient.getClient();
     const deleteUserAsync = promisify(client.DeleteUser.bind(client));
     
     const request: DeleteUserRequest = { userId };
     const response = await deleteUserAsync(request);
     
     return response.success || false;
   }
   ```

3. **For Python** - Regenerate and implement:
   ```bash
   cd services/backend-python
   # Regenerate proto files (if not automated)
   python -m grpc_tools.protoc ...
   ```
   
   Then implement in `src/api/example_service.py`:
   ```python
   def DeleteUser(self, request, context):
       user_id = request.user_id
       if user_id in self.users:
           del self.users[user_id]
           return DeleteUserResponse(success=True)
       return DeleteUserResponse(success=False)
   ```

### Modifying an Existing Message

1. **Update proto file**:
   ```protobuf
   message User {
     int32 id = 1;
     string name = 2;
     string email = 3;
     int64 created_at = 4;
     int64 updated_at = 5;
     string phone = 6;  // NEW FIELD
   }
   ```

2. **Node.js** - Types update automatically on next run:
   ```bash
   npm run dev  # User type now includes 'phone?: string'
   ```

3. **Python** - Regenerate proto files and update code

## ⚠️ Important Notes

### Field Naming Convention
- **Proto file**: Use `snake_case` (e.g., `user_id`, `page_size`)
- **Node.js/TypeScript**: Automatically converts to `camelCase` (e.g., `userId`, `pageSize`)
- **Python**: Stays as `snake_case` (e.g., `user_id`, `page_size`)

### Example:
```protobuf
// Proto
message GetUserRequest {
  int32 user_id = 1;  // snake_case
}
```

```typescript
// Node.js/TypeScript (auto-generated)
interface GetUserRequest {
  userId?: number;  // camelCase
}
```

```python
# Python (generated)
request.user_id  # snake_case
```

### Breaking Changes
When making **breaking changes** to the proto file:
1. Version your API (e.g., create `v2` messages/services)
2. Regenerate types for all services
3. Update implementations in both Python and Node.js
4. Test thoroughly before deploying

## 🔍 Verify Changes

### Check Generated Types (Node.js)
```bash
cd services/backend-nodejs
cat src/grpc/generated/example/User.ts
```

### Check Generated Types (Python)
```bash
cd services/backend-python
cat proto_generated/example_service_pb2.py
```

## 🚀 Quick Reference

| Action | Node.js Command | Auto? |
|--------|----------------|-------|
| Run dev | `npm run dev` | ✅ Yes |
| Build | `npm run build` | ✅ Yes |
| Manual regen | `npm run generate-proto` | ❌ No |

## 📂 Generated Files Location

- **Node.js**: `services/backend-nodejs/src/grpc/generated/`
  - ⚠️ Excluded from git
  - ⚠️ DO NOT manually edit

- **Python**: `services/backend-python/proto_generated/`
  - ⚠️ May be in git (check .gitignore)
  - ⚠️ DO NOT manually edit

## 💡 Tips

1. **Always commit proto changes first** before regenerating types
2. **Test both services** after proto changes
3. **The proto file is the contract** - keep it stable in production
4. **Use semantic versioning** for major proto changes
5. **Document your proto file** with comments - they appear in generated code!

## 🆘 Troubleshooting

**Types not updating?**
```bash
cd services/backend-nodejs
npm run generate-proto
```

**Build errors after proto change?**
1. Check field names (snake_case in proto → camelCase in TypeScript)
2. Regenerate types: `npm run generate-proto`
3. Update service implementations

**Python not seeing changes?**
```bash
cd services/backend-python
# Regenerate Python proto files
python -m grpc_tools.protoc ...
```
