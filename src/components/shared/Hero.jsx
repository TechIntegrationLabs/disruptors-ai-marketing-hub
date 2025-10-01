import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { customClient } from '@/lib/custom-sdk';

// Fallback hardcoded media (used if database fetch fails)
const FALLBACK_MEDIA = {
  background: {
    url: "",
    alt: ""
  },
  video: {
    url: "https://res.cloudinary.com/dvcvxhzmt/video/upload/v1758645813/Website_Demo_Reel_edited_udorcp.mp4",
    alt: "Website demo reel"
  },
  logo: {
    url: "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png",
    alt: "Disruptors Media Gold Logo"
  }
};

export default function Hero({
  h1 = "AI-Powered Marketing Agency",
  lead = "We combine deep marketing expertise with cutting-edge AI systems to create flexible growth strategies tailored to your business needs.",
}) {
  const [media, setMedia] = useState(FALLBACK_MEDIA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      // Load hero media from database
      const dbMedia = await customClient.entities.SiteMedia.list('display_order', 100);

      if (dbMedia && dbMedia.length > 0) {
        // Filter for hero page assets
        const heroAssets = dbMedia.filter(asset =>
          asset.page_slug === 'hero' && asset.is_active !== false
        );

        if (heroAssets.length > 0) {
          const mediaMap = {
            background: FALLBACK_MEDIA.background,
            video: FALLBACK_MEDIA.video,
            logo: FALLBACK_MEDIA.logo
          };

          // Map database records to media slots by purpose
          heroAssets.forEach(asset => {
            const purpose = asset.purpose?.toLowerCase() || '';

            if (purpose.includes('background')) {
              mediaMap.background = {
                url: asset.media_url,
                alt: asset.alt_text || asset.purpose
              };
            } else if (purpose.includes('demo') || purpose.includes('reel')) {
              mediaMap.video = {
                url: asset.media_url,
                alt: asset.alt_text || asset.purpose
              };
            } else if (purpose.includes('logo')) {
              mediaMap.logo = {
                url: asset.media_url,
                alt: asset.alt_text || asset.purpose
              };
            }
          });

          setMedia(mediaMap);
          console.log(`✓ Loaded ${heroAssets.length} hero media assets from database`);
        } else {
          console.log('⚠ No hero assets found in database, using fallback media');
        }
      }
    } catch (error) {
      console.warn('⚠ Failed to load hero media from database:', error.message);
      setMedia(FALLBACK_MEDIA);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <section className="relative min-h-[100svh] overflow-hidden flex items-center justify-center bg-transparent py-8 sm:py-12 md:py-16">
      {/* Background Image Layer */}
      {media.background.url && (
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={media.background.url}
            alt={media.background.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content Container - Constrained Width */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        {/* Text Content - Same Width as Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-black mb-4 sm:mb-6 px-2">
            {h1}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed mx-auto max-w-3xl px-4">
            {lead}
          </p>
        </motion.div>

        {/* Video Container with Centered Logo and Irregular Shape */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full"
        >
          <div className="relative hero-video-shape overflow-hidden shadow-2xl rounded-2xl sm:rounded-3xl">
            <video
              src={media.video.url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Centered Logo Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 gap-4 sm:gap-6">
              <img
                src={media.logo.url}
                alt={media.logo.alt}
                className="h-20 sm:h-28 md:h-36 lg:h-48 xl:h-56 w-auto object-contain"
              />
              {/* Text Overlay Below Logo */}
              <div className="text-center text-white max-w-2xl px-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
                  AI-Powered Marketing Agency
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-md">
                  We combine deep marketing expertise with cutting-edge AI systems to create flexible growth strategies tailored to your business needs.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

       <style>{`
        .text-shadow-lg {
          text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
        }
        .text-shadow {
          text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
        }
        .hero-video-shape {
          clip-path: polygon(0% 0%, 90% 0%, 100% 20%, 100% 100%, 10% 100%, 0% 80%);
          aspect-ratio: 16/9;
          min-height: 250px;
        }
        @media (min-width: 640px) {
          .hero-video-shape {
            min-height: 300px;
          }
        }
        @media (min-width: 768px) {
          .hero-video-shape {
            min-height: 350px;
          }
        }
        @media (min-width: 1024px) {
          .hero-video-shape {
            min-height: 400px;
          }
        }
      `}</style>
    </section>
  );
}