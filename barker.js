/*
	Barker
	An in-browser javascript notification system.
	Based heavily on Growl (link)
	Requires jQuery javascript framework: http://jquery.com
	
	To do:
	Allow users to set options when initiating Barker
		- Anchor
		- Icon directory
	Limit the number of consecutive notices
	
*/

/* Inititate Barker */
function barker(opts){
	/* Append #barker-notices, the wrapping <ul />, to the DOM */
	$('body').append('<ul id="barker-notices"></div>');
	
	this.settings = new Object;
	this.count = 0;
	this.timers = new Array;
	this.options = barkerSetOpts;
	this.notice = barkerNotice;
	this.show = showBarkerNotice;
	this.pause = pauseBarkerNotice;
	this.resume = resumeBarkerNotice;
	this.hide = hideBarkerNotice;
	this.hover = hoverBarkerNotice;
	return true;
}

/* Set options for Barker */
function barkerSetOpts(opts){
	if( typeof(opts) == 'object' ){
		barker.settings.iconpath = ( typeof(opts.path) == 'string' ? opts.path : 'icons/' );
		barker.settings.limit = ( typeof(opts.limit) != 'undefined' && parseInt(opts.limit) > 0 ? parseInt(opts.limit) : 6 );
	}
}

/* Display a notice */
function barkerNotice(msg, ico, duration){
	if( msg != '' ){
		ico = typeof(ico) != 'undefined' ? ico : 'notice.png';
		duration = typeof(duration) != 'undefined' ? parseInt(duration) : 5000;
		
		/* Assemble the barker notice */
		barker.count++;
		id = barker.count;
		barkerNotice = '<li id="barker-notice-' + id + '" class="barker-notice' + ( duration <= 0 ? ' persist' : '' ) + '" style="display:none;">' + '<img src="' + barker.settings.iconpath + ico + '" alt="" />' + msg + '</li>';
		
		/* Show the barker notice */
		$('#barker-notices').prepend(barkerNotice);
		$('#barker-notice-' + id).bind('mouseover mouseenter', function(){
			var inst = this.id.substr(14);
			pauseBarkerNotice(inst);
			hoverBarkerNotice(inst);
		});
		$('#barker-notice-' + id).bind('mouseout mouseleave', function(){
			if( duration > 0 ){
				resumeBarkerNotice(this.id.substr(14));
			}
		});
		$('#barker-notice-' + id).bind('click', function(){
			hideBarkerNotice(this.id.substr(14));
		});
		barker.show(id, duration);
	}
	return true;
}

/* Show a barker notice */
function showBarkerNotice(id, duration){
	$('#barker-notice-' + id).fadeIn(400, function(){
		if( parseInt(duration) > 0 ){
			barker.timers[id] = window.setTimeout('hideBarkerNotice(' + id + ')', duration);
		}
	});
	return true;
}

/* Pause a countdown */
function pauseBarkerNotice(id){
	clearTimeout(barker.timers[id]);
	return true;
}

/* Resume a paused countdown */
function resumeBarkerNotice(id){
	$('#barker-notice-' + id).removeClass('barker-hover');
	barker.timers[id] = window.setTimeout('hideBarkerNotice(' + id + ')', 200);
	return true;
}

/* Hide a barker notice */
function hideBarkerNotice(id){
	$('#barker-notice-' + id).fadeTo(200, 0, function(){
		$('#barker-notice-' + id).slideUp(100, function(){
			$(this).remove();
		});
	});
	return true;
}

/* Toggle the hover class */
function hoverBarkerNotice(id){
	$('#barker-notice-' + id).addClass('barker-hover').bind('mouseout mouseleave', function(){
		$(this).removeClass('barker-hover');
	});
}

/* Assign the global variable */
var barker = new barker();