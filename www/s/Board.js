var BOARD_SCORE = 'BOARD_SCORE';
var BOARD_GAME_OVER = 'BOARD_GAME_OVER';

var Board = new Class(
{
	Implements: [Options, Events],
	options: {
		width: 100,
		height: 100,
		rows: 1,
		cols: 1,
		spacing: 1,
		pieceSize: 100,
		maxDistance: 100,
		rep: {},
		pieces: {},
		locations: {},
		chain: [],
		lastPiece: null,
		currentTarget: {},
		boundTouchEnd: {},
		boundTouchMove: {},
		points: 0,
		piecesByRep: {},
		//lookup for pieces by rec
		pieceCount: 0,
		lastMoveCheck: 0
	},
	initialize: function($width, $cols, $rows, $spacing)
	{
		this.options.width = $width;
		this.options.cols = $cols;
		this.options.spacing = ($spacing * $width).toInt();

		var min = 0;
		var extra = this.options.spacing * ($cols + 1);
		min = $width - extra;
		this.options.pieceSize = (min / $cols).toInt();
		this.options.rows = $rows; //($height / (this.options.pieceSize + this.options.spacing)).floor();
		// log("rows:" + this.options.rows);
		//max distance between pieces
		this.options.maxDistance = (((this.options.pieceSize + this.options.spacing).pow(2) * 2).sqrt()).toInt();
		//max equals
		// this.options.maxEqual = this.options.cols + this.options.rows;
		this.options.rep = new Element('div#board');

		this.options.rep.addEvent('touchstart', this.onTouchStart.bind(this));

		this.options.pieceCount = this.options.rows * this.options.cols;
		var piece;
		var col = 0;
		var row = 0;
		var loc;
		var piecePos = {};
		for (var i = 0; i < this.options.pieceCount; i++)
		{
			loc = col % this.options.cols;
			if (i > 0 && loc === 0) row++;

			piece = this.createPiece('piece' + i);
			this.adoptPiece(piece);
			this.setPieceType(piece);
			piecePos.x = (loc * (this.options.pieceSize + this.options.spacing)) + this.options.spacing;
			piecePos.y = (row % this.options.rows) * (this.options.pieceSize + this.options.spacing);
			piece.options.rep.setPosition(piecePos);
			col++;
		}
		this.setupBoard.delay(10, this);
	},
	setupBoard: function()
	{},
	createPiece: function(id)
	{},
	adoptPiece: function(piece)
	{
		this.options.rep.adopt(piece.options.rep);
		this.options.pieces[piece.options.id] = piece;
	},
	failPiece: function(piece)
	{},
	onTouchStart: function(event)
	{
		// console.log('onTouchStart');
		var target = this.options.pieces[event.target.id];

		if (target !== undefined)
		{
			if (target.options.type === PIECE_TYPE_NUMBER)
			{
				this.selectPiece(target);

				this.options.boundTouchEnd = this.onTouchEnd.bind(this);
				this.options.rep.addEvent('touchend', this.options.boundTouchEnd);
				this.options.boundTouchMove = this.onTouchMove.bind(this);
				this.options.rep.addEvent('touchmove', this.options.boundTouchMove);
			}
			else
			{
				this.failPiece(target);
			}
		}
	},
	onTouchMove: function(event)
	{
		var time = new Date();
		if (time - 50 > this.options.lastMoveCheck) this.options.lastMoveCheck = time;
		else return; //dont check more that every 250ms
		console.log('onTouchMove');

		// var target = this.options.pieces[event.target.id]; //only works in browser
		var target = this.getPieceByPos(event.client, this.options.rep.getPosition()); // works on native
		// log('target.id:' + target.options.id);
		// log('lastPiece.id:' + lastPiece.options.id);
		// log('target === null:' + (target === null));
		// log('target === undefined:' + (target === undefined));
		// log('target === lastPiece:' + (target == lastPiece));
		if (target === null || target === undefined || target === this.options.lastPiece) return;

		if (target === this.options.currentTarget)
		{
			return; //same as the last target checked
		}
		else
		{
			this.options.currentTarget = target;
		}

		if (this.validatePiece(target, this.options.lastPiece)) // check if its a valid move
		{
			// log('target:' + target);
			// log('target.id:' + target.options.id);
			// log('target.options.type:' + target.options.type);
			var chain = this.options.chain;
			var index = chain.indexOf(target);

			// log("distance:" + distance);
			// log("maxDistance:" + this.options.maxDistance);
			if (index === -1)
			{
				this.selectPiece(target);
			}
			else if (chain.length > 1 && index === chain.length - 2)
			{
				var oldPiece = chain.pop();
				oldPiece.options.rep.removeClass('highlighted');
				oldPiece.options.rep.retrieve('line').dispose();
				this.options.lastPiece = chain[chain.length - 1];
			}
		}
		else
		{
			this.failPiece(target);
		}
	},
	validatePiece: function(piece, lastPiece)
	{
		var targetLoc = piece.options.rep.getPosition();
		targetLoc = [targetLoc.x, targetLoc.y];
		var lastLoc = lastPiece.options.rep.getPosition();
		lastLoc = [lastLoc.x, lastLoc.y];
		var distance = targetLoc.distance(lastLoc).toInt();
		if (distance > this.options.maxDistance || (piece.options.type !== PIECE_TYPE_NUMBER && lastPiece.options.type !== PIECE_TYPE_NUMBER))
		{
			// log('not the right type');
			return false;
		}
		// log('totally the right type');
		return true;
	},
	selectPiece: function(piece)
	{
		if(this.options.lastPiece !== null)
			piece.options.rep.store('line', this.createLine(this.options.lastPiece.options.rep, piece.options.rep));
		piece.options.rep.addClass('highlighted');
		this.options.chain.push(piece);
		this.options.lastPiece = piece;
	},
	onTouchEnd: function(event)
	{
		// log('onTouchEnd');
		this.validateChain(this.options.chain, true);
		this.clearChain();
	},
	validateChain: function()
	{
		//override with custom validation
		return true;
	},
	clearChain: function()
	{
		$$('.highlighted').removeClass('highlighted');
		this.options.chain = [];
		this.options.lastPiece = null;

		this.options.rep.removeEvent('touchend', this.options.boundTouchEnd);
		this.options.rep.removeEvent('touchmove', this.options.boundTouchMove);
		$$('.line').dispose();
	},
	setPieceType: function(piece)
	{},
	createLine: function(originPiece, targetPiece)
	{
		var pos1 = originPiece.getPosition(this.options.rep);
		var pos2 = targetPiece.getPosition(this.options.rep);
		var offset = this.options.pieceSize * 0.5;

		//courtesy of http://monkeyandcrow.com/blog/drawing_lines_with_css3/
		var length = Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y));
		var angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI;
		var transform = 'rotate(' + angle + 'deg)';

		var line = new Element('div.line', {
			styles: {
				left: pos1.x + offset,
				top: pos1.y + offset,
				'-webkit-transform': transform,
				width: length
			}
		});

		this.options.rep.grab(line, 'top');
		return line;
	},
	getPieceByPos: function(pos, offsetPos)
	{
		var xPos = pos.x;
		var yPos = pos.y;
		if (offsetPos)
		{
			xPos -= offsetPos.x;
			yPos -= offsetPos.y;
		}
		var squareSpace = this.options.pieceSize + this.options.spacing;
		// log('xPos:', xPos);
		var xMod = (xPos % squareSpace) - this.options.spacing;
		// log('xMod:', xMod);
		var xTest = xMod > 0 && xMod <= this.options.pieceSize;
		var yTest = (yPos % squareSpace) <= this.options.pieceSize;
		if (xTest && yTest)
		{
			var inTheGutter = (xPos % squareSpace) >= this.options.pieceSize;
			var colPos = (xPos / squareSpace).floor(); //floor for 0 index
			var fullRows = (yPos / squareSpace).floor();
			var index = (this.options.cols * fullRows) + colPos;
			// console.log(this.options.pieces, index, this.options.cols * fullRows, colPos);
			// console.log('newPiece:', this.options.pieces['piece' + index]);
			return this.options.pieces['piece' + index];
		}
		else
		{
			return null;
		}
	},
	getRandNeighbor: function(piece)
	{
		// console.log('piece:', piece);
		var piecePos = piece.options.rep.getPosition();
		var randPos;
		var randNeighbor = null;
		for (var i = 0; i < 7; i++)
		{
			randPos = getRandPosAroundPiece(piecePos, this.options.maxDistance);
			randNeighbor = this.getPieceByPos(randPos);
			if (randNeighbor !== undefined)
			{

				// console.log('randNeighbor:',randNeighbor);
				return randNeighbor;
			}
		}
		// console.log('no more neighbors');
		return null;

		function getRandPosAroundPiece(startingPos, maxDistance)
		{
			var dir = Number.random(0, 7);
			// console.log('dir:' + dir);
			switch (dir)
			{
			case 0:
				//north
				startingPos.y -= maxDistance;
				break;
			case 1:
				//north-east
				startingPos.x += maxDistance;
				startingPos.y -= maxDistance;
				break;
			case 2:
				//east
				startingPos.x += maxDistance;
				break;
			case 3:
				//south-east
				startingPos.x += maxDistance;
				startingPos.y += maxDistance;
				break;
			case 4:
				//south
				startingPos.y += maxDistance;
				break;
			case 5:
				//south-west
				startingPos.x -= maxDistance;
				startingPos.y += maxDistance;
				break;
			case 6:
				//west
				startingPos.x -= maxDistance;
				break;
			case 7:
				//north-west
				startingPos.x -= maxDistance;
				startingPos.y -= maxDistance;
				break;
			}
			// console.log('startingPos:', startingPos);
			return startingPos;
		}
	},
	evalPrecedence: function(equation)
	{
		//evaluate with standard order of operations
		// console.log('evalPrecedence:' + equation + '!');
		equation = equation.replace(/[\/\-+*=]$/gi, '');//location of trailing operator
		
		// console.log('equation:' + equation);
		try
		{
			return Parser.evaluate(equation);
		}
		catch (e)
		{
			return null;
		}
	},
	evalProgressive: function(equation)
	{
		// console.log('evalProgressive:' + equation + "!");
		equation = equation.replace(/[\/\-+*=]$/gi, '');//location of trailing operator
		//evaluate progressively, ignoring the order of operations
		var numbers = equation.match(/\d+/g);
		var operators = equation.match(/[\/\-+*=]/g);
		if (numbers && operators)
		{
			// console.log(numbers);
			// console.log(operators);
			var currentValue = numbers[0];
			var tempEquation;
			for (var i = 0; i < operators.length; i++)
			{
				tempEquation = currentValue;
				if (operators[i] !== undefined && numbers[i + 1] !== undefined)
				{
					tempEquation += operators[i];
					tempEquation += numbers[i + 1];
				}
				// console.log('tempEquation:' + tempEquation);
				currentValue = this.evalPrecedence(tempEquation);
				// console.log('currentValue:' + currentValue);
			}
			// console.log('finalValue:' + currentValue);
			return currentValue;
		}
		else if (numbers) 
			return numbers[0].toInt();
		else 
			return null;
	}
});