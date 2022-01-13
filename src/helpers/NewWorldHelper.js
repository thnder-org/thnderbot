const Discord = require('discord.js')

class NewWorldHelper{
    constructor(){
        this.commands = [
            {
                command:"!nw info",
                text: "Provides the server info in chat",
                role: "all"
            },
            {
                command:"!nw tools <grade>",
                text: "Provides a list of the materials necessary to craft a specific grade of tools. Avaliable grades are iron, steel, and starmetal. eg !nw tools steel",
                role: "all"
            },
            {
                command: "!nw help",
                text: "You're looking at it!",
                role: "all"
            }
        ]
    }

    parseMessage(msg, payload){
        let command = msg.split(" ")[1].toLowerCase()
        switch(command){
            case("help"):
                payload.response = this.help()
                payload.private = false;
                break;
            case("server"):
            case("info"):
                payload.response = this.info()
                payload.private = false;
                break;
            case("tools"):
                payload.response = this.tools(msg.split(" ")[2].toLowerCase())
                payload.private = false;
                break;
            default:
                payload.response = this.default()
                payload.private = true;
                break;
        }
        return payload
        
    }

    info(){
        let serverInfo = [
            {name: "Region", value:"USEast"},
            {name: "Server", value:"Olympus"},
            {name: "Faction", value:"Marauders"}
        ]

        let embed = new Discord.MessageEmbed({
            fields: serverInfo
        })
            .setColor('#0099ff')
            .setTitle("New World Server Info")
            .setTimestamp()

        return embed
    }

    tools(grade){

        let typesOfTools = [
            {"name": "Logging Axe", cost:"high"},
            {"name": "Mining Pick", cost:"high"},
            {"name": "Skinning Knife", cost:"low"},
            {"name": "Sickle", cost:"low"}
        ]

        let tools = {
            iron: {
                high:{ingots:12, wood:3, leather:2},
                low:{ingots:7, wood:2, leather:1}
            },
            steel: {
                high:{ingots:13, wood:3, leather:2},
                low:{ingots:8, wood:2, leather:1}
            },
            starmetal: {
                high: {ingots:14, wood:3, leather:2},
                low: {ingots:9, wood:2, leather:1}
            }
        }

        if (tools[grade] == null)
            return "You must specify a grade of tools"

        let total = {ingots:0, wood:0, leather:0}

        let fields = []
        for(let tool = 0; tool < typesOfTools.length; tool++){
            fields.push({
                name: typesOfTools[tool].name,
                value: `
                - ${tools[grade][typesOfTools[tool].cost].ingots} ${this.capitalize(grade)} Ingot
                - ${tools[grade][typesOfTools[tool].cost].wood} Refined Wood
                - ${tools[grade][typesOfTools[tool].cost].leather} Refined Leather
                `
            })
            total.ingots += tools[grade][typesOfTools[tool].cost].ingots
            total.wood += tools[grade][typesOfTools[tool].cost].wood
            total.leather += tools[grade][typesOfTools[tool].cost].leather
        }

        fields.push({name: "Total",   value: `
        - ${total.ingots} ${this.capitalize(grade)} Ingot
        - ${total.wood} Refined Wood
        - ${total.leather} Refined Leather}`
        })
       
        let embed = new Discord.MessageEmbed({
            fields: fields
        })
            .setColor('#0099ff')
            .setTitle(`${this.capitalize(grade)} Tools`)
            .setTimestamp()


        return embed
    }

    capitalize(str) {
        const lower = str.toLowerCase();
        return str.charAt(0).toUpperCase() + lower.slice(1);
    }

    help(){
        let embedFields = this.commands.map((element) => {
            return {name: element.command, value: element.text}
        })

        let embed = new Discord.MessageEmbed({
            fields: embedFields
        })
            .setColor('#0099ff')
            .setTitle("New World Help")
            .setDescription('Here are your available New World commands')
            .setTimestamp()

        return embed
    }


    default(){
        return `You must provide a command for New World info. Options are: "Info", "Server"`
    }
}

module.exports = new NewWorldHelper