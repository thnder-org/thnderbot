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

    async start(){
        const client = new Discord.Client()
        this.client = client
        const commandHelper = new CommandHelper(client)

        await client.on('ready', async () => {
            console.log(`Logged in as ${client.user.tag}!`)
        })

        await client.on('message', async (msg) => {
            var canAdmin = await this.canAdmin(msg)

            var commandPayload = await commandHelper.parseMessage(msg, canAdmin)
            if(commandPayload.isCommand){
                this.sendResponse(msg, commandPayload)
            }
        })

        await client.login(auth.token)
        
        return client
    }

    async sendResponse(msg, commandPayload){
        switch(commandPayload.target){
            case "user":
                // Sending a message to a channel responding to the user
                if(commandPayload.private){
                    let dm = await this.replyInDM(msg, commandPayload)
                    return dm
                } else{
                    return this.replyInChannel(msg, commandPayload)
                }
            case "channel":
                 // Sending a message to a channel as the bot
                this.sendToChannel(commandPayload.channel_id, commandPayload.response)
                break;
            // Responsing in a DM to the user
            // default:
        }
    }
 
    async replyInChannel(msg, commandPayload){
        if(commandPayload.response == null)
            return msg.reply("You must provide a message!")
        else
            try{
                let message = await msg.reply(commandPayload.response)
                if(commandPayload.reactions != null)
                    this.react(message, commandPayload.reactions)
                return ;
            }catch(e){
                console.log(e)
            }
            
    }

    react(msg, reactions){
        reactions.forEach(reaction => {
            msg.react(reaction)
        });
    }

    async replyInDM(msg, commandPayload){
        if(commandPayload.response == null)
            await msg.author.send("You must provide a message!")
        else
            await msg.author.send(commandPayload.response);
    
        msg.delete()
        return 
    }

    async sendToChannel(channelID, message){
        let channel = await this.client.channels.fetch(channelID)
            .then(channel => {return channel})
            .catch(console.error);
        try{
            return channel.send(message)
        }catch(e){
            console.log(e)
        }
      
    }

    async canAdmin(msg){
        if(msg.channel.type != "dm"){
            let isAdmin = await msg.member.roles.cache.find(role => role.id === role_ids.admin)
            let isMod = await msg.member.roles.cache.find(role => role.id === role_ids.moderator)
            let isOwner = await msg.member.roles.cache.find(role => role.id === role_ids.owner)
    
            let isAdminOrModOrOwner = isAdmin || isMod || isOwner
            return isAdminOrModOrOwner
        }else
            return true
    }

    
}

module.exports = new DiscordHelper