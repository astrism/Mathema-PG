var ViewController = new Class({
	Implements: Options,
	options: {
		currentView: {},
		viewContainer: {},
		windowSize: {}
	},
	initialize: function(windowSize){
		this.options.windowSize = windowSize;
		this.options.viewContainer = new Element('div#viewContainer');
		this.addView(MenuView);
	},
	addView: function(newViewClass){

		var newView = new newViewClass(this.options.windowSize);
		newView.options.rep.addEvent(VIEW_NAV, this.onViewNav.bind(this));
		this.options.viewContainer.adopt(newView.options.rep);
		this.options.currentView = newView;
	},
	onViewNav: function(newViewClass)
	{
		if(this.options.currentView)
			this.options.currentView.options.rep.dispose();
		this.addView(newViewClass);
	}
});