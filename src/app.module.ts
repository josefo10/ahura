import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './users/user.module';
import { LoggerModule } from './loggers/logger.module';
import { CommentModule } from './comments/comment.module';
import { AssetModule } from './assets/asset.module';

import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalogs/catalog.module';
import { PasswordResetModule } from './auth/password-reset/password-reset.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(
      `mongodb+srv://josefo1020:UHkcghGz8hgssLz8@cluster0.naebbm1.mongodb.net/AHURA`,
    ),
    UserModule,
    LoggerModule,
    CommentModule,
    AssetModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UploadModule,
    AuthModule,
    CatalogModule,
    PasswordResetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
