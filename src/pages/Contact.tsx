
import React, { useState } from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { MailOpen, MessageSquare, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We've received your message and will respond shortly.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <div className="sportyfi-card mb-6">
                <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
                <p className="text-gray-700 mb-6">
                  Have questions about SportyFi? Want to report an issue or suggest a feature? 
                  Our team is here to help! Fill out the form and we'll get back to you as soon as possible.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-sportyfi-orange text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <MailOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-gray-600">support@sportyfi.com</p>
                      <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-sportyfi-orange text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-gray-600">(123) 456-7890</p>
                      <p className="text-sm text-gray-500">Monday to Friday, 9am to 5pm EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-sportyfi-orange text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Visit Us</h3>
                      <p className="text-gray-600">123 Sports Avenue</p>
                      <p className="text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-sportyfi-orange text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-gray-600">Available on our website</p>
                      <p className="text-sm text-gray-500">7 days a week, 9am to 9pm EST</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="sportyfi-card">
                <h2 className="text-xl font-semibold mb-4">FAQs</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">How do I create a match?</h3>
                    <p className="text-gray-600">Go to Matches and click on "Host a Match" to get started.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">How do tournament registrations work?</h3>
                    <p className="text-gray-600">Browse available tournaments, click register, and follow the instructions to complete registration.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Can I change my username?</h3>
                    <p className="text-gray-600">Yes, you can update your username in the Profile Settings section.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Is SportyFi available in my city?</h3>
                    <p className="text-gray-600">We're expanding rapidly! Contact us to request SportyFi in your area.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="sportyfi-card">
              <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={6}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sportyfi-orange hover:bg-red-600 text-white"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
