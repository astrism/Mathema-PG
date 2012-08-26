var Lggr = {};
Lggr.doLog = true;
Lggr.height = 200;
Lggr.titleHeight = 20;
Lggr.open = false;
Lggr.filterStrength = 20; //higher value smooths out reporting
Lggr.frameTime = 0;
Lggr.lastLoop = new Date();
Lggr.pos = 0;
Lggr.logger = null;
Lggr.allLogs = [];
Lggr.filterInput = {};
Lggr.scroller;

Lggr.floatLog = function() {
	if (Lggr.logger !== null)
		$(document.body).adopt(Lggr.logger);
};

function log(param) {
	Array.each(arguments, function(v, i) {
		window.console.log(v);
	});

	if (!Lggr.doLog) return;

	var logList = new Element('ul.lggrLogs');
	var logListItem;
	Array.each(arguments, function(v, i) {
		logListItem = new Element('li', {html:v});
		logList.adopt(logListItem);
	});

	var index = Lggr.allLogs.length;
	var lggrListItem = new Element('li', {'class':'lggrLog'});
	var lggrListLabel = new Element('span', {html:index});
	lggrListItem.adopt(lggrListLabel);
	lggrListItem.adopt(logList);
	Lggr.allLogs.push(logList);

	if (Lggr.open)
	{
		var filter = Lggr.filterInput.get('value');
		if(filter.length === 0 || (lggrListItem.get('html').indexOf(filter) > -1))
			lggrListItem.inject(Lggr.scroller, 'top');	
	}
}


