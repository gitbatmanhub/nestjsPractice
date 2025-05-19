import { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileFilter, FileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'File created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The file was a image',
  })
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: FileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: FileNamer,
      }),
    }),
  )
  uploadProductFiles(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Asegurate que el archivo sea una imagen');
    }

    const securUrl = `${this.configService.get<string>('HOST_API')}/files/product/${file.filename}`;
    return { securUrl };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Obtain a file',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No product image found',
  })
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }
}
