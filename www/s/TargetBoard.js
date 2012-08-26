var BOARD_TARGET = 'BOARD_TARGET';

var TargetBoard = new Class({
	Extends: Board,
	options:{
		targetNumber: 0,
		difficulty: 1,
		progress: 0
	},
	setupBoard: function(){
		this.sendTarget();
	},
	createPiece: function(id){
		// return this.supa();
		return new Piece(id, this.options.pieceSize, this.options.spacing, 5);
	},
	setPieceType: function(piece){
		var minNum = PIECE_TYPE_OPERATOR;
		var maxNum = 3;
		var rand = Number.random(minNum, maxNum);
		// log('rand:' + rand);
		piece.setValue(rand);
	},
	validateChain: function(chain, scoreChain) {
		var board = this;
		var piece;
		var equation = "";
		var operatorCount = 0;
		Array.each(chain, function(piece, i)
		{
			switch(piece.options.type)
			{
				case PIECE_TYPE_OPERATOR :
					operatorCount++;
					equation += piece.options.value;
					break;
				case PIECE_TYPE_NUMBER :
					equation += piece.options.value;
					break;
			}
		});

		var equationValue;
		try{
			equationValue = Parser.evaluate(equation);
		} catch(e) {
			if(scoreChain)
				console.log('equation fail');
		}

		// log("equationValue:", equationValue);
		if(!scoreChain && equationValue !== undefined)
		{
			return {
				'value': equationValue, 
				'operators': operatorCount
			};
		} else if(scoreChain && this.options.targetNumber == equationValue)
		{
			Array.each(chain, function(piece, i){
				board.setPieceType(piece);
			});
			this.sendScore(equation, operatorCount);
			$$('.highlighted').addCssAnimation('shake');
			return {
				'value': equationValue, 
				'operators': operatorCount
			};
		} else if(scoreChain)
		{
			$$('.highlighted').addCssAnimation('shake');
		}

		return null;
	},
	failPiece: function(piece) {
		piece.options.rep.addCssAnimation('shake');
	},
	sendScore: function(equation, operatorCount){
		var newScore = 1;
		var chainLength = this.options.chain.length;
		var operatorScore = operatorCount > 0 ? operatorCount : 1;
		if(chainLength > 0)
		{
			newScore = ((chainLength * operatorScore) * 10).log().ceil();
			console.log('newScore:' + newScore);
		}
		var feedback = '';
		if(operatorCount === 0) {
			feedback = 'Reflexive Repentance';
		}

		var eventArgs = {};
		eventArgs.points = newScore;
		eventArgs.feedback = feedback;
		eventArgs.equation = equation;
		console.log('score:', JSON.stringify(eventArgs));
		this.fireEvent(BOARD_SCORE, eventArgs);
		this.sendTarget();
	},
	sendTarget: function(){
		var difficulties = {};
		var startingIndex;
		var startingPiece;
		var answer;
		var startingTime = new Date();
		var difficulty;
		difficulties[this.options.difficulty] = [];
		for(var i = 0; i < 64; i++)
		{
			// get piece
			startingIndex = Number.random(0, this.options.pieceCount - 1);
			startingPiece = this.options.pieces["piece" + startingIndex];
			if(startingPiece.options.type == PIECE_TYPE_NUMBER)
			{
				answer = this.wiggle(startingPiece);
				if(answer === null)
					continue;

				if(difficulties[answer.difficulty] === undefined)
				{
					difficulties[answer.difficulty] = [answer.value];
				} else {
					difficulties[answer.difficulty].push(answer.value);
				}
			}
		}
		console.log(difficulties);
		console.log('this.options.difficulty:' + this.options.difficulty + " this.options.progress:" + this.options.progress);

		var difficultySet = difficulties[this.options.difficulty];
		var rand;
		if(difficultySet.length > 0)
		{
			rand = Number.random(0, difficultySet.length - 1);
			this.options.targetNumber = difficultySet[rand];
			// log('difficultySet.length:' + difficultySet.length);
			// log(difficultySet[rand]);
			// log(difficultySet);
			// log(rand);
		} else {
			for (var difficultyId in difficulties)
			{
				difficultySet = difficulties[difficultyId];
				if(difficultySet.length > 0)
				{
					rand = Number.random(0, difficultySet.length - 1);
					this.options.targetNumber = difficultySet[rand];
					console.log('difficultySet[rand]' + difficultySet[rand]);
					console.log('rand:' + rand);
					break;
				} else {
					continue;
				}
			}
		}

		if(++this.options.progress > this.options.difficulty * 10)
		{
			this.options.difficulty++;
			this.options.progress = 0;
		}

		console.log('sendTarget took:' + (new Date() - startingTime) + 'ms');
		this.fireEvent(BOARD_TARGET, this.options.targetNumber);
	},
	wiggle: function(startingPiece){
		var currPiece = null;
		var lastPiece = startingPiece;
		var tempChain = [];
		tempChain.push(startingPiece);
		for(var i = 0; i < 16; i++)
		{
			if(currPiece !== null && 
			   lastPiece !== null &&
			   this.validatePiece(currPiece, lastPiece)
			   )
			{
				// console.log('valid piece: ' + tempChain);
				if(tempChain.indexOf(currPiece) == -1)
				{
					tempChain.push(currPiece);
					lastPiece = currPiece;
				}
			}
			var newPiece = this.getRandNeighbor(currPiece || lastPiece);
			if(newPiece !== null)
				currPiece = newPiece;
		}
		// log(tempChain);
		// log(tempChain.length);
		// log("score:", score);
		var chainData = this.validateChain(tempChain, false);
		if(chainData !== null) {
			return {'value':chainData.value, 'difficulty':chainData.operators, 'solution': tempChain};
		} else
			return null;
	}
});