const auth = require('../auth');
const jwt = require('jsonwebtoken');
const config = require('../../config');

// Mock jwt y config para aislar el middleware
jest.mock('jsonwebtoken');
jest.mock('../../config', () => ({
  jwtSecret: 'testSecret',
}));

describe('auth middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if a valid token is provided', () => {
    const token = 'validToken';
    const decodedUser = { id: '123', name: 'testuser' };
    mockReq.header = jest.fn().mockReturnValue(token);
    jwt.verify.mockReturnValue({ user: decodedUser });

    auth(mockReq, mockRes, mockNext);

    expect(mockReq.header).toHaveBeenCalledWith('x-auth-token');
    expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
    expect(mockReq.user).toEqual(decodedUser);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', () => {
    mockReq.header = jest.fn().mockReturnValue(undefined);

    auth(mockReq, mockRes, mockNext);

    expect(mockReq.header).toHaveBeenCalledWith('x-auth-token');
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: 'No token, authorization denied' });
  });

  it('should return 401 if the token is not valid', () => {
    const token = 'invalidToken';
    mockReq.header = jest.fn().mockReturnValue(token);
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    auth(mockReq, mockRes, mockNext);

    expect(mockReq.header).toHaveBeenCalledWith('x-auth-token');
    expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Token is not valid' });
  });
});
