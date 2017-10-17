Feature: QQ CN iOS

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
    | device            | os-ver | ua-ver | ua-mode              | screen-l  | win-init-l | win-swiped-l | screen-p  | win-init-p | win-swiped-p | user-agent-string |
    | IPhone 7          | 10.2   | 7.8    |                      | 375 x 667 | 667 x 323  | 667 x 375    | 375 x 667 | 375 x 547  | 375 x 573    | "Mozilla/5.0 (iPhone 93; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Version/10.0 MQQBrowser/7.8.0 Mobile/14D27 Safari/8536.25 MttCustomUA/2 QBWebViewType/1 WKType/1" |
