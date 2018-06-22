
var express = require("express");
var app = express();
require("./client/js/map.js");
require("./client/js/Elements.js");
var serv = require('http').Server(app);
var mongojs = require("mongojs");
var db = mongojs('mongodb://cyberboy1551:Tank1551@ds023445.mlab.com:23445/heroku_grzkxhzt', ['account']);
//var db = mongojs('localhost:27017/SurviveAndConquer', ['account']);
WIDTH = 1200;
HEIGHT = 1000;

var playersWaitingOne = [];
var usersWaitingOne = [];

var playersWaitingTwo = [];
var usersWaitingTwo = [];

var playersWaitingThree = [];
var usersWaitingThree = [];


var usersLoggedIn = [];
//var roomSize = 2;
var currentRoomID = null;
var currentRooms = [];
var goal = null;

//db.account.insert({username:"bbb", password:"123", gold:"0", level:"1", exp:"0", wins:"0", losses:"0"});

app.get('/', function(req, res)
{
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
serv.listen(process.env.PORT || 2000);

console.log("Server Started");

var SOCKET_LIST = {};
var DEBUG = true;


var isValidPassword = function(data, cb)
{
	db.account.find({username:data.username, password:data.password}, function(err, res)
		{
			if (res.length > 0)
			{
				cb(true);
			}
			else{
				cb(false);
			}

		});

}
var isUsernameTaken = function(data, cb)
{
	if (data.username != "team")
	{
		db.account.find({username:data.username}, function(err, res)
		{
			if (res.length > 0)
			{
				cb(true);
			}
			else{
				cb(false);
			}

		});
	}
	else
	{
		cb(true);
	}

}
var addUser = function(data, cb)
{
	db.account.insert({username:data.username, password:data.password, email:data.email, gold:0, level:1, exp:0, expMax:100, wins:0, losses:0, oneWins:0, oneLoss:0, twoWins:0, twoLoss:0, threeWins:0, threeLoss:0}, function(err)
		{
			cb();

		});
}

//var PLAYER_LIST = {};
var playersInGoal1 = [];
var playersInGoal2 = [];

var Goal = function(param)
{
	var self = {};
	self.team1 = param.one;
	self.team2 = param.two;
	self.amountMax = 1000;

	self.increaseAmount = function(team, amt)
	{

		if (team == 1)
		{
			if (self.team1 < self.amountMax)
			{
				self.team1 += amt;
				//console.log(team + "; " + self.team1 + "; +" + amt)
				if (self.team1 >= self.amountMax)
				{
					self.team1 = self.amountMax;
					gameOver("red");
					//console.log("team 1 wins")
					//WIN THE GAME
				}
			}
		}
		else
		{
			if (self.team2 < self.amountMax)
			{
				self.team2 += amt;
				//console.log(team + "; " + self.team2 + "; +" + amt)
				if (self.team2 >= self.amountMax)
				{
					self.team2 = self.amountMax;
					gameOver("blue");
					//WIN THE GAME
				}
			}
		}
		self.updateBars();

	}
	self.decreaseAmount = function(team, amt)
	{
		if (team == 1)
		{
			if (self.team1 > 0)
			{
				self.team1 -= amt;
				if (self.team1 < 0)
				{
					self.team1 = 0
				}
			}
		}
		else
		{
			if (self.team2 > 0)
			{
				self.team2 -= amt;
				if (self.team2 < 0)
				{
					self.team2 = 0;

				}
			}
		}
		self.updateBars();
	}
	self.updateBars = function()
	{
		//var team1Ratio = (self.team1 / self.amountMax);
		//var team2Ratio = (self.team2 / self.amountMax);
		//var team1Num = playersInGoal1.length;
		//var team2Num = playersInGoal2.length;
		//console.log(self.team2N);
		for (var i in SOCKET_LIST)
		{
			SOCKET_LIST[i].emit("updateScoreBar", {team1:self.team1, team2:self.team2});
		}

	}
	return self;
}

function checkAccountLevelIncrease(id)
{
	db.collection("account").find({username:usersLoggedIn[id]}).toArray(function(err, result) {
		if (err)
		{
			throw err;
			return false;
		}
		else
		{
			var exp = result[0].exp;
			var expMax = result[0].expMax;
			if (exp >= expMax)
			{
				var diff = exp - expMax;
				db.account.update({ username: usersLoggedIn[id]}, { $inc: { 'level': 1}});
				db.account.update({ username: usersLoggedIn[id]}, { $inc: { 'expMax': 50}});
				db.account.update({ username: usersLoggedIn[id]}, { $set: { 'exp': diff}});
			}
			console.log(result[0].exp);
			backToLobby(id);
		}
	});

}


function gameOver(team)
{

	for (var x in Player.list)
	{


		if (Player.list[x].team == team)
		{
			if (Player.list[x].matchType != 1)
			{
				db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'wins': 1}});
				var expVal = Math.round(genRandomNumber(55, 60));
				db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'exp': expVal}});
			}





			//console.log(Player.list[x].matchType);
			switch(Player.list[x].matchType)
			{
				case 2:
					db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'oneWins': 1}});
				break;
				case 4:
					db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'twoWins': 1}});
				break;
				case 6:
					db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'threeWins': 1}});
				break;
			}
			//console.log(usersLoggedIn[x] + " Wins");

		}
		else
		{
			//console.log(usersLoggedIn[x] + " Losses");
			if (Player.list[x].matchType != 1)
			{
				db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'losses': 1} });
				var expVal = Math.round(genRandomNumber(25, 30));

				db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'exp': expVal}});
			}


			switch(Player.list[x].matchType)
			{
				case 2:
					db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'oneLoss': 1}});
				break;
				case 4:
					db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'twoLoss': 1}});
				break;
				case 6:
					db.account.update({ username: usersLoggedIn[x]}, { $inc: { 'threeLoss': 1}});
				break;
			}

		}
		Player.onDisconnect(SOCKET_LIST[x]);
		checkAccountLevelIncrease(x);




	}

}

function backToLobby(id)
{
	 db.collection("account").find({username:usersLoggedIn[id]}).toArray(function(err, result) {
		if (err)
		{
			throw err;
		}
		else
		{
			var wins = result[0].wins;
			var losses = result[0].losses;
			var oneWins = result[0].oneWins;
			var oneLoss = result[0].oneLoss;
			var twoWins = result[0].twoWins;
			var twoLoss = result[0].twoLoss;
			var threeWins = result[0].threeWins;
			var threeLoss = result[0].threeLoss;

			var exp = result[0].exp;
			var expMax = result[0].expMax;
			var level = result[0].level;
			//console.log(wins + "/" + oneWins);
			SOCKET_LIST[id].emit('backToLobby', {wins:wins, losses:losses, oneWins:oneWins, oneLoss:oneLoss, twoWins:twoWins, twoLoss:twoLoss, threeWins:threeWins, threeLoss:threeLoss, exp:exp, expMax:expMax, level:level});
		}
	});


}







