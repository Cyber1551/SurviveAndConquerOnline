

Inventory = function()
{
	var self = {
		items:[], //{id:"itemId", amount:1}
		passive:[],
		invSize:0
	}
	self.addItem = function(id, amount, gold, type)
	{
		//console.log(Player.list[selfId].elementType);
		if (Player.list[selfId].gold >= gold)
		{
			self.invSize++;
			for (var i = 0; i < self.items.length; i++)
			{
				if (type == "active")
				{
					if (self.items[i].id === id)
					{
					//Player.list[selfId].gold -= gold;
						socket.emit('updateGold', {amount: gold, playerId: selfId, type:"down"});
						self.items[i].amount += amount;
						//self.invSize++;
						self.refreshRender();
						return;
					}

				}


			}
			for (var i = 0; i < self.passive.length; i++)
			{
				//console.log(1)
				if (type == "passive")
				{
					if (self.passive[i].id === id)
					{
						socket.emit('updateGold', {amount: gold, playerId: selfId, type:"down"});
						self.passive[i].amount += amount;
						//self.invSize++;
						
						
						Item.list[id].event();

						self.refreshRender();
						return;
					}

				}

			}
			if (type == "active")
			{
				socket.emit('updateGold', {amount: gold, playerId: selfId, type:"down"});
				self.items.push({id:id, amount:amount});
			}
			if (type == "passive")
			{

				socket.emit('updateGold', {amount: gold, playerId: selfId, type:"down"});
				self.passive.push({id:id, amount:amount});
				Item.list[id].event();
			}

			//self.items.push({id:id, amount:amount});
			self.refreshRender();
		}

	}
	self.removeItem = function(id, amount, sell)
	{
		//console.log(Player.list[selfId].elementType);
		for (var i = 0; i < self.items.length; i++)
		{
			if (self.items[i].id === id)
			{
				self.invSize--;
				if(sell)
				{
					socket.emit('updateGold', {amount: Math.round(Item.list[id].gold * 0.75), playerId: selfId, type:"up"});
				}
				for (var b = 0; b < activeBtns.length; b++)
				{
					if (activeBtns[b].id === id)
					{
						activeBtns.splice(b, 1);
						break;
					}
				}
				self.items[i].amount -= amount;
				self.refreshRender();
					//self.invSize--;
				if(self.items[i].amount <= 0)
				{
					self.items.splice(i, 1);
					
					self.refreshRender();
					return;
				}
			
			}
		}
		for (var i = 0; i < self.passive.length; i++)
		{
			if (self.passive[i].id === id)
			{
				self.invSize--;
				if(sell)
				{
					socket.emit('updateGold', {amount: Math.round(Item.list[id].gold * 0.75), playerId: selfId, type:"up"});
				}
		
					self.passive[i].amount -= amount;
					
					Item.list[self.passive[i].id].sellFunc();
					for (var b = 0; b < passiveBtns.length; b++)
					{
						if (passiveBtns[b].id == id)
						{
							passiveBtns.splice(b, 1);
							break;
						}
					}
					
					self.refreshRender();
					//self.invSize--;
					if(self.passive[i].amount <= 0)
					{
						self.passive.splice(i, 1);
						
						self.refreshRender();
						return;
					}
				}
				
		}
		
	}
	self.hasItem = function(id, amount)
	{
		var amt = 0;
		for (var i = 0; i < self.items.length; i++)
		{
			if (self.items[i].id === id)
			{
				if (self.items[i].amount >= amount)
				{
					amt = self.items[i].amount;
					break;
				}
			}
		}
		for (var i = 0; i < self.passive.length; i++)
		{
			if (self.passive[i].id === id)
			{
				if (self.passive[i].amount >= amount)
				{
					amt = self.passive[i].amount;
					break;
				}
			}
		}
		return amt;
		
		return false;
	}
	self.clearInventory = function()
	{
		self.items = [];
		self.passive = [];
		self.refreshRender();
	}
	/*self.refreshRender = function()
	{
		var str = "<b>Active Items</b><br />";

		for (var i = 0; i < self.items.length; i++)
		{
			let item = Item.list[self.items[i].id];
			//let use = "Item.list['" + item.id + "'].event()";
			str += item.name + " x" + self.items[i].amount + "<br />";
		}
		str += "<b>Passive Items</b><br />";
		for (var i = 0; i < self.passive.length; i++)
		{
			let item = Item.list[self.passive[i].id];
			//let use = "Item.list['" + item.id + "'].event()";
			str += item.name + " x" + self.passive[i].amount + "<br />";
		}
		document.getElementById("inventory").innerHTML = str;
	}*/
	self.refreshRender = function()
	{
		var str = "<b>Active Items</b><br>";

		for (var i = 0; i < self.items.length; i++)
		{
			let item = Item.list[self.items[i].id];
			//let use = "Item.list['" + item.id + "'].event()";
			str += item.name + " x" + self.items[i].amount + "<br>";
		}
		var str1 = "<b>Passive Items</b><br>";
		for (var i = 0; i < self.passive.length; i++)
		{
			let item = Item.list[self.passive[i].id];
			//let use = "Item.list['" + item.id + "'].event()";
			str1 += item.name + " x" + self.passive[i].amount + "<br>";
		}
		//console.log(window.innerHeight)
		if (window.innerHeight >= 930)
		{
			drawText(str, (canvas.width / 2) + 100, canvas.height - 100, "17px Arial", 'black');
			drawText(str1, (canvas.width / 2) + 250, canvas.height - 100, "17px Arial", 'black');
		}
		else
		{
			if (!isStore)
			{
				drawText(str, (canvas.width / 2) + 100, canvas.height - 100, "17px Arial", 'black');
				drawText(str1, (canvas.width / 2) + 250, canvas.height - 100, "17px Arial", 'black');
			}

		}


	}
	return self;
}


