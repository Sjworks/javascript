//상품 목록
var goods = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

/**
 * 상품 전시 영역 클래스
 */
var GoodsDisplay = function(ShelfElement) {
	
	var _aGoods = new Array();
	var _elShelf = ShelfElement;
	
	var _onClick = function(e, a) {
		console.debug(a);
		_aGoods[a.index].sale();
	}
	
	var _init = function() {
		
		//상품 목록 랜덤 생성
		for(var i=0; i<8; i++){
			var j = Math.floor(Math.random()*goods.length);
			var price = (Math.floor(Math.random()*8)+1)*100;
			var amount = Math.floor(Math.random()*3)+1;
			
			_aGoods.push(new Goods(_elShelf, i, goods[j], price, amount));
			_aGoods[i].setClickListener(_onClick);
			goods.remove(j);
		}
		
	};
	
	_init();
};

/**
 * 상품 한개에 대한 클래스
 * DOM : <li class="good"><span class="name">얏호</span><span class="price">1000원</span></li>
 */
var Goods = function(ParentElement, Index, Name, Price, Amount) {

	var _nIndex = Index;
	var _obj;
	var _elName;
	var _elPrice;
	var _elParent = ParentElement;
	var _nPrice = Price;
	var _sName = Name;
	var _nAmount = Amount;
	var _eClickHandler;
	
	this.setClickListener = function(Handler) {
		_eClickHandler = Handler;
	};
	
	this.getName = function(){
		return _sName;
	};
	
	this.getPrice = function() {
		return _nPrice;
	};
	
	this.getAmount = function() {
		return _nAmount;
	};
	
	this.sale = function() {
		if(_nAmount <=0) return ;
		
		_nAmount--;
		if(_nAmount==0){//품절 처리
			if(!_obj.className)
				_obj.className = 'soldout';
			else
				_obj.className += ' soldout';
		}
	};
	
	var _onClick = function(e) {
		if(!e) e = window.event;
	
		if(typeof _eClickHandler == 'function')
			_eClickHandler(e, {index: _nIndex, amount: _nAmount, name: _sName, price: _nPrice});
	};
	
	var _init = function() {
		//DOM Elements
		_obj = document.createElement('li');
		_obj.className = 'goods';
		
		_elName = document.createElement('span');
		_elName.className = 'name';
		_elName.innerText = _sName;
		
		_elPrice = document.createElement('span');
		_elPrice.className = 'price';
		_elPrice.innerText = _nPrice + '원';
		
		_obj.appendChild(_elName);
		_obj.appendChild(_elPrice);
		
		_elParent.appendChild(_obj);
		
		//event
		addEvent(_obj, 'click', _onClick);
	};
	
	_init();
}