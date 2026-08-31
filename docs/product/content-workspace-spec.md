# SuchaMojo Content Workspace — Build Specification

## Product promise

SuchaMojo turns a person’s experiences, knowledge, beliefs and curiosity into a content system that can explain why they should create a particular piece of content.

The core loop is:

`Capture → Connect → Research → Create → Publish → Learn`

The first usable release stops short of automated research, direct publishing and social analytics. It must prove this connected loop:

`Onboard → Build Universe → Capture → Find → Create → Save/Export`

## Product boundaries

- Keep the cinematic public website at `/`.
- Create a separate authenticated workspace under `/app`.
- Use Eden as a reference for quick navigation, contextual panes and source-aware creation, not as a visual template.
- Generated work must cite the user-owned items it used.
- Never invent personal experience, proof, client results or achievements.
- Keep active curiosity separate from earned expertise.
- Archive normal content instead of permanently deleting it.
- Require explicit confirmation for account deletion.

## Release-one routes

Public: `/`, `/how-it-works`, `/privacy`, `/login`, `/signup`.

Onboarding: `/onboarding/welcome`, `/onboarding/story`, `/onboarding/strengths`, `/onboarding/rabbit-holes`, `/onboarding/convictions`, `/onboarding/people`, `/onboarding/voice`, `/onboarding/proof`, `/onboarding/direction`, `/onboarding/reveal`.

Workspace: `/app`, `/app/universe`, `/app/inbox`, `/app/library`, `/app/create`, `/app/create/:draftId`, `/app/calendar`, `/app/chat`, `/app/settings`.

`/app/discover` is a clearly labelled later feature and must not pretend to have live research in release one.

## Release-one acceptance journey

1. A visitor creates an email/password account.
2. An incomplete account resumes its saved onboarding location.
3. The user completes the eight modules and receives a structured Content Universe.
4. The user enters `/app` and captures an unchanged original note.
5. The user reviews and accepts suggested organisation for that capture.
6. The processed item is searchable in the Library.
7. The user starts a draft from that item, selects an angle, writes or generates a draft, and leaves.
8. The draft reopens with its content and source links intact.
9. The user exports the draft or places it on the calendar.
10. The user can export their account data and can request deletion through explicit confirmation.

## Deferred

- Live Discover feeds and creator tracking.
- Direct social publishing.
- Social account analytics.
- Voice-note transcription, image understanding and document parsing beyond safe file capture.
- Advanced force-directed universe maps.
- Automatic permanent reorganisation without user approval.

