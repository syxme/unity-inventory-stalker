#pragma strict
var Icon:Texture2D;
var rorat=5.1;
var player:Transform;
function Start () {

}

function Update () {

}
function OnGUI(){
	rorat = player.rotation.eulerAngles.y;
	var centre = Vector2(Icon.width/2 ,Icon.height/2);
//	var savedMatrix = GUI.matrix;
	var needleAngle = Mathf.Lerp(-90, 90, rorat/100);
	GUIUtility.RotateAroundPivot(rorat, centre);
	GUI.DrawTexture(Rect(centre.x/2-64,centre.y/2-64,Icon.width,Icon.height),Icon);
//	GUI.matrix = savedMatrix;
}
function ObjectActive(){};
function ObjectDeactive(){};