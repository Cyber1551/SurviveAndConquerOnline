# SurviveAndConquerOnline


***Warning***
I do not recommend this game to anyone WITHOUT javascript knowledge. The reason is this game is not consumer-ready, there are still some bugs that need to be fixed.
For example: The account exp bar (NOT in game) is draw outside the border on max exp gain. The reason is drawing to the canvas is faster than updating the database. It does fix itself after another game. I would also recommend changing the textures since I am NOT an artist :)

This game is a MOBA-like game where 2, 4, or 6 players battle it out to gain control of a center point.
There is a full account system in place along with Exp, leveling, gold, and stats.

![alt text](https://raw.githubusercontent.com/cyberboy1551/SurviveAndConquerOnline/master/Picts/Login.PNG)

This is the account page

![alt text](https://raw.githubusercontent.com/cyberboy1551/SurviveAndConquerOnline/master/Picts/Account.PNG)

I've also implemented stats and a win rate

![alt text](https://raw.githubusercontent.com/cyberboy1551/SurviveAndConquerOnline/master/Picts/Stats.PNG)

Once you start a match it takes you into a planning page where you see all your opponents.

![alt text](https://raw.githubusercontent.com/cyberboy1551/SurviveAndConquerOnline/master/Picts/Prepare.PNG)

Then the battle begins. You start out by picking an element each play a little differently (Water: More Health and regen, Fire: More Damage, Less Health, Etc)

![alt text](https://raw.githubusercontent.com/cyberboy1551/SurviveAndConquerOnline/master/Picts/Game1.PNG)

I based the stats off of League Of Legends (Attack, Attack Spd, Life Steal, Etc). 

![alt text](https://raw.githubusercontent.com/cyberboy1551/SurviveAndConquerOnline/master/Picts/Stats2.PNG)

These increase with items you buy throughout the game and can be upgraded to increase strength.

![alt text](https://raw.githubusercontent.com/cyberboy1551/SurviveAndConquerOnline/master/Picts/Upgrade.PNG)


The goal of the game is to capture the center point (100%) you do so by shooting bullets that deal damage based on the items you have.

![alt text](https://raw.githubusercontent.com/cyberboy1551/SurviveAndConquerOnline/master/Picts/Shoot.PNG)



I've also implemented a chat, leaver feature (will end the game if someone refreshes), and a bullet guide (currently disabled)
The database is MongoDB and is located in app.js

**This link is no longer accessible**
You can test it at http://powerful-depths-52127.herokuapp.com (User: aaa, bbb, ccc, ddd; Pass is 123 for all or you can create your own)


