import detectPassiveEvents from 'detect-passive-events';
import {isUrlTriggerParamPresent} from '../utils/dom'

const confirmDisableMessage = 'This will allow to disable Swipe Up on this browser. Select OK to disable.'
const urlTriggerParam = 'debugInSwipeUp'
const cornerThreshold = 100
const timesQuickTap = 3

export default class DebugWidgetTrigger {
    constructor (swipeUp, swipeUpOverlay, win) {
        if (swipeUp.browserUiState.state === 'DESKTOP' ||
            swipeUp.browserUiState.state === 'DESKTOP_HTML5_FULLSCREEN') return

        this._shouldShowWidgetOnLoad = false

        isUrlTriggerParamPresent(urlTriggerParam, win) ? this._shouldShowWidgetOnLoad = true : null

        let quickTapDetected = 0
        let timerId, bottomRightTouched, topLeftTouched3Times, bottomLeftTouched, topRightTouched3Times

        let isLeftTouched = (touch) => touch.clientX <= cornerThreshold
        let isRightTouched = (touch) => touch.clientX >= win.innerWidth - cornerThreshold
        let isTopTouched = (touch) => touch.clientY <= cornerThreshold
        let isBottomTouched = (touch) => touch.clientY >= win.innerHeight - cornerThreshold
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
                    swipeUp.disable()
                }
            }
        }

        let process_touch = (touch) => {
            if (isTopLeftCornerTouched(touch)) {
                topLeftTouched3Times = detectQuickTaps()
            } else if (isBottomRightCornerTouched(touch)) {
                bottomRightTouched = true
            } else if (isTopRightCornerTouched(touch)) {
                topRightTouched3Times = detectQuickTaps()
            } else if (isBottomLeftCornerTouched(touch)) {
                bottomLeftTouched = true
            }
        }

        let detectQuickTaps = (target) => {
            quickTapDetected++

            if (timerId) clearTimeout(timerId)
            timerId = setTimeout(() => quickTapDetected = 0, 250)

            return quickTapDetected >= timesQuickTap;
        }

        swipeUpOverlay.addEventListener('touchstart', process_touchstart,
            detectPassiveEvents.hasSupport ? { capture: false, passive: true } : false )
    }

    get shouldShowWidgetOnLoad() {
        return this._shouldShowWidgetOnLoad
    }
}