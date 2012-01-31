
function dragable(Element, TargetElement, dropCallback) {
	var _bDown = false;
	
	var startX, startY;
	var orignX, orignY;
	var deltaX, deltaY;
	
	var _elClone;
	var _elParent = Element.parentNode;
	
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
		
		startX = e.clientX;
		startY = e.clientY;
		orignX = Element.offsetLeft;
		orignY = Element.offsetTop;
		deltaX = startX - orignX;
		deltaY = startY - orignY;
		
		_elClone = Element.cloneNode(true);
		_elClone.removeAttribute('id');
		//_elClone.removeAttribute('class');
		copyComputedStyle(Element, _elClone);
		
		
		//_elClone.style.cssText = getCssText(Element);
		_elClone.style.zIndex = 1000;
		_elParent.appendChild(_elClone);
		
		if (e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
		
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		
		_bDown = true;
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
		
		_elParent.removeChild(_elClone);
		
		if((e.clientX - deltaX) > TargetElement.offsetLeft-Element.offsetWidth && (e.clientX - deltaX) < TargetElement.offsetLeft+TargetElement.offsetWidth &&
				(e.clientY - deltaY) > TargetElement.offsetTop-Element.offsetHeight && (e.clientY - deltaY) < TargetElement.offsetTop+TargetElement.offsetHeight){
			if(typeof dropCallback == 'function')
				dropCallback();
		}
	
		_bDown = false;
		if(e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
	}
		
	function realStyle(_elem, _style) {
	    var computedStyle;
	    if ( typeof _elem.currentStyle != 'undefined' ) {
	        computedStyle = _elem.currentStyle;
	    } else {
	        computedStyle = document.defaultView.getComputedStyle(_elem, null);
	    }

	    return _style ? computedStyle[_style] : computedStyle;
	};

	function copyComputedStyle(src, dest) {
	    var s = realStyle(src);
	    for ( var i in s ) {
	        if ( typeof i == "string" && i != "cssText" && !/\d/.test(i) ) {
	                try {
	                        dest.style[i] = s[i];
	                        // `fontSize` comes before `font` If `font` is empty, `fontSize` gets
	                        // overwritten.  So make sure to reset this property. (hackyhackhack)
	                        // Other properties may need similar treatment
	                        if ( i == "font" ) {
	                                dest.style.fontSize = s.fontSize;
	                        }
	                } catch (e) {}
	        }
	    }
	};
}