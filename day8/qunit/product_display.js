//상품 목록
var product = ['코카콜라', '펩시콜라', '칠성사이다', '사과드링크', '비트500', '봉봉오렌지', '옥수수 수염차', '류', '식혜', '조지아 오리지널'];

/**
 * 상품 전시 영역 클래스
 */
var ProductDisplay = function(ShelfElement) {
	
	var _aProduct = new Array();
	var _elShelf = ShelfElement;
	var _eClickHandler;
	
	var _onClick = function(e, a) {
		if(typeof _eClickHandler == 'function'){
			if(_eClickHandler(e, a)){
				_aProduct[a.index].sale();
			}
		}
	}
	
	this.setClickListener = function(Handler) {
		_eClickHandler = Handler;
	};
	
	var _init = function() {
		
		//상품 목록 랜덤 생성
		for(var i=0; i<8; i++){
			var j = Math.floor(Math.random()*product.length);
			var price = (Math.floor(Math.random()*8)+1)*100;
			var amount = Math.floor(Math.random()*3)+1;
			
			_aProduct.push(new Product(_elShelf, i, product[j], price, amount));
			_aProduct[i].setClickListener(_onClick);
			product.remove(j);
		}
		
	};

	this.testProductDisplay = function(){
		test("Product", function(){
			var nowAmount = _aProduct[7].getAmount();
			_aProduct[7].sale();
			equal(_aProduct[7].getAmount(), nowAmount-1, 'Amount Count Test');
			_aProduct[7].sale();
			_aProduct[7].sale();
			_aProduct[7].sale();
			_aProduct[7].sale();
			equal(_aProduct[7].getAmount(), 0, 'Soldout Count Test');
		});
	};
	
	_init();
	

};

/**
 * 상품 한개에 대한 클래스
 * DOM : <li class="product"><span class="name">상품명</span><span class="price">1000원</span></li>
 */
var Product = function(ParentElement, Index, Name, Price, Amount) {

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
		_obj.className = 'product';
		
		_elName = document.createElement('span');
		_elName.className = 'name';
		_elName.innerHTML = _sName;
		
		_elPrice = document.createElement('span');
		_elPrice.className = 'price';
		_elPrice.innerHTML = _nPrice + '원';
		
		_obj.appendChild(_elName);
		_obj.appendChild(_elPrice);
		
		_elParent.appendChild(_obj);
		
		//event
		addEvent(_obj, 'click', _onClick);
	};
	
	_init();
}