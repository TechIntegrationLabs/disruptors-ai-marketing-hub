# Team Members Table Schema

## Overview

The `team_members` table stores information about team members displayed on the About page and throughout the website.

## Table Name

`public.team_members`

## Schema Structure

### Current Columns

| Column Name | Data Type | Nullable | Default | Description |
|------------|-----------|----------|---------|-------------|
| `id` | UUID | NO | `uuid_generate_v4()` | Primary key |
| `name` | VARCHAR(255) | NO | - | Full name of team member |
| `title` | VARCHAR(255) | YES | - | Job title/role |
| `bio` | TEXT | YES | - | Biography/description |
| `email` | VARCHAR(255) | YES | - | Contact email |
| `headshot` | TEXT | YES | - | URL to headshot image |
| `image_url` | TEXT | YES | - | Legacy column (use `headshot` instead) |
| `linkedin_url` | JSONB | YES | - | Legacy column (use `social_links` instead) |
| `social_links` | JSONB | YES | `'{}'::jsonb` | Social media links as JSON object |
| `skills` | TEXT[] | YES | - | Array of skills/expertise areas |
| `years_experience` | INTEGER | YES | - | Years of professional experience |
| `display_order` | INTEGER | YES | `0` | Order for displaying team members |
| `order_index` | INTEGER | YES | - | Legacy column (use `display_order` instead) |
| `user_id` | UUID | YES | - | Foreign key to `users` table (optional) |
| `is_active` | BOOLEAN | YES | `true` | Whether the team member is active/visible |
| `created_at` | TIMESTAMPTZ | YES | `NOW()` | Timestamp of record creation |
| `updated_at` | TIMESTAMPTZ | YES | `NOW()` | Timestamp of last update |

### Indexes

- `idx_team_members_display_order` on `display_order`
- `idx_team_members_is_active` on `is_active`

### Foreign Keys

- `user_id` references `public.users(id)` ON DELETE SET NULL (if users table exists)

## Row Level Security (RLS)

RLS is **enabled** on this table.

### Policies

**Policy Name:** "Public can read active team members"
- **Operation:** SELECT
- **Rule:** `is_active = true`
- **Description:** Public users can only read team members where `is_active` is true

## Data Structure Examples

### Basic Team Member Record

```json
{
  "id": "b9ec630e-8e8f-4e73-acd8-d3c82bdf3395",
  "name": "Tyler Gordon",
  "title": "Chief Marketing Officer",
  "bio": "Experienced marketing leader...",
  "email": "tyler@example.com",
  "headshot": "https://example.com/images/tyler.jpg",
  "social_links": {
    "linkedin": "https://linkedin.com/in/tylergordon",
    "twitter": "https://twitter.com/tylergordon",
    "github": "https://github.com/tylergordon"
  },
  "skills": ["Marketing Strategy", "Brand Development", "Team Leadership"],
  "years_experience": 15,
  "display_order": 1,
  "is_active": true,
  "created_at": "2025-09-29T12:00:00Z",
  "updated_at": "2025-09-29T12:00:00Z"
}
```

### Social Links Structure

The `social_links` column is a JSONB object that can contain any social media platform:

```json
{
  "linkedin": "https://linkedin.com/in/username",
  "twitter": "https://twitter.com/username",
  "github": "https://github.com/username",
  "facebook": "https://facebook.com/username",
  "instagram": "https://instagram.com/username",
  "youtube": "https://youtube.com/@username",
  "website": "https://example.com"
}
```

## Existing Records

The table currently contains **5 team members**:

1. **Josh Patel** - Chief Executive Officer
2. **Tyler Gordon** - Chief Marketing Officer
3. **Carson Ireland** - Creative Director
4. **Kyle Painter** - Chief Communications Officer
5. **William Welsh** - AI Systems Engineer

All records are currently active (`is_active = true`) and have:
- Full bio information
- Headshot images (migrated from `image_url`)
- Display order set to 0 (needs manual ordering)
- Empty social links (needs to be populated)

## Usage with Custom SDK

The custom SDK automatically maps the entity name `TeamMember` to the table name `team_members`.

### List All Active Team Members

