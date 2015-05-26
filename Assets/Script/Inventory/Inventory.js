//#pragma strict
////////////////////////////////////////////////////////////////////////////
//	Module 		: inventory.js
//	Created 	: 24.07.2014
//	Modified 	: 23.12.2014
//	Author		: Dmitry Shebaldin
//	Description : Inventory
////////////////////////////////////////////////////////////////////////////
enum ISI{x64x64, x128x64, x128x128,x256x128};
enum IT{Passive,ActiveToClick, ActiveOne, ActiveTwo, ActiveThree,ActiveFour};

class InventorySound{
	var invOpen:AudioClip;
	var invClose:AudioClip;
	var invInsert:AudioClip;
	var invDrop:AudioClip;
}
class gfgui{
	var backDrop:Texture2D;
	var backDropPay:Texture2D;
	var activeBackDrop:Texture2D;
	var StandartArmor:Texture2D;
	var center:Texture2D;
	var grid:Texture2D;
	var slider:Texture2D;
	var Gui:GUIStyle;
	var GuiText:GUIStyle;
	var GuiBtn:GUIStyle;
}
// Class Element 
class Element{
	class Options{
		class metaData{
			var data_0:int;
			var data_1:int;
			var data_2:int;
		}
		var name:String;
		var description:String;
		var mass:float;
		var price:float;
		var status:float;
		var big_pre:Texture2D = null;
		var mData:metaData;	
	}
	var name:String = 'NULLITEM';
	var sprite:Texture2D = null;
	var type:IT = IT.Passive;
	var size:ISI = ISI.x64x64;
	var count:int = 1;
	var option:Options;
	var _id:GameObject;
	
	function Element(){name = 'NULLITEM';}
	
	function ISGet():Vector2 {
		var out:Vector2;
		switch(size){
			case ISI.x64x64:
				out = Vector2(64,64);
				break;
			case ISI.x128x64:
				out = Vector2(128,64);
				break;
			case ISI.x128x128:
				out = Vector2(128,128);
				break;
			case ISI.x256x128:
				out = Vector2(256,128);
				break;
			default:
				out = Vector2(65,64);
				break;	
		}
		//out.x +=1;
		return out;
	}
}
class massElement{
	var name:String = 'NULLITEM';
	var items:Element[];
	var count:int = 1;
}
class mathfWindow{
	var SCRWidth:float;
	var SCRHeight:float;
	var slise:float;
	var windowSize:Vector2;
	var windowSizeP:Vector2;
	var SizeBorder:Vector2;
	var ScaleIcons:float;
	var Actives:Rect[];
	var topout:float;
	var topoutP:float;
	var armor:Rect;
	class infoRect{
		var actorMoney:Rect;
		var name:Rect;
		var description:Rect;
		var price:Rect;

	}
	var inf:infoRect;
	var border:float;
	var scrollLengthNext:float;
	var activeBackDrop:Rect;
	var backDrop:Rect;
	function round_to(d){
		d = Mathf.Floor(d);
		var  i:int = d;
		if (i % 10 != 0) i = (i / 10) * 10 + 10;
		d = i;
		return d;
	}
	function init(){
		inf = new infoRect();
		SCRWidth 		= Screen.width;
		SCRHeight 		= Screen.height;
		slise 			= 0.0;
		slise 			= (Screen.width - SCRWidth)/2;
		windowSize.x	= (SCRWidth-100)*0.325;
		windowSize.y	= (SCRHeight-200)*0.92;
		windowSizeP.x	= (SCRWidth-100)*0.26; 
		windowSizeP.y	= (SCRHeight-200)*0.86;
		ScaleIcons		= windowSize.x * 0.00156;
		border			= ((SCRWidth-300)*0.1)*0.0085;
		armor 			= Rect((SCRWidth-50)*0.87,35+(SCRHeight)*0.30,((SCRWidth-50)*0.10),SCRHeight*0.30);
		inf.name		= Rect(SCRWidth*0.396,35+(SCRHeight)*0.445,SCRWidth/6.21,30);
		inf.price		= Rect(SCRWidth*0.57, 35+(SCRHeight)*0.445,SCRWidth/10.6,30);
		inf.actorMoney	= Rect((SCRWidth-50)*0.745,(SCRHeight-35)*0.6+35,(SCRWidth-50)/9.7,SCRHeight/18);
		inf.description = Rect(SCRWidth*0.396,35+(SCRHeight)*0.525,windowSize.x-SizeBorder.x*2,200);	
		
		activeBackDrop	= Rect(100,0,SCRWidth-200,137);
		backDrop		= Rect(50,140,  SCRWidth-100, SCRHeight-200);
		topout			= ((SCRHeight-137)/16.74)+137;
		topoutP			= ((SCRHeight-137)/10.2)+137;
		SizeBorder.x	= (SCRWidth)*0.0145;
		scrollLengthNext= 64*ScaleIcons;
	}
	
	
}
var ActorCamera:Transform;
var TxGUI:gfgui;
var soundFx:InventorySound;
var items:massElement[];


