var PageGenerator = {

	generateListHTML: function(years, logs) {
		var listDiv = $('#listpage > [data-role="content"]');
		var first	= 'data-collapsed="false"';
		var html	= '<div data-role="collapsible-set" data-mini="true" data-inset="false" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d">';
		var lenY	= years.length;

		for ( var i = 0; i < lenY; i++ ) {
			// list-seperator for the different years
			var curYear = years[i];
			html += '<div data-role="collapsible" ' + first + '>' +
						'<h3>' + curYear +
							'<span class="ui-btn-up-c ui-btn-corner-all cnt-bbl">' + logs[curYear].length + '</span>' +
						'</h3>' +
						'<ul data-role="listview" data-inset="false">';

			// add all log-entrys for that curYear
			var logEntry = null;
			for ( var j = logs[curYear].length-1; j >= 0; j-- ) {
				logEntry = logs[curYear][j];
				html += '<li><a href="#/log/' + logEntry.id + '" class="loglist-entry">' +
							'<p class="ui-li-aside"><strong>' + Helper.getMonth(logEntry.month) + ' '+ logEntry.day + '</strong></p>' +
							'<h3>' + logEntry.title + '</h3>' +
							'<p>' + logEntry.text + '</p>' +
						'</a></li>';
			}
			html += '</ul></div>'; // close -> ul + collapsible
			first = "";
		}
		html += '</div>'; // close -> collapsible-set

		listDiv.html(html);
	},

	fillLogView: function(log) {
		$('#log-header').html(log.day + "." + log.month + "." + log.year);
		$('#log-title').html(log.title);
		$('#log-text').html(log.text);
		$('#log-gps').html("long: " + log.lon + "<br />lat: " + log.lat);
		if (log.photo === true) {
			$('#log-image').attr( 'src', log.file);
		} else {
			$('#log-image').attr( 'src', "img/noimage.png");
		}
	}
};