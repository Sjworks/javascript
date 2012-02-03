/**
 * Jindo Component
 * @version 1.0.2
 * NHN_Library:Jindo_Component-1.0.2;JavaScript Components for Jindo;
 * 
 * jindo.Component
 * jindo.UIComponent
 * jindo.DragArea
 */

/**
 * @fileOverview 진도 컴포넌트를 구현하기 위한 코어 클래스
 * @version 1.0.2
 */
jindo.Component = jindo.$Class({
	/** @lends jindo.Component.prototype */

	_htEventHandler : null,
	_htOption : null,

	/**
	 * jindo.Component를 초기화한다.
	 * @class 다른 컴포넌트가 상속해 사용하는 Jindo Component의 Core
	 * @constructs  
	 */
	$init : function() {
		var aInstance = this.constructor.getInstance();
		aInstance.push(this);
		this._htEventHandler = {};
		this._htOption = {};
		this._htOption._htSetter = {};
	},
	
	/**
	 * 옵션값을 설정하거나 가져온다.
	 * htCustomEventHandler 옵션을 선언해서 attach() 메소드를 사용하지 않고 커스텀 이벤트핸들러를 등록할 수 있다.
	 * @param {String} sName 옵션의 이름
	 * @param {String} sValue 옵션의 값
	 * @return {this} 컴포넌트 객체 자신
	 * @example
var MyComponent = jindo.$Class({
	method : function() {
		alert(this.option("foo"));
	}
}).extend(jindo.Component);

var oInst = new MyComponent();
oInst.option("foo", 123); // 또는 oInst.option({ foo : 123 });
oInst.method(); // 결과 123
	 * @example
//커스텀이벤트핸들러 등록예제
oInst.option("htCustomEventHandler", {
	test : function(oCustomEvent) {
	
	}
});

//이미 "htCustomEventHandler" 옵션이 설정되어있는 경우에는 무시된다.
oInst.option("htCustomEventHandler", {
	change : function(oCustomEvent) {
	
	}
});
	 */
	option : function(sName, vValue) {
		switch (typeof sName) {
			case "undefined" :
				return this._htOption;
			case "string" : 
				if (typeof vValue != "undefined") {
					if (sName == "htCustomEventHandler") {
						if (typeof this._htOption[sName] == "undefined") {
							this.attach(vValue);
						} else {
							return this;
						}
					}
					
					this._htOption[sName] = vValue;
					if (typeof this._htOption._htSetter[sName] == "function") {
						this._htOption._htSetter[sName](vValue);	
					}
				} else {
					return this._htOption[sName];
				}
				break;
			case "object" :
				for(var sKey in sName) {
					if (sKey == "htCustomEventHandler") {
						if (typeof this._htOption[sKey] == "undefined") {
							this.attach(sName[sKey]);
						} else {
							continue;
						}
					}
					
					this._htOption[sKey] = sName[sKey];
					if (typeof this._htOption._htSetter[sKey] == "function") {
						this._htOption._htSetter[sKey](sName[sKey]);	
					}
				}
				break;
		}
		return this;
	},
	
	/**
	 * 옵션의 setter 함수를 설정하거나 가져온다.
	 * 옵션의 setter 함수는 지정된 옵션이 변경되면 수행되는 함수이다.
	 * @param {String} sName setter의 이름
	 * @param {Function} fSetter setter 함수
	 * @return {this} 컴포넌트 객체 자신
	 * @example
oInst.option("sMsg", "test");
oInst.optionSetter("sMsg", function(){
	alert("sMsg 옵션값이 변경되었습니다.");
});
oInst.option("sMsg", "change"); -> alert발생
	 * @example
//HashTable 형태로 설정가능
oInst.optionSetter({
	"sMsg" : function(){
	},
	"nNum" : function(){
	}
});
	 */
	optionSetter : function(sName, fSetter) {
		switch (typeof sName) {
			case "undefined" :
				return this._htOption._htSetter;
			case "string" : 
				if (typeof fSetter != "undefined") {
					this._htOption._htSetter[sName] = jindo.$Fn(fSetter, this).bind();
				} else {
					return this._htOption._htSetter[sName];
				}
				break;
			case "object" :
				for(var sKey in sName) {
					this._htOption._htSetter[sKey] = jindo.$Fn(sName[sKey], this).bind();
				}
				break;
		}
		return this;
	},
	
	/**
	 * 이벤트를 발생시킨다.
	 * @param {Object} sEvent 커스텀이벤트명
	 * @param {Object} oEvent 커스텀이벤트 핸들러에 전달되는 객체.
	 * @return {Boolean} 핸들러의 커스텀이벤트객체에서 stop메소드가 수행되면 false를 리턴
	 * @example
//커스텀 이벤트를 발생시키는 예제
var MyComponent = jindo.$Class({
	method : function() {
		this.fireEvent('happened', {
			sHello : 'world',
			sAbc : '123'
		});
	}
}).extend(jindo.Component);

var oInst = new MyComponent().attach({
	happened : function(oCustomEvent) {
		alert(eCustomEvent.sHello + '/' + oCustomEvent.nAbc); // 결과 : world/123
	}
};

<button onclick="oInst.method(event);">Click me</button> 
	 */
	fireEvent : function(sEvent, oEvent) {
		oEvent = oEvent || {};
		var fInlineHandler = this['on' + sEvent],
			aHandlerList = this._htEventHandler[sEvent] || [],
			bHasInlineHandler = typeof fInlineHandler == "function",
			bHasHandlerList = aHandlerList.length > 0;
			
		if (!bHasInlineHandler && !bHasHandlerList) {
			return true;
		}
		aHandlerList = aHandlerList.concat(); //fireEvent수행시 핸들러 내부에서 detach되어도 최초수행시의 핸들러리스트는 모두 수행
		
		oEvent.sType = sEvent;
		if (typeof oEvent._aExtend == 'undefined') {
			oEvent._aExtend = [];
			oEvent.stop = function(){
				if (oEvent._aExtend.length > 0) {
					oEvent._aExtend[oEvent._aExtend.length - 1].bCanceled = true;
				}
			};
		}
		oEvent._aExtend.push({
			sType: sEvent,
			bCanceled: false
		});
		
		var aArg = [oEvent], 
			i, nLen;
			
		for (i = 2, nLen = arguments.length; i < nLen; i++){
			aArg.push(arguments[i]);
		}
		
		if (bHasInlineHandler) {
			fInlineHandler.apply(this, aArg);
		}
	
		if (bHasHandlerList) {
			var fHandler;
			for (i = 0, fHandler; (fHandler = aHandlerList[i]); i++) {
				fHandler.apply(this, aArg);
			}
		}
		
		return !oEvent._aExtend.pop().bCanceled;
	},

	/**
	 * 커스텀 이벤트 핸들러를 등록한다.
	 * @param {Object} sEvent
	 * @param {Object} fHandlerToAttach
	 * @return {this} 컴포넌트 객체 자신
	 * @example
//이벤트 등록 방법 예제
//아래처럼 등록하면 appear 라는 사용자 이벤트 핸들러는 총 3개가 등록되어 해당 이벤트를 발생시키면 각각의 핸들러 함수가 모두 실행됨.
//attach 을 통해 등록할때는 이벤트명에 'on' 이 빠지는 것에 유의.
function fpHandler1(oEvent) { .... };
function fpHandler2(oEvent) { .... };

var oInst = new MyComponent();
oInst.onappear = fpHandler1; // 직접 등록
oInst.attach('appear', fpHandler1); // attach 함수를 통해 등록
oInst.attach({
	appear : fpHandler1,
	more : fpHandler2
});
	 */
	attach : function(sEvent, fHandlerToAttach) {
		if (arguments.length == 1) {

			jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler, sEvent) {
				this.attach(sEvent, fHandler);
			}, this).bind());
		
			return this;
		}

		var aHandler = this._htEventHandler[sEvent];

		if (typeof aHandler == 'undefined'){
			aHandler = this._htEventHandler[sEvent] = [];
		}

		aHandler.push(fHandlerToAttach);

		return this;
	},
	
	/**
	 * 커스텀 이벤트 핸들러를 해제한다.
	 * @param {Object} sEvent
	 * @param {Object} fHandlerToDetach
	 * @return {this} 컴포넌트 객체 자신
	 * @example
//이벤트 해제 예제
oInst.onappear = null; // 직접 해제
oInst.detach('appear', fpHandler1); // detach 함수를 통해 해제
oInst.detach({
	appear : fpHandler1,
	more : fpHandler2
});
	 */
	detach : function(sEvent, fHandlerToDetach) {
		if (arguments.length == 1) {
			jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler, sEvent) {
				this.detach(sEvent, fHandler);
			}, this).bind());
		
			return this;
		}

		var aHandler = this._htEventHandler[sEvent];
		if (aHandler) {
			for (var i = 0, fHandler; (fHandler = aHandler[i]); i++) {
				if (fHandler === fHandlerToDetach) {
					aHandler = aHandler.splice(i, 1);
					break;
				}
			}
		}

		return this;
	},
	
	/**
	 * 등록된 모든 커스텀 이벤트 핸들러를 해제한다.
	 * @param {String} sEvent 이벤트명. 생략시 모든 등록된 커스텀 이벤트 핸들러를 해제한다. 
	 * @return {this} 컴포넌트 객체 자신
	 * @example
//"show" 커스텀이벤트 핸들러 모두 해제
oInst.detachAll("show");

//모든 커스텀이벤트 핸들러 해제
oInst.detachAll();
	 */
	detachAll : function(sEvent) {
		var aHandler = this._htEventHandler;
		
		if (arguments.length) {
			
			if (typeof aHandler[sEvent] == 'undefined') {
				return this;
			}
	
			delete aHandler[sEvent];
	
			return this;
		}	
		
		for (var o in aHandler) {
			delete aHandler[o];
		}
		return this;				
	}
});

