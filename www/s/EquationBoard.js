var EquationBoard = new Class({
	Extends: Board,
	options:{
		maxEqual: 6,
		currentEqual: 0
	},
	createPiece: function(id){
		// return this.supa();
		return new Piece(id, this.options.pieceSize, this.options.spacing, 10);
	},
	setPieceType: function(piece){
		var minNum;
		var maxNum = 4;
		if(this.options.currentEqual < this.options.maxEqual)
		{
			minNum = PIECE_TYPE_EQUAL;
		} else 
			minNum = PIECE_TYPE_OPERATOR;
		var rand = Number.random(minNum, maxNum);
		piece.setValue(rand);
		if(rand === PIECE_TYPE_EQUAL)
			this.options.currentEqual++;
	},
	validateChain: function(chain, scoreChain) {
		var board = this;
		var piece;
		var currentValue = "";
		var mainValue = 0;
		var nextValue = 0;
		var hasEqual = false;
		var hasRight = false;
		var equation = "";
		var equalCount = 0;
		var operatorCount = 0;
		Array.each(chain, function(piece, i)
		{
			if(hasEqual && !hasRight)
				hasRight = true;
			switch(piece.options.type)
			{
				case PIECE_TYPE_OPERATOR :
					operatorCount++;
					currentValue += piece.options.value;
					break;
				case PIECE_TYPE_NUMBER :
					currentValue += piece.options.value;
					break;
				case PIECE_TYPE_EQUAL :
					if(!hasEqual)
						mainValue = Parser.evaluate(currentValue);
					else {
						nextValue = Parser.evaluate(currentValue);
						if(mainValue !== nextValue)
						{
							$$('.highlighted').addCssAnimation('shake');
							return false; // end loop if found a mismatch
						}
					}
					equation += currentValue;
					currentValue = "";
					hasEqual = true;
					equalCount++;
					break;
			}
		});
		if(hasEqual && hasRight)
		{
			equation += "=" + currentValue;
			if(PIECE_OPERATOR_STRINGS.indexOf(currentValue[currentValue.length - 1]) === -1)
				nextValue = Parser.evaluate(currentValue);
			else //last char is a symbol
				nextValue = false;
			
			if(mainValue === nextValue)
			{
				if(scoreChain === true)
				{
					Array.each(chain, function(piece, i){
						board.setPieceType(piece);
					});
					this.sendScore(equation, equalCount, mainValue, operatorCount);
				}
				return true;
			}
		}
		if(hasEqual)
			console.log("fail equation:", equation);
		else
			console.log("currentValue:", currentValue);
		$$('.highlighted').addCssAnimation('shake');
		return false;
	},
	failPiece: function(piece) {
		piece.options.rep.addCssAnimation('shake');
	},
	sendScore: function(equation, equalCount, mainValue, operatorCount){
		var chainLength = this.options.chain.length;
		var newScore = (mainValue * chainLength * equalCount).abs();
		var feedback = '';
		if(mainValue.isPrime()) {
			feedback = 'Primevil';
			newScore *= mainValue;
		} else if(operatorCount === 0) {
			feedback = 'Reflexive Repentance';
		} else {
			feedback = 'Cursed C0mp0site';
		}

		this.options.points += newScore;
		console.log("points:", this.options.points);
		var eventArgs = {};
		eventArgs.points = this.options.points;
		eventArgs.feedback = feedback;
		eventArgs.equation = equation;
		this.fireEvent(BOARD_SCORE, eventArgs);
	}
});