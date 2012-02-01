/**
 * TODO: 옵션, 이벤트의 다양화
 * TODO: Clone 앨리먼트를 생성할때 css 속성을 인라인으로 복제해서 드래그 되어야 하지 않을까?(인라인 과 id값으로 지정된 스타일이 있을지도 모르는데..)
 */

$Element.prototype.dragable = function(TargetElement, DropHandler) {
	var _bDown = false;
	var startX, startY;
	var orignX, orignY;
	var deltaX, deltaY;
	
	var _woClone;
	var _woTarget = $Element(TargetElement);
	
	
	$Fn(onMousedown, this).attach(this, 'mousedown');
	$Fn(onMousemove, this).attach(document, 'mousemove');
	$Fn(onMouseup, this).attach(document, 'mouseup');
	
	
	function onMousedown(event) {

		var pos = event.pos();
		startX = pos.pageX; startY = pos.pageY;
		
		var offset = this.offset();
		orignX = offset.left; orignY = offset.top;
		
		deltaX = startX - orignX; deltaY = startY - orignY;
		
		_woClone = $Element(this.outerHTML());
		_woClone.attr('id', null);
		
		_woClone.css('zIndex', '1000');
		_woClone.css('position', 'absolute');
		_woClone.appendTo(document.body);
		
		event.stop();
		
		_bDown = true;
		onMousemove(event);
	};
	
	function onMousemove(event) {
		
		if(!_bDown) return;
		
		var pos = event.pos();
		_woClone.offset(pos.pageY - deltaY, pos.pageX - deltaX);
				
		event.stop($Event.CANCEL_BUBBLE);
	};
	
	function onMouseup(event) {
		if(!_bDown) return;
		
		if(_woTarget != null){
			var targetRect = _woTarget.$value().getBoundingClientRect();
			var cloneRect = _woClone.$value().getBoundingClientRect();
			var targetDrop;	
			if(cloneRect.right > targetRect.left && cloneRect.left < targetRect.right &&
					cloneRect.top < targetRect.bottom && cloneRect.bottom > targetRect.top){
				targetDrop = true;
			} else {
				targetDrop = false;
			}
			if(typeof DropHandler == 'function')
				DropHandler(targetDrop);
		}
	
		_woClone.leave();
		_bDown = false;
		
		event.stop($Event.CANCEL_BUBBLE);
	};
	
	return this;
};