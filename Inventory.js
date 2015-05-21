//#pragma strict
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
// Класс элемента, может использоваться в точках сбора объектов
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
		out.x +=1;
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
	var slise:float;
	var windowSize:Vector2;
	var SizeBorder:Vector2;
	var ScaleIcons:float;
	var Actives:Rect[];
	class infoRect{
		var actorMoney:Rect;
		var name:Rect;
		var description:Rect;
		var price:Rect;
		var status:Function;
		var sprite:Rect;

	}
	var inf:infoRect;
	var border:float;
	var scrollLengthNext:float;
	function init(){
		inf = new infoRect();
		SCRWidth = Screen.width;
		slise = 0.0;
		if (SCRWidth >= 1350){
			SCRWidth = 1350;
			slise = (Screen.width - SCRWidth)/2;
		}else{
			slise = 0;
		}
		/////////////////////
		windowSize.x = (SCRWidth-100)*0.325;
		windowSize.y = (Screen.height-200)*0.92;
		ScaleIcons = windowSize.x * 0.00156;
		border = ((SCRWidth-300)*0.1)*0.0085;
		inf.actorMoney = Rect(Mathf.FloorToInt(SCRWidth*0.722),Mathf.FloorToInt(Screen.height*0.63),100,30);
		inf.name = Rect(Mathf.FloorToInt(SCRWidth/2.520),Mathf.FloorToInt(Screen.height/2.03),160,30);
		inf.description = Rect(SCRWidth*0.396,35+((Screen.height)*0.525),windowSize.x-SizeBorder.x*2,200);
		inf.price = Rect(Mathf.FloorToInt(SCRWidth/1.73),Mathf.FloorToInt(Screen.height/2.03),160,30);
		scrollLengthNext = 64*ScaleIcons;
	}
	
	
}
var ActorCamera:Transform;
var TxGUI:gfgui;
var soundFx:InventorySound;
var items:massElement[];
var RRR:Rect;

private var mtp:mathfWindow;
private var winPos:Vector2=Vector2(0,0);
private var windowSize:Vector2=Vector2(512,512);
private var SizeBorder:Vector2=Vector2(50,59);
private var Actives:Element[];
private var passActive:Element[];
private var npsTemp:Element[];
private var actTemp:Element[];
private var ScaleIcons=1.4;
private var scrollPosition : Vector2 = Vector2.zero;
private var scrollPositionx : Vector2 = Vector2.zero;
private var scrollPositiona : Vector2 = Vector2.zero;
private var scrollPositionb : Vector2 = Vector2.zero;
private var showGUI = false;
private var maxX=0;
private var maxY=0;
private var dclick=0.0;
private var selected = -1;
private var itemIcon = false;
private var Icon:Texture2D;
private var InventoryMass:float;
private var scrollLength = 0;
private var scrollLengthx = 0;
private var scrollLengtha = 0;
private var scrollLengthb = 0;
private var showShop = false;
private var paypal = true;
private var goodShop = false;
private var ShopGm:GameObject;
var TOP = 0.00;

