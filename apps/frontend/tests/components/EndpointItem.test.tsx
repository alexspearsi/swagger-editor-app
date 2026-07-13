import { fireEvent, screen } from '@testing-library/react';

import { EndpointItem } from '@/components/swagger/EndpointItem';
import type { Operation } from '@/types/openapi';

import { renderWithProviders } from '../test-utils';

const operation: Operation = {
  summary: 'Get a pet by id',
  description: 'Returns a single pet',
  parameters: [
    { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
    { name: 'verbose', in: 'query', schema: { type: 'boolean' } },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: { type: 'object' },
        example: { name: 'Rex' },
      },
    },
  },
  responses: {
    '200': {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: { type: 'object' },
          example: { id: '1', name: 'Rex' },
        },
      },
    },
    '404': { description: 'Not found' },
  },
};

describe('EndpointItem', () => {
  it('renders the method badge, path and summary collapsed by default', () => {
    renderWithProviders(
      <EndpointItem path="/pets/{id}" method="get" operation={operation} serverUrl="" />,
    );

    expect(screen.getByText('get')).toBeInTheDocument();
    expect(screen.getByText('/pets/{id}')).toBeInTheDocument();
    expect(screen.getByText('Get a pet by id')).toBeInTheDocument();
    expect(screen.queryByText('Returns a single pet')).not.toBeInTheDocument();
  });

  it('expands to show parameters, request body and response details', () => {
    renderWithProviders(
      <EndpointItem path="/pets/{id}" method="get" operation={operation} serverUrl="" />,
    );

    fireEvent.click(screen.getByText('/pets/{id}'));

    expect(screen.getByText('Returns a single pet')).toBeInTheDocument();

    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('path')).toBeInTheDocument();
    expect(screen.getByText('verbose')).toBeInTheDocument();
    expect(screen.getByText('query')).toBeInTheDocument();

    expect(screen.getAllByText(/"name": "Rex"/)).toHaveLength(2);

    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('Successful response')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not found')).toBeInTheDocument();

    expect(screen.getByText(/"id": "1"/)).toBeInTheDocument();
  });

  it('toggles the Try it out panel', () => {
    renderWithProviders(
      <EndpointItem path="/pets/{id}" method="get" operation={operation} serverUrl="" />,
    );

    fireEvent.click(screen.getByText('/pets/{id}'));
    expect(screen.queryByRole('button', { name: 'Execute' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Try it out ▼'));
    expect(screen.getByText('Hide Try-It-Out ▲')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Execute' })).toBeInTheDocument();
  });
});
