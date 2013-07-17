var Photo = {
	onFail: function(message) {
		console.log('Failed because: ' + message);
	},

	takePicture: function(successCB) {
		navigator.camera.getPicture(successCB, this.onFail, {
			saveToPhotoAlbum: false,
			destinationType: Camera.DestinationType.FILE_URI
		});
	}
};

var GPSData = {
	getPosition: function(successCB, errorCB) {
		navigator.geolocation.getCurrentPosition(successCB, errorCB);
	}
};

var FileAccess = {
	// request the persistent file system
	getFileSys: function(successCB, errorCB) {
		window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, successCB, errorCB);
	},

	removeFile: function(fileuri, successCB, errorCB) {
		var newErrorCB = function(evt) {
			errorCB();
			console.log(evt);
		};

		var filename = fileuri.substr( fileuri.lastIndexOf("/")+1 );
		FileAccess.getFileSys( function (fileSystem) {
			console.log("to delete: " + filename);
			fileSystem.root.getFile(filename, null, function(fileEntry) {
				fileEntry.remove(successCB, newErrorCB);
			}, newErrorCB);

		}, newErrorCB);
	}
};