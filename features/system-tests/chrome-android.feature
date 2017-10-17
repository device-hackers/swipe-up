Feature: Chrome Android

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
    | Samsung Galaxy S3 | 4.3    | 54     |                      | 640 x 360 | 640 x 279  | 640 x 335    | 360 x 640 | 360 x 559  | 360 x 615    | "Mozilla/5.0 (Linux; Android 4.3; GT-I9300 Build/JSS15J) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.85 Mobile Safari/537.36" |
