import { CommandMessage, CommandoClient, Command } from "discord.js-commando";
import { Message } from "discord.js";
import { IluBotCommand, IluBot } from "../../ilubot";
import { Think } from "../../entity/Think";

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}

export default class AddThunkCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "addthunk",
      aliases: ["addt", "tadd"],
      group: "thunk",
      memberName: "addthunk",
      description: "shows a random thunk.",
      examples: [".addthunk/.addt/.tadd [url]"],
      throttling: {
        usages: 5,
        duration: 20
      },
      args: [
        {
          key: "url",
          prompt: ".addthunk url",
          type: "string",
          validate: url => {
            if (validateUrl(url)) return true;
            return "Parameter must be a valid URL.";
          }
        }
      ]
    });
  }

  public hasPermission(message) {
    if (
      message.member.roles.find("name", "Politburo") ||
      this.client.isOwner(message.author)
    ) {
      return true;
    }
    return "OwO nice twy siwwy";
  }

  public async run(
    message: CommandMessage,
    args: { url: string }
  ): Promise<Message | Message[]> {
    try {
      const { url } = args;

      const query = await this.client.db.manager.save(Think, {
        //@ts-ignore
        channel: message.channel.name,
        authorUsername: message.author.username,
        authorId: message.author.id,
        url: url
      });
      
      return await message.reply(
        //@ts-ignore
        `(づ｡◕‿‿◕｡)づ Thunk ${query.id} added!! wew good one~!!`
      );
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }
}