Item = function(id, name, gold, type, event, explain, sellFunc, upgrade, showInStore)
{
	var self =
	{
		id:id,
		name:name,
		gold:gold,
		type:type,
		event:event,
		explain:explain,
		sellFunc:sellFunc,
		upgrade:upgrade,
		showInStore:showInStore
	}
	self.currentGold = self.gold;
	//console.log(self.name + ": " + self.currentGold);
	Item.list[self.id] = self;
	return self;
}
Item.list = {};


//Active Items

Item("potion", "Potion", 40, "active", function()
{

	playerInventory.removeItem("potion", 1, false);
	socket.emit("increaseHP", {amount: 100, playerId:Player.list[selfId].id});

}, "+100 health on use!",  null, true);

Item("overclock", "OverClock", 200, "active", function()
{
	if (Player.list[selfId].overclocked == false && Player.list[selfId].stats.armor >= 10)
	{
		playerInventory.removeItem("overclock", 1, false);
		Player.list[selfId].overclocked = true;
		socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"up", amount:10});
		socket.emit("updateStats", {playerId:selfId, stat:"armor", type:"down", amount:10});
		setTimeout(function()
		{
			socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"down", amount:10});
			socket.emit("updateStats", {playerId:selfId, stat:"armor", type:"up", amount:10});
			Player.list[selfId].overclocked = false;
		}, 10000);
	}


}, "**Limit 1<br>+10 Attack Damage!<br>-10 Armor!<br>Lasts 10 Seconds",  null, true);
Item("return", "Return", 25, "active", function()
{
	socket.emit("setCanMove", {playerId:selfId, count:false, value: false});
	setTimeout(function()
	{

		playerInventory.removeItem("return", 1, false);
		socket.emit("setCanMove", {playerId:selfId, count:false, value: true});
		socket.emit("teleportToBase", {selfId: selfId});
	}, 3000);

}, "**Limit 1<br>Wait 3 seconds to be teleported back to base!",  null, true);



//Passive Items

Item("boots", "Basic Boots", 50, "passive", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"movement", type:"up", amount:2});

}, "**Limit 1<br>+2 Movement Speed", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"movement", type:"down", amount:2});
}, null, true);

Item("basicattackgem", "Basic Attack Gem", 100, "passive", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"up", amount:6});

}, "+6 Attack Damage!", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"down", amount:6});

}, "mediumattackgem", true);

Item("mediumattackgem", "Medium Attack Gem", 240, "passive", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"up", amount:15});

}, "+15 Attack Damage!", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"down", amount:15});

}, "largeattackgem", false);
Item("largeattackgem", "Large Attack Gem", 500, "passive", function()
{
	//socket.emit("updateStats", {playerId:selfId, stat:"lethality", type:"up", amount:5});
	socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"up", amount:35});

}, "+35 Attack Damage!", function()
{
	//socket.emit("updateStats", {playerId:selfId, stat:"lethality", type:"down", amount:5});
	socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"down", amount:35});

}, null, false);

