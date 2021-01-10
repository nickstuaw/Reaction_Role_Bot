#!/usr/bin/env node
/**
 * @author Nicholas Williams (CosmicSilence)
 */
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('my messages. Message for help!', {type: 'WATCHING'});
});
const GUILD_ID = process.env.GUILD_ID;
const DM_FORWARDING_CHANNEL = process.env.FORWARD_DMS_TO_CHANNEL;
const DM_CONTROL_CHANNEL = process.env.DM_CONTROL_CHANNEL;
const ROLE_REACTIONS = process.env.ROLE_REACTIONS.split(",");
var ROLE_REACTIONS_MSGID_LIST = [];
var ROLE_REACTIONS_EMOJIID_LIST = [];
var ROLE_REACTIONS_ROLEID_LIST = [];
ROLE_REACTIONS.forEach(item => {
    ROLE_REACTIONS_MSGID_LIST.push(item.split(".onr.")[0])
    ROLE_REACTIONS_EMOJIID_LIST.push(item.split(".onr.")[1].split(".addr.")[0])
    ROLE_REACTIONS_ROLEID_LIST.push(item.split(".onr.")[1].split(".addr.")[1])
})

client.login(process.env.TOKEN);

client.on('messageReactionAdd', async (reaction, user) => {
    const index = ROLE_REACTIONS_MSGID_LIST.indexOf(reaction.message.id);
    if(index > -1) {
        const guild = reaction.message.guild;
        const member = guild.members.cache.get(user.id);
        member.roles.add(guild.roles.cache.find(role => role.id === ROLE_REACTIONS_ROLEID_LIST[index]));
    }
});
client.on('messageReactionRemove', (reaction, user) => {
    const index = ROLE_REACTIONS_MSGID_LIST.indexOf(reaction.message.id);
    if(index > -1) {
        const guild = reaction.message.guild;
        const member = guild.members.cache.get(user.id);
        member.roles.remove(guild.roles.cache.find(role => role.id === ROLE_REACTIONS_ROLEID_LIST[index]));
    }
});
client.on('message', msg => {
    if(msg.channel.type === "dm" && msg.author.id !== client.user.id) {
        client.guilds.cache.find(guild => guild.id === GUILD_ID).channels.cache.find(channel => channel.id === DM_FORWARDING_CHANNEL).send("`" + msg.author.tag + ":` " + msg.content);
    } else if (msg.content.startsWith("!dm ") && msg.channel.id === DM_CONTROL_CHANNEL){
        const args = msg.content.slice("!dm ".length);
        var mention = args.split(" ")[0];
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
            const user = msg.guild.members.cache.find(member => member.id === mention);
            user.createDM(true);
            user.send(args.slice(args.indexOf(" ")));
        }
    } else {
        switch(msg.content) {
            case "!ping":
                msg.reply("Pong!");
                break;
            case "!pong":
                msg.reply("Ping!");
                break;
        }
    }
});
