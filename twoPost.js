const axios = require('axios')
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MessageEmbed } = require('discord.js');

const delay = ms => new Promise(res => setTimeout(res, ms));
const payLoad = {"search":"","types":["listing","offer"],"project":"The Pixel Head Squad","sort":{"_id":-1},"priceMin":null,"priceMax":null,"page":1,"verified":true,"nsfw":false,"sold":false,"smartContract":false}
const payLoad2 = {"search":"","types":["listing","offer"],"project":"The Pixel Head Squad - Accessories","sort":{"_id":-1},"priceMin":null,"priceMax":null,"page":1,"verified":true,"nsfw":false,"sold":false,"smartContract":false}
const accessoriesGif = { "BatWings": "https://infura-ipfs.io/ipfs/QmYvJiG4n1WymodvNzSWqkpCF6xiaBsGuVyLGygVvVepM5", "Pixos": "https://infura-ipfs.io/ipfs/Qmea1CX8yft7AUjnHHB238VJQSkvHzCsijkUqiWtYJhiYg", "UnopenedBox": "https://infura-ipfs.io/ipfs/QmTvPL8WMDjmTCKwZNce4oWnf1vW4cCx8tBbcejygesNrw"}

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
async function getTag() {
    let listedItems = await axios.post(`https://api.cnft.io/market/listings`, payLoad);
    let tag = listedItems.headers.etag;
    let data = listedItems.data.results[0];
    let listings = listedItems.data.count
    return [tag, listings, data]
}

async function getAccessories() {
    let listedItems = await axios.post(`https://api.cnft.io/market/listings`, payLoad2);
    let tag = listedItems.headers.etag;
    let data = listedItems.data.results[0];
    let listings = listedItems.data.count
    return [tag, listings, data]
}


function discordListing(data) {
    const channel = client.channels.cache.get('919165272705876008');
    let name = data.asset.metadata.name
    let nameGif = name.substr(-3)
    let price = data.price/1000000
    let listing = data._id
    let link = `https://cnft.io/token/${listing}`
    let smartContract = (data.smartContractTxid) ? "Yes":"No";
    let image = `https://pixelhead.io/images/tokens/${nameGif}1.gif`

    const exampleEmbed = new MessageEmbed()
        .setColor(getColour(data, price))
        .setTitle(name)
        .setURL(link)
        .setAuthor('Recently listed Pixel Head Squad')
        .setThumbnail('https://pixelhead.io/static/media/logotype-web.04e0f3d1.png')
        .addFields(
            { name: 'Listed for:', value: `₳ ${price}` },
            { name: "Smart Contract: ", value: smartContract}
        )
        .setImage(image)
        .setTimestamp()
        .setFooter('cnft.io bot | trenchatop');

    channel.send({ embeds: [exampleEmbed] });
}
function discordListingA(data) {
    const channel = client.channels.cache.get('919165272705876008');
    let name = data.asset.metadata.name
    let nameGif = name.replace(/[^A-Z+a-z]+/g, '');
    let price = data.price/1000000
    let listing = data._id
    let link = `https://cnft.io/token/${listing}`
    let smartContract = (data.smartContractTxid) ? "Yes":"No";
    let image = (accessoriesGif[nameGif])

    const exampleEmbed = new MessageEmbed()
        .setColor(getColour(data, price))
        .setTitle(name)
        .setURL(link)
        .setAuthor('Recently listed Pixel Head Squad')
        .setThumbnail('https://pixelhead.io/static/media/logotype-web.04e0f3d1.png')
        .addFields(
            { name: 'Listed for:', value: `₳ ${price}` },
            { name: "Smart Contract: ", value: smartContract}
        )
        .setImage(image)
        .setTimestamp()
        .setFooter('cnft.io bot | trenchatop');

    channel.send({ embeds: [exampleEmbed] });
}

async function checkTag() {
    while(true) {
      
      const [currentTag, currentListings] = await getTag()
  
      await delay(4000);
      
      const [newTag, newListings, data] = await getTag()
  
      if (currentTag != newTag) {

        if (currentListings < newListings) {
  
          console.log("New PH Listing")
          discordListing(data)
  
        }else if (currentListings == newListings) {
  
          console.log("New Offer PH")

        }else {
  
          console.log("Delisted/Sold PH")

        }
  
      }else {
        
      }
    }
}

async function checkAccessories() {
    while(true) {
      
      const [currentTag, currentListings] = await getAccessories()
  
      await delay(4000);
      
      const [newTag, newListings, data] = await getAccessories()
  
      if (currentTag != newTag) {

        if (currentListings < newListings) {
  
          console.log("New PHA Listing")
          discordListingA(data)
  
        }else if (currentListings == newListings) {
  
          console.log("New Offer PHA")

        }else {
  
          console.log("Delisted/Sold PHA")

        }
  
      }else {
        
      }
    }
}
async function run(){
    (checkTag(), checkAccessories());
  }
client.once('ready', () => {
    run();
});

client.login(token);