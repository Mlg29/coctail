import React, { useEffect, useState } from 'react'
import a1 from '../assets/a1.jpeg'
import a2 from '../assets/a2.jpeg'



declare global {
    interface Window {
        PaystackPop: {
            setup(options: any): { openIframe(): void }
        }
    }
}

function Landing() {
    const [currentBg, setCurrentBg] = useState(a1)
    const [isVisible, setIsVisible] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [formErrors, setFormErrors] = useState('')

    useEffect(() => {
        setIsVisible(true)
        const bgInterval = setInterval(() => {
            setCurrentBg((prev: any) => (prev === a1 ? a2 : a1))
        }, 8000)
        return () => clearInterval(bgInterval)
    }, [])

    const handleReserveClick = () => {
        setShowModal(true)
        setFormErrors('')
    }


    const payWithMonnify = () => {

        if (!(window as any).MonnifySDK) {
            alert("Monnify SDK not loaded yet. Please try again.");
            setIsProcessing(false);
            return;
        }

        (window as any).MonnifySDK.initialize({
            amount: 1000,
            currency: "NGN",
            reference: new String(new Date().getTime()),
            customerFullName: "Damilare Ogunnaike",
            customerEmail: "ogunnaike.damilare@gmail.com",
            apiKey: "MK_TEST_L6407XKCZN",
            contractCode: "4195335986",
            paymentDescription: "Lahray World",
            metadata: {
                name: "Damilare",
                age: 45,
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
            onComplete: (response: any) => {
                console.log("Payment completed ✅", response);
                alert("Payment Successful!");
                setIsProcessing(false);
            },
            onClose: (data: any) => {
                console.log("Payment closed ❌", data);
                setIsProcessing(false);
            },
        });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormErrors('')

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
            // const handler = window.PaystackPop.setup({
            //     key: 'pk_test_your_public_key_here',
            //     email: email,
            //     amount: 25000 * 100,
            //     currency: 'NGN',
            //     ref: 'CBQ_' + Math.floor(Math.random() * 1000000000 + 1),
            //     metadata: {
            //         custom_fields: [
            //             {
            //                 display_name: 'Event',
            //                 variable_name: 'event',
            //                 value: 'Cocktail & BBQ Party',
            //             },
            //             {
            //                 display_name: 'Ticket Type',
            //                 variable_name: 'ticket_type',
            //                 value: 'General Admission',
            //             },
            //         ],
            //     },
            //     callback: function (response: any) {
            //         setIsProcessing(false)
            //         setShowModal(false)
            //         setEmail('')
            //         alert(
            //             'Payment successful! Your tickets have been reserved. Check your email for confirmation.'
            //         )
            //         console.log('Payment response:', response)
            //     },
            //     onClose: function () {
            //         setIsProcessing(false)
            //         alert('Payment was not completed. Please try again.')
            //     },
            // })
            // handler.openIframe()
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
        <div
            className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center overflow-hidden transition-all duration-1000 pt-10"
            style={{
                backgroundImage: `url(${currentBg})`,
                filter: 'brightness(1.25) contrast(1.05)',
            }}
        >

            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-yellow-100/40 to-orange-200/30 mix-blend-screen"></div>


            <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-6 h-6 bg-orange-400 rounded-full opacity-50 animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-ping"></div>


            <div
                className={`relative z-10 max-w-4xl mx-4 text-center transition-all duration-1000 transform ${isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                    }`}
            >
                <div className="mb-6">
                    <h1 className="text-5xl md:text-7xl font-black text-center mb-4 text-black bg-clip-text  drop-shadow-xl animate-gradient-x">
                        Unlimited cocktail & BBQ party
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-2"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
                </div>

                <p className="text-xl md:text-2xl text-center mb-8 text-gray-900 font-medium drop-shadow-md leading-relaxed max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-4 rounded-2xl">
                    Join us for an{' '}
                    <span className="font-bold text-orange-600">
                        unforgettable evening
                    </span>{' '}
                    of crafted cocktails, sizzling BBQ, and vibrant vibes under the
                    stars!
                </p>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/40 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        <div className="text-yellow-600 text-2xl mb-2">📅</div>
                        <h3 className="text-gray-800 font-semibold text-lg mb-2">
                            Date & Time
                        </h3>
                        <p className="text-gray-700">December 15, 2024</p>
                        <p className="text-gray-600 text-sm">7:00 PM - Midnight</p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/40 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        <div className="text-orange-500 text-2xl mb-2">📍</div>
                        <h3 className="text-gray-800 font-semibold text-lg mb-2">
                            Location
                        </h3>
                        <p className="text-gray-700">Central Park, NYC</p>
                        <p className="text-gray-600 text-sm">The Great Lawn</p>
                    </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-2xl mx-auto">
                    {['🍹 Craft Cocktails', '🔥 Gourmet BBQ', '🎵 Live Music', '✨ Fire Show'].map(
                        (feature, index) => (
                            <span
                                key={feature}
                                className="bg-white/60 backdrop-blur-md text-gray-900 px-4 py-2 rounded-full border border-white/40 text-sm font-medium hover:bg-white/80 transition-all duration-300 hover:scale-110"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                {feature}
                            </span>
                        )
                    )}
                </div>

                {/* Ticket Price */}
                <div className="space-y-4">
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 max-w-md mx-auto">
                        <div className="text-center mb-4">
                            <span className="text-3xl font-bold text-orange-600">₦25,000</span>
                            <span className="text-gray-700 ml-2">per ticket</span>
                        </div>
                        <p className="text-gray-700 text-sm">
                            Includes unlimited cocktails, gourmet BBQ buffet, and live
                            entertainment
                        </p>
                    </div>

                    <button
                        onClick={handleReserveClick}
                        className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300/50 cursor-pointer"
                    >
                        🎟️ Reserve Your Spot
                    </button>
                </div>

                {/* Countdown + Contact */}
                <div className="mt-12 bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 max-w-md mx-auto">
                    <p className="text-gray-700 text-sm mb-3">Event starts in</p>
                    <div className="flex justify-center gap-3 text-gray-800 font-mono">
                        <div className="text-center">
                            <div className="text-2xl font-bold bg-white/90 rounded-lg px-3 py-2">
                                45
                            </div>
                            <div className="text-xs mt-1 text-gray-600">DAYS</div>
                        </div>
                        <div className="text-2xl font-bold text-orange-500">:</div>
                        <div className="text-center">
                            <div className="text-2xl font-bold bg-white/90 rounded-lg px-3 py-2">
                                12
                            </div>
                            <div className="text-xs mt-1 text-gray-600">HOURS</div>
                        </div>
                        <div className="text-2xl font-bold text-orange-500">:</div>
                        <div className="text-center">
                            <div className="text-2xl font-bold bg-white/90 rounded-lg px-3 py-2">
                                30
                            </div>
                            <div className="text-xs mt-1 text-gray-600">MINS</div>
                        </div>
                    </div>
                    <div className="mt-10 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 text-center hover:bg-white/90 transition-all duration-300">
                        <h3 className="text-orange-600 font-bold text-lg mb-3">
                            📞 For More Information
                        </h3>
                        <p className="text-gray-700 text-sm mb-1">
                            WhatsApp:{' '}
                            <a
                                href="https://wa.me/2349073777670"
                                className="text-orange-500 hover:underline"
                            >
                                09073777670
                            </a>
                        </p>
                        <p className="text-gray-700 text-sm">
                            Call:{' '}
                            <a
                                href="tel:09066653812"
                                className="text-orange-500 hover:underline"
                            >
                                09066653812
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="w-full h-16"
                >
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".3"
                        className="fill-orange-300"
                    ></path>
                </svg>
            </div>

            {/* Payment Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-2xl p-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Reserve Your Spot
                            </h2>
                            <p className="text-gray-800 font-semibold mt-2">
                                ₦25,000 per ticket
                            </p>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handlePayment}>
                                <div className="mb-6">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Enter your email to continue"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        disabled={isProcessing}
                                    />
                                    {formErrors && (
                                        <p className="text-red-500 text-sm mt-2">{formErrors}</p>
                                    )}
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        What's included:
                                    </h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>✅ Unlimited craft cocktails</li>
                                        <li>✅ Gourmet BBQ buffet</li>
                                        <li>✅ Live music performance</li>
                                        <li>✅ Fire show entertainment</li>
                                        <li>✅ Commemorative glass</li>
                                    </ul>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isProcessing}
                                        className="flex-1 px-4 cursor-pointer py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="flex-1 cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
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
                                <p className="text-xs text-gray-500">
                                    🔒 Secure payment powered by Paystack
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Landing
