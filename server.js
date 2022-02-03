const config = require('dotenv').config()
const TOKEN = process.env.TOKEN
const WAPI = process.env.apiKey
const Discord = require("discord.js");
const puppeteer = require('puppeteer');
const axios = require('axios')
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
async function getShuttle(){
        const browser = await puppeteer.launch({
          defaultViewport: {width: 1920, height: 1080}
      });
        const page = await browser.newPage();
        await page.goto('https://web.shuttletracker.app/');
        await page.click('.btn',{clickCount : 1})
        await page.waitForTimeout(1500)
        await page.screenshot({ 
            path: './images/example.png',
            clip: {x: 400, y: 130, width: 1000, height: 691}
          });
        await browser.close();

}
async function getWeather(city){
    const res = await axios.get("https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=" + WAPI);
    const data = res.data.main.temp
    const des = res.data.weather[0].main+", "+res.data.weather[0].description
    return [data, des]
}
const prefix = "?";
client.on("messageCreate", async function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  if (command === "s") {
    await getShuttle()
    message.channel.send({files: ['./images/example.png'] });
  }
  else if( command === "w"){
    // await getWeather()
    if(!args.length){
        const [temp, des] = await getWeather("troy")
        const cel = (((temp - 32) * 5) / 9) | 0;
        message.channel.send(temp+" °F / "+cel+"°C\n"+des)

    }else{
        const city = args.slice(0).join(' ');
        const [temp, des] = await getWeather(city)
        const cel = (((temp - 32) * 5) / 9) | 0;
        message.channel.send(temp+" °F / "+cel+"°C\n"+des)
    }
  }
  else if( command == "h" || command == "help"){
      message.channel.send(`
      Supported Command
      **?help/?h** Display help menu
      **?w/?w {city}** Show current weather
      **?s** show current shuttle location
      `)
  }
});
client.login(TOKEN);