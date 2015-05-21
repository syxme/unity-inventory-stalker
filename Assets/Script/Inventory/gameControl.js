static var ActivateGUI:boolean = false;
static var actorMoney:float = 5000;
function OnGUI(){
GUI.Label(Rect(10,10,100,55), "actorMoney:"+actorMoney.ToString());
GUI.Label(Rect(10,30,100,55), "STATUS:"+ActivateGUI.ToString());
}