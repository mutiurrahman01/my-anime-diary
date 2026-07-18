# DATABASE DESIGN

Project: My Anime Diary

Database: PostgreSQL (Supabase)

Version: 1.0

---

## Database Philosophy

The database must be:

- Normalized
- Secure
- Scalable
- Easy to maintain
- Migration based

Never duplicate data.

Always use foreign keys.

Always use indexes where necessary.

Never manually edit production tables.

---

# Entity Relationship Diagram

```text
profiles
     │
     │
     ▼
user_anime
     ▲
     │
     │
anime
```

Relationship:

- One Profile → Many User Anime
- One Anime → Many User Anime

This creates a Many-to-Many relationship between Users and Anime.

---

# Tables

## profiles

Purpose:

Stores public user information.

Authentication is handled by Supabase Auth.

Columns:

| Column | Type | Notes |
|---------|------|------|
| id | UUID | References auth.users.id |
| username | TEXT | Unique |
| avatar_url | TEXT | Nullable |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |

---

## anime

Purpose:

Stores anime metadata.

Columns:

| Column | Type |
|---------|------|
| id | UUID |
| mal_id | INTEGER |
| slug | TEXT |
| title | TEXT |
| title_english | TEXT |
| title_japanese | TEXT |
| title_romaji | TEXT |
| cover_image | TEXT |
| banner_image | TEXT |
| description | TEXT |
| release_year | INTEGER |
| episodes | INTEGER |
| status | TEXT |
| studio | TEXT |
| genres | TEXT[] |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

Status values:

- FINISHED
- ONGOING
- UPCOMING

---

## user_anime

Purpose:

Stores each user's private diary entry.

Columns:

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID |
| anime_id | UUID |
| rating | SMALLINT |
| favorite | BOOLEAN |
| added_at | TIMESTAMP |
| updated_at | TIMESTAMP |

Rules:

- One user can only add one anime once.
- Create a unique constraint on:

(user_id, anime_id)

Rating:

Allowed values:

1–10

Favorite:

Boolean

true

false

---

# Relationships

profiles.id

↓

user_anime.user_id

ON DELETE CASCADE

anime.id

↓

user_anime.anime_id

ON DELETE CASCADE

---

# Indexes

anime

- title
- slug
- release_year

user_anime

- user_id
- anime_id
- favorite

---

# Row Level Security

Enable RLS on every table.

profiles

- User can read own profile.
- User can update own profile.

anime

- Anyone can read.
- No client-side insert/update/delete.

user_anime

- User can read own rows.
- User can insert own rows.
- User can update own rows.
- User can delete own rows.

---

# Search Strategy

Search should support:

- title
- title_english
- title_romaji
- title_japanese

Requirements:

- Case insensitive
- Partial search
- Fast search

---

# Image Strategy

Store only image URLs.

Do not upload anime posters to Supabase Storage.

---

# URL Strategy

Every anime must have a unique slug.

Example:

naruto

attack-on-titan

death-note

Use slugs in URLs instead of numeric IDs whenever possible.

---

# Validation Rules

username

- Required
- Unique

title

- Required

slug

- Required
- Unique

rating

- Integer
- Between 1 and 10

favorite

- Boolean

---

# UUID Policy

Every primary key must use UUID.

Never use auto-increment IDs.

---

# Soft Delete

Not required for MVP.

Use hard delete.

Future versions may introduce deleted_at.

---

# Future Tables (Not Part of MVP)

- watch_status
- episode_progress
- notes
- tags
- custom_lists
- statistics
- notifications
- activity_log
- recommendations
- premium
- subscriptions

---

# Database Change Policy

Every schema change must include:

- SQL Migration
- Updated Documentation
- Updated Types
- Updated ER Diagram

Never modify the database manually in production.

---

# MVP Database

Tables included:

- profiles
- anime
- user_anime

No additional tables should be created during MVP unless explicitly approved.