import React from 'react';

export default function Terms() {
  return (
    <div className="py-20 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-800">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the disruptorsmedia.com website (the "Service") operated by Disruptors Media ("us", "we", or "our").</p>
              
              <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>

              <h2>Accounts</h2>
              <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

              <h2>Links To Other Web Sites</h2>
              <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by Disruptors Media. Disruptors Media has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services.</p>

              <h2>Termination</h2>
              <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              
              <h2>Governing Law</h2>
              <p>These Terms shall be governed and construed in accordance with the laws of Utah, United States, without regard to its conflict of law provisions.</p>
            </div>
        </div>
      </div>
    </div>
  );
}