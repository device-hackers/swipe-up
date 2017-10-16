import {defineSupportCode} from 'cucumber'
import {should} from 'chai'; should();
import SwipeUp from '../../../src/swipe-up/index.js'

defineSupportCode(function(context) {
    let Given = context.Given
    let When = context.When
    let Then = context.Then

    let CustomWorld = function() {}

    CustomWorld.prototype.swipeUp = null
    CustomWorld.prototype.win = {
        innerWidth: 0,
        innerHeight: 0,
        screen: {
            width: 0,
            height: 0
        },
        orientation: 90,
        navigator: {
            userAgent: '',
            standalone: false
        },
        document: {
            documentElement: {
                addEventListener(type, listener, useCapture) { /*NOOP*/ }
            }
        },
        addEventListener(type, listener, useCapture) { /*NOOP*/ },
        dispatchEvent(event) { /*NOOP*/ }
    }
    context.setWorldConstructor(CustomWorld)

    Given('we have initialized swipe up', function () {
        this.swipeUp = new SwipeUp(this.win)
    });


    Then('add {int} + {int} should return {int}', function (int, int2, int3) {
        this.swipeUp.add(int, int2).should.be.equal(int3)
    });
})