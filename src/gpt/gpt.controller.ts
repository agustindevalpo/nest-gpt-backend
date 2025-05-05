// gpt.controller.ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDTO } from './dtos';

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

}
