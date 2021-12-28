const { default: axios } = require("axios");
const payLoad = {"search":"","types":["listing","offer"],"project":"The Pixel Head Squad","sort":{"_id":-1},"priceMin":null,"priceMax":null,"page":1,"verified":true,"nsfw":false,"sold":false,"smartContract":false}

const { Client, Intents } = require('discord.js');
const { token } = require('./configPH.json');
const { MessageEmbed } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

function secondsBefore() {
    const newDate = new Date()
    newDate.setSeconds(newDate.getSeconds() - 10);
    const stringDate = newDate.toISOString()
    return stringDate
  }
  
  function getColour(data, price){
    if (data.smartContractTxid) {
        const color =  '#fbff00';
        return color;
    }else if (price > 2000) {
        const color = '#ff1500';
        return color;
    }else {
        const color = '#0099ff';
        return color;
    } 
        
  }
  function run() {
  axios.post(`https://api.cnft.io/market/listings`, payLoad)
  .then(response => {
      const date = secondsBefore()
      const newFilter = response.data.results
      .filter(data => data.createdAt >= date)
      .map(({_id, price, asset, smartContractTxid}) => ({
      _id,
      price,
      asset,
      smartContractTxid
      }));
      (newFilter.length) ? discordListing(newFilter):"no";
      
  })
  .catch(function (error) {
      console.log(error);
    });
  }
  
  function discordListing(data) {
    console.log("New Pixel Head")
    const channel = client.channels.cache.get('918052922154164234');
    for (let i = 0; i < (data.length); i++) {
    
    let name = data[i].asset.metadata.name
    let nameGif = name.substr(-3)
    let price = data[i].price/1000000
    let listing = data[i]._id
    let link = `https://cnft.io/token/${listing}`
    let smartContract = (data[i].smartContractTxid) ? "Yes":"No";
    let image = `https://pixelhead.io/images/tokens/${nameGif}1.gif`
  
    let exampleEmbed = new MessageEmbed()
        .setColor(getColour(data[i], price))
        .setTitle(name)
         .setURL(link)
         .setAuthor('Just listed Pixel Head Squad')
         .setThumbnail('https://pixelhead.io/static/media/logotype-web.04e0f3d1.png')
         .addFields(
             { name: 'Listed for:', value: `₳ ${price}` },
             { name: "Smart Contract: ", value: smartContract}
         )
        .setImage(image)
        .setTimestamp(Date.now())
        .setFooter('cnft.io bot | trenchatop');
        
  
    channel.send({ embeds: [exampleEmbed],})
        }
  }
  function listings() {
     setInterval(run, 10000);
  }
client.once('ready', () => {
    console.log("PH bot is running")
    listings()
});

client.login(token);