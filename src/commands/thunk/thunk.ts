import { CommandMessage, CommandoClient } from "discord.js-commando";
import { Message } from "discord.js";
import { Think } from "../../entity/Think";
import { IluBotCommand, IluBot } from "../../ilubot";

export default class ThunkCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "thunk",
      group: "thunk",
      memberName: "thunk",
      description: "shows a random thunk.",
      examples: [".thunk"],
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: "id",
          prompt: "Specify the ID number starting with 1!",
          type: "integer",
          default: ""
        }
      ]
    });
  }

  async run(
    message: CommandMessage,
    args: { id: number }
  ): Promise<Message | Message[]> {
    try {
      const { id } = args;
      const query = id
        ? await this.client.db.manager
            .createQueryBuilder(Think, "think")
            .where("think.id= :id", { id })
            .getOne()
        : await this.client.db.manager
            .createQueryBuilder(Think, "think")
            .orderBy("RANDOM()")
            .limit(1)
            .getOne();
        return await message.channel.send(query.url);
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }
}
