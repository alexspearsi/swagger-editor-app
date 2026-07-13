import { screen } from '@testing-library/react';

import { SchemaViewer } from '@/components/swagger/SchemaViewer';
import type { OpenAPISchema } from '@/types/openapi';

import { renderWithProviders } from '../test-utils';

const schema: OpenAPISchema = {
  openapi: '3.0.0',
  info: { title: 'Pet Store', version: '1.0.0' },
  paths: {
    '/pets': {
      get: {
        summary: 'List pets',
        responses: { '200': { description: 'OK' } },
      },
    },
  },
};

describe('SchemaViewer', () => {
  it('shows the placeholder when there is no schema and no error', () => {
    renderWithProviders(<SchemaViewer schema={null} />);

    expect(screen.getByText('Paste a valid OpenAPI schema in the editor')).toBeInTheDocument();
  });

  it('shows the error message instead of the placeholder when parsing failed', () => {
    renderWithProviders(<SchemaViewer schema={null} error="Invalid JSON: Unexpected token" />);

    expect(screen.getByText('Invalid JSON: Unexpected token')).toBeInTheDocument();
    expect(
      screen.queryByText('Paste a valid OpenAPI schema in the editor'),
    ).not.toBeInTheDocument();
  });

  it('renders the API title, version and endpoint list for a valid schema', () => {
    renderWithProviders(<SchemaViewer schema={schema} />);

    expect(screen.getByText('Pet Store')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('/pets')).toBeInTheDocument();
    expect(screen.getByText('get')).toBeInTheDocument();
  });

  it('shows a message when the schema has no endpoints', () => {
    renderWithProviders(
      <SchemaViewer
        schema={{ openapi: '3.0.0', info: { title: 'Empty', version: '1.0.0' }, paths: {} }}
      />,
    );

    expect(screen.getByText('No endpoints found in schema')).toBeInTheDocument();
  });
});
