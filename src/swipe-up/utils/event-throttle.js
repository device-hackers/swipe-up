export default class EventThrottle {
    constructor(type, name, win, obj) {
        //https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill for Android Stock browsers
        (function () {
            if ( typeof win.CustomEvent === "function" ) return false

            function CustomEvent ( event, params ) {
                params = params || { bubbles: false, cancelable: false, detail: undefined }
                let evt = document.createEvent( 'CustomEvent' )
                evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail )
                return evt
            }

            CustomEvent.prototype = win.Event.prototype
            win.CustomEvent = CustomEvent
        })()

        obj = obj || win
        let running = false

        let dispatchFunction = () => {
            obj.dispatchEvent(new CustomEvent(name))
            running = false
        }

        let wrapperFunction = () => {
            if (running) return
            running = true
            if (win.requestAnimationFrame) {
                win.requestAnimationFrame(dispatchFunction)
            } else {
                setTimeout(dispatchFunction, 66)
            }
        }

        obj.addEventListener(type, wrapperFunction)
    }
}