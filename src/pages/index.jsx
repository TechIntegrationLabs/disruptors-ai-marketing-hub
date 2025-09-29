import Layout from "./Layout.jsx";

import Home from "./Home.jsx";

import Assessment from "./assessment.jsx";

import Calculator from "./calculator.jsx";

import NotFound from "./404.jsx";

import WorkSaasContentEngine from "./work-saas-content-engine.jsx";

import ResourcesAiSuitcaseTermsDecoded from "./resources-ai-suitcase-terms-decoded.jsx";

import Solutions from "./solutions.jsx";

import Work from "./work.jsx";

import About from "./about.jsx";

import Resources from "./resources.jsx";

import Contact from "./contact.jsx";

import Privacy from "./privacy.jsx";

import Terms from "./terms.jsx";

import Blog from "./blog.jsx";

import BlogDetail from "./blog-detail.jsx";

import BlogManagement from "./blog-management.jsx";

import WorkTradeworxUsa from "./work-tradeworx-usa.jsx";

import WorkTimberViewFinancial from "./work-timber-view-financial.jsx";

import WorkTheWellnessWay from "./work-the-wellness-way.jsx";

import WorkSoundCorrections from "./work-sound-corrections.jsx";

import WorkSegpro from "./work-segpro.jsx";

import WorkNeuroMastery from "./work-neuro-mastery.jsx";

import WorkMuscleWorks from "./work-muscle-works.jsx";

import WorkGranitePaving from "./work-granite-paving.jsx";

import WorkAutoTrimUtah from "./work-auto-trim-utah.jsx";

import BookStrategySession from "./book-strategy-session.jsx";

import SolutionsAiAutomation from "./solutions-ai-automation.jsx";

import SolutionsSocialMedia from "./solutions-social-media.jsx";

import SolutionsSeoGeo from "./solutions-seo-geo.jsx";

import SolutionsLeadGeneration from "./solutions-lead-generation.jsx";

import SolutionsPaidAdvertising from "./solutions-paid-advertising.jsx";

import SolutionsPodcasting from "./solutions-podcasting.jsx";

import SolutionsCustomApps from "./solutions-custom-apps.jsx";

import SolutionsCrmManagement from "./solutions-crm-management.jsx";

import SolutionsFractionalCmo from "./solutions-fractional-cmo.jsx";

import Podcast from "./podcast.jsx";

import Gallery from "./gallery.jsx";

import Faq from "./faq.jsx";

import ScrollAnimationDemo from "../components/examples/ScrollAnimationExamples.jsx";

import FullAnimationDemo from "./full-animation-demo.jsx";

import SplineDemo from "./spline-demo.jsx";

