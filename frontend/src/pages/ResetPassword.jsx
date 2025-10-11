import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Validate token when component mounts
        const validateToken = async () => {
            if (!token) {
                setError('Invalid reset link');
                setValidating(false);
                return;
            }

            try {
                const response = await axios.post(`${baseUrl}/user/forgot-password`, {
                    token,
                    action: 'validate_token'
                });

                if (response.data.success) {
                    setEmail(response.data.email);
                    setValidating(false);
                } else {
                    setError('Invalid or expired reset link');
                    setValidating(false);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid or expired reset link');
                setValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}/user/forgot-password`, {
                token,
                newPassword,
                action: 'reset_password'
            });

            if (response.data.success) {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(response.data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Validating reset link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Reset password for {email}
                    </p>
                </div>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            required
                            className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                            Request new reset link
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;