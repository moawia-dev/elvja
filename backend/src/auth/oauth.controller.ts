import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import * as passport from 'passport';

@Controller('auth')
export class OauthController {
  @Get('google/start')
  googleStart(@Req() req: any, @Res() res: Response) {
    (passport.authenticate('google', { scope: ['profile', 'email'] }) as any)(req, res);
  }

  @Get('google/callback')
  googleCallback(@Req() req: any, @Res() res: Response) {
    (passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
      if (err || !user) return res.redirect('/login?error=google');
      const token = req.userToken(user);
      res.redirect(`/login#token=${token}`);
    }) as any)(req, res);
  }

  @Get('linkedin/start')
  linkedinStart(@Req() req: any, @Res() res: Response) {
    (passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }) as any)(req, res);
  }

  @Get('linkedin/callback')
  linkedinCallback(@Req() req: any, @Res() res: Response) {
    (passport.authenticate('linkedin', { session: false }, (err: any, user: any) => {
      if (err || !user) return res.redirect('/login?error=linkedin');
      const token = req.userToken(user);
      res.redirect(`/login#token=${token}`);
    }) as any)(req, res);
  }
}
