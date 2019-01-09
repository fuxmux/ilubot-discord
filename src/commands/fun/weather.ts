import { IluBot, IluBotCommand } from "../../ilubot";
import env from "../../env";
import axios from "axios";
const NodeGeocoder = require("node-geocoder");

const options = { provider: "google", apiKey: env.google.apiKey };
const geocoder = NodeGeocoder(options);

export default class WeatherCommand extends IluBotCommand {
  constructor(client: IluBot) {
    super(client, {
      name: "weather",
      aliases: ["wea"],
      group: "fun",
      memberName: "weather",
      description: "Show the forecast.",
      examples: [".weather/.wea zip code or city, state"],
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "location",
          prompt: "Specify a zipcode or city and state",
          type: "string"
        }
      ]
    });
  }

  public async run(message, { location }) {
    try {
      const weather = await this.findWeather(location);
      return await message.channel.send(weather);
    } catch (e) {
      return message.channel.send(`(((( ;°Д°)))) ALART thats broken BAKA ${e}`);
    }
  }

  private async getLatLong(input) {
    try {
      const find = await geocoder.geocode(input);

      if (!Array.isArray(find) || !find.length) {
        return { error: "Could not geocode this location. Is it a valid place?" };
      }
      const result = {
        address: find[0].formattedAddress,
        latitude: find[0].latitude,
        longitude: find[0].longitude,
        error: null
      };
      return result;
    } catch (e) {
      return { error: `Unexpected error: ${e}` };
    }
  }

  private async getWeather(input) {
    try {
      const url = `https://api.darksky.net/forecast/${
        process.env.DARKSKY_API_KEY
      }/${input}`;
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      return { error: `Unexpected error using Dark Sky API: ${e}` };
    }
  }

  private formatWeather(input) {
    const {
      address,
      summary,
      temperature,
      highTemp,
      lowTemp,
      humidity,
      windSpeed
    } = input;

    const tempRound = this.roundTo(temperature, 2);
    const highTempRound = this.roundTo(highTemp, 2);
    const lowTempRound = this.roundTo(lowTemp, 2);

    const humidityPercent = humidity * 100;
    const humidityPercentRound = this.roundTo(humidityPercent);
    const windSpeedKph = parseFloat(windSpeed) * 1.609344;
    const windSpeedKphRound = this.roundTo(windSpeedKph, 2);

    const temperatureCelsius = this.roundTo(this.fToC(tempRound), 2);
    const highTempCelsius = this.roundTo(this.fToC(highTempRound), 2);
    const lowTempCelsius = this.roundTo(this.fToC(lowTempRound), 2);

    const temperatureBlock = `${tempRound}F/${temperatureCelsius}C (H: ${highTempRound}F/${highTempCelsius}C L:${lowTempRound}F/${lowTempCelsius}C)`;
    const humidityBlock = `Humidity: ${humidityPercentRound}%`;
    const windBlock = `Wind: ${windSpeed}mph/${windSpeedKphRound}kph`;

    return `${address}: ${summary}, ${temperatureBlock}, ${humidityBlock}, ${windBlock}`;
  }

  private fToC(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
  }

  private roundTo(n, digits?: number) {
    let negative = false;
    if (digits === undefined) {
      digits = 0;
    }
    if (n < 0) {
      negative = true;
      n = n * -1;
    }
    const multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if (negative) {
      n = (n * -1).toFixed(2);
    }
    return n;
  }

  private async findWeather(input) {
    try {
      const geocode = await this.getLatLong(input);
      //@ts-ignore
      const mergeLatLong = `${geocode.latitude}, ${geocode.longitude}`;
      const forecast = await this.getWeather(mergeLatLong);

      if (geocode.error) {
        return geocode.error;
      }
      if (forecast.error) {
        return forecast.error;
      }

      const result = {
        //@ts-ignore
        address: geocode.address,
        summary: forecast.currently.summary,
        temperature: forecast.currently.temperature,
        highTemp: forecast.daily.data[0].temperatureHigh,
        lowTemp: forecast.daily.data[0].temperatureLow,
        humidity: forecast.currently.humidity,
        windSpeed: forecast.currently.windSpeed
      };
      return this.formatWeather(result);
    } catch (e) {
      return { error: `Unexpected error using finding weather: ${e}` };
    }
  }
}
