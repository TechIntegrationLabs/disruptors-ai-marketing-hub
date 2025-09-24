-- =============================================================================
-- SEED DATA FOR DEVELOPMENT
-- =============================================================================
-- This file contains sample data to populate your database for development and testing

-- Sample Team Members
INSERT INTO team_members (name, title, bio, image_url, linkedin_url, email, order_index, is_active) VALUES
('Will Stevens', 'CEO & AI Strategy Director', 'Leading AI transformation initiatives for marketing teams worldwide. Specializing in implementing cutting-edge AI solutions that drive measurable business growth.', '/images/team/will-stevens.jpg', 'https://linkedin.com/in/willstevens', 'will@disruptorsmedia.com', 1, true),
('Sarah Chen', 'Head of AI Development', 'Expert in machine learning and AI model optimization. Sarah leads our technical team in developing custom AI solutions for enterprise clients.', '/images/team/sarah-chen.jpg', 'https://linkedin.com/in/sarahchen', 'sarah@disruptorsmedia.com', 2, true),
('Marcus Rodriguez', 'Creative AI Director', 'Pioneering the intersection of creativity and artificial intelligence. Marcus oversees all AI-generated content and visual strategy initiatives.', '/images/team/marcus-rodriguez.jpg', 'https://linkedin.com/in/marcusrodriguez', 'marcus@disruptorsmedia.com', 3, true)
ON CONFLICT DO NOTHING;

-- Sample Services
INSERT INTO services (slug, title, short_description, detailed_description, icon_name, features, pricing_tiers, is_featured, is_active, order_index) VALUES
('ai-marketing-automation', 'AI Marketing Automation', 'Transform your marketing with intelligent automation systems.', 'Our AI-powered marketing automation platform helps businesses scale their marketing efforts while maintaining personalization at every touchpoint. From lead scoring to content optimization, we leverage machine learning to maximize your marketing ROI.', 'automation',
'["Intelligent lead scoring", "Automated email campaigns", "Content personalization", "Performance analytics", "Multi-channel integration"]',
'[{"name": "Starter", "price": "$2,500/month", "features": ["Basic automation", "Email campaigns", "Lead scoring"]}, {"name": "Professional", "price": "$5,000/month", "features": ["Advanced automation", "Multi-channel campaigns", "Custom AI models"]}, {"name": "Enterprise", "price": "Custom", "features": ["Full automation suite", "Dedicated support", "Custom integrations"]}]',
true, true, 1),

('ai-content-generation', 'AI Content Generation', 'Scale your content creation with AI-powered writing and visuals.', 'Generate high-quality marketing content at scale using our advanced AI content generation platform. From blog posts to social media content, our AI understands your brand voice and creates content that converts.', 'content',
'["Blog post generation", "Social media content", "Ad copy creation", "Visual content", "Brand voice training"]',
'[{"name": "Basic", "price": "$1,500/month", "features": ["50 blog posts", "200 social posts", "Basic templates"]}, {"name": "Pro", "price": "$3,500/month", "features": ["Unlimited content", "Custom templates", "Brand voice training"]}, {"name": "Enterprise", "price": "Custom", "features": ["Custom AI models", "API access", "White-label solution"]}]',
true, true, 2),

('ai-analytics-insights', 'AI Analytics & Insights', 'Get deeper insights with AI-powered analytics and reporting.', 'Turn your marketing data into actionable insights with our AI analytics platform. Predict customer behavior, optimize campaigns in real-time, and discover hidden opportunities in your data.', 'analytics',
'["Predictive analytics", "Real-time optimization", "Customer journey mapping", "ROI forecasting", "Automated reporting"]',
'[{"name": "Insights", "price": "$2,000/month", "features": ["Basic analytics", "Monthly reports", "Standard dashboards"]}, {"name": "Advanced", "price": "$4,500/month", "features": ["Predictive models", "Real-time insights", "Custom dashboards"]}, {"name": "Enterprise", "price": "Custom", "features": ["Custom AI models", "Advanced integrations", "Dedicated analyst"]}]',
false, true, 3)
ON CONFLICT DO NOTHING;

