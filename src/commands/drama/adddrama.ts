import { IluBotCommand, IluBot } from "../../ilubot";
import { CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { Drama } from "../../entity/Drama";

export default class AddDramaCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "adddrama",
      aliases: ["addd"],
      group: "drama",
      memberName: "adddrama",
      description: "Reset the drama cooldown!!",
      examples: [".adddrama reason"],
      args: [
        {
          key: "reason",
          prompt: ".drama reason",
          type: "string",
          default: ""
        }
      ]
    });
  }

  public hasPermission(message) {
    if (
      message.member.roles.find("name", "Commissariat") ||
      this.client.isOwner(message.author)
    ) {
      return true;
    } else {
      return false;
    }
  }

  public async run(
    message: CommandMessage,
    args: { reason: string }
  ): Promise<Message | Message[]> {
    try {
      const { reason } = args;
      let drama = new Drama();
      //@ts-ignore
      drama.channel = message.channel.name;
      drama.authorUsername = message.author.username;
      drama.authorId = message.author.id;
      drama.reason = reason;

      const query = await this.client.db.manager.save(drama);
      return await message.reply(
        `(づ｡◕‿‿◕｡)づ Drama ${query.id} added!! wew good one~!!`
      );
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }
}
