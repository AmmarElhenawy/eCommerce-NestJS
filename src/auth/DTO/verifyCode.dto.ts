import { IsEmail, IsNumber, IsString, MinLength } from "class-validator";

export class VerifyDto{
            @IsString({ message: "email must be string" })
            @MinLength(0, { message: "email must be required" })
            @IsEmail({}, { message: 'Invalid email format' })
            email: string;
            
            @IsNumber()
            code:number
}