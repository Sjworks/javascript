//line, length, width, radius, speed, color  지원
var Spinner = function(CanvasElement, option) {
	
	var _context;
	var _test=0;
	var _nCenterX, _nCenterY;
	var _nLineAngle;
	var _nCurrLine=0;
	var _nSpeed = 100;
	var _nTimer;
	
	this.getOption = function(o) {
		return typeof o=='undefined' ? option : option[o]; 
	};
	
	this.setOption = function(name, value) {
		option[name] = value;
		applyOption();
	};
	
	this.getContext = function() {
		return _context;
	};
	
	var applyOption = function() {
		clearTimeout(_nTimer);
		_context.strokeStyle=option.color;
		_context.lineWidth = option.width;
		
		_nLineAngle = (Math.PI*2)/option.line;
		_nCurrLine = 0;
		_nSpeed = 100/option.speed;
		
		_nTimer = setTimeout(onDraw, 0);
	};
	
	var onDraw = function() {
		_context.clearRect(0, 0, _context.canvas.width, _context.canvas.height);
		var alpha = 1.0;
		var currLineAngle = _nCurrLine*_nLineAngle*-1;
		
		
		for(var i=0; i<option.line; i++){
			_context.beginPath();
			_context.strokeStyle = 'rgba('+option.color.r+', '+option.color.g+', '+option.color.b+', '+alpha+')';
			_context.moveTo(_nCenterX+Math.sin(currLineAngle)*(option.radius), _nCenterY+Math.cos(currLineAngle)*(option.radius));
			_context.lineTo(_nCenterX+Math.sin(currLineAngle)*(option.radius+option.length), _nCenterY+Math.cos(currLineAngle)*(option.radius+option.length));
			_context.stroke();
			_context.closePath()
			alpha-=0.07;
			if(alpha<0.5) alaph = 0.5;
			
			currLineAngle+=_nLineAngle;
		}
		
		_nCurrLine++;
		if(_nCurrLine>=option.line) _nCurrLine = 0;
		
		_nTimer = setTimeout(onDraw, _nSpeed);		
	};
	
	var _init = function(){
		_context = CanvasElement.getContext('2d');
		_context.lineCap = 'round';
		
		if(typeof option == 'undefined') option = {};
		if(typeof option.line != 'number') option.line = 12;
		if(typeof option.length != 'number') option.length = 7;
		if(typeof option.width != 'number') option.width = 4;
		if(typeof option.radius != 'number') option.radius = 10;
		if(typeof option.speed != 'number') option.speed = 1.0;
		if(typeof option.color != 'obejct') option.color = {r:255, g:255, b:255};
		if(typeof option.color.r != 'number') object.color.r = 255;
		if(typeof option.color.g != 'number') object.color.g = 255;
		if(typeof option.color.b != 'number') object.color.b = 255;
		
		_nCenterX = _context.canvas.width/2;
		_nCenterY = _context.canvas.height/2;
		
		applyOption();
	};
	
	_init();
}