timecalc.js
===========

### Usage:  
First: Include jQuery and timecalc.js:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
	<script src="js/timecalc.js"></script>
	```

1. Let timecalc do all the work:

	```javascript
	$('#time-input').timecalc( $('#time-output') );
	```
	The total time is now bind to '#time-output'. It will be refreshed in as soon as the input changes.
	
2. Or customize it:
 	```javascript
	$('#time-input').timecalc();
  $('#time-input').on('timecalcupdate', function ( event ) {
	  $('#time-output').text('My Time: ' event.formattedTime);
	}
	```
3. You can go even further:
 	```javascript
	$('#time-input').timecalc();
	$('#time-input').on('timecalcupdate', function ( event ) {
    $('#time-output').empty();		
    $('#time-output').append(
      "<p class=\"hr\">"  + event.hours   + "</p>" +   
      "<p class=\"min\">" + event.minutes + "</p>" + 
      "<p class=\"sec\">" + event.seconds + "</p>" 
    );
  });
	```

### Demo:  
http://makhani.de/timecalc (will soon be updated!)

### Download:  
coming soon!


© 2014 Eric Lambrecht (http://makhani.de)

Licensed under MIT

