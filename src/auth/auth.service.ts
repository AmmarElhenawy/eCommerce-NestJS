import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { SingUpDto } from './DTO/signUp.dto';
import { SingInDto } from './DTO/signIn.dto';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { responseDto } from 'src/response.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './DTO/resetPassword.dto';
import { emit } from 'process';
import { VerifyDto } from './DTO/verifyCode.dto';
import { ChangePasswordDto } from './DTO/changePassword.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
        private jwt: JwtService,
        private config: ConfigService,
        private readonly mailerService: MailerService
    ) { }

    async signUp(signUpDto: SingUpDto) {
        const user = await this.userModel.findOne({ email: signUpDto.email })
        if (user) {
            throw new BadRequestException("email allready exist");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(signUpDto.password, salt);
        const newUser = {
            ...signUpDto,
            password: hashedPassword,
            role: 'user',
            isActive: true
        };
        const userCreated = (await this.userModel.create(newUser));
        const accessToken = await this.signToken(userCreated._id.toString(), userCreated.email, 'user')

        return {
            response: new responseDto(200, 'success'),
            accessToken
        }
    }

    async signIn(signInDto: SingInDto) {

        const user = await this.userModel
            .findOne({ email: signInDto.email })
            .select('+password'); // مهم جداً!

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordMatch = await bcrypt.compare(
            signInDto.password,
            user.password
        );

        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }


        const accessToken = await this.signToken(user._id.toString(), user.email, user.role);

        return {
            response: new responseDto(200, 'success'),
            accessToken
        };
    }

    //reset password
    //NOTES   //Security Enhancements in obsidian if you want
    //1
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email } = await resetPasswordDto;
        const existEmail = await this.userModel.findOne({ email })

        if (!existEmail) {
            throw new NotFoundException('user not found');
        }
        // 6 numbers
        const verfictionCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        await this.userModel.findOneAndUpdate({ email }, { verfictionCode });
        
        await this.mailerService.sendMail({
            from: `E-commerce NestJS <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset - E-commerce NestJS',
            html: `
        <div style="text-align: center;">
        <h3>Your Verification Code</h3>
        <h3 style="color: red; font-weight: bold;">
            ${verfictionCode}
        </h3>
        <h6 style="color: gray;">
            E-commerce NestJS Project
        </h6>
        </div>
    `
        })
        return new responseDto(200, 'Verfication code sent to your email', email)
    }

    //2
    async verifyCode(verifyDto: VerifyDto) {
        const { email, code } = verifyDto;
        const user = await this.userModel.findOne({ email }).select('+verfictionCode')
        if (!user) {
            throw new NotFoundException('user not found');
        }

// console.log(user)
        if (user.verfictionCode !== Number(code)) {
            throw new UnauthorizedException("invalid verfiction code");
        }

        await this.userModel.findOneAndUpdate({ email }, { $unset: { verfictionCode: 1 } }, { new: true });
        const token= await this.signToken(user.id,user.email,user.role);
        return {
            response:new responseDto(200, 'Code verified successfully. Go to change password',),
            accessToken:token
        }
    }

    //3
    async changePassword(changePasswordDto: ChangePasswordDto) {

        
        const { email, password } = changePasswordDto;

        const userExist = await this.userModel.findOne({ email });
        if (userExist?.verfictionCode) {
            throw new UnauthorizedException("you must verify your code")
        }
        if (!userExist) {
            throw new NotFoundException("user not found")
        }

        if (!password) {
            throw new BadRequestException('password is not exist')
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateUser = await this.userModel.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true }).select('-password -__v');
        return new responseDto(200, 'Password changed successfully');
    }
    //reset password

    async validateGoogleUser(payload){
        
    }

    async signToken(
        userId: string,
        email: string,
        role: string,
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
            role,
        };
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '15m',
                algorithm: 'HS256',
                secret: secret,
            },
        );

        return {
            access_token: token,
        };
    }
}