-- Sample Case Studies
INSERT INTO case_studies (slug, title, client_name, industry, project_type, description, challenge, solution, results, featured_image_url, technologies, timeline, is_featured, is_published, order_index) VALUES
('muscle-works-ai-transformation', 'Complete AI Marketing Transformation', 'Muscle Works', 'Fitness & Wellness', 'Full AI Implementation', 'Comprehensive AI-driven marketing transformation for a leading fitness brand, resulting in 300% increase in qualified leads.', 'Muscle Works was struggling with inconsistent lead generation and high customer acquisition costs. Their manual marketing processes couldn''t scale with their rapid growth.', 'We implemented a complete AI marketing ecosystem including automated lead nurturing, personalized content generation, and predictive analytics for customer lifetime value optimization.', 'Achieved 300% increase in qualified leads, 45% reduction in customer acquisition cost, and 180% improvement in customer retention rates within 6 months.', '/images/case-studies/muscle-works-hero.jpg', '["OpenAI GPT-4", "Google Analytics Intelligence", "HubSpot AI", "Custom ML Models"]', '6 months', true, true, 1),

('saas-content-engine', 'AI-Powered Content Engine', 'TechFlow SaaS', 'Software as a Service', 'Content Automation', 'Built an AI content generation system that produces high-converting blog posts, social media content, and email campaigns automatically.', 'TechFlow needed to scale their content marketing but lacked the resources to hire a large content team. They were publishing inconsistently and struggling to maintain quality.', 'We developed a custom AI content engine that understands their brand voice, target audience, and industry trends to generate relevant, high-quality content across all channels.', 'Increased content output by 500%, improved organic traffic by 250%, and achieved 40% higher engagement rates across all content channels.', '/images/case-studies/saas-content-hero.jpg', '["GPT-4 Turbo", "Claude AI", "Custom NLP Models", "Content Optimization AI"]', '4 months', true, true, 2),

('wellness-way-personalization', 'AI-Driven Personalization Engine', 'The Wellness Way', 'Healthcare', 'Personalization Platform', 'Created an AI system that personalizes health content and recommendations for thousands of users based on their individual health profiles.', 'The Wellness Way wanted to provide personalized health recommendations but couldn''t manually customize content for their growing user base of over 50,000 members.', 'We built an AI personalization engine that analyzes user health data, preferences, and behavior to deliver customized content, meal plans, and wellness recommendations.', 'Achieved 85% increase in user engagement, 60% improvement in program completion rates, and 40% increase in premium subscription conversions.', '/images/case-studies/wellness-way-hero.jpg', '["TensorFlow", "Recommendation Systems", "Health Data ML", "Personalization AI"]', '8 months', false, true, 3)
ON CONFLICT DO NOTHING;

-- Sample Blog Posts
INSERT INTO blog_posts (slug, title, excerpt, content, author_id, category, tags, reading_time, is_published, published_at, seo_title, seo_description) VALUES
('future-of-ai-marketing-2024', 'The Future of AI in Marketing: 2024 Trends and Predictions', 'Discover the latest AI marketing trends that will shape the industry in 2024 and beyond.', 'Artificial Intelligence is revolutionizing marketing at an unprecedented pace. As we move through 2024, several key trends are emerging that will define the future of AI-powered marketing strategies...',
(SELECT id FROM team_members WHERE name = 'Will Stevens' LIMIT 1),
'AI Trends', '["AI", "Marketing", "2024", "Trends", "Machine Learning"]', 8, true, NOW() - INTERVAL '7 days',
'The Future of AI in Marketing: 2024 Trends & Predictions | Disruptors AI',
'Explore the latest AI marketing trends for 2024. Learn how artificial intelligence is transforming marketing strategies and what to expect in the coming year.'),

('ai-content-generation-best-practices', 'AI Content Generation: Best Practices for Marketers', 'Learn how to create high-quality, engaging content using AI tools while maintaining your brand voice.', 'AI content generation has become a game-changer for marketing teams looking to scale their content production. However, creating effective AI-generated content requires understanding best practices...',
(SELECT id FROM team_members WHERE name = 'Sarah Chen' LIMIT 1),
'Content Marketing', '["AI Content", "Content Marketing", "Best Practices", "Automation"]', 6, true, NOW() - INTERVAL '14 days',
'AI Content Generation Best Practices for Marketers | Disruptors AI',
'Master AI content generation with our comprehensive guide. Learn best practices for creating engaging, brand-aligned content using artificial intelligence.'),

('measuring-roi-ai-marketing', 'How to Measure ROI from AI Marketing Investments', 'A comprehensive guide to tracking and measuring the return on investment from your AI marketing initiatives.', 'Measuring the ROI of AI marketing investments can be challenging, but it''s crucial for justifying spend and optimizing performance. This guide covers key metrics and methodologies...',
(SELECT id FROM team_members WHERE name = 'Marcus Rodriguez' LIMIT 1),
'Analytics', '["ROI", "AI Marketing", "Analytics", "Measurement", "KPIs"]', 10, true, NOW() - INTERVAL '21 days',
'How to Measure ROI from AI Marketing Investments | Disruptors AI',
'Learn how to effectively measure and track ROI from your AI marketing investments. Comprehensive guide to AI marketing metrics and measurement strategies.')
ON CONFLICT DO NOTHING;

