import { IsEmail, IsString, MinLength } from "class-validator";

// dto/reset-password.dto.ts
export class ResetPasswordDto {
    
        @IsString({ message: "email must be string" })
        @MinLength(0, { message: "email must be required" })
        @IsEmail({}, { message: 'Invalid email format' })
        email: string;
    
}