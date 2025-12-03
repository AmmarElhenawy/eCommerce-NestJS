import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
        @IsString({ message: "must be string" })
        @MinLength(3, { message: 'Name must be at least 3 characters' })
        @MaxLength(30, { message: 'Name must be at most 30 characters' })
        name: string;
    
        @IsOptional()
        @IsUrl()
        image: string;
}
