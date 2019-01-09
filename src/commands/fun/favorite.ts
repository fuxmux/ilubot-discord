import { IluBot, IluBotCommand } from "../../ilubot";
import { CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class FavoriteCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "favorite",
      aliases: ["fav"],
      group: "fun",
      guildOnly: true,
      memberName: "favorite",
      description:
        "Adds you to a game-specific role so you can be notified of happenings with that game.",
      //@ts-ignore
      clientPermissions: ["MANAGE_ROLES"],
      examples: [".favorite <game>"],
      args: [
        {
          key: "game",
          prompt: "Specify a valid game",
          type: "string"
        }
      ]
    });
  }

  public async run(
    message: CommandMessage,
    args: { game: string }
  ): Promise<Message | Message[]> {
    try {
      let { game } = args;
      const role = message.guild.roles.find(
        role => role.name.toUpperCase() === game.toUpperCase()
      );
      if (!role) return message.channel.send(`No role named ${game} found.`);
      game = role.name;
      if (message.member.roles.has(role.id)) {
        await message.member.removeRole(role);
        return await message.channel.send(
          `( ≧Д≦) ${message.author.username}-chan was expelled from ${game}`
        );
      }
      await message.member.addRole(role);
      return await message.channel.send(
        `OwO naisu!!! you've been added to the ${game} role senpai~~`
      );
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }
}
