let a,s,c;
function _init(){
  a = _v(0,30);
	c = _c(10,10,30);
}

function _update(){
 // a.rotate(Math.PI/32);
  if(btn("w")){ a.add(_v(0,1)) }	
  if(btn("a")){ a.add(_v(-1,0)) }	
  if(btn("s")){ a.add(_v(0,-1)) }	
  if(btn("d")){ a.add(_v(1,0)) }	

  //_v(3,4).rotate(90).normalize()
  _v(3,4).normalize()
}

function _draw(){
  clear();
  print(a);
  print(c);
}
