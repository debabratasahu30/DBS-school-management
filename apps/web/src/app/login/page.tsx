'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Users, BookOpen } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.success) {
        setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4] p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#312C51] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#48426D] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-[#F0C38E] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#312C51] to-[#48426D] rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#312C51] to-[#48426D] bg-clip-text text-transparent">
            DBS Academy
          </h1>
          <p className="text-[#6B7280] mt-2">Empowering Education Through Technology</p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-lg bg-[#FFFFFF]/90 border-[#E5E7EB] shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-[#1F2937]">Welcome Back</CardTitle>
            <CardDescription className="text-center text-[#6B7280]">
              Sign in to access your learning portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 text-sm text-[#F1AA9B] bg-[#F1AA9B]/10 border border-[#F1AA9B]/30 rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#1F2937]">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-[#E5E7EB] focus:border-[#312C51] focus:ring-[#312C51] rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#1F2937]">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-[#E5E7EB] focus:border-[#312C51] focus:ring-[#312C51] rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#6B7280] hover:text-[#1F2937]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded border-gray-300" />
                  <span className="text-[#6B7280]">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-[#312C51] hover:text-[#48426D] font-medium">
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-[#312C51] to-[#48426D] hover:from-[#48426D] hover:to-[#312C51] text-white font-medium rounded-lg shadow-lg transform hover:scale-[1.02] transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            
                        
            {/* Registration Links */}
            <div className="text-center pt-4 border-t border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280] mb-3">New to DBS Academy?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="/register/parent" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FAF8F4] to-[#F0C38E]/20 border border-[#E5E7EB] rounded-lg hover:from-[#F0C38E]/30 hover:to-[#FAF8F4] transition-colors text-sm font-medium text-[#1F2937]"
                >
                  <Users className="w-4 h-4" />
                  Parent Registration
                </a>
                <a 
                  href="/register/student" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FAF8F4] to-[#F0C38E]/20 border border-[#E5E7EB] rounded-lg hover:from-[#F0C38E]/30 hover:to-[#FAF8F4] transition-colors text-sm font-medium text-[#1F2937]"
                >
                  <BookOpen className="w-4 h-4" />
                  Student Registration
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[#6B7280]">
          <p>&copy; 2024 DBS Academy. All rights reserved.</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
