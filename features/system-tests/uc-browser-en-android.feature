Feature: UC Browser EN Android

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
    | Galaxy Tab 4 10.1 | 5.0    | 11.4   |                      | 1280 x 800  | 1280 x 725  | 1280 x 775    | 800 x 1280 | 800 x 1157 | 800 x 1207   | "Mozilla/5.0 (Linux; U; Android 5.0.2; en-US; SM-T531 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.4.5.1005 Mobile Safari/537.36" |
