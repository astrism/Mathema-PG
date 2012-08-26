Number.implement({
	isPrime: function(value){
		if(this == 1) return false;
		for (var i=(this-1); i > 1; i--) {
			if ((this % i) === 0) {
				return false;
			}
		}
		return true;
	}
});