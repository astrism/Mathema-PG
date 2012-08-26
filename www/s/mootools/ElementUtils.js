Element.implement({
	addCssAnimation: function(animationClass){
		var target = this;
		if(target.hasClass(animationClass))
		{
			//reset active animation
			target.removeClass(animationClass);
			setTimeout(startAnimation, 10);
		} else
			startAnimation();

		function startAnimation() {
			target.addEventListener('webkitAnimationEnd', removeAnimationClass);
			target.addClass(animationClass);
		}

		function removeAnimationClass(event){
			event.target.removeClass(animationClass);
			event.target.removeEventListener('webkitAnimationEnd', removeAnimationClass);
		}
	}
});