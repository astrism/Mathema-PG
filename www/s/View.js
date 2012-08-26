var VIEW_NAV = 'VIEW_NAV';

var View = new Class({
	Implements: [Options, Events],
	options: {
		rep: {},
		viewSize: {}
	},
	initialize: function (windowSize) {
		this.options.rep = new Element('div.view', {
			styles: {
				width: windowSize.x,
				height: windowSize.y
			}
		});
		this.options.viewSize = windowSize;
	}
});