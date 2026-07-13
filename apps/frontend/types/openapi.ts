export interface OpenAPISchema {
  openapi?: string;
  swagger?: string;
  info?: ApiInfo;
  paths?: Record<string, PathItem>;
  components?: Components;
  tags?: Tag[];
  servers?: Array<{ url: string; description?: string }>;
}

export interface ApiInfo {
  title: string;
  version: string;
  description?: string;
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
  head?: Operation;
  options?: Operation;
  parameters?: Parameter[];
}

export interface Operation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses?: Record<string, ApiResponse>;
  deprecated?: boolean;
}

export interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  description?: string;
  schema?: SchemaObject;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content?: Record<string, MediaType>;
}

export interface MediaType {
  schema?: SchemaObject;
  example?: unknown;
}

export interface ApiResponse {
  description?: string;
  content?: Record<string, MediaType>;
}

export interface SchemaObject {
  type?: string;
  format?: string;
  description?: string;
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  required?: string[];
  enum?: unknown[];
  $ref?: string;
  example?: unknown;
}

export interface Components {
  schemas?: Record<string, SchemaObject>;
}

export interface Tag {
  name: string;
  description?: string;
}

export const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];
