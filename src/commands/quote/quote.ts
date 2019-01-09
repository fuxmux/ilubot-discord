import { IluBotCommand, IluBot } from "../../ilubot";
import * as moment from "moment";
import { Quote } from "../../entity/Quote";
import { CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class QuoteCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "quote",
      aliases: ["q"],
      group: "quote",
      memberName: "quote",
      description: "Display a quote.",
      examples: [".q", ".q 1", ".q arus 1"],
      args: [
        {
          key: "param1",
          prompt: "Please specify a nickname or quote number",
          type: "string|integer",
          default: ""
        },
        {
          key: "param2",
          prompt: "Please specify a quote number",
          type: "integer",
          default: ""
        }
      ]
    });
  }

  public async run(
    message: CommandMessage,
    args: { param1: any; param2: any }
  ): Promise<Message | Message[]> {
    try {
      const { param1, param2 } = args;

      if (
        (this.isInt(param1) && param1 < 1) ||
        (this.isInt(param2) && param2 < 1)
      ) {
        return message.channel.send(`(((( ;°Д°))))`);
      }

      // .q
      if (!param1) {
        const quote = await this.getRandomQuote();
        return await message.channel.send(quote);
      }

      //.q number
      if (this.isInt(param1) && param1 >= 1 && !param2) {
        const quote = await this.getQuoteByPk(param1);
        return await message.channel.send(quote);
      }

      //.q name
      if (!this.isInt(param1) && !param2) {
        const quote = await this.getQuoteByQuotee(param1);
        return await message.channel.send(quote);
      }

      //.q name number
      if (param1 && this.isInt(param2) && param2 >= 1) {
        const quote = await this.getQuoteByQuotee(param1, param2);
        return await message.channel.send(quote);
      }
      return message.channel.send(
        ".q/.quote [nick] [#n] -- gets random or [#n]th quote by <nick>"
      );
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }

  private async getTotalQuotes(nickname?: string) {
    const totalQuotes = nickname
      ? await this.client.db.manager
          .createQueryBuilder(Quote, "quote")
          .where("LOWER(quote.quoteeUsername) = LOWER(:quoteeUsername)", {
            quoteeUsername: nickname
          })
          .getCount()
      : await this.client.db.manager
          .createQueryBuilder(Quote, "quote")
          .getCount();

    return await totalQuotes;
  }

  private async getRandomQuote() {
    const totalQuotes = await this.getTotalQuotes();

    const query = await this.client.db.manager
      .createQueryBuilder(Quote, "quote")
      .orderBy("RANDOM()")
      .limit(1)
      .getOne();

    return this.formatQuote(query, query.id, totalQuotes);
  }

  private async getQuoteByPk(quoteNumber: number) {
    const totalQuotes = await this.getTotalQuotes();

    const query = await this.client.db.manager
      .createQueryBuilder(Quote, "quote")
      .where("quote.id = :id", { id: quoteNumber })
      .getOne();

    return this.formatQuote(query, quoteNumber, totalQuotes);
  }

  private async getQuoteByQuotee(nickname: string, quoteNumber?: string) {
    const totalQuotes = await this.getTotalQuotes(nickname);

    let value: number = quoteNumber
      ? parseInt(quoteNumber, 10)
      : Math.floor(Math.random() * (totalQuotes + 1));
    value--;

    if (value < 0) {
      value = 0;
    }

    const query = await this.client.db.manager
      .createQueryBuilder(Quote, "quote")
      .where("LOWER(quote.quoteeUsername) = LOWER(:quoteeUsername)", {
        quoteeUsername: nickname
      })
      .offset(value)
      .limit(1)
      .getOne();

    if (quoteNumber) {
      return this.formatQuote(query, quoteNumber, totalQuotes);
    } else {
      return this.formatQuote(query, value + 1, totalQuotes);
    }
  }

  private formatQuote(quote, id, total) {
    if (!quote) return "Nani!?";

    const dateFormat = moment(quote.createdAt).format("MM-DD-YYYY");
    return `[Quote ${id} of ${total} - added by ${
      quote.authorUsername
    } on ${dateFormat}]\n <${quote.quoteeUsername}> ${quote.content}`;
  }

  private isInt(value) {
    return (
      !isNaN(value) &&
      parseInt(value, 10) == value &&
      !isNaN(parseInt(value, 10))
    );
  }
}
