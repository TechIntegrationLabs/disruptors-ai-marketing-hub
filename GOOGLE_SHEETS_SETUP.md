# Google Sheets Integration Setup

This guide will help you set up Google Sheets integration for the Blog Management feature.

## Prerequisites

1. A Google account with access to Google Sheets
2. The Google Sheets document you want to integrate with (ensure it's accessible)

## Setup Instructions

### Step 1: Get a Google Sheets API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### Step 2: Make Your Google Sheet Public (Read Access)

For the pull functionality to work, your Google Sheet needs to be readable by the API:

1. Open your Google Sheet
2. Click "Share" button
3. Change access to "Anyone with the link can view"
4. Copy the sheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 3: Configure Environment Variables

Add the following to your `.env` file:

```bash
# Google Sheets Integration
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

### Step 4: Update the Google Sheets Service (if needed)

If your Google Sheet has different column names, you can update the column mapping in `src/lib/google-sheets-service.js`:

```javascript
const COLUMN_MAPPING = {
  // Our app field -> Your Google Sheets column header
  title: 'Title',              // Change 'Title' to match your column
  author: 'Author',            // Change 'Author' to match your column
  category: 'Category',        // etc...
  status: 'Status',
  publishDate: 'Publish Date',
  excerpt: 'Excerpt',
  tags: 'Tags',
  slug: 'Slug',
  image: 'Image URL',
  metaDescription: 'Meta Description',
  content: 'Content'
};
```

### Step 5: Your Google Sheet Structure

For best results, your Google Sheet should have these column headers in the first row:

| Title | Author | Category | Status | Publish Date | Excerpt | Tags | Slug | Image URL | Meta Description | Content |
|-------|--------|----------|--------|--------------|---------|------|------|-----------|------------------|---------|

## Features

### Pull from Google Sheets
- Fetches all data from your Google Sheet
- Automatically maps columns to the blog management interface
- Replaces current data in the interface

### Push to Google Sheets
- **Note**: Currently generates CSV data for manual import
- Logs formatted data to browser console
- Full automated push requires OAuth2 authentication (future enhancement)

### Manual Push Process (Current)
1. Click "Push to Sheets"
2. Open browser console (F12)
3. Copy the CSV data from the console
4. Open your Google Sheet
5. Select cell A1
6. Paste the data

## Troubleshooting

### Common Issues

1. **"Google Sheets integration not configured"**
   - Ensure `VITE_GOOGLE_SHEETS_API_KEY` is set in your `.env` file
   - Restart the development server after adding the environment variable

2. **"Error pulling data: 403"**
   - Check that your Google Sheet is shared with "Anyone with the link can view"
   - Verify the sheet ID in the service file matches your Google Sheet

3. **"Error pulling data: 400"**
   - Verify your API key is correct
   - Ensure the Google Sheets API is enabled in your Google Cloud Console

4. **Data not mapping correctly**
   - Check that your Google Sheet column headers match the `COLUMN_MAPPING` in the service file
   - Update the mapping if your columns have different names

### Getting Help

If you encounter issues:

1. Check the browser console for detailed error messages
2. Verify your Google Cloud Console API settings
3. Ensure your Google Sheet permissions are correct
4. Check that all environment variables are properly set

## Future Enhancements

- OAuth2 authentication for full write access
- Automated push without manual CSV copying
- Real-time synchronization
- Conflict resolution for simultaneous edits
- Support for multiple sheet tabs