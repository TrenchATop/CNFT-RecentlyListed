const axios = require('axios')
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MessageEmbed } = require('discord.js');

const delay = ms => new Promise(res => setTimeout(res, ms));
const payLoad = {"search":"","types":["listing","offer"],"project":"BabyAlienClub","sort":{"_id":-1},"priceMin":null,"priceMax":null,"page":1,"verified":true,"nsfw":false,"sold":false}
const PixelGif = {'PixelHead #001': 'https://pixelhead.io/images/tokens/0011.gif', 'PixelHead #002': 'https://pixelhead.io/images/tokens/0021.gif', 'PixelHead #003': 'https://pixelhead.io/images/tokens/0031.gif', 'PixelHead #004': 'https://pixelhead.io/images/tokens/0041.gif', 'PixelHead #005': 'https://pixelhead.io/images/tokens/0051.gif', 'PixelHead #006': 'https://pixelhead.io/images/tokens/0061.gif', 'PixelHead #007': 'https://pixelhead.io/images/tokens/0071.gif', 'PixelHead #008': 'https://pixelhead.io/images/tokens/0081.gif', 'PixelHead #009': 'https://pixelhead.io/images/tokens/0091.gif', 'PixelHead #010': 'https://pixelhead.io/images/tokens/0101.gif', 'PixelHead #011': 'https://pixelhead.io/images/tokens/0111.gif', 'PixelHead #012': 'https://pixelhead.io/images/tokens/0121.gif', 'PixelHead #013': 'https://pixelhead.io/images/tokens/0131.gif', 'PixelHead #014': 'https://pixelhead.io/images/tokens/0141.gif', 'PixelHead #015': 'https://pixelhead.io/images/tokens/0151.gif', 'PixelHead #016': 'https://pixelhead.io/images/tokens/0161.gif', 'PixelHead #017': 'https://pixelhead.io/images/tokens/0171.gif', 'PixelHead #018': 'https://pixelhead.io/images/tokens/0181.gif', 'PixelHead #019': 'https://pixelhead.io/images/tokens/0191.gif', 'PixelHead #020': 'https://pixelhead.io/images/tokens/0201.gif', 'PixelHead #021': 'https://pixelhead.io/images/tokens/0211.gif', 'PixelHead #022': 'https://pixelhead.io/images/tokens/0221.gif', 'PixelHead #023': 'https://pixelhead.io/images/tokens/0231.gif', 'PixelHead #024': 'https://pixelhead.io/images/tokens/0241.gif', 'PixelHead #025': 'https://pixelhead.io/images/tokens/0251.gif', 'PixelHead #026': 'https://pixelhead.io/images/tokens/0261.gif', 'PixelHead #027': 'https://pixelhead.io/images/tokens/0271.gif', 'PixelHead #028': 'https://pixelhead.io/images/tokens/0281.gif', 'PixelHead #029': 'https://pixelhead.io/images/tokens/0291.gif', 'PixelHead #030': 'https://pixelhead.io/images/tokens/0301.gif', 'PixelHead #031': 'https://pixelhead.io/images/tokens/0311.gif', 'PixelHead #032': 'https://pixelhead.io/images/tokens/0321.gif', 'PixelHead #033': 'https://pixelhead.io/images/tokens/0331.gif', 'PixelHead #034': 'https://pixelhead.io/images/tokens/0341.gif', 'PixelHead #035': 'https://pixelhead.io/images/tokens/0351.gif', 'PixelHead #036': 'https://pixelhead.io/images/tokens/0361.gif', 'PixelHead #037': 'https://pixelhead.io/images/tokens/0371.gif'}
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
function getColour(price){
    if (price == 6969) {
        const color =  '#ff1500';
        return color;
    }else if (price > 2000) {
        const color = '#fbff00';
        return color;
    }else {
        const color = '#0099ff';
        return color;
    } 
        
}
async function getTag() {
    let listedItems = await axios.post(`https://api.cnft.io/market/listings`, payLoad);
    let tag = listedItems.headers['etag'];
    let newData = listedItems.data.results[0];
    let listings = listedItems.data.count;
    return {tag, newData, listings}
}
function discordListing(Data) {
    const channel = client.channels.cache.get('919165272705876008');
    let name = Data.asset.metadata.name
    let nameFalse = 'PixelHead #011'
    let price = Data.price/1000000
    let listing = Data["_id"]
    let link = ("https://cnft.io/token/"+listing)

    const exampleEmbed = new MessageEmbed()
        .setColor(getColour(price))
        .setTitle(name)
        .setURL(link)
        .setAuthor('Recently listed Pixel Head Squad')
        .setThumbnail('https://pixelhead.io/static/media/logotype-web.04e0f3d1.png')
        .addFields(
            { name: 'Listed for:', value: "₳ "+price },
        )
        .setImage(PixelGif[nameFalse])
        .setTimestamp()
        .setFooter('cnft.io bot | trenchatop');

    channel.send({ embeds: [exampleEmbed] });
}
async function checkTag() {
    while (true) {
        let currentTag = (await getTag()).tag;
        let currentListings = (await getTag()).listings;
        await delay(2000);
        let newListings = (await getTag()).listings;
        if(currentTag == (await getTag()).tag) {
        }else {
            console.log("Tags are different")
            if(currentListings < newListings) {
                console.log(currentListings - newListings)
                console.log("New listing")
                let Data = (await getTag()).newData;
                discordListing(Data)
                console.log('finished')
            } else {
                console.log(currentListings - newListings)
                console.log("Something has sold/delisted")
            }  
        }
    }
}
client.once('ready', () => {
    checkTag();
});

client.login(token);

