import { IluBotCommand, IluBot } from "../../ilubot";
import { CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { Drama } from "../../entity/Drama";
import * as moment from "moment";

export default class DramaCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "drama",
      aliases: ["d"],
      group: "drama",
      memberName: "drama",
      description:
        "Pull up a drama entry with .drama id or view the latest one with .drama",
      examples: [".drama", ".d", ".drama 1"],
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

  public async run(
    message: CommandMessage,
    args: { id?: number }
  ): Promise<Message | Message[]> {
    try {
      const { id } = args;
      const query = await this.findDrama(id);
      return await message.channel.send(query);
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }

  private async findDrama(id?: number) {
    try {
      const query = id
        ? await this.client.db.manager
            .createQueryBuilder(Drama, "drama")
            .where("drama.id= :id", { id })
            .getOne()
        : await this.client.db.manager
            .createQueryBuilder(Drama, "drama")
            .orderBy("drama.createdAt", "DESC")
            .limit(1)
            .getOne();

      return await this.formatDrama(query);
    } catch (error) {
      return `(((( ;°Д°)))) ALART thats broken: ${error}.`;
    }
  }

  private formatDrama(drama) {
    if (!drama) return "Nani!?";

    const entryDate = moment(drama.createdAt);
    const daysSince = this.formatDays(
      entryDate.diff(moment(), "days").toString()
    );

    return {
      embed: {
        title: `ლಠ益ಠ)ლ ${daysSince} days since this drama~!!!`,
        description: `${drama.reason}`,
        footer: {
          text: `added by ${drama.authorUsername}`
        }
      }
    };
  }

  private formatDays(days) {
    const emojiMap = {
      "0": ":zero:",
      "1": ":one:",
      "2": ":two:",
      "3": ":three:",
      "4": ":four:",
      "5": ":five:",
      "6": ":six:",
      "7": ":seven:",
      "8": ":eight:",
      "9": ":nine:"
    };
    let conversion = "";

    if (days === "0") {
      return ":zero:";
    }

    for (let i = 1; i < days.length; i++) {
      conversion += emojiMap[days.charAt(i)];
    }
    return conversion;
  }
}
