Motivator is a web app that can help you build good habits and break bad ones.

There are a lot of other apps for tracking goals and habits, but I couldn't find
one that worked exactly like I wanted it to. This one has the following
features:

* Each goal can have a reward associated with it.
* After completing a goal, you can claim the reward.
* History can be edited, because I tend to forget to update things at the end of
  the day.

### To do

* Convert rewards to points and add total to the UI
* New UI elements for creating rewards, claiming them, and viewing history
* Daily goals and goal streaks
* Fix labels
* Fix capitalization in text fields
* Save on enter key
* Enhance tutorial

### Prerequisites

If you're using Firefox version 54-59, you have to enable ES6 modules in
[about:config] under the `dom.moduleScripts.enabled` flag. Prior versions don't
support modules at all.

If you're using Chrome, make sure it's version 61 or greater.

If you're using something else, see
[here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility).

### Demo

Right [here](http://dave-kennedy.github.io/motivator).
