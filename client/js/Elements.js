//*******Elements**********
Element = function(name, health, attack, armor, attackSpd, critChance, lifeRegen, strength, weakness, event, lore)
{
	var self =
	{
		name:name,
		health:health, 
		attack:attack, 
		armor:armor, 
		attackSpd:attackSpd, 
		critChance:critChance, 
		lifeRegen:lifeRegen,
		strength:strength,
		weakness:weakness,
		event:event,
		lore:lore
	}
	//console.log(name);
	Element.list[self.name] = self;
	return self;
}
Element.list = {};


Element("Water", 1500, 7, 0, 5, 0, 5, "Fire", "Lightning", function()
{
		
	socket.emit("updateMaxHp", {playerId:selfId, amount:500, type:"up"});
	socket.emit("updateStats", {playerId:selfId, stat:"lifeRegen", type:"up", amount:2});
}, "Water mages are kind and<br>gentle. They are all about life and<br>peace!");


Element("Lightning", 1000, 5, 0, 5, 25, 0, "Water", "Wind", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"crit", type:"up", amount:25});
	socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"down", amount:2});
}, "Lightning mages are brutal.<br>Their extra damage makes them<br>great assassins for picking off the weak");


Element("Earth", 1000, 7, 10, 6, 0, 0, "Wind", "Fire", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"armor", type:"up", amount:10});
	socket.emit("updateStats", {playerId:selfId, stat:"attackSpd", type:"down", amount:1});
}, "Earth mages are slow, tough and<br>vigilant. They fulfill their duties<br>head on and are usually the front lines.");

Element("Fire", 900, 17, 0, 5, 0, 0, "Earth", "Water", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"attack", type:"up", amount:10});
	socket.emit("updateMaxHp", {playerId:selfId, amount:100, type:"down"});
}, "Fire mages value destruction<br>and cruelty. They are the fighters<br>that destroy their enemies.");

Element("Wind", 900, 7, 0, 4, 0, 0, "Lightning", "Earth", function()
{
	socket.emit("updateStats", {playerId:selfId, stat:"attackSpd", type:"up", amount:1});
	socket.emit("updateMaxHp", {playerId:selfId, amount:100, type:"down"});
}, "Wind mages value knowledge<br> and control. They rely on taking<br>out the enemy as fast as possible.");

