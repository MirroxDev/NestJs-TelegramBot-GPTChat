import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, Observable, of } from 'rxjs';

interface GPTAnswer {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
}

@Injectable()
export class ChatgptService {
  private readonly logger = new Logger(ChatgptService.name);

  private gptUrl;
  private apiKey;

  constructor(
    private readonly ConfigService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.gptUrl = this.ConfigService.getOrThrow('GPT_URL');
    this.apiKey = this.ConfigService.getOrThrow('GPT_API');
  }

  generateResponse(content: string): Observable<string> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
      temperature: 1,
    };

    return this.httpService
      .post<GPTAnswer>(this.gptUrl, data, { headers })
      .pipe(
        map(({ data }) => data.choices[0].message.content.trim()),
        catchError((error) => {
          this.logger.error(error);
          return of('Произошла ошибка!');
        }),
      );
  }
}