function Start(){
		Actives = new Element[3];
		for(act in Actives)act = Element()as Element ;
		passActive = new Element[0];
		actTemp = new Element[0];
		npsTemp = new Element[0];
		mtp = new mathfWindow();
		mtp.init();
		print(mtp.SCRWidth);
}
//******************************************
//Поиск одинаковых элементов
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
//API Получение колличества множетелей
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
//API Изменение колличества множетелей
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
//Добавить элемент к массиву
//******************************************
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
//Удалить элемент из массива
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
//Просчёт позиций 
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
	
}
//******************************************
//создание и удаление объекта на сцене
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
function insertToInventory(insertScene:GameObject,type:IT,res:boolean){
	if (!res||type!=IT.Passive){
		var g = new GameObject(insertScene.name);
		g.transform.parent = transform;
		g.transform.localPosition=Vector3.zero;
		g.transform.localRotation=Quaternion.identity;
		if (type!=IT.Passive)
			CopyComponent(getScript(insertScene),g).enabled = false;
		insertScene.transform.parent=g.transform;
		insertScene.transform.localPosition=Vector3.zero;
		insertScene.transform.localRotation=Quaternion.identity;
		insertScene.SetActive(false);
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
//удаление объекта со сцены и добавление в инвентарь
//******************************************
function AddItem(Item:Element,g:GameObject){
	var	res = toArray(Item);
	insertToInventory(g,Item.type,res);
	CalcElement();
	audio.clip = soundFx.invInsert;
	audio.Play();
}


//******************************************
//Удаление и создание объекта на сцене
//******************************************
function removeItem(index:int){	
	insertToScene(items[index].items[0]._id,items[index].items[0]);
	drArray(index);
	CalcElement();
	audio.clip = soundFx.invDrop;
	audio.Play();
}

//******************************************
//Удаление объекта из активного окна
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
//Добавление элемента в активное окно
//******************************************
function insertToActive(type:int,index:int){
	dropInActive(type,function(){
		Actives[type] = items[index].items[0];
		drArray(index);
		selected = -1;
		getScript(Actives[type]._id.transform.parent.gameObject).ObjectActive();
		getScript(Actives[type]._id.transform.parent.gameObject).enabled = true;
	});
	audio.clip = soundFx.invInsert;
	audio.Play();
}
//******************************************
//Добавление элемента в активное окно
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
//Визуальное обнаружение объекта
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
		}else{itemIcon=false;}
		if (hit.collider.gameObject.tag=="ShopBox"){
			if (Input.GetKeyDown("f")){
				showShop = !showShop;
				
				ShopGm = hit.collider.gameObject;
				if (gameControl.ActivateGUI){
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
		
	}else{itemIcon=false;}
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
		print('Нет покупок');
	}else
	{
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
				print('У НПС НЕТ ДЕНЕГ');
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
				print('У тебя НЕТ ДЕНЕГ');
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
//Визуализация
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
function placeElement(cx:int,cy:int,maxX:int,maxY:int,item:Vector2,cb:Function) {
	cx+=item.x;
	if (maxY <= item.y){
		maxY = item.y;
		//maxLength = maxY;
		maxX += item.x;
	}	
	if (maxX==windowSize.x){maxX=0;}
	if(cx+item.x-15>windowSize.x){
		cx=maxX;
		cy+=item.y;
		if (cy+item.y>=cy+maxY){
			cx=0;				
		}
		maxX = 0; maxY = 0;
													
	}
  cb(cx,cy,maxX,maxY);
}

function OnGUI(){
	if (!showShop&&!goodShop)
		noShop();
	if (!showGUI&&!showShop&&!paypal){
				gameControl.ActivateGUI = true;
	}
	//Show inventory
	var SCRWidth = Screen.width;
	var slise = 0.0;
	if (SCRWidth >= 1350){
		SCRWidth = 1350;
		slise = (Screen.width - SCRWidth)/2;
	}else{
		slise = 0;
	}
	
	//==================================================================================
	GUI.DrawTexture(Rect(SCRWidth/2-16,Screen.height/2-16,32,32),TxGUI.center);
	
	if (showGUI){
		GUI.BeginGroup (Rect (slise,0,SCRWidth,Screen.height));
		showShop = false;
		gameControl.ActivateGUI = true;
		windowSize.x = (SCRWidth-50)*0.30086;
		windowSize.y = (Screen.height-200)*0.92;
		SizeBorder.x = (SCRWidth)*0.0145;
		
		windowSize.x = (SCRWidth-100)*0.325;
		ScaleIcons = windowSize.x * 0.00156;
		var index = 0; maxX = 0; maxY = 0;
		winPos.x = 0; 
		var currentX=0; var currentY=0;
		GUI.DrawTexture(Rect(100,0,SCRWidth-200,TxGUI.activeBackDrop.height-20),TxGUI.activeBackDrop,ScaleMode.StretchToFill);
		
		GUI.DrawTexture(Rect(50,140,  SCRWidth-100, Screen.height-200),TxGUI.backDrop,ScaleMode.StretchToFill);
		
		
		if (Actives[0].name!="NULLITEM"){
			if (GUI.Button(Rect(SCRWidth/2-TxGUI.activeBackDrop.width/2+50,winPos.y+25,Actives[0].ISGet().x,Actives[0].ISGet().y),Actives[0].sprite,TxGUI.Gui)){
				if (Time.time> dclick+0.3){
					dclick = Time.time;	
				}else{
					dropInActive(0,function(){});
				}
			}
		}

		
		if (Actives[1].name!="NULLITEM"){
			if (GUI.Button(Rect((SCRWidth-300)*0.38,10,Actives[1].ISGet().x,Actives[1].ISGet().y),Actives[1].sprite,TxGUI.Gui)){
				if (Time.time> dclick+0.3){
					dclick = Time.time;	
				}else{
					dropInActive(1,function(){});
				} 
			}
		}
		if (Actives[2].name!="NULLITEM"){
			if (GUI.Button(Rect(windowSize.x+SCRWidth*0.525,Screen.height*0.3,TxGUI.StandartArmor.width,TxGUI.StandartArmor.height),Actives[2].option.big_pre,TxGUI.Gui)){
				if (Time.time> dclick+0.3){
					dclick = Time.time;	
				}else{
					dropInActive(2,function(){});
				}
			}
		}else{
			GUI.DrawTexture(Rect(windowSize.x+SCRWidth*0.515,Screen.height*0.3,TxGUI.StandartArmor.width,TxGUI.StandartArmor.height),TxGUI.StandartArmor,ScaleMode.StretchToFill);	
		}
		
		var cX = 0;var cY = 0; var idx = 0;
		
		if (passActive.length>0){
			//var border = ScaleIcons+TOP;
			var border = ((SCRWidth-300)*0.1)*0.0085;
			for(var item in passActive){
				if (GUI.Button(Rect(cX+(SCRWidth*0.565),40,64*border,64*border),item.sprite,TxGUI.Gui)){
					if (Time.time> dclick+0.3)dclick = Time.time;	else	dropToPassActive(idx);
				}
				cX +=64*border ;idx++;
			}
		}
		
		scrollPosition = GUI.BeginScrollView (Rect (50+SizeBorder.x,175,windowSize.x, windowSize.y),scrollPosition, Rect (0, 0, 0, scrollLength));
		if (scrollLength<windowSize.y) scrollLength=windowSize.y;
		DrawTiled(Rect(0,0,windowSize.x,scrollLength),TxGUI.grid,ScaleIcons,10);
		scrollLength = 0;
		var maxLength = 0;
		
		// Распределение элементов
		for(var item in items){
			//КНОПКА	
			if (GUI.Button(Rect(currentX,currentY,item.items[0].ISGet().x*ScaleIcons,item.items[0].ISGet().y*ScaleIcons),item.items[0].sprite,TxGUI.Gui)){
				selected = index;
				if (Time.time> dclick+0.3){
					dclick = Time.time;	
				}else{
					clickItem(item.items[0].type,index);
					dclick = Time.time;	
				}
			}
			if (item.count>1)
				GUI.Label(Rect(currentX+5,currentY,item.items[0].ISGet().x,item.items[0].ISGet().y), "x"+item.count.ToString());
			
			placeElement(currentX,currentY,maxX,maxY,Vector2(item.items[0].ISGet().x*ScaleIcons,item.items[0].ISGet().y*ScaleIcons),function(cx,cy,mX,mY){
				currentX = cx;
				currentY = cy;
				maxX = mX;
				maxY = mY;
			});

			index++;
			
		}
		scrollLength = 64*ScaleIcons + currentY + maxY;
		GUI.EndScrollView ();
		
			GUI.Label(Rect(Mathf.FloorToInt(SCRWidth*0.722),Mathf.FloorToInt(Screen.height*0.63),100,30), gameControl.actorMoney.ToString() ,TxGUI.GuiText);
		if (selected>=0){
			GUI.Label(Rect(Mathf.FloorToInt(SCRWidth/2.520),Mathf.FloorToInt(Screen.height/2.03),160,30), items[selected].items[0].option.name,TxGUI.GuiText);
			GUI.Label(Rect(SCRWidth*0.396,35+((Screen.height)*0.525),windowSize.x-SizeBorder.x*2,200), items[selected].items[0].option.description);
			GUI.Label(Rect(Mathf.FloorToInt(SCRWidth/1.73),Mathf.FloorToInt(Screen.height/2.03),160,30), items[selected].items[0].option.price.ToString(),TxGUI.GuiText);
			GUI.DrawTexture(Rect(SCRWidth*0.57,Screen.height*0.548,Mathf.FloorToInt((SCRWidth/10.3)/100*items[selected].items[0].option.status),4),TxGUI.slider);
			GUI.DrawTexture(Rect((SCRWidth*0.53)-(items[selected].items[0].ISGet().x/2),Screen.height*0.26,items[selected].items[0].ISGet().x,items[selected].items[0].ISGet().y),items[selected].items[0].sprite,ScaleMode.StretchToFill);
		}
		GUI.EndGroup ();
	}
	

	
	if (showShop){
		index = 0; goodShop = false;
		windowSize.x =  SCRWidth*0.2774953125;
		windowSize.y = (Screen.height-TxGUI.activeBackDrop.height)*0.8690938511;

		SizeBorder.x = (SCRWidth)*0.0272001625;
		ScaleIcons = windowSize.x * 0.001953;
		maxX = 0; maxY = 0; winPos.x = 0; 	
		//GUI.DrawTexture(Rect(winPos.x,0+TxGUI.activeBackDrop.height,  SCRWidth, Screen.height-TxGUI.activeBackDrop.height),TxGUI.backDropPay,ScaleMode.StretchToFill);
		GUI.DrawTexture(Rect(50,140,  SCRWidth-100, Screen.height-200),TxGUI.backDropPay,ScaleMode.StretchToFill);
		scrollPosition = GUI.BeginScrollView (Rect (winPos.x+SizeBorder.x,winPos.y+TxGUI.activeBackDrop.height+20,windowSize.x, windowSize.y),scrollPosition, Rect (0, 0, 0, scrollLength));

		GUI.DrawTextureWithTexCoords (Rect(0,0,windowSize.x,scrollLength), TxGUI.grid, Rect(0, 0,8.05,scrollLength/(TxGUI.grid.height*ScaleIcons)));
		scrollLength = 0;
		// Распределение элементов
		for(var item in items){
			//КНОПКА	
			if (GUI.Button(Rect(currentX,currentY,item.items[0].ISGet().x*ScaleIcons,item.items[0].ISGet().y*ScaleIcons),item.items[0].sprite,TxGUI.Gui)){
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
			if (item.count>1)
				GUI.Label(Rect(currentX+5,currentY+5,item.items[0].ISGet().x,item.items[0].ISGet().y), "x"+item.count.ToString());
			placeElement(currentX,currentY,maxX,maxY,Vector2(item.items[0].ISGet().x*ScaleIcons,item.items[0].ISGet().y*ScaleIcons),function(cx,cy,mX,mY){
				currentX = cx;
				currentY = cy;
				maxX = mX;
				maxY = mY;
			});
			index++;
			
		}
		scrollLength = 64*ScaleIcons + currentY + maxY;
		GUI.EndScrollView ();
		
		index = 0;
		// Коробка
		currentX=0;currentY=0;winPos.x = 0; maxX = 0; maxY = 0; winPos.x = 0; SizeBorder.x = (SCRWidth)*0.698;
		scrollPositionx = GUI.BeginScrollView (Rect (SizeBorder.x,winPos.y+TxGUI.activeBackDrop.height+20,windowSize.x, windowSize.y),scrollPositionx, Rect (0, 0, 0, scrollLengthx));
		GUI.DrawTextureWithTexCoords (Rect(0,0,windowSize.x,scrollLengthx), TxGUI.grid, Rect(0, 0,8.05,scrollLengthx/(TxGUI.grid.height*ScaleIcons)));
		scrollLengthx = 0;
		// Распределение элементов
		paypal = ShopGm.GetComponent(InventoryBox).paypal;
		for(var item in ShopGm.GetComponent(InventoryBox).items){
			if (GUI.Button(Rect(currentX,currentY,item.items[0].ISGet().x*ScaleIcons,item.items[0].ISGet().y*ScaleIcons),item.items[0].sprite,TxGUI.Gui)){
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
			placeElement(currentX,currentY,maxX,maxY,Vector2(item.items[0].ISGet().x*ScaleIcons,item.items[0].ISGet().y*ScaleIcons),function(cx,cy,mX,mY){
				currentX = cx;
				currentY = cy;
				maxX = mX;
				maxY = mY;
			});
			index++;
			
		}
		scrollLengthx = 64*ScaleIcons + currentY + maxY;
		GUI.EndScrollView ();
// ПОКУПКА ПРОДАЖА
		if (paypal){
			index = 0;
			// Игрок
			currentX=0;currentY=0;winPos.x = 0; maxX = 0; maxY = 0; winPos.x = 0; SizeBorder.x = (SCRWidth)*0.352;
			windowSize.x =  SCRWidth*0.3074953125;
			ScaleIcons = windowSize.x * 0.001953;
			windowSize.y =(Screen.height-TxGUI.activeBackDrop.height)*0.365;
			var Rects = Rect(SizeBorder.x+windowSize.x/2,windowSize.y*3+winPos.y+TxGUI.activeBackDrop.height-120,windowSize.x*0.5,30);
////////////////////////////////////////////////////////kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk			
			GUI.Label(Rect(Mathf.FloorToInt(SCRWidth/19.45),Mathf.FloorToInt(Screen.height/4.34),100,30), gameControl.actorMoney.ToString() ,TxGUI.GuiText);
			GUI.Label(Rect(Mathf.FloorToInt(SCRWidth/1.165),Mathf.FloorToInt(Screen.height/4.34),100,30), ShopGm.GetComponent(InventoryBox).npsMoney.ToString() ,TxGUI.GuiText);
			
			scrollPositiona = GUI.BeginScrollView (Rect (SizeBorder.x,winPos.y+TxGUI.activeBackDrop.height+40,windowSize.x, windowSize.y),scrollPositiona, Rect (0, 0, 0, scrollLengtha));
			GUI.DrawTextureWithTexCoords (Rect(0,0,windowSize.x,scrollLengtha), TxGUI.grid, Rect(0, 0,8.05,scrollLengtha/(TxGUI.grid.height*ScaleIcons)));
			scrollLengtha = 0;
			// Распределение элементов
			for(var item in actTemp){
				if (GUI.Button(Rect(currentX,currentY,item.ISGet().x*ScaleIcons,item.ISGet().y*ScaleIcons),item.sprite,TxGUI.Gui)){
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
					GUI.Label(Rect(currentX+5,currentY+5,item.ISGet().x,item.ISGet().y), "x"+item.count.ToString());
				placeElement(currentX,currentY,maxX,maxY,Vector2(item.items[0].ISGet().x*ScaleIcons,item.items[0].ISGet().y*ScaleIcons),function(cx,cy,mX,mY){
					currentX = cx;
					currentY = cy;
					maxX = mX;
					maxY = mY;
				});
				index++;
				
			}
			scrollLengtha = 64*ScaleIcons + currentY + maxY;
			GUI.EndScrollView ();
			
			index = 0;
			currentX=0;currentY=0;winPos.x = 0; maxX = 0; maxY = 0; winPos.x = 0; SizeBorder.x = (SCRWidth)*0.352;
			windowSize.x =  SCRWidth*0.3074953125;
			ScaleIcons = windowSize.x * 0.001953;
			windowSize.y =(Screen.height-TxGUI.activeBackDrop.height)*0.3655;
			scrollPositionb = GUI.BeginScrollView (Rect (SizeBorder.x,winPos.y+TxGUI.activeBackDrop.height+windowSize.y+106,windowSize.x, windowSize.y),scrollPositionb, Rect (0, 0, 0, scrollLengthb));
			GUI.DrawTextureWithTexCoords (Rect(0,0,windowSize.x,scrollLengthb), TxGUI.grid, Rect(0, 0,8.05,scrollLengthb/(TxGUI.grid.height*ScaleIcons)));
			scrollLengthb = 0;
			// Распределение элементов
			for(var item in npsTemp){
				if (GUI.Button(Rect(currentX,currentY,item.ISGet().x*ScaleIcons,item.ISGet().y*ScaleIcons),item.sprite,TxGUI.Gui)){
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
				placeElement(currentX,currentY,maxX,maxY,Vector2(item.items[0].ISGet().x*ScaleIcons,item.items[0].ISGet().y*ScaleIcons),function(cx,cy,mX,mY){
					currentX = cx;
					currentY = cy;
					maxX = mX;
					maxY = mY;
				});
				index++;
				
			}
			
			scrollLengthb = 64*ScaleIcons + currentY + maxY;
			GUI.EndScrollView ();
			if (GUI.Button(Rects,"Торговать",TxGUI.GuiBtn)){
				goShop();
			}
		}
	
	
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
		if (showGUI){
			audio.clip = soundFx.invClose;
			audio.Play();
			
		}else{
			audio.clip = soundFx.invOpen;
			audio.Play();
		}
		showGUI = !showGUI;
		if (gameControl.ActivateGUI){
			gameControl.ActivateGUI = false;
		}else{
			gameControl.ActivateGUI = true;
		}
				
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