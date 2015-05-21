class weaponSound{
	var shot:AudioClip[];
	var reload:AudioClip;
	var draw:AudioClip;
	var down:AudioClip;
	var empty:AudioClip;
}
var Audio:weaponSound;
var ActorCamera:Transform;
var decalPrefab:Transform;


var maxAmmunition = 30 ;
var animMesh:Animation;
var show = false;
var shotDelay = 0.1;
var indexAmmunition = 30;
private var nextFire = 0.0;
private var reloader = false;


//animMesh.FindChild("mesh");

function Start(){
	var Inventory=FindObjectOfType(Inventory);
	indexAmmunition = Inventory.APIGetActivesData(1,1);
	ActorCamera = Camera.main.transform; show = false; 
	showhide();
	
}

function reload(){
	var Inventory=FindObjectOfType(Inventory);
	var baseAmmunition = Inventory.APIgetItemCount("ptrAKM");
	if (baseAmmunition>0){
		animMesh["reload"].speed = 1.5;
		animMesh.Play("reload");
		audio.clip = Audio.reload;
		reloader = true;
		yield WaitForSeconds (0.6);
		audio.Play();		
		if (baseAmmunition>maxAmmunition){
			indexAmmunition = maxAmmunition;
			Inventory.APIeditItemCount("ptrAKM",baseAmmunition - maxAmmunition);
		}else{
			indexAmmunition = baseAmmunition;
			Inventory.APIeditItemCount("ptrAKM",baseAmmunition - baseAmmunition);
		}
	}
}


function showhide(){
	var Inventory=FindObjectOfType(Inventory);
	if(!show) {
		animMesh.Play("up");
		audio.clip = Audio.down;
		audio.Play();
		yield WaitForSeconds (0.3);
		audio.clip = Audio.draw;
		audio.Play();
		yield WaitForSeconds (0.5);
		show = !show;
		indexAmmunition = Inventory.APIGetActivesData(1,1);
	}else{
		Inventory.APISetActivesData(1,1,indexAmmunition);
		animMesh.Play("down");
		
		show = !show;
		audio.clip = Audio.down;
		audio.Play();
	}
}


function Ammunition ():boolean{
	if (indexAmmunition>0){
		indexAmmunition--;
		
		return true;
	}else{
		audio.clip = Audio.empty;
		audio.Play();
		return false;
	}
}


function shot(){
	var Inventory=FindObjectOfType(Inventory);
	var hit : RaycastHit; 
	var dir =ActorCamera.TransformDirection(Vector3(0,0,1));
	if (!Physics.Raycast (ActorCamera.position,dir, hit)) 
		return;
	if (Input.GetButton ("Fire1") && Time.time > nextFire && !reloader &&show) {
		nextFire = Time.time + shotDelay;
		if (Ammunition()){
			//ActorCamera.rotation.eulerAngles.x+=0.1; 
			DecalGen(hit.point, hit.normal, hit.collider,dir); 
			audio.clip = Audio.shot[Random.Range(0, Audio.shot.length)];
			animMesh.Stop("shot");
			animMesh["shot"].speed = 1.5;
			animMesh.Play("shot");
			audio.Play();
		}else{
			reload();
		}
	}
	
	if (reloader){
		if (!animMesh.isPlaying){
			reloader = !reloader;
		  }
	}
	
	
}

function Update () {
if (!gameControl.ActivateGUI){
	shot();
}
	var controller=FindObjectOfType(CharacterController);

	  if (controller.isGrounded && controller.velocity.magnitude > 3.8&&!Input.GetButton ("Fire1")&&show&& !reloader ) {
			animMesh.CrossFade("walk");
		}else if (!reloader&&show)
			animMesh.CrossFade("idle");
		
	if (Input.GetKeyUp("3")){
		showhide(); 
	}

}


function DecalGen(p:Vector3,n:Vector3,c:Collider,dir:Vector3){
	var decalInst:GameObject;
	var decalInst2:Transform;
	decalInst=Instantiate(decalPrefab, p, Quaternion.FromToRotation(Vector3.up, n))as GameObject ; 
	if (c.gameObject.tag == "wmDecal")
		Destroy(c.gameObject);
	if (c.gameObject.rigidbody){
		c.gameObject.rigidbody.AddForce (dir * 320);
	}else{
		//
	}
}