import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
  @Start()
  onStart(@Ctx() ctx: Context) {
    ctx.replyWithHTML(`
    <b>Привет, ${ctx.from?.username}</b>
    Это бот для общения с ChatGPT.
    Задайте любой вопрос и он ответит на него.
    `);
  }

  @On('text')
  onMessage(@Message('text') message: string, @Ctx() ctx: Context) {
      
      
  }
}
