// gpt.service.ts
import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDTO } from './dtos';
import OpenAI from 'openai';
import { prosConsDicusserUseCase } from './use-cases/prosconsDiscusser.use-case';
import { prosConsDicusserStreamUseCase } from './use-cases/prosconsDiscusserStream.use-case';
import { Response } from 'express';
import { translateUseCase } from './use-cases/translate.use-case ';


@Injectable()
export class GptService {
  private openAi = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
  });

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openAi, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openAi, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async prosConsDicusserStream(
    prosConsDiscusserDto: ProsConsDiscusserDto,
    res: Response
  ) {
    return await prosConsDicusserStreamUseCase(this.openAi, {
      prompt: prosConsDiscusserDto.prompt,
      res,
    });
  }

  async translate(translateDto: TranslateDTO) {
    return await translateUseCase(this.openAi, {
      prompt : translateDto.prompt,
      lang: translateDto.lang
    });
  }
}
