import { IluBotCommand, IluBot } from "../../ilubot";
import * as moment from "moment";
import { Quote } from "../../entity/Quote";
import { CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class QuoteSearchCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "quotesearch",
      aliases: ["qsearch", "q:search"],
      group: "quote",
      memberName: "quotesearch",
      description:
        "Searches for a quote based on a specified phrase. Returns 10 results.",
      examples: [".qsearch gay", ".qsearch i'm gay"],
      args: [
        {
          key: "phrase",
          prompt: "Please specify a phrase to search",
          type: "string",
          default: ""
        }
      ]
    });
  }

  public async run(
    message: CommandMessage,
    args: { phrase: string }
  ): Promise<Message | Message[]> {
    try {
      const { phrase } = args;

      const query = await this.getQuotes(phrase);

      if (!query) {
        return message.channel.send("Nani!?");
      }

      return await message.channel.send({
        embed: {
          title: `Results: ${phrase}`,
          fields: query
        }
      });
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }

  private async getQuotes(phrase: string) {
    const query = await this.client.db.manager
      .createQueryBuilder(Quote, "quote")
      .where("quote.content like :content", { content: "%" + phrase + "%" })
      .limit(5)
      .getMany();

    return this.formatQuote(query);
  }

  private formatQuote(quotes) {
    if (quotes.length == 0) return false;

    let results: { name: string, value: string }[] = [];

    for (let i = 0; i < quotes.length; i++) {
      const dateFormat = moment(quotes[i].createdAt).format("MM/DD/YY");

      let content = quotes[i].content;

      if (content.length >= 200) {
        content = content.substring(0, 200) + "...";
      }

      results.push({
        name: `Quote ${quotes[i].id} - added by ${
          quotes[i].authorUsername
        } on ${dateFormat}`,
        value: `<${quotes[i].quoteeUsername}> ${content}`
      });
    }
    return results;
  }
}
