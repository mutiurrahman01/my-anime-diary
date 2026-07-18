# UI GUIDELINES

Project: My Anime Diary

Version: 1.0

---

# Design Philosophy

The application should feel like a modern SaaS product instead of an anime fan website.

The UI should be:

- Clean
- Elegant
- Fast
- Minimal
- Premium
- Easy to understand

Avoid looking AI generated.

Avoid flashy designs.

Avoid unnecessary gradients.

Avoid gaming-style interfaces.

Avoid neon everywhere.

The interface should feel handcrafted.

Design inspiration:

- Notion
- Linear
- GitHub
- Vercel
- Stripe Dashboard

---

# Design Principles

The interface must prioritize

- Readability
- Simplicity
- Consistency
- Accessibility
- Performance

Every screen should have a clear visual hierarchy.

Whitespace is preferred over unnecessary decorations.

---

# Theme Support

The application must support

- Light Theme
- Dark Theme
- System Theme

The selected theme must persist.

If no theme has been selected, follow the operating system preference.

---

# Color System

## Primary

Indigo

Purpose

Primary Buttons

Links

Selected Items

Focus States

---

## Accent

Emerald

Purpose

Success

Highlights

Small indicators

Statistics

---

## Error

Red

Only for

Validation

Danger Actions

Delete

Errors

---

## Warning

Amber

Only for

Warnings

Pending States

---

## Neutral Colors

Use Slate color palette.

Avoid pure black.

Avoid pure white.

---

# Light Theme

Background

#F8FAFC

Cards

#FFFFFF

Sidebar

#FFFFFF

Primary Text

#0F172A

Secondary Text

#475569

Borders

#E2E8F0

Primary

Indigo

Accent

Emerald

Shadows

Very Soft

Minimal

---

# Dark Theme

Background

#020617

Cards

#0F172A

Sidebar

#0F172A

Primary Text

#F8FAFC

Secondary Text

#CBD5E1

Borders

#334155

Primary

Indigo

Accent

Emerald

Shadows

Soft

---

# Typography

Use

Geist

or

Inter

Never mix fonts.

---

# Font Sizes

Heading 1

36px

Heading 2

30px

Heading 3

24px

Heading 4

20px

Body

16px

Small Text

14px

Caption

12px

---

# Font Weight

Regular

Medium

SemiBold

Bold

Avoid Extra Bold everywhere.

---

# Border Radius

Buttons

10px

Inputs

10px

Cards

14px

Dialogs

16px

Badges

999px

---

# Spacing System

Use only

4

8

12

16

20

24

32

40

48

64

Never use random spacing values.

---

# Layout

Maximum Width

1280px

Content Padding

24px

Desktop Grid

12 Columns

Tablet

8 Columns

Mobile

4 Columns

---

# Navigation

Desktop

Left Sidebar

Top Navigation

Mobile

Bottom Navigation

or

Hamburger Drawer

---

# Header

Contains

Logo

Search

Theme Toggle

Profile Menu

---

# Sidebar

Dashboard

Search

My Diary

Favorites

Profile

Settings

Logout

Icons must be simple.

---

# Cards

Cards should have

Soft Border

Small Shadow

Comfortable Padding

No heavy borders.

---

# Buttons

Types

Primary

Secondary

Outline

Ghost

Destructive

Loading

Disabled

Every button must have

Hover

Active

Focus

Disabled

Loading

States.

---

# Inputs

Rounded

Accessible

Proper Labels

Validation Messages

Placeholder

Focus Ring

---

# Forms

Label always above input.

Never rely on placeholder as label.

Show validation below input.

---

# Tables

Responsive

Hover State

Striped Rows Optional

Rounded Container

---

# Search

Search bar should be visible.

Debounce search.

Loading state while searching.

Empty state if nothing found.

---

# Empty States

Every page must have an empty state.

Examples

No Anime Found

Your Diary Is Empty

No Favorites Yet

Search Your First Anime

---

# Loading States

Use Skeleton UI.

Never use blank white pages.

Every async request should have

Loading

Success

Failure

Empty

States.

---

# Dialogs

Rounded

Medium Width

Escape closes dialog.

Click outside closes dialog.

---

# Toast Notifications

Top Right

Auto dismiss

Success

Error

Info

Warning

---

# Icons

Use

Lucide React

Only.

Keep icon size consistent.

---

# Images

Anime Posters

Rounded Corners

Lazy Loaded

Responsive

Never stretch images.

Maintain aspect ratio.

---

# Animations

Fast

Subtle

Purposeful

Maximum

250ms

Avoid excessive motion.

---

# Accessibility

WCAG AA

Keyboard Navigation

Visible Focus

Semantic HTML

Proper Labels

Screen Reader Friendly

---

# Responsive Design

Desktop

Laptop

Tablet

Mobile

Everything must be fully responsive.

Never allow horizontal scrolling.

---

# Performance

Optimize Images

Lazy Loading

Memoization where necessary

Avoid unnecessary client components.

---

# Component Rules

Every reusable UI must become a component.

Avoid duplicate UI.

One responsibility per component.

---

# Design Tokens

Never hardcode colors repeatedly.

Use Tailwind theme variables.

Prefer semantic tokens.

Example

Primary

Surface

Border

Muted

Background

Foreground

Success

Danger

Warning

Info

---

# Future Design

The design system should be scalable.

New pages must automatically match existing design.

Never redesign old pages unless requested.

Maintain visual consistency across the project.

---

# Final Rule

The UI should feel like a premium SaaS application.

If a user sees only screenshots of the application, they should think

"This looks professionally designed."

Not

"This was generated by AI."