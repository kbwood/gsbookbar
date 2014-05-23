/* http://keith-wood.name/gsbookbar.html
   Google Search Bookbar for jQuery v2.0.0.
   See http://www.google.com/uds/solutions/bookbar/reference.html.
   Written by Keith Wood (kbwood{at}iinet.com.au) November 2008.
   Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license. 
   Please attribute the author if you use it. */
   
(function($) { // hide the namespace

	var pluginName = 'gsbookbar';

	/** Create the Google Search Bookbar plugin.
		<p>Sets a <code>div</code> to display a bookbar.</p>
		<p>Expects HTML like:</p>
		<pre>&lt;div>&lt;/div></pre>
		<p>Provide inline configuration like:</p>
		<pre>&lt;div data-gsbookbar="name: 'value'">&lt;/div></pre>
	 	@module GSBookBar
		@augments JQPlugin
		@example $(selector).gsbookbar({search: ['jquery']}); */
	$.JQPlugin.createPlugin({
	
		/** The name of the plugin. */
		name: pluginName,
		
		/** Cycle times - very short. */
		cycleVShort: 3000,
		/** Cycle times - short. */
		cycleShort: 10000,
		/** Cycle times - medium (default). */
		cycleMedium: 15000,
		/** Cycle times - long. */
		cycleLong: 30000,
		/** Cycle modes - random (default). */
		cycleRandom: 1,
		/** Cycle modes - linear. */
		cycleLinear: 2,
		/** Thumbnail sizes - small. */
		thumbnailsSmall: 1,
		/** Thumbnail sizes - medium (default). */
		thumbnailsMedium: 2,
			
		/** Default settings for the plugin.
			@property [horizontal=true] {boolean} <code>true</code> for horizontal display, <code>false</code> for vertical.
			@property [thumbnailSize=this.thumbnailsMedium] {number} The size of the book thumbnails.
			@property [search='jquery'] {string|string[]} Single or list of search terms.
			@property [manyResults=false] {boolean} <code>true</code> for many results, <code>false</code> for only a few.
			@property [cycleTime=this.cycleMedium] {number} Time between cycles of the search terms (milliseconds).
			@property [cycleMode=this.cycleRandom] {number} Mode of cycling through the search terms. */
		defaultOptions: {
			horizontal: true,
			thumbnailSize: this.thumbnailsMedium,
			search: 'jquery',
			manyResults: false,
			cycleTime: this.cycleMedium,
			cycleMode: this.cycleRandom
		},
		
		_init: function() {
			this.defaultOptions.thumbnailSize = this.thumbnailsMedium;
			this.defaultOptions.cycleTime = this.cycleMedium,
			this.defaultOptions.cycleMode = this.cycleRandom;
			this._super();
		},

		_optionsChanged: function(elem, inst, options) {
			$.extend(inst.options, options);
			this._updateGSBookbar(elem[0], inst);
		},

		/** Redisplay the bookbar with an updated display.
			@private
			@param elem {Element} The affected division.
			@param inst {object} The instance settings. */
		_updateGSBookbar: function(elem, inst) {
			var search = inst.options.search;
			search = ($.isArray(search) ? search : [search]);
			inst.bookbar = new GSbookBar(elem, {largeResultSet: inst.options.manyResults,
				horizontal: inst.options.horizontal, thumbnailSize: inst.options.thumbnailSize,
				autoExecuteList: {executeList: search, cycleTime: inst.options.cycleTime,
					cycleMode: inst.options.cycleMode}});
		},

		/** Perform a new search in the bookbar.
			@param elem {Element} The affected division.
			@param search {string} The new search terms. */
		search: function(elem, search) {
			var inst = this._getInst(elem);
			if (inst) {
				$.extend(inst.options, {search: search});
				inst.bookbar.execute(search);
			}
		},

		_preDestroy: function(elem, inst) {
			elem.empty();
		}
	});

	// Add required external files - note: key must be set before loading this module
	if ($('script[src*="www.google.com/uds/api?file=uds.js"]').length === 0) {
		if (!$.googleSearchKey) {
			throw 'Missing Google Search Key';
		}
		document.write('<script type="text/javascript" src="http://www.google.com/uds/' +
			'api?file=uds.js&v=1.0&key=' + $.googleSearchKey + '"></script>\n' +
			'<link type="text/css" href="http://www.google.com/uds/css/gsearch.css" rel="stylesheet"/>\n');
	}
	document.write('<script type="text/javascript" src="http://www.google.com/uds/' +
		'solutions/bookbar/gsbookbar.js"></script>\n' +
		'<link type="text/css" href="http://www.google.com/uds/solutions/bookbar/gsbookbar.css" ' +
		'rel="stylesheet"/>\n');

})(jQuery);
