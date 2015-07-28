Feature: Node Interaction

  Nodes are critical to our Graph, so we need to be able to interact with them.

  Scenario: Adding elements
    Given I have an empty Graph
    And I add a "Walrus" Node "Foo"
    When I add a "Shoe" Node "Bar"
    Then I should see the "Walrus" "Foo" in the Graph
    And I should see the "Shoe" "Bar" in the Graph

  Scenario: Removing elements
    Given I have an empty Graph
    And I add a "Walrus" Node "Foo"
    And I add a "Shoe" Node "Bar"
    When I remove the "Shoe" Node "Bar"
    Then I should see the "Walrus" "Foo" in the Graph
    And I should not see the "Shoe" "Bar" in the Graph
