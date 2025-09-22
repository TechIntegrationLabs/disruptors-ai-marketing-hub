import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend function
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">Contact Us</h1>
            <p className="mt-4 text-lg text-gray-600">Have a question or a project in mind? We'd love to hear from you.</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            {isSubmitted ? (
              <div className="text-center py-12 flex flex-col items-center justify-center min-h-[300px]">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h3>
                <p className="text-gray-600">Your message has been sent. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="font-semibold text-gray-800">Full Name</Label>
                  <Input id="name" type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-2" placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email" className="font-semibold text-gray-800">Email Address</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-2" placeholder="you@company.com" />
                </div>
                <div>
                  <Label htmlFor="message" className="font-semibold text-gray-800">Message</Label>
                  <Textarea id="message" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="mt-2" placeholder="How can we help?" rows={5}/>
                </div>
                <div className="pt-4">
                  <Button type="submit" className="w-full text-lg py-6">Send Message</Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}