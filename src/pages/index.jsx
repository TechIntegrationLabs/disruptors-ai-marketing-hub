import Layout from "./Layout.jsx";

import Home from "./Home";

import assessment from "./assessment";

import calculator from "./calculator";

import NotFound from "./404";

import WorkSaasContentEngine from "./work-saas-content-engine";

import ResourcesAiSuitcaseTermsDecoded from "./resources-ai-suitcase-terms-decoded";

import solutions from "./solutions";

import work from "./work";

import about from "./about";

import resources from "./resources";

import contact from "./contact";

import privacy from "./privacy";

import terms from "./terms";

import blog from "./blog";

import BlogDetail from "./blog-detail";

import WorkTradeworxUsa from "./work-tradeworx-usa";

import WorkTimberViewFinancial from "./work-timber-view-financial";

import WorkTheWellnessWay from "./work-the-wellness-way";

import WorkSoundCorrections from "./work-sound-corrections";

import WorkSegpro from "./work-segpro";

import WorkNeuroMastery from "./work-neuro-mastery";

import WorkMuscleWorks from "./work-muscle-works";

import WorkGranitePaving from "./work-granite-paving";

import WorkAutoTrimUtah from "./work-auto-trim-utah";

import BookStrategySession from "./book-strategy-session";

import SolutionsAiAutomation from "./solutions-ai-automation";

import SolutionsSocialMedia from "./solutions-social-media";

import SolutionsSeoGeo from "./solutions-seo-geo";

import SolutionsLeadGeneration from "./solutions-lead-generation";

import SolutionsPaidAdvertising from "./solutions-paid-advertising";

import SolutionsPodcasting from "./solutions-podcasting";

import SolutionsCustomApps from "./solutions-custom-apps";

import SolutionsCrmManagement from "./solutions-crm-management";

import SolutionsFractionalCmo from "./solutions-fractional-cmo";

import podcast from "./podcast";

import gallery from "./gallery";

import faq from "./faq";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    assessment: assessment,
    
    calculator: calculator,
    
    "404": NotFound,
    
    "work-saas-content-engine": WorkSaasContentEngine,
    
    "resources-ai-suitcase-terms-decoded": ResourcesAiSuitcaseTermsDecoded,
    
    solutions: solutions,
    
    work: work,
    
    about: about,
    
    resources: resources,
    
    contact: contact,
    
    privacy: privacy,
    
    terms: terms,
    
    blog: blog,
    
    "blog-detail": BlogDetail,
    
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
    
    podcast: podcast,
    
    gallery: gallery,
    
    faq: faq,
    
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
                
                <Route path="/assessment" element={<assessment />} />
                
                <Route path="/calculator" element={<calculator />} />
                
                <Route path="/404" element={<NotFound />} />
                
                <Route path="/work-saas-content-engine" element={<WorkSaasContentEngine />} />
                
                <Route path="/resources-ai-suitcase-terms-decoded" element={<ResourcesAiSuitcaseTermsDecoded />} />
                
                <Route path="/solutions" element={<solutions />} />
                
                <Route path="/work" element={<work />} />
                
                <Route path="/about" element={<about />} />
                
                <Route path="/resources" element={<resources />} />
                
                <Route path="/contact" element={<contact />} />
                
                <Route path="/privacy" element={<privacy />} />
                
                <Route path="/terms" element={<terms />} />
                
                <Route path="/blog" element={<blog />} />
                
                <Route path="/blog-detail" element={<BlogDetail />} />
                
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
                
                <Route path="/podcast" element={<podcast />} />
                
                <Route path="/gallery" element={<gallery />} />
                
                <Route path="/faq" element={<faq />} />
                
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