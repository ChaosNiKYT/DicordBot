//main Token and preset command handler and command runner
require('dotenv').config();
const discord = require('discord.js');
const client = new discord.Client();
const PREFIX = process.env.PREFIX;
client.login(process.env.BOT_TOKEN);
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`);
});

//command functions 
//main command function
const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(PREFIX + cmdName);
//roll dice command function
const rolldice = () => Math.floor(Math.random() * 6) + 1;
//add role command functions
const checkPermissoinRole = (role) => role.permissions.has('ADMINISTRATOR') || 
role.permissions.has('KICK_MEMBERS') ||
role.permissions.has('BAN_MEMBERS') ||
role.permissions.has('MANAGE_GUILD') ||
role.permissions.has('MANAGE_CHANNELS');

//commands
client.on('message', function(message) {
    if(message.author.bot) return;
    //hello command
    if(isValidCommand(message, "hello"))
       message.reply("Sup dude!");
       //roll dice command
    else if(isValidCommand(message, "rolldice"))
        message.reply("rolled a " + rolldice());
        //Role add command
    else if(isValidCommand(message, "add")) {
        let args = message.content.toLowerCase().substring(5);
        let roleNames = args.split(", ");
        let roleSet = new Set(roleNames);
        let { cache } = message.guild.roles;

        roleSet.forEach(roleName => {
            let role = cache.find(role => role.name.toLowerCase() === roleName);
        if(role) {
            if(message.member.roles.cache.has(role.id)) {
                message.channel.send("you already have this role XD");
                return;
            }
                if(checkPermissoinRole(role)) {
                        message.channel.send("HALT you violated the law! you cannot add youself to this role!");
                    }
                    else {
                        message.member.roles.add(role)
                            .then(member => message.channel.send("Congarts! you where added to this role!"))
                            .catch(err => {
                                console.log(err);
                                message.channel.send("NOOO! something when wrong...");
                            });
                    }
        }
        else {
            message.channel.send("unfortunantly the following role was not found!");
        }
        });
        
    }
    else if(isValidCommand(message, "del")) {
        let args = message.content.toLowerCase().substring(5);
        let roleNames = args.split(", ");
        let roleSet = new Set(roleNames);
        let { cache } = message.guild.roles;
        roleSet.forEach(roleName => {
            let role = cache.find(role => role.name.toLowerCase() === roleName);
            if(role) {
                if(message.member.roles.cache.has(role.id)) {
                    message.member.roles.remove(role)
                        .then(member => message.channel.send("you where removed from this role!"))
                        .catch(err => {
                            console.log(err);
                            message.channel.send("something went wrong...");
                        });
                    
            }   
        }
        else {
            message.channel.send("unfortunantly the following role was not found!");
        }
        });
    }
});
//end