var Entity = function(param)
{
	var self =
	{
		x:Math.random * 900 + 100,
		y:Math.random * 900 + 100,
		spdX:0,
		spdY:0,
		id:"",
		map:'map1'
	}
	if (param)
	{
		if (param.x) self.x = param.x;
		if (param.y) self.y = param.y;
		if (param.map) self.map = param.map;
		if (param.id) self.id = param.id;
		if (param.index != undefined)
		{
			//console.log(param.index)
			self.x = getStartingPlatform(param.index, self.map).x * TILESIZE + (TILESIZE * 2);
			self.y = getStartingPlatform(param.index, self.map).y * TILESIZE + (TILESIZE * 2);

		}
	}
	self.update = function()
	{
		self.updatePosition();
	}
	self.updatePosition = function()
	{

		self.x += self.spdX;
		self.y += self.spdY;


	}
	self.getDistance = function(pt)
	{
		return Math.sqrt(Math.pow(self.x-pt.x, 2) + Math.pow(self.y-pt.y, 2));
	}
	return self;
}

var Dummy = function(x, y)
{
	var self = {};
	self.id = Math.round(genRandomNumber(0, 999));
	self.x = x;
	self.y = y;
	self.hpMax = 1000;
	self.hp = self.hpMax;

	Dummy.list[self.id] = self;
	return self;
}
Dummy.list = {};




var Player = function(param)
{
	var self = Entity(param);
	self.user = null;
	self.pressingRight = false;
	self.pressingDown = false;
	self.pressingLeft = false;
	self.pressingUp = false;
	self.isShooting = false;
	self.mouseAngle = 0;
	self.maxSpd = 10;
	self.cooldown = 0;
	self.hpMax = 1000;
	self.hp = self.hpMax;
	self.kills = 0;
	self.deaths = 0;
	self.gold = 200;
	self.latency = 0;
	self.shield = 100;
	self.isShielding = false;
	self.shieldMid = null;
	self.shieldLeft = null;
	self.shieldRight = null;
	self.shieldRHalf = null;
	self.shieldLHalf = null;
	self.updatedX = 0;
	self.updatedY = 0;
	self.level = 1;
	self.expMax = 100;
	self.exp = 0;
	self.team = param.team;
	self.isGoal = false;
	self.deathCounter = 1;
	self.canMove = true;
	self.surrender = false;
	self.matchType = param.matchType;
	self.elementType = null;
	self.sprite = '/client/img/Player/player.png';
	self.spriteShield = '/client/img/PlayerShield/playerShield.png';
	self.stats = {
		attack:5,
		elementalDamage:1,
		lethality:0,
		armor:0,
		attackSpd:5,
		crit:0,
		critDam:0,
		lifeSteal:0,
		lifeRegen:0
	}

	self.killCounter = 0;
	self.roomId = param.roomId;
	var super_update = self.update;
	self.update = function()
	{
		self.updateSpd();
		if (self.elementType == null)
		{
			if(!isPositionWall(self.x + self.spdX, self.y + self.spdY, true) && !isPositionWall(self.x + self.spdX, self.y + self.spdY, false))
			{
				super_update();
			}

		}
		else if(!isPositionWall(self.x + self.spdX, self.y + self.spdY, false))
		{
			super_update();
		}
		//console.log(getDis(self.updatedX, (self.getGoal().x + 4) * TILESIZE, self.updatedY, (self.getGoal().y + 4) * TILESIZE));
		//console.log(getDis(self.x, (self.getGoal().x * TILESIZE) + 128, self.y, (self.getGoal().y * TILESIZE) + 128));
		var goalX1 = (self.getGoal().x * TILESIZE);
		var goalY1 = (self.getGoal().y * TILESIZE);
		var goalX2 = goalX1 + 256;
		var goalY2 = goalY1 + 256;

		if((self.x >= goalX1 && self.x <= goalX2) && (self.y >= goalY1 && self.y <= goalY2))
		{
			self.isGoal = true;
		}
		else
		{
			self.isGoal = false;
		}

		if (self.isShooting && self.cooldown == 0 && self.canMove && self.isShielding == false)
		{
			self.shootBullet(self.mouseAngle);
			self.cooldown = self.stats.attackSpd;
		}

	}
	self.getGoal = function()
	{
		for (var x = 0; x < MapGrid1.length; x++)
		{
			for (var y = 0; y < MapGrid1[x].length; y++)
			{
				if (MapGrid1[x][y] == 100)
				{
					//console.log(x + "; " + y);
					return {x, y};
				}

			}
		}
	}
	self.shootBullet = function(angle)
	{

		Bullet({
			parent:self.id,
			angle: angle,
			x:self.x,
			y:self.y,
			map:self.map,
			roomId:self.roomId

		});
		//b.x = self.x;
		//b.y = self.y;


	}
	self.updateSpd = function()
	{
		if (self.canMove)
		{
			if (self.pressingRight)
			{
				self.spdX = self.maxSpd;
			}
			else if (self.pressingLeft)
			{
				self.spdX = -self.maxSpd;
			}
			else{
				self.spdX = 0;
			}

			if (self.pressingUp)
			{
				self.spdY = -self.maxSpd;
			}
			else if (self.pressingDown)
			{
				self.spdY = self.maxSpd;
			}
			else{
				self.spdY = 0;
			}

		}

	}
	Player.list[self.id] = self;

	self.getInitPack = function()
	{
		console.log(getStartingPlatform(1));
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			user:self.user,
			hp:self.hp,
			hpMax:self.hpMax,
			kills:self.kills,
			isShielding:self.isShielding,
			mouseAngle:self.mouseAngle,
			shield:self.shield,
			stats:self.stats,
			map:self.map,
			roomId:self.roomId,
			deaths:self.deaths,
			gold:self.gold,
			expMax:self.expMax,
			team:self.team,
			maxSpd:self.maxSpd,
			sprite:self.sprite,
			spriteShield:self.spriteShield,
			elementType:self.elementType

		}
	}
	self.getUpdatePack = function()
	{
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			user:self.user,
			hp:self.hp,
			hpMax:self.hpMax,
			kills:self.kills,
			deaths:self.deaths,
			isShielding:self.isShielding,
			mouseAngle:self.mouseAngle,
			shield:self.shield,
			stats:self.stats,
			updatedX:self.updatedX,
			updatedY:self.updatedY,
			gold:self.gold,
			exp:self.exp,
			expMax:self.expMax,
			level:self.level,
			isGoal:self.isGoal,
			canMove:self.canMove,
			elementType:self.elementType,
			maxSpd:self.maxSpd,
			sprite:self.sprite,
			spriteShield:self.spriteShield,
			killCounter:self.killCounter,
			matchType:self.matchType

		}
	}



	initPack.player.push(self.getInitPack());
	return self;
}

Player.list = {};