```javascript
import { customClient } from '@/lib/custom-sdk';

// List all active team members ordered by display_order
const teamMembers = await customClient.entities.TeamMember.list('display_order');

// Filter for specific criteria
const executives = await customClient.entities.TeamMember.filter(
  { title: 'Chief Executive Officer' },
  'display_order'
);
```

### Create New Team Member

```javascript
const newMember = await customClient.entities.TeamMember.create({
  name: 'Jane Doe',
  title: 'Senior Developer',
  bio: 'Experienced full-stack developer...',
  email: 'jane@example.com',
  headshot: 'https://example.com/images/jane.jpg',
  social_links: {
    linkedin: 'https://linkedin.com/in/janedoe',
    github: 'https://github.com/janedoe'
  },
  skills: ['React', 'Node.js', 'TypeScript'],
  years_experience: 8,
  display_order: 6,
  is_active: true
});
```

### Update Team Member

```javascript
const updated = await customClient.entities.TeamMember.update(
  'member-id-here',
  {
    title: 'Principal Developer',
    years_experience: 9,
    social_links: {
      linkedin: 'https://linkedin.com/in/janedoe',
      github: 'https://github.com/janedoe',
      twitter: 'https://twitter.com/janedoe'
    }
  }
);
```

## Migration History

### 2025-09-30: Added Enhanced Columns

**Migration:** `20250930000549_add_team_members_columns.sql`

Added the following columns:
- `display_order` (INTEGER) - for explicit ordering
- `skills` (TEXT[]) - for skill/expertise tracking
- `years_experience` (INTEGER) - for experience level
- `user_id` (UUID) - optional link to user account
- `headshot` (TEXT) - standardized image URL field
- `social_links` (JSONB) - flexible social media links

Migrated data from legacy columns:
- `image_url` → `headshot`
- `linkedin_url` → `social_links.linkedin`
- `order_index` → `display_order`

## Best Practices

### Ordering Team Members

Always use `display_order` for controlling the order of team members. Lower numbers appear first.

```javascript
// Update display order
await customClient.entities.TeamMember.update(memberId, {
  display_order: 1  // Will appear first
});
```

### Social Links Management

Use consistent URL formats for social links:

```javascript
const socialLinks = {
  linkedin: 'https://linkedin.com/in/username',  // Full URL
  twitter: 'https://twitter.com/username',
  github: 'https://github.com/username'
};
```

### Image URLs

Store full URLs for headshots, preferably using a CDN like Cloudinary:

```javascript
const headshot = 'https://res.cloudinary.com/your-cloud/image/upload/v1/team/member.jpg';
```

### Managing Active/Inactive Members

To hide a team member without deleting:

```javascript
await customClient.entities.TeamMember.update(memberId, {
  is_active: false
});
```

## Security Considerations

1. **RLS Enabled**: Public users can only see active team members
2. **Admin Operations**: Use service role for administrative operations
3. **User Linking**: The `user_id` field can link team members to user accounts for self-service profile updates
4. **Email Privacy**: Consider whether to expose email addresses publicly

## Next Steps

### Recommended Actions

1. **Populate Social Links**: Add LinkedIn and other social profiles to existing records
2. **Set Display Order**: Assign appropriate display_order values (1-5) to control team member ordering
3. **Add Skills**: Populate the skills array for each team member
4. **Set Experience Levels**: Add years_experience values for each member
5. **Update Component**: Modify the About page to use the new schema fields

### Sample Update Script

```javascript
// Update all team members with proper ordering and social links
const updates = [
  {
    id: 'josh-patel-id',
    display_order: 1,
    social_links: { linkedin: 'https://linkedin.com/in/joshpatel' },
    skills: ['Leadership', 'Strategy', 'Business Development'],
    years_experience: 15
  },
  // ... more updates
];

for (const update of updates) {
  await customClient.entities.TeamMember.update(update.id, update);
}
```

## Support

For database schema issues or questions:
1. Check the migration files in `supabase/migrations/`
2. Review the custom SDK implementation in `src/lib/custom-sdk.js`
3. Test schema changes with `scripts/check-team-schema.js`

## References

- Main schema file: `schema.sql`
- Custom SDK: `src/lib/custom-sdk.js`
- Verification script: `scripts/check-team-schema.js`
- Migration: `supabase/migrations/20250930000549_add_team_members_columns.sql`