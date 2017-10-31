export default `
#swipe-up-hand {
    width: 30%;
    height: 30%;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    -webkit-animation: movingHand 1500ms ease-in-out infinite;
    animation: movingHand 1500ms ease-in-out infinite
}

.swipe__trail {
    -webkit-transform: scale3d(1, .1, 1);
    transform: scale3d(1, .1, 1);
    -webkit-animation: trailAppearing 1500ms linear infinite;
    animation: trailAppearing 1500ms linear infinite
}

.swipe__pseudoCircle {
    opacity: 0;
    -webkit-transform: scale3d(.8, .8, 1);
    transform: scale3d(.8, .8, 1);
    -webkit-transform-origin: center;
    transform-origin: center;
    -webkit-animation: circleGrowing 1500ms linear infinite;
    animation: circleGrowing 1500ms linear infinite
}

@-webkit-keyframes trailAppearing {
    0%, 20% {
        -webkit-transform: scale3d(.5, 0, 1);
        transform: scale3d(.5, 0, 1);
        -webkit-transform-origin: top center;
        transform-origin: top center
    }
    40%, 60% {
        -webkit-transform: scale3d(1, .8, 1);
        transform: scale3d(1, .8, 1);
        -webkit-transform-origin: top center;
        transform-origin: top center
    }
    100%, 80% {
        -webkit-transform: scale3d(.5, 0, 1);
        transform: scale3d(.5, 0, 1);
        -webkit-transform-origin: top center;
        transform-origin: top center
    }
}

@keyframes trailAppearing {
    0%, 20% {
        -webkit-transform: scale3d(.5, 0, 1);
        transform: scale3d(.5, 0, 1);
        -webkit-transform-origin: top center;
        transform-origin: top center
    }
    40%, 60% {
        -webkit-transform: scale3d(1, .8, 1);
        transform: scale3d(1, .8, 1);
        -webkit-transform-origin: top center;
        transform-origin: top center
    }
    100%, 80% {
        -webkit-transform: scale3d(.5, 0, 1);
        transform: scale3d(.5, 0, 1);
        -webkit-transform-origin: top center;
        transform-origin: top center
    }
}

@-webkit-keyframes movingHand {
    0% {
        top: 75%
    }
    100% {
        top: 25%
    }
}

@keyframes movingHand {
    0% {
        top: 75%
    }
    100% {
        top: 25%
    }
}

#touch-hand {
    width: 50%;
    -webkit-animation: pressByFinger 1s linear infinite;
    animation: pressByFinger 1s linear infinite;
    -webkit-transform-origin: bottom;
    transform-origin: bottom
}

@media (orientation: landscape) {
    #touch-hand {
        width: 35%
    }
}

.touch__trail {
    -webkit-transform: scale3d(1, .1, 1);
    transform: scale3d(1, .1, 1);
    -webkit-animation: trailAppearing 2s linear infinite;
    animation: trailAppearing 2s linear infinite
}

.touch__pseudoCircle {
    -webkit-transform-origin: center;
    transform-origin: center;
    -webkit-animation: circleGrowing 1s linear infinite;
    animation: circleGrowing 1s linear infinite
}

@-webkit-keyframes pressByFinger {
    0% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
    55%, 95% {
        -webkit-transform: scale3d(.8, .8, 1);
        transform: scale3d(.8, .8, 1);
    }
    100% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

@keyframes pressByFinger {
    0% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
    55%, 95% {
        -webkit-transform: scale3d(.8, .8, 1);
        transform: scale3d(.8, .8, 1);
    }
    100% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

@-webkit-keyframes circleGrowing {
    0% {
        opacity: 0;
        -webkit-transform: scale3d(.51, .51, 1);
        transform: scale3d(.51, .51, 1)
    }
    20% {
        opacity: 0;
        -webkit-transform: scale3d(.71, .71, 1);
        transform: scale3d(.71, .71, 1)
    }
    55%, 95% {
        opacity: .8;
        -webkit-transform: scale3d(1.11, 1.11, 1);
        transform: scale3d(1.11, 1.11, 1)
    }
    100% {
        opacity: 0;
        -webkit-transform: scale3d(.51, .51, 1);
        transform: scale3d(.51, .51, 1)
    }
}

@keyframes circleGrowing {
    0% {
        opacity: 0;
        -webkit-transform: scale3d(.51, .51, 1);
        transform: scale3d(.51, .51, 1)
    }
    20% {
        opacity: 0;
        -webkit-transform: scale3d(.71, .71, 1);
        transform: scale3d(.71, .71, 1)
    }
    55%, 95% {
        opacity: .8;
        -webkit-transform: scale3d(1.11, 1.11, 1);
        transform: scale3d(1.11, 1.11, 1)
    }
    100% {
        opacity: 0;
        -webkit-transform: scale3d(.51, .51, 1);
        transform: scale3d(.51, .51, 1)
    }
}
`