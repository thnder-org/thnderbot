const axios = require('axios')
const util = require('util')
var CronJob = require('cron').CronJob
const fs = require('fs')
const Discord = require('discord.js')

const auth = require('../config/auth.json')
const twitterConfig = require('../config/twitter.json')


class TwitterHelper{
    constructor(discordHelper){
        this.username = twitterConfig.username
        this.discordHelper = discordHelper
        this.twitterConfigLocation = './config/twitter.json'
    }

    start(){
        if(twitterConfig.cron){
            var job = new CronJob(twitterConfig.cron_schedule, async () => {
                let lastTweetID = this.getLatestTweetID()
                let latest = await this.getLatestTweet()
                if(lastTweetID == null || lastTweetID != latest.id){
                    await this.updateLatestTweetID(latest.id)
                    await this.postLatestTweetToDiscord(latest.full_text)
                }
                }, null, true, 'America/New_York')
            job.start()
        }
    }

    // Pulls in your latest tweet
    async getLatestTweet(){
        let url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${this.username}&tweet_mode=extended`
        let headers = {'Authorization': `Bearer ${auth.twitter.bearertoken}`}
        let res = await axios.get(url, {headers})
            .then((res) => {return res})
            .catch((e)=>console.log(e))

        return res.data[0]
    }

    getTwitterConfig(){
        let rawdata = fs.readFileSync(this.twitterConfigLocation)
        let tempTwitterConfig = JSON.parse(rawdata)
        return tempTwitterConfig
    }

    getLatestTweetID(){
        return this.getTwitterConfig().last_tweet_id
    }

    postLatestTweetToDiscord(message){
        
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setURL('https://thnder.com/')
            .setAuthor('New Tweet!', 'https://thnder.com/images/brand_icon.png', 'https://thnder.com/images/twitter_logo.svg')
            .setThumbnail('https://thnder.com/images/twitter_logo.png')
            .setDescription(message)
            .setTimestamp()

        this.discordHelper.sendToChannel(twitterConfig.auto_post_channel_id, embed)
    }

    updateLatestTweetID(id){
        let tempTwitterConfig = this.getTwitterConfig()
        tempTwitterConfig.last_tweet_id = id
        fs.writeFileSync(this.twitterConfigLocation, JSON.stringify(tempTwitterConfig));
    }
}

module.exports = TwitterHelper