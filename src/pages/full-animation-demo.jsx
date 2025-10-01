/**
 * Full Animation Demo Page
 * Uses your Spline animation: https://prod.spline.design/lylivpxHMsRXq3dw/scene.splinecode
 */

import { useEffect, useRef } from 'react';
import SplineScrollAnimationEnhanced from '../components/shared/SplineScrollAnimationEnhanced';

export default function FullAnimationDemo() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Your Spline Animation */}
      <section className="relative h-screen">
        <SplineScrollAnimationEnhanced
          // Your Spline scene URL
          scene="https://prod.spline.design/lylivpxHMsRXq3dw/scene.splinecode"

          // Text overlay
          title="Full Animation Experience"
          description="Scroll to explore the interactive 3D scene"

          // Animation preset
          animationPreset="spiral"

          // Custom animation parameters
          customAnimations={{
            radius: 2,
            height: 3,
            frequency: 2,
            amplitude: 1.5
          }}

          // Scroll trigger settings
          scrollTriggerOptions={{
            start: "top 20%",
            end: "bottom 80%",
            scrub: 1.5
          }}

          // Performance optimization
          enableMobileOptimization={true}

          // Show performance indicator in development
          showPerformanceIndicator={process.env.NODE_ENV === 'development'}

          // Callbacks
          onLoad={(splineApp) => {
            console.log('🎨 Full animation loaded!');
            console.log('Spline App:', splineApp);
          }}

          onError={(error) => {
            console.error('❌ Animation failed to load:', error);
          }}
        />
      </section>

      {/* Info Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8">
            Your Spline Animation is Live!
          </h2>

          <div className="space-y-6 text-gray-300">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">
                Scene Details
              </h3>
              <ul className="space-y-2">
                <li><strong>Scene URL:</strong> https://prod.spline.design/lylivpxHMsRXq3dw/scene.splinecode</li>
                <li><strong>Animation Preset:</strong> Spiral</li>
                <li><strong>Optimization:</strong> Mobile-optimized</li>
                <li><strong>Scroll Trigger:</strong> Active</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">
                Available Presets
              </h3>
              <p className="mb-4">Try different animation styles by changing the <code className="bg-gray-800 px-2 py-1 rounded">animationPreset</code> prop:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><code className="bg-gray-800 px-2 py-1 rounded">rotate</code> - Smooth rotation</li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">spiral</code> - Spiral motion (current)</li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">scale</code> - Scale up/down</li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">float</code> - Floating motion</li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">bounce</code> - Bouncing effect</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">
                Next Steps
              </h3>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Scroll up and down to see the animation respond to your scroll position</li>
                <li>Check the browser console to see animation lifecycle events</li>
                <li>Try different animation presets in the code</li>
                <li>Customize scroll trigger start/end points</li>
                <li>Integrate this into your Home page or any other page</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for scroll testing */}
      <section className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Keep Scrolling
          </h2>
          <p className="text-xl text-gray-400">
            Watch how the animation responds to your scroll position
          </p>
        </div>
      </section>
    </div>
  );
}