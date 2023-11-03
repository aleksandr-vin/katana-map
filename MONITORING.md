# Monitoring


## Google Analytics

To see usage of the site.

### User's Interaction

Links are automatically tracked by GA:

- User clicks a link within a popup
- User clicks a link to add new location (top-right)
- User clicks a link to check About in the menu
- User clicks a link to Add location in the menu
- User clicks a link to go to r/KatanaMap in the menu
- User clicks a link to check Version in the menu

Custom events for:

- User opens a popup: `open-popup`
- User initiates the share flow: `share`
- User opens Google Maps: `google-maps-click`
- User opens Maps: `maps-click`
- User clicks on an item's (location's) link: `item-link-click`


## Roadmap

1. Build GA reports:
   - [ ] What location got most interaction (openning of popup)
   - [ ] What links are most navigated to.
2. Track when user enables his location (not tracking his location, but only the fact)
