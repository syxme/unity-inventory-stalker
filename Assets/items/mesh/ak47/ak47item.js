#pragma strict
var cameraTransform: Transform;

var insertScene:GameObject;
private var ins:GameObject;
private var destroy = false;
function Start () {
  cameraTransform = Camera.main.transform; 
}

function ObjectActive(){
		ins = Instantiate(insertScene,Vector3(0, 0, 0), Quaternion.identity);
		cameraTransform = Camera.main.transform; 
		ins.transform.parent = cameraTransform;
		ins.transform.localPosition = Vector3(0,0.02,-0.2);
		ins.transform.localEulerAngles =  new Vector3(0,6,0);
}
function ObjectDeactive(){
	ins.SendMessage("showhide");
	Destroy(ins,0.3);
}