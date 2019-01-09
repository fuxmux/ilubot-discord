import { logger } from "./ilubot";


export interface IEnv {
  environment: string;
  isProduction: boolean;
  isDevelopment: boolean;
  ownerId: string;
  botToken: string;
  google: {
    apiKey: string | undefined;
  };
  darksky: {
    apiKey: string | undefined;
  };
}

function setupEnv(): IEnv {
  const environment: string = process.env.NODE_ENV || "development";
  const isProduction: boolean = environment === "production";
  const isDevelopment: boolean = environment === "development";

  if (!process.env.OWNER_ID) {
    logger.error("OWNER_ID variable not found in environment, exiting bot...");
    process.exit(1);
  }

  if (!process.env.GOOGLE_API_KEY) {
    logger.error(
      "DISCORD_API_KEY not found in environment. This should be the Discord bot token. Exiting..."
    );
    process.exit(1);
  }

  if (!process.env.DISCORD_API_KEY) {
    logger.error(
      "DISCORD_API_KEY not found in environment. This should be the Discord bot token. Exiting..."
    );
    process.exit(1);
  }

  const ownerId: string = process.env.OWNER_ID || "";
  const botToken: string = process.env.DISCORD_API_KEY || "";

  return {
    environment,
    isProduction,
    isDevelopment,
    ownerId,
    botToken,
    google: {
      apiKey: process.env.GOOGLE_API_KEY
    },
    darksky: {
      apiKey: process.env.DARKSKY_API_KEY
    }
  };
}

export default setupEnv();
