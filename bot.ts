import 'dotenv/config';
import { Bot, InlineKeyboard, Keyboard } from 'grammy';

const apiKey = process.env.API_KEY || '';
const bot = new Bot(apiKey);

type postType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

bot.command('start', async (ctx) => {
  // const keyboards = new InlineKeyboard()
  //   .text('Обувь', 'btn_shoes')
  //   .row()
  //   .text('Одежда', 'btn_clothes');
  //
  // await ctx.reply('Выберите категорию', {
  //   reply_markup: keyboards,
  // });

  const keyboard = new Keyboard().requestLocation('Запросить геолокацию');

  await ctx.reply('Геолокация', {
    reply_markup: keyboard,
  });
});

bot.on('message:location', async (ctx) => {
  console.log(ctx.message);
});

bot.callbackQuery('btn_shoes', async (ctx) => {
  const keyboards = new InlineKeyboard()
    .text('Кроссовки', 'btn_sneakers')
    .text('Туфли', 'btn_heels');

  await ctx.reply('Выберите тип обуви', {
    reply_markup: keyboards,
  });
});

bot.callbackQuery('btn_clothes', async (ctx) => {
  const keyboards = new InlineKeyboard()
    .text('Футболка', 'btn_shirt')
    .text('Майка', 'btn_sweatshirt');

  await ctx.reply('Выберите тип одежды', {
    reply_markup: keyboards,
  });
});

bot.callbackQuery('btn_sneakers', async (ctx) => {
  await ctx.reply('Загрузка 🫥🫥');
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data: postType[] = (await res.json()) as postType[];

  console.log(data);
  const outputData = data
    .map((el) => `${el.title} \n`)
    .splice(0, 10)
    .join('');
  await ctx.reply(outputData);
});

bot.command('greeting', async (ctx) => {
  await ctx.reply('Привет мир!');
});

bot.on('message:text', async (ctx) => {
  const username = ctx.message.text;
  await ctx.reply('<code>Привет, ' + username + '</code>', {
    parse_mode: 'HTML',
  });
});

bot.start();
