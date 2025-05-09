import { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
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

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: FileFilter,
      //limits: { fileSize: 1000 },
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

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }
}
