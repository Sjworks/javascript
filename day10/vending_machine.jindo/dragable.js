
function dragable(Element, TargetElement, dropCallback) {
	var _bDown = false;
	
	var startX, startY;
	var orignX, orignY;
	var deltaX, deltaY;
	
	var _elClone;
	
	if(document.addEventListener) {
		Element.addEventListener("mousedown", onMousedown, true);
		document.addEventListener("mousemove", onMousemove, true);
		document.addEventListener("mouseup", onMouseup, true);
	}
	else if (document.attachEvent) {
		Element.setCapture();
		Element.attachEvent("onmousedown", onMousedown);
		document.attachEvent("onmousemove", onMousemove);
		document.attachEvent("onmouseup", onMouseup);
		Element.attachEvent("onlosecapture", onMouseup);
	}
	
	function onMousedown(e){
		if(!e) e = window.event;
			
		var rect = Element.getBoundingClientRect();
		startX = e.clientX;
		startY = e.clientY;
		orignX = rect.left+scrollX();//Element.offsetLeft;
		orignY = rect.top+scrollY();//Element.offsetTop;
		deltaX = startX - orignX;
		deltaY = startY - orignY;
		
		_elClone = Element.cloneNode(true);
		_elClone.removeAttribute('id');
		
		_elClone.style.zIndex = 1000;
		document.body.appendChild(_elClone);
		
		if (e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
		
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		
		_bDown = true;
		onMousemove(e);
	}
	
	function onMousemove(e){
		if(!e) e = window.event;
		if(!_bDown) return;
		
		_elClone.style.left = (e.clientX - deltaX) + "px";
		_elClone.style.top = (e.clientY - deltaY) + "px";
		
		if(e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
	}
	
	function onMouseup(e){
		if(!e) e = window.event;
		if(!_bDown) return;
		
		var targetRect = TargetElement.getBoundingClientRect();
		var cloneRect = _elClone.getBoundingClientRect();
		var targetDrop;	
		if(cloneRect.right > targetRect.left && cloneRect.left < targetRect.right &&
				cloneRect.top < targetRect.bottom && cloneRect.bottom > targetRect.top){
			targetDrop = true;
		} else {
			targetDrop = false;
		}
		if(typeof dropCallback == 'function')
			dropCallback(targetDrop);
	
		document.body.removeChild(_elClone);
		_bDown = false;
		if(e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;		
	}
	
	function scrollX() {
		return window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
	}
	function scrollY() {
		return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
	}

}