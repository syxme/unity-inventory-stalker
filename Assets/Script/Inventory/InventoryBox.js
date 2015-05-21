#pragma strict
private var G:GameObject[];
var items:massElement[];
var paypal = true;
var npsMoney = 5000;
function toArray(Item:Element){
	var res = false;
	var id = -1;
	for (var i= 0;i<=items.Length-1;i++){
		if (items[i].name == Item.name){
			if (Item.type==IT.Passive)
				items[i].count += Item.count;
			else
				items[i].count +=1;
			id = i;
			break;
		}
	}
		
	if (id>=0){
		if (Item.type!=IT.Passive){
			var Contents = new Array(items[id].items);	
			Contents.Add(Item);
			items[id].items = Contents.ToBuiltin(Element) as Element[];
			
		}
		if (Item.type==IT.Passive)
			items[i].items[0].count +=Item.count;
		res = true;
	}else{
		var el:massElement = new massElement();
		el.name = Item.name;
		if (Item.type==IT.Passive)
			el.count = Item.count;
		else
			el.count = 1;
		el.items = new Element[1];
		el.items[0] =Item;
		var cp = new Array(items);	
		cp.Add(el); 
		items = cp.ToBuiltin(massElement) as massElement[];
	}
	return res;
}
function drArray(index:int){
		if (items[index].items.Length>1){
			var Contents = new Array(items[index].items);
			Contents.RemoveAt(0);
			items[index].items = Contents.ToBuiltin(Element) as Element[];
			items[index].count -=1;
		}else{
			var cp = new Array(items);
			cp.RemoveAt(index);
			items = cp.ToBuiltin(massElement) as massElement[];
		}
}
function insertToInventory(insertScene:GameObject,type:IT,res:boolean,callback:Function){
	if (!res||type!=IT.Passive){
		var g = new GameObject(insertScene.name);
		g.transform.parent = transform;
		g.transform.localPosition=Vector3.zero;
		g.transform.localRotation=Quaternion.identity;
		insertScene.transform.parent=g.transform;
		insertScene.transform.localPosition=Vector3.zero;
		insertScene.transform.localRotation=Quaternion.identity;
		insertScene.SetActive(false);
	}else{
		Destroy(insertScene);
	}
	callback();
}

function CalcElement(){
	var x:massElement;
	for (var i= 0;i<=items.Length-2;i++){
		for (var j= 0;j<=items.Length-2;j++){
			if (items[j].items[0].ISGet().x+items[j].items[0].ISGet().y < items[j+1].items[0].ISGet().x + items[j+1].items[0].ISGet().y){
				x = items[j+1];
				items[j+1] = items[j];
				items[j]= x;		
			}		
		}

	}
}
function Start () {
	gameObject.tag = "ShopBox";
	var count = transform.childCount;
	G = new GameObject[count];
	for (var i = 0;i<count;i++){
		G[i] = transform.GetChild(i).gameObject;
	
	}
	for (var item in G){
		var res = toArray(item.GetComponent(Item).item);
		item.GetComponent(Item).item._id = item;
		insertToInventory(item,item.GetComponent(Item).item.type,res,function(){});
	}
	
	CalcElement();
	
}

function Update () {

}