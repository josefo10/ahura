import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './users/user.module';
import { LoggerModule } from './loggers/logger.module';
import { CommentModule } from './comments/comment.module';
import { AssetModule } from './assets/asset.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(
      'mongodb+srv://josefo1020:xNyQXxNFmB8Y6X9H@cluster0.naebbm1.mongodb.net/AHURA',
    ),
    UserModule,
    LoggerModule,
    CommentModule,
    AssetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
