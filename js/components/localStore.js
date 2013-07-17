var LocalStore = function() {
    var ls = window.localStorage;
    var key = 'photologs';

    /*
     * Init the LocalStorage array value -> if it is not already there
     */
    this.initialize = function() {
        if ( ls.getItem(key) === null) {
            firstLog = new Object();
            firstLog.id = 0;
            firstLog.title = "How everything starts ...";
            firstLog.text = "This is just a default entry, to show you how it looks. Now it's your turn!";
            firstLog.year = 2012;
            firstLog.month = 5;
            firstLog.day = 15;
            firstLog.lat = 52;
            firstLog.lon = 13;
            firstLog.photo = false;
            firstLog.file = "";
            ls.setItem(key, JSON.stringify( { 2012: [firstLog] } ));
        }
    };

    /*
     * Find a log-entry for the given ID
     * -> returns "null" if no log with the given ID is found 
     * -> returns "null" if the hole array is not found
     */
    this.findLogByID = function(findId) {
        var logsJSONString = ls.getItem(key);
        if (logsJSONString === null) {
            return null;
        } else {
            var logs = JSON.parse( logsJSONString );
            for ( var year in logs ) {
                var l = logs[year].length;
                for ( var i=0; i < l; i++ ) {
                    if (logs[year][i].id === findId) {
                        return logs[year][i];
                    }
                }
            }
            return null;
        }
    };

    /*
     * Check if the given object has all key's (vars) that are needed
     */
    this.isValidLogObj = function(log) {
        console.log(log);
        if (      'id'  in log
            && 'title'  in log
            && 'text'   in log
            && 'year'   in log
            && 'month'  in log
            && 'day'    in log
            && 'lat'    in log
            && 'photo'  in log
            && 'file'   in log ) return true;
        else return false;
    };

    /*
     * Add a log-object to the localStorage array
     * -> returns "false" if there is no array in localStorage to add to
     */
    this.addLog = function(log) {
        if ( this.isValidLogObj(log) ) {
            logsJSONString = ls.getItem(key);
            if (logsJSONString === null) {
                return false;
            } else {
                logs = JSON.parse( logsJSONString );
                if (typeof(logs[log.year]) === "undefined") {
                    logs[log.year] = new Array();
                }
                logs[log.year].push(log);
                ls.setItem( key, JSON.stringify(logs) );
                return true;
            }
        } else {
            return false;
        }
    };

    /*
     * Delete the log with the given ID
     * -> returns "false" if there is no array in localStorage to delete from
     * -> returns "false" if there is no log with the given ID
     */
    this.deleteLogByID = function(deleteId) {
        var logsJSONString = ls.getItem(key);
        if (logsJSONString === null) {
            return false;
        } else {
            var logs = JSON.parse( logsJSONString );
            for ( var year in logs ) {
                var l = logs[year].length;
                for ( var i=0; i < l; i++ ) {
                    if ( logs[year][i].id === deleteId ) {
                        logs[year].splice(i, 1);
                        ls.setItem( key, JSON.stringify(logs) );
                        return true;
                    }
                }
            }
            return false;
        }
    };

    /*
     * Edit a log-entry
     * At the moment it is just possible to edit the title and the text, maybe this will be changed later
     * -> returns "false" if there is no array in localStorage to edit
     * -> returns "false" if there is no log-entry with the given ID
     */
    this.editLogByID = function(editId, title, text) {
        var logsJSONString = ls.getItem(key);
        if (logsJSONString === null) {
            return false;
        } else {
            var logs = JSON.parse( logsJSONString );
            for ( var year in logs ) {
                var l = logs[year].length;
                for ( var i=0; i < l; i++ ) {
                    if ( logs[year][i].id === findId ) {
                        logs[year][i] = newLog;
                        return true;
                    }
                }
            }
            return false;
        }
    };

    /*
     * returns the hole array stored in the localStorage
     * -> returns "null" if there is no array in localStorage
     */
    this.loadAllLogs = function() {
        var logsJSONString = ls.getItem(key);
        if (logsJSONString === null) {
            return null;
        } else {
            return JSON.parse( logsJSONString );
        }
    };

    this.deleteAllLogs = function(successCB, errorCB) {
        /* Variante 1 */
        var removeSuccessCB = function() { console.log("Deleted File"); };
        var removeErrorCB = function() { console.log("Error while deleting File"); };

        var logsJSONString = ls.getItem(key);
        if (logsJSONString !== null) {
            var logs = JSON.parse( logsJSONString );
            for ( var year in logs ) {
                var l = logs[year].length;
                for ( var i=0; i < l; i++ ) {
                    if (logs[year][i].photo === true) {
                        FileAccess.removeFile(logs[year][i].file, removeSuccessCB, removeErrorCB);
                    }
                }
            }
            ls.clear();
            successCB();
        }

        /* Variante 2 - just iOS */
        /*
        var newErrorCB = function(msg) { console.log(msg); errorCB(); };
        navigator.camera.cleanup( function() {
            ls.clear();
            successCB();
        }, newErrorCB);
        */
    };

    this.initialize();
};