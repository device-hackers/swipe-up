function Wrap(ref) {
    this.ref = ref
    Wrap.prototype.classList = ref ? ref.classList : null
    Wrap.prototype.style = ref ? ref.style : null
}

//Just pipeline
Wrap.prototype.focus = function () {
    if (this.ref) this.ref.focus()
}

//Basic mimic for {@link http://api.jquery.com/get/} but returns single element instead of array
Wrap.prototype.get = function () {
    if (this.ref) return this.ref
}

//Basic mimic for {@link https://api.jquery.com/click/}
Wrap.prototype.click = function (handler) {
    if (this.ref) this.ref.addEventListener('click', handler)
}

//Basic mimic for {@link http://api.jquery.com/html/}
Wrap.prototype.html = function (htmlString) {
    if (this.ref && htmlString) this.ref.innerHTML = htmlString
    else if (this.ref) return this.ref.innerHTML
}

//Basic mimic for {@link http://api.jquery.com/append/}
Wrap.prototype.append = function (content) {
    if (this.ref) {
        if (content instanceof HTMLElement) {
            this.ref.appendChild(content)
        } else {
            this.ref.innerHTML += content
        }

        return this.ref
    }
}

//Basic mimic for {@link http://api.jquery.com/hide/}
Wrap.prototype.hide = function () {
    if (this.ref) this.ref.style.display = 'none'
}

//Basic mimic for {@link http://api.jquery.com/show/}, WARNING! always switches display to block!
Wrap.prototype.show = function () {
    if (this.ref) this.ref.style.display = 'block'
}

//Basic mimic for {@link http://api.jquery.com/toggle/}
Wrap.prototype.toggle = function () {
    if (this.ref) this.ref.style.display === 'none' ? this.show() : this.hide()
}

//Just basic DOM shortcuts following jQuery style
export default function $(selector) {
    let element = selector instanceof HTMLElement ? selector : document.querySelector(selector)
    return new Wrap(element)
}

//-------------------------------------------------------------------------------------------------

export const isUrlTriggerParamPresent = (name, win) =>
                 new RegExp(`[?&]${name}(?:$|=|&)`, 'i').test(win.location.search)

export const getUrlParamValue = (name, win) => {
    let result = new RegExp(`${name}=(.*?)(?:$|#|&)`, 'i').exec(win.location.search)
    return result ? decodeURI(result[1]) : result
}

export const overrideString = (option, optionName, win) => {
    let value = getUrlParamValue(optionName, win)
    value ? option[optionName] = value : null
}

export const overrideBoolean = (option, optionName, win) => {
    let value = getUrlParamValue(optionName, win)
    if (value && (value === 'true' || value === 'false')) {
        option[optionName] = value === 'true'
    }
}

export const overrideNumber = (option, optionName, win) => {
    let value = getUrlParamValue(optionName, win)
    value ? option[optionName] = parseInt(value) : null
}

export const overrideRegExp = (option, optionName, win) => {
    let value = getUrlParamValue(optionName, win)
    value ? option[optionName] = new RegExp(value, 'i') : null
}

/**
 * @returns {boolean} true if script running inside iFrame (no matter in which level), false otherwise
 */
export const inIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

export function addRunTimeStyles(css, win = window) {
    //Strip potential UTF-8 BOM if CSS was read from a file
    if (css.charCodeAt(0) === 0xFEFF) css = css.substr(1, css.length)

    let styleElement = win.document.createElement('style')
    styleElement.setAttribute('id', 'swipe-up-styles')
    styleElement.setAttribute('type', 'text/css')

    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = css
    } else {
        styleElement.textContent = css;
    }

    let head = win.document.querySelector('head')
    head.insertBefore(styleElement, head.childNodes[0])
}