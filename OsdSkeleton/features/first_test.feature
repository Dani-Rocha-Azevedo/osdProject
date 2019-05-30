Feature: First test
    first test 

    Scenario: Go to app play the content
        Given Button:"play"
        When I click on this button
        Then Close browser

    # Scenario: Go to app stop the content
    #     Given Button:"stop"
    #     When I click on this button
    #     Then Close browser