import BrowserUiState from 'browser-ui-state'

class SwipeUp {
    constructor(win = window) {
        this.browserUiState = new BrowserUiState('LANDSCAPE', win)

        //window.addEventListener('load', () => {
            console.log(this.browserUiState.state)
        //})

        const resizeHandler = () => {

        }

        //window.addEventListener('resize', resizeHandler)
        //window.addEventListener('orientationchange', resizeHandler)
        //TODO add scroll handler
    }

    add(first, second) {
        return first + second
    }
}

export default SwipeUp