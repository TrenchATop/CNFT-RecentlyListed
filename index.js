const axios = require('axios')
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MessageEmbed } = require('discord.js');

const delay = ms => new Promise(res => setTimeout(res, ms));
const payLoad = {"search":"","types":["listing","offer"],"project":"The Pixel Head Squad","sort":{"_id":-1},"priceMin":null,"priceMax":null,"page":1,"verified":true,"nsfw":false,"sold":false,"smartContract":false}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
function getColour(Data, price){
    if (Data.smartContractTxid) {
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
    let tag = listedItems.headers['etag'];
    let newData = listedItems.data.results[0];
    let listings = listedItems.data.count;
    return {tag, newData, listings}
}

function discordListing(Data) {
    const channel = client.channels.cache.get('919165272705876008');
    let name = Data.asset.metadata.name
    let nameGif = name.substr(-3)
    let price = Data.price/1000000
    let listing = Data._id
    let link = `https://cnft.io/token/${listing}`
    let smartContract = (Data.smartContractTxid) ? "Yes":"No";
    let image = `https://pixelhead.io/images/tokens/${nameGif}1.gif`

    const exampleEmbed = new MessageEmbed()
        .setColor(getColour(Data, price))
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
    while (true) {
        let currentTag = (await getTag()).tag;
        let currentListings = (await getTag()).listings;
        await delay(2000);
        let newListings = (await getTag()).listings;

        if(currentTag == (await getTag()).tag) {
            continue;
            
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

