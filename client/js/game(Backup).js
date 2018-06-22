
	var WIDTH = 0;
	var HEIGHT = 0;


	var isGuide = false;
	var currentRoom = "signin";


	var socket = io();
	//var $ = require("jquery");
	var signDiv = document.getElementById("signDiv");
	var regDiv = document.getElementById("regDiv");
	var lobbyDiv = document.getElementById("lobbyDiv");
	var waitDiv = document.getElementById("waitDiv");
	//var matchLabel = document.getElementById("matchLabel");
	var goldLabel = document.getElementById("gold");
	var gameDiv = document.getElementById("gameDiv");
	//var playersDiv = document.getElementById("playersDiv");
	var attackL = document.getElementById("attackL");
	var armorL = document.getElementById("armorL");
	var attackSpdL = document.getElementById("attackSpdL");
	var critL = document.getElementById("critL");
	var lifeStealL = document.getElementById("lifeStealL");
	var attackTT = document.getElementById("attackTT");
	var armorTT = document.getElementById("armorTT");
	var attackSpdTT = document.getElementById("attackSpdTT");
	var critTT = document.getElementById("critTT");
	var lifeStealTT = document.getElementById("lifeStealTT");
	var lifeRegenTT = document.getElementById("lifeRegenTT");
	var lethalityTT = document.getElementById("lethalityTT");
	var healthDiv = document.getElementById("healthDiv");
	var healthL = document.getElementById("healthL");
	var killL = document.getElementById("killL");
	var deathL = document.getElementById("deathL");


	//SignDiv
	var signDivUsername = document.getElementById("signDiv-username");
	var signDivPassword = document.getElementById("signDiv-password");
	var signDivSignIn = document.getElementById("signDiv-signIn");
	var signDivRegister = document.getElementById("signDiv-register");

	//RegDIv
	var regDivUsername = document.getElementById("regDiv-username");
	var regDivPassword = document.getElementById("regDiv-password");
	var regDivEmail = document.getElementById("regDiv-email");
	var regDivPasswordRepeat = document.getElementById("regDiv-passwordRepeat");
	var regDivSignIn = document.getElementById("regDiv-signIn");
	var regDivRegister = document.getElementById("regDiv-register");

	//LobbyDiv
	var userLabel = document.getElementById("userLabel");
	var lobbyDivfindMatch = document.getElementById("lobbyDiv-findMatch");
	var lobbyDivSignOut = document.getElementById("lobbyDiv-signOut");
	var lobbyDiv = document.getElementById("lobbyDiv");
	//var lobbyModeSel = document.getElementById ("lobbyModeSel");
	var radios = document.getElementsByName('radios');


	var lobbyDivCancel = document.getElementById("lobbyDivCancel");

	var statsDivBack = document.getElementById("statsDivBack");
	var storeDiv = document.getElementById("store");
	var levelL = document.getElementById("levelL");


	var canvas = document.getElementById("ctx");
	var ctx = canvas.getContext("2d");

	var pointerLocked = false;
	canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

	document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;


	signDivRegister.onclick = function()
	{
		signDiv.style.display = 'none';
		regDiv.style.display = 'inline-block';
		currentRoom = "register";
	}
	regDivSignIn.onclick = function()
	{
		regDiv.style.display = 'none';
		signDiv.style.display = 'inline-block';
		currentRoom = "signIn";
	}
	signDivSignIn.onclick = function()
	{
		//console.log(signDivUsername.value);
		socket.emit('signIn', {username:signDivUsername.value, password:signDivPassword.value});
	}
	regDivRegister.onclick = function()
	{

		socket.emit('register', {username:regDivUsername.value, password:regDivPassword.value, rPassword:regDivPasswordRepeat.value, email:regDivEmail.value});
	}
	lobbyDivfindMatch.onclick = function()
	{
		if (window.innerWidth >= 1100 && window.innerHeight >= 800)
		{
			var matchType = null;
			//console.log("WIDTH " + window.innerWidth);

			for (var i = 0; i < radios.length; i++)
			{
				if (radios[i].checked)
				{
					matchType = radios[i].value;
					//alert(radios[i].value);
					break;
				}
			}
			if (matchType != null)
			{
				$("#loader").css("display", "inline-block");
				socket.emit('matchMake', {matchType:matchType});
			}
			else if (matchType == "na")
			{
				lobbyDiv.innerHTML += "<p>Ranked coming soon!</p>";
				radios[0].checked = "checked";
			}
			else if (matchType == null)
			{
				lobbyDiv.innerHTML += "<p>Please select a match type!</p>";
				radios[0].checked = "checked";
			}
		}
		else
		{
			alert("I'm sorry but you need a screen size of atleast 1100x930 pixels to play!");
		}
	}
	lobbyDivSignOut.onclick = function()
	{
		$("#lobbyDivCancel").css("display", "none");
		$("#lobbyDiv-findMatch").css("display", "inline-block");
		//$("#lobbyDiv").css("display", "none");
		//$("#signDiv").css("display", "inline-block");
		location.reload();
		//Refesh Page ---- Coming Soon

	}
	lobbyDivCancel.onclick = function()
	{
		//var matchType = lobbyModeSel.options[lobbyModeSel.selectedIndex].value;
		socket.emit("cancelSearch");
	}


	function calculateWinRate(wins, losses)
	{
		var totalGames = wins + losses;
		//console.log(wins + "/" + losses);
		//console.log(totalGames);
		var winR = ((wins / totalGames) * 100).toFixed(2) + "%";
		return winR;
	}
	socket.on('backToLobby', function(data)
	{

		currentRoom = "lobby";
		$("#elementL").text("Not Set");
		$("#gameDiv").css("display", "none");
		$("#lobbyDiv").css("display", "inline-block");
		$("#loader").css("display", "none");
		$("#lobbyWins").text(data.wins);
		$("#lobbyLosses").text(data.losses);

		//One
		$("#lobbyWins1").text(data.oneWins);
		$("#lobbyLosses1").text(data.oneLoss);
		var winR1 = calculateWinRate(data.oneWins, data.oneLoss);
		//console.log(winR1);
		$("#lobbyWinR1").text(winR1);
		//Two
		$("#lobbyWins2").text(data.twoWins);
		$("#lobbyLosses2").text(data.twoLoss);
		var winR2 = calculateWinRate(data.twoWins, data.twoLoss);
		$("#lobbyWinR2").text(winR2);
		//Three
		$("#lobbyWins3").text(data.threeWins);
		$("#lobbyLosses3").text(data.threeLoss);
		var winR3 = calculateWinRate(data.threeWins, data.threeLoss);
		$("#lobbyWinR3").text(winR3);

		var winR = calculateWinRate(data.wins, data.losses);
		$("#lobbyWinR").text(winR);

		//Level
			$("#level").text(data.level);
			$("#exp").text(data.exp);
			$("#expMax").text(data.expMax);

		var expPercent = (data.exp / data.expMax) * 100 + "%";
			$("#expBar").css("width", expPercent);

		$("body").css("background-color", "rgb(51, 153, 255)");
		$("#lobbyDivCancel").css("display", "none");
		$("#lobbyDiv-findMatch").css("display", "inline-block");
		console.log('The pointer lock status is now unlocked');
		pointerLocked = false;
		document.getElementById("sacTitle").style.visibility = "visible";
		document.exitPointerLock();
		//socket.emit('disconnect');
	});

	socket.on('signInResponse', function(data)
	{
		if (data.success)
		{
			signDiv.style.display = 'none';
			lobbyDiv.style.display = 'inline-block';
			$("#lobbyWins").text(data.wins);
			$("#lobbyLosses").text(data.losses);
			var winR = calculateWinRate(data.wins, data.losses);
			$("#lobbyWinR").text(winR);
			$("#userLabel").text(data.username);


			//One
			$("#lobbyWins1").text(data.oneWins);
			$("#lobbyLosses1").text(data.oneLoss);
			var winR1 = calculateWinRate(data.oneWins, data.oneLoss);
			//console.log(winR1);
			$("#lobbyWinR1").text(winR1);
			//Two
			$("#lobbyWins2").text(data.twoWins);
			$("#lobbyLosses2").text(data.twoLoss);
			var winR2 = calculateWinRate(data.twoWins, data.twoLoss);
			$("#lobbyWinR2").text(winR2);
			//Three
			$("#lobbyWins3").text(data.threeWins);
			$("#lobbyLosses3").text(data.threeLoss);
			var winR3 = calculateWinRate(data.threeWins, data.threeLoss);
			$("#lobbyWinR3").text(winR3);


			//Level
			$("#level").text(data.level);
			$("#exp").text(data.exp);
			$("#expMax").text(data.expMax);

			var expPercent = (data.exp / data.expMax) * 100 + "%";
			$("#expBar").css("width", expPercent);

			currentRoom = "lobby";
		}
		else{
			$("#signInfo").css("display", "inline-block");
			$("#signInfo").text("Sign In Unsuccessful");

		}
	});

	socket.on('registerResponse', function(data)
	{
		if (data.success)
		{
			$("#signDiv").css("display", "inline-block");
			$("#regDiv").css("display", "none");
			$("#signInfo").css("display", "inline-block");
			$("#signInfo").text("You can now Login!");
		}
		else{
			$("#regInfo").css("display", "inline-block");
			$("#regInfo").text("Register Unsuccessful");

		}
	});
	socket.on("strategy", function()
	{
		console.log("strategy start");
		currentRoom = "wait";
		lobbyDiv.style.display = 'none';
		waitDiv.style.display = 'inline-block';
		setTimeout(function()
		{
			socket.emit("getPlayerList", {roomId: Player.list[selfId].roomId, id:selfId});
		}, 1000);



		var c = 5;
		var x = setInterval(function() {
			$("#timer").text(c);
  		// If the count down is finished, write some text
  	if (c <= 0) {
			console.log("DONE");
    	clearInterval(x);
			inGame();
  	}
		c--;
	}, 1000);
	});

	socket.on("displayPlayerList", function(data)
{
	//console.log(Player.list[data.id].user);
	for (var i = 0; i < data.list.length; i++)
	{
		//console.log(data.list[i]);
		switch(Player.list[data.list[i]].team)
		{
			case "red":
				if (data.list[i] == selfId)
				{
					$("#redTeamList").append("<div class='redList'>" + Player.list[data.list[i]].user + " (YOU)</div><br />");

				}
				else {
					$("#redTeamList").append("<div class='redList'>" + Player.list[data.list[i]].user + "</div><br />");

				}
					break;
			case "blue":
				if (data.list[i] == selfId)
				{
					$("#blueTeamList").append("<div class='blueList'>" + Player.list[data.list[i]].user + " (YOU)</div><br />");

				}
				else {
					$("#blueTeamList").append("<div class='blueList'>" + Player.list[data.list[i]].user + "</div><br />");

				}
			break;
		}
	}

});
	function inGame()
	{

		currentRoom = "game";
		waitDiv.style.display = 'none';
		document.getElementById("sacTitle").style.display = "none";
		$('body').css("background-color", "white");
		gameDiv.style.display = 'inline-block';
		var storeWidth = 600;
		var storeHeight = 400;
		store.resize(600, 400);
		store.move((WIDTH/2) - storeWidth/2, 25);
		isStore = true;
		loadStore();
		for (var i = 0; i < elementlist.length; i++)
		{
			elementlist[i].move((WIDTH/2) - ((storeWidth/2) - 10), (i*55) + 80);

		}
		drawElements = true;
		infoId = -1;

	};


	socket.on("cancelButton", function(data)
	{
		if (data.value == true)
		{
			$("#lobbyDivCancel").css("display", "inline-block");
			$("#lobbyDiv-findMatch").css("display", "none");
		}
		else
		{
			$("#lobbyDivCancel").css("display", "none");
			$("#lobbyDiv-findMatch").css("display", "inline-block");
			$("#loader").css("display", "none");
		}

	});
	socket.on("removeSelfId", function()
	{
		selfId = null;
	})
	function surrender()
	{
		if (!selfId)
			return;

		if (confirm("Are you sure?"))
		{
			var message = Player.list[selfId].user + " wants to surrender!";
			socket.emit('sendPMToServer', {
				user: "team",
				message: message
			});
			socket.emit("surrender", {playerId: selfId});

		}

	}

	//var chatText = document.getElementById("chat-text");
	//var chatInput = document.getElementById("chat-input");
	//var chatForm = document.getElementById("chat-form");


	ctx.font = "30px Arial";

	canvas.onclick = function() {
		canvas.requestPointerLock();
	}

	document.addEventListener('pointerlockchange', lockChangeAlert, false);
	document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

	function lockChangeAlert() {
		if (document.pointerLockElement === canvas ||
			document.mozPointerLockElement === canvas && pointerLocked == false) {

			console.log('The pointer lock status is now locked');
			pointerLocked = true;
			document.addEventListener("mousemove", updatePosition, false);
		} else {
			console.log('The pointer lock status is now unlocked');
			pointerLocked = false;
			document.removeEventListener("mousemove", updatePosition, false);
		}
	}
	var entryCoor = {x: -1, y:-1};
	function updatePosition(e)
	{
		if (entryCoor.x == -1 || entryCoor.y == -1)
		{
			entryCoor = getPosition(canvas, e);
		}

		var moveX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
		var moveY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
		moveX = Math.clamp(moveX, -50, 50);
		moveY = Math.clamp(moveY, -50, 50);

		entryCoor.x = entryCoor.x + moveX;
		entryCoor.y = entryCoor.y + moveY;


		if (entryCoor.x > WIDTH - 5)
		{
			entryCoor.x = WIDTH - 5;
		}
		else if (entryCoor.x < 0)
		{
			entryCoor.x = 0;
		}
		if (entryCoor.y > HEIGHT - 5)
		{
			entryCoor.y = HEIGHT - 5;
		}
		else if(entryCoor.y < 0)
		{
			entryCoor.y = 0;
		}
		//console.log(moveX + ":" + moveY);

	}

	(function(){Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}})();

	 function getPosition(canvas, event) {
        var x = new Number();
        var y = new Number();

        if (event.x != undefined && event.y != undefined) {
            x = event.x;
            y = event.y;
        }
        else // Firefox method to get the position
        {
            x = event.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop;
        }

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;

        return {x:x, y:y};
	}


	var Img = {};

	//Neutral
	Img.player = new Image();
	Img.player.src = '/client/img/Player/player.png';
	//Fire
	Img.playerFire = new Image();
	Img.playerFire.src = '/client/img/Player/playerFire.png';
	//Water
	Img.playerWater = new Image();
	Img.playerWater.src = '/client/img/Player/playerWater.png';
	//Earth
	Img.playerEarth = new Image();
	Img.playerEarth.src = '/client/img/Player/playerEarth.png';
	//Wind
	Img.playerWind = new Image();
	Img.playerWind.src = '/client/img/Player/playerWind.png';
	//Lightning
	Img.playerLightning = new Image();
	Img.playerLightning.src = '/client/img/Player/playerLightning.png';

	//Neutral
	Img.playerShield = new Image();
	Img.playerShield.src = '/client/img/PlayerShield/playerShield.png';
	//Fire
	Img.playerFireShield = new Image();
	Img.playerFireShield.src = '/client/img/PlayerShield/playerFireShield.png';
	//Water
	Img.playerWaterShield = new Image();
	Img.playerWaterShield.src = '/client/img/PlayerShield/playerWaterShield.png';
	//Earth
	Img.playerEarthShield = new Image();
	Img.playerEarthShield.src = '/client/img/PlayerShield/playerEarthShield.png';
	//Wind
	Img.playerWindShield = new Image();
	Img.playerWindShield.src = '/client/img/PlayerShield/playerWindShield.png';
	//Lightning
	Img.playerLightningShield = new Image();
	Img.playerLightningShield.src = '/client/img/PlayerShield/playerLightningShield.png';


	Img.map1 = new Image();
	Img.map1.src = '/client/img/Maps/testMap1.png';
	Img.map2 = new Image();
	Img.map2.src = '/client/img/Maps/testMap2.png';
	Img.map3 = new Image();
	Img.map3.src = '/client/img/Maps/testMap3.png';

	Img.fire = new Image();
	Img.fire.src = '/client/img/Elements/fire.png';
	Img.wind = new Image();
	Img.wind.src = '/client/img/Elements/wind.png';
	Img.earth = new Image();
	Img.earth.src = '/client/img/Elements/earth.png';
	Img.lightning = new Image();
	Img.lightning.src = '/client/img/Elements/lightning.png';
	Img.water = new Image();
	Img.water.src = '/client/img/Elements/water.png';



	function getPoint(c1, c2, radius, angle)
	{
		return [c1 + Math.cos(angle) * radius, c2 + Math.sin(angle) * radius];
	}

	//Init
	var Player = function(initPack)
	{
		var self = {};
		self.id = initPack.id;
		self.user = initPack.user;
		self.x = initPack.x;
		self.y = initPack.y;
		self.updatedX = 0;
		self.updatedY = 0;
		self.hpMax = initPack.hpMax;
		self.hp = self.hpMax;
		self.kills = initPack.kills;
		self.deaths = initPack.deaths;
		self.gold = initPack.gold;
		self.mouseAngle = initPack.mouseAngle;
		self.latency = 0;
		self.isShielding = initPack.isShielding;
		self.shieldMax = 100;
		self.shield = initPack.shield;
		self.stats = initPack.stats;
		self.map = initPack.map;
		self.roomId = initPack.roomId;
		self.level = 1;
		self.expMax = initPack.expMax;
		self.exp = 0;
		self.team = initPack.team;
		self.isGoal = false;
		self.canMove = true;
		self.overclocked = false;
		self.elementType = initPack.elementType;
		self.movementSpd = initPack.maxSpd;
		self.sprite = initPack.sprite;
		self.spriteShield = initPack.spriteShield;
		self.killCounter = 0;
		self.matchType = null;

		self.draw = function()
		{
			//chatText.innerHTML += self.name + "<br />";
			if (Player.list[selfId].roomId !== self.roomId)
				return;
			var px = self.x - Player.list[selfId].x + WIDTH/2;
			var py = self.y - Player.list[selfId].y + HEIGHT/2;
			//console.log("x: " + self.x + "y: " + self.y + "xx: " + px + "; yy:  " + py)

			socket.emit("updateXY", {playerId:self.id, xx:px, yy:py});

			ctx.strokeStyle = 'black';
			ctx.strokeRect(px-50, py-60, 100, 10);
			var hpWidth = 100 * (self.hp / self.hpMax);
			ctx.fillStyle = 'red';
			ctx.fillRect(px - 50, py - 60, hpWidth, 10);
			var startingX = px - 50;
			var startingY = py - 60;
			var endingX = startingX + hpWidth;
			var endingY = startingY + 10;

			var lines = self.hp / 250;
			var bigLines = self.hp / 500;
			var pixels = hpWidth / lines;
			var bigPixels = hpWidth / bigLines;
			var c = 0;
			for (var i = 0; i < lines; i++)
			{

				ctx.beginPath();
				ctx.strokeStyle = 'black';
				ctx.moveTo(startingX, startingY);
				if (c < 2)
				{
					ctx.lineTo(startingX, startingY + 6);
				}
				else
				{
					ctx.lineTo(startingX, startingY + 10);
					c = 0;
				}

				ctx.stroke();
				ctx.closePath();

				startingX += pixels;
				c++;

			}

			var shieldWidth = 100 * self.shield / self.shieldMax;
			ctx.strokeRect(px-50, py-50, 100, 5);
			ctx.fillStyle = 'blue';
			ctx.fillRect(px - 50, py - 50, shieldWidth, 5);


			ctx.font = "20px Arial";

			ctx.fillStyle = self.team;
			var nameLevel = self.user + " | " + self.level;
			var nameLevelWidth = ctx.measureText(nameLevel).width;
			ctx.fillText(nameLevel, px - nameLevelWidth / 2, py - 65);
			//ctx.fillText(" | Level: " + self.level, px - 25, py - 65);


			var width = Img.player.width;
			var height = Img.player.height;
			//self.x = self.x - 10;


			//ctx.stroke();

			var rad = (self.mouseAngle + 90) * Math.PI / 180;
			/*if (self.isShielding && self.shield > 0)
			{
				var shieldRad = Math.PI + rad;
				var midX = self.x + 32 * Math.cos(shieldRad + Math.PI / 2);
				var midY = self.y + 32 * Math.sin(shieldRad + Math.PI / 2);
				var mid = [midX, midY];
				var right = getPoint(self.x, self.y, 32, shieldRad + Math.PI);
				var leftHalf = getPoint(self.x, self.y, 32, shieldRad + Math.PI / 4);
				var rightHalf = getPoint(self.x, self.y, 32, shieldRad + 3 * Math.PI / 4 )
				var left = getPoint(self.x, self.y, 32, shieldRad);


				socket.emit("shieldValues", {mid: mid, left: left, right: right, rHalf: rightHalf, lHalf: leftHalf});

				ctx.fillRect(mid[0], mid[1], 5, 5);
				ctx.fillRect(right[0], right[1], 5, 5);
				ctx.fillRect(rightHalf[0], rightHalf[1], 5, 5);
				ctx.fillRect(leftHalf[0], leftHalf[1], 5, 5);
				ctx.fillRect(left[0], left[1], 5, 5);
				ctx.beginPath();
				ctx.arc(self.x, self.y, 32, 0 + shieldRad, Math.PI + shieldRad);
				ctx.stroke();
			}*/
			var spriteImage = new Image();
			spriteImage.src = self.sprite;

			var spriteShieldImage = new Image();
			spriteShieldImage.src = self.spriteShield;
			ctx.translate(px + (width / 2) - 30, py + (height / 2) - 30 );

			ctx.rotate(rad);
			if (self.isShielding && self.shield > 0)
			{
				ctx.drawImage(spriteShieldImage, (width / 2 * (-1)), height / 2 * (-1), width, height);
			}
			else
			{
				ctx.drawImage(spriteImage, (width / 2 * (-1)), height / 2 * (-1), width, height);

			}
			//chatText.innerHTML+="" + self.mouseAngle + "<br />";


			ctx.rotate(rad * (-1));
			ctx.translate((px + width / 2) * (-1) + 30, (py + height / 2) * (-1) + 30);



			//ctx.font = "10px Arial";
			//ctx.fillText(self.kills, self.x, self.y-60);
			//ctx.font = "30px Arial";
		}

		Player.list[self.id] = self;

		return self;
	}
	Player.list = {};
	/*$("#respawnL").text("10 second strategy time!");
	setTimeout(function()
	{
		$("#respawnL").text("Capture the point!");
		socket.emit("setCanMove", {value:true});
	}, 10000);
*/

	/*var Damage = function()
	{
		var self = {};
		self.amount = 0;
		self.text = "";
		self.target = null;
		self.type = null;
		self.x = null;
		self.y = null;
		self.time = 500; //Milliseconds
		self.setAllValues = function(data)
		{
			self.target = data.playerHit;
			self.amount = data.amount;
			self.type = data.type;
			self.x = self.target.updatedX;
			self.y = self.target.updatedY;
		}
		self.draw = function()
		{

		//var playerHit = self.target;
		var col = null;
		var fnt = null;
		switch (self.type)
			{
				case "damage":
					self.text = "-" + self.amount;
					fnt = "15px Arial";
					col = "red";
				break;
				case "crit":
					self.text = "#" + self.amount;
					fnt = "20px Arial";
					col = "#b30000";
				break;
				case "heal":
					self.text = "+" + self.amount;
					fnt = "15px Arial";
					col = "green";
				break;
			}

			var yoffset = 80 + genRandomNumber(-10, 10);
			var xoffset = genRandomNumber(-20, 20);
			//var amount = data.amount;

			var move = 0;
			while(self.time > 0)
			{
				setTimeout(function()
				{
					ctx.fillStyle = col;
					ctx.font = fnt;
					ctx.fillText(self.text, self.x + xoffset, (self.y - yoffset) - move);
					move += 0.1;
				}, self.time);

				self.time-=10;
			}



		}
		return self;
	}
	*/

	socket.on("deathCounter", function(data)
	{
	//	ctx.font = "50px Arial";
		showDeathRecap(data);
		var val = data.value;
		var x = setInterval(function() {
		console.log(val);
  	if (val <= 0) {
			console.log("respawn");
			socket.emit("setCanMove", {playerId:selfId, count: true, value:true});
    	clearInterval(x);
  	}
		val--;
	}, 1000);


	});


	socket.on("killAnnounce", function(data)
	{
		switch(data.type)
		{
			case "single":
				chatArr.unshift(Player.list[data.playerId].user + ' killed ' + data.victim);

			break;
			case "double":
				chatArr.unshift(Player.list[data.playerId].user + ' got a double kill! ');

			break;
			case "triple":
				chatArr.unshift(Player.list[data.playerId].user + ' got a TRIPLE KILL!');

			break;
		}
		drawChatBody = true;

	});
	var Bullet = function(initPack)
	{
		var self = {};
		self.id = initPack.id;
		self.x = initPack.x;
		self.y = initPack.y;
		self.map = initPack.map;
		self.roomId = initPack.roomId;
		self.draw = function()
		{
			if (Player.list[selfId].roomId !== self.roomId)
				return;
			ctx.fillStyle = "black";
			var bx = self.x - Player.list[selfId].x + WIDTH/2;
			var by = self.y - Player.list[selfId].y + HEIGHT/2;

			//console.log("bx: " +bx + "y: " + by + "dx: " + dummy1.px + 16 + "dy: " + dummy1.py + 16)
			//console.log(getDis(bx, by, dummy1.px, dummy1.py));

			ctx.fillRect(bx-5, by-5, 10, 10);
			ctx.fillStyle = "red";
			//ctx.arc(self.x-5, self.y-5, 5, 0,d 2 * Math.PI, false);
		}

		Bullet.list[self.id] = self;
		return self;
	}

	var BulletGuide = function()
	{
		var self = {};
		//self.map = initPack.map;
		self.draw = function()
		{
			ctx.fillStyle = "black";
			//var bx = self.x - Player.list[selfId].x + WIDTH/2;
			//var by = self.y - Player.list[selfId].y + HEIGHT/2;
			//var lx = Player.list[selfId].x + 600;

			ctx.beginPath();
			ctx.moveTo(WIDTH/2, HEIGHT/2);

			ctx.lineTo(entryCoor.x, entryCoor.y);
			//console.log(entryCoor.x + ": " + entryCoor.y)
			//ctx.fillRect(bx-5, by-5, 10, 10);
			ctx.stroke();
			ctx.fillStyle = "red";
			//ctx.endPath();
			self.counter--;


				//ctx.arc(self.x-5, self.y-5, 5, 0,d 2 * Math.PI, false);
		}
	return self;

	}
	Bullet.list = {};


	var dummy = function(x, y, maxHealth)
	{
		var self = {};
		self.x = x;
		self.y = y;
		self.px = x;
		self.py = y;
		self.hpMax = maxHealth;
		self.hp = self.hpMax;
		self.draw = function()
		{
			self.px = self.x - Player.list[selfId].x + WIDTH/2;
			self.py = self.y - Player.list[selfId].y + HEIGHT/2;

			ctx.drawImage(Img.player, self.px, self.py);

			ctx.strokeStyle = 'black';
			ctx.strokeRect(self.px - 20, self.py - 20, 100, 10);
			var hpWidth = 100 * (self.hp / self.hpMax);
			ctx.fillStyle = 'red';
			ctx.fillRect(self.px- 20, self.py- 20, hpWidth, 10);
			var startingX = self.px- 20;
			var startingY = self.py - 20;
			var endingX = startingX + hpWidth;
			var endingY = startingY + 10;

			var lines = self.hp / 250;
			var bigLines = self.hp / 500;
			var pixels = hpWidth / lines;
			var bigPixels = hpWidth / bigLines;
			var c = 0;
			for (var i = 0; i < lines; i++)
			{

				ctx.beginPath();
				ctx.strokeStyle = 'black';
				ctx.moveTo(startingX, startingY);
				if (c < 2)
				{
					ctx.lineTo(startingX, startingY + 6);
				}
				else
				{
					ctx.lineTo(startingX, startingY + 10);
					c = 0;
				}

				ctx.stroke();
				ctx.closePath();

				startingX += pixels;
				c++;

			}
		}

		return self;
	}



	var selfId = null;

	socket.on('init', function(data)
	{

		if (data.selfId)
		{
			selfId = data.selfId;
		}
		for (var i = 0; i < data.player.length; i++)
		{
			new Player(data.player[i]);

			//console.log("init");
			//console.log(data.player[i]);
		}
		for (var i = 0; i < data.bullet.length; i++)
		{
			new Bullet(data.bullet[i]);
		}

	});

	//Update

	socket.on('update', function(data)
	{
		for (var i = 0; i < data.player.length; i++)
		{
			var pack = data.player[i];
			var p = Player.list[pack.id];
			if (p)
			{
				if (pack.x !== undefined)
				{
					p.x = pack.x;
				}
				if (pack.y !== undefined)
				{
					p.y = pack.y;
				}
				if (pack.hp !== undefined)
				{
					p.hp = pack.hp;
				}
				if (pack.hpMax !== undefined)
				{
					p.hpMax = pack.hpMax;
				}
				if (pack.exp !== undefined)
				{
					p.exp = pack.exp;
				}
				if (pack.expMax !== undefined)
				{
					p.expMax = pack.expMax;
				}
				if (pack.level !== undefined)
				{
					p.level = pack.level;
				}
				if (pack.kills !== undefined)
				{
					p.kills = pack.kills;
				}
				if (pack.deaths !== undefined)
				{
					p.deaths = pack.deaths;
				}
				if (pack.gold !== undefined)
				{
					p.gold = pack.gold;
				}
				if (pack.user !== undefined)
				{
					p.user = pack.user;
				}
				if (pack.latency !== undefined)
				{
					p.latency = pack.latency;
				}
				if (pack.isShielding !== undefined)
				{
					p.isShielding = pack.isShielding;
				}
				if (pack.mouseAngle !== undefined)
				{
					p.mouseAngle = pack.mouseAngle;
				}
				if (pack.shield !== undefined)
				{
					p.shield = pack.shield;
				}
				if (pack.stats !== undefined)
				{
					p.stats = pack.stats;
				}
				if (pack.updatedX !== undefined)
				{
					p.updatedX = pack.updatedX;
				}
				if (pack.updatedY !== undefined)
				{
					p.updatedY = pack.updatedY;
				}
				if (pack.isGoal !== undefined)
				{
					p.isGoal = pack.isGoal;
				}
				if (pack.canMove !== undefined)
				{
					p.canMove = pack.canMove;
				}
				if (pack.elementType !== undefined)
				{
					//console.log(pack.elementType);
					p.elementType = pack.elementType;
				}
				if (pack.maxSpd !== undefined)
				{
					p.movementSpd = pack.maxSpd;
				}
				if (pack.sprite !== undefined)
				{
					p.sprite = pack.sprite;
				}
				if (pack.spriteShield !== undefined)
				{
					p.spriteShield = pack.spriteShield;
				}
				if (pack.killCounter !== undefined)
				{
					p.killCounter = pack.killCounter;
				}
				if (pack.matchType !== undefined)
				{
					p.matchType = pack.matchType;
				}

			}
		}
		for (var i = 0; i < data.bullet.length; i++)
		{
			var pack = data.bullet[i];
			var b = Bullet.list[data.bullet[i].id];
			if (b)
			{
				if (pack.x !== undefined)
				{
					b.x = pack.x;
				}
				if (pack.y !== undefined)
				{
					b.y = pack.y;
				}
			}
		}
	});

	playerInventory = new Inventory();

	/*socket.on("matchingLabel", function()
	{
		matchLabel.innerHTML = "Searching...";
	});*/
	//Remove
	socket.on('remove', function(data)
	{
		for (var i = 0; i < data.player.length; i++)
		{
			delete Player.list[data.player[i]];
		}
		for (var i = 0; i < data.bullet.length; i++)
		{
			delete Bullet.list[data.bullet[i]];
		}
	});
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

				if (MapGrid1[x][y] == val)
				{
					return {x, y};
				}

			}
		}
		return false;

	}

	var killDeathVal = "";
	var goldVal = "";
	var levelVal = "";
	var drawScore = function()
	{
		if (!selfId)
			return;
		//killL.innerHTML = "Kills: " + Player.list[selfId].kills + " / ";
		killDeathVal = "Kills: " + Player.list[selfId].kills + " / Deaths: " + Player.list[selfId].deaths;
		goldVal = "Gold: " + Player.list[selfId].gold;
		levelVal = "Level: " + Player.list[selfId].level;
		//deathL.innerHTML = "Deaths: " + Player.list[selfId].deaths;
		//ctx.fillText("Shield: " + Player.list[selfId].shield, 200, 30);
		//goldLabel.innerHTML = Player.list[selfId].gold;
		//levelL.innerHTML = Player.list[selfId].level;
		//killL.innerHTML = "Goal: " + Player.list[selfId].isGoal + " / ";
	}

	socket.on("showCombat", function(data)
	{
		var text = null;
		var col = null;
		var fnt = null;
		switch (data.type)
			{
				case "damage":
					text = "-" + data.amount;
					fnt = "15px Arial";
					col = "red";
				break;
				case "crit":
					text = "#" + data.amount;
					fnt = "20px Arial";
					col = "#b30000";
				break;
				case "heal":
					text = "+" + data.amount;
					fnt = "15px Arial";
					col = "green";
				break;
			}
		var playerHit = data.playerHit;
		if (playerHit !== null && selfId !== null && text !== null && col !== null && fnt !== null && playerHit.roomId == Player.list[selfId].roomId)
		{

		//var xx = playerHit.x - Player.list[selfId].x + WIDTH/2;
		//var yy = playerHit.y - Player.list[selfId].y + HEIGHT/2;
		//chatText.innerHTML += "x: " + xx + "; y: " + yy + "<br />";
		var d = new Damage(
		{
		x:playerHit.x,
		y:playerHit.y,
		type:data.type,
		amount:data.amount
		});
		d.draw();
		//chatText.innerHTML += playerHit.user + ": " + data.type + "; " + data.amount + "<br />";

		//var d = Damage();
		//d.setAllValues(data);
		//d.draw();

		//step = 0;
		//steps = 100;
		//chatText.innerHTML += amount;
		//runText(amount);
		}
	});

	var Damage = function(initPack)
	{
		var self = {};
		//var playerHit = initPack.playerHit;
		self.x = initPack.x;
		self.y = initPack.y;
		self.type = initPack.type;
		self.amount = initPack.amount;
		self.time = 400;
		self.draw = function()
		{
			if (!selfId)
				return;
			var xx = self.x - Player.list[selfId].x + WIDTH/2;
			var yy = self.y - Player.list[selfId].y + HEIGHT/2;
			var col = null;
			var fnt = null;
			var text = null;
			switch (self.type)
			{
				case "damage":
				text = "-" + self.amount.toFixed(2);
					fnt = "15px Arial";
					col = "red";
				break;
				case "crit":
					text = "#" + self.amount.toFixed(2);
					fnt = "20px Arial";
					col = "#b30000";
				break;
				case "heal":
					text = "+" + self.amount.toFixed(2);
					fnt = "15px Arial";
					col = "green";
				break;
			}

			var yoffset = 80 + genRandomNumber(-10, 10);
			var xoffset = genRandomNumber(-20, 20);
			//var amount = data.amount;

			var move = 0;
			//chatText.innerHTML += "X: " + self.x + "; Y: " + self.y + "<br />";
			while(self.time > 0)
			{
				setTimeout(function()
				{
					ctx.fillStyle = col;
					ctx.font = fnt;
					ctx.fillText(text, xx + xoffset, (yy - yoffset) - move);
					move += 0.05;
				}, self.time);

				self.time-=10;
			}

		}
		return self;
	}

	function genRandomNumber(min, max)
	{
		return Math.random() * (max - min) + min;
	}
	var armorValue = null;
	var lethalityValue = null;
	socket.on("updateArmor", function(data)
	{
		armorValue = data.value;
		//updateStatBoard();
	});
	socket.on("updateLethality", function(data)
	{
		lethalityValue = data.value;
		//updateStatBoard();
	});
	/*function updateStatBoard()
	{
		if(selfId)
		{
			var stats = Player.list[selfId].stats;
			if (armorValue == null)
			{
				var armor = "Undetermined ";
			}
			else
			{
				var armor = armorValue.toFixed(2) * 100;
			}
			if (lethalityValue == null)
			{
				var lethalityArmor = "Undetermined ";
			}
			else
			{
				var lethalityArmor = 100 - (((lethalityValue - stats.lethality) / lethalityValue) * 100).toFixed(2);
			}
			//console.log(lethalityArmor + "; " + stats.lethality);
			var damage = (stats.attack * stats.attack) / (stats.attack + 0);
			var attackSpdMs = (40 * (stats.attackSpd))
			var attackSpdSec = attackSpdMs / 1000;

			var critDam = ((damage * 150) / 100);
			var extraDam = critDam * (stats.critDam / 100);

			var critDif = (critDam + extraDam) - damage;

			var movementSpd = Player.list[selfId].movementSpd;
			var mapTime = ((3200 / movementSpd) * 40) / 1000;
			mapTime = mapTime.toFixed(2);

			$('#attackL').text(stats.attack);

			attackTT.textContent = "You deal " + damage + " damage! (+" + stats.elementalDamage + ") against weak elements";
			$('#armorL').text(stats.armor);
			armorTT.textContent = "You took " + armor + "% of damage on the last hit!";

			//var lethalityPercent = ((lethalityArmor - stats.lethality) / lethalityArmor) * 100;

			$('#lethalityL').text(stats.lethality);
			lethalityTT.textContent = "You negate " + lethalityArmor + "% of the enemies armor";

			$('#attackSpdL').text(stats.attackSpd);
			attackSpdTT.textContent = "1 Bullet every " + attackSpdSec + " second(" + attackSpdMs + "Ms)";

			$('#critL').text(stats.crit);
			critTT.textContent = "You deal " + (critDam + extraDam) + " damage on critical hit (+" + critDif + " difference) | +" + extraDam;

			$('#lifeStealL').text(stats.lifeSteal);
			var lifeStealAmt = damage * (stats.lifeSteal / 100);
			var critLifeAmt = critDam * (stats.lifeSteal / 100);
			lifeStealTT.textContent = "You heal +" + stats.lifeSteal + "% (+" + lifeStealAmt +"/+" + critLifeAmt+ ") of your damage on attack";

			var lifeRegenExtra = 2 * (stats.lifeRegen / 100);
			var lifeRegen = 2 + lifeRegenExtra;
			$('#lifeRegenL').text(lifeRegen);
			lifeRegenTT.textContent = "You heal +" + lifeRegen + " hp (+" + stats.lifeRegen +"%) every second!";

			$('#movementL').text(movementSpd);
			movementTT.textContent = "You can travel across the map in " + mapTime + " seconds!";

		}

	}*/
	setInterval(function()
	{
		startTime = Date.now();
		if (selfId)
		{
			socket.emit('updateGold', {amount: 1, playerId: selfId, type:"up"});
		}

		socket.emit('calculateLatency');
		//updateStatBoard();
	}, 2000); //Calculate Latency

	socket.on('displayLatency', function()
	{
		if(selfId)
		{
			Player.list[selfId].latency = Date.now() - startTime;
		}

	});
	socket.on("updateHealthbar", function(data)
	{
		if(selfId)
		{
			var p = Player.list[selfId];
			if (data.type == "damage")
			{
				var missing = p.hp - data.amount;
				var percent = (missing / p.hpMax) * 100 + "%";
				//$('#healthL').text(missing.toFixed(2) + " (-" + data.amount.toFixed(2) + ")");
				healthText = missing.toFixed(2) + " (-" + data.amount.toFixed(2) + ")";
			}
			else if (data.type == "heal")
			{
				var missing = p.hp + data.amount;
				if (missing > p.hpMax)
				{
					missing = p.hpMax;
				}
				var percent = (missing / p.hpMax) * 100 + "%";
				healthText = missing.toFixed(2) + " (+" + data.amount.toFixed(2) + ")";
				//$('#healthL').text(missing.toFixed(2) + " (+" + data.amount.toFixed(2) + ")");

			}
			//console.log(data.damage);
			var ratio = p.hp / p.hpMax;
			healthBar.resize(550 * ratio, healthBar.h);
			//$('#healthDiv').css("width", percent);

		}
	});
	var expVal = "";
	var expMapVal = "";

	function updateExpBar()
	{
		var p = Player.list[selfId];
		var percent = (p.exp / p.expMax) * 100 + "%";
		expVal = p.exp;
		expMaxVal = p.expMax;
		var ratio = p.exp / p.expMax;

		expBar.resize(400 * ratio, expBar.h);


		//$('#expDiv').css("width", percent);
		//$("#expL").text(p.exp);
		//$("#expMaxL").text(p.expMax);

	}

	var drawMap = function()
	{

		if (!selfId)
			return;
		var x = WIDTH/2 - Player.list[selfId].x;
		var y = HEIGHT/2 - Player.list[selfId].y;
		switch(Player.list[selfId].map)
		{
			case "map1":
				ctx.drawImage(Img.map1, x, y);
			break;
			case "map2":
				ctx.drawImage(Img.map2, x, y);
			break;
			case "map3":
				ctx.drawImage(Img.map3, x, y);
			break;
		}


	}
	function getDis(x1, y1, x2, y2)
	{
		let xDistance = x2 - x1;
		let yDisance = y2 - y1;
		return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDisance, 2));
	}
	setInterval(function()
	{
		if(!selfId)
			return;
		var p = Player.list[selfId];
		if (p.hp < p.hpMax)
		{
			var healExtra = 2 * (p.stats.lifeRegen / 100);
			var healAmt = 2 + healExtra;
			socket.emit("increaseHP", {amount: healAmt, playerId:selfId});
		}
	}, 1000);




	var drawElements = true;
	function selectElement(itemId)
	{

		if (checkStoreRange())
		{
			for (var ii in Player.list)
			{
				var p = Player.list[ii];
				if (p.team == Player.list[selfId].team)
				{
					if(p.elementType == Element.list[itemId].name)
					{
						return;
					}
				}

			}
			entryCoor.x = WIDTH/2 - 100;
			entryCoor.y = HEIGHT/2 - 100;
			socket.emit("setElement", {playerId:selfId, elementType:Element.list[itemId].name});


			//$("#elementL").text(Element.list[itemId].name);
			Element.list[itemId].event();
			store.resize(1200, 700);
			storeWidth = 1200;
			storeHeight = 800;
			store.move((WIDTH / 2) - storeWidth/2, 25);
			//storeDiv.innerHTML = "";

			var count = 0;
			var cols = 0;
			for (var i in Item.list)
			{
				//storeDiv.innerHTML += "<button onclick=buyItem('"+i+"')>" + Item.list[i].name + ": " + Item.list[i].gold + " Gold </button><br /><label>" + Item.list[i].explain + "</label><br /><hr />";
				if (Item.list[i].showInStore)
				{
					itemlist.push(new Button(Item.list[i].name + ": " + Item.list[i].gold + " Gold", Item.list[i].explain, null, null, i, true, (WIDTH/2) - ((storeWidth/2) - 10) + (cols * 305), (count*55) + 80, 300, 50));
					count++;
					if (count % 11 == 0)
					{
						cols++;
						count = 0;
					}

				}

			}
			infoId = -1;
			drawElements = false;
			resize();
		}

	}
	socket.on("disableElement", function(data)
	{
		var buttonId = "#btn" + data.elementType;
		$(buttonId).prop("disabled", "true");
	});

	function buyItem(itemId)
	{
		if (checkStoreRange() && playerInventory.invSize < 7)
		{
			//console.log(Item.list[itemId].type);
			if (itemId == "feather" && Player.list[selfId].stats.attackSpd - 0.2 < 0)
			{
				return;
			}
			else if (itemId == "overclock" && playerInventory.hasItem("overclock", 1) == 1)
			{
				return;

			}
			else if (itemId == "return" && playerInventory.hasItem("return", 1) == 1)
			{
				return;

			}
			else if (itemId == "boots" && playerInventory.hasItem("boots", 1) == 1)
			{
				return;

			}
			else
			{
				//console.log(itemId);

				/*for (var x in Item.list)
				{
					//console.log(Item.list[x].ing1);
					if (Item.list[x].ing1 == itemId || Item.list[x].ing2 == itemId)
					{
						if (Item.list[x].currentGold - Item.list[itemId].currentGold > 0)
						{
							Item.list[x].currentGold -= Item.list[itemId].currentGold;
						}

						//console.log(Item.list[x].name + ": " + Item.list[x].currentGold);
					}
				}
				for (var b = 0; b < itemlist.length; b++)
				{
					//console.log(itemlist[b].id + ": " + itemId)
					if (Item.list[itemlist[b].id].ing1 == itemId || Item.list[itemlist[b].id].ing2 == itemId )
					{

						itemlist[b].txt = Item.list[itemlist[b].id].name + ": " + Item.list[itemlist[b].id].currentGold + " Gold";

					}
				}

				for (var i = 0; i < playerInventory.passive.length; i++)
				{

					if (Item.list[itemId].ing1 == playerInventory.passive[i].id && Item.list[itemId].ing2 == playerInventory.passive[i].id)
					{

						if (playerInventory.hasItem(playerInventory.passive[i].id, 2) == 0)
						{
							return;
						}

						Item.list[playerInventory.passive[i].id].sellFunc();
						Item.list[itemId].currentGold = Item.list[itemId].gold;
						var g = Item.list[itemId].currentGold - checkForRemainingItems(playerInventory.passive[i].id);

						//console.log(g);
						for (var x in itemlist)
						{
							if (itemlist[x].id == Item.list[itemId].id)
							{
								itemlist[x].txt = Item.list[itemId].name + ": " + g + " Gold";
							}
						}
						updateInventoryButtons(playerInventory.passive[i].id);
						playerInventory.removeItem(playerInventory.passive[i].id, 2, false);




					}
					else if (Item.list[itemId].ing1 == playerInventory.passive[i].id && Item.list[itemId].ing2 != playerInventory.passive[i].id)
					{
						if (playerInventory.hasItem(playerInventory.passive[i].id, 1) == 0)
						{
							return;
						}
						Item.list[playerInventory.passive[i].id].sellFunc();
						Item.list[itemId].currentGold = Item.list[itemId].gold;
						for (var x in itemlist)
						{
							if (itemlist[x].id == Item.list[itemId].id)
							{
								itemlist[x].txt = Item.list[itemId].name + ": " + Item.list[itemId].currentGold + " Gold";
							}
						}
						updateInventoryButtons(playerInventory.passive[i].id);
						playerInventory.removeItem(playerInventory.passive[i].id, 1, false);
					}
					else if (Item.list[itemId].ing1 != playerInventory.passive[i].id && Item.list[itemId].ing2 == playerInventory.passive[i].id)
					{
						if (playerInventory.hasItem(playerInventory.passive[i].id, 1) == 0)
						{
							return;
						}
						Item.list[playerInventory.passive[i].id].sellFunc();
						Item.list[itemId].currentGold = Item.list[itemId].gold;
						for (var x in itemlist)
						{
							if (itemlist[x].id == Item.list[itemId].id)
							{
								itemlist[x].txt = Item.list[itemId].name + ": " + Item.list[itemId].currentGold + " Gold";
							}
						}
						updateInventoryButtons(playerInventory.passive[i].id);
						playerInventory.removeItem(playerInventory.passive[i].id, 1, false);
					}

				}*/

				playerInventory.addItem(itemId, 1, Item.list[itemId].gold, Item.list[itemId].type);
			}

		}

		for (var i = 0; i < playerInventory.items.length; i++)
		{
			activeBtns.push(new Button(Item.list[playerInventory.items[i].id].name, null, null, null, playerInventory.items[i].id, null, (WIDTH/2) - ((storeWidth/2) - 10), store.y + 75 + (55 * i), 300, 50));
		}


		for (var i = 0; i < playerInventory.passive.length; i++)
		{
			passiveBtns.push(new Button(Item.list[playerInventory.passive[i].id].name, null, null, null, playerInventory.passive[i].id, null, (WIDTH/2) - ((storeWidth/2) - 10) , store.y + 330 + (55 * i), 300, 50));
		}

	}
	function checkStoreRange()
	{
		if (!selfId)
			return;
		var p = Player.list[selfId];
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
	var dummy1 = new dummy(window.innerWidth/2 + genRandomNumber(-500, 500), window.innerHeight/2 + genRandomNumber(-500, 500), 1000);

	setInterval(function()
	{
		if (selfId == null)
			return;

		//checkStoreRange();

		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		drawMap();

		if (isGuide)
		{
			var bg = BulletGuide();
			bg.draw();
		}
		//drawName();
		//updateScoreBoard();

		if (Player.list[selfId].isShielding)
		{
			socket.emit('updateShield', {state:false}); //True for positive, false for negative
		}
		else
		{
			socket.emit('updateShield', {state:true});
		}

		//chatText.innerHTML += "cleared";
		for (var i in Player.list)
		{
			Player.list[i].draw();
		}
		for (var i in Bullet.list)
		{
			Bullet.list[i].draw();
		}

		//GUI ----------

		if (Player.list[selfId].matchType == "training")
		{
			//console.log(true)
			dummy1.draw();
		}

		if (WIDTH != 0)
		{
			drawStore();
			drawScore();
			updateExpBar();
			drawGUI();
		}

		playerInventory.refreshRender();




		//Mouse
		ctx.fillStyle = "black";
		ctx.fillRect(entryCoor.x, entryCoor.y, 5, 5);
	}, 40);

	socket.on('getPlayerAngle', function(data)
	{
		Player.list[selfId].mouseAngle = data.mouseAngle;
	});

	var chatArr = [];
	socket.on('addToChat', function(data)
	{

		//console.log(data.name + ";" + data.txt);
		chatArr.unshift(data.name + "" + data.txt);

		drawChatBody = true;


		//chatText.innerHTML += '<div><b>' + data.name + '</b>' + data.txt + '</div>';
	});
	socket.on('evalAnswer', function(data)
	{
		console.log(data);
	});
	var team1ScoreVal = "";
	var team2ScoreVal = "";
	socket.on('updateScoreBar', function(data)
	{

		//$("#team1L").text("(+" + data.team1N + ")");
		//$("#team2L").text("(+" + data.team2N + ")");
		team1ScoreVal = (data.team1 / 1000) * 100 + "%";
		team2ScoreVal = (data.team2 / 1000) * 100 + "%";
		//$("#team1Div").css("height", data.team1);
		//$("#team2Div").css("height", data.team2);
	});


	var sendChatToServer = function(e, chatText)
	{
		e.preventDefault();
		if (chatText.charAt(0) === '/')
		{
			socket.emit('evalServer', chatText.slice(1));
		}
		else if (chatText.charAt(0) === '@')
		{

			socket.emit('sendPMToServer', {
				user: chatText.slice(1, chatText.indexOf(',')),
				message: chatText.slice(chatText.indexOf(',') + 1)
			});
		}
		else
		{
			//console.log(chatText);
			socket.emit('sendMsgToServer', chatText);
		}


	}

	var inChat = false;

	document.onkeydown = function(event)
	{
		if (event.keyCode === 8 && currentRoom == "game")
		{
			return false;
		}
		else if(event.keyCode === 68) //D
		{
			if (inChat)
				return;
			socket.emit('keyPress', {inputId: 'right', state:true});
		}
		else if(event.keyCode === 83) //S
		{
			if (inChat)
				return;
			socket.emit('keyPress', {inputId: 'down', state:true});
		}
		else if(event.keyCode === 65) //A
		{
			if (inChat)
				return;
			socket.emit('keyPress', {inputId: 'left', state:true});
		}
		else if(event.keyCode === 87) //W
		{
			if (inChat)
				return;
			socket.emit('keyPress', {inputId: 'up', state:true});
		}
		else if(event.keyCode === 32) //Space
		{
			if (inChat)
				return;
			socket.emit('keyPress', {inputId: 'shield', state:true});
		}
		else if(event.keyCode === 69) //E
		{
			if (inChat)
				return;
			showStore();
		}

	}


	var chatText = "";

	document.onkeyup = function(event)
	{


		 if(event.keyCode === 68) //D
		{
			socket.emit('keyPress', {inputId: 'right', state:false});
		}
		else if(event.keyCode === 83) //S
		{
			socket.emit('keyPress', {inputId: 'down', state:false});
		}
		else if(event.keyCode === 65) //A
		{
			socket.emit('keyPress', {inputId: 'left', state:false});
		}
		else if(event.keyCode === 87) //W
		{
			socket.emit('keyPress', {inputId: 'up', state:false});
		}
		else if(event.keyCode === 32) //Space
		{

			socket.emit('keyPress', {inputId: 'shield', state:false});
		}
		else if(event.keyCode === 49) //1
		{
			//console.log ("1");
			if (!selfId)
				return;
			//socket.emit('keyPress', {inputId: 'item1', state:true});
			if (playerInventory.items[0] !== undefined)
			{
				//console.log(Item.list[playerInventory.items[0].id].name);
				Item.list[playerInventory.items[0].id].event();

			}

		}
		else if(event.keyCode === 50) //2
		{
			//console.log ("2");
			if (!selfId)
				return;
			if (playerInventory.items[1] !== undefined)
				Item.list[playerInventory.items[1].id].event();
			//socket.emit('keyPress', {inputId: 'item1', state:true});
		}
		else if(event.keyCode === 51) //3
		{
			//console.log ("3");
			if (!selfId)
				return;
			if (playerInventory.items[2] !== undefined)
				Item.list[playerInventory.items[2].id].event();
			//socket.emit('keyPress', {inputId: 'item1', state:true});
		}
		else if (event.keyCode === 13)
		{
			switch(inChat)
			{
				case true:
					inChat = false;
					if (chatText != "")
					{
						sendChatToServer(event, chatText);
					}
					chatText = '';
				break
				case false:
					inChat = true;
				break;
			}
		}
		if (inChat)
		{
			var key = event.keyCode;
			if (key !== 8)
			{
				var letter = String.fromCharCode((96 <= key && key <= 105) ? key-48 : key);
				if(chatText.length < 30)
				{
					chatText += letter;
				}


			}
			else
			{
				chatText = chatText.substring(0, chatText.length - 1);
			}
			//console.log(chatText);

		}
	}

	document.onmousedown = function(event)
	{
		//chatText.innerHTML += event.clientX + ":" + event.clientY + "<br />";

		if (event.button == 0)
		{
			if (isStore)
				return;
			socket.emit('keyPress', {inputId: 'attack', state: true});
		}
		else if (event.button == 2)
		{
			switch(isGuide)
			{
				case false:
					isGuide = true;
				break;
				case true:
					isGuide = false;
				break;
			}
		}



	}
	document.onmouseup = function(event)
	{
		if (event.button == 0)
		{
			if (isStore == false)
			{
				socket.emit('keyPress', {inputId: 'attack', state: false});
			}
			else
			{
				if (drawElements)
				{
					for (var i = 0; i < elementlist.length; i++)
					{
						elementlist[i].getInfo();
					}
				}
				else
				{
					if (currentTab == "store")
					{
						for (var i = 0; i < itemlist.length; i++)
						{
							itemlist[i].getInfo();
						}

					}
					else if (currentTab == "inventory")
					{
						for (var i = 0; i < activeBtns.length; i++)
						{
							activeBtns[i].getInfo();
						}
						for (var i = 0; i < passiveBtns.length; i++)
						{
							passiveBtns[i].getInfo();
						}
						sellButton.getClick();

					}
					upgradeBtn.getInfo();
				}

				invBtn.getClick();
				storeBtn.getClick();

			}

		}
		else if (event.button == 2 && isStore)
		{
			if (drawElements)
			{
				for (var i = 0; i < elementlist.length; i++)
				{
					elementlist[i].getClick();
				}
			}
			else
			{
				if(currentTab == "store")
				{
					for (var i = 0; i < itemlist.length; i++)
					{
						itemlist[i].getClick();
					}

				}
				else if (currentTab == "inventory")
				{
					for (var i = 0; i < activeBtns.length; i++)
					{
						activeBtns[i].getClick();
					}
					for (var i = 0; i < passiveBtns.length; i++)
					{
						passiveBtns[i].getClick();
					}

				}
				if (infoId == upgradeBtn.id)
				{
					upgradeBtn.getClick();
				}

			}



		}

	}
	document.onmousemove = function(event)
	{
		/*var x = -600 + event.clientX - 8;
		var y = -500 + event.clientY - 8;
		var angle = Math.atan2(y, x) / Math.PI * 180;*/
		if (pointerLocked == true)
		{
			//checkHover();
			if (drawElements)
			{
				for (var i = 0; i < elementlist.length; i++)
				{
					elementlist[i].getHover();
				}

			}
			else
			{
				if (currentTab == "store")
				{
					for (var i = 0; i < itemlist.length; i++)
					{
						itemlist[i].getHover();
					}

				}
				else if(currentTab == "inventory")
				{
					for (var i = 0; i < passiveBtns.length; i++)
					{
						passiveBtns[i].getHover();
					}
					for (var i = 0; i < activeBtns.length; i++)
					{
						activeBtns[i].getHover();
					}
					sellButton.getHover();

				}
				upgradeBtn.getHover();
			}



			invBtn.getHover();
			storeBtn.getHover();
			//console.log(entryCoor.x + ": " + entryCoor.y);
			var xx = entryCoor.x - WIDTH/2;
			var yy = entryCoor.y - HEIGHT/2;
			var angle = Math.atan2(yy, xx);
			angle = angle * (180/Math.PI);

			if (angle < 0) angle = 360 - (-angle);
			socket.emit('keyPress', {inputId:'mouseAngle', angle:angle});
		}


	}

	function showDeathRecap(data)
	{
		if (data.crit)
		{
			$("#deathRecap").html("<label>Killed By <b>" + data.killer + "</b></label><br /><label>Damage: " + data.damageDealt + " crit damage</label>");
		}
		else
		{
			$("#deathRecap").html("<label>Killed By <b>" + data.killer + "</b></label><br /><label>Damage: " + data.damageDealt + " normal damage</label");
		}

		$( "#deathRecap" ).dialog({
			modal: true,
			buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		}
		});

	}

	document.oncontextmenu = function(event)
	{
		event.preventDefault();
	}
	var isStore = true;
	document.addEventListener("DOMContentLoaded", function()
	{
		console.log(window.innerWidth);
		$( function() {
			$( "#tabs" ).tabs();
		} );

		$( function() {
	 		$( ".radioButtons" ).checkboxradio({
		 	icon: false
	 	});
 		} );

		$( function() {
			$( "#accordion" ).accordion({
				active: false,
				collapsible: true
			});
		} );
		console.log("resize");
		resize();
		loadStore();


	});

	function resize()
	{
		var ww = window.innerWidth - 100;
		var wh = window.innerHeight - 50;

		canvas.width = ww;
		canvas.height = wh;

		WIDTH = ww;
		HEIGHT = wh;


		store.move((WIDTH/2) - storeWidth/2, 25);
		gui.move((WIDTH/2)-500, HEIGHT-125);
		healthBar.move((WIDTH/2) - 490, HEIGHT-115);
		healthBarBorder.move((WIDTH/2)-490, HEIGHT-115);
		expBar.move((WIDTH/2)-490, HEIGHT-88);
		expBarBorder.move((WIDTH/2)-490, HEIGHT-88);
		chatInput.move(25, HEIGHT-50);
		chatBorder.move(25, HEIGHT-470);
		console.log(WIDTH + ": " + storeWidth)
		invBtn.move((WIDTH/2) - ((storeWidth/2) - 10) + 305, store.y + 10);
		storeBtn.move((WIDTH/2) - ((storeWidth/2) - 10), store.y + 10);
		sellButton.move(WIDTH/2 + 450, store.y);
		upgradeBtn.move(WIDTH/2 + 150, store.y + 150);

		for (var i = 0; i < elementlist.length; i++)
		{
			elementlist[i].move((WIDTH/2) - ((storeWidth/2) - 10), (i*55) + 80);

		}

		for (var i = 0; i < playerInventory.items.length; i++)
		{
			activeBtns[i].move((WIDTH/2) - ((storeWidth/2) - 10), store.y + 75 + (55 * i));
		}


		for (var i = 0; i < playerInventory.passive.length; i++)
		{
			passiveBtns[i].move((WIDTH/2) - ((storeWidth/2) - 10) , store.y + 330 + (55 * i));
		}

		var count = 0;
		var cols = 0;
		for (var i = 0; i < itemlist.length; i++)
		{
				//storeDiv.innerHTML += "<button onclick=buyItem('"+i+"')>" + Item.list[i].name + ": " + Item.list[i].gold + " Gold </button><br /><label>" + Item.list[i].explain + "</label><br /><hr />";
			itemlist[i].move((WIDTH/2) - ((storeWidth/2) - 10) + (cols * 305), (count*55) + 80);
			count++;
			if (count % 11 == 0)
			{
				cols++;
				count = 0;
			}
		}
		socket.emit("resize", {width:ww, height:wh});
		//console.log(WIDTH + ", " + HEIGHT)

	}

	function Shape(x, y, w, h, fill) {
  		this.x = x || 0;
  		this.y = y || 0;
  		this.w = w || 1;
  		this.h = h || 1;
  		this.fill = fill || '#AAAAAA';
		}
		Shape.prototype.resize = function(w, h)
		{
			this.w = w;
			this.h = h;
		}
		Shape.prototype.move = function(x, y)
		{
			this.x = x;
			this.y = y;
		}
		Shape.prototype.draw = function(ctx, border) {
			if (border)
			{
				drawBorder(this.x, this.y, this.w, this.h, 2);
			}

			ctx.fillStyle = this.fill;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}


	var infoId = -1;
	var infoType = false;
	function Button(txt, ability, strength, weakness, id, item, x, y, w, h) {
  		this.x = x || 0;
  		this.y = y || 0;
  		this.w = w;
  		this.h = h;
		this.txt = txt;
		this.ability = ability;
		this.strength = strength;
		this.weakness = weakness;
		this.id = id;
		this.fill = '#000';
		this.hover = false;
		this.item = item;
		}
		Button.prototype.resize = function(w, h)
		{
			this.w = w;
			this.h = h;
		}
		Button.prototype.move = function(x, y)
		{
			this.x = x;
			this.y = y;
		}
		Button.prototype.draw = function(ctx) {

			//drawBorder(this.x, this.y, this.w, this.h, 2);
			//console.log(this.txt + ": " + this.hover)
			if (this.hover)
			{
				this.fill = '#333';
			}
			else
			{
				this.fill = '#000';
			}
			ctx.fillStyle = this.fill;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.fillStyle = 'white';
			if (this.item)
			{
				drawText(this.txt, this.x + 10, this.y + this.h / 2);
			}
			else
			{
				drawText(this.txt, this.x + this.w / 3, this.y + this.h / 2);
			}

		}
		Button.prototype.getHover = function()
		{

			if (entryCoor.x >= this.x && entryCoor.x <= this.x + this.w)
			{
				if (entryCoor.y >= this.y && entryCoor.y <= this.y + this.h)
				{
					//console.log(this.txt);
					//console.log(this.id);
					this.hover = true;
				}
				else
				{
					this.hover = false;
				}
			}
			else
			{
				this.hover = false;
			}
		}
		Button.prototype.getClick = function()
		{
			if (this.hover && isStore)
			{
				if (this.ability == "upgrade")
				{
					//console.log(Player.list[selfId].gold >= Item.list[this.id].currentGold);
					if (playerInventory.hasItem(this.id, 1) >= 1 && Player.list[selfId].gold >= Item.list[Item.list[this.id].upgrade].currentGold)
					{
						buyItem(Item.list[this.id].upgrade);
						playerInventory.removeItem(this.id, 1, true);
						updateInventoryButtons(this.id);
					}
				}
				else if (this.ability == "sell")
				{
					//console.log(playerInventory.hasItem(this.id, 1))
					if (playerInventory.hasItem(this.id, 1) >= 1)
					{
						playerInventory.removeItem(this.id, 1, true);
						updateInventoryButtons(this.id);
					}
				}
				else
				{
					if (this.id == "store" || this.id == "inventory")
					{

						changeTab(this.id);
					}
					else
					{
						if (this.item == true)
						{
							//console.log(this.id)
							buyItem(this.id);
						}
						else if(this.item == false)
						{
							selectElement(this.id);
						}
					}
				}

			}
		}
		Button.prototype.getInfo = function()
		{
			if (this.hover && isStore)
			{

				if (this.id != "store" && this.id != "inventory")
				{
					if (this.ability == "upgrade")
					{
						infoId = Item.list[this.id].upgrade;
						infoType = this.item;
					}
					else
					{
						infoId = this.id;
						infoType = this.item;
					}

				}
				else
				{
					infoId = -1;
					infoType = false;
				}


			}
		}


	var elementlist = [];
	var itemlist = [];
	function loadStore()
	{
		//console.log(true);
		//storeDiv.innerHTML = "";
		elementlist = [];
		itemlist = [];
		playerInventory.clearInventory();
		var count = 0;
		for (var i in Element.list)
		{

			//new Button(Element.list[i].name, Element.list[i].ability, Element.list[i].strength, Element.list[i].weakness, selectElement(i), (WIDTH / 2), (i * 25) + 25);
			elementlist.push(new Button(Element.list[i].name, Element.list[i].ability, Element.list[i].strength, Element.list[i].weakness, i, false, (WIDTH/2) - ((storeWidth/2) - 10), (count*55) + 80, 150, 50));
			count++;
		}

	}


	function checkForRemainingItems(id)
	{
		var gold = 0;
		for (var i = 0; i < playerInventory.passive.length; i++)
		{
			if (playerInventory.passive[i].id == id)
			{
				gold += Item.list[playerInventory.passive[i].id].currentGold;
			}
		}

		return gold;

	}

	function updateInventoryButtons(id)
	{
		for (var i in activeBtns)
		{
			if (Item.list[activeBtns[i].id].amount == 1)
			{
				activeBtns.splice(i, 1);
			}
		}
		for (var i in passiveBtns)
		{
			if (passiveBtns[i].id == id)
			{
				//if (Item.list[passiveBtns[i].id].amount == 1)
				//{
					passiveBtns.splice(i, 1);
				//}

			}
		}


	}


	function drawText(txt, x, y, font, color)
	{
		ctx.font=font;
		ctx.fillStyle = color;
		var array = [];
		if (txt.includes("<br>"))
		{
			array = txt.split("<br>");
		}
		else
		{
			array[0] = txt;
		}


		var offset = 0;
		var boldText = "";
		var xoffset = 0;
		for (var i = 0; i < array.length; i++)
		{
			if (array[i].includes("<b>") && array[i].includes("</b>"))
			{
				array[i] = array[i].replace("<b>", "");
				array[i] = array[i].replace("</b>", "");
				drawBoldText(array[i], x, y + offset, font);

			}
			else
			{
				ctx.fillText(array[i], x, y + offset);
			}

			offset += 17;
		}

	}
	function drawBoldText(txt, x, y, font)
	{
		ctx.font = "bold " + font;
		ctx.fillText(txt, x, y);
		ctx.font = font;
	}


	var storeWidth = 600;
	var storeHeight = 400;

	var store = new Shape((canvas.width / 2) - storeWidth/2, 25, storeWidth, storeHeight, '#AAAAAA');
	var gui = new Shape((canvas.width/2) - 500, canvas.height - 125, 1000, 125, '#AAAAAA');
	var healthBar = new Shape((canvas.width/2) - 490, canvas.height-115, 550, 25, '#e63900');
	var healthBarBorder = new Shape((canvas.width/2) - 490, canvas.height-115, 550, 25, '#AAAAAA');
	var expBar = new Shape((canvas.width/2) - 490, canvas.height-88, 400, 15, '#66ff99');
	var expBarBorder = new Shape((canvas.width/2) - 490, canvas.height-88, 400, 15, '#AAAAAA');
	var chatInput = new Shape(0, 0, 400, 25, '#fff');
	var chatBorder = new Shape(0, 0, 400, 400, '#fff');

	//GUI - Healthbars and score

	var isHover = false;
	var healthText = "";


	function drawGUI()
	{
		if (window.innerHeight >= 925)
		{
			gui.draw(ctx, false);


			healthBarBorder.draw(ctx, true);
			expBarBorder.draw(ctx, true);
			healthBar.draw(ctx, false);
			drawText(healthText, (canvas.width/2)-245, canvas.height-95, "20px Arial", 'black');
			expBar.draw(ctx, false);
			drawText(levelVal + " ("+expVal+"/"+expMaxVal+")", ((canvas.width/2) - 85), canvas.height-74, "15px Arial", 'black');
			drawStats();

			//drawScoreText();
		}
		else
		{
			if (!isStore)
			{
				gui.draw(ctx, false);


				healthBarBorder.draw(ctx, true);
				expBarBorder.draw(ctx, true);
				healthBar.draw(ctx, false);
				drawText(healthText, (canvas.width/2)-245, canvas.height-95, "20px Arial", 'black');
				expBar.draw(ctx, false);
				drawText(levelVal + " ("+expVal+"/"+expMaxVal+")", ((canvas.width/2) - 85), canvas.height-74, "15px Arial", 'black');
				drawStats();


			}
		}
		drawChat();
		drawScoreText();

	}

	var drawChatBody = false;


	function drawChat()
	{
		if (window.innerWidth >= 1880)
		{
			chatInput.draw(ctx, true);
		}
		else
		{
			if (inChat)
			{
				chatInput.draw(ctx, true);
			}
		}


		if (inChat)
		{
			drawChatBody = true;

		}

		if (drawChatBody)
		{
			chatBorder.draw(ctx, true);
			ctx.fillStyle = 'black';
			for(var i = 0; i < chatArr.length; i++)
			{

				drawText(chatArr[i], 35, HEIGHT-(i*25)-75);
			}
			if (inChat == false)
			{
				setTimeout(function()
				{
					drawChatBody = false;
				}, 2000);
			}

		}


		drawText(chatText, 25, HEIGHT - 26);

	}



	function drawScoreText()
	{
		if (window.innerHeight >= 930)
		{
			drawText("Blue Team: " + Math.round(team2ScoreVal), ((canvas.width/2) - 85), canvas.height - 50, "20px Arial", 'blue');
			drawText("Red Team: " + Math.round(team1ScoreVal), (canvas.width/2) - 85, canvas.height - 25, "20px Arial", 'red');
			drawText(killDeathVal, canvas.width - 200, 30, "20px Arial", 'black');
			drawText(goldVal, canvas.width - 150, 50, "20px Arial", 'black');
		}
		else {
			if (!isStore)
			{
				drawText("Blue Team: " + Math.round(team2ScoreVal), ((canvas.width/2) - 85), canvas.height - 50, "20px Arial", 'blue');
				drawText("Red Team: " + Math.round(team1ScoreVal), (canvas.width/2) - 85, canvas.height - 25, "20px Arial", 'red');
				drawText(killDeathVal, canvas.width - 200, 30, "20px Arial", 'black');
				drawText(goldVal, canvas.width - 150, 50, "20px Arial", 'black');
			}
		}
	}
	function drawStats()
	{
		var fnt = "17px Arial";

		if(selfId)
		{
			var stats = Player.list[selfId].stats;

			drawText("Attack: " + stats.attack, ((canvas.width/2) - 490), canvas.height-55, fnt, 'black');
			drawText("Armor: " + stats.armor, ((canvas.width/2) - 490), canvas.height-40, fnt, 'black');
			drawText("Attack Speed: " + stats.attackSpd, ((canvas.width/2) - 490), canvas.height-25, fnt, 'black');
			drawText("Life Regen: " + stats.lifeRegen, ((canvas.width/2) - 490), canvas.height-10, fnt, 'black');

			drawText("Armor Penetration: " + stats.lethality, ((canvas.width/2) - 270), canvas.height-55, fnt, 'black');
			drawText("Critical Chance: " + stats.crit, ((canvas.width/2) - 270), canvas.height-40, fnt, 'black');
			drawText("Movement Speed: " + Player.list[selfId].movementSpd, ((canvas.width/2) - 270), canvas.height-25, fnt, 'black');
			drawText("Life Steal: " + stats.lifeSteal, ((canvas.width/2) - 270), canvas.height-10, fnt, 'black');
		}

	}
	var isBottom = false;




	//Store

	function showStore()
	{
		switch(isStore)
		{
			case true:
				isStore = false;
			break;
			case false:
				isStore = true;
			break;
		}

	}
	function drawBorder(xPos, yPos, width, height, thickness)
	{
		ctx.fillStyle='#000';
		ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
	}
	console.log("Beg: " + (window.innerWidth - 100) + ": " + storeWidth)
	var invBtn = new Button("Inventory", null, null, null, "inventory", null, ((window.innerWidth - 100)/2) - 590 + 305, store.y + 10, 150, 35);
	var storeBtn = new Button("Store", null, null, null, "store", null, ((window.innerWidth - 100)/2) - 590, store.y + 10, 150, 35);


	var currentTab = "store";
	function changeTab(toChange)
	{
		currentTab = toChange;

	}

	var activeBtns = [];
	var passiveBtns = [];
	var sellButton = new Button("Sell ", null, null, null, -1, null, ((window.innerWidth - 100)/2) - 590 + 305, store.y + 10, 150, 35);
	var upgradeBtn = new Button("", null, null, null, -1, true, ((window.innerWidth - 100)/2) - 590 + 305, store.y + 10, 300, 50);
	function drawStore()
	{
		if (isStore)
		{
			store.draw(ctx, true);
			ctx.strokeStyle='black';


			//console.log(buttonlist.length)
			if (drawElements)
			{
				ctx.font = "20px Arial";
				ctx.fillStyle = 'black';
				drawText("Choose an Element!", store.x + 5, store.y + 20);
				ctx.moveTo(WIDTH/2 - 110, 25);
				ctx.lineTo(WIDTH/2 - 110, 400);
				ctx.stroke();
				for (var i = 0; i < elementlist.length; i++)
				{
					elementlist[i].draw(ctx);

				}
				ctx.fillStyle = 'black';
				ctx.font = "20px Arial";
				if (infoId == -1)
				{
					drawText("Left click for info.<br>Right click to select", WIDTH/2 + 10, 50);
				}
				else
				{
					ctx.font = "25px Arial";
					drawText(Element.list[infoId].name + ": " + Element.list[infoId].ability, WIDTH/2 - 100, 50);
					ctx.font = "20px Arial";
					ctx.moveTo(WIDTH/2-110, 60);
					ctx.lineTo(store.x + store.w, 60);
					ctx.stroke();
					drawText("Lore: " + Element.list[infoId].lore, WIDTH/2 - 100, 80);
					drawText("Ability: " + Element.list[infoId].ability, WIDTH/2 - 100, 150);
					drawText("Strength: Deal +damage against " + Element.list[infoId].strength, WIDTH/2 - 100, 180);
					drawText("Weakness: Take +damage from " + Element.list[infoId].weakness, WIDTH/2 - 100, 210);
					switch(Element.list[infoId].name)
					{
						case "Fire":
							ctx.drawImage(Img.fire, WIDTH/2, 240);
						break;
						case "Lightning":
							ctx.drawImage(Img.lightning, WIDTH/2, 240);
						break;
						case "Water":
							ctx.drawImage(Img.water, WIDTH/2, 240);
						break;
						case "Earth":
							ctx.drawImage(Img.earth, WIDTH/2, 240);
						break;
						case "Wind":
							ctx.drawImage(Img.wind, WIDTH/2, 240);
						break;
					}


				}

			}
			else
			{
				ctx.font = "20px Arial";
				ctx.fillStyle = 'black';
				//drawText("Store", store.x + store.w / 4, store.y + 20);
				storeBtn.draw(ctx);
				//drawText("Store", store.x + store.w / 4, store.y + 20);
				invBtn.draw(ctx);
				ctx.moveTo(WIDTH/2 + 30, 25);
				ctx.lineTo(WIDTH/2 + 30, 700);
				ctx.stroke();
				if(currentTab == "store")
				{
					for (var i = 0; i < itemlist.length; i++)
					{
						itemlist[i].draw(ctx);
					}

				}
				else if (currentTab == "inventory")
				{
					ctx.fillStyle = "black";

					drawText("<b>Active Items</b>",  store.x + store.w/4 - 150, store.y + 60)

					for (var i = 0; i < activeBtns.length; i++)
					{
						activeBtns[i].draw(ctx);

					}
					drawText("<b>Passive Items</b>",   store.x + store.w/4 - 150, store.y + 310)
					for (var i = 0; i < passiveBtns.length; i++)
					{
						passiveBtns[i].draw(ctx);
						//console.log(passiveBtns[i].txt + ": "  + passiveBtns[i].hover);
					}



					//Stats
					if(selfId)
					{
						ctx.fillStyle = "black";
						var stats = Player.list[selfId].stats;
						if (armorValue == null)
						{
							var armor = "Undetermined ";
						}
						else
						{
							var armor = armorValue.toFixed(2) * 100;
						}
						if (lethalityValue == null)
						{
							var lethalityArmor = "Undetermined ";
						}
						else
						{
							var lethalityArmor = 100 - (((lethalityValue - stats.lethality) / lethalityValue) * 100).toFixed(2);
						}
						//console.log(lethalityArmor + "; " + stats.lethality);
						var damage = (stats.attack * stats.attack) / (stats.attack + 0);
						var attackSpdMs = (40 * (stats.attackSpd))
						var attackSpdSec = attackSpdMs / 1000;

						var critDam = ((damage * 150) / 100);
						var extraDam = critDam * (stats.critDam / 100);

						var critDif = (critDam + extraDam) - damage;

						var movementSpd = Player.list[selfId].movementSpd;
						var mapTime = ((3200 / movementSpd) * 40) / 1000;
						mapTime = mapTime.toFixed(2);
						var lifeStealAmt = damage * (stats.lifeSteal / 100);
						var critLifeAmt = critDam * (stats.lifeSteal / 100);

						var lifeRegenExtra = 2 * (stats.lifeRegen / 100);
						var lifeRegen = 2 + lifeRegenExtra;


						drawText("Attack: " + stats.attack, WIDTH/2 + 40, 300);
						ctx.font = "17px Arial";
						drawText(" - You deal " + damage + " (+"+stats.elementalDamage+" against weak elements) attack damage.", WIDTH/2 + 40, 320);
						ctx.font = "20px Arial";
						drawText("Armor: " + stats.armor, WIDTH/2 + 40, 340);
						ctx.font = "17px Arial";
						drawText(" - You negated " + armor + "% of damage on the last hit.", WIDTH/2 + 40, 360);
						ctx.font = "20px Arial";
						drawText("Attack Speed: " + stats.attackSpd, WIDTH/2 + 40, 380);
						ctx.font = "17px Arial";
						drawText(" - Shoot 1 bullet every " + attackSpdSec + " (" + attackSpdMs +"ms)", WIDTH/2 + 40, 400);
						ctx.font = "20px Arial";
						drawText("Life Regen: " + stats.lifeRegen + "%", WIDTH/2 + 40, 420);
						ctx.font = "17px Arial";
						drawText(" - You heal " + lifeRegen + " hp (+" + stats.lifeRegen +"%) every second.", WIDTH/2 + 40, 440);
						ctx.font = "20px Arial";
						drawText("Armor Penetration: " + stats.lethality, WIDTH/2 + 40, 460);
						ctx.font = "17px Arial";
						drawText(" - You negate " + lethalityArmor + "% of the enemies armor.", WIDTH/2 + 40, 480);
						ctx.font = "20px Arial";
						drawText("Critical Chance: " + stats.crit + "%", WIDTH/2 + 40, 500);
						ctx.font = "17px Arial";
						drawText(" - You have a " + stats.crit + "% chance to deal " + critDam + " (+" + critDif +") damage", WIDTH/2 + 40, 520);
						ctx.font = "20px Arial";
						drawText("Movement Speed: " + Player.list[selfId].movementSpd, WIDTH/2 + 40, 540);
						ctx.font = "17px Arial";
						drawText(" - You can travel across the map in " + mapTime + " seconds", WIDTH/2 + 40, 560);
						ctx.font = "20px Arial";
						drawText("Life Steal: " + stats.lifeSteal + "%", WIDTH/2 + 40, 580);
						ctx.font = "17px Arial";
						drawText(" - You heal " + stats.lifeSteal + "% (+"+lifeStealAmt +"/"+critLifeAmt+") of your damage on attack.", WIDTH/2 + 40, 600);

					}
				}


					ctx.fillStyle = 'black';
					//console.log(infoId);
					ctx.font = "20px Arial";
					if (infoId == -1)
					{
						drawText("Left click for info.<br>Right click to select", WIDTH/2 + 40, 50);
					}
					else if (infoId != -1)
					{
						ctx.font = "25px Arial";
						//console.log(infoId);
						var amt = 0;


						for (var a = 0; a < playerInventory.items.length; a++)
						{
							if (playerInventory.items[a].id == infoId)
							{
								amt = playerInventory.items[a].amount;
								break;
							}
						}
						for (var a = 0; a < playerInventory.passive.length; a++)
						{
							if (playerInventory.passive[a].id == infoId)
							{
								amt = playerInventory.passive[a].amount;
								break;
							}
						}
						if (currentTab == "store")
						{
							drawText(Item.list[infoId].name + ": " + Item.list[infoId].currentGold + " Gold", WIDTH/2 + 40, 50);
						}
						else if (currentTab == "inventory")
						{
							drawText(Item.list[infoId].name + ": " + amt + "x", WIDTH/2 + 40, 50);
						}



						ctx.font = "20px Arial";
						ctx.moveTo(WIDTH/2 + 30, 60);
						ctx.lineTo(store.x + store.w, 60);
						ctx.stroke();
						//drawText("Lore: " + Element.list[infoId].lore, WIDTH/2 - 100, 80);
						drawText("Type: " + Item.list[infoId].type, WIDTH/2 + 40, 80);
						drawText("Ability: " + Item.list[infoId].explain, WIDTH/2 + 40, 110);
						if (playerInventory.hasItem(infoId, 1) >= 1 && Item.list[infoId].upgrade != null)
						{
							drawText("Upgrade: ", WIDTH/2 + 150, store.y + 140);

							upgradeBtn.txt = Item.list[Item.list[infoId].upgrade].name + ": " + Item.list[Item.list[infoId].upgrade].currentGold + " Gold";
							upgradeBtn.id = infoId;
							upgradeBtn.ability = "upgrade";
							upgradeBtn.draw(ctx);

						}




						if (currentTab == "inventory" && playerInventory.hasItem(infoId, 1) >= 1)
						{
							sellButton.ability = "sell";
							sellButton.id = infoId;
							sellButton.txt = "Sell +" + Math.round(Item.list[infoId].gold * 0.75);
							sellButton.draw(ctx);
						}
					}


			}


		}

	}
