import {
  CommandoClient,
  CommandoClientOptions,
  Command,
  CommandInfo
} from "discord.js-commando";
import * as path from "path";
import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { createLogger, format, transports } from "winston";
import winston = require("winston");
const { combine, timestamp, printf, colorize } = format;

export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    colorize(),
    printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [new transports.Console()]
});

export type IlubotOptions = CommandoClientOptions & {
  token?: string;
};

export class IluBot extends CommandoClient {
  db: Connection;
  log: winston.Logger;

  constructor(options?: IlubotOptions) {
    options.disableEveryone = true;
    options.unknownCommandResponse = false;
    super(options);

    this.log = logger;

    this.registry
      .registerGroups([
        ["drama", "Drama Commands"],
        ["fun", "Fun Commands"],
        ["quote", "Quote Commands"],
        ["thunk", "thunk Commands"]
      ])
      .registerDefaults()
      .registerCommandsIn(path.join(__dirname, "commands"));

    this.on("ready", () => {
      // This event will run if the bot starts, and logs in, successfully.
      logger.log({
        level: "info",
        message: `Bot has started, with ${this.users.size} users, in ${
          this.channels.size
        } channels.`
      });
      this.user.setActivity(".help for available commands.");
    })
      .on("error", e => logger.error(`${e.message} - ${e.stack}`))
      .on("warn", logger.warn)
      .on("debug", logger.info)
      .on("disconnect", () =>
        logger.log({ level: "warn", message: "Disconnected.." })
      )
      .on("reconnect", () =>
        logger.warn({ level: "warn", message: "Reconnecting..." })
      )
      .on("guildMemberAdd", async guildMember => {
        try {
          guildMember.addRole(
            guildMember.guild.roles.find(role => role.name === "Game-GW2-Guild")
          );
        } catch (e) {
          logger.error(`Error adding to GW2 guild role: ${e.message}`);
        }
      });

    this.init();
  }

  public async init() {
    try {
      this.db = await createConnection();
    } catch (e) {
      logger.error(
        `Encounted error signing in to postgres. Exiting. Error: ${e.message}`
      );
      process.exit(1);
    }
  }

  public start(token: string): void {
    this.login(token);
  }
}
export abstract class IluBotCommand extends Command {
  public readonly client: IluBot;

  constructor(client: IluBot, info: CommandInfo) {
    super(client, info);
  }
}
