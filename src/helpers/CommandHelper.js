const Discord = require('discord.js')

class CommandHelper{
    constructor(client){
        this.client = client

        // A list of all our commands
        this.commands = [
            {
                command:"!messagechannel",
                text: "Sends a message to a channel from the bot, Example: !messagechannel #<channel_name> <message>",
                role: "admin"
            },
            {
                command:"!messagechannelwithimage",
                text: "Sends a message with an image to a channel from the bot, Example: !messagechannel #<channel_name> <message> url=https://thnder.com",
                role: "admin"
            },
            {
                command:"!ping",
                text: "Gives you a pong, Example: !ping",
                role: "all"
            },
            {
                command: "!points",
                text: "Returns your stream points, Example: !points",
                role: "all"
            },
            {
                command: "!commands",
                text: "You're looking at it!",
                role: "all"
            }
        ]
        
    }



    async parseMessage(msg, canAdmin){
        var payload = {
            isCommand: false
        }

        if(msg.content.startsWith("!")){
            var command = msg.content.split(" ")[0]
            switch(command){
                //Admin Functions
                case "!messagechannel":
                case "!messagechannelwithimage":
                    if(!canAdmin){
                        payload.target = "user"
                        payload.response = "You must be an admin to message channels via the bot."
                        return payload
                    }
                    return this.messageChannel(msg)

                // Non admin functions
                case "!ping":
                    return this.pong(msg)
                case "!points":
                    return this.points(msg)
                case "!help":
                case "!commands":
                    return this.getcommands(msg, canAdmin)
            }
        }
        return payload
    }

    getcommands(msg, canAdmin){
        let payload = {}

        payload.isCommand = true
        payload.target = "user"
        payload.private = false
        payload.command = "!commands"

                    
        let embedFields = this.commands.map((element) => {
            if(canAdmin){
               return {name: element.command, value: element.text}
            } else{
                if(element.role != "admin"){
                    return {name: element.command, value: element.text}
                }
            }

        })
        console.log(embedFields)

        let embed = new Discord.MessageEmbed({
            fields: embedFields
        })
            .setColor('#0099ff')
            .setTitle(payload.command)
            .setURL('https://thnder.com/')
            .setDescription('Here are your available commands')
            .setThumbnail('https://thnder.com/images/brand_icon.png')
            .setTimestamp()

        // this.commands.forEach(element => {
        //     embed.addField(element)
        // })
            
        console.log(embed)

        payload.response = embed

        return payload
    }

    pong(msg){
        let payload = {}

        payload.isCommand = true
        payload.target = "user"
        payload.response = "!pong"
        payload.private = false
        payload.command = "!ping"

        return payload
    }

    points(msg){
        let payload = {}

        payload.isCommand = true
        payload.target = "user"
        payload.private = true
        payload.response = "under construction"
        payload.command = "!points"

        return payload
    }

    messageChannel(msg){
        let payload = {}
        payload.isCommand = true

        // Split and process out messages
        let channelMessage = msg.content.replace("!messagechannelwithimage ", "", 1).replace("!messagechannel ", "", 1).trim()
        let splitMessage = channelMessage.split(" ")

        // Check for channel ID
        if(!splitMessage[0].startsWith("<#")){
            payload.target = "user"
            payload.response = "You send a proper channel name. eg. #announcements"
            return payload
        }

        payload.target = "channel"
        payload.channel_id = splitMessage[0].replace("<#", "", 1).replace(">", "", 1).trim()
        payload.response = channelMessage.replace(`<#${payload.channel_id}>`, "", 1).trim()
        if(msg.content.includes("!messagechannelwithimage")){
            payload.command = "!commands"
            if(channelMessage.includes("url=")){
                payload.url = channelMessage.split("url=")[1]
            }else{
                payload.target = "user"
                payload.response = "You send a proper url formate. eg. url=https://yourface.com"
                return payload
            }
        }else{
            payload.command = "!messagechannel"
        }
        
            
        return payload
    }
}
    









module.exports = CommandHelper