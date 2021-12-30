const { default: axios } = require('axios');
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./configPH.json');

const payLoad = {
  search: '',
  types: ['listing', 'offer'],
  project: 'The Pixel Head Squad',
  sort: {
    _id: -1,
  },
  priceMin: null,
  priceMax: null,
  page: 1,
  verified: true,
  nsfw: false,
  sold: false,
  smartContract: false,
};

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const botLogic = {
  getMessageEmbedColor(data, price) {
    if (data.smartContractTxid) {
      return '#fbff00';
    } else if (price > 2000) {
      return '#ff1500';
    } else {
      return '#0099ff';
    }
  },
  checkListingStatusOnCnftIo() {
    axios.post('https://api.cnft.io/market/listings', payLoad)
      .then((response) => {
        const cnftListings = response.data.results.filter((data) => this.gettingTime(data.createdAt) >= (new Date().getTime() - 10000));
        if (cnftListings.length) {
          this.sendNewListingsToChannel(cnftListings);
        }
      })
      .catch((error) => {
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
  },
  sendNewListingsToChannel(data) {
    console.log('New Pixel Head');
    const channel = client.channels.cache.get('918052922154164234');
    for (let i = 0; i < (data.length); i += 1) {
      const { name } = data[i].asset.metadata;
      const nameGif = name.substr(-3);
      const price = data[i].price / 1000000;
      const listing = data[i]._id;
      const link = `https://cnft.io/token/${listing}`;
      const smartContract = (data[i].smartContractTxid) ? 'Yes' : 'No';
      const image = `https://pixelhead.io/images/tokens/${nameGif}1.gif`;

      const exampleEmbed = new MessageEmbed()
        .setColor(this.getMessageEmbedColor(data[i], price))
        .setTitle(name)
        .setURL(link)
        .setAuthor('Just listed Pixel Head Squad')
        .setThumbnail('https://pixelhead.io/static/media/logotype-web.04e0f3d1.png')
        .addFields(
          { name: 'Listed for:', value: `₳ ${price}` },
          { name: 'Smart Contract: ', value: smartContract },
        )
        .setImage(image)
        .setTimestamp(Date.now())
        .setFooter('cnft.io bot | trenchatop');

      channel.send({ embeds: [exampleEmbed] });
    }
  },
  startListingRetriever() {
    setInterval(this.checkListingStatusOnCnftIo, 10000);
  },
};

client.once('ready', () => {
  console.log('PH bot is running');
  botLogic.startListingRetriever();
});

client.login(token);