Player.onConnect = function(socket, roomId, index, team, map, matchType)
{
	//console.log("New Player: socket: " + socket + "; roomId: " + roomId + "; index: " + index + "; team: " + team);
	//MatchMaking



	var player = Player({
		id:socket.id,
		roomId:roomId,
		index:index,
		team:team,
		map:map,
		matchType:matchType
	});

	//socket.emit("createInventory");
	socket.on('keyPress', function(data)
	{
		if (data.inputId === 'left')
		{
			player.pressingLeft = data.state;
		}
		else if (data.inputId === 'right')
		{
			player.pressingRight = data.state;
		}
		else if (data.inputId === 'up')
		{
			player.pressingUp = data.state;
		}
		else if (data.inputId === 'down')
		{
			player.pressingDown = data.state;
		}
		else if (data.inputId === 'attack')
		{

			if (player.cooldown <= 0 && data.state == true && player.isShielding == false)
			{
				player.isShooting = data.state;
			}
			else if (data.state == false){
				player.isShooting = data.state;
			}
		}
		else if (data.inputId === 'mouseAngle')
		{
			//console.log("x:" + player.updatedX + "; y: " + player.updatedY);

			var xx = data.xx - WIDTH/2;
			var yy = data.yy - HEIGHT/2;
			var angle = Math.atan2(yy, xx);
			angle = angle * (180/Math.PI);

			if (angle < 0) angle = 360 - (-angle);
			//console.log(angle);
			player.mouseAngle = angle;
			//console.log(angle);
			//socket.emit("getPlayerAngle", {mouseAngle:angle});
		}
		else if (data.inputId === 'shield')
		{
			//console.log("Shield: " + data.state);
			player.isShielding = data.state;
		}

	});


	socket.on('sendMsgToServer', function(data)
	{
		//console.log(playerName);
		for (var i in SOCKET_LIST)
		{
			if (Player.list[i].roomId == player.roomId)
			{
				SOCKET_LIST[i].emit('addToChat',
				{
					name: player.user + ': ',
					txt: data
				});
			}

		}
	});

	socket.on('sendPMToServer', function(data) //data: {username, message}
	{
		//console.log(playerName);
		//console.log(data.user + "; " + data.message);
		var recipientSocket = null;
		for (var i in Player.list)
		{
			if (Player.list[i].user === data.user)
			{
				recipientSocket = SOCKET_LIST[i];
			}
		}
		if (recipientSocket === null)
		{
			if (data.user == "team")
			{
				socket.emit("addToChat", {name:"To Team: ", txt:data.message});
				for (var i in Player.list)
				{
					if (Player.list[i].team == player.team && Player.list[i].roomId == player.roomId)
					{
						if (Player.list[i].user != player.user)
						{
							SOCKET_LIST[i].emit("addToChat", {name: player.user + ': ', txt: data.message});
						}

					}
				}
			}
			else
			{
				socket.emit("addToChat", {name: "", txt:"The player " + data.user + " is not online!"});
			}

		}
		else
		{
			recipientSocket.emit("addToChat",{name: "From " + player.user + ': ', txt: data.message});
			socket.emit("addToChat", {name: "To " + data.user + ': ', txt: data.message});
		}

	});




	socket.emit('init', {
		selfId:socket.id,
		player:Player.getAllInitPack(),
		bullet:Bullet.getAllInitPack()
	});

}
Player.getAllInitPack = function()
{
	var players = [];
	for (var i in Player.list)
	{
		players.push(Player.list[i].getInitPack());
	}
	return players;
}
Player.update = function()
{
	var pack = [];

	for (var i in Player.list)
	{
		var player = Player.list[i];
		player.update();
		pack.push(player.getUpdatePack());
	}
	return pack;
}
var Bullet = function(param)
{
	var self = Entity(param);
	self.id = Math.random();
	self.spdX = Math.cos(param.angle/180*Math.PI) * 20;
	self.spdY = Math.sin(param.angle/180*Math.PI) * 20;
	self.parent = param.parent;
	self.roomId = param.roomId;
	self.timer = 0;
	self.toRemove = false;
	self.angle = param.angle;
	var super_update = self.update;

	self.update = function()
	{
		if (self.timer++ > 100)
			{
				self.toRemove = true;
		}

		super_update();

		if (isPositionWall(self.x, self.y, false))
				self.toRemove = true;

		for (var i in Player.list)
		{
			var p = Player.list[i];
			if (p == undefined || Player.list[self.parent] == undefined)
				return;
			//console.log("update");

			if (p.matchType == 1)
			{

			}
			if (self.roomId == p.roomId && p.team != Player.list[self.parent].team && self.getDistance(p) < 32 && self.parent !== p.id)
			{
				if (p.isShielding == true)
				{
					//var newAngle = angle + genRandomNumber(-90, 90)
					//if (newAngle > 360) newAngle = 360;
					//if (newAngle < 0) newAngle = 0;

					if (self.angle < 135 && self.angle > 45) //Top
					{
						var newAngle = 180 - self.angle;
					}
					else if (self.angle > 225 && self.angle < 315) //Bottom
					{
						var newAngle = 180 - self.angle;
					}
					else if (self.angle > 135 && self.angle < 225) //Left
					{
						var newAngle = 360 - self.angle;
					}
					else if (self.angle < 45 || self.angle > 315) //Right
					{
						var newAngle = 360 - self.angle;
					}
					else
					{
						console.log("NA");
					}
					//var newAngle = angle;
					self.spdX = -Math.cos(newAngle/180 * Math.PI) * 20;
					self.spdY = -Math.sin(newAngle/180 * Math.PI) * 20;
					//self.spdX = -self.spdX;
					//self.spdY = -self.spdY;
					//console.log(self.angle + "; " + newAngle);

				}
				else
				{
					var par = Player.list[self.parent];
					var type = "damage";
					if (!par)
						return;
					if (p.stats.armor > 0)
					{
						var newArmor = p.stats.armor - par.stats.lethality;
						if (newArmor <= 0) newArmor = 0;
						var damage = par.stats.attack * par.stats.attack / (par.stats.attack + newArmor);
					}
					else
					{
						var damage = par.stats.attack * par.stats.attack / (par.stats.attack + p.stats.armor);
					}
					if (p.elementType !== null && par.elementType !== null)
					{
						if (par.elementType == Element.list[p.elementType].weakness)
						{
							damage = damage + par.stats.elementalDamage;
						}
					}


					SOCKET_LIST[i].emit("updateArmor", {value: (damage / par.stats.attack)});
					SOCKET_LIST[self.parent].emit("updateLethality", {value: (p.stats.armor)});
					if (par.stats.crit > 0)
					{
						var chance = genRandomNumber(1, 100);
						if (chance < par.stats.crit)
						{
							var isDamageCrit = true;
							damage = (damage * 200) / 100;
							var extraDam = damage * (par.stats.critDam / 100);
							damage += extraDam;
							type = "crit";
							var critDam = ((par.stats.attack * 150) / 100) + extraDam;
							SOCKET_LIST[i].emit("updateArmor", {value: damage / critDam});
						}
						else
						{
							var isDamageCrit = false;
						}

					}

					if (p.canMove == true)
						p.hp-=damage;
					if (par.stats.lifeSteal > 0)
					{
						var amtHeal = damage * (par.stats.lifeSteal / 100);
						if (par.hp + amtHeal >= par.hpMax)
						{
							par.hp = par.hpMax;
						}
						else
						{
							par.hp += amtHeal;
						}
						SOCKET_LIST[self.parent].emit("updateHealthbar", {amount: amtHeal, type:"heal"});
						for (var ii in SOCKET_LIST)
						{
							SOCKET_LIST[ii].emit("showCombat", {amount:amtHeal, type:"heal", playerHit:par});
						}
					}
					SOCKET_LIST[i].emit("updateHealthbar", {amount: damage, type:"damage"});
					for (var ii in SOCKET_LIST)
					{
						SOCKET_LIST[ii].emit("showCombat", {amount:damage, type:type, playerHit:p});
					}

					if (p.hp <= 0)
					{
					var shooter = Player.list[self.parent];
					if (shooter)
					{
						var damageDealt = damage;
						shooter.kills++;
						shooter.killCounter++;
						setTimeout(function()
						{
							shooter.killCounter = 0;
						}, 15000);
						if (shooter.killCounter == 1)
						{
							//console.log(p.user);
							for (var iii in SOCKET_LIST)
							{
								SOCKET_LIST[iii].emit("killAnnounce", {playerId:self.parent, victim:p.user, type:"single"});
							}
						}
						else if (shooter.killCounter == 2)
						{
							for (var iii in SOCKET_LIST)
							{
								SOCKET_LIST[iii].emit("killAnnounce", {playerId:self.parent, type:"double"});
							}
						}
						else if (shooter.killCounter == 3)
						{
							for (var iii in SOCKET_LIST)
							{
								SOCKET_LIST[iii].emit("killAnnounce", {playerId:self.parent, type:"triple"});
							}
						}
						shooter.gold+=75;
						shooter.exp += 50;
						p.exp += 25;
						if (shooter.exp >= shooter.expMax)
						{

							levelUpdate(shooter);
						}
						if (p.exp >= p.expMax)
						{
							levelUpdate(p);
						}
						respawn(i);
						SOCKET_LIST[i].emit("deathCounter", {value: p.deathCounter, damageDealt: damageDealt, crit:isDamageCrit, killer:shooter.user});
							/*setTimeout(function()
							{
								p.canMove = true;
								p.deathCounter *= 2;
							}, (p.deathCounter * 1000));*/
							//SOCKET_LIST[i].emit("deathCounter", {value: p.deathCounter, counting:p.canMove});
					}
				}
				self.toRemove = true;
				}

			}




		}
	}
	Bullet.list[self.id] = self;

	self.getInitPack = function()
	{
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			map:self.map,
			roomId:self.roomId
		}
	}
	self.getUpdatePack = function()
	{
		return {
			id:self.id,
			x:self.x,
			y:self.y
		}
	}

	initPack.bullet.push(self.getInitPack());


	return self;
}
Bullet.list = {};


