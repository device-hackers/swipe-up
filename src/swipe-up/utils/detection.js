export default class Detection {
    /**
     * Some old bad user-agents doesn't fire resize when URL bar gets shown or hidden, that's why they need extra scroll
     * handler
     * @param userAgent - window.navigator.userAgent string
     */
    static isUserAgentNotFiringResize(userAgent) {
        return /(?:Lenovo.A850.*\WVersion\/|Lenovo.A889.*\WBrowser\/|\WGT-P5100.*\WVersion\/)/i.test(userAgent)
    }
}