import VideoScrubDemo from "./video-scrub-demo.jsx";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    assessment: Assessment,
    
    calculator: Calculator,
    
    "404": NotFound,
    
    "work-saas-content-engine": WorkSaasContentEngine,
    
    "resources-ai-suitcase-terms-decoded": ResourcesAiSuitcaseTermsDecoded,
    
    solutions: Solutions,
    
    work: Work,
    
    about: About,
    
    resources: Resources,
    
    contact: Contact,
    
    privacy: Privacy,
    
    terms: Terms,
    
    blog: Blog,

    "blog-detail": BlogDetail,

    "blog-management": BlogManagement,
    
    "work-tradeworx-usa": WorkTradeworxUsa,
    
    "work-timber-view-financial": WorkTimberViewFinancial,
    
    "work-the-wellness-way": WorkTheWellnessWay,
    
    "work-sound-corrections": WorkSoundCorrections,
    
    "work-segpro": WorkSegpro,
    
    "work-neuro-mastery": WorkNeuroMastery,
    
    "work-muscle-works": WorkMuscleWorks,
    
    "work-granite-paving": WorkGranitePaving,
    
    "work-auto-trim-utah": WorkAutoTrimUtah,
    
    "book-strategy-session": BookStrategySession,
    
    "solutions-ai-automation": SolutionsAiAutomation,
    
    "solutions-social-media": SolutionsSocialMedia,
    
    "solutions-seo-geo": SolutionsSeoGeo,
    
    "solutions-lead-generation": SolutionsLeadGeneration,
    
    "solutions-paid-advertising": SolutionsPaidAdvertising,
    
    "solutions-podcasting": SolutionsPodcasting,
    
    "solutions-custom-apps": SolutionsCustomApps,
    
    "solutions-crm-management": SolutionsCrmManagement,
    
    "solutions-fractional-cmo": SolutionsFractionalCmo,
    
    podcast: Podcast,
    
    gallery: Gallery,
    
    faq: Faq,

    "animations-demo": ScrollAnimationDemo,

    "full-animation": FullAnimationDemo,

    "spline-demo": SplineDemo,

    "video-scrub-demo": VideoScrubDemo,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/assessment" element={<Assessment />} />
                
                <Route path="/calculator" element={<Calculator />} />
                
                <Route path="/404" element={<NotFound />} />
                
                <Route path="/work-saas-content-engine" element={<WorkSaasContentEngine />} />
                
                <Route path="/resources-ai-suitcase-terms-decoded" element={<ResourcesAiSuitcaseTermsDecoded />} />
                
                <Route path="/solutions" element={<Solutions />} />
                
                <Route path="/work" element={<Work />} />
                
                <Route path="/about" element={<About />} />
                
                <Route path="/resources" element={<Resources />} />
                
                <Route path="/contact" element={<Contact />} />
                
                <Route path="/privacy" element={<Privacy />} />
                
                <Route path="/terms" element={<Terms />} />
                
                <Route path="/blog" element={<Blog />} />
                
                <Route path="/blog-detail" element={<BlogDetail />} />

                <Route path="/blog-management" element={<BlogManagement />} />
                
                <Route path="/work-tradeworx-usa" element={<WorkTradeworxUsa />} />
                
                <Route path="/work-timber-view-financial" element={<WorkTimberViewFinancial />} />
                
                <Route path="/work-the-wellness-way" element={<WorkTheWellnessWay />} />
                
                <Route path="/work-sound-corrections" element={<WorkSoundCorrections />} />
                
                <Route path="/work-segpro" element={<WorkSegpro />} />
                
                <Route path="/work-neuro-mastery" element={<WorkNeuroMastery />} />
                
                <Route path="/work-muscle-works" element={<WorkMuscleWorks />} />
                
                <Route path="/work-granite-paving" element={<WorkGranitePaving />} />
                
                <Route path="/work-auto-trim-utah" element={<WorkAutoTrimUtah />} />
                
                <Route path="/book-strategy-session" element={<BookStrategySession />} />
                
                <Route path="/solutions-ai-automation" element={<SolutionsAiAutomation />} />
                
                <Route path="/solutions-social-media" element={<SolutionsSocialMedia />} />
                
                <Route path="/solutions-seo-geo" element={<SolutionsSeoGeo />} />
                
                <Route path="/solutions-lead-generation" element={<SolutionsLeadGeneration />} />
                
                <Route path="/solutions-paid-advertising" element={<SolutionsPaidAdvertising />} />
                
                <Route path="/solutions-podcasting" element={<SolutionsPodcasting />} />
                
                <Route path="/solutions-custom-apps" element={<SolutionsCustomApps />} />
                
                <Route path="/solutions-crm-management" element={<SolutionsCrmManagement />} />
                
                <Route path="/solutions-fractional-cmo" element={<SolutionsFractionalCmo />} />
                
                <Route path="/podcast" element={<Podcast />} />
                
                <Route path="/gallery" element={<Gallery />} />
                
                <Route path="/faq" element={<Faq />} />

                <Route path="/animations-demo" element={<ScrollAnimationDemo />} />

                <Route path="/full-animation" element={<FullAnimationDemo />} />

                <Route path="/spline-demo" element={<SplineDemo />} />

                <Route path="/video-scrub-demo" element={<VideoScrubDemo />} />

                {/* Catch-all route for 404 pages */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}