private var mtp:mathfWindow;
private var windowSize:Vector2=Vector2(512,512);
private var SizeBorder:Vector2=Vector2(50,59);
private var Actives:Element[];
private var passActive:Element[];
private var npsTemp:Element[];
private var actTemp:Element[];
private var ScaleIcons=1.4;
private var scrollPosition 	: Vector2 = Vector2.zero;
private var scrollPositionx	: Vector2 = Vector2.zero;
private var scrollPositiona	: Vector2 = Vector2.zero;
private var scrollPositionb	: Vector2 = Vector2.zero;
private var showGUI = false;
private var maxX=0;
private var maxY=0;
private var dclick=0.0;
private var selected = -1;
private var itemIcon = false;
private var Icon:Texture2D;
private var InventoryMass:float;
private var scrollLength  = 0;
private var scrollLengthx = 0;
private var scrollLengtha = 0;
private var scrollLengthb = 0;
private var showShop 	= false;
private var paypal 		= true;
private var goodShop 	= false;
private var ShopGm:GameObject;
var TOP = 0.00;
var roots = Rect;
var IMX:Texture2D;

function Start(){
		Actives = new Element[3];
		for(act in Actives)act = Element()as Element ;
		passActive = new Element[0];
		actTemp = new Element[0];
		npsTemp = new Element[0];
		mtp = new mathfWindow();
		mtp.init();
		
}
//******************************************
//Ïîèñê îäèíàêîâûõ ýëåìåíòîâ
//******************************************
function searchElement(name:String,count:int){
	var bing  = false;	
	for (var itm in items){
		if (itm.name == name){
			itm.count +=count;
			bing = true;
			break;
		}
	}
	return bing;
}

function startScript(g:GameObject){
	var cp:Component[] = g.GetComponents.<MonoBehaviour>();
	for(c in cp)
		if(c.enabled == false)
			c.Start();
}
function getScript(g:GameObject):Component{
	var res:Component;
	var cp:Component[] = g.GetComponents.<MonoBehaviour>();
	for(c in cp)
		if(c.enabled == false){
			res = c;
			break;
		}
	return res;
}

function getScripto(g:GameObject):Component{
	var cp:Component = g.GetComponent.<MonoBehaviour>();
	return cp;
}
//******************************************
//API Ïîëó÷åíèå êîëëè÷åñòâà ìíîæåòåëåé
//******************************************

function APIgetItemCount(name:String){
	var bing=0;	
	for (var itm in items){
		if (itm.name == name){
			bing = itm.count;
			break;
		}
	}
	return bing;
}

function APISetActivesData(id:int,data_id:int,data:int){
	switch(data_id){
		case 0:
			Actives[id].option.mData.data_0 = data;
			break;
		case 1:
			Actives[id].option.mData.data_1 = data;
			break;
		case 2:
			Actives[id].option.mData.data_2 = data;
			break;
	}
}
function APIGetActivesData(id:int,data_id:int){
	var out = -1;
	switch(data_id){
		case 0:
			out = Actives[id].option.mData.data_0;
			break;
		case 1:
			out = Actives[id].option.mData.data_1;
			break;
		case 2:
			out = Actives[id].option.mData.data_2;
			break;
	}
	return out;
}
//******************************************
//API Edit count of elements
//******************************************
function APIeditItemCount(name:String,count:int){
	for (var itm in items){
		if (itm.name == name){
			itm.count = count;
			itm.items[0].count = count;
			break;
		}
	}
}
//******************************************
//add item in generic array
//******************************************]
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
		el.items[0] = Item;
		var cp = new Array(items);	
		cp.Add(el); 
		items = cp.ToBuiltin(massElement) as massElement[];
	}
	return res;
}

//******************************************
//remove item in generic array
//******************************************
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

function toArrayPass(Item:Element){
		var Contents = new Array(passActive);
		Contents.Add(Item);
		passActive = Contents.ToBuiltin(Element) as Element[];
}