function respawn(i)
{
	var p = Player.list[i];
	if (p == undefined)
		return;

	p.deaths++;
	p.hp = p.hpMax;
	SOCKET_LIST[i].emit("updateHealthbar", {amount: p.hpMax, type:"heal"});
	//self.toRemove = true;
	p.canMove = false;
	var r = Math.random() * 1;
	switch(p.team)
	{
		case "red":
		if (p.map == "map1")
			{

				p.x = 128;
				p.y = 128;


			}
			else if (p.map == "map2")
			{
				if (r < 0.5)
				{
					p.x = 128;
					p.y = 256;
				}
				else if (r >= 0.5)
				{
					p.x = 256;
					p.y = 128;
				}

			}
			else
			{
				if (r < 0.5)
				{
					p.x = 128;
					p.y = 128;
				}
				else if (r > 0.75)
				{
					p.x = 256;
					p.y = 128;
				}
				else
				{
					p.x = 128;
					p.y = 256;
				}
			}
		break;
		case "blue":
			if (p.map == "map1")
			{
				p.x = 3072;
				p.y = 3072;

			}
			else if (p.map == "map2")
			{
				if (r < 0.5)
				{
					p.x = 3072;
					p.y = 2944;
				}
				else if (r >= 0.5)
				{
					p.x = 2944;
					p.y = 3072;
				}

			}
			else
			{
				if (r < 0.5)
				{
					p.x = 3072;
					p.y = 3072;
				}
				else if (r > 0.75)
				{
					p.x = 2944;
					p.y = 3072;
				}
				else
				{
					p.x = 3072;
					p.y = 2944;
				}
			}

		break;
	}



}



function genRandomNumber(min, max)
{
	return Math.random() * (max - min) + min;
}

function getDis(x1, y1, x2, y2)
{
	let xDistance = x2 - x1;
	let yDisance = y2 - y1;
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDisance, 2));
}

