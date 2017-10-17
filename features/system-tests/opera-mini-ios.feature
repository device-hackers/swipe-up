Feature: Opera Mini iOS

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
    | iPhone 6S         | 11.0   | 16.0   |                      | 375 x 667 | 667 x 279  | 667 x 356    | 375 x 667 | 375 x 559  | 375 x 581    | "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A372" |
