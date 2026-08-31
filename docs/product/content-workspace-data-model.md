# SuchaMojo Content Workspace — Convex Data Model

Every private table uses `userId: v.id("users")`. Every public Convex function derives the current user through `getAuthUserId(ctx)` and rejects records whose `userId` differs. Client-supplied user IDs are never used for access control.

## Existing tables retained during migration

- `users` and the other `@convex-dev/auth` tables.
- `creatorProfiles`, temporarily.
- `contentUniverses`, temporarily as the legacy generated snapshot.
- `ideas` and `lockedDirections`, read during migration but replaced by drafts and source references.

## New tables

### `onboardingSessions`

- `userId`
- `status`: `not_started | in_progress | generating | complete`
- `activeModule`
- `completedModules: string[]` (bounded to eight known module keys)
- `startedAt`, `updatedAt`, `completedAt?`
- Index: `by_userId`

### `onboardingAnswers`

- `userId`, `sessionId`
- `module`, `questionKey`, `answer`
- `skipped`, `updatedAt`
- Indexes: `by_userId_and_sessionId`, `by_sessionId_and_questionKey`
- Unique question enforcement happens in the save mutation by updating an existing indexed record.

### `universes`

- `userId`, `status`, `version`
- `identity`, `positioning`, `mission`
- `generatedFromSessionId`, `createdAt`, `updatedAt`
- Index: `by_userId`

### `universeItems`

- `userId`, `universeId`
- `type`: `story | strength | subject | conviction | audience | voice | proof | direction | theme | opportunity`
- `title`, `description`, `tags: string[]`
- `sourceType`: `onboarding_answer | capture | library_item | draft | user_created`
- `sourceId`, `sourceExcerpt?`
- `confidence`: `user_stated | inferred | uncertain`
- `archived`, `createdAt`, `updatedAt`
- Indexes: `by_userId_and_archived`, `by_universeId_and_type`
- Search index: title and description, filtered by `userId` and `archived`.

### `universeConnections`

- `userId`, `universeId`, `fromItemId`, `toItemId`
- `relationship`: `supports | relates_to | contradicts | serves | expressed_as | developed_into`
- `reason`, `createdAt`
- Indexes: `by_fromItemId`, `by_toItemId`, `by_universeId`

### `captures`

- `userId`
- `type`: `note | story | question | link | observation | customer_insight`
- `originalText` (never overwritten), `sourceUrl?`
- `status`: `unprocessed | reviewing | processed | archived`
- `suggestedTitle?`, `suggestedType?`, `suggestedTags?`, `suggestedUniverseItemIds?`
- `createdAt`, `updatedAt`
- Indexes: `by_userId_and_status`, `by_userId_and_createdAt`

### `libraryItems`

- `userId`, `captureId?`
- `type`, `title`, `body`, `sourceUrl?`, `sourceLabel`
- `tags`, `favourite`, `archived`, `createdAt`, `updatedAt`
- Indexes: `by_userId_and_archived`, `by_userId_and_type`, `by_userId_and_createdAt`
- Search index: title and body, filtered by `userId`, `type` and `archived`.

### `boards` and `boardItems`

- Board: `userId`, `name`, `description?`, `archived`, timestamps; index `by_userId_and_archived`.
- Board item: `userId`, `boardId`, `libraryItemId`, `position`, `createdAt`; indexes `by_boardId_and_position`, `by_libraryItemId`.

### `drafts`

- `userId`
- `title`, `status`: `idea | outline | drafting | review | ready | published`
- `platform`, `format`, `audience`, `goal`, `selectedAngle?`, `outline?`, `body`
- `currentVersion`, `archived`, `createdAt`, `updatedAt`
- Indexes: `by_userId_and_archived`, `by_userId_and_status`, `by_userId_and_updatedAt`.

### `draftVersions`

- `userId`, `draftId`, `version`, `body`, `changeType`: `manual | ai_generation | ai_rewrite | restore`
- `createdAt`
- Index: `by_draftId_and_version`.

### `sourceReferences`

- `userId`
- `targetType`: `draft | draft_version | chat_message | universe_item`
- `targetId`
- `sourceType`: `onboarding_answer | universe_item | capture | library_item | draft`
- `sourceId`, `excerpt`, `reason`, `createdAt`
- Indexes: `by_targetType_and_targetId`, `by_sourceType_and_sourceId`.

### `calendarEntries`

- `userId`, `draftId`, `scheduledFor`, `status`, `platform`, `createdAt`, `updatedAt`
- Indexes: `by_userId_and_scheduledFor`, `by_draftId`.

### `chats` and `chatMessages`

- Chat: `userId`, `title`, `createdAt`, `updatedAt`; index `by_userId_and_updatedAt`.
- Message: `userId`, `chatId`, `role`, `content`, `status`, timestamps; index `by_chatId_and_createdAt`.
- Message citations live in `sourceReferences`.

### `accountDeletionRequests`

- `userId`, `requestedAt`, `confirmedAt?`, `status`
- Index: `by_userId`.

## Migration approach

Add new tables without removing legacy fields. New writes go to the new model. A bounded migration converts each existing authenticated universe into one `universes` record plus source-linked `universeItems`. After read parity is verified, legacy UI reads switch to the new tables. Legacy tables are retained until a separate cleanup decision.

