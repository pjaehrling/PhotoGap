var Router = {
	//transition: "myslide",
	transition: "slide",
	//transition: "fade",

	load: function(hashroute, storage, reload) {
		var pattern = /\#\/(\w+)\/?(\d*)/;
		var route   = pattern.exec(hashroute);

		if (route !== null) {
			var action = route[1];
			var param  = route[2];
			var fn = this[action];
			console.log("hashroute:" + hashroute + " --> action:" + action + " / param:" + param);

			if(typeof fn === 'function') {
				fn(storage, param, reload);
			} else { console.log("Route is not fetching a function."); }

		} else { console.log("Invalid link-format, pattern not matching."); }
	},

	/****************************************************************************
	 *																			*
	 * The different (Site) Actions - they all get called by the load function  *
	 *																			*
	 ****************************************************************************/

	list: function(storage, param, reload) {
		if (reload) {
			var logs = storage.loadAllLogs();
			if (logs !== null) {
				var yearArray  = []; // needed to have the years in right order - "HashMap" is unsorted
				for (var year in logs) {
					yearArray.push(year);
				}
				yearArray.sort(function(a,b) { return b-a; }); // sort years downwards
				PageGenerator.generateListHTML(yearArray, logs);
			} else {
				console.log("Can not load logs-list, beacause 'logs' is empty");
			}
		}
		$.mobile.changePage( $('#listpage'), {
			manually: true,
			transition: Router.transition,
			reverse: true
		});
	},

	map: function(storage, param, reload) {
		$.mobile.changePage( $('#mappage'), {
			manually: true,
			transition: Router.transition
		});
	},

	camera: function(storage, param, reload) {
		$('#edit-id').val("0");
		Photo.takePicture(function(imageURI) {
			var image = $('#edit-image');
			//console.log("Saved Photo - FileURI: " + imageURI);
			image.attr('src', imageURI);
			$.mobile.changePage( $('#editpage'), {
				manually: true,
				transition: Router.transition
			});
		});
	},

	log: function(storage, param, reload) {
		if (param.length > 0) {
			var id = parseInt(param, 10);
			if (!isNaN(id)) {
				var log = storage.findLogByID(id);
				PageGenerator.fillLogView(log);
				$.mobile.changePage( $('#logpage'), {
					manually: true,
					transition: Router.transition
				});
			}
		}
	}
};