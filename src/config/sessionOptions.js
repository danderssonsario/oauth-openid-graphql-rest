/**
 * @file This module contains the options object for the session middleware.
 * @module sessionOptions
 * @author Daniel Andersson
 */
export const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'none'
  }
}

if (process.env.NODE_ENV === 'production') {
  sessionOptions.cookie.secure = true // serve secure cookies
  sessionOptions.cookie.sameSite = 'secure'
}
