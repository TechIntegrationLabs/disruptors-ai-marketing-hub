# API Integration Documentation

This document describes the API integration patterns and architecture used in the Disruptors AI Marketing Hub.

## Architecture Overview

The application uses a custom SDK that provides Base44-compatible interfaces while using Supabase as the backend database. This allows for seamless migration from Base44 services while maintaining familiar API patterns.

## Core Components

### 1. Supabase Client (`src/lib/supabase-client.js`)

The base Supabase client configuration with environment-aware setup:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'http://127.0.0.1:54321')
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'default_key')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Features:**
- Environment variable detection for both Vite and Node.js
- Default local development configuration
- Anonymous key authentication

### 2. Custom SDK (`src/lib/custom-sdk.js`)

Base44-compatible wrapper around Supabase with advanced features:

#### Entity System

Dynamic entity creation with automatic table name mapping:

```javascript
// Usage Examples
const users = customClient.entities.User;
const posts = customClient.entities.BlogPost; // Maps to 'blog_post' table

// CRUD Operations
const user = await users.get('user-id');
const newUser = await users.create({ name: 'John Doe', email: 'john@example.com' });
const updatedUser = await users.update('user-id', { name: 'Jane Doe' });
await users.delete('user-id');

// Filtering and Ordering
const recentPosts = await posts.filter({ status: 'published' }, '-created_at', 10);
const allUsers = await users.list('name', 50);
```

#### Field Name Mapping

Automatic field mapping between Base44 and Supabase conventions:

| Base44 Field | Supabase Field |
|--------------|----------------|
| `created_date` | `created_at` |
| `updated_date` | `updated_at` |

#### Service Role vs Anonymous Access

The SDK automatically determines which entities require elevated permissions:

- **Service Role Entities**: User management, transactions, payments, admin operations
- **Anonymous Entities**: Public content, blog posts, general data

### 3. Authentication System

#### User Entity (`UserEntity` class)

Specialized entity for user management with authentication methods:

```javascript
// Authentication
await customClient.auth.login('dev'); // Development mode
await customClient.auth.login('google'); // OAuth
await customClient.auth.logout();

// User Data
const currentUser = await customClient.auth.me();
const isAuth = await customClient.auth.isAuthenticated();
const userData = await customClient.auth.getCurrentUser();

// User Management (Admin)
const allUsers = await customClient.auth.list();
const userByEmail = await customClient.auth.filter({ email: 'user@example.com' });
```

#### Development Mode

Simplified authentication for local development:

```javascript
// Automatically creates and signs in dev user
await customClient.auth.login('dev');
// Uses: dev@localhost.com / dev123456
// Auto-granted admin role
```

## Integration Patterns

### 1. Core Integrations

#### LLM Integration
```javascript
const response = await customClient.integrations.Core.InvokeLLM({
  prompt: "Generate a marketing headline",
  add_context_from_internet: false,
  response_json_schema: { type: "object", properties: { headline: { type: "string" } } }
});
```

#### Email Service
```javascript
await customClient.integrations.Core.SendEmail({
  to: "client@example.com",
  subject: "Welcome to Disruptors AI",
  body: "<h1>Welcome!</h1><p>Thank you for joining us.</p>",
  from_name: "Disruptors AI Team"
});
```

#### File Upload
```javascript
const result = await customClient.integrations.Core.UploadFile({
  file: fileObject
});
console.log(result.file_url); // Returns uploaded file URL
```

#### Image Generation
```javascript
const image = await customClient.integrations.Core.GenerateImage({
  prompt: "Professional business team collaborating"
});
console.log(image.url); // Generated image URL
```

#### Document Processing
```javascript
const extracted = await customClient.integrations.Core.ExtractDataFromUploadedFile({
  file_url: "https://example.com/document.pdf",
  json_schema: {
    type: "object",
    properties: {
      company_name: { type: "string" },
      contact_info: { type: "object" }
    }
  }
});
```

### 2. Error Handling Patterns

#### Graceful Table Handling
```javascript
try {
  const data = await entity.list();
} catch (error) {
  if (error.code === 'PGRST205') {
    console.warn(`Table ${entity.tableName} does not exist`);
    return []; // Return empty array for missing tables
  }
  throw error; // Re-throw other errors
}
```

#### Authentication Error Handling
```javascript
try {
  const user = await customClient.auth.me();
} catch (error) {
  if (error.message === 'Not authenticated') {
    // Redirect to login or show auth prompt
    return null;
  }
  throw error;
}
```

### 3. Environment Configuration

#### Required Variables
```bash
# Core Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_key

# AI Services (Optional - fallback to mock responses)
VITE_OPENAI_API_KEY=your_openai_key
VITE_REPLICATE_API_TOKEN=your_replicate_token
```

#### Environment Detection
```javascript
const getEnvVar = (key, defaultValue) => {
  // Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  // Node.js environment
  if (typeof globalThis !== 'undefined' && globalThis.process?.env) {
    return globalThis.process.env[key] || defaultValue;
  }
  return defaultValue;
};
```

## Migration from Base44

### 1. SDK Compatibility

The custom SDK maintains Base44 interface compatibility:

```javascript
// Base44 Pattern (unchanged)
import { base44 } from '@/api/base44Client.js';

const users = base44.entities.User;
const currentUser = await base44.auth.me();
```

### 2. Entity Patterns

| Base44 Method | Custom SDK Equivalent | Notes |
|---------------|----------------------|-------|
| `entity.list()` | `entity.list()` | Same interface |
| `entity.filter()` | `entity.filter()` | Same interface |
| `entity.get(id)` | `entity.get(id)` | Same interface |
| `entity.create(data)` | `entity.create(data)` | Same interface |
| `entity.update(id, data)` | `entity.update(id, data)` | Same interface |
| `entity.delete(id)` | `entity.delete(id)` | Same interface |

### 3. Integration Patterns

All Base44 integrations are mapped to equivalent implementations:

- **Core.InvokeLLM**: OpenAI GPT integration
- **Core.SendEmail**: Resend/SendGrid integration
- **Core.UploadFile**: Supabase Storage integration
- **Core.GenerateImage**: DALL-E/Stability AI integration
- **Core.ExtractDataFromUploadedFile**: OCR/document processing

## Best Practices

### 1. Entity Usage
- Use descriptive entity names (PascalCase)
- Tables are automatically snake_case mapped
- Always handle missing table scenarios gracefully

### 2. Authentication
- Check authentication status before sensitive operations
- Use service role entities for admin operations
- Implement proper error boundaries for auth errors

### 3. Data Mapping
- Use consistent field naming conventions
- Let the SDK handle created_at/updated_at mapping
- Validate data before database operations

### 4. Error Handling
- Implement graceful degradation for missing services
- Log integration errors for debugging
- Provide meaningful user feedback for failures

## Troubleshooting

### Common Issues

1. **Missing Table Errors**: Tables referenced but not created in Supabase
   - Solution: Create tables or handle gracefully with empty arrays

2. **Authentication Failures**: Invalid or expired tokens
   - Solution: Implement token refresh or re-authentication flow

3. **Environment Variables**: Missing or incorrect configuration
   - Solution: Verify .env setup and environment detection

4. **Service Role Access**: Insufficient permissions for admin operations
   - Solution: Verify service role key and RLS policies

### Debug Mode

Enable debug logging:
```javascript
// Set environment variable
VITE_DEBUG_API=true

// Or modify SDK directly
console.log('Entity operation:', entityName, operation, data);
```

This documentation provides comprehensive guidance for working with the API integration layer and should be updated as new patterns emerge or integrations are added.