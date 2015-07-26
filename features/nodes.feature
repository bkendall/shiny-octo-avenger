Feature: Node Interaction

  Nodes are critical to our Graph, so we need to be able to interact with them.

  Scenario: Adding elements
    Given I have an empty Graph
    And I add a "Walrus" Node named "Foo"
    When I add a "Shoe" Node named "Bar"
    Then I should be able to see the "Walrus" named "Foo" in the Graph
    And I should be able to see the "Shoe" named "Bar" in the Graph

  Scenario: Removing elements
    Given I have an empty Graph
    And I add a "Walrus" Node named "Foo"
    And I add a "Shoe" Node named "Bar"
    When I remove the "Shoe" Node named "Bar"
    Then I should be able to see the "Walrus" named "Foo" in the Graph
    And I should not be able to see the "Shoe" named "Bar" in the Graph
