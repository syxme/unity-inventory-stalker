var Metal : AudioClip[];
var Wood : AudioClip[];
var Brush : AudioClip[];
var Grass : AudioClip[];
var Asphalt : AudioClip[];
var Concrete : AudioClip[];
private var range = 0.5;
private var nums = 0 ;
private var nextTimeWalk = 0.0;


function OnControllerColliderHit (hit : ControllerColliderHit) {
	if (hit.gameObject.tag == "Metal")
		nums = 0;
	if (hit.gameObject.tag == "Wood")
		nums = 1;
	if (hit.gameObject.tag == "Brush")
		nums = 2;
	if (hit.gameObject.tag == "Grass")
		nums = 3;
	if (hit.gameObject.tag ==  "Asphalt")
		nums = 4;
	if (hit.gameObject.tag ==  "Concrete")
		nums = 5;

}

function Update () {

	var controller : CharacterController = GetComponent(CharacterController);   
	range =0.7 -((0.5/10)*controller.velocity.magnitude);
        if (controller.isGrounded && controller.velocity.magnitude > 0.2 && Time.time>nextTimeWalk) {
			nextTimeWalk = Time.time+range;
        	if (nums == 0)
					audio.clip = Metal[Random.Range(0, Metal.length)];
			if (nums == 1)
					audio.clip = Wood[Random.Range(0, Wood.length)];
			if (nums == 2)
					audio.clip = Brush[Random.Range(0, Brush.length)];
			if (nums == 3)
					audio.clip = Grass[Random.Range(0, Grass.length)];
			if (nums == 4)
					audio.clip = Asphalt[Random.Range(0, Asphalt.length)];
			if (nums == 5)
					audio.clip = Concrete[Random.Range(0, Concrete.length)];	 
            audio.Play();
		}
}
@script RequireComponent (AudioSource)