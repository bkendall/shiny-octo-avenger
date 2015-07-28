Feature: Associations Interaction

  Graphs need associations to be cool, so let's be cool!

  Background: Initial Graph data
    Given I have an empty Graph
    And I add a "Walrus" Node "Foo"
    And I add a "Shoe" Node "Bar"

  Scenario: Adding an Association
    When I add an Association "Ate" from "Walrus" "Foo" to "Shoe" "Bar"
    Then I should see the that "Walrus" "Foo" "Ate" "Shoe" "Bar"

  Scenario: Removing an Association
    When I add an Association "Ate" from "Walrus" "Foo" to "Shoe" "Bar"
    And I add an Association "Eaten" from "Shoe" "Bar" to "Walrus" "Foo"
    And I remove an Association "Ate" from "Walrus" "Foo" to "Shoe" "Bar"
    Then I should not see the that "Walrus" "Foo" "Ate" "Shoe" "Bar"
