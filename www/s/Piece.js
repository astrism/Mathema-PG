var PIECE_TYPE_EQUAL = 0;
var PIECE_TYPE_OPERATOR = 1;
var PIECE_TYPE_NUMBER = 2;
var PIECE_OPERATOR_STRINGS = ["*", "+", "-"];
var PIECE_STRING_EQUAL = "=";

var Piece = new Class({
	Implements: Options,
	options: {
		id: "unknown",
		value: "unknown",
		type: PIECE_TYPE_EQUAL,
		rep: {},
		health: 3,
		maxNumber: 10
	},
	initialize: function(id, size, spacing, maxNumber){
		this.options.id = id;
		this.options.maxNumber = maxNumber;

		this.options.rep = new Element('div', {
			'class': 'piece',
			id: id,
			styles: {
				width: size + "px",
				height: size + "px",
				'font-size': (size * 0.7).toInt() + "px",
				'line-height': size + "px"
			}
		});
	},
	setValue: function(pieceType){
		switch(pieceType)
		{
			case PIECE_TYPE_EQUAL:
				this.options.value = PIECE_STRING_EQUAL;
				this.options.type = PIECE_TYPE_EQUAL;
				break;
			case PIECE_TYPE_OPERATOR:
				this.options.value = PIECE_OPERATOR_STRINGS[Number.random(0, PIECE_OPERATOR_STRINGS.length - 1)];
				this.options.type = PIECE_TYPE_OPERATOR;
				break;
			default:
				this.options.value = Number.random(0, this.options.maxNumber);
				this.options.type = PIECE_TYPE_NUMBER;
				break;
		}

		this.options.rep.set('html', this.options.value);
		this.options.rep.addCssAnimation('pieceRotate');
	}
});