var TargetView = new Class({
	Extends: View,
	Implements: [Options, Events],
	options: {
		points: 0,
		comboBar: {}
	},
	initialize: function(windowSize){
		this.parent(windowSize);
		var rep = this.options.rep;

		this.options.boardSize = windowSize;

		//ComboBar
		comboBar = new ComboBar();
		rep.adopt(comboBar.options.rep);

		//target
		var target = new Element('div#target');
		rep.adopt(target);

		//game board
		var board = new TargetBoard(this.options.boardSize.x, 5, 5, 0.05);
		rep.adopt(board.options.rep);
		board.addEvent(BOARD_SCORE, this.onScore);
		board.addEvent(BOARD_TARGET, this.setTarget);
		
		//score holder
		var score = new Element('div#score', {
			text: '0 P0ints'
		});
		rep.adopt(score);

		var endButton = new Element('div#end', {
			text: 'X',
			events: {
				touch: this.onEndGame.bind(this)
			}
		});
		rep.adopt(endButton);
	},
	onEndGame: function(event) {
		event.target.getParent('.view').fireEvent(VIEW_NAV, MenuView);
	},
	setTarget: function(newValue) {
		var targetContainer = $('target');
		targetContainer.empty();
		var newTarget = new Element('p', {
			html: newValue
		});
		targetContainer.adopt(newTarget);
	},
	onScore: function(args)
	{
		console.log('onScore');
		comboBar.comboUp(); //update combo

		this.options.points += args.points * comboBar.options.multiplier;
		$('score').set('html', this.options.points + " P0ints");

		// var feedbackContainer = $('feedback');
		// feedbackContainer.empty();
		// var newFeedback = new Element('p', {
		//	html:args.feedback
		// });
		// feedbackContainer.adopt(newFeedback);
	}
});