Lggr.init = function() {
	if (!Lggr.doLog) {

		return;
	}
	
	//main container
	Lggr.logger = new Element('div#lggr.lggrTouch');
	$(document.body).adopt(Lggr.logger);

	//scroll container
	Lggr.scroller = new Element('ul#lggrScroll', {
		styles: {
			'padding-bottom': Lggr.titleHeight + "px",
			bottom: -Lggr.height + "px"
		}
	});
	Lggr.logger.adopt(Lggr.scroller);

	//title bar
	var lggrTitle = new Element('div#lggrTitle', {
		'class': 'lggrNoTouch',
		styles: {
			height: Lggr.titleHeight + "px"
		}		
	});
	Lggr.logger.adopt(lggrTitle);

	//hit area for opening
	var lggrOpen = new Element('div#lggrOpen', {
		events: {
			click:toggleLog
		}
	});
	lggrTitle.adopt(lggrOpen);

	//left tool container
	var lggrLeft = new Element('span#lggrLeft');
	lggrTitle.adopt(lggrLeft);

	//run tool
	var runContainer = new Element('span.lggrTouch');
	lggrLeft.adopt(runContainer);
	var loggerRunInput = new Element('input', {
		id:'lggrRunInput',
		type:'text',
		size:'20',
		autocorrect:'off',
		autocapitalization:'off',
		placeholder:'Run',
		events: {
			keypress: inputEntry
		}
	});
	runContainer.adopt(loggerRunInput);
	var runClick = new Element('div#lggrFormClick', {
		events: {
			click:inputFocus
		}
	});
	runContainer.adopt(runClick);

	//filter tool
	var filterContainer = new Element('span.lggrTouch');
	lggrLeft.adopt(filterContainer);
	Lggr.filterInput = new Element('input#lggrFilterInput', {
		type:'text',
		size:'20',
		autocorrect:'off',
		autocapitalization:'off',
		placeholder:'Filter',
		events: {
			keypress: inputEntry
		}
	});
	filterContainer.adopt(Lggr.filterInput);
	var filterClick = new Element('div#lggrFilterClick', {
		events: {
			click: filterLogs
		}
	});
	filterContainer.adopt(filterClick);

	//fps tool
	var lggrFps = new Element('span#lggrFps', {
		html: '0 fps'
	});
	lggrLeft.adopt(lggrFps);

	//right tool container
	var lggrRight = new Element('span#lggrRight', {
		'class':'lggrTouch'
	});
	lggrTitle.adopt(lggrRight);


	var lggrKill = new Element('span#lggrKill.lggrTouch', {
		html:'CLOSE',
		events: {
			click: killLog
		}
	});
	lggrRight.adopt(lggrKill);

	var lggrExpand = new Element('span#lggrExpand.lggrTouch', {
		html:'UP',
		events: {
			click: expand
		}
	});
	lggrRight.adopt(lggrExpand);

	var lggrContract = new Element('span#lggrContract.lggrTouch', {
		html:'DOWN',
		events: {
			click: contract
		}
	});
	lggrRight.adopt(lggrContract);

	Lggr.pos = Lggr.height;
	toggleLog();
	initFPS();
	Lggr.floatLog();
	console.log("--- log ---");

	function toggleLog() {
		if (Lggr.open === false) {
			Lggr.open = true;
			Lggr.scroller.setStyle('bottom', 0);
			Lggr.scroller.setStyle('height', Lggr.pos);
			renderLogs();
		} else {
			Lggr.open = false;
			Lggr.scroller.setStyle('bottom', -Lggr.pos - Lggr.titleHeight);
			Lggr.scroller.empty();
		}
	}

	function renderLogs() {
		if(Lggr.allLogs.length > 0)
		{
			var allLogs = [].concat(Lggr.allLogs);
			var filter = Lggr.filterInput.get('html');
			var displayLogs = [];
			Array.each(allLogs, function(v, i) {
				if (filter.length === 0 || v.get('html').indexOf(filter) > -1)
					Lggr.scroller.adopt(v);
			});
		}
	}

	function filterLogs() {
		Lggr.filterInput.get('html');
	}

	function killLog() {
		Lggr.logger.hide();
	}

	function inputEntry(event) {
		if (event.keyCode == 13) {
			switch (event.currentTarget.id) {
			case "lggrRunInput":
				runEval();
				break;
			case "lggrFilterInput":
				filterEval();
				break;
			default:
				console.log('Lggr: unhandled input');
				break;
			}
			return true;
		} else return event.which;
	}

	function runEval() {
		try {
			console.log(eval(loggerRunInput.get('html')));
		} catch (e) {
			console.log(e);
			loggerRunInput.attr('placeholder', 'ERROR');
			lggrFormClick.addClass('error');
		}
		loggerRunInput.val('');
	}

	function filterEval() {
		Lggr.scroller.empty();
		renderLogs();
	}

	function inputFocus() {
		loggerRunInput.focus();
		lggrFormClick.removeClass('error');
	}

	function expand() {
		Lggr.pos += Lggr.height;
		if (Lggr.open) Lggr.scroller.setStyle('height', Lggr.pos);
	}


	function contract() {
		if (Lggr.pos - Lggr.height > 0) Lggr.pos -= Lggr.height;
		if (Lggr.open) Lggr.scroller.setStyle('height', Lggr.pos);
	}

	function initFPS() {
		var onEachFrame;
		var requestFrame;
		if (window.webkitRequestAnimationFrame) //Chrome
		requestFrame = webkitRequestAnimationFrame;
		else if (window.requestAnimationFrame) requestFrame = requestAnimationFrame;

		if (requestFrame) { //this is Chrome only right now
			onEachFrame = function(cb) {
				var _cb = function() {
						cb();
						requestFrame(_cb);
					};
				_cb();
			};
		} else {
			onEachFrame = function(cb) {
				setInterval(cb, 1000 / 60);
			};
		}

		window.onEachFrame = onEachFrame;
		window.onEachFrame(updateFPS);
		setInterval(function() {
			lggrFps.set('html', (1000 / Lggr.frameTime).toFixed(1) + " fps");
		}, 1000);
	}

	function updateFPS() {
		var thisLoop = new Date();
		var thisFrameTime = thisLoop - Lggr.lastLoop;
		Lggr.frameTime += (thisFrameTime - Lggr.frameTime) / Lggr.filterStrength;
		Lggr.lastLoop = thisLoop;
	}
};