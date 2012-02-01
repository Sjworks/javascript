/**
 * 
 * 
 * 
 */


//forIE
if(!console){
	var console = {
		debug : function(){}
	}
}

var SpinBox = $Class({
	_woText: null,
	_oBtnUpn: null,
	_oBtnDown: null,
	_Option: null,
	_nValue: 0,
	_eChangeHandler: null,
	
	$init : function(TextElement, UpElement, DownElement, Option, ChangeListener) {
		//wrapping
		if(typeof TextElement == 'string')
			this._woText = $Element($(TextElement));
		else 
			this._woText = $Element(TextElement);		
		
		//Option
		this._Option = Option;
		if(typeof this._Option != 'object') this._Option = {};
		if(typeof this._Option.value != 'undefined')
			this._nValue = parseInt(this._Option.value);
		
		this._eChangeHandler = ChangeListener;
		
		//KeppPressingButton
		this._oBtnUp = new KeepPressingButton(UpElement);
		this._oBtnDown = new KeepPressingButton(DownElement);		
		
		//Event
		$Fn(this.onLeaveFocus, this).attach(this._woText, 'blur');
		$Fn(this.onChange, this).attach(this._woText, 'change');
		this._oBtnUp.setPressEventListener($Fn(this.inc, this).bind());
		this._oBtnDown.setPressEventListener($Fn(this.dec, this).bind());
		
		this.update();
	},
	onLeaveFocus: function(event) {
		this._nValue = parseInt(((this._woText.$value().value).match(/(^[-|+])|([0-9]+)/g)).join(''));
		if(isNaN(this._nValue)) this._nValue = 0;
		
		this.checkRange();
		this.update();

		if(typeof this._eChangeHandler == 'function') this._eChangeHandler();
	},
	onChange: function(event) {
		this._nValue=parseInt(this._woText.$value().value);
	},
	inc: function() {
		this._nValue+=1;
		this.checkRange();
		this.update();
	},
	dec: function() {
		this._nValue-=1;
		this.checkRange();
		this.update();
	},
	checkRange: function() {
		if(typeof this._Option.max == 'number')
			this._nValue = this._nValue>this._Option.max?this._Option.max:this._nValue;
		if(typeof this._Option.min == 'number')
			this._nValue = this._nValue<this._Option.min?this._Option.min:this._nValue;
	},
	update: function() {
		if(this._nValue != this._woText.$value().value){
			this._woText.$value().value = this._nValue;
			if(typeof this._eChangeHandler == 'function') this._eChangeHandler();
		}
	}
});

var KeepPressingButton = $Class({
	_woButton: null,
	_Option: null,
	_fHandler: null,
	_tPress: null,
	_nTimer: null,
	_bPress: false,
	_bKeep: false,
	
	$init: function(ButtonElement, Option) {
		//wrapping
		if(typeof ButtonElement == 'string')
			this._woButton = $Element($(ButtonElement));
		else 
			this._woButton = $Element(ButtonElement);	
		
		//Option
		this._Option = Option
		if(typeof this._Option != 'object') this._Option = {};
		if(typeof this._Option.firstInterval != 'number')
			this._Option.firstInterval = 500;
		if(typeof this._Option.interval != 'number')
			this._Option.interval = 100;
		
		//Event
		$Fn(this.onMouseDown, this).attach(this._woButton, 'mousedown');
		$Fn(this.onMouseUp, this).attach(this._woButton, 'mouseup');
	},
	onMouseDown: function() {
		this._bPress = true;
		this._tPress = new Date();
		this._nTimer = setTimeout($Fn(this.onTime, this).bind(), this._Option.firstInterval);
	},
	onMouseUp: function() {
		if(!this._bPress) return;
		this._bPress = false;
		if(!this._bKeep){
			if(typeof this._fCallback == 'function') this._fCallback('click');
		}
		this._bKeep = false;
		clearTimeout(this._nTimer);
	},
	onTime: function() {
		if(typeof this._fCallback == 'function') this._fCallback('keep');
		this._nTimer = setTimeout($Fn(this.onTime, this).bind(), this._Option.interval);
		this._bKeep = true;
	},
	setPressEventListener: function(Handler) {
		this._fCallback = Handler;
	}
});

