const { default: axios } = require("axios");
const payLoad = {"search":"","types":["listing","offer"],"project":"The Pixel Head Squad","sort":{"_id":-1},"priceMin":null,"priceMax":null,"page":1,"verified":true,"nsfw":false,"sold":false,"smartContract":false}

const { Client, Intents } = require('discord.js');
const { token } = require('./configPH.json');
const { MessageEmbed } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

  
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
        let listings = response.data.results
        .filter(data => gettingTime(data.createdAt) >= (new Date().getTime()- 10000));
        (listings.length) ? discordListing(listings):"no";
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
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