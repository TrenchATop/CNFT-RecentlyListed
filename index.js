const axios = require('axios')
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MessageEmbed } = require('discord.js');

const delay = ms => new Promise(res => setTimeout(res, ms));
const payLoad = {"search":"","types":["listing","offer"],"project":"BabyAlienClub","sort":{"_id":-1},"priceMin":null,"priceMax":null,"page":1,"verified":true,"nsfw":false,"sold":false}
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

async function getTag() {
    const listedItems = await axios.post(`https://api.cnft.io/market/listings`, payLoad);
    const tag = listedItems.headers['etag'];
    const newData = listedItems.data.results[0];
    const listings = listedItems.data.count;
    return {tag, newData, listings}
}
function discordListing(Data) {
    const channel = client.channels.cache.get('919165272705876008');
    const name = Data.asset.metadata.name
    const price = Data.price/1000000
    const listing = Data["_id"]
    const link = ("https://cnft.io/token/"+listing)
    const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(name)
        .setURL(link)
        .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'Listed for:', value: "ADA "+price },
        )
        .addField('Inline field title', 'Some value here', true)
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

    channel.send({ embeds: [exampleEmbed] });
}
async function checkTag() {
    while (true){
        const currentTag = (await getTag()).tag;
        const currentListings = (await getTag()).listings;
        await delay(4000);
        const newTag = (await getTag()).tag;
        const newListings = (await getTag()).listings;
        if(currentTag == newTag) {
            continue;
            
        }else {
            console.log("Tags are different")
            console.log(currentListings)
            if(currentListings < newListings){
                console.log("New listing")
                const Data = (await getTag()).newData;
                discordListing(Data)
            }else {
                console.log("Something has sold/delisted")
            }
        }
    }
}
client.once('ready', () => {
    checkTag();
});

client.login(token);