/**
 * 다수의 컴포넌트를 일괄 생성하는 Static Method
 * @param {Array} aObject 기준엘리먼트의 배열
 * @param {HashTable} htOption 옵션객체의 배열
 * @return {Array} 생성된 컴포넌트 객체 배열
 * @example
var Instance = jindo.Component.factory(
	cssquery('li'),
	{
		foo : 123,
		bar : 456
	}
);
 */
jindo.Component.factory = function(aObject, htOption) {
	var aReturn = [],
		oInstance;

	if (typeof htOption == "undefined") {
		htOption = {};
	}
	
	for(var i = 0, el; (el = aObject[i]); i++) {
		oInstance = new this(el, htOption);
		aReturn[aReturn.length] = oInstance;
	}

	return aReturn;
};

/**
 * 컴포넌트의 생성된 인스턴스를 리턴한다.
 * @return {Array} 생성된 인스턴스의 배열
 */
jindo.Component.getInstance = function(){
	if (typeof this._aInstance == "undefined") {
		this._aInstance = [];
	}
	return this._aInstance;
};

/**
 * @fileOverview UI 컴포넌트를 구현하기 위한 코어 클래스
 * @version 1.0.2
 */
jindo.UIComponent = jindo.$Class({
	/** @lends jindo.UIComponent.prototype */
		
	/**
	 * jindo.UIComponent를 초기화한다.
	 * @constructs
	 * @class UI Component에 상속되어 사용되는 Jindo Component의 Core
	 * @extends jindo.Component
	 */
	$init : function() {
		this._bIsActivating = false; //컴포넌트의 활성화 여부
	},

	/**
	 * 컴포넌트의 활성여부를 가져온다.
	 * @return {Boolean}
	 */
	isActivating : function() {
		return this._bIsActivating;
	},

	/**
	 * 컴포넌트를 활성화한다.
	 * _onActivate 메소드를 수행하므로 반드시 상속받는 클래스에 _onActivate 메소드가 정의되어야한다.
	 * @return {this}
	 */
	activate : function() {
		if (this.isActivating()) {
			return this;
		}
		this._bIsActivating = true;
		
		if (arguments.length > 0) {
			this._onActivate.apply(this, arguments);
		} else {
			this._onActivate();
		}
				
		return this;
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 * _onDeactivate 메소드를 수행하므로 반드시 상속받는 클래스에 _onDeactivate 메소드가 정의되어야한다.
	 * @return {this}
	 */
	deactivate : function() {
		if (!this.isActivating()) {
			return this;
		}
		this._bIsActivating = false;
		
		if (arguments.length > 0) {
			this._onDeactivate.apply(this, arguments);
		} else {
			this._onDeactivate();
		}
		
		return this;
	}
}).extend(jindo.Component);	

/**
 * @fileOverview HTML Element를 Drag할 수 있게 해주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 1.0.2
 */

jindo.DragArea = jindo.$Class({
	/** @lends jindo.DragArea.prototype */
	
	/**
	 * DragArea 컴포넌트를 생성한다.
	 * DragArea 컴포넌트는 상위 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 모든 엘리먼트를 Drag 가능하게 하는 기능을 한다.
	 * @constructs
	 * @class HTML Element를 Drag할 수 있게 해주는 컴포넌트
	 * @extends jindo.UIComponent
	 * @param {HTMLElement} el Drag될 엘리먼트들의 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
	 * @param {HashTable} htOption 옵션 객체
	 * @example
var oDragArea = new jindo.DragArea(document, {
	"sClassName" : 'dragable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drag 가능하게 된다. 
	"bFlowOut" : true, // (Boolean) 드래그될 엘리먼트가 상위 기준 엘리먼트의 영역을 벗어날 수 있는지의 여부. 상위 엘리먼트의 크기가 드래그되는 객체보다 크거나 같아야지만 동작하도록 수정. 작은 경우 document사이즈로 제한한다.
	"bSetCapture" : true, //ie에서 setCapture 사용여부
	"nThreshold" : 0 // (Number) 드래그가 시작되기 위한 최소 역치값(px) 
}).attach({
	handleDown : function(oCustomEvent) {
		//드래그될 handle 에 마우스가 클릭되었을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
		//	weEvent : (jindo.$Event) mousedown시 발생되는 jindo.$Event 객체
		//};
		//oCustomEvent.stop(); 이 수행되면 dragStart 이벤트가 발생하지 않고 중단된다.
	},
	dragStart : function(oCustomEvent) {
		//드래그가 시작될 때 발생 (마우스 클릭 후 첫 움직일 때 한 번)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
		//	htDiff : (HashTable) handledown된 좌표와 dragstart된 좌표의 차이 htDiff.nPageX, htDiff.nPageY
		//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
		//};
		//oCustomEvent.stop(); 이 수행되면 뒤따르는 beforedrag 이벤트가 발생하지 않고 중단된다.
	},
	beforeDrag : function(oCustomEvent) {
		//드래그가 시작되고 엘리먼트가 이동되기 직전에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elFlowOut : (HTMLElement) bFlowOut 옵션이 적용될 상위 기준 엘리먼트 (변경가능)
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
		//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
		//	nX : (Number) 드래그 될 x좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nY : (Number) 드래그 될 y좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
		//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
		//};
		//oCustomEvent.stop(); 이 수행되면 뒤따르는 drag 이벤트가 발생하지 않고 중단된다.
		//oCustomEvent.nX = null; // 가로로는 안 움직이게
		//oCustomEvent.nX = Math.round(oCustomEvent.nX / 20) * 20;
		//oCustomEvent.nY = Math.round(oCustomEvent.nY / 20) * 20;
		//if (oCustomEvent.nX < 0) oCustomEvent.nX = 0;
		//if (oCustomEvent.nY < 0) oCustomEvent.nY = 0;
	},
	drag : function(oCustomEvent) {
		//드래그 엘리먼트가 이동하는 중에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
		//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
		//	nX : (Number) 드래그 된 x좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nY : (Number) 드래그 된 y좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
		//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
		//};
	},
	dragEnd : function(oCustomEvent) {
		//드래그(엘리먼트 이동)가 완료된 후에 발생 (mouseup시 1회 발생. 뒤이어 handleup 발생)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
		//	bInterupted : (Boolean) 드래그중 stopDragging() 호출로 강제적으로 드래그가 종료되었는지의 여부
		//	nX : (Number) 드래그 된 x좌표.
		//	nY : (Number) 드래그 된 y좌표.
		//}
	},
	handleUp : function(oCustomEvent) {
		//드래그된 handle에 마우스 클릭이 해제됬을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 된 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
		//	weEvent : (jindo.$Event) mouseup시 발생되는 jindo.$Event 객체 
		//};
	}
});
	 */
	$init : function(el, htOption) {
		this.option({
			sClassName : 'draggable',
			bFlowOut : true,
			bSetCapture : true, //ie에서 bSetCapture 사용여부
			nThreshold : 0
		});
		
		this.option(htOption || {});
		
		this._el = el;
		
		this._bIE = jindo.$Agent().navigator().ie;
		
		this._htDragInfo = {
			"bIsDragging" : false,
			"bPrepared" : false, //mousedown이 되었을때 true, 이동중엔 false
			"bHandleDown" : false,
			"bForceDrag" : false
		};

		this._wfOnMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfOnMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfOnMouseUp = jindo.$Fn(this._onMouseUp, this);
		
		this._wfOnDragStart = jindo.$Fn(this._onDragStart, this);
		this._wfOnSelectStart = jindo.$Fn(this._onSelectStart, this);
		
		this.activate();
	},
	
	_findDraggableElement : function(el) {
		if (jindo.$$.test(el, "input[type=text], textarea, select")){
			return null;
		} 
		
		var self = this;
		var sClass = '.' + this.option('sClassName');
		
		var isChildOfDragArea = function(el) {
			if (el === null) {
				return false;
			}
			if (self._el === document || self._el === el) {
				return true;
			} 
			return jindo.$Element(self._el).isParentOf(el);
		};
		
		var elReturn = jindo.$$.test(el, sClass) ? el : jindo.$$.getSingle('! ' + sClass, el);
		if (!isChildOfDragArea(elReturn)) {
			elReturn = null;
		}
		return elReturn;
	},
	
	/**
	 * 레이어가 현재 드래그 되고 있는지 여부를 가져온다
	 * @return {Boolean} 레이어가 현재 드래그 되고 있는지 여부
	 */
	isDragging : function() {
		var htDragInfo = this._htDragInfo; 
		return htDragInfo.bIsDragging && !htDragInfo.bPrepared;
	},
	
	/**
	 * 드래그를 강제 종료시킨다.
	 * @return this;
	 */
	stopDragging : function() {
		this._stopDragging(true);
		return this;
	},
	
	_stopDragging : function(bInterupted) {
		this._wfOnMouseMove.detach(document, 'mousemove');
		this._wfOnMouseUp.detach(document, 'mouseup');
		
		if (this.isDragging()) {
			var htDragInfo = this._htDragInfo,
				welDrag = jindo.$Element(htDragInfo.elDrag);
			
			htDragInfo.bIsDragging = false;
			htDragInfo.bForceDrag = false;
			htDragInfo.bPrepared = false;
			
			if(this._bIE && this._elSetCapture) {
				this._elSetCapture.releaseCapture();
				this._elSetCapture = null;
			}
			
			this.fireEvent('dragEnd', {
				"elArea" : this._el,
				"elHandle" : htDragInfo.elHandle,
				"elDrag" : htDragInfo.elDrag,
				"nX" : parseInt(welDrag.css("left"), 10) || 0,
				"nY" : parseInt(welDrag.css("top"), 10) || 0,
				"bInterupted" : bInterupted
			});
		}
	},
	
	/**
	 * DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 attach 한다. 
	 */
	_onActivate : function() {
		this._wfOnMouseDown.attach(this._el, 'mousedown');
		this._wfOnDragStart.attach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.attach(this._el, 'selectstart'); // for IE	
	},
	
	/**
	 * DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 detach 한다. 
	 */
	_onDeactivate : function() {
		this._wfOnMouseDown.detach(this._el, 'mousedown');
		this._wfOnDragStart.detach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.detach(this._el, 'selectstart'); // for IE
	},
	
	/**
	 * 이벤트를 attach한다.
	 * @deprecated activate
	 */
	attachEvent : function() {
		this.activate();
	},
	
	/**
	 * 이벤트를 detach한다.
	 * @deprecated deactivate
	 */
	detachEvent : function() {
		this.deactivate();
	},
	
	/**
	 * 이벤트의 attach 여부를 가져온다.
	 * @deprecated isActivating
	 */
	isEventAttached : function() {
		return this.isActivating();
	},
	
	/**
	 * 마우스다운이벤트와 관계없이 지정된 엘리먼트를 드래그 시작한다.
	 * @param {HTMLElement} el 드래그할 엘리먼트
	 * @return {Boolean} 드래그시작여부
	 */
	startDragging : function(el) {
		var elDrag = this._findDraggableElement(el);
		if (elDrag) {
			this._htDragInfo.bForceDrag = true;
			this._htDragInfo.bPrepared = true;
			this._htDragInfo.elHandle = elDrag;
			this._htDragInfo.elDrag = elDrag;
			
			this._wfOnMouseMove.attach(document, 'mousemove');
			this._wfOnMouseUp.attach(document, 'mouseup');
			return true;
		}
		return false;
	},
	
	_onMouseDown : function(we) {
		/* IE에서 네이버 툴바의 마우스제스처 기능 사용시 우클릭하면 e.mouse().right가 false로 들어오므로 left값으로만 처리하도록 수정 */
		if (!we.mouse().left || we.mouse().right) {
			this._stopDragging(true);
			return;
		}
		
		// 드래그 할 객체 찾기
		var el = this._findDraggableElement(we.element);
		if (el) {
			var oPos = we.pos(),
				htDragInfo = this._htDragInfo;
			
			htDragInfo.bHandleDown = true;
			htDragInfo.bPrepared = true;
			htDragInfo.nButton = we._event.button;
			htDragInfo.elHandle = el;
			htDragInfo.elDrag = el;
			htDragInfo.nPageX = oPos.pageX;
			htDragInfo.nPageY = oPos.pageY;
			if (this.fireEvent('handleDown', { 
				elHandle : el, 
				elDrag : el, 
				weEvent : we 
			})) {
				this._wfOnMouseMove.attach(document, 'mousemove');
			} 
			this._wfOnMouseUp.attach(document, 'mouseup');
			
			we.stop(jindo.$Event.CANCEL_DEFAULT);			
		}
	},
	
	_onMouseMove : function(we) {
		var htDragInfo = this._htDragInfo,
			htParam, htRect,
			oPos = we.pos(), 
			htGap = {
				"nX" : oPos.pageX - htDragInfo.nPageX,
				"nY" : oPos.pageY - htDragInfo.nPageY
			};

		if (htDragInfo.bPrepared) {
			var nThreshold = this.option('nThreshold'),
				htDiff = {};
			
			if (!htDragInfo.bForceDrag && nThreshold) {
				htDiff.nPageX = oPos.pageX - htDragInfo.nPageX;
				htDiff.nPageY = oPos.pageY - htDragInfo.nPageY;
				var nDistance = Math.sqrt(htDiff.nPageX * htDiff.nPageX + htDiff.nPageY * htDiff.nPageY);
				if (nThreshold > nDistance){
					return;
				} 
			}

			if (this._bIE && this.option("bSetCapture")) {
				this._elSetCapture = (this._el === document) ? document.body : this._findDraggableElement(we.element);
				if (this._elSetCapture) {
					this._elSetCapture.setCapture(false);
				}
			}
			 
			htParam = {
				elArea : this._el,
				elHandle : htDragInfo.elHandle,
				elDrag : htDragInfo.elDrag,
				htDiff : htDiff, //nThreshold가 있는경우 htDiff필요
				weEvent : we //jindo.$Event
			};
			
				
			htDragInfo.bIsDragging = true;
			htDragInfo.bPrepared = false;
			if (this.fireEvent('dragStart', htParam)) {
				var welDrag = jindo.$Element(htParam.elDrag),
					htOffset = welDrag.offset();
				
				htDragInfo.elHandle = htParam.elHandle;
				htDragInfo.elDrag = htParam.elDrag;
				htDragInfo.nX = parseInt(welDrag.css('left'), 10) || 0;
				htDragInfo.nY = parseInt(welDrag.css('top'), 10) || 0;
				htDragInfo.nClientX = htOffset.left + welDrag.width() / 2;
				htDragInfo.nClientY = htOffset.top + welDrag.height() / 2;
			} else {
				htDragInfo.bPrepared = true;
				return;
			}
		} 
				
		if (htDragInfo.bForceDrag) {
			htGap.nX = oPos.clientX - htDragInfo.nClientX;
			htGap.nY = oPos.clientY - htDragInfo.nClientY;
		}
		
		htParam = {
			"elArea" : this._el,
			"elFlowOut" : htDragInfo.elDrag.parentNode, 
			"elHandle" : htDragInfo.elHandle,
			"elDrag" : htDragInfo.elDrag,
			"weEvent" : we, 		 //jindo.$Event
			"nX" : htDragInfo.nX + htGap.nX,
			"nY" : htDragInfo.nY + htGap.nY,
			"nGapX" : htGap.nX,
			"nGapY" : htGap.nY
		};
		
		if (this.fireEvent('beforeDrag', htParam)) {
			var elDrag = htDragInfo.elDrag;
			if (this.option('bFlowOut') === false) {
				var elParent = htParam.elFlowOut,
					aSize = [ elDrag.offsetWidth, elDrag.offsetHeight ],
					nScrollLeft = 0, nScrollTop = 0;
					
				if (elParent == document.body) {
					elParent = null;
				}
				
				if (elParent && aSize[0] <= elParent.scrollWidth && aSize[1] <= elParent.scrollHeight) {
					htRect = { 
						nWidth : elParent.clientWidth, 
						nHeight : elParent.clientHeight
					};	
					nScrollLeft = elParent.scrollLeft;
					nScrollTop = elParent.scrollTop;
				} else {
					var	htClientSize = jindo.$Document().clientSize();
						
					htRect = {
						nWidth : htClientSize.width, 
						nHeight : htClientSize.height
					};
				}
	
				if (htParam.nX !== null) {
					htParam.nX = Math.max(htParam.nX, nScrollLeft);
					htParam.nX = Math.min(htParam.nX, htRect.nWidth - aSize[0] + nScrollLeft);
				}
				
				if (htParam.nY !== null) {
					htParam.nY = Math.max(htParam.nY, nScrollTop);
					htParam.nY = Math.min(htParam.nY, htRect.nHeight - aSize[1] + nScrollTop);
				}
			}
			if (htParam.nX !== null) {
				elDrag.style.left = htParam.nX + 'px';
			}
			if (htParam.nY !== null) {
				elDrag.style.top = htParam.nY + 'px';
			}

			this.fireEvent('drag', htParam);
		}else{
			htDragInfo.bIsDragging = false;
		}
	},
	
	_onMouseUp : function(we) {
		this._stopDragging(false);
		
		var htDragInfo = this._htDragInfo;
		htDragInfo.bHandleDown = false;
		
		this.fireEvent("handleUp", {
			weEvent : we,
			elHandle : htDragInfo.elHandle,
			elDrag : htDragInfo.elDrag 
		});
	},
	
	_onDragStart : function(we) {
		if (this._findDraggableElement(we.element)) { 
			we.stop(jindo.$Event.CANCEL_DEFAULT); 
		}
	},
	
	_onSelectStart : function(we) {
		if (this.isDragging() || this._findDraggableElement(we.element)) {
			we.stop(jindo.$Event.CANCEL_DEFAULT);	
		}
	}
	
}).extend(jindo.UIComponent);