Item("supplybelt", "Supply Belt", 150, "passive", function()
{

	socket.emit("updateMaxHp", {playerId:selfId, amount:250, type:"up"});

}, "+250 Maximum Health!", function()
{

	socket.emit("updateMaxHp", {playerId:selfId, amount:250, type:"down"});

}, "gsupplybelt", true);

Item("gsupplybelt", "Giant Supply Belt", 200, "passive", function()
{
	socket.emit("updateMaxHp", {playerId:selfId, amount:500, type:"up"});

}, "+500 Maximum Health!", function()
{
	socket.emit("updateMaxHp", {playerId:selfId, amount:500, type:"down"});

}, null, false);

Item("basicarmor", "Basic Armor", 50, "passive", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"armor", type:"up", amount:5});

}, "+5 Armor!", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"armor", type:"down", amount:5});

}, "mediumarmor", true);

Item("mediumarmor", "Medium Armor", 135, "passive", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"armor", type:"up", amount:10});

}, "+10 Armor!", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"armor", type:"down", amount:10});

}, null, false);
Item("basiclethality", "Basic Lethality", 125, "passive", function()
{
	//console.log("bought");
	socket.emit("updateStats", {playerId:selfId, stat:"lethality", type:"up", amount:5});

}, "+5 Armor Penetration!", function()
{
	//console.log("bought");
	socket.emit("updateStats", {playerId:selfId, stat:"lethality", type:"down", amount:5});

}, "mediumlethality", true);

Item("mediumlethality", "Medium Lethality", 225, "passive", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"lethality", type:"up", amount:10});

}, "+10 Armor Penetration!", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"lethality", type:"down", amount:10});

}, null, false);

Item("feather", "Feather", 100, "passive", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"attackSpd", type:"up", amount:0.2});

}, "+0.2 Attack Speed", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"attackSpd", type:"down", amount:0.5});

}, null, true);

Item("basicelectricgem", "Basic Electric Gem", 80, "passive", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"crit", type:"up", amount:10});
	//console.log(Player.list[selfId].elementType);
}, "+10 Critical chance", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"crit", type:"down", amount:10});
	//console.log(Player.list[selfId].elementType);
}, "mediumelectricgem", true);

Item("mediumelectricgem", "Medium Electric Gem", 230, "passive", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"crit", type:"up", amount:30});

}, "+30 Critical chance", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"crit", type:"down", amount:30});

}, "largeelectricgem", false);
Item("largeelectricgem", "Large Electric Gem", 350, "passive", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"crit", type:"up", amount:25});
	socket.emit("updateStats", {playerId:selfId, stat:"critDam", type:"up", amount:50});

}, "+25 Critical chance<br>+50% bonus critical damage", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"crit", type:"down", amount:25});
	socket.emit("updateStats", {playerId:selfId, stat:"critDam", type:"down", amount:50});

}, null, false);

Item("basichealinggem", "Basic Healing Gem", 80, "passive", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeSteal", type:"up", amount:12});

}, "+12% Life Steal", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeSteal", type:"down", amount:12});

}, "mediumhealinggem", true);

Item("mediumhealinggem", "Medium Healing Gem", 150, "passive", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeSteal", type:"up", amount:24});

}, "+24% Life Steal", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeSteal", type:"down", amount:24});

}, "largehealinggem", false);
Item("largehealinggem", "Large Healing Gem", 310, "passive", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeSteal", type:"up", amount:50});

}, "+50% Life Steal", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeSteal", type:"down", amount:50});

}, null, false);
Item("basicruby", "Basic Ruby", 250, "passive", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeRegen", type:"up", amount:200});

}, "+200% Life Regen!", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeRegen", type:"down", amount:200});

}, "mediumruby", true);
Item("mediumruby", "Medium Ruby", 450, "passive", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeRegen", type:"up", amount:400});

}, "+400% Life Regen!", function()
{

	socket.emit("updateStats", {playerId:selfId, stat:"lifeRegen", type:"down", amount:400});

}, null, false);
