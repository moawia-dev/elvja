import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async upsertUser(email: string, name?: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({ data: { email, name, role: 'user' } });
      // create a default account and link
      const account = await this.prisma.account.create({ data: { name: `${name || 'Kund'}s konto` } });
      // relation via join table implicit (many-to-many) - using link by update
      await this.prisma.account.update({ where: { id: account.id }, data: { users: { connect: { id: user.id } } } });
    }
    return user;
  }

  issueJwt(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  }
}
