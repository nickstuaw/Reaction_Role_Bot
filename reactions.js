#!/usr/bin/env node
/**
 * @author Nicholas Williams (CosmicSilence)
 */
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

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
        if(index > -1) {
            member.roles.add(guild.roles.cache.find(role => role.id === ROLE_REACTIONS_ROLEID_LIST[index]));
        }
    }
});
client.on('messageReactionRemove', (reaction, user) => {
    const index = ROLE_REACTIONS_MSGID_LIST.indexOf(reaction.message.id);
    if(index > -1) {
        const guild = reaction.message.guild;
        const member = guild.members.cache.get(user.id);
        if(index > -1) {
            member.roles.remove(guild.roles.cache.find(role => role.id === ROLE_REACTIONS_ROLEID_LIST[index]));
        }
    }
});
client.on('message', msg => {
    switch(msg.content) {
        case "!ping":
            msg.reply("Pong!");
            break;
        case "!pong":
            msg.reply("Ping!");
            break;
    }
});
