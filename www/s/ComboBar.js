var ComboBar = new Class({
	Implements: Options,
	options: {
		maxMultiplier: 4,
		multiplier: 1,
		rep: {},
		progressRep: {},
		progressBarRep: {},
		multiplierRep: {}
	},
	initialize: function(){
		this.options.rep = new Element('div#combo');
		progressRep = new Element('div.progress');
		progressBarRep = new Element('div.bar');
		multiplierRep = new Element('div.multiplier', {html: '1x'});

		this.options.rep.adopt(progressRep);
		progressRep.adopt(progressBarRep);
		progressRep.adopt(multiplierRep);
	},
	comboUp: function(){
		console.log('Combo Up!');
		if(this.options.multiplier < this.options.maxMultiplier)
			this.options.multiplier++;
		progressBarRep.addCssAnimation('comboCooldown');
		multiplierRep.set('html', this.options.multiplier + 'x');
		this.options.rep.addEventListener('webkitAnimationEnd', this.comboDown.bind(this));
	},
	comboDown: function(){
		console.log('Combo Down:' + this.options.multiplier);
		//clean up listeners
		event.target.removeEvents('webkitAnimationEnd');
		event.stopImmediatePropagation();

		//reset multiplier
		this.options.multiplier = 1;
		multiplierRep.set('html', this.options.multiplier + 'x');
	}
});