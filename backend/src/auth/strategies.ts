// src/auth/strategies.ts
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { PassportStatic } from 'passport';

export function configurePassport(passport: PassportStatic) {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET,
    LINKEDIN_CALLBACK_URL,
  } = process.env;

  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL) {
    passport.use(new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      (_accessToken, _refreshToken, profile, done) => done(null, profile),
    ));
  } else {
    console.warn('Google OAuth disabled: missing GOOGLE_* envs');
  }

  if (LINKEDIN_CLIENT_ID && LINKEDIN_CLIENT_SECRET && LINKEDIN_CALLBACK_URL) {
    passport.use(new LinkedInStrategy(
      {
        clientID: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        callbackURL: LINKEDIN_CALLBACK_URL,
        scope: ['r_liteprofile','r_emailaddress'],
      },
      (_accessToken, _refreshToken, profile, done) => done(null, profile),
    ));
  } else {
    console.warn('LinkedIn OAuth disabled: missing LINKEDIN_* envs');
  }
}
