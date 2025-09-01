import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PasswordReset,
  PasswordResetDocument,
} from './schemas/password-reset.schema';
import { RequestPasswordResetDto } from './dto/request-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-reset.dto';
import { EmailService } from '../../common/email/email.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

interface UserDoc {
  _id: any;
  email: string;
  password?: string;
}

@Injectable()
export class PasswordResetService {
  private CODE_LEN = Number(process.env.RESET_CODE_LENGTH || 6);
  private TTL_MIN = Number(process.env.RESET_CODE_TTL_MIN || 15);
  private MAX_ATTEMPTS = Number(process.env.RESET_MAX_ATTEMPTS || 5);
  private SECRET = process.env.RESET_SECRET || 'change-me-reset-secret';

  constructor(
    @InjectModel(PasswordReset.name)
    private prModel: Model<PasswordResetDocument>,
    @InjectModel('User') private userModel: Model<UserDoc>,
    private email: EmailService,
  ) {}

  private generateCode(): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < this.CODE_LEN; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }

  private hashCode(code: string): string {
    return crypto.createHmac('sha256', this.SECRET).update(code).digest('hex');
  }

  async request(dto: RequestPasswordResetDto) {
    console.log('entro al request', dto);

    const email = dto.email.toLowerCase().trim();

    const existing = await this.prModel
      .findOne({ email, consumedAt: null })
      .sort({ createdAt: -1 })
      .exec();

    const code = this.generateCode();
    const codeHash = this.hashCode(code);
    const expiresAt = new Date(Date.now() + this.TTL_MIN * 60 * 1000);

    if (existing) {
      existing.codeHash = codeHash;
      existing.expiresAt = expiresAt;
      existing.attempts = 0;
      await existing.save();
    } else {
      await this.prModel.create({ email, codeHash, expiresAt });
    }

    console.log(existing);

    // Optional: only send email if user exists
    const user = await this.userModel
      .findOne({ email })
      .select('_id email')
      .lean();
    if (!user) {
      return {
        ok: true,
        message: 'If the email exists, a code has been sent.',
      };
    }
    console.log('user', user);

    await this.email.send(
      email,
      'Código de verificación para recuperar tu contraseña',
      `<p>Usa este código para recuperar tu contraseña:</p>
       <h2 style="font-size:24px;letter-spacing:2px">${code}</h2>
       <p>El código vence en ${this.TTL_MIN} minutos.</p>`,
    );

    return { ok: true };
  }

  async confirm(dto: ConfirmPasswordResetDto) {
    const email = dto.email.toLowerCase().trim();
    const code = dto.code.trim();

    const pr = await this.prModel
      .findOne({ email, consumedAt: null })
      .sort({ createdAt: -1 })
      .exec();
    if (!pr)
      throw new NotFoundException('No active reset found for this email.');

    if (pr.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Verification code has expired.');
    }
    if (pr.attempts >= this.MAX_ATTEMPTS) {
      throw new UnauthorizedException('Too many attempts. Request a new code.');
    }

    const codeHash = this.hashCode(code);
    if (codeHash !== pr.codeHash) {
      pr.attempts += 1;
      await pr.save();
      throw new UnauthorizedException('Invalid verification code.');
    }

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found.');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const salt = await bcrypt.genSalt(10);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    user.password = await bcrypt.hash(dto.newPassword, salt);
    await user.save();

    pr.consumedAt = new Date();
    await pr.save();

    return { ok: true };
  }
}