function isPositionWall(xx, yy, early)
{
	var gridX = Math.floor(xx / TILESIZE);
	var gridY = Math.floor(yy / TILESIZE);

	if (MapGrid1[gridY][gridX] == undefined || MapGrid1 == undefined)
		return;
	/*if (gridX < 0 || gridX >= MapGrid[0].length)
		return true;
	if (gridY < 0 || gridY >= MapGrid.length)
		return MapGrid[gridY][gridX];*/
	if(early)
	{

		if (MapGrid1[gridY][gridX] == 125)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		if (MapGrid1[gridY][gridX] == 77)
		{
			return true;
		}
		else
		{
			return false;
		}
	}




}
function checkInvasion(id)
{
	var p = Player.list[id];
	if (p == undefined)
		return;
	var otherTeam = null;
	switch(p.team)
	{
		case "red":
			otherTeam = "blue";
		break;
		case "blue":
			otherTeam = "red";
		break;
	}
	if (otherTeam != null)
	{
		var x = getStore(otherTeam).x * TILESIZE;
		var y = getStore(otherTeam).y * TILESIZE;
		//console.log(getDis(x, y, p.x, p.y));

		if (getDis(x, y, p.x, p.y) <= 416)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

}


function checkStoreRange(id)
{

	var p = Player.list[id];
	if (p == undefined)
		return;
	var x = getStore(p.team).x * TILESIZE;
	var y = getStore(p.team).y * TILESIZE;
	//console.log(getDis(x, y, p.x, p.y));

	if (getDis(x, y, p.x, p.y) <= 416)
	{
			return true;
	}
	else
	{
		return false;
	}

}
function getStore(team)
{
	switch(team)
	{
	case "red":
		var val = 1;
	break;
	case "blue":
		var val = 2;
	break;
	}
	for (var x = 0; x < MapGrid1.length; x++)
	{
		for (var y = 0; y < MapGrid1[x].length; y++)
		{
			//console.log(val);
			if (MapGrid1[x][y] == val)
			{
				return {x, y};
			}

		}
	}
	return false;

}




function getStartingPlatform(num, map)
{

	var platform = 50 + num;
	switch(map)
	{
		case "map1":
			for (var x = 0; x < MapGrid1.length; x++)
			{
				for (var y = 0; y < MapGrid1[x].length; y++)
				{
					if (MapGrid1[x][y] == platform)
					{
						return {x, y};
					}
				}
			}
		break;
		case "map2":
				for (var x = 0; x < MapGrid2.length; x++)
			{
				for (var y = 0; y < MapGrid2[x].length; y++)
				{
					if (MapGrid2[x][y] == platform)
					{
						return {x, y};
					}
				}
			}
		break;
		case "map3":
				for (var x = 0; x < MapGrid3.length; x++)
			{
				for (var y = 0; y < MapGrid3[x].length; y++)
				{
					if (MapGrid3[x][y] == platform)
					{
						return {x, y};
					}
				}
			}
		break;
	}
	//var grid = Math.floor(platform / TILESIZE);

	return false;
}

Bullet.getAllInitPack = function()
{
	var bullets = [];
	for (var i in Bullet.list)
	{
		bullets.push(Bullet.list[i].getInitPack());
	}
	return bullets;
}
Bullet.update = function()
{
	var pack = [];

	for (var i in Bullet.list)
	{
		var bullet = Bullet.list[i];
		bullet.update();
		if (bullet.toRemove)
		{
			delete Bullet.list[i];
			removePack.bullet.push(bullet.id);
		}
		else{
			pack.push(bullet.getUpdatePack());
		}

	}
	return pack;
}


setInterval(function()
{
	if (goal == null)
		return;
	for (var i in Player.list)
	{
		var p = Player.list[i];
		if(p == undefined)
			return;
		if (checkStoreRange(i))
		{
			if (p.hp + 100 <= p.hpMax)
			{
				p.hp += 100;
				SOCKET_LIST[i].emit("updateHealthbar", {amount: 100, type:"heal"});

			}
			else {
				p.hp = p.hpMax;
				var diff = p.hpMax - p.hp;
				SOCKET_LIST[i].emit("updateHealthbar", {amount: diff, type:"heal"});

			}
		}
		if (checkInvasion(i))
		{
			p.hp -= 700;
			SOCKET_LIST[i].emit("updateHealthbar", {amount: 700, type: "damage"});
			if (p.hp <= 0)
			{
				respawn(i);
			}

		}
		p.exp += 1;
		if (p.exp >= p.expMax)
		{
			levelUpdate(p);
		}

		if (p.isGoal && p.team == "red")
		{
			//console.log("Length of 2: " + playersInGoal2.length);
			if (playersInGoal2.length == 0)
			{
				goal.increaseAmount(1, 10);
			}
			if(playersInGoal1.indexOf(p) < 0)
				playersInGoal1.push(p);
			//goal.team1N++;
		}
		else if(p.isGoal == false && p.team == "red" && playersInGoal1.includes(p) == true)
		{
			playersInGoal1.splice(playersInGoal1.indexOf(p), 1);
			//goal.team1N--;
		}


		if (p.isGoal && p.team == "blue")
		{
			//console.log("Length of 1: " + playersInGoal1.length);
			if (playersInGoal1.length == 0)
			{
				goal.increaseAmount(2, 10);
			}
			if (playersInGoal2.indexOf(p) < 0)
				playersInGoal2.push(p);
			//goal.team2N++;

		}
		else if(p.isGoal == false && p.team == "blue" && playersInGoal2.includes(p) == true)
		{
			//console.log(playersInGoal2.indexOf(p));
			playersInGoal2.splice(playersInGoal2.indexOf(p), 1);
			//goal.team2N--;
		}

	}

	/*if(playersInGoal1.length == 0 && goal.team1 > 0)
	{
		goal.decreaseAmount(1, 5);

	}
	if(playersInGoal2.length == 0 && goal.team2 > 0)
	{
		goal.decreaseAmount(2, 5);

	}*/

}, 1500);

function levelUpdate(player)
{
	player.gold += 100;
	player.expMax += 50;
	player.exp = 0;
	player.level++;
	player.stats.attack += 5;

	if (isOdd(player.level) && player.level < 11)
	{
		player.stats.armor += 2;
		player.hpMax += 100;
	}
	else if (isEven(player.level) && player.level < 11)
	{
		player.stats.elementalDamage++;
	}
	//player.stats.attackSpd -= 0.1;
	//player.stats.crit += 1;

}
function isEven(n) {
  n = Number(n);
  return n === 0 || !!(n && !(n%2));
}
function isOdd(n) {
  return !isEven(n);
}


Player.onDisconnect = function(socket)
{
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
	socket.emit("removeSelfId");
}
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket)
{

	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	//Player.onConnect(socket);
	//console.log('socket connection');

	socket.on('signIn', function(data)
	{

		isValidPassword(data, function(res)
		{
			if(res)
			{
				usersLoggedIn[socket.id] = data.username;
				//console.log(data.username);
				 db.collection("account").find({username:data.username}).toArray(function(err, result) {
					if (err)
					{
						throw err;
					}
					else
					{
						var wins = result[0].wins;
						var losses = result[0].losses;
						var oneWins = result[0].oneWins;
						var oneLoss = result[0].oneLoss;
						var twoWins = result[0].twoWins;
						var twoLoss = result[0].twoLoss;
						var threeWins = result[0].threeWins;
						var threeLoss = result[0].threeLoss;

						var exp = result[0].exp;
						var expMax = result[0].expMax;
						var level = result[0].level;
						//console.log(expMax);
						socket.emit('signInResponse', {success: true, username: data.username, wins:wins, losses:losses, oneWins:oneWins, oneLoss:oneLoss, twoWins:twoWins, twoLoss:twoLoss, threeWins:threeWins, threeLoss:threeLoss, exp:exp, expMax:expMax, level:level});
					}


				});


			}
			else{
				socket.emit('signInResponse', {success: false});
			}
		});

	});
	socket.on('register', function(data)
	{
		isUsernameTaken(data, function(res)
		{
			if (res)
			{
				socket.emit('registerResponse', {success: false});
			}
			else{
				if (data.password == data.rPassword)
				{
					if (data.password != "" && data.rPassword != "" && data.username != "")
					{
						addUser(data, function()
						{
							socket.emit('registerResponse', {success:true});
						});
					}

				}
				else
				{
					socket.emit('registerResponse', {success: false});
				}

			}
		});

	});

	socket.on('matchMake', function(data)
	{
		//console.log(usersLoggedIn[socket.id]);
		switch(data.matchType)
		{
			case "one": //1v1
				console.log("one");
				if (usersWaitingOne.includes(usersLoggedIn[socket.id]) == false && usersWaitingTwo.includes(usersLoggedIn[socket.id]) == false && usersWaitingThree.includes(usersLoggedIn[socket.id]) == false)
				{
					socket.emit("cancelButton", {value:true});
					matchMakingOne(socket.id, usersLoggedIn[socket.id], 2);

				}
			break;
			case "two": //2v2
				if (usersWaitingOne.includes(usersLoggedIn[socket.id]) == false && usersWaitingTwo.includes(usersLoggedIn[socket.id]) == false && usersWaitingThree.includes(usersLoggedIn[socket.id]) == false)
				{
					socket.emit("cancelButton", {value:true});
					matchMakingTwo(socket.id, usersLoggedIn[socket.id], 4);
				}
			break;
			case "three": //3v3
				if (usersWaitingOne.includes(usersLoggedIn[socket.id]) == false && usersWaitingTwo.includes(usersLoggedIn[socket.id]) == false && usersWaitingThree.includes(usersLoggedIn[socket.id]) == false)
				{
					socket.emit("cancelButton", {value:true});
					matchMakingThree(socket.id, usersLoggedIn[socket.id], 6);
				}
			break;
			case "training":
				if (usersWaitingOne.includes(usersLoggedIn[socket.id]) == false && usersWaitingTwo.includes(usersLoggedIn[socket.id]) == false && usersWaitingThree.includes(usersLoggedIn[socket.id]) == false)
				{
					socket.emit("cancelButton", {value:true});
					matchMakingTraining(socket.id, usersLoggedIn[socket.id], 1);
				 }
			break;
		}

	});
	socket.on("cancelSearch", function(data)
	{
		//console.log(data.matchType);
		if (usersWaitingOne.includes(usersLoggedIn[socket.id]))
		{
			console.log("Removed From List One");
			var i = usersWaitingOne.indexOf(usersLoggedIn[socket.id]);
			usersWaitingOne.splice(i, 1);
			playersWaitingOne.splice(i, 1);
			socket.emit("cancelButton", {value:false});
		}
		else if (usersWaitingTwo.includes(usersLoggedIn[socket.id]))
		{
			console.log("Removed From List Two");
			var i = usersWaitingTwo.indexOf(usersLoggedIn[socket.id]);
			usersWaitingTwo.splice(i, 1);
			playersWaitingTwo.splice(i, 1);
			socket.emit("cancelButton", {value:false});
		}
		else if (usersWaitingThree.includes(usersLoggedIn[socket.id]))
		{
			console.log("Removed From List Three");
			var i = usersWaitingThree.indexOf(usersLoggedIn[socket.id]);
			usersWaitingThree.splice(i, 1);
			playersWaitingThree.splice(i, 1);
			socket.emit("cancelButton", {value:false});
		}

	});
	socket.on('disconnect', function()
	{
		if (Player.list[socket.id] != undefined)
		{
			db.account.update({ username: usersLoggedIn[socket.id]}, { $inc: { 'losses': 1} });
			switch(Player.list[socket.id].matchType)
			{
				case 2:
					db.account.update({ username: usersLoggedIn[socket.id]}, { $inc: { 'oneLoss': 1} });
				break;
				case 4:
					db.account.update({ username: usersLoggedIn[socket.id]}, { $inc: { 'twoLoss': 1} });
				break;
				case 6:
					db.account.update({ username: usersLoggedIn[socket.id]}, { $inc: { 'threeLoss': 1} });
				break;
			}
		}

		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);



		if (usersWaitingOne.includes(usersLoggedIn[socket.id]))
		{
			console.log("Removed From List One");
			var i = usersWaitingOne.indexOf(usersLoggedIn[socket.id]);
			usersWaitingOne.splice(i, 1);
			playersWaitingOne.splice(i, 1);
			socket.emit("cancelButton", {value:false});
		}
		else if (usersWaitingTwo.includes(usersLoggedIn[socket.id]))
		{
			console.log("Removed From List Two");
			var i = usersWaitingTwo.indexOf(usersLoggedIn[socket.id]);
			usersWaitingTwo.splice(i, 1);
			playersWaitingTwo.splice(i, 1);
			socket.emit("cancelButton", {value:false});
		}
		else if (usersWaitingThree.includes(usersLoggedIn[socket.id]))
		{
			console.log("Removed From List Three");
			var i = usersWaitingThree.indexOf(usersLoggedIn[socket.id]);
			usersWaitingThree.splice(i, 1);
			playersWaitingThree.splice(i, 1);
			socket.emit("cancelButton", {value:false});
		}


		console.log("socket disconnection");
	});

	socket.on('evalServer', function(data)
	{
		if (DEBUG)
		{
			var res = eval(data);
			socket.emit('evalAnswer', res);
		}

	});
	socket.on('calculateLatency', function()
	{
		socket.emit('displayLatency');

	});
	socket.on('updateShield', function(data)
	{
		//console.log(socket.id);
		if (Player.list[socket.id] !== undefined)
		{
		switch (data.state)
		{
			case true: //+
				if (Player.list[socket.id].shield < 100)
				{
					Player.list[socket.id].shield++;
				}

			break;
			case false: //-
				if (Player.list[socket.id].shield > 0)
				{
					Player.list[socket.id].shield--;
				}
			break;
		}
		}
	});
	socket.on("increaseHP", function(data)
	{
		//console.log(data.player)

		var p = Player.list[data.playerId];
		if (p == undefined)
			return;
		if (p.hp + data.amount > p.hpMax)
		{
			p.hp = p.hpMax;
		}
		else
		{
			p.hp += data.amount;
		}

		for (var ii in SOCKET_LIST)
		{
			SOCKET_LIST[ii].emit("showCombat", {amount:data.amount, type:"heal", playerHit:p});
		}
		SOCKET_LIST[socket.id].emit("updateHealthbar", {amount: data.amount, type:"heal"});

	});
	socket.on("updateMaxHp", function(data)
	{
		//console.log(data.player)

		var p = Player.list[data.playerId];
		if (data.type == "up")
		{
			var diff = p.hpMax - p.hp;
			console.log(diff);
			p.hpMax += data.amount;
			p.hp += diff;
			for (var ii in SOCKET_LIST)
			{
				SOCKET_LIST[ii].emit("showCombat", {amount:diff, type:"heal", playerHit:p});
			}
			SOCKET_LIST[socket.id].emit("updateHealthbar", {amount: diff, type:"heal"});


		}
		else
		{

			var diff = p.hpMax - p.hp;
			console.log(diff);
			p.hpMax -= data.amount;
			p.hp = p.hpMax - diff;

			for (var ii in SOCKET_LIST)
			{
				SOCKET_LIST[ii].emit("showCombat", {amount:data.amount, type:"damage", playerHit:p});
			}
			SOCKET_LIST[socket.id].emit("updateHealthbar", {amount: data.amount, type:"damage"});



		}

	});


	socket.on("updateGold", function(data)
	{
		//console.log(data.player)

		var p = Player.list[data.playerId];
		if (p == undefined)
			return;
		switch(data.type)
		{
			case "up":
				p.gold += data.amount;
			break;
			case "down":
				p.gold -= data.amount;
			break;

		}


	});
	socket.on("updateXY", function(data)
	{

		var p = Player.list[data.playerId];
		if (p)
		{

			p.updatedX = data.xx;
			p.updatedY = data.yy;
			//console.log("x: " + data.xx + "; y: " + data.yy);
		}

	});

	socket.on("updateStats", function(data)
	{
		var p = Player.list[data.playerId];
		if (data.type == "up")
		{
			switch(data.stat)
			{
			case "attack":
				p.stats.attack += data.amount;
			break;
			case "armor":
				p.stats.armor += data.amount;
			break;
			case "attackSpd":

				p.stats.attackSpd -= data.amount;
			break;
			case "crit":
				p.stats.crit += data.amount;
			break;
			case "critDam":
				p.stats.critDam += data.amount; //Percent
			break;
			case "lifeSteal":
				p.stats.lifeSteal += data.amount;
			break;
			case "lifeRegen":
				p.stats.lifeRegen += data.amount;
			break;
			case "lethality":
				p.stats.lethality += data.amount;
			break;
			case "movement":
				p.maxSpd += data.amount;
			break;
			}

		}
		else
		{
			switch(data.stat)
			{
			case "attack":
				p.stats.attack -= data.amount;
			break;
			case "armor":
				p.stats.armor -= data.amount;
			break;
			case "attackSpd":
				p.stats.attackSpd += data.amount;
			break;
			case "crit":
				p.stats.crit -= data.amount;
			break;

			}
		}

	});
	socket.on("surrender", function(data)
	{
		console.log("Surrender Started");
		Player.list[data.playerId].surrender = true;
		var count = 0;
		for (var i in  Player.list)
		{
			if (Player.list[i].team == Player.list[data.playerId].team)
			{
				if (Player.list[i].surrender == true)
				{
					count++;
				}
			}
		}
		switch(Player.list[data.playerId].matchType)
		{
			case 2: //1v1
				if (count == 1)
				{
					if (Player.list[data.playerId].team == "blue")
					{
						gameOver("red");
					}
					else
					{
						gameOver("blue");
					}

					//console.log (Player.list[data.playerId].team + " surrendered");
				}
			break;
			case 4: //2v2
				if (count == 2)
				{
					if (Player.list[data.playerId].team == "blue")
					{
						gameOver("red");
					}
					else
					{
						gameOver("blue");
					}
					//console.log (Player.list[data.playerId].team + " surrendered");
				}
			break;
			case 6: //3v3
				if (count == 3)
				{
					if (Player.list[data.playerId].team == "blue")
					{
						gameOver("red");
					}
					else
					{
						gameOver("blue");
					}
					console.log (Player.list[data.playerId].team + " surrendered");
				}
			break;
		}




	});
	socket.on("setElement", function(data)
	{
		for (var i in Player.list)
		{
			if (Player.list[i].team == Player.list[socket.id].team)
			{
				SOCKET_LIST[Player.list[i].id].emit("disableElement", {elementType: data.elementType});
			}
		}
		switch(data.elementType)
			{
				case "Fire":
					Player.list[socket.id].sprite = '/client/img/Player/playerFire.png';
					Player.list[socket.id].spriteShield = '/client/img/PlayerShield/playerFireShield.png';
				break;
				case "Water":
					Player.list[socket.id].sprite = '/client/img/Player/playerWater.png';
					Player.list[socket.id].spriteShield = '/client/img/PlayerShield/playerWaterShield.png';
				break;
				case "Earth":
					Player.list[socket.id].sprite = '/client/img/Player/playerEarth.png';
					Player.list[socket.id].spriteShield = '/client/img/PlayerShield/playerEarthShield.png';
				break;
				case "Wind":
					Player.list[socket.id].sprite = '/client/img/Player/playerWind.png';
					Player.list[socket.id].spriteShield = '/client/img/PlayerShield/playerWindShield.png';
				break;
				case "Lightning":
					Player.list[socket.id].sprite = '/client/img/Player/playerLightning.png';
					Player.list[socket.id].spriteShield = '/client/img/PlayerShield/playerLightningShield.png';
				break;

			}
		Player.list[data.playerId].elementType = data.elementType;
	});

	socket.on("setCanMove", function(data)
	{

		Player.list[data.playerId].canMove = data.value;
		if (data.count = true)
		{
			Player.list[data.playerId].deathCounter *= 2;
		}

	});
	socket.on("teleportToBase", function(data)
	{
		var p = Player.list[data.selfId];
		if (p == undefined)
			return;

		//console.log(p.map);
		//var n = genRandomNumber(0, 3);
		switch(p.map)
		{
			case "map1":
				if (p.team == "red")
				{
					var n = 0;
				}
				else
				{
					var n = 1;
				}
			break;
			case "map2":
				if (p.team == "red")
				{
					var n = genRandomNumber(0, 1);
				}
				else
				{
					var n = genRandomNumber(2, 3);
				}
			break;
			case "map3":
				if (p.team == "red")
				{
					var n = genRandomNumber(0, 2);
				}
				else
				{
					var n = genRandomNumber(3, 5);
				}
			break;

		}


		p.x = getStartingPlatform(n, p.map).x * TILESIZE + (TILESIZE * 2);
		p.y = getStartingPlatform(n, p.map).y * TILESIZE + (TILESIZE * 2);

	});

	socket.on("resize", function(data)
	{
		WIDTH = data.width;
		HEIGHT = data.height;
		//console.log("Server: " + WIDTH + ", " + height)


	});
	/*socket.on("shieldValues", function(data)
	{
		Player.list[socket.id].shieldMid = data.mid;
		Player.list[socket.id].shieldLeft = data.left;
		Player.list[socket.id].shieldRight = data.right;
		Player.list[socket.id].shieldRHalf = data.rHalf;
		Player.list[socket.id].shieldLHalf = data.lHalf;
		//console.log("setvalues")

	});*/


	socket.on("getPlayerList", function(data)
	{
		var currentPlayers = [];

		for (var p in Player.list)
		{
			//console.log("####" + p.roomId);
			if (Player.list[p].roomId == data.roomId)
			{
				currentPlayers.push(p);
			}
		}

		SOCKET_LIST[data.id].emit("displayPlayerList", {list:currentPlayers});


	});
});

