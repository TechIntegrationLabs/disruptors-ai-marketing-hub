# Data Manager - User Guide

## Overview

The **Data Manager** is a powerful spreadsheet-like interface integrated into the Disruptors AI admin panel that allows team members to view and edit all Supabase database tables directly from the browser.

## Accessing the Data Manager

1. **Navigate to the Admin Panel**
   - Click the Disruptors logo 5 times within 3 seconds, OR
   - Press `Ctrl+Shift+D` on any page

2. **Login with Matrix Interface**
   - Enter admin credentials
   - Session lasts 24 hours

3. **Select Data Manager Tab**
   - Click on "Data Manager" tab (first tab, database icon)
   - This is the default tab when opening the admin panel

## Available Tables

The Data Manager provides access to these primary tables:

| Table | Description | Key Fields |
|-------|-------------|------------|
| **posts** | Blog content, resources, guides | title, slug, content, is_published |
| **team_members** | Team profiles and bios | name, title, bio, headshot, is_active |
| **services** | Service offerings | name, description, pricing, is_active |
| **case_studies** | Client success stories | title, client_name, industry, is_published |
| **testimonials** | Client reviews | client_name, content, rating, is_published |
| **contact_submissions** | Contact form submissions | name, email, message, is_processed |

## Features

### 1. Inline Cell Editing

- **Click any cell** to edit its value
- **Field types**:
  - Text: Regular text input
  - Textarea: Multi-line text (content, descriptions)
  - Select: Dropdown with predefined options (status, category)
  - Boolean: Yes/No toggle
  - Date: Date picker
  - Array: Comma-separated values (tags, skills)
  - Image: URL input with preview

- **Save changes**: Click the green checkmark or press `Enter`
- **Cancel**: Click the red X or press `Escape`

### 2. Row Management

- **Add New Row**: Click "Add Row" button
  - Creates new record with empty/default values
  - Automatically saves to database

- **Delete Row**: Click trash icon on right side of row
  - Confirms deletion before removing
  - Permanently deletes from database

- **Bulk Delete**:
  - Select multiple rows using checkboxes
  - Click "Delete (n)" button
  - Confirms before deleting all selected

### 3. Search & Filter

- **Search**: Type in search box to filter across all columns
- **Sort**: Click column headers to sort ascending/descending
- **Column Visibility**:
  - Expand "Column Visibility" section
  - Click column badges to show/hide

### 4. Table Navigation

- **Quick Stats**: Cards at top show record counts for each table
- **Tab Switching**: Click tabs to switch between tables
- **Auto-Load**: Data loads automatically when switching tables
- **Refresh**: Click "Refresh" button to reload current table

## Common Workflows

### Publishing a Blog Post

1. Go to Data Manager → **posts** table
2. Find your draft post (search by title)
3. Edit `is_published` field → change to "Yes"
4. Set `published_at` to current date
5. Changes save automatically

### Adding a New Team Member

1. Go to Data Manager → **team_members** table
2. Click "Add Row"
3. Fill in required fields:
   - `name`: Full name
   - `title`: Job title
   - `bio`: Biography text
   - `headshot`: Image URL (from Cloudinary or elsewhere)
4. Set `is_active` to "Yes"
5. Set `display_order` to control position (lower numbers appear first)
6. All changes save automatically

### Managing Contact Submissions

1. Go to Data Manager → **contact_submissions** table
2. Review unprocessed submissions (`is_processed` = No)
3. Read `message` and contact details
4. After following up:
   - Change `is_processed` to "Yes"
   - Set `processed_at` to current date
   - Optionally link to `leads` table via `lead_id`

### Updating Service Information

1. Go to Data Manager → **services** table
2. Find service by name
3. Edit any field:
   - `description`: Service description
   - `base_price`: Pricing (number)
   - `benefits`: Comma-separated list
   - `is_active`: Show/hide on website
4. Changes reflect immediately on website

## Data Types & Formatting

### Arrays (Tags, Skills, Keywords)
- Enter as comma-separated values: `tag1, tag2, tag3`
- System automatically converts to array format
- Displays as comma-separated in table

### JSON Fields (Social Links, Metadata)
- Enter as valid JSON: `{"linkedin": "url", "twitter": "url"}`
- Must be properly formatted JSON
- Validation errors show if format is invalid

### Dates
- Use date picker for easy selection
- Format: YYYY-MM-DD
- Time component set to midnight UTC

### Images
- Enter full URL (Cloudinary, external host)
- Preview shows thumbnail in table
- Example: `https://res.cloudinary.com/your-cloud/image/upload/...`

## Security & Permissions

### Row Level Security (RLS)
- All tables have RLS enabled
- Service role client bypasses RLS for admin operations
- Changes made through admin panel have full access

### Read-Only Fields
- `id`: Auto-generated UUID
- `created_at`: Set automatically on creation
- `updated_at`: Updates automatically on changes
- These fields display but cannot be edited

### Data Validation
- Required fields must be filled (marked in schema)
- Invalid data (wrong type, format) shows error messages
- Errors displayed at top of table

## Keyboard Shortcuts

- `Tab`: Navigate to next cell (in edit mode)
- `Enter`: Save changes and exit edit mode
- `Escape`: Cancel changes and exit edit mode
- Arrow keys: Navigate between cells (coming soon)

## Troubleshooting

### Changes Not Saving
1. Check browser console for errors
2. Ensure you have admin privileges
3. Verify required fields are filled
4. Try refreshing the page and re-entering data

### Table Not Loading
1. Click "Refresh" button
2. Check network connection
3. Verify Supabase connection (look for error messages)
4. Try logging out and back in

### Field Shows Wrong Type
- Table schema may need updating
- Contact developer to adjust field type in `TableSchemaManager.jsx`

### Can't Delete Row
- May have foreign key constraints
- Check if row is referenced by other tables
- Some rows may be protected

## Best Practices

1. **Search Before Adding**: Use search to check if record already exists
2. **Required Fields**: Fill all required fields when creating records
3. **Slug Fields**: Use lowercase, hyphens, no spaces (e.g., `my-blog-post`)
4. **Image URLs**: Test image URLs before saving (paste in browser)
5. **Backup Before Bulk Delete**: Export data before mass deletions
6. **Regular Saves**: Changes auto-save, but refresh if unsure

## Technical Notes

### Database Connection
- Direct connection to Supabase PostgreSQL
- Uses custom SDK wrapper for entity operations
- All operations respect Row Level Security policies

### Real-Time Updates
- Changes save immediately to database
- No manual "Save" button needed
- Optimistic updates with error rollback

### Performance
- Tables load up to 1000 records by default
- Large tables may take longer to load
- Use search/filter for better performance

## Support

For issues or questions:
- Check browser console for detailed error messages
- Contact development team with screenshots
- Reference table name and operation attempted

## Future Enhancements

Planned features:
- CSV import/export
- Real-time collaborative editing
- Advanced filtering
- Bulk edit operations
- Undo/redo functionality
- Custom views and saved filters
