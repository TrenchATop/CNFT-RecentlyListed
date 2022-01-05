const { default: axios } = require('axios');
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const pH = {
	'search':'',
	'types':['listing', 'offer'],
	'project':'The Pixel Head Squad',
	'sort':{ '_id':-1 },
	'priceMin':null,
	'priceMax':null,
	'page':1,
	'verified':true,
	'nsfw':false,
	'sold':false,
	'smartContract':false,
};
const pHI = {
	'search':'',
	'types':['listing', 'offer'],
	'project':'The Pixel Head Squad - Accessories',
	'sort':{ '_id':-1 },
	'priceMin':null,
	'priceMax':null,
	'page':1,
	'verified':true,
	'nsfw':false,
	'sold':false,
	'smartContract':false,
};
const pHS = {
	'search':'',
	'types':['listing', 'offer'],
	'project':'The Pixel Head Squad',
	'sort':{ '_id':-1 },
	'priceMin':null,
	'priceMax':null,
	'page':1,
	'verified':true,
	'nsfw':false,
	'sold':true,
	'smartContract':false,
};
const pHIS = {
	'search':'',
	'types':['listing', 'offer'],
	'project':'The Pixel Head Squad - Accessories',
	'sort':{ '_id':-1 },
	'priceMin':null,
	'priceMax':null,
	'page':1,
	'verified':true,
	'nsfw':false,
	'sold':true,
	'smartContract':false,
};

const pHPolicy = '57cde26ea73be0c3ab57f4a6f414d612a68fb901cd0f2e7157846b2d';
const pHIPolicy = 'fec624c17759a1c5040ecb4c0d3ce35fc01465d0b7ab57b266fa2b18';

let soldBot;
let listingBot;
let soldRunning = false;
let listingRunning = false;

