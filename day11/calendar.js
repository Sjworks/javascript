

var Calendar = $Class({
	
	$init : function(elCalendar, oOption) {
		//option
		this.option({
			
		});
		this.option(oOption || {});
		
		var today = new Date();
		this._oToday = {
			nYear : today.getFullYear(),
			nMonth : today.getMonth()+1,
			nDay : today.getDate()
		};
		
		this._nYear = this._oToday.nYear;
		this._nMonth = this._oToday.nMonth;
		
		this._initCalendarElement(elCalendar);
		
		this._update();
	},
	
	_initCalendarElement : function(elCalendar){
		elCalendar = $(elCalendar);
		this._welCalendar = $Element(elCalendar);
		
		this._welBtnPrevYear = $Element($$.getSingle(".btn-prev-year", elCalendar));
		this._welBtnNextYear = $Element($$.getSingle(".btn-next-year", elCalendar));
		this._welBtnPrevMonth = $Element($$.getSingle(".btn-prev-month", elCalendar));
		this._welBtnNextMonth = $Element($$.getSingle(".btn-next-month", elCalendar));
		
		this._welTitle = $Element($$.getSingle(".title", elCalendar));
		this._welTitleYear = $Element($$.getSingle(".title-year", elCalendar));
		this._welTitleMonth = $Element($$.getSingle(".title-month", elCalendar));
		
		var elWeek = $$.getSingle('.week', elCalendar);
		this._elWeekTemplate = elWeek.cloneNode(true);
		this._elAppendTarget = elWeek.parentNode;
		
		$Fn(function(e){
			this.setYearMonth(-1, 0);
			e.stop();
		}, this).attach(this._welBtnPrevYear, "click");
		$Fn(function(e){
			this.setYearMonth(1, 0);
			e.stop();
		}, this).attach(this._welBtnNextYear, "click");
		$Fn(function(e){
			this.setYearMonth(0, -1);
			e.stop();
		}, this).attach(this._welBtnPrevMonth, "click");
		$Fn(function(e){
			this.setYearMonth(0, 1);
			e.stop();
		}, this).attach(this._welBtnNextMonth, "click");
		
		this._wfClickDate = $Fn(function(e){
			for(var i=0; i<this._aDates.length; i++){
				if(this._aDates[i].welDate.$value() == e.element)
				{
					this.fireEvent("clickdate", this._aDates[i]);					
					e.stop();
					break;
				}
			}
		}, this);
		
		$Element(this._elAppendTarget).delegate('click', '.date', this._wfClickDate.bind());
	},
	
	setYearMonth : function(nYear, nMonth) {
		var oDate = new Date(this._nYear, this._nMonth, 1);
		
		oDate.setFullYear(this._nYear+nYear, (this._nMonth-1)+nMonth, 1);
		this._nYear = oDate.getFullYear();
		this._nMonth = oDate.getMonth()+1;
		
		this._update();
	},
	
	_update : function() {
		
		this._clear();
		var oDate = new Date(this._nYear, this._nMonth-1, 1);
		var oToday = new Date();
		var nWeeks = this.constructor.getWeeks(this._nYear, this._nMonth);
				
		oDate.setDate(1+(this.constructor.getFirstDay(this._nYear, this._nMonth)*-1));
				
		for(var i=0; i<nWeeks; i++){
			var elWeek =this._elWeekTemplate.cloneNode(true);
			this._elAppendTarget.appendChild(elWeek);
			var elDates = $$('.date', elWeek);
			
			for(var j=0; j<7; j++){
				var welDate = $Element(elDates[j]);
				var nYear = oDate.getFullYear();
				var nMonth = oDate.getMonth()+1;
				var nDate = oDate.getDate();
				var nDay = oDate.getDay();
				
				welDate.text(nDate);
				
				welDate.className("date");
				
				
				if(nMonth < this._nMonth)
					welDate.addClass("prev-month");
				else if(nMonth > this._nMonth)
					welDate.addClass("next-month");
				
				if(nDay == 0)
					welDate.addClass("sun");
				else if(nDay == 6)
					welDate.addClass("sat");
				
				if(oToday.getFullYear()==nYear && oToday.getMonth()+1 == nMonth && oToday.getDate() == nDate)
					welDate.addClass("today");
				
				var oDatePram = {
					nYear : nYear,
					nMonth : nMonth,
					nDate : nDate,
					nDay : nDay,
					welDate: welDate
				};
				this._aDates.push(oDatePram);
			
				oDate.setDate(nDate+1);		
			}
		}
		
		if(this._welTitle) this._welTitle.text(this._nYear+'/'+this._nMonth);
		if(this._welTitleYear) this._welTitleYear.text(this._nYear);
		if(this._welTitleMonth) this._welTitleMonth.text(this._nMonth);
	},
	
	_clear : function() {
		$Element(this._elAppendTarget).empty();
		this._aDates = [];
	},
	
	_test : function() {
		console.debug(this._oToday);
	},

	_show : function() {
		if (!this.fireEvent('beforeshow')) return;
		
		$Element(oEl).addClass('visible');
		this.fireEvent('show');
	}
	
}).extend(jindo.Component);

Calendar.getWeeks = function(nYear, nMonth) {
	var nFirstDay = this.getFirstDay(nYear, nMonth),
	nLastDate = this.getLastDate(nYear, nMonth);
	
	return Math.ceil((nFirstDay + nLastDate) / 7);
}

Calendar.getFirstDay = function(nYear, nMonth) {
	return new Date(nYear, nMonth-1, 1).getDay();
}

Calendar.getLastDate = function(nYear, nMonth) {
	return new Date(nYear, nMonth, 0).getDate();
}