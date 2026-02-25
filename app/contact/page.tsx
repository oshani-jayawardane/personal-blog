import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
          Contact
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-zinc-600">
          Feel free to reach out. I’ll get back to you as soon as possible.
        </p>
      </header>

      <div className="border-t" />

      {/* Contact Form */}
      <form
        action="https://formspree.io/f/meelvvkj"
        method="POST"
        className="space-y-6"
      >
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium">
            Your Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-zinc-900 text-white px-6 py-3 hover:bg-zinc-800"
        >
          Send Message
        </button>
      </form>

      <div className="border-t pt-6" />

      {/* Social */}
      <div className="space-y-3">
        <p className="text-sm sm:text-base text-zinc-600">
          Or connect with me on:
        </p>

        <a
          href="https://www.linkedin.com/in/oshani-jayawardane-267089153"
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full border px-5 py-2 hover:bg-zinc-50"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}