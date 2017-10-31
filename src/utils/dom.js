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

/*function createStyleElement() {
    let styleElement = document.createElement('style')
    styleElement.setAttribute('type', 'text/css')
    return styleElement
}
let container = document.querySelector('head')
let styleElement = createStyleElement()
styleElement.textContent = 'body {color: red; font-weight: bold;}'
container.insertBefore(styleElement, container.childNodes[0])*/

//Just basic DOM shortcuts following jQuery style
export default function $(selector) {
    let element = selector instanceof HTMLElement ? selector : document.querySelector(selector)
    return new Wrap(element)
}