import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../lib/contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const loginSchema = z.object({
  userType: z.enum(['alumni', 'student', 'admin'], {
    required_error: 'Please select your user type',
  }),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isAdmin: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Attempting login with:', { email: data.email, userType: data.userType });
      await login(data.email, data.password);
      const welcomeMessage = data.userType === 'alumni' ? 'Welcome back, Alumni!' : 
                            data.userType === 'admin' ? 'Welcome back, Admin!' : 
                            'Welcome back, Student!';
      toast.success(welcomeMessage);
      // Redirect admin users to admin dashboard
      const redirectPath = data.userType === 'admin' ? '/admin-dashboard' : from;
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Sign in to your Alumni Connect account</p>
        </div>

        <Card>
          <Card.Content className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register('userType')}
                    id="userType"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                  >
                    <option value="">Select your status</option>
                    <option value="alumni">Alumni (Graduated)</option>
                    <option value="student">Current Student</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.userType && (
                  <p className="mt-2 text-sm text-red-600">{errors.userType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full py-3 text-base font-semibold"
              >
                Sign in
              </Button>
            </form>
          </Card.Content>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Join now
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <Card.Content className="p-6">
            <h3 className="text-sm font-medium text-blue-800 mb-3">Demo Credentials</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div>
                <strong>Admin:</strong> admin@university.edu / admin123
              </div>
              <div>
                <strong>Alumni:</strong> alumni.test@university.edu / alumni123
              </div>
              <div>
                <strong>Student:</strong> user1@university.edu / user123
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-600">
              💡 Select "Alumni" or "Student" from the dropdown above, then use the corresponding credentials
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Login;