-- Sample Resources
INSERT INTO resources (slug, title, description, resource_type, category, tags, requires_email, is_published, order_index) VALUES
('ai-marketing-readiness-checklist', 'AI Marketing Readiness Checklist', 'A comprehensive checklist to assess your organization''s readiness for AI marketing implementation.', 'checklist', 'Getting Started', '["AI Readiness", "Checklist", "Implementation"]', true, true, 1),
('ai-marketing-strategy-template', 'AI Marketing Strategy Template', 'A complete template for developing your AI marketing strategy, including goals, tactics, and measurement frameworks.', 'template', 'Strategy', '["Strategy", "Template", "Planning"]', true, true, 2),
('ai-tools-comparison-guide', 'AI Marketing Tools Comparison Guide', 'Detailed comparison of the top AI marketing tools and platforms available in 2024.', 'guide', 'Tools', '["Tools", "Comparison", "Software"]', false, true, 3)
ON CONFLICT DO NOTHING;

-- Sample Testimonials
INSERT INTO testimonials (client_name, client_title, client_company, testimonial_text, rating, case_study_id, is_featured, is_published) VALUES
('Jennifer Walsh', 'VP of Marketing', 'Muscle Works', 'Working with Disruptors AI transformed our entire marketing operation. The AI automation system they built for us increased our qualified leads by 300% while reducing our workload significantly.', 5,
(SELECT id FROM case_studies WHERE slug = 'muscle-works-ai-transformation' LIMIT 1), true, true),

('David Kim', 'CEO', 'TechFlow SaaS', 'The AI content engine that Disruptors AI built for us is incredible. We went from publishing 2-3 blog posts per month to 15+ high-quality pieces, and our organic traffic has skyrocketed.', 5,
(SELECT id FROM case_studies WHERE slug = 'saas-content-engine' LIMIT 1), true, true),

('Dr. Michael Torres', 'Founder', 'The Wellness Way', 'The personalization engine created by Disruptors AI has revolutionized how we serve our members. User engagement is up 85% and our premium conversion rates have increased by 40%.', 5,
(SELECT id FROM case_studies WHERE slug = 'wellness-way-personalization' LIMIT 1), false, true)
ON CONFLICT DO NOTHING;

-- Sample FAQs
INSERT INTO faqs (question, answer, category, order_index, is_published) VALUES
('What is AI marketing automation?', 'AI marketing automation uses artificial intelligence to streamline and optimize marketing processes, from lead generation to customer retention. It includes intelligent lead scoring, automated email campaigns, content personalization, and performance analytics.', 'General', 1, true),
('How long does it take to implement AI marketing solutions?', 'Implementation timelines vary based on the complexity of your needs. Simple automation can be set up in 2-4 weeks, while comprehensive AI marketing systems typically take 3-6 months to fully implement and optimize.', 'Implementation', 2, true),
('Do I need technical expertise to use AI marketing tools?', 'No, our AI marketing solutions are designed to be user-friendly for marketing professionals without technical backgrounds. We provide comprehensive training and ongoing support to ensure your team can effectively use all AI tools.', 'Technical', 3, true),
('What kind of ROI can I expect from AI marketing?', 'Our clients typically see 150-300% improvements in key marketing metrics within the first 6 months. This includes increased lead generation, improved conversion rates, reduced customer acquisition costs, and enhanced customer lifetime value.', 'ROI', 4, true),
('Is my data secure with AI marketing tools?', 'Yes, data security is our top priority. We use enterprise-grade encryption, comply with GDPR and other privacy regulations, and implement strict access controls. Your data is never shared with third parties without explicit consent.', 'Security', 5, true)
ON CONFLICT DO NOTHING;

-- Sample Newsletter Subscriptions (for testing)
INSERT INTO newsletter_subscriptions (email, name, subscription_source, interests, double_opt_in_confirmed) VALUES
('test@example.com', 'Test User', 'website', '["AI Marketing", "Automation"]', true),
('demo@disruptorsmedia.com', 'Demo Account', 'lead_magnet', '["Content Generation", "Analytics"]', true)
ON CONFLICT DO NOTHING;

SELECT 'Sample data inserted successfully!' as seed_status;