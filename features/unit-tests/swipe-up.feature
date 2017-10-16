Feature: Swipe Up

  Scenario Outline: Unit testing each method of swipe-up.js

    Given we have initialized swipe up
    Then add <screen-w-l> + <screen-h-l> should return <ua-mode>


  Examples:
    | device   | os-ver | ua-ver    | ua-mode | screen-w-l  | screen-h-l | win-w-init-l | win-h-init-l | win-w-swiped-l | win-h-swiped-l | screen-w-p  | screen-h-p | win-w-init-p | win-h-init-p | win-w-swiped-p | win-h-swiped-p | th-l-col | th-l-key | th-p-col | th-p-key | user-agent-string |
    | iPhone 7 | 10.2   | Safari 10 |   1042  | 375         | 667        | 667          | 331          | 667            | 375            | 375         | 667        | 375          | 559          | 375            | 627            | 6.75     | 48.0     | 12.0     | 32.7     | "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Version/10.0 Mobile/14D27 Safari/602.1" |
