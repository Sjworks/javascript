//forIE
if(!console){
	var console = {
		debug : function(){}
	}
}

//SpinBox
var SpinBox = function(TextElement, UpElement, DownElement, Option) {
	
	var _elText = TextElement;
	var _oUp;
	var _oDown;
	var _Option = Option;
	var _nValue=parseInt(_elText.value);
	
	var onLeaveFocus = function(){
		_nValue = parseInt(((_elText.value).match(/(^[-|+])|([0-9]+)/g)).join(''));
		if(isNaN(_nValue)) _nValue = 0;
		
		checkRange();
		update();
		console.debug("leave: "+_nValue);
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
		_elText.value = _nValue;
	};
	
	var init = function(){
	
		//Option
		if(typeof _Option != 'object') _Option = {};
		if(typeof _Option.value != 'undefined')
			_nValue = parseInt(_Option.value);
		
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
	
	this.test = function() {

		module("SpinBox");
		
		test("check Up/Down", function() {
			var t1 = _nValue;
			Inc();			
			equal(_elText.value, t1+1, "Check Value 1");
			Dec();
			equal(_elText.value, t1, "Check Value 2");
			
			if(typeof _Option.max == 'number'){
				_nValue = _Option.max;
				update();
				Inc();
				equal(_elText.value, _Option.max, "Check Value (max)");
			}
			
			if(typeof _Option.min == 'number'){
				_nValue = _Option.min;
				update();
				Dec();
				equal(_elText.value, _Option.min, "Check Value (min)");
			}
			
		});

		test("checkRange", function() {
			_nValue = _Option.max+_Option.max;
			checkRange();
			update();
			
			ok(_nValue == _Option.max, "Range");
		});
		
		test("checkWrongChar", function() {
			_elText.value = "-a1b2c3b";
			onLeaveFocus();
			equal(_elText.value, 100, "Check Wrong Char 1");
			
			_elText.value = "afd12egf3";
			onLeaveFocus();
			equal(_elText.value, 123, "Check Wrong Char 2");
		});
		
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
	
	
	this.testInit = function(firstInterval, interval){
		module("KeepPressingButton");

		test("InitValue", function() {
			equal(_Option.firstInterval, firstInterval, "firstInterval");
			equal(_Option.interval, interval, "interval");
		});

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