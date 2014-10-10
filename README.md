timecalc.js
===========

### Try it now!
If you're just here to calculate some times, go for it!  
Try it here: http://makhani.de/timecalc

### Currently supported time formats
* `hh:mm:ss`
    * ` 1:40:15` - 1 Hour, 40 Minutes, 15 Seconds
    * `03:2:7`  - 3 Hours, 2 Minutes, 7 Seconds
    * `02:180:75` - 4 Hours, 1 Minute, 15 Seconds
    * `1:40` - 1 Hour, 40 Minutes, 0 Seconds
    * `:1:40` - 0 Hours, 1 Minute, 40 Seconds
* hh as decimal value
    * `4` - 4 Hours
    * `2.5` - 2 Hours, 30 Minutes
    * `2,5` - 2 Hours, 30 Minutes (European Format)
* hh Hours mm Minutes ss Seconds

### Basic API-usage:  
1. Include jQuery and timecalc.js:
    ```html
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
    <script src="js/timecalc.js"></script>
    ```

2. DOM-element-method:
    ```javascript
    $('#time-input').timecalc( $('#time-output') );
    ```    
    The total time is now bind to `$('#time-output')`. It will be refreshed in as soon as the input changes.
    
    OR
    
3. Direct-input-method:
    ```javascript
    $.timecalc( "33:70:12" );
    ```  
    
### Option parameters

You can customize timecalc's options as follows:
```javascript
$('#time-input').timecalc( "option", "time-delimiter", "-"); // set time-delimiter to '-'.
```  

or if you're parsing without DOM-elements:
```javascript
var options = {time-delimiter: '-'};
$.timecalc( "33:70:12 - 1:20:3", options);
```  

There are currently 3 options you can modify:
* **time-delimiter**: specifies the char(s), that split(s) up the times. Default is _'\n'_.
* **return-formatted**: (_true/false_) whether or not a formatted string is returned. Only applies to direct-input-method. Default is _true_.
* **natlang-support**: (_true/false_) if false, timecalc wont parse for natural language. Default is _true_.
	
### Some more examples

You can also handle the update event yourself and do with whatever you want to do with the data.  
Here are some examples: 

```javascript
$('#time-input').timecalc();
$('#time-input').on('timecalcupdate', function ( event ) {
   $('#time-output').text('My Time: ' event.formattedTime);
}
```

```javascript
$('#time-input').timecalc();
$('#time-input').on('timecalcupdate', function ( event ) {
   $('#time-output-hr').text(event.hours + ' Hours');
   $('#time-output-min').text(event.minutes + ' Minutes');
   $('#time-output-sec').text(event.seconds + ' Seconds');
});
```

(will be updated in the future).

### Download:  
http://plugins.jquery.com/timecalc/


© 2014 Eric Lambrecht (http://makhani.de)

Licensed under MIT

