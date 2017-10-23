export default class EventThrottle {
    constructor(type, name, win, obj) {
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