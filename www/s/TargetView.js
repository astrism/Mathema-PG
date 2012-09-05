var TargetView = new Class({
	Extends: View,
	Implements: [Options, Events],
	options: {
		points: 0,
		comboBar: {},
		board: {}
	},
	initialize: function(windowSize){
		this.parent(windowSize);
		var rep = this.options.rep;

		this.options.boardSize = windowSize;

		//target
		var target = new Element('div#target');
		rep.adopt(target);

		//game board
		var board = this.options.board = new TargetBoard(this.options.boardSize.x, 5, 5, 0.05);
		rep.adopt(board.options.rep);
		board.addEvent(BOARD_SCORE, this.onScore.bind(this));
		board.addEvent(BOARD_TARGET, this.setTarget.bind(this));
		
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
		if(!isNaN(newValue))
			{
			var targetContainer = $('target');
			targetContainer.empty();
			var newTarget = new Element('p', {
				html: newValue
			});
			targetContainer.adopt(newTarget);
		} else {
			var board = this.options.board;
			console.log('Game Over');
			console.log('difficulty:' + board.options.difficulty + " progress:" + board.options.progress);
			this.options.rep.fireEvent(BOARD_GAME_OVER);
			this.options.rep.fireEvent(VIEW_NAV, EndGameView);
		}
	},
	onScore: function(args)
	{
		// console.log('onScore');

		this.options.points += args.points;
		$('score').set('html', this.options.points + " P0ints");

		// var feedbackContainer = $('feedback');
		// feedbackContainer.empty();
		// var newFeedback = new Element('p', {
		//	html:args.feedback
		// });
		// feedbackContainer.adopt(newFeedback);
	}
});