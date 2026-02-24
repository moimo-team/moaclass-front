# Chat Routing Migration Notes (Next.js)

## Goal

- Remove `/[object Object]` navigation failures.
- Standardize chat entry on URL query parameters.

## Current mixed entry paths

- `state` based (legacy react-router style)
    - `navigate('/chats', { state: { ... } })`
- query based (Next.js friendly)
    - `/chats?chatType=lesson&roomId=101&lessonId=5`

## Why `[object Object]` can happen

- Some call sites still pass route `state` objects.
- Next.js `router.push` does not support react-router `state`.
- Adapter code can stringify unsupported values incorrectly.

## Canonical chat URL schema

- Lesson chat:
    - `/chats?chatType=lesson&roomId={roomId}&lessonId={lessonId}`
- Meeting chat:
    - `/chats?chatType=meeting&roomId={roomId}&meetingId={meetingId}`

Fallback when `roomId` is unavailable:

- `/chats?chatType=lesson&lessonId={lessonId}`
- `/chats?chatType=meeting&meetingId={meetingId}`

## Migration rules

1. Do not use route `state` for chat entry.
2. Always navigate with query parameters.
3. Keep `location.state` read support only as temporary backward compatibility.
4. Ensure adapter always converts route targets to a safe URL string.
