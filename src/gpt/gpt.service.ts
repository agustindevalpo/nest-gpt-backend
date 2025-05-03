
import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case';
import { OrthographyDto } from './dtos';
import OpenAI from 'openai';

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
}