const botLogic = {
	gettingTime: (date) => {
		return new Date(date).getTime();
	},
	nameGif: (name) => {
		const nameGif = name.split(' #')[0].replace(' ', '');
		switch (nameGif) {
		case 'BatWings':
			return 'I000_BatWings-10x.gif';
		case 'UnopenedBox':
			return 'I001-UnopenedBox-10x.gif';
		case 'GiftBoxHead':
			return 'I002-GiftBoxHead-10x.gif';
		case 'FestiveSnow':
			return 'I003-FestiveSnow-10x.gif';
		case 'Antlers':
			return 'I004-Antlers-10x.gif';
		case 'ChristmasHat':
			return 'I005-ChristmasHat-10x.gif';
		case 'Cryopod':
			return 'I006-Cryopod-10x.gif';
		default:
			console.log(`Sorry, we are out of ${nameGif}.`);
		}
	},
	cnftIo: {
		recentListings: {
			checkListingStatusOnCnftIo: (payLoad, project) => {
				axios.post('https://api.cnft.io/market/listings', payLoad)
					.then((response) => {
						const cnftListings = response.data.results.filter((data) => botLogic.gettingTime(data.createdAt) >= (new Date().getTime() - 120000));
						if (cnftListings.length) {
							botLogic.cnftIo.embeded.printListingsCnft(cnftListings, project);
							console.log('listings ' + cnftListings.length);

						}
						// No new listings otherwise

					})
					.catch((error) => {
						console.log(error);
					});
			},
		},
		recentlySold: {
			checkSoldStatusOnCnftIo: (payLoad, project) => {
				axios.post('https://api.cnft.io/market/listings', payLoad)
					.then((response) => {
						const cnftSold = response.data.results.filter((data) => botLogic.gettingTime(data.soldAt) >= (new Date().getTime() - 120000));
						if (cnftSold.length) {
							botLogic.cnftIo.embeded.printSoldCnft(cnftSold, project);
						}
						// No new listings otherwise

					})
					.catch((error) => {
						console.log(error);
					});
			},
		},
		embeded: {
			printListingsCnft: async (data, project) => {
				for (const key in data) {
					const channel = client.channels.cache.get('918052922154164234');
					const { name } = data[key].asset.metadata;
					const nameGif = name.substr(-3);
					// eslint-disable-next-line prefer-const
					let { price: price, _id: listing } = data[key];
					price = price / 1000000;
					const link = `https://cnft.io/token/${listing}`;
					const smartContract = (data[key].smartContractTxid) ? 'Yes' : 'No';
					const colour = (data[key].smartContractTxid) ? '#fbff00' : '#0099ff';
					if (project === 0) {
						const exampleEmbed = new MessageEmbed()
							.setColor(colour)
							.setTitle(name)
							.setURL(link)
							.setAuthor('Just listed Pixel Head Squad')
							.setThumbnail('https://pixelhead.io/static/media/logotype-web.04e0f3d1.png')
							.addFields(
								{ name: 'Listed for:', value: `₳ ${price}` },
								{ name: 'Smart Contract: ', value: smartContract },
							)
							.setImage(`https://pixelhead.io/images/tokens/${nameGif}1.gif`)
							.setTimestamp(Date.now())
							.setFooter('cnft.io bot | trenchatop');
						try {
							const webhooks = await channel.fetchWebhooks();
							const webhook = webhooks.find(wh => wh.token);

							if (!webhook) {
								return console.log('No webhook was found that I can use!');
							}

							await webhook.send({
								username: 'M.I.G.U.E.L.',
								avatarURL: 'https://cdn.discordapp.com/attachments/916762193784082492/920682600463482940/07-BotPets-M.png',
								embeds: [exampleEmbed],
							});
						}
						catch (error) {
							console.error('Error trying to send a message: ', error);
						}
					}
					else {
						const exampleEmbed = new MessageEmbed()
							.setColor(colour)
							.setTitle(name)
							.setURL(link)
							.setAuthor('Just listed \nPixel Head Squad Accessories')
							.addFields(
								{ name: 'Listed for:', value: `₳ ${price}`, inline: true },
								{ name: 'Smart Contract: ', value: smartContract, inline: true },
							)
							.setImage(`https://pixelhead.io/images/tokens/${botLogic.nameGif(name)}`)
							.setTimestamp(Date.now())
							.setFooter('cnft.io bot | trenchatop');
						try {
							const webhooks = await channel.fetchWebhooks();
							const webhook = webhooks.find(wh => wh.token);

							if (!webhook) {
								return console.log('No webhook was found that I can use!');
							}

							await webhook.send({
								username: 'H.U.G.O.',
								avatarURL: 'https://cdn.discordapp.com/attachments/916762193784082492/920682600685776896/07-BotPets-H.png',
								embeds: [exampleEmbed],
							});
						}
						catch (error) {
							console.error('Error trying to send a message: ', error);
						}
					}
				}
			},
			printSoldCnft: async (data, project) => {
				for (const key in data) {
					const channel = client.channels.cache.get('884532102928949309');
					const { name: name } = data[key].asset.metadata;
					const nameGif = name.substr(-3);
					let { price: price } = data[key];
					price = price / 1000000;
					if (project === 0) {
						const exampleEmbed = new MessageEmbed()
							.setColor('#0099ff')
							.setTitle(name)
							.setAuthor('Just Sold Pixel Head Squad')
							.setThumbnail('https://pixelhead.io/static/media/logotype-web.04e0f3d1.png')
							.addFields(
								{ name: 'Sold for:', value: `₳ ${price / 100000}` },
							)
							.setImage(`https://pixelhead.io/images/tokens/${nameGif}1.gif`)
							.setTimestamp(Date.now())
							.setFooter('cnft.io bot | trenchatop');
						try {
							const webhooks = await channel.fetchWebhooks();
							const webhook = webhooks.find(wh => wh.token);

							if (!webhook) {
								return console.log('No webhook was found that I can use!');
							}

							await webhook.send({
								username: 'M.I.G.U.E.L.',
								avatarURL: 'https://cdn.discordapp.com/attachments/916762193784082492/920682600463482940/07-BotPets-M.png',
								embeds: [exampleEmbed],
							});
						}
						catch (error) {
							console.error('Error trying to send a message: ', error);
						}
					}
					else {
						const exampleEmbed = new MessageEmbed()
							.setColor('#0099ff')
							.setTitle(name)
							.setAuthor('Just Sold \nPixel Head Squad Accessories')
							.addFields(
								{ name: 'Sold for:', value: `₳ ${price}`, inline: true },
							)
							.setImage(`https://pixelhead.io/images/tokens/${botLogic.nameGif(name)}`)
							.setTimestamp(Date.now())
							.setFooter('cnft.io bot | trenchatop');
						try {
							const webhooks = await channel.fetchWebhooks();
							const webhook = webhooks.find(wh => wh.token);

							if (!webhook) {
								return console.log('No webhook was found that I can use!');
							}

							await webhook.send({
								username: 'H.U.G.O.',
								avatarURL: 'https://cdn.discordapp.com/attachments/916762193784082492/920682600685776896/07-BotPets-H.png',
								embeds: [exampleEmbed],
							});
						}
						catch (error) {
							console.error('Error trying to send a message: ', error);
						}
					}
				}
			},
		},
	},
	jpgStore: {
		recentListings: {
			checkListingStatusOnJpgStore: (projectId, project) => {
				axios.get(`https://jpg.store/api/policy/${projectId}/listings`)
					.then((response) => {
						const jpgListings = response.data.filter((data) => botLogic.gettingTime(data.listed_at) >= (new Date().getTime() - 120000));
						if (jpgListings.length) {
							botLogic.jpgStore.embeded.printListingsJpg(jpgListings, project);
							console.log('listings ' + jpgListings.length);

						}
						// No new listings otherwise

					})
					.catch((error) => {
						console.log(error);
					});
			},
		},
		recentlySold: {
			checkSoldStatusOnJpgStore: (projectId, project) => {
				axios.get(`https://jpg.store/api/policy/${projectId}/sales`)
					.then((response) => {
						const jpgSold = response.data.filter((data) => botLogic.gettingTime(data.purchased_at) >= (new Date().getTime() - 120000));
						if (jpgSold.length) {
							botLogic.jpgStore.embeded.printSoldJpg(jpgSold, project);

						}
						// No new listings otherwise
					})
					.catch((error) => {
						console.log(error);
					});
			},
		},
		embeded: {
			printListingsJpg: async (data, project) => {
				for (const key in data) {
					const channel = client.channels.cache.get('918052922154164234');
					const { asset: listing, asset_display_name: name, price_lovelace: price_lovelace } = data[key];
					const nameGif = name.substr(-3);
					const price = price_lovelace / 1000000;
					const link = `https://www.jpg.store/asset/${listing}`;
					if (project === 0) {

						const exampleEmbed = new MessageEmbed()
							.setColor('#fbff00')
							.setTitle(name)
							.setURL(link)
							.setAuthor('Just listed Pixel Head Squad')
							.setThumbnail('https://pixelhead.io/static/media/logotype-web.04e0f3d1.png')
							.addFields(
								{ name: 'Listed for:', value: `₳ ${price}` },
								{ name: 'Smart Contract: ', value: 'Always...' },
							)
							.setImage(`https://pixelhead.io/images/tokens/${nameGif}1.gif`)
							.setTimestamp(Date.now())
							.setFooter('jpg.store bot | trenchatop');
						try {
							const webhooks = await channel.fetchWebhooks();
							const webhook = webhooks.find(wh => wh.token);

							if (!webhook) {
								return console.log('No webhook was found that I can use!');
							}

							await webhook.send({
								username: 'M.I.G.U.E.L.',
								avatarURL: 'https://cdn.discordapp.com/attachments/916762193784082492/920682600463482940/07-BotPets-M.png',
								embeds: [exampleEmbed],
							});
						}
						catch (error) {
							console.error('Error trying to send a message: ', error);
						}
					}
					else {
						const exampleEmbed = new MessageEmbed()
							.setColor('#fbff00')
							.setTitle(name)
							.setURL(link)
							.setAuthor('Just listed \nPixel Head Squad Accessories')
							.addFields(
								{ name: 'Listed for:', value: `₳ ${price}`, inline: true },
								{ name: 'Smart Contract: ', value: 'Always ...', inline: true },
							)
							.setImage(`https://pixelhead.io/images/tokens/${botLogic.nameGif(name)}`)
							.setTimestamp()
							.setFooter('jpg.store bot | trenchatop');
						try {
							const webhooks = await channel.fetchWebhooks();
							const webhook = webhooks.find(wh => wh.token);

							if (!webhook) {
								return console.log('No webhook was found that I can use!');
							}

							await webhook.send({
								username: 'H.U.G.O.',
								avatarURL: 'https://cdn.discordapp.com/attachments/916762193784082492/920682600685776896/07-BotPets-H.png',
								embeds: [exampleEmbed],
							});
						}
						catch (error) {
							console.error('Error trying to send a message: ', error);
						}
					}
				}
			},
			printSoldJpg: async (data, project) => {
				for (const key in data) {
					const channel = client.channels.cache.get('884532102928949309');
					const { asset: listing, asset_display_name: name, price_lovelace: price_lovelace } = data[key];
					const nameGif = name.substr(-3);
					const price = price_lovelace / 1000000;
					const link = `https://www.jpg.store/asset/${listing}`;
					if (project === 0) {
						const exampleEmbed = new MessageEmbed()
							.setColor('#fbff00')
							.setTitle(name)
							.setURL(link)
							.setAuthor('Just Sold Pixel Head Squad')
							.setThumbnail('https://pixelhead.io/static/media/logotype-web.04e0f3d1.png')
							.addFields(
								{ name: 'Sold for:', value: `₳ ${price}` },
							)
							.setImage(`https://pixelhead.io/images/tokens/${nameGif}1.gif`)
							.setTimestamp(Date.now())
							.setFooter('jpg.store bot | trenchatop');
						try {
							const webhooks = await channel.fetchWebhooks();
							const webhook = webhooks.find(wh => wh.token);

							if (!webhook) {
								return console.log('No webhook was found that I can use!');
							}

							await webhook.send({
								username: 'M.I.G.U.E.L.',
								avatarURL: 'https://cdn.discordapp.com/attachments/916762193784082492/920682600463482940/07-BotPets-M.png',
								embeds: [exampleEmbed],
							});
						}
						catch (error) {
							console.error('Error trying to send a message: ', error);
						}
					}
					else {
						const exampleEmbed = new MessageEmbed()
							.setColor('#fbff00')
							.setTitle(name)
							.setURL(link)
							.setAuthor('Just Sold \nPixel Head Squad Accessories')
							.addFields(
								{ name: 'Sold for:', value: `₳ ${price}`, inline: true },
							)
							.setImage(`https://pixelhead.io/images/tokens/${botLogic.nameGif(name)}`)
							.setTimestamp()
							.setFooter('jpg.store bot | trenchatop');
						try {
							const webhooks = await channel.fetchWebhooks();
							const webhook = webhooks.find(wh => wh.token);

							if (!webhook) {
								return console.log('No webhook was found that I can use!');
							}

							await webhook.send({
								username: 'H.U.G.O.',
								avatarURL: 'https://cdn.discordapp.com/attachments/916762193784082492/920682600463482940/07-BotPets-M.png',
								embeds: [exampleEmbed],
							});
						}
						catch (error) {
							console.error('Error trying to send a message: ', error);
						}
					}
				}
			},
		},

	},
	startListingRetriever() {
		console.log('listing runnings');
		listingBot = setInterval(() => {
			botLogic.cnftIo.recentListings.checkListingStatusOnCnftIo(pH, 0);
			botLogic.cnftIo.recentListings.checkListingStatusOnCnftIo(pHI, 1);
			botLogic.jpgStore.recentListings.checkListingStatusOnJpgStore(pHPolicy, 0);
			botLogic.jpgStore.recentListings.checkListingStatusOnJpgStore(pHIPolicy, 1);

		}, 120000);
		listingRunning = true;
	},
	startSoldRetriever() {
		console.log('sold running');
		soldBot = setInterval(() => {
			botLogic.cnftIo.recentlySold.checkSoldStatusOnCnftIo(pHS, 0);
			botLogic.cnftIo.recentlySold.checkSoldStatusOnCnftIo(pHIS, 1);
			botLogic.jpgStore.recentlySold.checkSoldStatusOnJpgStore(pHPolicy, 0);
			botLogic.jpgStore.recentlySold.checkSoldStatusOnJpgStore(pHIPolicy, 1);

		}, 120000);
		soldRunning = true;
	},
};
client.once('ready', async () => {
	console.log('PH bot is running');
	botLogic.startListingRetriever();
	// botLogic.startSoldRetriever();
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (interaction.channel.id === '884532102928949309') {
		if (commandName === 'delete') {
			const string = interaction.options.getString('input');
			const channel = client.channels.cache.get('884532102928949309');
			channel.messages.delete(string);
			await interaction.reply({ content: 'Success', ephemeral: true });
		}
	}
	else if (interaction.channel.id === '918052922154164234') {
		if (commandName === 'delete') {
			const string = interaction.options.getString('input');
			const channel = client.channels.cache.get('918052922154164234');
			channel.messages.delete(string);
			await interaction.reply({ content: 'Success', ephemeral: true });
		}
	}
});

client.on('messageCreate', async message => {
	if (message.channel.id === '884532102928949309') {
		if (message.content.toLowerCase().includes('!off')) {
			message.react('✅');
			setTimeout(() => message.delete(), 10000);
			clearInterval(soldBot);
			soldRunning = false;
		}
		if (message.content.toLowerCase().includes('!on')) {
			if (!soldRunning) {
				message.react('✅');
				setTimeout(() => message.delete(), 10000);
				botLogic.startSoldRetriever();
			}
			else {
				message.react('❌');
				setTimeout(() => message.delete(), 10000);
			}
		}
	}
	else if (message.channel.id === '918052922154164234') {
		if (message.content.toLowerCase().includes('!off')) {
			message.react('✅');
			setTimeout(() => message.delete(), 10000);
			clearInterval(listingBot);
			listingRunning = false;
		}
		if (message.content.toLowerCase().includes('!on')) {
			if (!listingRunning) {
				message.react('✅');
				setTimeout(() => message.delete(), 10000);
				botLogic.startListingRetriever();
			}
			else {
				message.react('❌');
				setTimeout(() => message.delete(), 10000);
			}
		}
	}
});
client.login(token);