import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/eCommerce'),
    ConfigModule.forRoot({
      isGlobal: true,
        }),
    UserModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      }
    }),
    JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {
    algorithm:'HS256',
    expiresIn: '60s' },
  }),
  AuthModule,
  CategoryModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
