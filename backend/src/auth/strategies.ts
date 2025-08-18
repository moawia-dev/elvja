import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Request } from 'express';

export function configurePassport(passport: any, prisma: PrismaService, auth: AuthService) {
  const google = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
  }, async (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;
      if (!email) return done(null, false);
      const user = await auth.upsertUser(email, name);
      // inject a token helper on req (hack to avoid DI in controller)
      (req as any).userToken = (u: any) => auth.issueJwt(u);
      done(null, user);
    } catch (e) { done(e); }
  });
  passport.use(google);

  const linkedin = new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3000/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile'],
    passReqToCallback: true,
    state: true
  }, async (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const email = (profile as any).emails?.[0]?.value;
      const name = profile.displayName;
      if (!email) return done(null, false);
      const user = await auth.upsertUser(email, name);
      (req as any).userToken = (u: any) => auth.issueJwt(u);
      done(null, user);
    } catch (e) { done(e); }
  });
  passport.use(linkedin);
}
