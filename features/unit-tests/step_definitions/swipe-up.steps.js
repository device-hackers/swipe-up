import {defineSupportCode} from 'cucumber'
import {should} from 'chai'; should();
import SwipeUp from '../../../src/swipe-up/index.js'

defineSupportCode(function(context) {
    let Given = context.Given
    let When = context.When
    let Then = context.Then



    Given('we have initialized swipe up', function () {
        //this.swipeUp = new SwipeUp('LANDSCAPE', this.win)
    });


    Then('add {int} + {int} should return {int}', function (int, int2, int3) {
        //this.swipeUp.add(int, int2).should.be.equal(int3)
    });
})