Feature: UC Browser EN & CN iOS

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
    | device            | os-ver | ua-ver | ua-mode              | screen-l    | win-init-l  | win-swiped-l  | screen-p   | win-init-p | win-swiped-p | user-agent-string |
    | iPhone 6S+        | 10.1   | 10.9   |                      | 375 x 667   | 667 x 267   | 667 x 312     | 375 x 667  | 375 x 559  | 375 x 603    | "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X; en-US) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14B100 UCBrowser/10.9.1.998 Mobile" |
