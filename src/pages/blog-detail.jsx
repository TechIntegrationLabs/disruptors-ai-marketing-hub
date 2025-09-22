
import React, { useState, useEffect } from 'react';
import { Resource } from '@/api/entities';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import DualCTABlock from '../components/shared/DualCTABlock';
import Placeholder from '../components/shared/Placeholder';

export default function BlogDetail() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const slug = urlParams.get('slug');

            if (!slug) {
                setError("No post slug provided in URL.");
                setLoading(false);
                return;
            }

            try {
                const posts = await Resource.filter({ slug: slug, type: 'Article' });
                if (posts && posts.length > 0) {
                    setPost(posts[0]);
                } else {
                    setError("Post not found.");
                }
            } catch (err) {
                setError("Failed to fetch post.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><p className="text-white">Loading post...</p></div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center"><p className="text-red-400">{error}</p></div>;
    }

    if (!post) {
        return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">The post could not be loaded.</p></div>;
    }

    return (
        <div className="text-white">
            {/* Hero */}
            <section className="relative py-20 sm:py-32">
                {post.cover_image_url && (
                    <div className="absolute inset-0">
                        <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-gray-900/30 to-transparent" />
                    </div>
                )}
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-black/30 backdrop-blur-md rounded-3xl p-8">
                        <p className="text-indigo-400 font-semibold mb-2">{post.category}</p>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{post.title}</h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{post.excerpt}</p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="py-16 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-md text-gray-900 rounded-3xl p-8 sm:p-12">
                        {/* Metadata Bar */}
                        <div className="border-b border-gray-200 pb-4 mb-8 flex flex-wrap justify-center sm:justify-between items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center"><User className="w-4 h-4 mr-1.5" /> Author Name</span>
                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {new Date(post.publish_date).toLocaleDateString()}</span>
                                <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {post.read_time}</span>
                            </div>
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    {post.tags.join(', ')}
                                </div>
                            )}
                        </div>

                        {/* Post Body */}
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-indigo-600"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>
            </div>

            <DualCTABlock />
        </div>
    );
}
