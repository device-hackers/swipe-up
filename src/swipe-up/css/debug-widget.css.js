export default `
.debugWidget {
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid black;
    color: white;
    position: fixed;
    top: 5px;
    left: 5px;
    right: 5px;
    padding: 5px;
    font-family: Arial, sans-serif;
    font-size: 1.2vmax;
    z-index: 1000;
    display: none;
}

.debugWidgetCloseBtn {
    position: absolute;
    background-color: transparent;
    color: white;
    border: none;
    font-size: 24px;
    right: 0;
    top: 0;
    padding: 0 5px 5px 5px;
    line-height: 18px;
}

.debugAllReadings{
    margin-right: 10px;
}

.debugUserAgent, .debugSwipeUpOptions {
    font-size: 0.9em;
}

.debugSwipeUpOptions i {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 4em;
    vertical-align: bottom;
}

.debugButtons {
    margin-top: 5px;
    display: flex;
}

.debugButtons button {
    border: 1px solid silver;
    background-color: transparent;
    color: white;
    font-size: 1.5em;
    padding: 0.3em;
    flex: 1 1 auto;
    margin-left: 5px;
    margin-right: 5px;
}

.debugButtons button.disabled {
    color: silver;
}

.inputForKeyboard {
    width: 1px;
    border: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
}
`