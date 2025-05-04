
import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case';
import { OrthographyDto } from './dtos';
import OpenAI from 'openai';
import { ProsConsDiscusserDto } from './dtos'
import { prosConsDicusserUseCase } from './use-cases/prosconsDiscusser.use-case';
import { prosConsDicusserStreamUseCase } from './use-cases/prosconsDiscusserStream.use-case';

@Injectable()
export class GptService {

private openAi = new OpenAI({
        apiKey: process.env.OPEN_API_KEY,
    })

    // Solo va a llamar casos de uso.
    async orthographyCheck( orthographyDto: OrthographyDto){
        return await orthographyCheckUseCase(
            this.openAi, 
            { prompt: orthographyDto.prompt }
            
        );
    }


    async prosConsDicusser( prosConsDiscusserDto: ProsConsDiscusserDto){
         
        return await prosConsDicusserUseCase(
            this.openAi,
            { prompt : prosConsDiscusserDto.prompt }
        );
    }

    async prosConsDicusserStream( prosConsDiscusserDto: ProsConsDiscusserDto){
         
        return await prosConsDicusserStreamUseCase(
            this.openAi,
            { prompt : prosConsDiscusserDto.prompt }
        );
    }
}
