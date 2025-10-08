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

    const [currentBg, setCurrentBg] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [formErrors, setFormErrors] = useState('')

    useEffect(() => {
        setIsVisible(true)

        const bgInterval = setInterval(() => {
            setCurrentBg(prev => prev === 0 ? 1 : 0)
        }, 8000)

        return () => clearInterval(bgInterval)
    }, [])

    const handleReserveClick = () => {
        setShowModal(true)
        setFormErrors('')
    }

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
            const handler = window.PaystackPop.setup({
                key: 'pk_test_your_public_key_here',
                email: email,
                amount: 25000 * 100,
                currency: 'NGN',
                ref: 'CBQ_' + Math.floor((Math.random() * 1000000000) + 1),
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Event",
                            variable_name: "event",
                            value: "Cocktail & BBQ Party"
                        },
                        {
                            display_name: "Ticket Type",
                            variable_name: "ticket_type",
                            value: "General Admission"
                        }
                    ]
                },
                callback: function (response: any) {
                    setIsProcessing(false)
                    setShowModal(false)
                    setEmail('')
                    alert('Payment successful! Your tickets have been reserved. Check your email for confirmation.')
                    console.log('Payment response:', response)
                },
                onClose: function () {
                    setIsProcessing(false)
                    alert('Payment was not completed. Please try again.')
                }
            })

            handler.openIframe()
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


    useEffect(() => {
        setIsVisible(true)
        const bgInterval = setInterval(() => {
            setCurrentBg((prev: any) => prev === a1 ? a2 : a1)
        }, 8000)

        return () => clearInterval(bgInterval)
    }, [])


    return (
        <div
            className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center overflow-hidden transition-all duration-1000 pt-10"
            style={{ backgroundImage: `url(${currentBg})` }}
        >

            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-orange-600/20 mix-blend-multiply"></div>


            <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-float"></div>
            <div className="absolute top-20 right-20 w-6 h-6 bg-orange-500 rounded-full opacity-40 animate-float-delayed"></div>
            <div className="absolute bottom-20 left-20 w-3 h-3 bg-red-400 rounded-full opacity-50 animate-float-slow"></div>

            <div className="absolute top-1/4 right-1/4 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 left-1/4 w-16 h-16 border-2 border-orange-400/30 rounded-full animate-ping-slow"></div>

            <div className={`relative z-10 max-w-4xl mx-4 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                <div className="mb-6">
                    <h1 className="text-5xl md:text-7xl font-black text-center mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl animate-gradient-x">
                        Cocktail & BBQ
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-2"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
                </div>

                <p className="text-xl md:text-2xl text-center mb-8 text-white/90 font-light drop-shadow-2xl leading-relaxed max-w-2xl mx-auto">
                    Join us for an <span className="font-bold text-yellow-300">unforgettable evening</span> of crafted cocktails, sizzling BBQ, and vibrant vibes under the stars!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        <div className="text-yellow-300 text-2xl mb-2">📅</div>
                        <h3 className="text-white font-semibold text-lg mb-2">Date & Time</h3>
                        <p className="text-white/80">December 15, 2024</p>
                        <p className="text-white/60 text-sm">7:00 PM - Midnight</p>

                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        <div className="text-orange-400 text-2xl mb-2">📍</div>
                        <h3 className="text-white font-semibold text-lg mb-2">Location</h3>
                        <p className="text-white/80">Central Park, NYC</p>
                        <p className="text-white/60 text-sm">The Great Lawn</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-2xl mx-auto">
                    {['🍹 Craft Cocktails', '🔥 Gourmet BBQ', '🎵 Live Music', '✨ Fire Show'].map((feature, index) => (
                        <span
                            key={feature}
                            className="bg-white/10 backdrop-blur-md text-white/90 px-4 py-2 rounded-full border border-white/20 text-sm font-medium hover:bg-white/20 transition-all duration-300 hover:scale-110"
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            {feature}
                        </span>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-md mx-auto">
                        <div className="text-center mb-4">
                            <span className="text-3xl font-bold text-yellow-300">₦25,000</span>
                            <span className="text-white/60 ml-2">per ticket</span>
                        </div>
                        <p className="text-white/80 text-sm">Includes unlimited cocktails, gourmet BBQ buffet, and live entertainment</p>
                    </div>



                    <button
                        onClick={handleReserveClick}
                        className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-lg px-12 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:rotate-1 animate-pulse-slow border-2 border-yellow-300/50 cursor-pointer"
                    >
                        🎟️ Reserve Your Spot
                    </button>
                </div>

                <div className="mt-12 bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-md mx-auto">
                    <p className="text-white/70 text-sm mb-3">Event starts in</p>
                    <div className="flex justify-center gap-3 text-white font-mono">
                        <div className="text-center">
                            <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-2">45</div>
                            <div className="text-xs mt-1 text-white/60">DAYS</div>
                        </div>
                        <div className="text-2xl font-bold text-orange-400">:</div>
                        <div className="text-center">
                            <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-2">12</div>
                            <div className="text-xs mt-1 text-white/60">HOURS</div>
                        </div>
                        <div className="text-2xl font-bold text-orange-400">:</div>
                        <div className="text-center">
                            <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-2">30</div>
                            <div className="text-xs mt-1 text-white/60">MINS</div>
                        </div>
                    </div>
                    <div className="mt-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-md mx-auto text-center hover:bg-white/15 transition-all duration-300">
                        <h3 className="text-yellow-300 font-bold text-lg mb-3">📞 For More Information</h3>
                        <p className="text-white/80 text-sm mb-1">
                            WhatsApp: <a href="https://wa.me/2349073777670" className="text-yellow-300 hover:underline">09073777670</a>
                        </p>
                        <p className="text-white/80 text-sm">
                            Call: <a href="tel:09066653812" className="text-yellow-300 hover:underline">09066653812</a>
                        </p>
                    </div>

                </div>
            </div>


            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".25"
                        className="fill-current text-black/20"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".5"
                        className="fill-current text-black/30"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        className="fill-current text-black/40"></path>
                </svg>
            </div>


            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in">

                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-2xl p-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900">Reserve Your Spot</h2>
                            <p className="text-gray-800 font-semibold mt-2">₦25,000 per ticket</p>
                        </div>


                        <div className="p-6">
                            <form onSubmit={handlePayment}>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email to continue"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        disabled={isProcessing}
                                    />
                                    {formErrors && (
                                        <p className="text-red-500 text-sm mt-2">{formErrors}</p>
                                    )}
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-2">What's included:</h3>
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
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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