/*function matchMaking(id, data)
{
	playersWaiting.push(id);
	usersWaiting.push(data.username);
	console.log("Added to List");
	//SOCKET_LIST[id].emit("matchingLabel");
	//socket.emit("matchingLabel");
	if (playersWaiting.length >= roomSize)
	{
		currentRoomID = genRandomNumber(0, 1000);
		while (currentRooms.includes(currentRoomID))
		{
			currentRoomID = genRandomNumber(0, 1000);
		}
		currentRooms.push(currentRoomID);
		console.log("Matching");
		for (var i = 0; i < roomSize; i++)
		{
			if (i < roomSize / 2)
			{
				var tm = "red";
			}
			else
			{
				var tm = "blue";
			}
			Player.onConnect(SOCKET_LIST[playersWaiting[i]], currentRoomID, usersWaiting.indexOf(usersWaiting[i]), tm);

			Player.list[playersWaiting[i]].user = usersWaiting[i];

			SOCKET_LIST[playersWaiting[i]].emit('signInResponse', {success: true});

			//playersWaiting.splice(i, 1);
		}
		playersWaiting = [];
		usersWaiting = [];
	}


	//Player.onConnect(socket);
	//Player.list[socket.id].user = data.username;
}
*/
function matchMakingOne(id, data, roomSize)
{
	playersWaitingOne.push(id);
	usersWaitingOne.push(data);
	console.log("id: " + id + "; user: " + data);
	console.log("Added to List One");
	//SOCKET_LIST[id].emit("matchingLabel");
	//socket.emit("matchingLabel");
	if (playersWaitingOne.length >= roomSize)
	{
		currentRoomID = genRandomNumber(0, 1000);
		while (currentRooms.includes(currentRoomID))
		{
			currentRoomID = genRandomNumber(0, 1000);
		}
		currentRooms.push(currentRoomID);
		console.log("Matching One");
		for (var i = 0; i < roomSize; i++)
		{
			if (i < roomSize / 2)
			{
				var tm = "red";
			}
			else
			{
				var tm = "blue";
			}
			goal = new Goal({one: 0, two: 0});
			goal.updateBars();
			Player.onConnect(SOCKET_LIST[playersWaitingOne[i]], currentRoomID, usersWaitingOne.indexOf(usersWaitingOne[i]), tm, 'map1', roomSize);

			Player.list[playersWaitingOne[i]].user = usersWaitingOne[i];

			SOCKET_LIST[playersWaitingOne[i]].emit('strategy');

			//playersWaiting.splice(i, 1);
		}
		playersWaitingOne = [];
		usersWaitingOne = [];
	}


	//Player.onConnect(socket);
	//Player.list[socket.id].user = data.username;
}