function drArrayPass(index:int){
		var Contents = new Array(passActive);
		Contents.RemoveAt(index);
		passActive = Contents.ToBuiltin(Element) as Element[];
}
//******************************************
//Iterates for output
//******************************************
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

	widthm  = showShop||paypal ? 512:640;

	var xt = 0; var maxY = 0;
	for (i= 0;i<=items.Length-2;i++){
		var ix = items[i].items[0].ISGet().x;
		var iy = items[i].items[0].ISGet().y;
		if (iy>maxY){
			maxY = iy;
		}
		if (xt+ix < widthm){
			xt +=ix;
		}else {
			for (j = i;j<=items.Length-2;j++){
				if (xt+items[j].items[0].ISGet().x == widthm){
					x = items[i];
					items[i] = items[j];
					items[j]= x;
					xt = 0;
					maxY = 0;
					break;
				}
			}
		}
	}
}
//******************************************
//Insert the item on the scene
//******************************************
function insertToScene(insertScene:GameObject,it:Element){	
	var p:GameObject = insertScene.transform.parent.gameObject;
	insertScene.transform.parent = null;	
	Destroy(p);
	insertScene.transform.position = transform.position+ ActorCamera.TransformDirection(Vector3(0,0,0.5));
	insertScene.transform.rotation = transform.rotation;
	insertScene.SetActive(true);
	insertScene.GetComponent("Item").item = it;

}
//******************************************
//Insert item into inventory
//******************************************
function insertToInventory(insertScene:GameObject,type:IT,res:boolean){
	if (!res||type!=IT.Passive){
		insertScene.SetActive(false);
		var g = new GameObject(insertScene.name);
		g.transform.parent = transform;
		g.transform.localPosition=Vector3.zero;
		g.transform.localRotation=Quaternion.identity;
		if (type!=IT.Passive)
			CopyComponent(getScript(insertScene),g).enabled = false;
		insertScene.transform.parent=g.transform;
		insertScene.transform.localPosition=Vector3.zero;
		insertScene.transform.localRotation=Quaternion.identity;
		
	}else{
		Destroy(insertScene);
	}
}

function CopyComponent(original:Component, destination:GameObject):Component{
	var type:System.Type = original.GetType();
	var copy:Component = destination.AddComponent(type);
	var fields:System.Reflection.FieldInfo[] = type.GetFields(); 
	for (var field:System.Reflection.FieldInfo in fields){
		field.SetValue(copy, field.GetValue(original));
	}
	return copy;
}

//******************************************
//The ultimate function of adding an item in inventory
//******************************************
function AddItem(Item:Element,g:GameObject){
	var	res = toArray(Item);
	insertToInventory(g,Item.type,res);
	CalcElement();
	audio.clip = soundFx.invInsert;
	audio.Play();
}


//******************************************
//The ultimate function of removing an item in inventory
//******************************************
function removeItem(index:int){	
	insertToScene(items[index].items[0]._id,items[index].items[0]);
	drArray(index);
	CalcElement();
	audio.clip = soundFx.invDrop;
	audio.Play();
}

//******************************************
//Drank from the active cell
//******************************************
function dropInActive(type:int,cb:Function){
	if (Actives[type].name!="NULLITEM"){
		toArray(Actives[type]);	
		getScripto(Actives[type]._id.transform.parent.gameObject).ObjectDeactive();
		getScripto(Actives[type]._id.transform.parent.gameObject).enabled = false;
		Actives[type] = new Element();
	}
	CalcElement();
	cb();
	audio.clip = soundFx.invInsert;
	audio.Play();
}
//******************************************
//Dug into the active cell
//******************************************
function insertToActive(type:int,index:int){
	dropInActive(type,function(){
		print('YES');
		Actives[type] = items[index].items[0];
		drArray(index);
		selected = -1;
		getScript(Actives[type]._id.transform.parent.gameObject).ObjectActive();
		getScript(Actives[type]._id.transform.parent.gameObject).enabled = true;
	});
	CalcElement();
	audio.clip = soundFx.invInsert;
	audio.Play();
}
//******************************************
//Dug into the passive-active cell
//******************************************
function insertToPassActive(index:int){
	if (passActive.Length<8){
		var ObjectActive = getScript(items[index].items[0]._id.transform.parent.gameObject);
		toArrayPass(items[index].items[0]);
		drArray(index);
		ObjectActive.enabled = true;
		selected = -1;
		ObjectActive.ObjectActive();
	}
	audio.clip = soundFx.invInsert;
	audio.Play();
}
//Drank from the passive-active cell
function dropToPassActive(index:int){
	var ObjectActive = getScripto(passActive[index]._id.transform.parent.gameObject);
	ObjectActive.enabled = false;
	toArray(passActive[index]);
	drArrayPass(index);
	CalcElement();
	audio.clip = soundFx.invInsert;
	audio.Play();
}


