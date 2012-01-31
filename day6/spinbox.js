//forIE
if(!console){
	var console = {
		debug : function(){}
	}
}

//SpinBox
var SpinBox = function(TextElement, UpElement, DownElement, Option, ChangeListener) {
	
	var _elText = TextElement;
	var _oUp;
	var _oDown;
	var _Option = Option;
	var _nValue=parseInt(_elText.value);
	var _eChangeHandler;
	
	var onLeaveFocus = function(){
		_nValue = parseInt(((_elText.value).match(/(^[-|+])|([0-9]+)/g)).join(''));
		if(isNaN(_nValue)) _nValue = 0;
		
		checkRange();
		update();
		console.debug("leave: "+_nValue);
		if(typeof _eChangeHandler == 'function') _eChangeHandler();
	};
	
	var onChange = function() {
		_nValue=parseInt(_elText.value);
		console.debug("change: "+_nValue);
	};
	
	var Inc = function(){
		_nValue+=1;
		checkRange();
		update();
	};
	
	var Dec = function(){
		_nValue-=1;
		checkRange();
		update();
	};
	
	var checkRange = function() {
		if(typeof _Option.max == 'number')
			_nValue = _nValue>_Option.max?_Option.max:_nValue;
		if(typeof _Option.min == 'number')
			_nValue = _nValue<_Option.min?_Option.min:_nValue;
	};
	
	var update = function() {
		if(_nValue != _elText.value){
			_elText.value = _nValue;
			if(typeof _eChangeHandler == 'function') _eChangeHandler();
		}
	};
	
	var init = function(){
	
		//Option
		if(typeof _Option != 'object') _Option = {};
		if(typeof _Option.value != 'undefined')
			_nValue = parseInt(_Option.value);
		
		_eChangeHandler = ChangeListener;
		
		//KeppPressingButton
		oUp = new KeepPressingButton(UpElement);
		oDown = new KeepPressingButton(DownElement);		
		
		//Event
		addEvent(_elText, 'blur', onLeaveFocus);
		addEvent(_elText, 'change', onChange);
		oUp.setPressEventListener(Inc);
		oDown.setPressEventListener(Dec);
		
		update();
	};
	
	init();
};

//계속 눌림 버튼
var KeepPressingButton = function(ButtonElement, Option) {
	var _elButton = ButtonElement;
	var _Option = Option;
	var _fCallback;
	var _tPress;
	var _oTimer;
	var _bPress = false;
	var _bKeep = false;
		
	this.setPressEventListener = function(Callback) {
		_fCallback = Callback;
	};
	
	var onTime = function() {
		if(typeof _fCallback == 'function') _fCallback('keep');
		_oTimer = setTimeout(onTime, _Option.interval);
		_bKeep = true;
	}
	
	var onMouseDown = function() {
		_bPress = true;
		_tPress = new Date();
		_oTimer = setTimeout(onTime, _Option.firstInterval);
	};
	
	var onMouseUp = function() {
		if(!_bPress) return;
		_bPress = false;
		if(!_bKeep){
			if(typeof _fCallback == 'function') _fCallback('click');
		}
		_bKeep = false;
		clearTimeout(_oTimer);
	};
	
	var init = function(){
		//Option
		if(typeof _Option != 'object') _Option = {};
		if(typeof _Option.firstInterval != 'number')
			_Option.firstInterval = 500;
		if(typeof _Option.interval != 'number')
			_Option.interval = 100;
		
		//Event
		addEvent(_elButton, 'mousedown', onMouseDown);
		addEvent(document, 'mouseup', onMouseUp);
	};
	
	init();
};


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