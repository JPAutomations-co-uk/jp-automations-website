"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "assistant" | "user"
  content: string
}

interface ToneProfile {
  summary: string
  attributes: string[]
  doList: string[]
  dontList: string[]
  vocabulary: string
  sentenceStyle: string
  systemPrompt: string
  demoPost: string
  status: "confirmed"
  updatedAt: string
}

const FIRST_MESSAGE =
  "Let's nail your tone of voice. To start — paste a few examples of copy you've written that you feel represent how you want to sound. Captions, ads, emails, tweets — anything goes."

export default function ToneOfVoicePage() {
  const { user } = useAuth()
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: FIRST_MESSAGE },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<ToneProfile | null>(null)
  const [demoPost, setDemoPost] = useState("")
  const [phase, setPhase] = useState<"loading" | "chat" | "review">("loading")
  const [saving, setSaving] = useState(false)
  const [existingProfile, setExistingProfile] = useState<ToneProfile | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check for existing profile
  useEffect(() => {
    if (!user) return
    fetch("/api/tone-profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile?.status === "confirmed") {
          setExistingProfile(data.profile)
          setPhase("review")
        } else {
          setPhase("chat")
        }
      })
      .catch(() => setPhase("chat"))
  }, [user])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  // Focus input
  useEffect(() => {
    if (phase === "chat" && !loading) {
      inputRef.current?.focus()
    }
  }, [phase, loading, messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: "user", content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/generate/tone-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      })

      if (!res.ok) throw new Error("Failed to get response")
      const data = await res.json()

      if (data.type === "profile") {
        setMessages([
          ...updated,
          { role: "assistant", content: "I've built your tone profile. Here's a demo post to show how it sounds:" },
        ])
        setProfile(data.profile)
        setDemoPost(data.demoPost)
        setPhase("review")
      } else {
        setMessages([...updated, { role: "assistant", content: data.content }])
      }
    } catch {
      setMessages([
        ...updated,
        { role: "assistant", content: "Something went wrong — try sending that again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!profile) return
    setSaving(true)

    try {
      const res = await fetch("/api/tone-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, demoPost }),
      })

      if (res.ok) {
        router.push("/dashboard/social-engine")
      } else {
        setSaving(false)
      }
    } catch {
      setSaving(false)
    }
  }

  const handleRedo = () => {
    setProfile(null)
    setDemoPost("")
    setExistingProfile(null)
    setPhase("chat")
    setMessages([{ role: "assistant", content: FIRST_MESSAGE }])
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500">Please sign in to continue.</p>
      </div>
    )
  }

  if (phase === "loading") {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    )
  }

  if (saving) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-medium">Saving your tone of voice...</p>
          <p className="text-gray-500 text-sm">This will be used across all your content.</p>
        </div>
      </div>
    )
  }

  // Show existing profile
  if (phase === "review" && existingProfile && !profile) {
    return (
      <div className="max-w-2xl mx-auto py-4">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            <span className="text-sm font-medium text-gray-300">Tone of Voice</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Your tone of voice</h1>
          <p className="text-gray-500">{existingProfile.summary}</p>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5 mb-6">
          {/* Attributes */}
          <div className="flex flex-wrap gap-2">
            {existingProfile.attributes.map((attr) => (
              <span key={attr} className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-400/10 text-teal-400 border border-teal-400/20">
                {attr}
              </span>
            ))}
          </div>

          {/* Do / Don't */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Do</div>
              {existingProfile.doList.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <svg className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Don&apos;t</div>
              {existingProfile.dontList.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <svg className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Style notes */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Vocabulary</div>
              <p className="text-xs text-gray-300">{existingProfile.vocabulary}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Sentence style</div>
              <p className="text-xs text-gray-300">{existingProfile.sentenceStyle}</p>
            </div>
          </div>
        </div>

        {/* Demo post */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Demo post</div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-black font-bold text-sm shrink-0">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-white">You</span>
                  <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed mt-1 whitespace-pre-wrap">{existingProfile.demoPost}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleRedo}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          Redo tone of voice
        </button>
      </div>
    )
  }

  // New profile just generated — review it
  if (phase === "review" && profile) {
    return (
      <div className="max-w-2xl mx-auto py-4">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            <span className="text-sm font-medium text-gray-300">Tone of Voice</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Here&apos;s your tone profile</h1>
          <p className="text-gray-500">Review the profile below and confirm if it matches your voice.</p>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5 mb-6">
          <p className="text-sm text-gray-300">{profile.summary}</p>
          <div className="flex flex-wrap gap-2">
            {profile.attributes.map((attr) => (
              <span key={attr} className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-400/10 text-teal-400 border border-teal-400/20">
                {attr}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Do</div>
              {profile.doList.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <svg className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Don&apos;t</div>
              {profile.dontList.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <svg className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Vocabulary</div>
              <p className="text-xs text-gray-300">{profile.vocabulary}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Sentence style</div>
              <p className="text-xs text-gray-300">{profile.sentenceStyle}</p>
            </div>
          </div>
        </div>

        {/* Demo post */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Demo post</div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-black font-bold text-sm shrink-0">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-white">You</span>
                  <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed mt-1 whitespace-pre-wrap">{demoPost}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleRedo}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all"
          >
            Not quite
          </button>
          <button
            onClick={handleApprove}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all"
          >
            This is me
          </button>
        </div>
      </div>
    )
  }

  // Chat phase
  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
          <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          <span className="text-sm font-medium text-gray-300">Tone of Voice</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Set your tone of voice</h1>
        <p className="text-gray-500">
          Answer a few questions so we can match your writing style across all content.
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="space-y-3 mb-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "rounded-2xl rounded-tr-md bg-teal-400/10 border border-teal-400/20 text-teal-300"
                    : "rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06] text-gray-300"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-gray-500">Thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-end gap-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          rows={1}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-sm disabled:opacity-50"
          style={{ minHeight: "44px", maxHeight: "120px" }}
          onInput={(e) => {
            const el = e.currentTarget
            el.style.height = "auto"
            el.style.height = Math.min(el.scrollHeight, 120) + "px"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="p-3 rounded-xl bg-teal-400 text-black hover:bg-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  )
}
