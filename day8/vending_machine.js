
var VendingMachine = function() {
	
	var _insertCoin = 0;
	var _walletMoney = 10000;
	var _paperMoneyCount = 0;
	
	var _oProductDisplay;
	var _oLog;
	
	var _elInsert;
	var _elMyMoney;
	
	var insertCoin = function(coin){
		if(_walletMoney-coin < 0){
			_oLog.write('더이상 넣을 돈이 없습니다.');
			return;
		}
		if(coin==1000 && _paperMoneyCount>=2){
			_oLog.write('지폐는 두장까지 넣을 수 있습니다.');
			return;
		}
		
		_insertCoin+=coin;
		_walletMoney-=coin;
		
		_oLog.write(coin+'원을 넣었습니다.');
		
		if(coin==1000) _paperMoneyCount++
			
		update();
	};
	
	var mistakeCoin = function(coin) {
		if(_walletMoney-coin < 0){
			_oLog.write('더이상 돈이 없습니다.');
			return;
		}
		_oLog.write(coin+'원을 떨어뜨리셨습니다.');
		_walletMoney-=coin;
		
		update();
	};
	
	var update = function() {
		_elInsert.innerHTML = _insertCoin+'원';
		_elMyMoney.innerHTML = '지금 내 돈 : '+_walletMoney+'원';
	};
	
	var selectProduct = function(event, info) {
		if(info.amount<=0){
			_oLog.write(info.name+'은(는) 품절입니다.');
			return false;
		}
		else if(info.price<=_insertCoin){
			_oLog.write(info.name+' 나왔다!!');
			_insertCoin-=info.price;
			update();
			return true;
		}else{
			_oLog.write('돈이 모자랍니다.');
			update();
			return false;
		}
	};
	
	var returnCoin = function(e) {
		_walletMoney+=_insertCoin;
		_insertCoin = 0;
		update();
		
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
	};
	
	var _init = function() {
		_oProductDisplay = new ProductDisplay(document.getElementById('shelf'));
		_oLog = new Console(document.getElementById('console'), document.getElementById('page'));
		
		_oProductDisplay.setClickListener(selectProduct);
		
		_elInsert = document.getElementById('insert');
		_elMyMoney = document.getElementById('my_money');
		
		//event
		dragable(document.getElementById('money50'), document.getElementById('insert'), function(drop){ 
			if(drop) insertCoin(50);
			else mistakeCoin(50);
		});
		dragable(document.getElementById('money100'), document.getElementById('insert'), function(drop){ 
			if(drop) insertCoin(100);
			else mistakeCoin(100);
		});
		dragable(document.getElementById('money500'), document.getElementById('insert'), function(drop){ 
			if(drop) insertCoin(500);
			else mistakeCoin(500);
		});
		dragable(document.getElementById('money1000'), document.getElementById('insert'), function(drop){ 
			if(drop) insertCoin(1000);
			else mistakeCoin(1000);
		});
		addEvent(document.getElementById('btnReturn'), 'click', returnCoin);
		
		update();
	};
	
	_init();
};