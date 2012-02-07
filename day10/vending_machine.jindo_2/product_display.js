//상품 목록
var product = ['코카콜라', '펩시콜라', '칠성사이다', '사과드링크', '비트500', '봉봉오렌지', '옥수수 수염차', '류', '식혜', '조지아 오리지널'];

/**
 * 상품 전시 영역 클래스
 */
var ProductDisplay = $Class({
	_aProduct : [],
	_woShelf : null,
	_eClickHandler : null,
	
	$init : function(ShelfElement) {
		//상품 목록 랜덤 생성
		
		for(var i=0; i<8; i++){
			this._woShelf = $Element(ShelfElement);
			
			var j = Math.floor(Math.random()*product.length);
			var price = (Math.floor(Math.random()*8)+1)*100;
			var amount = Math.floor(Math.random()*3)+1;
			
			this._aProduct.push(new Product(this._woShelf, i, product[j], price, amount));
			this._aProduct[i].setClickListener($Fn(this._onClick, this).bind());
			product.remove(j);
		}
	},
	
	_onClick : function(event, a) {
		if(typeof this._eClickHandler == 'function'){
			if(this._eClickHandler(event, a)){
				this._aProduct[a.index].sale();
			}
		}
	},
	
	setClickListener : function(Handler) {
		this._eClickHandler = Handler;
	} 
	
});


/**
 * 상품 한개에 대한 클래스
 * DOM : <li class="product"><span class="name">상품명</span><span class="price">1000원</span></li>
 */

var Product = $Class({
	_nIndex : 0,
	_woParent : null,
	_woElement : null,
	_woName : null,
	_woPrice : null,
	_sName : "",
	_nAmount : 0,
	_nPrice : 0,
	_eClickHandler : null,
	
	$init : function(ParentElement, Index, Name, Price, Amount) {
		this._woParent = $Element(ParentElement);
		
		this._nIndex = Index;
		this._nAmount = Amount;
		this._sName = Name;
		this._nPrice = Price;
		
		//DOM Elements
		this._woElement = $Element('<li></li>');
		this._woElement.addClass('product');
		
		this._woName = $Element('<span></span>');
		this._woName.addClass('name');
		this._woName.text(this._sName);
		
		this._woPrice = $Element('<span></span>');
		this._woPrice.addClass('price');
		this._woPrice.text(this._nPrice + '원');
		
		this._woName.appendTo(this._woElement);
		this._woPrice.appendTo(this._woElement);
		
		this._woElement.appendTo(this._woParent);
		
		//event
		$Fn(this._onClick, this).attach(this._woElement, 'click');
	},
	
	_onClick : function(Event) {
		if(typeof this._eClickHandler == 'function')
			this._eClickHandler(Event, {index: this._nIndex, amount: this._nAmount, name: this._sName, price: this._nPrice});
	},
	
	setClickListener : function(Handler) {
		this._eClickHandler = Handler;
	},
	
	getName : function() {
		return this._sName;
	},
	
	getPrice : function() {
		return this._nPrice;
	},
	
	getAmount : function() {
		return this._nAmount;
	},
	
	sale : function() {
		if(this._nAmount <=0) return ;
		
		this._nAmount--;
		if(this._nAmount==0){//품절 처리
			this._woElement.addClass('soldout');
		}
	}
});

//Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};