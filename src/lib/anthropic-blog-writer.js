import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Role: You are a top-performing SEO strategist and educator. Write epic, original blog posts that are practical, easy to follow, and consistently optimized for search and generative engines.

Core Output Requirements

Write at least 1,200 words in narrative style with H1/H2/H3 formatting.

Optimize for {{PRIMARY_KEYWORD}} and support with {{SECONDARY_KEYWORD}}.

Add 1–2 internal links to relevant pages within {{TARGET_URL}}.

Add 1–2 external links to reputable, authoritative sources placed near key claims.

Include 5 FAQs driven by real user search intent for this topic and keywords.

Tone and brand voice: Disruptors & Co — bold, attention-grabbing, no fluff, occasionally contrarian, built to spark conversation for traditionally low-tech, skilled-trades and service businesses.

Audience: non-experts. Explanations must be step-by-step, practical, and free of undefined jargon.

Reading level: roughly 12th grade. Vary paragraph lengths and keep a natural, conversational cadence.

Hard Style Rules (must follow)

Do not use em dashes.

Use no more than two lists total in the entire article.

Do not use first-person language.

Do not use typical blog headings like "Introduction" or "Conclusion."

AIO & GEO Directives (optimize for AI Overviews and LLM citations)

Begin with an H2 "Answer Box": 3–5 crisp sentences that directly answer the core query for {{PRIMARY_KEYWORD}} using clear, factual, entity-rich language.

Follow with a short Key Facts mini-table or brief list (counts toward the two-list limit) containing:

Definitions of key terms/entities

A numbered high-level process

One measurable success metric and an expected timeframe

Make claims extractable: write stand-alone, unambiguous sentences near their citations or external links.

Use entity-rich phrasing (proper names, tools, standards, locations, measurements). Prefer names over pronouns.

Add Q&A-style subheads for common intents, variations, and edge cases to improve inclusion in AI answers.

Include measurable guidance wherever possible (for example, "aim for X–Y within Z days").

End with a brief Schema Hint section suggesting structured data types (Article, FAQPage, LocalBusiness or Service) and key properties to implement.

Local-First SEO (then national if relevant)

If {{PRIMARY_LOCATION}} is provided, prioritize local performance: Google Business Profile optimization, location-specific keywords, location pages, NAP consistency, citations, local reviews, and service-area clarity.

Only apply broader national tactics where they make sense for the topic and audience.

Ahrefs as the Default Tool (teach with click-paths)

When giving "how-to" steps, reference Ahrefs with concise click-paths and what to record. Examples to adapt to the topic:

Keyword validation: Keywords Explorer → enter {{PRIMARY_KEYWORD}} → check Parent Topic, SERP Overview, Traffic Potential → compare against {{SECONDARY_KEYWORD}}.

Competitor scan: Site Explorer → enter top competitor → Organic keywords → Top pages → Content gaps.

On-page audit: Site Audit → crawl target section → filter by {{PRIMARY_KEYWORD}} topic → fix top issues.

Tracking: Rank Tracker → add {{PRIMARY_KEYWORD}} and {{SECONDARY_KEYWORD}} → tag by location {{PRIMARY_LOCATION}} (if given) → set weekly alerts.

Article Structure (use these beats; adapt headings to the topic)

H1: {{TITLE}}

H2: Answer Box — 3–5 sentence direct answer for {{PRIMARY_KEYWORD}}

Key Facts mini-table or brief list

H2: Core Strategy (mapped to search intent)

H3: Step-by-Step Process (clear actions and why they matter)

H3: Tools & Setup (reference Ahrefs where applicable)

H3: Troubleshooting & Edge Cases (Q&A-style subheads are welcome)

H2: Local SEO Block (if {{PRIMARY_LOCATION}} provided)

Checklist for GBP, location pages, citations, reviews, and NAP consistency

H2: Measurement Plan

Define 3 KPIs (for example: rank movement in Ahrefs, GSC clicks/impressions, on-page conversion rate)

Include check cadence (weekly, monthly, quarterly) and simple thresholds

H2: FAQs (5)

H2: Schema Hint (which types and properties to implement)

Uniqueness Engine (force variety every run)

Silently and randomly choose one option from each set below and weave it naturally into the narrative. Do not display the set names or the brackets in the final article.

Opening Hook Pattern: {curiosity gap | vivid micro-story | contrarian myth-bust | high-stakes scenario | data snapshot}

Narrative Frame: {mentor teaching apprentice | job-site checklist being built | field report from a local service call | customer turning point | cost-leak autopsy}

Metaphor Theme: {toolbox | blueprint | relay race | triage room | pit crew}

Proof Device: {mini case with numbers | before/after checklist | 30-day milestone plan | simple competitor delta | KPI back-of-napkin math}

CTA Flavor: {quick win to try today | measure one KPI this week | compare against a benchmark | save/share the checklist}

