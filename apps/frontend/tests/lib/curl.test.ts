import { generateCurl } from '@/app/lib/swagger/curl';

describe('generateCurl', () => {
  it('generates a basic GET request without headers or body', () => {
    const result = generateCurl('https://api.example.com/users', 'get', {});

    expect(result).toBe("curl -X GET 'https://api.example.com/users'");
  });

  it('includes headers with non-empty values', () => {
    const result = generateCurl('https://api.example.com/users', 'get', {
      'Content-Type': 'application/json',
      'X-Empty': '',
    });

    expect(result).toContain("-H 'Content-Type: application/json'");
    expect(result).not.toContain('X-Empty');
  });

  it('includes the request body and escapes single quotes', () => {
    const result = generateCurl('https://api.example.com/users', 'post', {}, '{"name":"O\'Brien"}');

    expect(result).toContain('-d \'{"name":"O\\\'Brien"}\'');
  });

  it('uppercases the HTTP method', () => {
    const result = generateCurl('https://api.example.com/users', 'delete', {});

    expect(result).toContain('curl -X DELETE');
  });
});