function clickActive(index:int){
	startScript(items[index].items[0]._id.transform.parent.gameObject);
	var tmps = items[index].items[0]._id.transform.parent.gameObject;
	Destroy(items[index].items[0]._id);
	Destroy(tmps);
	drArray(index);
	selected = -1;	
	audio.clip = soundFx.invInsert;
	audio.Play();
}

function clickItem(type:IT,index:int){
	switch(type){
		case IT.Passive:
			//
			break;
		case IT.ActiveToClick:
			clickActive(index);
			break;
		case IT.ActiveOne:
			insertToActive(0,index);
			break;
		case IT.ActiveTwo:
			insertToActive(1,index);
			break;
		case IT.ActiveThree:
			insertToPassActive(index);
			break;
		case IT.ActiveFour:
			insertToActive(2,index);
			break;
		default:
			//
			break;	
	}
}

//******************************************
//Âèçóàëüíîå îáíàðóæåíèå îáúåêòà
//******************************************
function objectItemAdd(){
	var hit : RaycastHit;
	var dir =ActorCamera.TransformDirection(Vector3(0,0,1));
	if (Physics.Raycast (ActorCamera.position, dir, hit,4) ){
		if (hit.collider.gameObject.tag=="ObjectItem"){
			var icon : Item = hit.collider.gameObject.GetComponent(Item);
			Icon=icon.item.sprite;
			if (Input.GetKeyDown("f")){
				icon.item._id = hit.collider.gameObject;
				AddItem(icon.item,hit.collider.gameObject);
			}
			itemIcon = true;
		}else{
			itemIcon=false;
		}
		if (hit.collider.gameObject.tag=="ShopBox"){
			if (Input.GetKeyDown("f")){
				mtp.init();
				showShop = !showShop;
				CalcElement();
				ShopGm = hit.collider.gameObject;

				if (gameControl.ActivateGUI&&!showShop){
					gameControl.ActivateGUI = false;
				}else{
					gameControl.ActivateGUI = true;
					showGUI = false;
				}
		
				audio.clip = soundFx.invOpen;
				audio.Play();
			}
		
		}else{	
			if (!showGUI){
				showShop = false;
				gameControl.ActivateGUI = false;
			}
		}
	}else{
		itemIcon=false;
	}
}

function boxToInt(item:Element,cb:Function){
	var tmp = item._id.transform.parent.gameObject;
	insertToInventory(item._id,item.type,toArray(item));
	Destroy(tmp);
	CalcElement();
	cb();
	selected =-1;
	audio.clip = soundFx.invInsert;
	audio.Play();
}
function intToBox(item:Element,c:Function){
	var tmp = item._id.transform.parent.gameObject;
	ShopGm.GetComponent(InventoryBox).insertToInventory(item._id,item.type,ShopGm.GetComponent(InventoryBox).toArray(item),function(){
		Destroy(tmp);
		ShopGm.GetComponent(InventoryBox).CalcElement();
	});	
	audio.clip = soundFx.invInsert;
	audio.Play();
	selected =-1;
	c();
}
function invToAct(item:Element,c:Function){
	var Contents = new Array(actTemp);
	Contents.Add(item);
	actTemp = Contents.ToBuiltin(Element) as Element[];
	audio.clip = soundFx.invInsert;
	audio.Play();
	selected =-1;
	c();
}
function npsToAct(item:Element,c:Function){
	var Contents = new Array(npsTemp);
	Contents.Add(item);
	npsTemp = Contents.ToBuiltin(Element) as Element[];
	audio.clip = soundFx.invInsert;
	audio.Play();
	selected =-1;
	c();
}
function goShop(){
	var actorMoney = gameControl.actorMoney;
	var npsMoney = ShopGm.GetComponent(InventoryBox).npsMoney;
	var npsShop = 0.0;
	var actShop = 0.0;
	if (actTemp.length == 0 && npsTemp.length == 0){
		print('Buy not fond');
	}else{
		for (var itm in actTemp){
			npsShop += itm.option.price;
		}
		for (var itm in npsTemp){
			actShop += itm.option.price;
		}
		if (npsMoney>=npsShop&&actTemp.Length>0){
			for (var itm in actTemp){
				intToBox(itm,function(){
					CalcElement();
				});
			}
			gameControl.actorMoney += npsShop;
			ShopGm.GetComponent(InventoryBox).npsMoney -= npsShop;
			actTemp = new Element[0];
		}else{
			if (actTemp.Length>0)
				print('NPC NO MONEY');
		}
		
		if (actorMoney>=actShop&&npsTemp.Length>0){
			for (var itm in npsTemp){
				boxToInt(itm,function(){
				});
			}
			gameControl.actorMoney -= actShop;
			ShopGm.GetComponent(InventoryBox).npsMoney += actShop;
			npsTemp = new Element[0];
		}else{
			if (npsTemp.Length>0)
				print('YOU DO NOT HAVE MONEY');
		}
	}
}
function noShop(){
	for (var itm in npsTemp){
		ShopGm.GetComponent(InventoryBox).toArray(itm);
	}
	npsTemp = new Element[0];
	for (var itm in actTemp){
		toArray(itm);
	}
	actTemp = new Element[0];
	goodShop = true;
}
//******************************************
//Vis
//******************************************

