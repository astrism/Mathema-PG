function unitTest(body, viewController)
{
	viewController.onViewNav(TargetView);
	var board = viewController.options.currentView.options.board;

	module('Board Equation Evaluation');
	test("Simple Equation", function()
	{
		expect(2);
		var boardValue;

		boardValue = board.evalPrecedence('1+2*3');
		equal(boardValue, 7, "evalPrecedence");

		boardValue = board.evalProgressive('1+2*3');
		equal(boardValue, 9, "evalProgressive");
	});

	module('Board Chain Validation');
	test("Trailing Operator", function()
	{
		expect(2);
		var boardValue;

		boardValue = board.evalPrecedence('1+2*');
		equal(boardValue, 3, "evalPrecedence");

		boardValue = board.evalProgressive('1+2*');
		equal(boardValue, 3, "evalProgressive");
	});

	asyncTest("Early Killscreen", function()
	{
		expect(1000);
		var repeat = 1000;
		var boardValue;
		var startingIndex;
		var startingPiece;
		var answer;
		viewController.options.currentView.options.rep.addEvent(BOARD_GAME_OVER, onGameOver);

		// board
		var interval = setInterval(function(e)
		{
			var answerChain = board.options.targetAnswer.solution;
			chainData = board.validateChain(answerChain, true);
			if (chainData !== null)
			{
				// board.fireEvent('touchstart');// answerChain[0].
				Array.each(answerChain, function(piece, i)
				{
					board.selectPiece(piece);
				});
				ok(true);
				repeat--;
				if (repeat === 0)
				{
					start();
					console.log('clearInterval:', clearInterval);
					clearInterval(interval);
				}
			}
			else
			{
				$$('.highlighted').removeClass('highlighted');
				$$('.line').dispose();
			}
		}, 250);

		function onGameOver(e)
		{
			start(); //test completed board
		}
	});
	console.log("QUnit");
	console.log(QUnit);
	QUnit.start();
}