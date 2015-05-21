#pragma strict
var sound:AudioClip;
var maxVolume = 1.0;
var smoothly = true;
var smoothlyExit = true;
var loop = false;
var destroyOnExit = false;
var playToEnd = false;
var objectStart:GameObject;
var functionName = "objectStart";
private var Source:AudioSource;
private var down = false;
private var up = false;

function soundUpd(){
	if (down){
		if (!playToEnd){
			if (smoothlyExit)
				Source.volume-=0.5*Time.deltaTime;
			else
				Source.volume = 0;	
			if (Source.volume<=0){
				if (Source)
					Destroy(Source);
				down = !down;
				if (destroyOnExit)
					Destroy(gameObject);
			} 
		}else{
			if (!Source.isPlaying)
				playToEnd = false;
		}	
	}	
	if (up){
		if (smoothly)
			Source.volume+=0.2*Time.deltaTime;
		else
			Source.volume = maxVolume;	
		if (Source.volume>=maxVolume)
			up = !up;
	}
}


function Update () {
	soundUpd();
}
function OnTriggerEnter (SourceObj:Collider){
	if (SourceObj.gameObject.tag == "Player"){
		if (down){
			down = false;
			up = true;
		}
		else {
			if (!Source)
		  		Source = SourceObj.gameObject.AddComponent(AudioSource);	  	
		  	Source.volume = 0;
		  	Source.loop = loop;
			Source.clip = sound;
			Source.Play();
			down = false;
			up = true;
			if (objectStart)
				objectStart.SendMessage(functionName);
		}
	}

}
function OnTriggerExit (){
		down = true;
		up = false;
}
@script AddComponentMenu ("Audio/Sound Zone")