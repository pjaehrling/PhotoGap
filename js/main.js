$(function ($) {

    var app = {
        storage: null,

        //  Initialize Function -> calls: bindEvents, 
        initialize: function() {
            this.bindEvents();
            this.setConfig();
        },

        setConfig: function() {
            $.mobile.linkBindingEnabled   = false;
            $.mobile.pushStateEnabled     = false;
            $.mobile.hashListeningEnabled = false;
            $.mobile.activeBtnClass       = 'unused';
            // ohne die Parameter wie log-id könnten wir uns das hier alles sparen
        },

        // Bind Event Listeners
        bindEvents: function() {
            $(document).on( 'deviceready', this.onDeviceReady );
            $(document).on( 'pagebeforechange', this.beforePageChange );
            $(window).on( 'hashchange', this.onHashChange );

            $('#edit-title').on( 'focus', this.onEditTitleFocus );
            $('#edit-form').on( 'submit', this.onSubmitLog );
            $('.list-link').on( 'taphold', this.onListLinkHold );
        },

        // When Devise is Ready - Phonegap Event
        onDeviceReady: function() {
            console.log("device ready");
            storage = new LocalStore();
            Router.load("#/list", storage, true);
        },

        onEditTitleFocus: function() {
            var scrollToY = $("#edit-title").offset().top;
            $.mobile.silentScroll( scrollToY );
        },

        onHashChange: function() {
            if (storage === null) {
                console.log("Unable to load page, storage-object is null");
            } else {
                Router.load(location.hash, storage, false);
            }
        },

        beforePageChange: function (e, data) {
            if (!data.options.manually) {
                e.preventDefault();
            }
        },

        onListLinkHold: function() {
            storage.deleteAllLogs(function() { //success CB
                storage.initialize();
                Router.load("#/list", storage, true);
                $('#listpage > [data-role="content"]').trigger("create");
                Helper.showPopup('#clearLocalStorage');
            }, function() { //error Callback
                Helper.showPopup('#clearLocalStorageError');
            });
        },

        onSubmitLog: function() {
            $.mobile.loading('show');
            var logID    = $('#edit-id').val();
            var newTitle = $('#edit-title').val();
            var newText  = $('#edit-text').val();

            if ( logID === "0" ) {
                GPSData.getPosition(function(position) {
                    var now      = new Date();
                    var photoSrc = $('#edit-image').attr('src');

                    var log = {
                        id: now.getTime(), title: newTitle, text: newText,
                        year: now.getFullYear(), month: now.getMonth()+1, day: now.getDate(),
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        photo: true, file: photoSrc
                    };

                    var saved = storage.addLog(log);
                    $.mobile.loading('hide');
                    if (saved) {
                        $('#edit-id').val("0");
                        $('#edit-title').val("");
                        $('#edit-text').val("");
                        $('#edit-image').attr('src', "img/pixel.png");
                        Router.load("#/list", storage, true);
                        $('#listpage > [data-role="content"]').trigger("create");
                        Helper.showPopup('#logSavedPopup');
                    } else {
                        Helper.showPopup('#saveLogErrorPopup');
                    }

                }, function(error) {
                    console.log('code: ' + error.code + '\n' + 'message: ' + error.message);
                    $.mobile.loading('hide');
                    Helper.showPopup('#gpsErrorPopup');
                });
            } else {
                //existing one
            }
            return false;
        }
    };

    app.initialize();
});