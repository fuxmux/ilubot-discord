import 'dotenv/config';
import { IluBot } from "./ilubot";
import env from "./env";

const bot: IluBot = new IluBot({
    owner: env.ownerId,
    commandPrefix: "."
});

bot.start(env.botToken);

(<any>global).bot = bot;

export default bot;
