
import React, { useState, useEffect } from 'react';
import { Resource } from '@/api/entities';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import DualCTABlock from '../components/shared/DualCTABlock';

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
                            className="prose prose-lg prose-indigo max-w-none
                                prose-headings:text-gray-900 prose-headings:font-bold
                                prose-h1:text-4xl prose-h1:mb-6
                                prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-gray-900 prose-strong:font-semibold
                                prose-em:text-gray-700 prose-em:italic
                                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
                                prose-code:bg-gray-100 prose-code:text-indigo-600 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                                prose-li:mb-2
                                prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                                prose-table:border-collapse prose-table:w-full
                                prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
                                prose-td:border prose-td:border-gray-200 prose-td:p-3
                                prose-hr:my-8 prose-hr:border-gray-300"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>
            </div>

            <DualCTABlock />
        </div>
    );
}
