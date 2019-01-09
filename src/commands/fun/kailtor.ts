import { CommandMessage, CommandoClient } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { Message } from "discord.js";

export default class KailtorCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "kailtor",
      group: "fun",
      memberName: "kailtor",
      description: "gay.",
      examples: [".kailtor"],
      throttling: {
        usages: 2,
        duration: 5
      }
    });
  }

  async run(message: CommandMessage): Promise<Message | Message[]> {
    try {
      return message.channel.send("https://giphy.com/gifs/gay-94oj4dwuJfDKE");
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }
};
