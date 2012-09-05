var EndGameView = new Class({
	Extends: View,
	initialize: function(windowSize){
		this.parent(windowSize);
		var rep = this.options.rep;
		var title = new Element('h1#title.bounceIn', {
			html: 'Game<br/>Over'
		});
		rep.adopt(title);

		// var equationButton = new Element('div.start.bounceIn', {
		//	text: 'Equation Mode',
		//	events: {
		//		touch: this.onPlayEquation.bind(this)
		//	}
		// });
		// rep.adopt(equationButton);

		var targetButton = new Element('div.start.bounceIn', {
			text: 'Play Again',
			events: {
				touch: this.onPlayTarget.bind(this)
			}
		});
		rep.adopt(targetButton);

	},
	onPlayEquation: function(event) {
		event.target.getParent('.view').fireEvent(VIEW_NAV, EquationView);
	},
	onPlayTarget: function(event) {
		event.target.getParent('.view').fireEvent(VIEW_NAV, TargetView);
	}
});