function matchMakingTwo(id, data, roomSize)
{
	playersWaitingTwo.push(id);
	usersWaitingTwo.push(data);
	console.log("id: " + id + "; user: " + data);
	console.log("Added to List Two");
	//SOCKET_LIST[id].emit("matchingLabel");
	//socket.emit("matchingLabel");
	if (playersWaitingTwo.length >= roomSize)
	{
		currentRoomID = genRandomNumber(0, 1000);
		while (currentRooms.includes(currentRoomID))
		{
			currentRoomID = genRandomNumber(0, 1000);
		}
		currentRooms.push(currentRoomID);
		console.log("Matching Two");
		for (var i = 0; i < roomSize; i++)
		{
			if (i < roomSize / 2)
			{
				var tm = "red";
			}
			else
			{
				var tm = "blue";
			}
			goal = new Goal({one: 0, two: 0});
			goal.updateBars();
			Player.onConnect(SOCKET_LIST[playersWaitingTwo[i]], currentRoomID, usersWaitingTwo.indexOf(usersWaitingTwo[i]), tm, 'map2', roomSize);

			Player.list[playersWaitingTwo[i]].user = usersWaitingTwo[i];

			SOCKET_LIST[playersWaitingTwo[i]].emit('strategy');

			//playersWaiting.splice(i, 1);
		}
		playersWaitingTwo = [];
		usersWaitingTwo = [];
	}


	//Player.onConnect(socket);
	//Player.list[socket.id].user = data.username;
}

