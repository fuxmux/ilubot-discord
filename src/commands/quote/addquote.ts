import { IluBotCommand, IluBot } from "../../ilubot";
import { CommandMessage } from "discord.js-commando";
import { Message, User } from "discord.js";
import { Quote } from "../../entity/Quote";

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

export default class AddQuoteCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "addquote",
      aliases: ["addq", "qadd"],
      group: "quote",
      memberName: "addquote",
      description: "Add a quote.",
      examples: [".q add @mention/nick quote"],
      args: [
        {
          key: "user",
          prompt: ".addquote/.addq nick/@mention quote",
          type: "string|user",
          validate: param => {
            if (!isNumber(param)) return true;
            return "Nickname cannot be a number.";
          }
        },
        {
          key: "content",
          prompt: ".addquote/.addq nick/@mention quote",
          type: "string"
        }
      ]
    });
  }

  public async run(
    message: CommandMessage,
    args: { user, content }
  ): Promise<Message | Message[]> {
    try {
      let { user, content } = args;

      if (await this.isDuplicate(user, content)) {
        return message.channel.send("(#｀皿´) WE GOT DIS ALREADY ☉▵☉凸");
      }

      const memberMentions = message.mentions.members.first();
      const userId = user.replace(/[<@!>]/g, "");
      let quoteParams = {
        //@ts-ignore
        channel: message.channel.name,
        quoteeUsername: user,
        quoteeId: null,
        authorUsername: message.author.username,
        authorId: message.author.id,
        content: content
      };

      if (memberMentions && userId == memberMentions.id) {
        quoteParams.quoteeUsername = memberMentions.user.username;
        quoteParams.quoteeId = memberMentions.user.id;
      }

      const query = await this.client.db.manager.save(Quote, {
        //@ts-ignore
        ...quoteParams
      });
      //@ts-ignore
      await message.channel.send(`Quote ${query.id} added.`);
    } catch (e) {
      message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }

  private async isDuplicate(user, content) {
    const query = await this.client.db.manager
      .createQueryBuilder(Quote, "quote")
      .where("LOWER(quote.quoteeUsername) = LOWER(:user)", { user })
      .andWhere("LOWER(quote.content) = LOWER(:content)", { content })
      .getCount();

    if (query > 0) {
      return true;
    } else {
      return false;
    }
  }
}
