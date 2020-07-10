var DnDHelper = require("./DnDHelper.js")
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
                command: "!roll",
                text: "Roll a dice equal to the number requested, Example: !roll d20",
                role: "all"
            },
            {
                command: "!rollstat",
                text: "Rolls 4d6 and takes the highest 3, Example: !rollstats",
                role: "all"
            },
            {
                command: "!rollallstat",
                text: "Rolls 6 stats for building a character. Rolls 4d6 and takes the highest 3, Example: !rollallstats",
                role: "all"
            },
            {
                command: "!report",
                text: "This is currently being written. Submits a server report via the bot. The report is anonymous unless you include your name and that you would like to be contacted. Please include details like which channel the incident occurred at and at what time.",
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
            payload.isCommand = true
            payload.command = command
            switch(command){

                //Admin Functions
                case "!messagechannel":
                case "!messagechannelwithimage":
                    if(!canAdmin){
                        payload.target = "user"
                        payload.response = "You must be an admin to message channels via the bot."
                        return payload
                    }
                    payload.target = "channel"
                    payload.private = false
                    return this.messageChannel(msg, payload)

                // Non admin functions
                // public responses
                case "!ping":
                    payload.target = "user"
                    payload.private = false
                    return this.pong(msg, payload)
                case "!prayforavon":
                    payload.target = "user"
                    payload.private = false
                    return this.prayForAvon(msg, payload)
                case "!rollforhotness":
                    payload.target = "user"
                    payload.private = false
                    return this.rollForHotness(msg, payload)
                case "!roll":
                    payload.target = "user"
                    payload.private = false
                    return this.roll(msg, payload)
                case "!rollstat":
                    payload.target = "user"
                    payload.private = false
                    return this.rollStats(msg, payload)
                case "!rollallstats":
                    payload.target = "user"
                    payload.private = false
                    return this.rollAllStats(msg, payload)
                case "!help":
                case "!commands":
                    payload.target = "user"
                    payload.private = false
                    return this.getcommands(msg, canAdmin, payload)

                // private responses
                case "!points":
                    payload.target = "user"
                    payload.private = true
                    return this.points(msg, payload)
                case "!report":
                    payload.target = "user"
                    payload.private = true
                    return this.report(msg, payload)
            }
        }
        return payload
    }

    rollForHotness(msg, payload){
        let hotness = DnDHelper.rollForHotness()
        payload.response = `They rolled a ${hotness.hotness}/10. ${hotness.text}`
        payload.reactions = hotness.reactions
        return payload
    }

    prayForAvon(msg, payload){
        payload.response = DnDHelper.prayForAvon()
        payload.reactions = ["🙏"]
        return payload
    }

    roll(msg, payload){     
        payload.response = DnDHelper.roll(msg.content)
        return payload
    }

    rollAllStats(msg, payload){     
        payload.response = DnDHelper.rollAllStats()
        return payload
    }

    rollStats(msg, payload){     
        payload.response = DnDHelper.rollStats()
        return payload
    }

    report(msg, payload){
        payload.response = msg.content.replace("!report").trim()
        return payload
    }

    getcommands(msg, canAdmin, payload){
        let embedFields = this.commands.map((element) => {
            if(canAdmin){
               return {name: element.command, value: element.text}
            } else{
                if(element.role != "admin"){
                    return {name: element.command, value: element.text}
                }
            }
        })

        let embed = new Discord.MessageEmbed({
            fields: embedFields
        })
            .setColor('#0099ff')
            .setTitle(payload.command)
            .setURL('https://thnder.com/')
            .setDescription('Here are your available commands')
            .setThumbnail('https://thnder.com/images/brand_icon.png')
            .setTimestamp()

        payload.response = embed
        return payload
    }

    pong(msg, payload){
        payload.response = "!pong"
        return payload
    }

    points(msg, payload){
        payload.response = "under construction"
        return payload
    }

    messageChannel(msg, payload){
        // Split and process out messages
        let channelMessage = msg.content.replace("!messagechannelwithimage ", "", 1).replace("!messagechannel ", "", 1).trim()
        let splitMessage = channelMessage.split(" ")

        // Check for channel ID
        if(!splitMessage[0].startsWith("<#")){
            payload.target = "user"
            payload.response = "You send a proper channel name. eg. #announcements"
            return payload
        }

        payload.channel_id = splitMessage[0].replace("<#", "", 1).replace(">", "", 1).trim()
        payload.response = channelMessage.replace(`<#${payload.channel_id}>`, "", 1).trim()
        if(msg.content.includes("!messagechannelwithimage")){
            if(channelMessage.includes("url=")){
                payload.response = new Discord.MessageAttachment(channelMessage.split("url=")[1])
            }else{
                payload.target = "user"
                payload.response = "You send a proper url formate. eg. url=https://yourface.com"
                return payload
            }
        }else{
            if(payload.response.length == 0)
                payload.response = "\u200b\n"
        }
        
        return payload
    }
}
    









module.exports = CommandHelper