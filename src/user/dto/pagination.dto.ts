import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, isEnum, IsInt, isInt, IsOptional, IsString, Max, max, Min } from 'class-validator'
export class PaginationDto {

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number


    @IsOptional()
    // @Type(() => String)
    @IsEnum(['name','email','createdAt'])
    sortBy?: 'name'|'email'|'createdAt' ='createdAt'

    @IsOptional()
    @IsEnum(['asc','desc'])
    sortOrder?: 'asc'|'desc' ='asc';

    @IsOptional()
    @IsEnum(['true','false'])
    isActive?: 'true'|'false'

    @IsOptional()
    @IsEnum(['user','admin'])
    role?: 'user'|'admin'

    @IsOptional()
    @IsString()
    @Type(() => String)
    search?: string

}