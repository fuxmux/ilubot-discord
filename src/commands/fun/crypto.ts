import { IluBotCommand, IluBot } from "../../ilubot";
import { CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import axios from "axios";

export default class CryptoCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "crypto",
      aliases: ["butt"],
      group: "fun",
      memberName: "crypto",
      description: "Show the exchange rate for the specified cryptocurrency.",
      examples: [".crypto/.butt symbol"],
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: "symbol",
          prompt: "Specify a symbol to look up.",
          type: "string"
        }
      ]
    });
  }

  public async run(
    message: CommandMessage,
    args: { symbol: string }
  ): Promise<Message | Message[]> {
    try {
      const { symbol } = args;
      const results = await this.getPriceData(symbol.toUpperCase());
      const format = await this.formatPriceData(results, symbol.toUpperCase());
      return await message.channel.send(format);
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }

  private async getPriceData(symbol) {
    try {
      const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD`;
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      return {
        error: `(((( ;°Д°)))) ALART unexpected error using CryptoCompare API: ${e}`
      };
    }
  }

  private formatPriceData(input, symbol) {
    if (input.Response && input.Response == "Error") {
      return input.message;
    } else {
      return `Current: ${input.DISPLAY[symbol].USD.PRICE} - High (24h): ${
        input.DISPLAY[symbol].USD.HIGH24HOUR
      } - Low (24h): ${input.DISPLAY[symbol].USD.LOW24HOUR}`;
    }
  }
}
