import { IluBotCommand } from "../../ilubot";
import { CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import axios from "axios";
import * as queryString from "querystring";

export default class UrbanDictionaryCommand extends IluBotCommand {
  constructor(client) {
    super(client, {
      name: "urbandictionary",
      aliases: ["urban", "u"],
      group: "fun",
      memberName: "urbandictionary",
      description: "Show the top 3 urbandictionary definitions.",
      examples: [".urbandictionary/.urban/.u word"],
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: "word",
          prompt: "Specify a word to look up.",
          type: "string"
        }
      ]
    });
  }

  public async run(
    message: CommandMessage,
    args: { word: string | string[] }
  ): Promise<Message | Message[]> {
    try {
      const { word } = args;
      //@ts-ignore
      const wordModified = queryString.stringify({ term: word });
      const results = await this.getDefinition(wordModified);
      const format = await this.formatDefinition(results);

      return await message.channel.send({
        embed: {
          title: `Urban Dictionary: ${word}`,
          url: `https://www.urbandictionary.com/define.php?${wordModified}`,
          fields: format
        }
      });
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }

  private async getDefinition(input) {
    try {
      const url = `http://api.urbandictionary.com/v0/define?${input}`;
     console.log(`calling ${url}`)
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      return {
        error: `(((( ;°Д°)))) ALART error using UrbanDictionary API: ${e}`
      };
    }
  }

  private formatDefinition(input) {
    const results = input.list.length > 3 ? 3 : input.list.length;
    let fields = [];
    for (let i = 0; i < results; i++) {
      const sanitizeDefinition = input.list[i].definition
        .replace(/[\r\n]+/g, " ")
        .substring(0, 500);
      const sanitizeExample = input.list[i].example
        .replace(/[\r\n]+/g, " ")
        .substring(0, 500);
      fields.push({
        name: `Definition ${i + 1} - ${input.list[i].permalink}`,
        value: `${sanitizeDefinition}\n\nExample: ${sanitizeExample}`
      });
    }
    return fields;
  }
}
