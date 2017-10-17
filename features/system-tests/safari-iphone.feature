Feature: Safari iPhone

  Scenario Outline: Regular scenario
    Given a user agent equals to <user-agent-string>
      And screen dimensions is <screen-l>
      And window dimensions is <win-init-l>
    Then browser ui state should be equal "COLLAPSED"
    When after swipe up window dimensions changes to <win-swiped-l>
    Then browser ui state should be equal "EXPANDED"

    When browser is rotated to portrait
      And screen dimensions changes to <screen-p>
      And window dimensions changes to <win-init-p>
    Then browser ui state should be equal "COLLAPSED"
    When after swipe up window dimensions changes to <win-swiped-p>
    Then browser ui state should be equal "EXPANDED"

  Examples:
    | device         | os-ver | ua-ver | ua-mode              | screen-l  | win-init-l | win-swiped-l | screen-p  | win-init-p | win-swiped-p | user-agent-string |
    | iPhone 7       | 10.2   | 10     |                      | 375 x 667 | 667 x 331  | 667 x 375    | 375 x 667 | 375 x 559  | 375 x 627    | "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Version/10.0 Mobile/14D27 Safari/602.1" |
    | iPhone 6S Plus | 10.1   | 10     |                      | 414 x 736 | 736 x 370  | 736 x 414    | 414 x 736 | 414 x 628  | 414 x 696    | "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0 Mobile/14B100 Safari/602.1" |
    | iPhone 6S Plus | 10.1   | 10     | "Show tab bar" is on | 414 x 736 | 736 x 337  | 736 x 414    | 414 x 736 | 414 x 628  | 414 x 696    | "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0 Mobile/14B100 Safari/602.1" |
    | iPhone 5S      | 9.3    | 9      |                      | 320 x 568 | 568 x 232  | 568 x 320    | 320 x 568 | 320 x 460  | 320 x 529    | "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 Mobile/14G60 Safari/602.1" |
    | iPhone X       | 11     | 11     |                      | 375 x 812 | 812 x 325  | 812 x 375    | 375 x 812 | 375 x 635  | 375 x 748    | "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1" |
    | iPhone 8 Plus  | 11     | 10     |                      | 414 x 736 | 736 x 364  | 736 x 414    | 414 x 736 | 414 x 622  | 414 x 696    | "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1" |
    | iPhone 8 Plus  | 11     | 10     | "Show tab bar" is on | 414 x 736 | 736 x 331  | 736 x 414    | 414 x 736 | 414 x 622  | 414 x 696    | "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1" |
    | iPhone 8       | 11     | 11     |                      | 375 x 667 | 667 x 325  | 667 x 375    | 375 x 667 | 375 x 553  | 375 x 628    | "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1" |
    | iPhone 6S      | 11     | 11     |                      | 375 x 667 | 667 x 325  | 667 x 375    | 375 x 667 | 375 x 553  | 375 x 628    | "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1" |
    | iPhone 4S      | 8.4    | 8      |                      | 320 x 480 | 480 x 232  | 480 x 320    | 320 x 480 | 320 x 372  | 320 x 441    | "Mozilla/5.0 (iPhone; CPU iPhone OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4" |
    | iPhone 4S      | 9.3.   | 9      |                      | 320 x 480 | 480 x 232  | 480 x 320    | 320 x 480 | 320 x 372  | 320 x 441    | "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G36 Safari/601.1" |
