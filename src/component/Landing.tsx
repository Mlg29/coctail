import React, { useEffect, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../App'

declare global {
    interface Window {
        PaystackPop: {
            setup(options: any): { openIframe(): void }
        }
    }
}

interface PaymentData {
    name: string;
    email: string;
    transactionRef: string;
    amount: number;
    date: Date;
    status: string;
}

function Landing() {
    const [isVisible, setIsVisible] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState<any>('')
    const [email, setEmail] = useState<any>('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [formErrors, setFormErrors] = useState('')

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleReserveClick = () => {
        setShowModal(true)
        setFormErrors('')
    }

    const savePaymentToFirebase = async (paymentData: PaymentData) => {
        try {
            const docRef = await addDoc(collection(db, 'payments'), {
                ...paymentData,
                timestamp: serverTimestamp(),
                createdAt: new Date().toISOString()
            });
            alert("Payment Successful! Your tickets have been reserved. Check your email for confirmation.");

            setIsProcessing(false);
            setShowModal(false);
            setEmail('');
            setName('');
            return docRef.id;
        } catch (error) {
            console.error('Error saving payment data: ', error);
            throw error;
        }
        finally {
            setIsProcessing(false)
        }
    }

    const payWithMonnify = () => {
        if (!(window as any).MonnifySDK) {
            alert("Monnify SDK not loaded yet. Please try again.");
            setIsProcessing(false);
            return;
        }

        const transactionRef = `LAHRAY_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;
        const amount = 25000;

        (window as any).MonnifySDK.initialize({
            amount: amount,
            currency: "NGN",
            reference: transactionRef,
            customerFullName: name || "Guest Customer",
            customerEmail: email,
            customerMobileNumber: "08000000000",
            apiKey: "MK_TEST_L6407XKCZN",
            contractCode: "4195335986",
            paymentDescription: "Lahray World - Cocktail & BBQ Party",
            metadata: {
                event: "Unlimited Cocktail & BBQ Party",
                ticket_type: "General Admission",
                customer_name: name,
            },
            incomeSplitConfig: [
                {
                    subAccountCode: "MFY_SUB_342113621921",
                    feePercentage: 50,
                    splitAmount: 1900,
                    feeBearer: true,
                },
                {
                    subAccountCode: "MFY_SUB_342113621922",
                    feePercentage: 50,
                    splitAmount: 2100,
                    feeBearer: true,
                },
            ],
            onLoadStart: () => console.log("Loading Monnify SDK..."),
            onLoadComplete: () => console.log("Monnify SDK Ready ✅"),
            onComplete: async (response: any) => {
                const paymentData: PaymentData = {
                    name: name || "Guest Customer",
                    email: email,
                    transactionRef: transactionRef,
                    amount: amount,
                    date: new Date(),
                    status: 'success'
                };

                try {
                    await savePaymentToFirebase(paymentData);
                } catch (error) {
                    console.error('Error saving payment data:', error);
                    alert("Payment was successful but there was an issue saving your details. Please contact support with your transaction reference.");
                    setIsProcessing(false);
                }
            },
            onClose: (data: any) => {
                console.log("Payment closed ❌", data);

                if (data && data.transactionReference) {
                    const paymentData: PaymentData = {
                        name: name || "Guest Customer",
                        email: email,
                        transactionRef: data.transactionReference,
                        amount: amount,
                        date: new Date(),
                        status: 'cancelled'
                    };

                    savePaymentToFirebase(paymentData).catch(error => {
                        console.error('Error saving cancelled payment:', error);
                    });
                }

                setIsProcessing(false);
            },
        });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormErrors('')

        if (!name) {
            setFormErrors('Name is required')
            return
        }

        if (!email) {
            setFormErrors('Email is required')
            return
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setFormErrors('Please enter a valid email address')
            return
        }

        setIsProcessing(true)

        try {
            payWithMonnify()
        } catch (error) {
            console.error('Payment error:', error)
            setIsProcessing(false)
            setFormErrors('Payment initialization failed. Please try again.')
        }
    }

    const closeModal = () => {
        if (!isProcessing) {
            setShowModal(false)
            setEmail('')
            setFormErrors('')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${15 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 mb-6">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">Limited Tickets Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                        Unlimited
                        <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                            Cocktail & BBQ
                        </span>
                        Party
                    </h1>

                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-4"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
                    {/* Left Column - Event Details */}
                    <div className="space-y-8">
                        {/* Event Description */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                            <p className="text-xl text-white/90 leading-relaxed">
                                Join us for an{' '}
                                <span className="font-bold text-yellow-400">unforgettable evening</span>{' '}
                                of crafted cocktails, sizzling BBQ, and vibrant vibes under the stars!
                            </p>
                        </div>

                        {/* Info Cards */}
                        <div className="grid gap-6">
                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-2xl">📅</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">Date & Time</h3>
                                        <p className="text-white/80">December 15, 2024</p>
                                        <p className="text-white/60 text-sm">7:00 PM - Midnight</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-2xl">📍</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">Location</h3>
                                        <p className="text-white/80">Central Park, NYC</p>
                                        <p className="text-white/60 text-sm">The Great Lawn</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4 text-center">What's Included</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: '🍹', text: 'Craft Cocktails' },
                                    { icon: '🔥', text: 'Gourmet BBQ' },
                                    { icon: '🎵', text: 'Live Music' },
                                    { icon: '✨', text: 'Fire Show' }
                                ].map((feature, index) => (
                                    <div key={feature.text} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors duration-200">
                                        <span className="text-2xl">{feature.icon}</span>
                                        <span className="text-white/90 text-sm font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Ticket & CTA */}
                    <div className="space-y-8">
                        {/* Ticket Card */}
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-center relative overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full"></div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-black/20 rounded-full px-4 py-2 mb-6">
                                    <span className="text-black font-bold">🎟️ EARLY BIRD</span>
                                </div>

                                <div className="mb-6">
                                    <div className="text-5xl font-black text-black mb-2">₦25,000</div>
                                    <div className="text-black/80 font-medium">per ticket</div>
                                </div>

                                <ul className="space-y-3 mb-8 text-left">
                                    {[
                                        'Unlimited craft cocktails',
                                        'Gourmet BBQ buffet',
                                        'Live music performance',
                                        'Fire show entertainment',
                                        'Commemorative glass'
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3 text-black/90">
                                            <div className="w-5 h-5 bg-black/20 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={handleReserveClick}
                                    className="w-full bg-black text-white font-bold py-4 px-8 rounded-2xl hover:bg-gray-900 transform hover:scale-105 transition-all duration-300 border-2 border-black/20 cursor-pointer"
                                >
                                    Reserve Your Spot Now
                                </button>
                            </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-white font-bold text-center mb-4">Event Starts In</h3>
                            <div className="grid grid-cols-4 gap-3 text-center">
                                {[
                                    { value: '45', label: 'DAYS' },
                                    { value: '12', label: 'HOURS' },
                                    { value: '30', label: 'MINS' },
                                    { value: '15', label: 'SECS' }
                                ].map((item, index) => (
                                    <div key={item.label} className="bg-black/30 rounded-xl p-3">
                                        <div className="text-2xl font-bold text-white">{item.value}</div>
                                        <div className="text-white/60 text-xs font-medium">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                            <h3 className="text-white font-bold text-lg mb-4">📞 Need Help?</h3>
                            <div className="space-y-2">
                                <p className="text-white/80">
                                    WhatsApp:{' '}
                                    <a href="https://wa.me/2349073777670" className="text-yellow-400 hover:underline font-medium">
                                        09073777670
                                    </a>
                                </p>
                                <p className="text-white/80">
                                    Call:{' '}
                                    <a href="tel:09066653812" className="text-yellow-400 hover:underline font-medium">
                                        09066653812
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-white/10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-3xl p-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Reserve Your Spot
                            </h2>
                            <p className="text-gray-800 font-semibold mt-2">
                                ₦25,000 per ticket
                            </p>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handlePayment}>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-white mb-2">
                                            👤 Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                                            disabled={isProcessing}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            📧 Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                                            disabled={isProcessing}
                                        />
                                        {formErrors && (
                                            <p className="text-red-400 text-sm mt-2">{formErrors}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isProcessing}
                                        className="flex-1 px-4 cursor-pointer py-3 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/5 transition-all duration-200 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="flex-1 cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            'Proceed to Payment'
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-white/50">
                                    🔒 Secure payment powered by Monnify
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
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
                .animate-float {
                    animation: float 10s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default Landing