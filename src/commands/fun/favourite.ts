import { IluBotCommand, IluBot } from "../../ilubot";
import { CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class FavouriteCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "favourite",
      group: "fun",
      memberName: "favourite",
      description: "gay.",
      examples: [".favorite <game>"],
      throttling: {
        usages: 2,
        duration: 5
      }
    });
  }

  public run(message: CommandMessage): Promise<Message | Message[]> {
    try {
      return message.channel.send("https://i.imgur.com/S8fEVdJ.jpg");
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }
};
