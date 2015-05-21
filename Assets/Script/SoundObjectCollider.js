var Sounds: AudioClip[];
var SoundRange=0.5; 
private var EmitTime:float;
function Start(){
	SoundRange=Time.time;
}
function  OnCollisionEnter () {
 if (Time.time>EmitTime){
 		EmitTime=Time.time+SoundRange;
		audio.PlayOneShot(Sounds[Random.Range(0, Sounds.length)]);
		
	}
}
@script RequireComponent (AudioSource)
@script AddComponentMenu ("Audio/Collider")