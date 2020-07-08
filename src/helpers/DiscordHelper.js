// Dependencies
const Discord = require('discord.js')
const CommandHelper = require('./CommandHelper.js')

// Config files
var auth = require('../config/auth.json')
var role_ids = require("../config/role_ids.json")


class DiscordHelper {

    constructor (){
        this.client = null
    }

    start(){
        const client = new Discord.Client()
        this.client = client
        const commandHelper = new CommandHelper(client)

        client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`)
        })

        client.on('message', async (msg) => {
            var canAdmin = await this.canAdmin(msg)

            var commandPayload = await commandHelper.parseMessage(msg, canAdmin)
            if(commandPayload.isCommand){
                this.sendResponse(msg, commandPayload)
            }
        })

        client.login(auth.token)
    }

    async sendResponse(msg, commandPayload){
        switch(commandPayload.target){
            case "user":
                // Sending a message to a channel responding to the user
                if(commandPayload.private)
                    return this.replyInChannel(msg, commandPayload)
                else
                    return this.replyInChannel(msg, commandPayload)
            case "channel":
                 // Sending a message to a channel as the bot
                this.sendToChannel(commandPayload.channel_id, commandPayload.response)
                break;
            // Responsing in a DM to the user
            default:
        }
    }
 
    replyInChannel(msg, commandPayload){
        if(commandPayload.response == null)
            return msg.reply("You must provide a message!")
        else
            return msg.reply(commandPayload.response);
    }

    replyInDM(msg, commandPayload){
        if(commandPayload.response == null)
            return msg.reply("You must provide a message!")
        else
            return msg.reply(commandPayload.response);
    }




    async sendToChannel(channelID, message){
        let channel = await this.client.channels.fetch(channelID)
            .then(channel => {return channel})
            .catch(console.error);
        return channel.send(message)
    }

    async sendPicToChannel(channelID, message, picURL){
        let channel = await this.client.channels.fetch(channelID)
            .then(channel => {return channel})
            .catch(console.error);
        
        return channel.send(message, {files: [picURL]})
    }

    async canAdmin(msg){
        let isAdmin = await msg.member.roles.cache.find(role => role.id === role_ids.admin)
        let isMod = await msg.member.roles.cache.find(role => role.id === role_ids.moderator)
        let isOwner = await msg.member.roles.cache.find(role => role.id === role_ids.owner)

        let isAdminOrModOrOwner = isAdmin || isMod || isOwner
        return isAdminOrModOrOwner
    }

    
}

module.exports = new DiscordHelper