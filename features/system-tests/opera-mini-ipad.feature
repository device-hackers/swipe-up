Feature: Opera Mini iPad

  Scenario Outline: Regular scenario
    Given a user agent equals to <user-agent-string>
      And screen dimensions is <screen-l>
      And window dimensions is <win-init-l>
    Then browser ui state should be equal "STATIC"
    When after swipe up window dimensions changes to <win-swiped-l>
    Then browser ui state should be equal "STATIC"

    When browser is rotated to portrait
      And screen dimensions changes to <screen-p>
      And window dimensions changes to <win-init-p>
    Then browser ui state should be equal "STATIC"
    When after swipe up window dimensions changes to <win-swiped-p>
    Then browser ui state should be equal "STATIC"

  Examples:
    | device            | os-ver | ua-ver | ua-mode              | screen-l    | win-init-l  | win-swiped-l  | screen-p   | win-init-p | win-swiped-p | user-agent-string |
    | iPad Mini 3       | 10.0   | 16.0   |                      | 768 x 1024  | 1024 x 658  | 1024 x 65     | 768 x 1024 | 768 x 914  | 768 x 914    | "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Mobile/14A5341a" |
