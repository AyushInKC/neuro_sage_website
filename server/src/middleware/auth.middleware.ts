import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { User, IUser } from '../models/User.js';

export interface AuthenticatedUserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
    }
  }
}

export function generateTokens(payload: AuthenticatedUserPayload) {
  const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpiresIn as any,
  });
  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn as any,
  });
  return { accessToken, refreshToken };
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
  });
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const accessToken =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken && !refreshToken) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  // Verify access token if present
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, config.jwtAccessSecret) as AuthenticatedUserPayload;
      req.user = decoded;
      return next();
    } catch (err: any) {
      // Access token expired, fallback to refresh token check
      if (err.name !== 'TokenExpiredError') {
        res.status(401).json({ success: false, message: 'Invalid authentication token' });
        return;
      }
    }
  }

  // Refresh token flow
  if (!refreshToken) {
    res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    return;
  }

  try {
    const decodedRefresh = jwt.verify(
      refreshToken,
      config.jwtRefreshSecret
    ) as AuthenticatedUserPayload;

    const user = await User.findById(decodedRefresh.id);
    if (!user) {
      clearAuthCookies(res);
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    // Verify refresh token in user's saved tokens
    const tokenExists = user.refreshTokens.some(
      (t) => t.token === refreshToken && t.expiresAt > new Date()
    );

    if (!tokenExists) {
      clearAuthCookies(res);
      res.status(401).json({ success: false, message: 'Session revoked or invalid' });
      return;
    }

    const payload: AuthenticatedUserPayload = {
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const newTokens = generateTokens(payload);
    // Update refresh token in DB
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
    user.refreshTokens.push({
      token: newTokens.refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);
    req.user = payload;
    next();
  } catch (err) {
    clearAuthCookies(res);
    res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
}
