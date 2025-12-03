import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto{
            @IsString({ message: "email must be string" })
            @MinLength(0, { message: "email must be required" })
            @IsEmail({}, { message: 'Invalid email format' })
            email: string;
    
    
            @IsString({ message: "must be string" })
            @MinLength(3, { message: 'Password must be at least 3 characters' })
            @MaxLength(20, { message: 'Password must be at most 20 characters' })
            password: string;
    
}