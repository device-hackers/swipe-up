const confirmDisableMessage = 'This will allow to disable Swipe Up on this browser. Select OK to disable.'
const urlTriggerParam = 'debugInSwipeUp'

export default class DebugWidgetTrigger {
    constructor (swipeUp, swipeUpOverlay, win) {
        this._shouldShowWidgetOnLoad = false
        const isUrlTriggerParamPresent = (name) => new RegExp("[?&]" + name + "(?:$|=|&)", "i").test(win.location.search)
        isUrlTriggerParamPresent(urlTriggerParam) ? this._shouldShowWidgetOnLoad = true : null

        let quickTapDetected = 0
        let timerId, bottomRightTouched, topLeftTouched3Times, bottomLeftTouched, topRightTouched3Times

        const threshold = 100
        let isLeftTouched = (touch) => touch.clientX <= threshold
        let isRightTouched = (touch) => touch.clientX >= win.innerWidth - threshold
        let isTopTouched = (touch) => touch.clientY <= threshold
        let isBottomTouched = (touch) => touch.clientY >= win.innerHeight - threshold
        let isTopLeftCornerTouched = (touch) => isTopTouched(touch) && isLeftTouched(touch)
        let isBottomRightCornerTouched = (touch) => isBottomTouched(touch) && isRightTouched(touch)
        let isTopRightCornerTouched = (touch) => isTopTouched(touch) && isRightTouched(touch)
        let isBottomLeftCornerTouched = (touch) => isBottomTouched(touch) && isLeftTouched(touch)

        let process_touchstart = (event) => {
            bottomRightTouched = topLeftTouched3Times = bottomLeftTouched = topRightTouched3Times = false

            if (event.touches.length === 2) {
                for (let i = 0; i < event.touches.length; i++) {
                    process_touch(event.touches[i])
                }

                if (topLeftTouched3Times && bottomRightTouched) {
                    swipeUp.showDebugWidget()
                } else if (topRightTouched3Times && bottomLeftTouched && confirm(confirmDisableMessage)) {
                    win.localStorage.setItem('SwipeUp._disabled', 'true')
                    swipeUp.disable()
                }
            }
        }

        let process_touch = (touch) => {
            if (isTopLeftCornerTouched(touch)) {
                detectQuickTaps(topLeftTouched3Times)
            } else if (isBottomRightCornerTouched(touch)) {
                bottomRightTouched = true
            } else if (isTopRightCornerTouched(touch)) {
                detectQuickTaps(topRightTouched3Times)
            } else if (isBottomLeftCornerTouched(touch)) {
                bottomLeftTouched = true
            }
        }

        function detectQuickTaps(target) {
            quickTapDetected++

            if (timerId) clearTimeout(timerId)
            timerId = setTimeout(() => quickTapDetected = 0, 250)

            if (quickTapDetected >= 3) {
                target = true
            }
        }

        swipeUpOverlay.addEventListener('touchstart', process_touchstart, false)
    }

    get shouldShowWidgetOnLoad() {
        return this._shouldShowWidgetOnLoad
    }
}