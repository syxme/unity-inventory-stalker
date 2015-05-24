#pragma strict
var CameraR:Transform;
private var vert:float;
private var hori:float;
var i = -1.0;
private var p =1.3;
private var RotateZ= 0.0;
private var prepos = 0.0;
var paden = false;

function Update () {
	CameraR.transform.localEulerAngles = new Vector3(CameraR.transform.localEulerAngles.x,CameraR.transform.localEulerAngles.y,RotateZ);
	var controller : CharacterController = GetComponent(CharacterController);
	if ((Input.GetAxis("Vertical")||Input.GetAxis("Horizontal"))&&!paden&&controller.velocity.magnitude >2){
		if (controller.velocity.magnitude >6)
			i +=12.2*Time.deltaTime;
		else
			i +=7.2*Time.deltaTime;
		CameraR.transform.localPosition.y=1+(Mathf.Sin(Mathf.PI/2*i))*0.1;		
		if (i>3)i=-1;	
	}


	if (controller.velocity.magnitude > 20)
		paden = true;
	else{
		if (paden){
			CameraR.transform.localPosition.y=(0.1+(Mathf.Sin(2.1*p)))*0.55 +0.18;
		 	p+=7*Time.deltaTime;
			if (p>3.77){
				paden = false;
				p = 1.3;
				i = 0.83;
			}
		}
	}
	
	
	
}
// Vector3.Lerp (
//        transform.position, target.position,
 //       Time.deltaTime * smooth)