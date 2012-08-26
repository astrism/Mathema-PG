var EquationView = new Class({
	Extends: View,
	Implements: [Options, Events],
	options: {
		canvas: {}
	},
	initialize: function(windowSize){
		this.parent(windowSize);
		var rep = this.options.rep;

		this.options.boardSize = windowSize;

		//equation
		var equation = new Element('div#equation');
		rep.adopt(equation);

		//feedback holder
		var feedback = new Element('div#feedback', {
			html: "<p>Make Equations!</p>"
		});
		rep.adopt(feedback);

		//game board
		var board = new EquationBoard(this.options.boardSize.x, 5, 5, 0.05);
		rep.adopt(board.options.rep);
		board.addEvent(BOARD_SCORE, this.onScore);
		
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
	onScore: function(args)
	{
		console.log('onScore');
		$('score').set('html', args.points + " P0ints");

		var feedbackContainer = $('feedback');
		feedbackContainer.empty();
		var newFeedback = new Element('p', {
			html:args.feedback
		});
		feedbackContainer.adopt(newFeedback);

		var equationContainer = $('equation');
		equationContainer.empty();
		var newEquation = new Element('p', {
			html:args.equation
		});
		equationContainer.adopt(newEquation);

	}
});