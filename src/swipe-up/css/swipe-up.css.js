export default `
.swipeUpOverlay {
    display: none;
    position: absolute;
    width: 100%;
    height: 200vh;
    top: 0;
    left: 0;
    z-index: 999;
    color: white;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.fixedFlexBox {
    position: fixed;
    display: table;
    align-items: center;
    width: 100%;
    height: 140%; /* this and below are needed for Safari portrait otherwise there will be a 'gap' after swipe up */
    top: -20%;
    font-size: 3vmax;
    background-color: rgba(0, 0, 0, 0.5);
}

.content {
    width: 100%;
    display: table-cell;
    vertical-align: middle;
}
`