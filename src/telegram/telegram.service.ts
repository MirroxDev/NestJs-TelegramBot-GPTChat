import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
  constructor(private readonly configService: ConfigService, private readonly gptService: ChatgptService) {
    super(configService.getOrThrow('TELEGRAM_API'));
  }
  @Start()
  onStart(@Ctx() ctx: Context) {
    ctx.replyWithHTML(`
    <b>Привет, ${ctx.from?.username}</b>
    Это бот для общения с ChatGPT.
    Задайте любой вопрос и он ответит на него.
    `);
  }

  @On('text')
  onMessage(@Message('text') message: string) {
      return this.gptService.generateResponse(message);
  }
}
