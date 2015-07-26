Feature: Nodes

  Scenario: Adding elements
    Given I have an empty graph
    When I add a "Walrus" Node named "Foo"
    Then I should be able to see the "Walrus" named "Foo" in the graph
