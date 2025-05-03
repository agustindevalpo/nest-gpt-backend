import { Body, Controller, Get, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos';


@Controller('gpt')
export class GptController {
  
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  ortographyCheck(
    @Body() orthographyDto:OrthographyDto
  ) {
     return this.gptService.orthographyCheck( orthographyDto );
  }
}
