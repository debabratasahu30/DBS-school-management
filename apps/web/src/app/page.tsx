'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Users, Award, ArrowRight, Calendar, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, ChevronRight, CheckCircle2, Star, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (!mounted) {
    return null;
  }

  const quickLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Admissions', href: '#' },
    { name: 'Academics', href: '#' },
    { name: 'Facilities', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Expert Faculty',
      description: 'Highly qualified teachers dedicated to student success'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Modern Curriculum',
      description: 'Updated syllabus aligned with global standards'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Small Class Sizes',
      description: 'Personal attention for every student'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excellence Awards',
      description: 'Recognized for outstanding academic achievements'
    }
  ];

  const upcomingEvents = [
    { 
      title: 'Annual Sports Day', 
      date: 'June 25, 2024', 
      time: '9:00 AM', 
      location: 'School Ground',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8aec?w=400&q=80'
    },
    { 
      title: 'Science Exhibition', 
      date: 'July 10, 2024', 
      time: '10:00 AM', 
      location: 'Auditorium',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80'
    },
    { 
      title: 'Parent-Teacher Meeting', 
      date: 'July 15, 2024', 
      time: '2:00 PM', 
      location: 'Classrooms',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80'
    },
  ];

  const achievements = [
    { 
      title: 'Best School Award 2024', 
      description: 'Recognized for excellence in education',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80'
    },
    { 
      title: '100% Board Results', 
      description: 'Outstanding performance in board examinations',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80'
    },
    { 
      title: 'Green School Certification', 
      description: 'Eco-friendly campus initiatives',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Parent',
      content: 'Greenwood School has transformed my child\'s learning experience. The teachers are dedicated and the facilities are world-class.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'Alumni',
      content: 'The foundation I received at Greenwood prepared me for my engineering degree. Forever grateful to this institution.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Teacher',
      content: 'Teaching at Greenwood is a privilege. The supportive environment and motivated students make every day rewarding.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-[#FFFFFF] shadow-sm sticky top-0 z-50 border-b border-[#E5E7EB]"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#312C51] to-[#48426D] rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#312C51] to-[#48426D] bg-clip-text text-transparent">
                  DBS Academy
                </span>
                <p className="text-xs text-[#6B7280]">Excellence in Education Since 1999</p>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[#1F2937] hover:text-[#312C51] transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <Button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-[#312C51] to-[#48426D] hover:from-[#48426D] hover:to-[#312C51] text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#312C51] via-[#48426D] to-[#312C51] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#F0C38E] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#F1AA9B] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#48426D] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 bg-[#F0C38E]/20 backdrop-blur-sm px-6 py-3 rounded-full border border-[#F0C38E]/30"
              >
                <Star className="w-5 h-5 text-[#F0C38E]" />
                <span className="text-sm font-medium text-[#F0C38E]">Admissions Open for 2024-25</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Empowering Education,
                <span className="block text-[#F0C38E] mt-2">Shaping Tomorrow</span>
              </h1>

              <p className="text-xl text-[#FAF8F4]/90 leading-relaxed max-w-2xl mx-auto mb-8">
                Join DBS Academy where academic excellence meets character development. We prepare students not just for exams, but for life.
              </p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-6 justify-center"
              >
                <Button
                  onClick={() => router.push('/login')}
                  size="lg"
                  className="bg-gradient-to-r from-[#F0C38E] to-[#F1AA9B] hover:from-[#F1AA9B] hover:to-[#F0C38E] text-[#312C51] px-12 py-5 rounded-full shadow-xl transition-all duration-300 font-semibold text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#F0C38E] text-[#F0C38E] hover:bg-[#F0C38E] hover:text-[#312C51] px-12 py-5 rounded-full transition-all duration-300 font-semibold text-lg"
                >
                  Learn More
                </Button>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex gap-16 justify-center pt-12"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#F0C38E] mb-2">25+</div>
                  <div className="text-base text-[#FAF8F4]/80">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#F0C38E] mb-2">5000+</div>
                  <div className="text-base text-[#FAF8F4]/80">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#F0C38E] mb-2">98%</div>
                  <div className="text-base text-[#FAF8F4]/80">Success Rate</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#FFFFFF]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-[#1F2937] mb-6">Why Choose DBS Academy?</h2>
            <p className="text-xl text-[#6B7280] leading-relaxed">Excellence in education, character in development</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-[#FAF8F4] rounded-2xl p-10 text-center border border-[#E5E7EB] hover:shadow-xl transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#312C51] to-[#48426D] rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#F0C38E]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1F2937] mb-4">{feature.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#FAF8F4]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-[#312C51] to-[#48426D] rounded-3xl p-2 shadow-2xl">
                  <div className="bg-[#FFFFFF] rounded-3xl p-3">
                    <img 
                      src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80" 
                      alt="School Building" 
                      className="w-full h-96 object-cover rounded-2xl"
                    />
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-8 -right-8 bg-[#FFFFFF] rounded-2xl shadow-2xl p-6 border-2 border-[#F0C38E]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#F0C38E] to-[#F1AA9B] rounded-full flex items-center justify-center">
                      <Award className="w-8 h-8 text-[#312C51]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#1F2937] text-lg">A+ Rated</div>
                      <div className="text-sm text-[#6B7280]">School Excellence</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-[#1F2937] leading-tight">
                Welcome to <span className="bg-gradient-to-r from-[#312C51] to-[#48426D] bg-clip-text text-transparent">DBS Academy</span>
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                Founded in 1999, DBS Academy has been a beacon of educational excellence for over two decades. Our commitment to nurturing young minds and shaping future leaders has made us one of the most sought-after institutions in the region.
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                We believe in holistic education that goes beyond academics. Our state-of-the-art facilities, experienced faculty, and innovative teaching methodologies ensure that every student reaches their full potential.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  'Modern Classrooms',
                  'Science Labs',
                  'Library & Resource Center',
                  'Sports Complex',
                  'Art & Music Studios',
                  'Computer Labs',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#F0C38E]" />
                    <span className="text-[#1F2937]">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-[#312C51] to-[#48426D] hover:from-[#48426D] hover:to-[#312C51] text-white px-10 py-4 rounded-full shadow-lg transition-all duration-300 font-semibold"
              >
                Learn More About Us
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 bg-gradient-to-br from-[#FAF8F4] to-[#F0C38E]/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-[#1F2937] mb-6">Our Achievements</h2>
            <p className="text-xl text-[#6B7280] leading-relaxed">Recognition for excellence in education</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E5E7EB]"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={achievement.image} 
                    alt={achievement.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3">{achievement.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Stay updated with school activities</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="h-40 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What People Say</h2>
            <p className="text-xl text-blue-100">Hear from our community</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                  />
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-blue-200">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-blue-100">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#FFFFFF]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#312C51] to-[#48426D] rounded-3xl p-16 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0C38E]/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F1AA9B]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Begin Your Journey With Us</h2>
              <p className="text-xl mb-10 text-[#FAF8F4]/90 leading-relaxed">Admissions are now open for the 2024-25 academic year</p>
              <div className="flex gap-6 justify-center">
                <Button
                  onClick={() => router.push('/login')}
                  size="lg"
                  className="bg-gradient-to-r from-[#F0C38E] to-[#F1AA9B] hover:from-[#F1AA9B] hover:to-[#F0C38E] text-[#312C51] px-12 py-5 rounded-full shadow-xl transition-all duration-300 font-semibold text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#F0C38E] text-[#F0C38E] hover:bg-[#F0C38E] hover:text-[#312C51] px-12 py-5 rounded-full transition-all duration-300 font-semibold text-lg"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#312C51] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F0C38E] to-[#F1AA9B] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#312C51]" />
                </div>
                <span className="text-xl font-bold">DBS Academy</span>
              </div>
              <p className="text-[#FAF8F4]/70 mb-6">
                Nurturing minds and shaping futures since 1999. Excellence in education is our commitment.
              </p>
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 text-[#FAF8F4]/70 hover:text-[#F0C38E] cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-[#FAF8F4]/70 hover:text-[#F0C38E] cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-[#FAF8F4]/70 hover:text-[#F0C38E] cursor-pointer transition-colors" />
                <Youtube className="w-5 h-5 text-[#FAF8F4]/70 hover:text-[#F0C38E] cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[#FAF8F4]/70 hover:text-[#F0C38E] transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Contact Info</h3>
              <ul className="space-y-3 text-[#FAF8F4]/70">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  123 Education Lane, Academic City
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +1-555-0123
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@dbsacademy.edu
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">School Hours</h3>
              <ul className="space-y-3 text-[#FAF8F4]/70">
                <li>Monday - Friday: 8:00 AM - 3:30 PM</li>
                <li>Saturday: 8:00 AM - 12:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#48426D] pt-8 text-center text-[#FAF8F4]/70">
            <p>&copy; 2024 DBS Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
