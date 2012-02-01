
var VendingMachine = $Class({
	_nInsertCoin : 0,
	_nWalletMoney : 10000,
	_nPaperMoneyCount : 0,
	_oProductDisplay : null,
	_oLog : null,
	_woInsert : null,
	_woMyMoney : null,
	
	$init : function() {
		this._oProductDisplay = new ProductDisplay(document.getElementById('shelf'));
		this._oLog = new Console('console');
		
		this._oProductDisplay.setClickListener($Fn(this.selectProduct, this).bind());
		
		this._woInsert = $Element('insert');
		this._woMyMoney = $Element('my_money');
		
		
		//event
		$Element('money50').dragable('insert', $Fn(function(drop){ 
			if(drop) this.insertCoin(50);
			else this.mistakeCoin(50);
		}, this).bind());
		$Element('money100').dragable('insert', $Fn(function(drop){ 
			if(drop) this.insertCoin(100);
			else this.mistakeCoin(100);
		}, this).bind());
		$Element('money500').dragable('insert', $Fn(function(drop){ 
			if(drop) this.insertCoin(500);
			else this.mistakeCoin(500);
		}, this).bind());
		$Element('money1000').dragable('insert', $Fn(function(drop){ 
			if(drop) this.insertCoin(1000);
			else this.mistakeCoin(1000);
		}, this).bind());
		
		
		$Fn(this.returnCoin, this).attach('btnReturn', 'click');
		//addEvent(document.getElementById('btnReturn'), 'click', this.returnCoin);
		
		this.update();
	},
	
	update : function() {
		this._woInsert.text(this._nInsertCoin+'원');
		this._woMyMoney.text('지금 내 돈 : '+this._nWalletMoney+'원');
	},
	
	insertCoin : function(coin) {
		if(this._nWalletMoney-coin < 0){
			this._oLog.write('더이상 넣을 돈이 없습니다.');
			return;
		}
		if(coin==1000 && this._nPaperMoneyCount>=2){
			this._oLog.write('지폐는 두장까지 넣을 수 있습니다.');
			return;
		}
		
		this._nInsertCoin+=coin;
		this._nWalletMoney-=coin;
		
		this._oLog.write(coin+'원을 넣었습니다.');
		
		if(coin==1000) this._nPaperMoneyCount++
			
		this.update();
	},
	
	mistakeCoin : function(coin) {
		if(this._nWalletMoney-coin < 0){
			this._oLog.write('더이상 돈이 없습니다.');
			return;
		}
		this._oLog.write(coin+'원을 떨어뜨리셨습니다.');
		this._nWalletMoney-=coin;
		
		this.update();
	},
	
	selectProduct : function(event, info) {
		if(info.amount<=0){
			this._oLog.write(info.name+'은(는) 품절입니다.');
			return false;
		}
		else if(info.price<=this._nInsertCoin){
			this._oLog.write(info.name+' 나왔다!!');
			this._nInsertCoin-=info.price;
			this.update();
			return true;
		}else{
			this._oLog.write('돈이 모자랍니다.');
			this.update();
			return false;
		}
	},
	
	returnCoin : function(event) {
		this._nWalletMoney+=this._nInsertCoin;
		this._nInsertCoin = 0;
		this.update();
		
		this._oLog.write('넣은 돈을 모두 반환하였습니다.');
		
		event.stop();
	}
});