#pragma strict
var impact:AudioClip[];
function Start () {
Destroy(gameObject,0.5);
audio.PlayOneShot(impact[Random.Range(0,impact.length)], 0.8);
}

function Update () {

}