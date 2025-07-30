import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Existing simple login
  @Post('wallet-login')
  async loginWithWallet(@Body('walletAddress') walletAddress: string) {
    return this.authService.loginWithWallet(walletAddress);
  }

  // ✅ Add this for signed message verification
  @Post('verify')
  async verifyWalletSignature(@Body() body: any) {
    const { walletAddress, signedMessage, originalMessage } = body;
    return this.authService.verifyLogin(walletAddress, signedMessage, originalMessage);
  }
}
