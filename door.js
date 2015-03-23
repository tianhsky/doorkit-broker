// Logger
var log = require('./logger.js')();

// Piface
var pif = require('caf_piface');

var door;
var Door = function(){
    // Consts
    var ON = 1;
    var OFF = 0;
    var RELAY = 0;
    var piface = new pif.PiFace();
    var lockTimer = null;

    piface.init();
    log.info("Door initialized");

    this.unlock = function(milliseconds, unlocked_cb, locked_cb) {
        var self = this;

        // unlock
        piface.write(ON, RELAY);
        log.info("Door unlocked");
        unlocked_cb();

        // lock
        clearTimeout(lockTimer);
        lockTimer = setTimeout(function(){ 
            self.lock();
            locked_cb();
        }, milliseconds);
    }
    this.lock = function() {
        clearTimeout(lockTimer);
        piface.write(OFF, RELAY);
        log.info("Door locked");
    };
}
if(!door) door = new Door();

module.exports = door;