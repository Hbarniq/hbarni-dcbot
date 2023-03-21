const { Colors } = require("../../extra/colors");

module.exports = {
  data: {
    name: "infoMenu",
  },
  async run(client, interaction) {
    const selected = interaction.data.values.raw[0];

    switch (selected) {
      case "rulesEmbed":
        return interaction.createMessage({
          flags: 64,
          embeds: [{
            title: "rules",
            color: Colors.Neutral,
            description:
              "there isnt too many of these i just have to make a rules channel",
            fields: [
              {
                name: "1. Dont break discord TOS",
                value:
                  "https://discord.com/terms\nhttps://discord.com/guidelines",
              },
              {
                name: "2. Humans only, have fun :D",
                value: "dont start a raid...",
              },
              {
                name: "3. no spam",
                value: "this is the same, dont spam anyone",
              },
              {
                name: "4. no harmful stuff",
                value:
                  "you are **not** allowed to dos or do any kind of harmful action to the server and **do not** distribute anyone's personal data.",
              },
            ],
          }],
        });
        
      case "infoEmbed":
        return interaction.createMessage({
          flags: 64,
          embeds: [{
            title: "general info / FAQ",
            description:
              "there is a couple of other things that you should know next to the rules, also this is kind of a **faq**",
            color: Colors.Neutral,
            fields: [
              {
                name: "how do I install the modpack?",
                value:
                  'You can find info on how to install\nby choosing the "modpack installation help" option',
              },
              {
                name: "hey this doesnt work!",
                value:
                  "If you encounter any issues either with minecraft or with this server\nplease tell me <@419838142510530572> or create a support ticket <#1046190536685539398>",
              },
              {
                name: "how can I invite other people?",
                value:
                  "you can invite other people with this link https://discord.gg/y7kjvV3dq5",
              },
              {
                name: "how do I know when the server is online",
                value:
                  "you can either check it with </pingmc:1024704950804164619> \nor directly within the game in your main menu",
              },
            ],
          }],
        });
      
      case "installEmbed":
        return interaction.createMessage({
          flags: 64,
          embeds: [{
            title: "How to install the modpack?",
            description:
              '**installer download**\nthere is an installer for this modpack, download it from [here](https://github.com/Hbarniq/mci-reloaded/releases/latest):\n> for windows: "mci-reloaded_<version>_x64_en-US.msi"\nthis also serves as an updater for the modpack so **keep it after using it**',
            color: Colors.Neutral,
            fields: [
              {
                name: "using the installer",  
                value:
                  'using the installer itself is fairly straightforward, you simply need to select what you want to use as a launcher from the ones that were detected and everything is automatic from there\nyou can alternatively use "custom" if you dont want to install in the usual folder',
              },
              {
                name: "setup your launchers",
                value:
                  'if everything goes right your launchers should be already set up after the install\n(but you might need to restart some launchers for changes to apply)',
              },
              {
                name: "updates!",
                value: "mci-reloaded will show the newest and the current installed modpack versions and should automatically configure anything needed for updated versions"
              }
            ],
          }],
        });

      case "customEmbed": 
        return interaction.createMessage({
          flags: 64,
          embeds: [{
            title: "making custom things",
            color: Colors.Neutral,
            fields: [
              {
                name: "creating emotes",
                value:
                  "You can make your own emotes fairly easily by using emotecraft.\nThis can be done in either blender or blockbench, but im only going to detail blender as its much better for this.",
              },
              {
                name: "blender setup",
                value:
                  "You can install blender from https://www.blender.org/ or steam;\nThen you need to download the file to edit: [github page](https://github.com/KosmX/emotes/tree/dev/blender)\nfor normal usage download: emote_creator_bend.blend\nand if you want to animate items download my version of the file:\n[download my](https://cdn.discordapp.com/attachments/884107536444297296/1038824938439725066/emote_creator_bend_item.blend) (I have a version wich is better for this)",
              },
              {
                name: "animation",
                value:
                  "A great documentation on this exists on the creator's gitbook:\nhttps://kosmx.gitbook.io/emotecraft/tutorial/custom-emotes",
              },
              {
                name: "if you want to animate items with my file:",
                value:
                  'Just ask me and ill tell you how... or if you understand blender:\nyou need to animate the box empties (ItemController R,L) then after you are done with animation run the "Copy position" script in the scripting tab and only than export\n\n(using this is easier as the items are parented to the hands by default making them very difficult to animate without running in to issues)\n(but it will produce a larger file)',
              },
              {
                name: "adding sound to emotes",
                value:
                  "You can add emote audio by putting a wave (.wav) file with the same name as your emote in your emote folder\nand it will automaticly be played once you play the emote\nyou can convert audio files to wave files with online converters or VLC",
              },
            ],
          }],
        });

      default:
        break;
    }
  },
};
