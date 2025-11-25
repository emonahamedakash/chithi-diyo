import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Send, CheckCircle2 } from 'lucide-react'

const SubmitMessage = () => {
    const [message, setMessage] = useState('')
    const [recipientId, setRecipientId] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!message.trim()) {
            setError('Please enter a message')
            return
        }

        if (!recipientId.trim()) {
            setError('Please enter a recipient ID')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // In a real app, you would make an API call here
            // await api.sendMessage({ message, recipientId })

            setIsSuccess(true)
            setMessage('')
            setRecipientId('')

            // Reset success state after 3 seconds
            setTimeout(() => setIsSuccess(false), 3000)
        } catch (err) {
            setError('Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Send Anonymous Message
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Send a message anonymously to anyone. They'll never know it's from you.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {isSuccess && (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    Message sent successfully!
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">
                                    Recipient ID
                                </Label>
                                <Input
                                    id="recipient"
                                    type="text"
                                    placeholder="Enter recipient's unique ID"
                                    value={recipientId}
                                    onChange={(e) => setRecipientId(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                                    Your Message
                                </Label>
                                <Textarea
                                    id="message"
                                    placeholder="Type your anonymous message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={isSubmitting}
                                    rows={5}
                                    className="resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || !message.trim() || !recipientId.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Anonymously
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-xs text-gray-500 text-center">
                            <p>Your identity will remain completely hidden from the recipient.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SubmitMessage