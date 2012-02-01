
var Console = $Class({
	_woElement: null,
	_woPage: null,
	$init : function(Element){
		this._woElement = $Element(Element);
		this._woPage = this._woElement.first();
	},
	clear : function() {
		this._woPage.empty();
	},
	write : function(Text) {
		var p = $Element('<p>'+Text+'</p>')
		p.appendTo(this._woPage);
		
		this._woElement.$value().scrollTop = this._woPage.height();
	}
});


//이벤트 관련 함수(IE 호환)
function addEvent(Element, EventType, Handler) {

	if(document.addEventListener) {
		//DOM 표준
		Element.addEventListener(EventType, Handler, false);
	}else if(document.attachEvent) {
		//IE	
		Element.attachEvent("on"+EventType, Handler);
	}
};

//Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};