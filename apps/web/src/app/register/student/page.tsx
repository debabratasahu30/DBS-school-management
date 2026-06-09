'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, Phone, Home, Calendar, Users, UserCheck } from 'lucide-react';

export default function StudentRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    admissionNo: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    parentEmail: '',
    parentPhone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/auth/register', {
        ...formData,
        role: 'STUDENT',
        schoolId: 'school_001', // This should be dynamic in a real app
      });
      
      if (response.success) {
        router.push('/login?message=Registration successful! Please login.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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

      <div className="relative z-10 w-full max-w-3xl">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#312C51] to-[#48426D] rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#312C51] to-[#48426D] bg-clip-text text-transparent">
            Student Registration
          </h1>
          <p className="text-[#6B7280] mt-2">Join DBS Academy and start your educational journey</p>
        </div>

        {/* Registration Card */}
        <Card className="backdrop-blur-lg bg-[#FFFFFF]/90 border-[#E5E7EB] shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-[#1F2937]">Create Your Student Account</CardTitle>
            <CardDescription className="text-center text-[#6B7280]">
              Fill in your information to get started with your academic journey
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
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#1F2937] flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-[#1F2937]">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-[#1F2937]">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#1F2937] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admissionNo" className="text-sm font-medium text-[#1F2937]">Admission Number</Label>
                    <Input
                      id="admissionNo"
                      name="admissionNo"
                      type="text"
                      placeholder="ADM2024001"
                      value={formData.admissionNo}
                      onChange={handleChange}
                      className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium text-[#1F2937]">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-[#1F2937]">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full h-11 px-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#1F2937] flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#1F2937]">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-[#1F2937]">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1-555-0123"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Main St, City"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              {/* Parent Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#1F2937] flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Parent/Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail" className="text-sm font-medium text-[#1F2937]">Parent Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="parentEmail"
                        name="parentEmail"
                        type="email"
                        placeholder="parent@example.com"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone" className="text-sm font-medium text-[#1F2937]">Parent Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="parentPhone"
                        name="parentPhone"
                        type="tel"
                        placeholder="+1-555-0123"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#1F2937] flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-[#1F2937]">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#1F2937]">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-medium rounded-lg shadow-lg transform hover:scale-[1.02] transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  'Create Student Account'
                )}
              </Button>
            </form>
            
            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
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
