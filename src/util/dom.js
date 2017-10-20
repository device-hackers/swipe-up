function Wrap(ref) {
    this.ref = ref
}

//Just pipeline
Wrap.prototype.classList = function (className) {
    if (this.ref) return this.ref.classList
}

//Just pipeline
Wrap.prototype.style = function () {
    if (this.ref) return this.ref.style
}

//Just pipeline
Wrap.prototype.focus = function () {
    if (this.ref) this.ref.focus()
}

//Basic mimic for https://api.jquery.com/click/
Wrap.prototype.click = function (handler) {
    if (this.ref) this.ref.addEventListener('click', handler)
}

//Basic mimic for http://api.jquery.com/html/
Wrap.prototype.html = function (htmlString) {
    if (this.ref && htmlString) this.ref.innerHTML = htmlString
    else if (this.ref) return this.ref.innerHTML
}

//Basic mimic for http://api.jquery.com/append/
Wrap.prototype.append = function (content) {
    if (this.ref) {
        this.ref.innerHTML += content
        return this.ref
    }
}

//Basic mimic for http://api.jquery.com/hide/
Wrap.prototype.hide = function () {
    if (this.ref) this.ref.style.display = 'none'
}

//Basic mimic for http://api.jquery.com/show/, WARNING! always switches display to block!
Wrap.prototype.show = function () {
    if (this.ref) this.ref.style.display = 'block'
}

//Basic mimic for http://api.jquery.com/toggle/
Wrap.prototype.toggle = function () {
    if (this.ref) this.ref.style.display === 'none' ? this.show() : this.hide()
}

//Just basic DOM shortcuts following jQuery style
export default function $(selector) {
    let element = selector instanceof HTMLElement ? selector : document.querySelector(selector)
    return new Wrap(element)
}