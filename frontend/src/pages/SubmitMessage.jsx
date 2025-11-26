import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Send, CheckCircle2, ArrowRight } from 'lucide-react'
import axios from 'axios'
import { baseUrl } from '../../baseUrl'
import { useNavigate } from 'react-router-dom'

const SubmitMessage = () => {
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const currentUrl = window.location.href;

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!message.trim()) {
            setError('Please enter a message')
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
            }
            setMessage('')
        } catch (err) {
            setError(err.response.data.message || 'Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md mx-auto">
                    <Card className="shadow-lg border-0">
                        <CardContent className="p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="rounded-full bg-green-100 p-3">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Message Sent!
                            </h2>

                            <p className="text-gray-600 mb-6">
                                Your anonymous message has been delivered successfully.
                            </p>

                            <div className="space-y-4">
                                <Button
                                    onClick={() => setIsSuccess(false)}
                                    variant="outline"
                                    className="w-full border-gray-300 hover:bg-gray-50"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Another Message
                                </Button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or</span>
                                    </div>
                                </div>

                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Create Your Own Link
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Get your personalized chithi.diyo link to receive anonymous messages
                                    </p>
                                </div>

                                <Button
                                    onClick={() => navigate("/login")}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md mx-auto">
                <Card className="shadow-lg border-0">
                    <CardHeader className="text-center pb-4 px-6 pt-6">
                        <CardTitle className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Send Anonymous Message
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base sm:text-lg">
                            Share your thoughts anonymously. They'll never know it's from you.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 px-6 pb-6">
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="message" className="text-sm font-medium text-gray-700 sm:text-base">
                                    Your Message
                                </Label>
                                <Textarea
                                    id="message"
                                    placeholder="What's on your mind? Share it anonymously..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={isSubmitting}
                                    rows={5}
                                    className="resize-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] sm:min-h-[140px] text-sm sm:text-base"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || !message.trim()}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed h-11 text-base font-medium sm:h-12 sm:text-lg"
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

                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 sm:text-base">
                                Your identity is protected and completely anonymous
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SubmitMessage