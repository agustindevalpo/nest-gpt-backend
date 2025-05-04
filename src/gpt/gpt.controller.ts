import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express'; // Importa Response de Express
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';

@Controller('gpt')
export class GptController {
  
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto
  ) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosconsDto: ProsConsDiscusserDto
  ) {
    return this.gptService.prosConsDicusser(prosconsDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosconsDto: ProsConsDiscusserDto,
    @Res() res: Response // Usa el tipo Response de Express
  ) {
    try {
      const stream = await this.gptService.prosConsDicusserStream(prosconsDto);
      
      res.setHeader('Content-Type', 'application/json');
      res.status(HttpStatus.OK);

      for await (const chunk of stream) {
       const piece = chunk.choices[0]?.delta?.content || '';
       console.log(piece);
       res.write(piece);
      }
      res.end();

    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error processing stream',
        error: error.message
      });
    }
  }
}