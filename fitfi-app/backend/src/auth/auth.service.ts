import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async loginWithWallet(walletAddress: string) {
    let user = await this.prisma.user.findUnique({ where: { wallet_address: walletAddress } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          wallet_address: walletAddress,
          username: `user_${Math.floor(Math.random() * 100000)}`,
          email: `${walletAddress}@fitfi.app`,
          profile_pic: '',
          subscription_status: false,
          totalPoints: 0,
          totalSteps: 0,
        },
      });
    }

    return sanitizeUser(user);
  }

  async verifyLogin(walletAddress: string, signedMessage: string, originalMessage: string) {
    let user = await this.prisma.user.findUnique({ where: { wallet_address: walletAddress } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          wallet_address: walletAddress,
          username: `user_${Math.floor(Math.random() * 100000)}`,
          email: `${walletAddress}@fitfi.app`,
          profile_pic: '',
          subscription_status: false,
          totalPoints: 0,
          totalSteps: 0,
        },
      });
    }

    return sanitizeUser(user);
  }
}

// 🔧 Helper
function sanitizeUser(user: any) {
  return {
    ...user,
    user_id: Number(user.user_id),
    totalPoints: Number(user.totalPoints),
    totalSteps: Number(user.totalSteps),
  };
}
