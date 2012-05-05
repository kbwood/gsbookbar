/* http://keith-wood.name/gsbookbar.html
   Google Search Bookbar for jQuery v1.0.0.
   See http://www.google.com/uds/solutions/bookbar/reference.html.
   Written by Keith Wood (kbwood@virginbroadband.com.au) November 2008.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

/* Display a Google Search Bookbar.
   Attach it with options like:
   $('div selector').gsbookbar({search: ['jquery']});
*/

(function($) { // Hide scope, no $ conflict

/* GSBookbar manager. */
function GSBookbar() {
	this._defaults = {
		horizontal: true, // True for horizontal display, false for vertical
		thumbnailSize: this.thumbnailsMedium, // The size of the book thumbnails
		search: 'jquery', // Single or list of search terms
		manyResults: false, // True for many results, false for only a few
		cycleTime: this.cycleMedium, // Time between cycles of the search terms
		cycleMode: this.cycleRandom // Mode of cycling through the search terms
	};
}

var PROP_NAME = 'gsbookbar';

$.extend(GSBookbar.prototype, {
	/* Class name added to elements to indicate already configured with GSBookbar. */
	markerClassName: 'hasGSBookbar',

	/* Cycle times. */
	cycleVShort: 3000,
	cycleShort: 10000,
	cycleMedium: 15000, // Default
	cycleLong: 30000,
	/* Cycle modes. */
	cycleRandom: 1, // Default
	cycleLinear: 2,
	/* Thumbnail sizes. */
	thumbnailsSmall: 1,
	thumbnailsMedium: 2, // Default

	/* Override the default settings for all GSBookbar instances.
	   @param  options  (object) the new settings to use as defaults */
	setDefaults: function(options) {
		extendRemove(this._defaults, options || {});
		return this;
	},

	/* Attach the bookbar widget to a div.
	   @param  target   (element) the affected division
	   @param  options  (object) the new instance settings */
	_attachGSBookbar: function(target, options) {
		target = $(target);
		if (target.is('.' + this.markerClassName)) {
			return;
		}
		target.addClass(this.markerClassName);
		var inst = {target: target};
		inst.options = $.extend({}, options);
		$.data(target[0], PROP_NAME, inst);
		this._updateGSBookbar(target, inst);
	},

	/* Reconfigure the settings for a bookbar div.
	   @param  target   (element) the affected division
	   @param  options  (object) the new/changed instance settings */
	_changeGSBookbar: function(target, options) {
		var inst = $.data(target, PROP_NAME);
		if (inst) {
			extendRemove(inst.options, options || {});
			$.data(target, PROP_NAME, inst);
			this._updateGSBookbar($(target), inst);
		}
	},

	/* Perform a new seacrh in the bookbar.
	   @param  target  (element) the affected division
	   @param  search  (string) the new search terms */
	_searchGSBookbar: function(target, search) {
		var inst = $.data(target, PROP_NAME);
		if (inst) {
			extendRemove(inst.options, {search: search});
			$.data(target, PROP_NAME, inst);
			inst.bookbar.execute(search);
		}
	},

	/* Redisplay the bookbar with an updated display.
	   @param  target  (object) the jQuery object for the affected division
	   @param  inst    (object) the instance settings */
	_updateGSBookbar: function(target, inst) {
		var search = this._get(inst, 'search');
		search = (isArray(search) ? search : [search]);
		inst.bookbar = new GSbookBar(target[0],
			{largeResultSet: this._get(inst, 'manyResults'),
			horizontal: this._get(inst, 'horizontal'),
			thumbnailSize: this._get(inst, 'thumbnailSize'),
			autoExecuteList: {executeList: search,
				cycleTime: this._get(inst, 'cycleTime'),
				cycleMode: this._get(inst, 'cycleMode')}});
	},

	/* Remove the bookbar widget from a div.
	   @param  target  (element) the affected division */
	_destroyGSBookbar: function(target) {
		target = $(target);
		if (!target.is('.' + this.markerClassName)) {
			return;
		}
		target.removeClass(this.markerClassName).empty();
		$.removeData(target[0], PROP_NAME);
	},

	/* Get a setting value, defaulting if necessary.
	   @param  inst  (object) the instance settings
	   @param  name  (string) the name of the setting
	   @return  (any) the setting value */
	_get: function(inst, name) {
		return (inst.options[name] != null ?
			inst.options[name] : $.gsbookbar._defaults[name]);
	}
});

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props) {
		if (props[name] == null) {
			target[name] = null;
		}
	}
	return target;
}

/* Determine whether an object is an array. */
function isArray(a) {
	return (a && a.constructor == Array);
}

/* Attach the GSBookbar functionality to a jQuery selection.
   @param  command  (string) the command to run (optional, default 'attach')
   @param  options  (object) the new settings to use for these GSBookbar instances
   @return  (object) jQuery object for chaining further calls */
$.fn.gsbookbar = function(options) {
	var otherArgs = Array.prototype.slice.call(arguments, 1);
	return this.each(function() {
		if (typeof options == 'string') {
			$.gsbookbar['_' + options + 'GSBookbar'].
				apply($.gsbookbar, [this].concat(otherArgs));
		}
		else {
			$.gsbookbar._attachGSBookbar(this, options);
		}
	});
};

// Add required external files - note: key must be set before loading this module
if ($('script[src*=www.google.com/uds/api?file=uds.js]').length == 0) {
	if (!$.googleSearchKey) {
		throw 'Missing Google Search Key';
	}
	$('head').append('<script type="text/javascript" src="http://www.google.com/uds/' +
		'api?file=uds.js&v=1.0&key=' + $.googleSearchKey + '"></script>\n' +
		'<link type="text/css" href="http://www.google.com/uds/css/gsearch.css" rel="stylesheet"/>\n');
}
$('head').append('<script type="text/javascript" src="http://www.google.com/uds/' +
	'solutions/bookbar/gsbookbar.js"></script>\n' +
	'<link type="text/css" href="http://www.google.com/uds/solutions/bookbar/gsbookbar.css" ' +
	'rel="stylesheet"/>\n');

/* Initialise the GSBookbar functionality. */
$.gsbookbar = new GSBookbar(); // singleton instance

})(jQuery);