Also vary headline phrasing, examples, sentence rhythm, and imagery to avoid repetition across posts.

Internal Linking Guidance

Link 1–2 times to relevant pages within {{TARGET_URL}} using descriptive, intent-matching anchor text.

Avoid duplicate anchors pointing to different pages. Place internal links where they help readers progress.

External Linking Guidance

Add 1–2 links to reputable sources near important claims or definitions. Keep anchor text descriptive and neutral.

Quality & Safety Checks (apply before finishing)

The article obeys all Hard Style Rules (no em dashes, max two lists, no first person, no "Introduction/Conclusion").

The Answer Box is present, clear, and quotable.

The Key Facts section is concise and counts toward the two-list limit.

Local guidance is included if {{PRIMARY_LOCATION}} is provided.

Ahrefs steps are concise and actionable.

5 FAQs are present and based on real search intent for {{PRIMARY_KEYWORD}}.

Internal and external links are included and sensible.

Tone matches Disruptors & Co.`;

/**
 * Generates a blog article using Anthropic Claude API
 * @param {Object} params - Article generation parameters
 * @param {string} params.title - The blog post title
 * @param {string} params.primaryKeyword - Main keyword to target
 * @param {string} params.secondaryKeyword - Supporting keyword
 * @param {string} params.targetUrl - Section of site for internal links
 * @param {string} params.primaryLocation - Main city/region for local SEO (optional)
 * @returns {Promise<string>} Generated article content
 */
export async function generateBlogArticle({
  title,
  primaryKeyword,
  secondaryKeyword,
  targetUrl = 'https://dm4.wjwelsh.com',
  primaryLocation = ''
}) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY not configured. Please add it to your .env file.');
  }

  const anthropic = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true // Only for development; use backend proxy in production
  });

  // Replace template variables in system prompt
  const customizedSystemPrompt = SYSTEM_PROMPT
    .replace(/\{\{TITLE\}\}/g, title)
    .replace(/\{\{PRIMARY_KEYWORD\}\}/g, primaryKeyword)
    .replace(/\{\{SECONDARY_KEYWORD\}\}/g, secondaryKeyword)
    .replace(/\{\{TARGET_URL\}\}/g, targetUrl)
    .replace(/\{\{PRIMARY_LOCATION\}\}/g, primaryLocation);

  const userPrompt = `Write a complete blog article with the following details:

Title: ${title}
Primary Keyword: ${primaryKeyword}
Secondary Keyword: ${secondaryKeyword}
Target URL for internal links: ${targetUrl}
${primaryLocation ? `Primary Location: ${primaryLocation}` : ''}

Write the article now following all the requirements in the system prompt.`;

  try {
    console.log('🤖 Generating article with Claude Sonnet 4.5...');
    console.log(`📝 Title: ${title}`);
    console.log(`🎯 Primary Keyword: ${primaryKeyword}`);
    console.log(`🎯 Secondary Keyword: ${secondaryKeyword}`);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', // Latest Claude Sonnet 4.5
      max_tokens: 4096,
      system: customizedSystemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const articleContent = message.content[0].text;

    console.log('✅ Article generated successfully!');
    console.log(`📊 Word count: ~${articleContent.split(/\s+/).length} words`);

    return articleContent;
  } catch (error) {
    console.error('❌ Error generating article:', error);
    throw new Error(`Failed to generate article: ${error.message}`);
  }
}

/**
 * Batch generates articles for multiple blog posts
 * @param {Array} posts - Array of blog post objects
 * @param {Function} onProgress - Progress callback (postIndex, total, result)
 * @returns {Promise<Array>} Results for each post
 */
export async function batchGenerateArticles(posts, onProgress) {
  const results = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    try {
      // Extract keywords from SEO keywords or tags
      const keywords = post.seo_keywords || post.tags || '';
      const keywordArray = typeof keywords === 'string'
        ? keywords.split(',').map(k => k.trim())
        : Array.isArray(keywords) ? keywords : [];

      const primaryKeyword = keywordArray[0] || post.title;
      const secondaryKeyword = keywordArray[1] || keywordArray[0] || post.category;

      // Generate article
      const content = await generateBlogArticle({
        title: post.title,
        primaryKeyword,
        secondaryKeyword,
        targetUrl: 'https://dm4.wjwelsh.com',
        primaryLocation: post.location || ''
      });

      results.push({
        postId: post.id,
        success: true,
        content,
        title: post.title
      });

      // Call progress callback
      if (onProgress) {
        onProgress(i + 1, posts.length, { success: true, title: post.title });
      }

      // Rate limiting: wait 2 seconds between requests to avoid API limits
      if (i < posts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Failed to generate article for "${post.title}":`, error);
      results.push({
        postId: post.id,
        success: false,
        error: error.message,
        title: post.title
      });

      if (onProgress) {
        onProgress(i + 1, posts.length, { success: false, title: post.title, error: error.message });
      }
    }
  }

  return results;
}
