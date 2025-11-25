import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaLink,
    FaCopy,
    FaTrash,
    FaEye,
    FaPlus,
    FaQrcode,
    FaChartBar,
    FaCalendar,
    FaSort,
    FaSearch,
    FaFilter,
    FaExternalLinkAlt
} from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import Layout from '../components/layouts/Layout';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const LinkList = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const { userId } = useContext(AuthContext);

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);

    // Form state
    const [newLink, setNewLink] = useState({
        title: '',
        url: ''
    });

    // Filter and search
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/link/fetch-link-list?user_id=${userId}`);
            console.log("Links response: ", response);

            if (response.data.success) {
                setLinks(response.data.list || []);
            } else {
                console.log('No links found or API error');
                setLinks([]);
            }
        } catch (err) {
            console.log(err);
            toast.error('Failed to fetch links');
            setLinks([]);
        } finally {
            setLoading(false);
        }
    };

    const createLink = async () => {
        try {
            if (!newLink.title.trim() || !newLink.url.trim()) {
                toast.error('Please fill in all fields');
                return;
            }

            const response = await axios.post(`${baseUrl}/links/create`, {
                user_id: userId,
                title: newLink.title,
                url: newLink.url
            });

            if (response.data.success) {
                toast.success('Link created successfully!');
                setNewLink({ title: '', url: '' });
                setIsCreateDialogOpen(false);
                fetchLinks(); // Refresh the list
            }
        } catch (error) {
            console.error('Error creating link:', error);
            toast.error('Failed to create link');
        }
    };

    const deleteLink = async (linkId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this link?")) {
            try {
                await axios.delete(`${baseUrl}/links/delete/${linkId}`);
                toast.success('Link deleted successfully');
                setLinks(prev => prev.filter(link => link.id !== linkId));
            } catch (error) {
                console.error('Error deleting link:', error);
                toast.error('Failed to delete link');
            }
        }
    };

    const copyLink = (url, e) => {
        if (e) e.stopPropagation();
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const copyQRCode = (url, e) => {
        if (e) e.stopPropagation();
        // In a real app, you would generate and copy QR code image
        toast.info('QR code copy functionality would be implemented here');
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatFullDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Filter and sort links
    const filteredAndSortedLinks = links
        .filter(link =>
            link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.url.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'created_at') {
                aValue = new Date(aValue * 1000);
                bValue = new Date(bValue * 1000);
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : 1;
            } else {
                return aValue > bValue ? -1 : 1;
            }
        });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const openStats = (link, e) => {
        e.stopPropagation();
        setSelectedLink(link);
        setIsStatsDialogOpen(true);
    };

    const openQRCode = (link, e) => {
        e.stopPropagation();
        setSelectedLink(link);
        setIsQRDialogOpen(true);
    };

    const visitLink = (url, e) => {
        e.stopPropagation();
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                    Your Links
                                </h1>
                                <p className="text-gray-600 max-w-2xl">
                                    Manage all your ChithiDiyo links in one place. Track clicks, generate QR codes, and share with ease.
                                </p>
                            </div>
                            {/* <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                                >
                                    <FaPlus className="h-4 w-4" />
                                    Create New Link
                                </motion.button> */}
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search links by title or URL..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-300"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleSort('created_at')}
                                        className="flex items-center gap-2"
                                    >
                                        <FaSort className="h-4 w-4" />
                                        {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        Date
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleSort('title')}
                                        className="flex items-center gap-2"
                                    >
                                        <FaSort className="h-4 w-4" />
                                        {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        Title
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl shadow-md p-6 h-48 animate-pulse"
                                >
                                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                        <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <AnimatePresence>
                                {filteredAndSortedLinks.length > 0 ? (
                                    filteredAndSortedLinks.map((link, index) => (
                                        <motion.div
                                            key={link.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            whileHover={{
                                                scale: 1.02,
                                                y: -4,
                                                transition: { duration: 0.2 }
                                            }}
                                            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="p-6">
                                                {/* Link Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <FiLink className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800 truncate max-w-[200px]">
                                                                {link.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                                <FaCalendar className="h-3 w-3" />
                                                                {formatDate(link.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* URL Preview */}
                                                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <p className="text-sm text-gray-600 truncate font-mono" title={link.url}>
                                                        {link.url}
                                                    </p>
                                                </div>

                                                {/* Stats Preview */}
                                                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <FaEye className="h-4 w-4" />
                                                            {link.click_count || 0} clicks
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <FaChartBar className="h-4 w-4" />
                                                            {link.message_count || 0} messages
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => copyLink(link.url, e)}
                                                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                                        title="Copy link"
                                                    >
                                                        <FaCopy className="h-3 w-3" />
                                                        Copy
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => openStats(link, e)}
                                                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                                        title="View statistics"
                                                    >
                                                        <FaChartBar className="h-3 w-3" />
                                                        Stats
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => openQRCode(link, e)}
                                                        className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-600 py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                                        title="Generate QR code"
                                                    >
                                                        <FaQrcode className="h-3 w-3" />
                                                        QR
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => deleteLink(link.id, e)}
                                                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                                        title="Delete link"
                                                    >
                                                        <FaTrash className="h-3 w-3" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="col-span-full bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100"
                                    >
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <FaLink className="h-10 w-10 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                            No links created yet
                                        </h3>
                                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                                            Create your first ChithiDiyo link to start receiving anonymous messages from your friends and followers.
                                        </p>
                                        <Button
                                            onClick={() => setIsCreateDialogOpen(true)}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                                        >
                                            <FaPlus className="mr-2 h-4 w-4" />
                                            Create Your First Link
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </motion.div>

                {/* Create Link Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FaPlus className="h-5 w-5 text-blue-600" />
                                Create New Link
                            </DialogTitle>
                            <DialogDescription>
                                Create a new ChithiDiyo link to receive anonymous messages
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Link Title
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g., My Birthday Wishes"
                                    value={newLink.title}
                                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Destination URL (Optional)
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={newLink.url}
                                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Where people will be redirected after sending a message
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={createLink}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Create Link
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Statistics Dialog */}
                <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FaChartBar className="h-5 w-5 text-green-600" />
                                Link Statistics
                            </DialogTitle>
                        </DialogHeader>

                        {selectedLink && (
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-2">{selectedLink.title}</h4>
                                    <p className="text-sm text-gray-600 truncate">{selectedLink.url}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                                        <FaEye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-800">{selectedLink.click_count || 0}</p>
                                        <p className="text-sm text-gray-600">Total Clicks</p>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg text-center">
                                        <FiLink className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-800">{selectedLink.message_count || 0}</p>
                                        <p className="text-sm text-gray-600">Messages</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600">
                                    <p><strong>Created:</strong> {formatFullDate(selectedLink.created_at)}</p>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsStatsDialogOpen(false)}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={(e) => copyLink(selectedLink.url, e)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <FaCopy className="mr-2 h-4 w-4" />
                                        Copy Link
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* QR Code Dialog */}
                <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FaQrcode className="h-5 w-5 text-purple-600" />
                                QR Code
                            </DialogTitle>
                        </DialogHeader>

                        {selectedLink && (
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                                    {/* QR Code Placeholder */}
                                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <FaQrcode className="h-16 w-16 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Scan this QR code to visit your link
                                    </p>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-700 mb-2">{selectedLink.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{selectedLink.url}</p>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsQRDialogOpen(false)}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={(e) => copyQRCode(selectedLink.url, e)}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        <FaCopy className="mr-2 h-4 w-4" />
                                        Copy QR Code
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}

export default LinkList;