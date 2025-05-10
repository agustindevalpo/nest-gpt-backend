// gpt.service.ts
import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDTO } from './dtos';
import OpenAI from 'openai';
import { prosConsDicusserUseCase } from './use-cases/prosconsDiscusser.use-case';
import { prosConsDicusserStreamUseCase } from './use-cases/prosconsDiscusserStream.use-case';
import { Response } from 'express';
import { translateUseCase } from './use-cases/translate.use-case ';
import { TextToAudioDTO } from './dtos/TextToAudio.dto';
import { AudioResult, textToAudioUseCase } from './use-cases/textToAudio.use-case';


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

  
  async textToAudio(textToAudioDTO: TextToAudioDTO): Promise<AudioResult> {
    return await textToAudioUseCase(this.openAi, {
      prompt: textToAudioDTO.prompt,
      voice: textToAudioDTO.voice,
    });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname, 
      '../../generated/audios', 
      `${fileId}.mp3`
    );

    console.log(`Buscando archivo en: ${filePath}`);
    console.log(`Existe archivo?: ${fs.existsSync(filePath)}`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Archivo de audio ${fileId} no encontrado`);
    }

    return filePath;
  }
}
