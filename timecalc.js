/*
 *	timecalc.js
 *
 *  Parses multi line content for times and calculates a total time duration.
 *
 *  Author: Eric Lambrecht
 *  License: MIT
*/

;(function ($, window, undefined) {
    
    "use strict";
    var TimeCalculator, Time,
        defaults = {
            'line-delimiter': '\n',
            'natlang-support': true,
        };
    
    /*
     * Custom jQuery function '$.timecalc()'. 
     *
     *   Example: $('#time-input').timecalc();
     * Parsed time can be get with $('#time-input').timecalc('getHours');
     *
     *   Example: $('#time-input').timecalc($('time-output-digits'));
     * Parsed time is stored in the specified DOM element.
     */ 
    $.fn.timecalc = function ( options ) {
        var args = arguments;

        if (options === undefined || typeof options === 'object' ) {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_timecalc')) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_timecalc', new TimeCalculator( this, options ));
                }
            });
        }
        else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_timecalc');

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof TimeCalculator && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                  $.data(this, 'plugin_timecalc', null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    }
    
    /*
     * constructor
     */
    TimeCalculator = function (inputElement, options) {
        
        this.$input = $(inputElement);
        this.$output = false;
        this._settings = defaults;
        
        // If we were given a jQuery object, we'll be using it as the output element.
        if (options instanceof jQuery) {
            this.$output = options;
        }
        // Otherwise some kind of settings must be given...
        else {
            this._settings = $.extend( {}, defaults, options);
        }
        
        this.total = new Time();
        this.init();
    };
    
    TimeCalculator.prototype = {
        
        /*
         * Init the plugin with a keyup event.
         */
        init : function () {
            // Parse input on key up.
            this.$input.on("keyup", $.proxy(function () {
                this.parseInput();
                this.update();
            }, this));
        },
        
        /*
         * Sets a value, after initialization.
         */
        option: function (name, value) {
            if ( value === undefined ) {
                // getter
                return this._settings[name];
            }
            else {
                // setter
                this._settings[name] = value;  
            }
        },
        
        /**
         * This function parses the user's input and adds it to a time object
         *
         * Input will be tried to be parsed in the following order:
         *	1. Values followed by name/description
         *	2. Decimal representation of hours (e.g. dot- or comma-seperated)
         *	3. Colon-seperated time representation (hh:mm:ss)
         *
         * Accepts a custom input string parameter, which can be parsed instead and independantly.
         */
        parseInput : function ( customInputString, formatted ) { 

            // get text-area content 
            // TODO: check if element is textarea at all (in init or constructor)
            var input = customInputString ? customInputString : this.$input.val(),
                lines = input.split( this._settings['line-delimiter'] ),
                hours,
                mins,
                secs,
                i;
            
            if (typeof formatted === 'undefined') formatted = true;
            
            // reset _all_ previous calculated times.
            this.total = new Time();

            // iterate over lines , @todo: maybe replace with foreach 
            for (i = 0; i < lines.length; i++) {

                hours = this.total.getHours(),
                mins  = this.total.getMinutes(),
                secs  = this.total.getSeconds();

                // if values are followed by description:
                if(this._settings['natlang-support']) {
                    if (lines[i].indexOf("hour") !== -1 || lines[i].indexOf("minute") !== -1 || lines[i].indexOf("second") !== -1) {
                        var stringHasRightFormat,
                            match,
                            parts,
                            tmpLine = lines[i],
                            partIdx = 0;

                        do {
                            // Search for (first) number
                            match = tmpLine.match(/[0-9]/g);
                            parts = tmpLine.split(' ');
                            stringHasRightFormat = match != null && partIdx + 1 < parts.length;
                            if (stringHasRightFormat) {
                                var currentNumber = parts[partIdx]; 
                                var currentTimeUnit = parts[partIdx + 1].toString().toLowerCase();
                                switch(currentTimeUnit) {
                                    case "hour":
                                    case "hours":
                                        hours = parseInt(currentNumber) + hours;
                                        break;
                                    case "minute":
                                    case "minutes":
                                        mins = parseInt(currentNumber) + mins;
                                        break;	
                                    case "second":
                                    case "seconds":
                                        secs = parseInt(currentNumber) + secs;
                                        break;								
                                }
                                partIdx += 2;
                            }
                        }
                        while (stringHasRightFormat);
                    }
                }

                // if line has comma or dot, we treat it as hours in decimal representation.
                else if (lines[i].indexOf(",") !== -1 || lines[i].indexOf(".") !== -1) {
                    var inputNumber = parseFloat(lines[i].replace(",", "."));		
                    mins = Math.round(inputNumber*60) + mins;
                }

                // try seperating by colon(s)
                else {
                    var tmpTime = lines[i].split(":");
                    hours = parseInt(tmpTime[0] ? tmpTime[0] : 0) + hours;
                    mins  = parseInt(tmpTime[1] ? tmpTime[1] : 0) + mins ;
                    secs  = parseInt(tmpTime[2] ? tmpTime[2] : 0) + secs;
                }  

                // add/set updated time
                this.total.setTime(hours, mins, secs);
            }
            
            // return if custom input was given
            if(typeof customInputString !== 'undefined') {
                if(formatted) {
                    return this.getFormattedTime();    
                }
                else {
                    return this.getTotalTime();   
                }
            }
        },
        
        /*
         * Fires 'timecalcupdate' event and outputs time to output element (if set).
         */
        update : function () {
            
            var formattedTime;
            // switch over different types of (user choses) output-formats.
            formattedTime = this.getFormattedTime();
            
            if (this.$output) {
                // write time to output element.
                if($output.is('input, select, textarea')) {
                    this.$output.val(formattedTime);
                }
                else {
                    this.$output.text(formattedTime);
                }
            }
            
            // fire the 'timecalcupdate' event.
            this.$input.trigger({
                type: 'timecalcupdate', 
                hours: this.total.getHours(),
                minutes: this.total.getMinutes(),
                seconds: this.total.getSeconds(),
                formattedTime: formattedTime,
            }); 
            
        },
        
        getFormattedTime : function() {
            return this.total.getHours() + ':' + this.total.getMinutes() + ':' + this.total.getSeconds();
        },
        
        getTotalTime : function() {
            return this.total;
        }
    };

    /**
     * Represents time.
     * This object can hold hours, minutes and seconds.
     * It additionaly provides simple arrangement of it's time values.
     * @constructor
     */
    Time = function () {

        this.hours   = 0;
        this.minutes = 0;
        this.seconds = 0;

    }

    Time.prototype.getHours   = function () {
        return this.hours;
    };	
    Time.prototype.getMinutes = function () {
        return this.minutes;
    };	
    Time.prototype.getSeconds = function () {
        return this.seconds;
    };


    Time.prototype.setHours   = function (hours) {
        this.hours = hours;
    };		
    Time.prototype.setMinutes = function (mins) {
        this.minutes = mins;
        this.arrangeTime();
    };		
    Time.prototype.setSeconds = function (secs) {
        this.seconds = secs;
        this.arrangeTime();
    };	


    Time.prototype.setTime = function (hours, mins, secs) {
        this.setHours(hours);
        this.setMinutes(mins);
        this.setSeconds(secs);
    };

    /**
     * this function rearranges time by removing over-/underflow
     */
    Time.prototype.arrangeTime = function () {
        // arrange minutes.
        while (this.seconds >= 60) {
            this.minutes +=  1;
            this.seconds -= 60;
        }
        while (this.minutes >= 60) {
            this.hours   +=  1;
            this.minutes -= 60;
        }
        // arrange seconds.
        while (this.seconds <= -60) {
            this.minutes  -=  1;
            this.seconds  += 60;
        }
        while (this.minutes <= -60) {
            this.hours    -=  1;
            this.minutes  += 60;
        }
    };
      
}) (jQuery, window);
