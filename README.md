# Activism Report

[Start](https://activism.taske.ren/)

Activism Report is a Destiny 2 Activity History Tracker, designed to make a way to have a quick review of your past
activities, also counting its amount and tagging the highlights.

## Notice for Usage

Activism Report retrieves data from Bungie API, which **the API itself have 1-2 minutes latency.**

Activism Report fetches the "Character Activity Histories", so if you switched to other characters in a single
instance of activity (which is someone else stays in the activity, not everybody go back to the orbit),
**they are duplicated, where one might be _completed_ and others are _incomplete_.**

## API

The backend API is located in a separated worker project, [Activisme](https://github.com/Taskeren/activisme).

## Credits

- [Old Nuxt Version](https://github.com/Taskeren/d2-activism-report)
- **ChenTL** helped a lot on discovering the Bungie API. He's nice!
- **Bungie API** also gives the opportunity to this, although Bungie API is full of shit.
