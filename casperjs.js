casper.start();

casper.open('http://www.google.com/').then(function() {
    this.echo('GOT it.');
});

casper.run();