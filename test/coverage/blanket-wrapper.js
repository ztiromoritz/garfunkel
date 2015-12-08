/**
 * This wrapper was create to preserve the correct 
 * line numbers in stack traces when running test with mocha
 */
require('blanket')({
    pattern: function (filename) {
        if (/node_modules/.test(filename))
        	return false;
        if(/garfunkel\.test\.js/.test(filename))
        	return false;
        return true;
   	 }
});

require('../garfunkel.test.js');	
