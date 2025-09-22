import React from 'react';

export default function Privacy() {
  return (
    <div className="py-20 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-800">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <p>Disruptors Media ("us", "we", or "our") operates the disruptorsmedia.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
              
              <p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

              <h2>Information Collection and Use</h2>
              <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

              <h3>Types of Data Collected</h3>
              <h4>Personal Data</h4>
              <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and last name, Cookies and Usage Data.</p>
              
              <h4>Usage Data</h4>
              <p>We may also collect information how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>

              <h2>Use of Data</h2>
              <p>Disruptors Media uses the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, to allow you to participate in interactive features of our Service when you choose to do so, to provide customer care and support, to provide analysis or valuable information so that we can improve the Service, to monitor the usage of the Service, to detect, prevent and address technical issues.</p>
            </div>
        </div>
      </div>
    </div>
  );
}