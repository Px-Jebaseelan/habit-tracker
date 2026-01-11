'use client';

import { Users, Target, Shield, Zap, Heart, Award, Mail, MapPin, Twitter } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Zenith Habitz</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto">
            Build Better Habits, Transform Your Life
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 space-y-24">
        {/* Mission Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-8 border border-indigo-500/30">
            <Target size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            At Zenith Habitz, we believe that small, consistent actions lead to extraordinary results.
            Our mission is to empower millions of people to build positive habits and achieve their goals
            through intelligent tracking, meaningful analytics, and community support.
          </p>
        </section>

        {/* Features Grid */}
        <section>
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Zenith Habitz?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap size={24} />, title: 'Smart Tracking', desc: 'Track unlimited habits with detailed analytics and insights.' },
              { icon: <Award size={24} />, title: 'Streak System', desc: 'Build momentum with visual streak tracking and milestones.' },
              { icon: <Users size={24} />, title: 'Community', desc: 'Connect with others, share progress, and stay motivated.' },
              { icon: <Shield size={24} />, title: 'Secure', desc: 'Your data is encrypted and protected with enterprise security.' },
              { icon: <Heart size={24} />, title: 'Wellness Focused', desc: 'Designed to improve your mental and physical well-being.' },
              { icon: <Target size={24} />, title: 'Goal Oriented', desc: 'Set clear targets and track your journey to success.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:border-violet-500/30 transition-all group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[3rem] p-8 md:p-16 border border-white/5">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Innovation', desc: 'Constantly improving our product with the latest technology.' },
              { title: 'Transparency', desc: 'Open and honest communication with our community.' },
              { title: 'Empowerment', desc: 'Giving users the tools to take control of their lives.' },
              { title: 'Community', desc: 'Building a supportive space where everyone succeeds.' }
            ].map((value, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-slate-400 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-8 bg-slate-800/30 rounded-3xl border border-white/5">
            {[
              { label: 'Active Users', value: '50K+' },
              { label: 'Habits Tracked', value: '2M+' },
              { label: 'Days Completed', value: '100M+' },
              { label: 'User Rating', value: '4.9★' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-4">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="pb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet the Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Alex Chen', role: 'Founder & CEO', avatar: '👨‍💼' },
              { name: 'Sarah Williams', role: 'CTO & Lead Engineer', avatar: '👩‍💻' },
              { name: 'Mike Rodriguez', role: 'Head of Design', avatar: '�‍🎨' },
              { name: 'Emma Johnson', role: 'Community Manager', avatar: '👩‍📊' }
            ].map((member, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4 transform hover:scale-110 transition-transform cursor-default">{member.avatar}</div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-slate-400 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="max-w-2xl mx-auto text-center bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
          <div className="grid gap-6">
            <a href="mailto:hello@zenithhabitz.com" className="flex items-center justify-center gap-3 text-slate-300 hover:text-white transition-colors p-4 rounded-xl hover:bg-white/5">
              <Mail size={20} />
              <span>hello@zenithhabitz.com</span>
            </a>
            <a href="https://twitter.com/zenithhabitz" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 text-slate-300 hover:text-white transition-colors p-4 rounded-xl hover:bg-white/5">
              <Twitter size={20} />
              <span>@zenithhabitz</span>
            </a>
            <div className="flex items-center justify-center gap-3 text-slate-300 p-4">
              <MapPin size={20} />
              <span>San Francisco, CA, USA</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
