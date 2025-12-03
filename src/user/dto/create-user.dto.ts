import { IsString, IsNumber, IsEmail, IsBoolean, IsOptional, IsEnum, MinLength, MaxLength, Min, IsUrl, isPhoneNumber, IsPhoneNumber, Length, length, minLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: "must be string" })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(30, { message: 'Name must be at most 30 characters' })
    name: string;

    @IsOptional()
    @IsNumber()
    // @Min(18,{message:"must be grater than 18 years old"})
    @MinLength(0, { message: "age must be required" })
    age: number;

    @IsString({ message: "email must be string" })
    @MinLength(0, { message: "email must be required" })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString({ message: "must be string" })
    @MinLength(3, { message: 'Password must be at least 3 characters' })
    @MaxLength(20, { message: 'Password must be at most 20 characters' })
    password: string;

    // @IsOptional()
    @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
    @MinLength(0, { message: "role must be required" })
    role: string;


    @IsOptional()
    @IsString({ message: "must be string" })
    @IsUrl({}, { message: "avatar must be valid URL" })
    avatar?: string;

    @IsOptional()
    @IsString({ message: "phone must be string" })
    @IsPhoneNumber('EG', { message: "phone number must be valid" })
    // @IsPhoneNumber('SA',{message:"phone number must be valid"})
    phone: String;

    @IsOptional()
    @IsString({ message: "must be string" })
    address?: string;

    // @IsOptional()
    // @IsBoolean()
    // @MinLength(0, { message: "active must be required" })
    // active: boolean;
    @IsBoolean()
    isActive: boolean = true;

    @IsOptional()

    @IsNumber()
    // @Length(6, 6, { message: "verification must be 6 characters" })
    verfictionCode?: number;

    @IsOptional()
    @IsEnum(['male', 'female'], { message: 'Gender must be male or female' })
    gender?: string;
}
