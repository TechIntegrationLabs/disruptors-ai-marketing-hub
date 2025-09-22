
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PlaceholderAnimation from '../shared/PlaceholderAnimation';
import DualCTABlock from '../shared/DualCTABlock';
import { CheckCircle } from 'lucide-react';

export default function SolutionPageLayout({ service }) {
    if (!service) {
        return <div>Loading service details...</div>;
    }

    const {
        title,
        h2,
        descriptivePhrase,
        overview,
        image,
        cta_label = 'Book a Strategy Session',
        cta_link = 'book-strategy-session'
    } = service;

    return (
        <div className="text-gray-900">
            {/* Hero Section */}
            <section className="py-24 sm:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20"
                        >
                            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">{title}</h1>
                            {h2 && <p className="text-2xl text-gray-700">{h2}</p>}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex gap-4 justify-center">
                                <PlaceholderAnimation type="funnel" />
                                <PlaceholderAnimation type="fingers" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <section className="py-20 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20"
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">{descriptivePhrase}</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">{overview}</p>
                            <Button asChild size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold">
                                <Link to={createPageUrl(cta_link)}>{cta_label}</Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                        >
                            <img 
                                src={image} 
                                alt={title} 
                                className="w-full h-auto object-cover rounded-3xl shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
            
            {/* Outcomes (Placeholder) */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-12 text-gray-900">Expected Outcomes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/20">
                                <CheckCircle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                                <h3 className="font-bold text-lg mb-2">Placeholder Outcome {i}</h3>
                                <p className="text-gray-600 text-sm">[Outcome description to be added]</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative bg-gray-800 text-white py-20">
                <DualCTABlock 
                    title="Ready to implement this solution?"
                    cta1_text={cta_label}
                    cta1_link={cta_link}
                    cta2_text="See Other Solutions"
                    cta2_link="solutions"
                />
            </section>
        </div>
    );
}
