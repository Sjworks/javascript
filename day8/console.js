
var Console = function(Element, PageElement) {
	var _elElement = Element;
	var _elPage = PageElement;
	
	this.clear = function() {
		_elPage.innerHTML = "";
	};
	
	this.write = function(text) {
		var line = document.createElement("p");
		line.innerText = text;
		_elPage.appendChild(line);
		_elElement.scrollTop = _elPage.offsetHeight;
	};
}

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