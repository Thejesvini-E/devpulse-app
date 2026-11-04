import api from './api';
import authService from './authService';

jest.mock('./api', () => ({ post: jest.fn() }));

describe('authService.register', () => {
  it('sends the selected registration role', async () => {
    const response = { data: { message: 'User registered successfully!' } };
    api.post.mockResolvedValue(response);

    const result = await authService.register({
      fullName: 'Amy Example',
      email: 'amy@example.com',
      username: 'amy',
      password: 'StrongPass123',
      confirmPassword: 'StrongPass123',
      role: 'ROLE_MANAGER',
    });

    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      fullName: 'Amy Example',
      email: 'amy@example.com',
      username: 'amy',
      password: 'StrongPass123',
      role: 'ROLE_MANAGER',
    });
    expect(result).toEqual(response.data);
  });

  it('propagates backend errors for the registration page to display', async () => {
    const error = { response: { data: { message: 'Email is already in use' } } };
    api.post.mockRejectedValue(error);

    await expect(authService.register({ username: 'amy' })).rejects.toBe(error);
  });
});

describe('authService.login', () => {
  beforeEach(() => localStorage.clear());

  it('stores the JWT response fields used by the existing authenticated session', async () => {
    const data = { token: 'jwt-token', role: 'ROLE_DEVELOPER', username: 'amy' };
    api.post.mockResolvedValue({ data });

    await expect(authService.login('amy', 'StrongPass123')).resolves.toEqual(data);

    expect(api.post).toHaveBeenCalledWith('/auth/login', { username: 'amy', password: 'StrongPass123' });
    expect(localStorage.getItem('token')).toBe('jwt-token');
    expect(localStorage.getItem('role')).toBe('ROLE_DEVELOPER');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(data);
  });
});
