import { IsString, IsOptional } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  moduleName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  moduleCode?: string;
}

export class UpdateModuleDto {
  @IsOptional()
  @IsString()
  moduleName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  moduleCode?: string;
}
