import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = e => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error('Please fill in all fields');
            return;
        }
        setSending(true);
        // Simulate send
        setTimeout(() => {
            toast.success('Message sent! We\'ll get back to you soon.');
            setForm({ name: '', email: '', message: '' });
            setSending(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-base-200 px-4 py-16">

            {/* Hero header */}
            <div className="text-center mb-12">
                <div className="text-5xl mb-4">💬</div>
                <h1 className="text-4xl font-extrabold text-base-content mb-3">Contact Us</h1>
                <p className="text-base-content/50 max-w-md mx-auto">
                    Have questions, feedback, or need support? We'd love to hear from you.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

                {/* Info card */}
                <div className="flex flex-col gap-5">

                    <div className="card bg-base-100 border border-base-300 shadow-lg">
                        <div className="card-body">
                            <h3 className="text-xl font-bold mb-4 text-primary">Get in Touch</h3>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl shrink-0">
                                    📧
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-base-content/60 uppercase tracking-wide">Email</p>
                                    <p className="text-base-content font-medium">support@assetverse.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-xl shrink-0">
                                    📞
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-base-content/60 uppercase tracking-wide">Phone</p>
                                    <p className="text-base-content font-medium">+880 18XXXXXXXX</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-xl shrink-0">
                                    📍
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-base-content/60 uppercase tracking-wide">Address</p>
                                    <p className="text-base-content font-medium">Dhaka, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Office hours */}
                    <div className="card bg-primary text-primary-content shadow-lg">
                        <div className="card-body">
                            <h3 className="font-bold text-lg mb-3">🕐 Office Hours</h3>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Monday – Friday</span>
                                <span className="font-semibold">9:00 AM – 6:00 PM</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Saturday</span>
                                <span className="font-semibold">10:00 AM – 3:00 PM</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-70">
                                <span>Sunday</span>
                                <span>Closed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact form */}
                <div className="card bg-base-100 border border-base-300 shadow-lg">
                    <div className="card-body p-8">
                        <h3 className="text-xl font-bold mb-6">Send a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-semibold">Your Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="input input-bordered w-full focus:input-primary"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-semibold">Your Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="input input-bordered w-full focus:input-primary"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-semibold">Message</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    rows={5}
                                    className="textarea textarea-bordered w-full focus:textarea-primary resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="btn btn-primary w-full"
                            >
                                {sending
                                    ? <><span className="loading loading-spinner loading-sm"></span> Sending...</>
                                    : '🚀 Send Message'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;
