// gpt.controller.ts
import * as path from 'path';
import * as fs from 'fs';
import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDTO, TranslateDTO } from './dtos';
import { timingSafeEqual } from 'crypto';


@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosconsDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosconsDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosconsDto: ProsConsDiscusserDto,
    @Res() res: Response
  ) {
    await this.gptService.prosConsDicusserStream(prosconsDto, res);
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDTO) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDTO,
    @Res() res: Response 
  ) {
    const result = await this.gptService.textToAudio(textToAudioDto);
  
    if (!result.ok || !result.filePath) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        ok: false,
        message: result.message || 'No se pudo generar el archivo de audio'
      });
    }
  
    res.setHeader('Content-Type', 'audio/mp3');
    return res.sendFile(result.filePath);
  }
  
  @Get('text-to-audio/:fileId')
  async getAudio(
    @Param('fileId') fileId: string,
    @Res() res: Response 
  ) {
    try {
      const filePath = await this.gptService.textToAudioGetter(fileId);
      res.setHeader('Content-Type', 'audio/mp3');
      return res.sendFile(filePath);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          ok: false,
          message: error.message
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        message: 'Error al recuperar el archivo de audio'
      });
    }
  }
}
