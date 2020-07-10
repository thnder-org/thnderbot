const Discord = require('discord.js')

class DnDHelper{


    rollForHotness(){
        let hotness = this.getRandomInt(10)
        let response = [
            {hotness: 1, text: "Look away.", reactions:["💀"]},
            {hotness: 2, text: "You're not very happy to see this person.", reactions:["🤮"]},
            {hotness: 3, text: "Maybe not.", reactions:["🤢"]},
            {hotness: 4, text: "Ummmmm...", reactions:["😑"]},
            {hotness: 5, text: "Meh?", reactions:["😐"]},
            {hotness: 6, text: "Not bad.", reactions:[""]},
            {hotness: 7, text: "I would.", reactions:["😊"]},
            {hotness: 8, text: "They've got something going on.", reactions:["😚"]},
            {hotness: 9, text: "You're feeling thirsty.", reactions:["😍"]},
            {hotness: 10, text: "I guess... if I have to.", reactions:["🔥", "💯", "🍆", "🍑", "🙏", "💦"]},
        ]

        return response.filter(entry => entry.hotness == hotness)[0]
    }

    roll(message){
        let split = message.split(" ")

        if(split.length != 2)
            return "You must send the command in the format '!roll d20' where the 20 can be any number"

        let number = split[1].toLowerCase().split("d")

        if(number.length != 2)
            return "You must send the command in the format '!roll d20' where the 20 can be any number"

        let plusNumber = split[1].split("+")
        if(plusNumber.length > 1)
            plusNumber = parseInt(plusNumber[1])
        else
            plusNumber = 0

        if(number[0].length > 0){
            let totalRolls = parseInt(number[0])
            let total = 0
            let rolls = []

            for(let i = 0; i < totalRolls; i++){
                let roll = this.getRandomInt(parseInt(number[1]))
                rolls.push(roll)
                total += roll
            }
            let response = `You rolled a ${total}+${plusNumber}=${total+plusNumber} (${rolls.join(", ")})`

            return response
        } else{
            number = number[1]
            return `You rolled a ${this.getRandomInt(parseInt(number))}.`
        }
    }

    rollAllStats(){
        let stats = []

        for(let i = 0; i < 6; i++)
            stats.push(this.rollStat())

        let embedFields = stats.map((stat) => {
            return {name: stat.total, value: `${stat.rolls.join(", ")} and dropped a ${stat.lowest}`, inline:true}
        })

        let embed = new Discord.MessageEmbed({
            fields: embedFields
        })
            .setColor('#0099ff')
            .setTitle("D&D Stats")
            .setURL('https://thnder.com/')
            .setDescription('Here are your stats')
            .setThumbnail('https://thnder.com/images/brand_icon.png')
            .setTimestamp()

        return embed
    }

    rollStats(){
        let stat = this.rollStat()
        return `You rolled a ${stat.total} (${stat.rolls.join(", ")} and dropped a ${stat.lowest})`
    }


    rollStat(){
        let diceRolls = []

        for(let i = 0; i < 4; i++)
            diceRolls.push(this.getRandomInt(6))

        diceRolls = diceRolls.sort((a,b) => a-b)
        let lowest = diceRolls[0]
        diceRolls.splice(0,1)
        let total = diceRolls.reduce((a, b) => a + b)

        let stats = {
            rolls : diceRolls,
            total : total,
            lowest : lowest
        }
        return stats
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max) + 1)
    }

    prayForAvon(){
        let bibles = this.getRandomInt(100)

        if(bibles == 100)
            return `You summon ${bibles} bibles! Avon is risen!`
        else
            return `You summoned ${bibles} bibles.`
    }
}

module.exports = new DnDHelper