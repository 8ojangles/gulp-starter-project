var assert = require('chai').assert;
var numbers = [1, 2, 3, 4, 5];


describe( 'Base test file' , function() {

	// add a test hook
	// beforeEach(function() {
	// 	// ...some logic before each test is run
	// })

	// test a functionality
	it('should check typeof array', function() {
		assert.isArray(numbers, 'is array of numbers');
	})

	it('should check contents for member (2)', function() {
		assert.include(numbers, 2, 'array contains 2');
	})

	it('should check array length', function() {
		assert.lengthOf(numbers, 5, 'array contains 5 numbers');
	})
  
})