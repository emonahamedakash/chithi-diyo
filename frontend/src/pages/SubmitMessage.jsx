import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
    Send,
    CheckCircle2,
    ArrowRight,
    Shield,
    User,
    Sparkles,
    MessageSquare,
    AlertCircle
} from 'lucide-react'
import axios from 'axios'
import { baseUrl } from '../../baseUrl'
import { frontEndUrl } from '../../frontEndUrl'
import { useNavigate } from 'react-router-dom'

const SubmitMessage = () => {
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')
    const [userInfo, setUserInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [charCount, setCharCount] = useState(0)
    const navigate = useNavigate()

    const currentUrl = window.location.href
    const MAX_CHARS = 500

    useEffect(() => {
        getUserInfo()
    }, [])

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`${baseUrl}/public/fetch-user-info`, {
                params: { msg_url: currentUrl }
            })

            if (response.data.success) {
                setUserInfo(response.data.details)
            }
        } catch (err) {
            console.error("Fetch failed:", err.message)
            setError('Failed to load user information')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!message.trim()) {
            setError('Please enter a message')
            return
        }

        if (message.length > MAX_CHARS) {
            setError(`Message must be less than ${MAX_CHARS} characters`)
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const response = await axios.post(`${baseUrl}/public/create-new-message`, {
                message_link: currentUrl,
                message_text: message,
                created_at: Math.floor(Date.now() / 1000),
            })

            if (response.data.success) {
                setIsSuccess(true)
                setMessage('')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleMessageChange = (e) => {
        const value = e.target.value
        if (value.length <= MAX_CHARS) {
            setMessage(value)
            setCharCount(value.length)
        }
    }

    if (isSuccess) {
        return (
            <SuccessScreen
                onSendAnother={() => setIsSuccess(false)}
                onCreateLink={() => navigate("/login")}
                userName={userInfo?.user_name}
            />
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg mx-auto">
                <Card className="shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 w-full" />

                    <CardHeader className="text-center pb-2 px-6 ">
                        <div className="flex flex-col items-center justify-center">
                            {/* Profile Picture Section - Centered with Increased Size */}
                            <div>
                                {isLoading ? (
                                    <Skeleton className="h-24 w-24 rounded-full" />
                                ) : userInfo ? (
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                        <AvatarImage
                                            src={`${frontEndUrl}/images/profile/${userInfo.profile_picture}`}
                                            alt={userInfo.user_name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gradient-to-r from-indigo-100 to-purple-100">
                                            <User className="h-12 w-12 text-indigo-600" />
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                                        <User className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
                            Chithi Diyo
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 px-6">
                        {/* User Info Section */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                            {isLoading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-40 mx-auto" />
                                    <Skeleton className="h-4 w-32 mx-auto" />
                                    <Skeleton className="h-3 w-48 mx-auto" />
                                </div>
                            ) : userInfo ? (
                                <div className="space-y-3">
                                    <div className="flex flex-col items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            Sending to {userInfo.user_name}
                                        </h3>
                                        <Badge variant="outline" className="text-xs">
                                            <Shield className="h-3 w-3 mr-1" />
                                            Anonymous
                                        </Badge>
                                    </div>

                                    {userInfo.short_bio && (
                                        <p className="text-sm text-gray-600">
                                            {userInfo.short_bio}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-2">
                                    <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-500">User information unavailable</span>
                                </div>
                            )}
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Message Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Your Anonymous Message
                                    </Label>
                                    <span className={`text-xs ${charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {charCount}/{MAX_CHARS}
                                    </span>
                                </div>

                                <Textarea
                                    id="message"
                                    placeholder="What's on your mind? Share your thoughts anonymously..."
                                    value={message}
                                    onChange={handleMessageChange}
                                    disabled={isSubmitting || isLoading}
                                    rows={5}
                                    className="resize-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 min-h-[140px] text-base transition-all duration-200"
                                />

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Shield className="h-3 w-3" />
                                    <span>Your identity will remain completely hidden</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || !message.trim() || isLoading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed h-11 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                                        Sending...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Anonymously
                                    </div>
                                )}
                            </Button>
                        </form>

                        {/* Security Assurance */}
                        <div className="border-t border-gray-200 pt-5">
                            <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-500" />
                                    <span>100% Anonymous</span>
                                </div>
                                <div className="h-4 w-px bg-gray-300" />
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                    <span>No Registration Required</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA for creating own link */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Sparkles className="h-5 w-5 text-indigo-500" />
                                <h4 className="font-semibold text-gray-900">Create Your Own Link</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                Want to receive anonymous messages? Create your personalized chithi.diyo link.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/login")}
                                className="w-full border-indigo-200 hover:bg-indigo-50"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const SuccessScreen = ({ onSendAnother, onCreateLink, userName }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md mx-auto">
                <Card className="shadow-2xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 w-full" />

                    <CardContent className="p-8 text-center">
                        {/* Logo in Success Screen - Centered and Reduced Size */}
                        <div className="flex justify-center mb-4">
                            <img
                                src="/assets/images/logo/logo.png"
                                alt="logo"
                                className='w-[80px] object-contain'
                            />
                        </div>

                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 animate-ping bg-green-200 rounded-full" />
                                <div className="rounded-full bg-green-100 p-4 relative">
                                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Message Delivered!
                        </h2>

                        <p className="text-gray-600 mb-6 text-sm md:text-base">
                            Your anonymous message has been successfully sent to {userName || 'the recipient'}.
                        </p>

                        <div className="space-y-4">
                            <Button
                                onClick={onSendAnother}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send Another Message
                            </Button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-3 bg-white text-gray-500">Want your own messages?</span>
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full mb-3">
                                    <Sparkles className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium text-blue-700">Try it yourself</span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Create Your Anonymous Inbox
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Get your personalized chithi.diyo link and start receiving anonymous messages
                                </p>
                            </div>

                            <Button
                                onClick={onCreateLink}
                                variant="outline"
                                className="w-full border-gray-300 hover:bg-gray-50"
                            >
                                Create Your Link
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SubmitMessage