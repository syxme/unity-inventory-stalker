static var sleepTime:float;
static var foodTime:float;
static var maxPower:float;
static var heartLevel:float;
var stdArmor:float;
static var andArmor:float;
static var atrArmor:float;
static var Armor:float;


function Start () {
	sleepTime = 300;
	foodTime = 200;
	heartLevel = 457;
}

function Update () {
	sleepTime -=0.2*Time.deltaTime; 
	foodTime -=0.8*Time.deltaTime;
	Armor = stdArmor + andArmor + atrArmor;
	if (sleepTime>800)
		sleepTime = 800;
	if (foodTime>300)
		foodTime = 300;
	if (heartLevel>1000)
		heartLevel = 1000;
}