function matchMakingThree(id, data, roomSize)
{
	playersWaitingThree.push(id);
	usersWaitingThree.push(data);
	console.log("id: " + id + "; user: " + data);
	console.log("Added to List Three");
	//SOCKET_LIST[id].emit("matchingLabel");
	//socket.emit("matchingLabel");
	if (playersWaitingThree.length >= roomSize)
	{
		currentRoomID = genRandomNumber(0, 1000);
		while (currentRooms.includes(currentRoomID))
		{
			currentRoomID = genRandomNumber(0, 1000);
		}
		currentRooms.push(currentRoomID);
		console.log("Matching Three");
		for (var i = 0; i < roomSize; i++)
		{
			if (i < roomSize / 2)
			{
				var tm = "red";
			}
			else
			{
				var tm = "blue";
			}
			goal = new Goal({one: 0, two: 0});
			goal.updateBars();
			Player.onConnect(SOCKET_LIST[playersWaitingThree[i]], currentRoomID, usersWaitingThree.indexOf(usersWaitingThree[i]), tm, 'map3', roomSize);

			Player.list[playersWaitingThree[i]].user = usersWaitingThree[i];

			SOCKET_LIST[playersWaitingThree[i]].emit('strategy');

			//playersWaiting.splice(i, 1);
		}
		playersWaitingThree = [];
		usersWaitingThree = [];
	}


	//Player.onConnect(socket);
	//Player.list[socket.id].user = data.username;
}

function matchMakingTraining(id, data)
{

		currentRoomID = genRandomNumber(0, 1000);
		while (currentRooms.includes(currentRoomID))
		{
			currentRoomID = genRandomNumber(0, 1000);
		}
		currentRooms.push(currentRoomID);

		var tm = "blue";
		goal = new Goal({one: 0, two: 0});
		goal.updateBars();
		Player.onConnect(SOCKET_LIST[id], currentRoomID, 1, tm, 'map1', 'training');

		Player.list[id].user = data;
		Player.list[id].matchType = "training";
		console.log(id);
		SOCKET_LIST[id].emit('strategy');

			//playersWaiting.splice(i, 1);


}



var initPack = {player:[], bullet:[]};
var removePack = {player:[], bullet:[]};

setInterval(function()
{


	for (var i in Player.list)
	{
		var p = Player.list[i];

		p.cooldown-= 0.5;
		if (p.cooldown < 0)
		{
			p.cooldown = 0;
		}
	}


	var pack =
	{
		player: Player.update(),
		bullet: Bullet.update()
	}

	for (var i in SOCKET_LIST)
	{
		var socket = SOCKET_LIST[i];
		//alert("test");
		//console.log("moved");
		socket.emit('init', initPack);
		//console.log(initPack.player[i]);
		socket.emit('update', pack);
		socket.emit('remove', removePack);
	}
	initPack.player = [];
	initPack.bullet = [];
	removePack.player = [];
	removePack.bullet = [];
}, 40);