function DrawTiled (rect:Rect,tex:Texture2D,size:float,count:int) {
	var width = Mathf.RoundToInt(rect.width);
	var height = Mathf.RoundToInt(rect.height);
	var dx = (tex.width*(size));
	var cell = (64*(size+0.00385));
	var dy = tex.height*(size);
	GUI.BeginGroup (Rect (rect.x,rect.y,cell*count,height));
		for (var y = 0; y < height; y += dy ){
			GUI.DrawTexture(Rect(0, y, width, dy), tex);
		}
	GUI.EndGroup();
} 

function OnGUI(){

	if (!showShop&&!goodShop)
		noShop();
	if (!showGUI&&!showShop){
		gameControl.ActivateGUI = false;
	}
	//Show inventory
	//==================================================================================
	GUI.DrawTexture(Rect(Screen.width/2-16,Screen.height/2-16,32,32),TxGUI.center);

	if (showGUI){
		mtp.init();
		var index = 0; 
		maxX = 0; 
		maxY = 0;
		var idx = 0; var ix = 0.0; var iy = 0.0;
		var currentX = 0; var currentY = 0;
		GUI.BeginGroup (Rect (mtp.slise,0,mtp.SCRWidth,Screen.height));

		showShop = false;
		gameControl.ActivateGUI = true;
		GUI.DrawTexture(mtp.activeBackDrop,TxGUI.activeBackDrop,ScaleMode.StretchToFill);		
		GUI.DrawTexture(mtp.backDrop,TxGUI.backDrop,ScaleMode.StretchToFill);
				
		if (Actives[0].name!="NULLITEM"){
			if (GUI.Button(Rect(mtp.SCRWidth/2-TxGUI.activeBackDrop.width/2+50,25,Actives[0].ISGet().x,Actives[0].ISGet().y),Actives[0].sprite,TxGUI.Gui)){
				if (Time.time> dclick+0.3){
					dclick = Time.time;	
				}else{
					dropInActive(0,function(){});
				}
			}
		}
	
		if (Actives[1].name!="NULLITEM"){
			if (GUI.Button(Rect((mtp.SCRWidth-300)*0.38,10,Actives[1].ISGet().x,Actives[1].ISGet().y),Actives[1].sprite,TxGUI.Gui)){
				if (Time.time> dclick+0.3){
					dclick = Time.time;	
				}else{
					dropInActive(1,function(){});
				} 
			}
		}

		if (Actives[2].name!="NULLITEM"){
			if (GUI.Button(mtp.armor,Actives[2].option.big_pre,TxGUI.Gui)){
				if (Time.time> dclick+0.3){
					dclick = Time.time;	
				}else{
					dropInActive(2,function(){});
				}
			}
		}else{
			GUI.DrawTexture(mtp.armor,TxGUI.StandartArmor,ScaleMode.StretchToFill);	
		}
				
		if (passActive.length>0){
			var cX = 0; var cY = 0; 
			for(var item in passActive){
				if (GUI.Button(Rect(cX+(mtp.SCRWidth*0.565),40,mtp.scrollLengthNext,mtp.scrollLengthNext),item.sprite,TxGUI.Gui)){
					if (Time.time> dclick+0.3)dclick = Time.time;	else	dropToPassActive(idx);
				}
				cX +=mtp.scrollLengthNext ;idx++;
			}
		}
		
		scrollPosition = GUI.BeginScrollView (Rect (50+mtp.SizeBorder.x,mtp.topout,mtp.windowSize.x, mtp.windowSize.y),scrollPosition, Rect (0, 0, 0, scrollLength));
			//GUI.DrawTexture(Rect(0,0,2000,2000),IMX);
			scrollLength = scrollLength<mtp.windowSize.y ? mtp.windowSize.y:scrollLength;
			DrawTiled(Rect(0,0,mtp.windowSize.x,scrollLength),TxGUI.grid,mtp.ScaleIcons,10);
			scrollLength = 0;
			
			
			for(var item in items){
				ix = (item.items[0].ISGet().x+1)*mtp.ScaleIcons;
				iy = item.items[0].ISGet().y*mtp.ScaleIcons;
				maxX = maxX == mtp.windowSizeP.x ? 0:maxX;
				if (mtp.round_to(currentX+ix)>mtp.round_to(mtp.windowSize.x)){
					currentX=maxX;
					currentY+=iy;
					currentX = (currentY+iy>=currentY+maxY) ? 0:currentX;
					maxX = 0; maxY = 0;											
				}

				if (GUI.Button(Rect(currentX,currentY,ix,iy),item.items[0].sprite,TxGUI.Gui)){
					selected = index;
					if (Time.time> dclick+0.3){
						dclick = Time.time;	
					}else{
						clickItem(item.items[0].type,index);
						dclick = Time.time;	
					}
				}
				if (item.count > 1)
					GUI.Label(Rect(currentX+5,currentY+5,item.items[0].ISGet().x,item.items[0].ISGet().y), "x"+item.count.ToString());

				currentX+=ix;
				if (maxY <= iy){
					maxY = iy;
					maxX += ix;
				}	
				index++;		
			}
			scrollLength = mtp.scrollLengthNext + currentY + maxY;
		GUI.EndScrollView ();

		GUI.Label(mtp.inf.actorMoney, gameControl.actorMoney.ToString() ,TxGUI.GuiText);
		//GUI.DrawTexture(mtp.inf.actorMoney,IMX);
		if (selected>=0){
			var itm = items[selected].items[0];
			GUI.Label(mtp.inf.name, itm.option.name,TxGUI.GuiText);
			GUI.Label(mtp.inf.description, itm.option.description);
			GUI.Label(mtp.inf.price, itm.option.price.ToString(),TxGUI.GuiText);
			GUI.DrawTexture(Rect(mtp.SCRWidth*0.57,37+(Screen.height*0.501),Mathf.FloorToInt((mtp.SCRWidth/10.3)/100*itm.option.status),4),TxGUI.slider);
			GUI.DrawTexture(Rect((mtp.SCRWidth*0.53)-(itm.ISGet().x/2),Screen.height*0.26,itm.ISGet().x,itm.ISGet().y),itm.sprite,ScaleMode.StretchToFill);
		}
		GUI.EndGroup ();
	}
	

	
	if (showShop){
		index = 0; goodShop = false; currentX = 0; currentY = 0; maxX = 0; maxY = 0; 
		GUI.BeginGroup (Rect (mtp.slise,0,mtp.SCRWidth,Screen.height));
			GUI.DrawTexture(mtp.backDrop,TxGUI.backDropPay,ScaleMode.StretchToFill);
			//GUI.DrawTexture(Rect(0,0,Screen.width,Screen.width),IMX);
			scrollPosition = GUI.BeginScrollView (Rect (65+mtp.SizeBorder.x,mtp.topoutP,mtp.windowSizeP.x, mtp.windowSizeP.y),scrollPosition, Rect (0, 0, 0, scrollLength));
				scrollLength = scrollLength<mtp.windowSizeP.y ? mtp.windowSizeP.y:scrollLength;
				DrawTiled(Rect(0,0,mtp.windowSize.x,scrollLength),TxGUI.grid,mtp.ScaleIcons,8);
				scrollLength = 0;

				for(var item in items){
					ix = (item.items[0].ISGet().x+1)*mtp.ScaleIcons;
					iy = item.items[0].ISGet().y*mtp.ScaleIcons;
					maxX = maxX == mtp.windowSizeP.x ? 0:maxX;
					if (mtp.round_to(currentX+ix)>mtp.round_to(mtp.windowSizeP.x)){
						currentX=maxX;
						currentY+=iy;
						currentX = (currentY+iy>=currentY+maxY) ? 0:currentX;
						maxX = 0; maxY = 0;											
					}
					if (GUI.Button(Rect(currentX,currentY,ix,iy),item.items[0].sprite,TxGUI.Gui)){
						selected = index;
						if (Time.time> dclick+0.3){
							dclick = Time.time;	
						}else{
							if (paypal){
								invToAct(item.items[0],function(){
									drArray(index);
								});
							}else{
								intToBox(item.items[0],function(){
									drArray(index); 
									CalcElement();
								});
							}
							dclick = Time.time;	
						}
					}
				
					if (item.count > 1) 
						GUI.Label(Rect(currentX+5,currentY+5,item.items[0].ISGet().x,item.items[0].ISGet().y), "x"+item.count.ToString());
					currentX+= ix;
					if (maxY <= iy){
						maxY = iy;
						maxX += ix;
					}
					index++;
					
				}
				scrollLength = 64*mtp.ScaleIcons + currentY + maxY;
			GUI.EndScrollView ();
			

			index = 0; currentX = 0; currentY = 0; maxX = 0; maxY = 0;
			scrollPositionx = GUI.BeginScrollView (Rect ((mtp.SCRWidth)*0.67+mtp.SizeBorder.x,mtp.topoutP,mtp.windowSizeP.x, mtp.windowSizeP.y),scrollPositionx, Rect (0, 0, 0, scrollLengthx));
				if (scrollLength<mtp.windowSize.y) scrollLengthx=mtp.windowSizeP.y;
				DrawTiled(Rect(0,0,mtp.windowSize.x,scrollLengthx),TxGUI.grid,mtp.ScaleIcons,8);
				scrollLength = 0;

				paypal = ShopGm.GetComponent(InventoryBox).paypal;
				for(var item in ShopGm.GetComponent(InventoryBox).items){
					ix = (item.items[0].ISGet().x+1)*mtp.ScaleIcons;
					iy = item.items[0].ISGet().y*mtp.ScaleIcons;
					if (maxX==mtp.windowSizeP.x){maxX=0;}
					if (mtp.round_to(currentX+ix)>mtp.round_to(mtp.windowSizeP.x)){
						currentX=maxX;
						currentY+=iy;
						if (currentY+iy>=currentY+maxY){
							currentX=0;				
						}
						maxX = 0; maxY = 0;											
					}
					if (GUI.Button(Rect(currentX,currentY,ix,iy),item.items[0].sprite,TxGUI.Gui)){
						selected = index;
						if (Time.time> dclick+0.3){
							dclick = Time.time;	
						}else{
							if (paypal){
								npsToAct(item.items[0],function(){
									ShopGm.GetComponent(InventoryBox).drArray(index);
									ShopGm.GetComponent(InventoryBox).CalcElement();
								});
							}else{
								boxToInt(item.items[0],function(){
									ShopGm.GetComponent(InventoryBox).drArray(index);
									ShopGm.GetComponent(InventoryBox).CalcElement();
								});
							}
							dclick = Time.time;	
						}
					}
					if (item.count>1)
						GUI.Label(Rect(currentX+5,currentY+5,item.items[0].ISGet().x,item.items[0].ISGet().y), "x"+item.count.ToString());
					currentX+=ix;
					if (maxY <= iy){
						maxY = iy;
						maxX += ix;
					}
					index++;
					
				}
				scrollLengthx = 64*mtp.ScaleIcons + currentY + maxY;
			GUI.EndScrollView ();
	// Купить продать 
			if (paypal){
				index = 0;
				// Èãðîê
				currentX=0;currentY=0; maxX = 0; maxY = 0; 
				mtp.windowSize.x =  mtp.SCRWidth*0.3074953125;
				mtp.ScaleIcons = mtp.windowSize.x * 0.001953;
				mtp.windowSize.y =(Screen.height-TxGUI.activeBackDrop.height)*0.365;
				var Rects = Rect(SizeBorder.x+mtp.windowSize.x/2,mtp.windowSize.y*3+TxGUI.activeBackDrop.height-120,mtp.windowSize.x*0.5,30);
	////////////////////////////////////////////////////////kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk			
				GUI.Label(Rect(Mathf.FloorToInt(mtp.SCRWidth/19.45),Mathf.FloorToInt(Screen.height/4.34),100,30), gameControl.actorMoney.ToString() ,TxGUI.GuiText);
				GUI.Label(Rect(Mathf.FloorToInt(mtp.SCRWidth/1.165),Mathf.FloorToInt(Screen.height/4.34),100,30), ShopGm.GetComponent(InventoryBox).npsMoney.ToString() ,TxGUI.GuiText);
				
				scrollPositiona = GUI.BeginScrollView (Rect (SizeBorder.x,TxGUI.activeBackDrop.height+40,mtp.windowSize.x, mtp.windowSize.y),scrollPositiona, Rect (0, 0, 0, scrollLengtha));
				GUI.DrawTextureWithTexCoords (Rect(0,0,mtp.windowSize.x,scrollLengtha), TxGUI.grid, Rect(0, 0,8.05,scrollLengtha/(TxGUI.grid.height*mtp.ScaleIcons)));
				scrollLengtha = 0;
				// Ðàñïðåäåëåíèå ýëåìåíòîâ
				for(var item in actTemp){
					if (GUI.Button(Rect(currentX,currentY,item.ISGet().x*mtp.ScaleIcons,item.ISGet().y*mtp.ScaleIcons),item.sprite,TxGUI.Gui)){
						selected = index;
						if (Time.time> dclick+0.3){
							dclick = Time.time;	
						}else{
							toArray(item);
							CalcElement();
							var cp = new Array(actTemp);
							cp.RemoveAt(index);
							actTemp = cp.ToBuiltin(Element) as Element[];	
							dclick = Time.time;	
						}
					}
					if (item.count>1)
						GUI.Label(Rect(currentX+5,currentY+5,item.items[0].ISGet().x,item.items[0].ISGet().y), "x"+item.count.ToString());
					//placeElement(currentX,currentY,maxX,maxY,Vector2(item.items[0].ISGet().x*mtp.ScaleIcons,item.items[0].ISGet().y*mtp.ScaleIcons),function(cx,cy,mX,mY){
					//	currentX = cx;
					//	currentY = cy;
					//	maxX = mX;
					//	maxY = mY;
					//});
					index++;
					
				}
				scrollLengtha = 64*mtp.ScaleIcons + currentY + maxY;
				GUI.EndScrollView ();
				
				index = 0;
				currentX=0;currentY=0; maxX = 0; maxY = 0; SizeBorder.x = (mtp.SCRWidth)*0.352;
				mtp.windowSize.x =  mtp.SCRWidth*0.3074953125;
				mtp.ScaleIcons = mtp.windowSize.x * 0.001953;
				mtp.windowSize.y =(Screen.height-TxGUI.activeBackDrop.height)*0.3655;
				scrollPositionb = GUI.BeginScrollView (Rect (SizeBorder.x,TxGUI.activeBackDrop.height+mtp.windowSize.y+106,mtp.windowSize.x, mtp.windowSize.y),scrollPositionb, Rect (0, 0, 0, scrollLengthb));
				GUI.DrawTextureWithTexCoords (Rect(0,0,mtp.windowSize.x,scrollLengthb), TxGUI.grid, Rect(0, 0,8.05,scrollLengthb/(TxGUI.grid.height*mtp.ScaleIcons)));
				scrollLengthb = 0;
				// Ðàñïðåäåëåíèå ýëåìåíòîâ
				for(var item in npsTemp){
					if (GUI.Button(Rect(currentX,currentY,item.ISGet().x*mtp.ScaleIcons,item.ISGet().y*mtp.ScaleIcons),item.sprite,TxGUI.Gui)){
						selected = index;
						if (Time.time> dclick+0.3){
							dclick = Time.time;	
						}else{
							ShopGm.GetComponent(InventoryBox).toArray(item);
							ShopGm.GetComponent(InventoryBox).CalcElement();
							var cps = new Array(npsTemp);
							cps.RemoveAt(index);
							npsTemp = cps.ToBuiltin(Element) as Element[];	
							dclick = Time.time;	
						}
					}
					if (item.count>1)
						GUI.Label(Rect(currentX+5,currentY+5,item.ISGet().x,item.ISGet().y), "x"+item.count.ToString());
					//placeElement(currentX,currentY,maxX,maxY,Vector2(item.ISGet().x*mtp.ScaleIcons,item.ISGet().y*mtp.ScaleIcons),function(cx,cy,mX,mY){
					//	currentX = cx;
					//	currentY = cy;
					//	maxX = mX;
					//	maxY = mY;
					//});
					index++;
					
				}
				
				scrollLengthb = 64*mtp.ScaleIcons + currentY + maxY;
				GUI.EndScrollView ();
				if (GUI.Button(Rects,"Òîðãîâàòü",TxGUI.GuiBtn)){
					goShop();
				}
			}
	
		GUI.EndGroup ();
	}
	//==================================================================================

	// Item icon
	if (itemIcon){
		GUI.Label(Rect(Screen.width/2-10,Screen.height/2+Screen.height/3,150,40),"GET");
		GUI.DrawTexture(Rect(Screen.width/2-Icon.width/2,Screen.height/2+Screen.height/3+10,Icon.width,Icon.height),Icon);
	}
	
	
}


function keyStat(){

	if (Input.GetKeyUp("i")){
		CalcElement();
		mtp.init();
		if (showGUI){
			audio.clip = soundFx.invClose;
			audio.Play();
			
		}else{
			audio.clip = soundFx.invOpen;
			audio.Play();
		}
		showGUI = !showGUI;
		gameControl.ActivateGUI = gameControl.ActivateGUI ? false:true;
				
	}
	
	if (Input.GetKeyUp("g"))
		if (selected>=0){
			removeItem(selected);
			selected = -1;
		}
}


function Update(){
	objectItemAdd();
	keyStat();
}
@script RequireComponent (AudioSource)
@script AddComponentMenu ("Inventory/Inventory System")