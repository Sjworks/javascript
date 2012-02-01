
var Console = $Class({
	_woElement: null,
	_woPage: null,
	$init : function(Element){
		this._woElement = $Element(Element);
		this._woPage = this._woElement.first();
	},
	clear : function() {
		this._woPage.empty();
	},
	write : function(Text) {
		var p = $Element('<p>'+Text+'</p>')
		p.appendTo(this._woPage);
		
		this._woElement.$value().scrollTop = this._woPage.height();
	}
});
