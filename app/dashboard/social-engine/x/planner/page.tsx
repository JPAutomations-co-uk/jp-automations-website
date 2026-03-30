"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import ChatQA, { type ChatMessage, type ButtonOption } from "@/app/components/ChatQA"
import FeedbackButtons from "@/app/components/FeedbackButtons"

// ─── Types ───────────────────────────────────────────────────────────────────

type PlannerPhase = "chat" | "generating" | "results"
type ChatStep = 0 | 1 | 2 | 3 | 4 | 5

interface GeneratedPost {
  id: string
  date: string
  dayOfWeek: string
  format: "Single Tweet" | "Thread" | "Poll" | "Article"
  post_type: string
  thread_type?: string
  thread_tweet_count?: number
  article_type?: string
  article_length?: string
  funnel_stage: "TOFU" | "MOFU" | "BOFU"
  pillar: string
  hook: string
  content_brief: string
  posting_time: string
  why_it_works: string
  engagement_tip: string
  goal_alignment: string
  primary_kpi: string
}

interface GeneratedPlan {
  month: string
  monthTheme: string
  monthThemeDescription: string
  postsPerWeek: number
  frequencyRationale: string
  funnelBreakdown: { tofu: number; mofu: number; bofu: number }
  pillarDistribution: Record<string, number>
  posts: GeneratedPost[]
}

interface TweetVariant {
  text: string
  hook: string
  angle: string
  cta: string
  char_count: number
  why_it_works: string
}

interface ThreadTweet {
  tweet_number: number
  text: string
  type: "hook" | "body" | "cta"
  char_count: number
}

type PostWritePhase = "idle" | "generating" | "result"

interface ArticleResult {
  title: string
  body: string
  companionTweet: string
  wordCount: number
  readTime: number
}

interface PostWriteState {
  phase: PostWritePhase
  tweets?: TweetVariant[]
  thread?: ThreadTweet[]
  threadType?: string
  tweetCount?: number
  article?: ArticleResult
  error?: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_PILLARS = [
  "Hard-won insights",
  "Client results",
  "Hot takes",
  "Step-by-step frameworks",
  "Behind the scenes",
  "Industry myths debunked",
  "Personal stories",
  "Tools & tactics",
  "Case studies",
  "Controversial opinions",
]

const GOAL_OPTIONS: ButtonOption[] = [
  { value: "Brand Awareness", label: "Brand Awareness", description: "Build the biggest possible following" },
  { value: "Education & Authority", label: "Education & Authority", description: "Establish expert reputation in your niche" },
  { value: "Lead Generation", label: "Lead Generation", description: "Get enquiries, DMs and booked calls" },
  { value: "Community Building", label: "Community Building", description: "Drive replies and genuine connections" },
  { value: "Sales & Conversions", label: "Sales & Conversions", description: "Turn followers into paying clients" },
]

// Optimal posting frequency per goal — research-backed
const GOAL_FREQUENCY: Record<string, { freq: 3 | 5 | 7 | 14; reason: string; volume: string }> = {
  "Brand Awareness": {
    freq: 14,
    reason: "2× daily is the growth-optimal frequency for follower acquisition. Each post is a new algorithmic entry point, and since everything is scheduled in advance, volume is only limited by content quality — not time. Top X growth accounts consistently post 14–21× per week.",
    volume: "14× per week",
  },
  "Education & Authority": {
    freq: 3,
    reason: "Authority comes from depth, not volume. 3 well-researched threads or insight posts per week outperform daily mediocre content for building genuine expert reputation.",
    volume: "3× per week",
  },
  "Lead Generation": {
    freq: 5,
    reason: "Weekday presence keeps you visible to buyers while maintaining enough post quality to actually convert. 5/week hits the sweet spot between reach and quality.",
    volume: "5× per week",
  },
  "Community Building": {
    freq: 5,
    reason: "Consistent weekday posting builds a predictable engagement rhythm with your audience. Pair with daily reply activity for maximum community growth.",
    volume: "5× per week",
  },
  "Sales & Conversions": {
    freq: 3,
    reason: "Conversion content needs space to breathe. 3 high-quality, funnel-focused posts per week with strategic CTAs convert better than high-volume diluted content.",
    volume: "3× per week",
  },
}

const FREQUENCY_OPTIONS: ButtonOption[] = [
  { value: "3", label: "3× per week", description: "Mon / Wed / Fri — depth over volume" },
  { value: "5", label: "5× per week", description: "Weekdays — solid algorithmic momentum" },
  { value: "7", label: "7× per week", description: "Daily — strong consistent presence" },
  { value: "14", label: "14× per week", description: "2× daily — max algorithmic reach for growth" },
]

const QUALITY_OPTIONS: ButtonOption[] = [
  { value: "fast", label: "Fast (25 tokens)", description: "1 pass — quick, good enough to post" },
  { value: "pro", label: "Pro (60 tokens)", description: "3 passes — iterates for highest quality hooks" },
]

function getDurationOptions(postsPerWeek: number): ButtonOption[] {
  return [
    { value: "1", label: "1 week", description: `${postsPerWeek} post${postsPerWeek > 1 ? "s" : ""} — quick sprint` },
    { value: "2", label: "2 weeks", description: `${postsPerWeek * 2} posts — solid fortnight` },
    { value: "3", label: "3 weeks", description: `${postsPerWeek * 3} posts` },
    { value: "4", label: "4 weeks", description: `${postsPerWeek * 4} posts — full month` },
  ]
}

const FUNNEL_COLOURS: Record<string, string> = {
  TOFU: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  MOFU: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  BOFU: "bg-teal-400/10 text-teal-400 border-teal-400/20",
}

const KPI_LABELS: Record<string, string> = {
  impressions_rate: "Impressions",
  bookmark_rate: "Bookmarks",
  profile_visit_rate: "Profile Visits",
}

let msgCounter = 0
function makeId() { return `msg-${++msgCounter}` }

// ─── Sub-components ───────────────────────────────────────────────────────────

function CharBadge({ count }: { count: number }) {
  const over = count > 280
  const close = count > 260
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded ${over ? "bg-red-500/20 text-red-400" : close ? "bg-yellow-500/20 text-yellow-400" : "bg-white/[0.06] text-gray-500"}`}>
      {count}/280
    </span>
  )
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-xs text-gray-500 hover:text-teal-400 transition-colors flex items-center gap-1"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

// ─── Account Activity Plan ────────────────────────────────────────────────────

function AccountActivityPlan({ plan }: { plan: GeneratedPlan }) {
  const morningReplies = plan.postsPerWeek >= 7 ? "20–25" : plan.postsPerWeek >= 5 ? "15–20" : "10–15"
  const afternoonReplies = plan.postsPerWeek >= 5 ? "15–20" : "10–15"

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h3 className="text-sm font-semibold text-white">Daily Account Activity</h3>
        <span className="text-xs text-gray-600">algorithm-optimised · ~45 min/day</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2.5">
          <ActivityItem
            time="Morning (7–9am) · 20–25 min"
            icon="🌅"
            tasks={[
              `Reply to ${morningReplies} posts from accounts 10x–100x your size in your niche (add real value — no praise)`,
              `Post your scheduled content`,
              `Reply to every comment within 30 min of posting — each reply chain is worth 75× a like`,
            ]}
          />
          <ActivityItem
            time="Afternoon (12–2pm) · 15–20 min"
            icon="☀️"
            tasks={[
              `Reply to ${afternoonReplies} more niche posts — target threads gaining 1,000+ views/hour`,
              `Quote-tweet 1–2 relevant posts with 2–3 sentences of your own take`,
              `Reply to any comments on your morning post`,
            ]}
          />
          <ActivityItem
            time="Evening (5–7pm) · 10 min"
            icon="🌆"
            tasks={[
              plan.postsPerWeek >= 5 ? "Post second piece of content if scheduled" : "Optional: post if you have something sharp to say",
              "Final replies sweep — clear any unanswered comments",
              "Bookmark 2–3 posts to use as jumping-off points tomorrow",
            ]}
          />
        </div>
        <div className="space-y-2.5">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
            <p className="text-xs font-semibold text-teal-400 mb-2">Engagement Signal Weights</p>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-start gap-1.5"><span className="text-teal-400 mt-0.5 shrink-0 font-bold">75×</span>Reply chain (you reply back to a reply) — highest possible signal</li>
              <li className="flex items-start gap-1.5"><span className="text-teal-400 mt-0.5 shrink-0 font-bold">20×</span>Retweet — far higher than most think</li>
              <li className="flex items-start gap-1.5"><span className="text-teal-400 mt-0.5 shrink-0 font-bold">15×</span>Quote tweet — adds your take to trending content</li>
              <li className="flex items-start gap-1.5"><span className="text-teal-400 mt-0.5 shrink-0 font-bold">10×</span>Bookmark — save-worthy content wins distribution</li>
              <li className="flex items-start gap-1.5"><span className="text-gray-600 mt-0.5 shrink-0 font-bold">1×</span>Like — lowest value despite being most common</li>
            </ul>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-400 mb-2">Critical Rules</p>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5 shrink-0">✕</span>Never put external links in tweet body — zero reach. Put in first reply.</li>
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5 shrink-0">✕</span>3+ hashtags = spam penalty (-40% reach). Use 1–2 max, never at start.</li>
              <li className="flex items-start gap-1.5"><span className="text-teal-400 mt-0.5 shrink-0">→</span>First 30 min after posting determines total reach. Clear all comments fast.</li>
              <li className="flex items-start gap-1.5"><span className="text-teal-400 mt-0.5 shrink-0">→</span>Text-only has highest median engagement (0.48%). X is text-first.</li>
              <li className="flex items-start gap-1.5"><span className="text-teal-400 mt-0.5 shrink-0">→</span>X Premium = 4× in-network boost. Near-essential for serious growth.</li>
            </ul>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
            <p className="text-xs font-semibold text-gray-400 mb-2">This Month's Funnel Split</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-blue-400">{plan.funnelBreakdown.tofu}%</p>
                <p className="text-[10px] text-gray-500 font-semibold">TOFU</p>
                <p className="text-[10px] text-gray-600">Reach</p>
              </div>
              <div>
                <p className="text-lg font-bold text-amber-400">{plan.funnelBreakdown.mofu}%</p>
                <p className="text-[10px] text-gray-500 font-semibold">MOFU</p>
                <p className="text-[10px] text-gray-600">Authority</p>
              </div>
              <div>
                <p className="text-lg font-bold text-teal-400">{plan.funnelBreakdown.bofu}%</p>
                <p className="text-[10px] text-gray-500 font-semibold">BOFU</p>
                <p className="text-[10px] text-gray-600">Convert</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-600 mt-2">Growth is non-linear. Expect 3–6 months before the inflection point. Consistency compounds.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityItem({ time, icon, tasks }: { time: string; icon: string; tasks: string[] }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
      <p className="text-xs font-semibold text-gray-300 mb-1.5">{icon} {time}</p>
      <ul className="space-y-1 text-xs text-gray-400">
        {tasks.map((t, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="text-gray-600 mt-0.5 shrink-0">·</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Article Body ─────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function renderBold(text: string): string {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong class='text-white font-medium'>$1</strong>")
}

function ArticleBody({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n")
  return (
    <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-base font-semibold text-white mt-5 mb-1 first:mt-0">
              {line.replace(/^## /, "")}
            </h2>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-teal-400 mt-0.5 shrink-0">·</span>
              <span dangerouslySetInnerHTML={{ __html: renderBold(line.replace(/^- /, "")) }} />
            </div>
          )
        }
        if (line.trim() === "") {
          return <div key={i} className="h-1" />
        }
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: renderBold(line) }} />
        )
      })}
    </div>
  )
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({
  post,
  writeState,
  onWrite,
  onResetWrite,
}: {
  post: GeneratedPost
  writeState: PostWriteState
  onWrite: () => void
  onResetWrite: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const isThread = post.format === "Thread"
  const isPoll = post.format === "Poll"
  const isArticle = post.format === "Article"
  const writeCost = isArticle ? 5 : isThread ? 8 : 2

  const formatColour = isArticle
    ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
    : isThread
      ? "bg-purple-400/10 text-purple-400 border-purple-400/20"
      : isPoll
        ? "bg-pink-400/10 text-pink-400 border-pink-400/20"
        : "bg-sky-400/10 text-sky-400 border-sky-400/20"

  const formattedDate = (() => {
    try {
      const d = new Date(post.date + "T12:00:00Z")
      return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
    } catch { return post.date }
  })()

  return (
    <div className={`bg-white/[0.03] border rounded-2xl transition-all ${expanded || writeState.phase !== "idle" ? "border-teal-400/20" : "border-white/[0.08] hover:border-white/[0.12]"}`}>
      {/* Card header — always visible */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${formatColour}`}>
              {post.format}{isThread && post.thread_tweet_count ? ` · ${post.thread_tweet_count}T` : ""}{isArticle && post.article_type ? ` · ${post.article_type}` : ""}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${FUNNEL_COLOURS[post.funnel_stage]}`}>
              {post.funnel_stage}
            </span>
            <span className="text-[10px] text-gray-600 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">
              {post.pillar}
            </span>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-medium text-gray-300">{formattedDate}</p>
            <p className="text-[10px] text-gray-600">{post.posting_time}</p>
          </div>
        </div>

        {/* Hook */}
        <p className="text-sm text-white leading-relaxed mb-3">{post.hook}</p>

        {/* Actions row */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-gray-500 hover:text-teal-400 transition-colors flex items-center gap-1"
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
            {expanded ? "Less" : "Content brief"}
          </button>

          <div className="flex items-center gap-3">
            {writeState.phase === "result" && (
              <button
                onClick={onResetWrite}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Regenerate
              </button>
            )}
            {writeState.phase === "idle" && (
              <button
                onClick={onWrite}
                className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                </svg>
                Write ({writeCost} tokens)
              </button>
            )}
            {writeState.phase === "generating" && (
              <span className="text-xs text-teal-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Writing...
              </span>
            )}
          </div>
        </div>

        {writeState.error && (
          <p className="text-xs text-red-400 mt-2">{writeState.error}</p>
        )}
      </div>

      {/* Expanded content brief */}
      {expanded && (
        <div className="border-t border-white/[0.06] px-4 pb-4 pt-3 space-y-2.5">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Content Brief</p>
            <p className="text-xs text-gray-400 leading-relaxed">{post.content_brief}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Why it works</p>
              <p className="text-xs text-gray-500 leading-relaxed">{post.why_it_works}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Engagement tip</p>
              <p className="text-xs text-gray-500 leading-relaxed">{post.engagement_tip}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-600">
              KPI: <span className="text-gray-500">{KPI_LABELS[post.primary_kpi] || post.primary_kpi}</span>
            </span>
            <span className="text-[10px] text-gray-600">
              Post at: <span className="text-gray-500">{post.posting_time}</span>
            </span>
          </div>
        </div>
      )}

      {/* Inline write result */}
      {writeState.phase === "result" && (
        <div className="border-t border-teal-400/20 px-4 pb-4 pt-3">
          {writeState.tweets && writeState.tweets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-white">Tweet Variants</span>
                <CopyButton
                  text={writeState.tweets.map(t => t.text).join("\n\n---\n\n")}
                  label="Copy all"
                />
              </div>
              {writeState.tweets.map((tweet, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Variant {i + 1} · {tweet.angle}</span>
                    <div className="flex items-center gap-2">
                      <CharBadge count={tweet.char_count || tweet.text?.length || 0} />
                      <CopyButton text={tweet.text} />
                    </div>
                  </div>
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap mb-2">{tweet.text}</p>
                  <p className="text-[10px] text-gray-600"><span className="text-gray-500">Why:</span> {tweet.why_it_works}</p>
                </div>
              ))}
              <div className="pt-1">
                <FeedbackButtons contentType="x_post" contentSnapshot={{ tweets: writeState.tweets, post_id: post.id }} />
              </div>
            </div>
          )}

          {writeState.thread && writeState.thread.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-white">
                  {writeState.threadType} Thread · {writeState.tweetCount} tweets
                </span>
                <CopyButton
                  text={writeState.thread.map(t => t.text).join("\n\n")}
                  label="Copy thread"
                />
              </div>
              {writeState.thread.map((tweet) => (
                <div
                  key={tweet.tweet_number}
                  className={`bg-white/[0.03] border rounded-xl p-3 transition-all ${
                    tweet.type === "hook"
                      ? "border-teal-400/30 bg-teal-400/5"
                      : tweet.type === "cta"
                        ? "border-teal-400/20"
                        : "border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tweet.type === "hook" ? "bg-teal-400/20 text-teal-400"
                        : tweet.type === "cta" ? "bg-teal-400/10 text-teal-500"
                          : "bg-white/[0.06] text-gray-500"
                    }`}>
                      {tweet.type === "hook" ? "Hook" : tweet.type === "cta" ? "CTA" : `${tweet.tweet_number}/`}
                    </span>
                    <div className="flex items-center gap-2">
                      <CharBadge count={tweet.char_count || tweet.text?.length || 0} />
                      <CopyButton text={tweet.text} />
                    </div>
                  </div>
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{tweet.text}</p>
                </div>
              ))}
              <div className="pt-1">
                <FeedbackButtons contentType="x_post" contentSnapshot={{ thread: writeState.thread, post_id: post.id }} />
              </div>
            </div>
          )}

          {writeState.article && (
            <div className="space-y-4">
              {/* Companion tweet */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Companion Tweet</span>
                  <CopyButton text={writeState.article.companionTweet} />
                </div>
                <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{writeState.article.companionTweet}</p>
                <p className="text-[10px] text-gray-600 mt-1">{writeState.article.companionTweet?.length || 0}/280 chars</p>
              </div>

              {/* Article body */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-bold text-white leading-tight flex-1">{writeState.article.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-gray-500">~{writeState.article.wordCount}w · {writeState.article.readTime} min</span>
                    <CopyButton text={`# ${writeState.article.title}\n\n${writeState.article.body}`} label="Copy article" />
                  </div>
                </div>
                <ArticleBody markdown={writeState.article.body} />
              </div>

              <div className="pt-1">
                <FeedbackButtons contentType="x_article" contentSnapshot={{ title: writeState.article.title, body: writeState.article.body, post_id: post.id }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function XPlannerPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()
  const [phase, setPhase] = useState<PlannerPhase>("chat")
  const [plan, setPlan] = useState<GeneratedPlan | null>(null)
  const [error, setError] = useState("")
  const [postWrites, setPostWrites] = useState<Record<string, PostWriteState>>({})
  const [qualityReport, setQualityReport] = useState<{ overallScore: number; mode: string } | null>(null)

  // Chat state
  const [chatStep, setChatStep] = useState<ChatStep>(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [formData, setFormData] = useState({
    goal: "",
    postsPerWeek: 5,
    weeksCount: 4,
    pillars: [] as string[],
    topics: [] as string[],
  })
  const [selectedPillars, setSelectedPillars] = useState<Set<string>>(new Set())
  const [topicInput, setTopicInput] = useState("")
  const msgIdRef = useRef(0)

  const makeMsg = (role: "user" | "assistant", content: string): ChatMessage => ({
    id: `msg-${++msgIdRef.current}`,
    role,
    content,
  })

  // Init first question
  useEffect(() => {
    setMessages([makeMsg("assistant", "Let's build your X content plan. What's your primary goal?")])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectButton = useCallback((value: string) => {
    if (chatStep === 0) {
      const label = GOAL_OPTIONS.find(o => o.value === value)?.label || value
      const rec = GOAL_FREQUENCY[value]
      const recommendedFreq = rec?.freq ?? 5
      setFormData(prev => ({ ...prev, goal: value, postsPerWeek: recommendedFreq }))
      setMessages(prev => [
        ...prev,
        makeMsg("user", label),
        makeMsg("assistant", `Based on your goal, I recommend **${rec?.volume ?? "5× per week"}**.\n\n${rec?.reason ?? ""}\n\nYou can go with this or adjust:`),
      ])
      setChatStep(1)
    } else if (chatStep === 1) {
      const numFreq = Number(value)
      setFormData(prev => ({ ...prev, postsPerWeek: numFreq }))
      setMessages(prev => [
        ...prev,
        makeMsg("user", `${value}× per week`),
        makeMsg("assistant", "How many weeks do you want to plan for?"),
      ])
      setChatStep(2)
    } else if (chatStep === 2) {
      const numWeeks = Number(value)
      setFormData(prev => ({ ...prev, weeksCount: numWeeks }))
      setMessages(prev => [
        ...prev,
        makeMsg("user", `${numWeeks} week${numWeeks > 1 ? "s" : ""}`),
        makeMsg("assistant", "Pick 3–5 content pillars. These become the recurring themes across your posts."),
      ])
      setChatStep(3)
    }
  }, [chatStep]) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePillar = (pillar: string) => {
    setSelectedPillars(prev => {
      const next = new Set(prev)
      if (next.has(pillar)) next.delete(pillar)
      else next.add(pillar)
      return next
    })
  }

  const handleConfirmPillars = () => {
    const pillars = Array.from(selectedPillars)
    const finalPillars = pillars.length > 0 ? pillars : DEFAULT_PILLARS.slice(0, 4)
    setFormData(prev => ({ ...prev, pillars: finalPillars }))
    const label = finalPillars.length > 0 ? finalPillars.join(", ") : "Default pillars"
    const totalPosts = formData.postsPerWeek * formData.weeksCount
    setMessages(prev => [
      ...prev,
      makeMsg("user", label),
      makeMsg("assistant", `Any specific topics you want to cover? You can add up to ${totalPosts} topics — one per post. Or skip and I'll choose for you.`),
    ])
    setChatStep(4)
  }

  const handleAddTopic = () => {
    const topic = topicInput.trim()
    if (!topic) return
    const totalPosts = formData.postsPerWeek * formData.weeksCount
    if (formData.topics.length >= totalPosts) return
    setFormData(prev => ({ ...prev, topics: [...prev.topics, topic] }))
    setTopicInput("")
  }

  const handleRemoveTopic = (index: number) => {
    setFormData(prev => ({ ...prev, topics: prev.topics.filter((_, i) => i !== index) }))
  }

  const handleConfirmTopics = () => {
    const topicsLabel = formData.topics.length > 0
      ? `${formData.topics.length} topic${formData.topics.length > 1 ? "s" : ""}: ${formData.topics.join(", ")}`
      : "No specific topics — you choose"
    const topicsSummary = formData.topics.length > 0 ? `\n• Topics: ${formData.topics.join(", ")}` : ""
    setMessages(prev => [
      ...prev,
      makeMsg("user", topicsLabel),
      makeMsg("assistant", `Ready to generate. Here's the summary:\n\n• Goal: ${formData.goal}\n• ${formData.postsPerWeek}× per week · ${formData.weeksCount} week${formData.weeksCount > 1 ? "s" : ""} (${formData.postsPerWeek * formData.weeksCount} posts)\n• Pillars: ${formData.pillars.join(", ")}${topicsSummary}`),
    ])
    setChatStep(5)
  }

  const handleGenerate = async (feedbackNote?: string) => {
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/x/planner")
      return
    }

    const cost = 25
    if (tokenBalance < cost) {
      setError(`You need ${cost} tokens to generate. Current balance: ${tokenBalance}.`)
      return
    }

    setPhase("generating")
    setError("")

    try {
      const profileRes = await fetch("/api/profile")
      const profileData = profileRes.ok ? await profileRes.json() : {}
      const profile = profileData.profile || {}

      const pillars = formData.pillars.length > 0 ? formData.pillars : DEFAULT_PILLARS.slice(0, 4)

      const totalPosts = formData.postsPerWeek * formData.weeksCount
      // ~8s per post with Haiku + 15s overhead — generous ceiling
      const timeoutMs = Math.max(30_000, Math.min(120_000, totalPosts * 8_000 + 15_000))
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)

      const res = await fetch("/api/generate/x-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          postsPerWeek: formData.postsPerWeek,
          weeksCount: formData.weeksCount,
          industry: profile.industry || "Business services",
          businessDescription: profile.business_description || "",
          targetAudience: profile.target_audience || "Business professionals and entrepreneurs",
          goals: formData.goal,
          contentPillars: pillars,
          topics: formData.topics,
          qualityMode: "fast",
          ...(feedbackNote ? { feedbackNote } : {}),
        }),
      })
      clearTimeout(timeout)

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Generation failed")
        setPhase("chat")
        return
      }

      setPlan(data.plan)
      setQualityReport(data.qualityReport || null)
      setPhase("results")
      refreshBalance()
    } catch (err) {
      const isTimeout = err instanceof DOMException && err.name === "AbortError"
      setError(isTimeout ? "Generation timed out — try a shorter plan (fewer weeks)." : "Something went wrong. Please try again.")
      setPhase("chat")
    }
  }

  const handleWritePost = async (post: GeneratedPost) => {
    const isThread = post.format === "Thread"
    const isArticle = post.format === "Article"
    const tokenCost = isArticle ? 5 : isThread ? 8 : 2

    if (tokenBalance < tokenCost) {
      setPostWrites(prev => ({ ...prev, [post.id]: { phase: "idle", error: `Need ${tokenCost} tokens to write this post.` } }))
      return
    }

    setPostWrites(prev => ({ ...prev, [post.id]: { phase: "generating" } }))

    try {
      // Article format — call x-article API
      if (isArticle) {
        const res = await fetch("/api/generate/x-article", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: post.hook,
            articleType: post.article_type || "Deep Dive",
            length: post.article_length || "standard",
            contentBrief: post.content_brief,
            goal: formData.goal || "Education & Authority",
            funnelStage: post.funnel_stage,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          setPostWrites(prev => ({ ...prev, [post.id]: { phase: "idle", error: data.error || "Failed to generate article" } }))
          return
        }

        setPostWrites(prev => ({
          ...prev,
          [post.id]: {
            phase: "result",
            article: {
              title: data.title,
              body: data.body,
              companionTweet: data.companionTweet,
              wordCount: data.wordCount,
              readTime: data.readTime,
            },
          },
        }))
        refreshBalance()
        return
      }

      // Tweet/Thread format — call x-post API
      const topicContext = `${post.hook}\n\nContent brief: ${post.content_brief}\n\nGoal alignment: ${post.goal_alignment}`

      const res = await fetch("/api/generate/x-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: isThread ? "thread" : "tweet",
          topic: topicContext,
          goal: formData.goal || "Education & Authority",
          tone: "Authority",
          temperature: 0.7,
          ...(isThread && {
            threadType: post.thread_type || "Educational",
            masterPrompt: `Thread should be approximately ${post.thread_tweet_count || 7} tweets. Funnel stage: ${post.funnel_stage}.`,
          }),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setPostWrites(prev => ({ ...prev, [post.id]: { phase: "idle", error: data.error || "Failed to generate" } }))
        return
      }

      setPostWrites(prev => ({
        ...prev,
        [post.id]: {
          phase: "result",
          tweets: data.tweets || [],
          thread: data.thread || [],
          threadType: data.thread_type,
          tweetCount: data.tweet_count,
        },
      }))
      refreshBalance()
    } catch {
      setPostWrites(prev => ({ ...prev, [post.id]: { phase: "idle", error: "Something went wrong." } }))
    }
  }

  const handleResetWrite = (postId: string) => {
    setPostWrites(prev => ({ ...prev, [postId]: { phase: "idle" } }))
  }

  const handleStartOver = () => {
    setPlan(null)
    setPhase("chat")
    setChatStep(0)
    setMessages([makeMsg("assistant", "Let's build your X content plan. What's your primary goal?")])
    setFormData({ goal: "", postsPerWeek: 5, weeksCount: 4, pillars: [], topics: [] })
    setSelectedPillars(new Set())
    setTopicInput("")
    setPostWrites({})
    setError("")
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  const currentInputMode = (): "buttons" | "none" => {
    if (phase !== "chat" || chatStep >= 3) return "none"
    return "buttons"
  }

  const currentButtonOptions = (): ButtonOption[] => {
    if (chatStep === 0) return GOAL_OPTIONS
    if (chatStep === 1) {
      const recommended = GOAL_FREQUENCY[formData.goal]?.freq
      return FREQUENCY_OPTIONS.map(opt => ({
        ...opt,
        description: Number(opt.value) === recommended
          ? `${opt.description} · Recommended`
          : opt.description,
      }))
    }
    if (chatStep === 2) return getDurationOptions(formData.postsPerWeek)
    return []
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <a
            href="/dashboard/social-engine/x"
            className="text-gray-500 hover:text-teal-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-white">X Planner</h1>
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
            25 tokens
          </span>
        </div>
        <p className="text-gray-500">Algorithm-optimised content plan with daily activity schedule.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Chat Phase */}
      {phase === "chat" && (
        <div className="space-y-4">
          <ChatQA
            messages={messages}
            inputMode={currentInputMode()}
            buttonOptions={currentButtonOptions()}
            onSelectButton={handleSelectButton}
          />

          {/* Pillar selection (step 3) */}
          {chatStep === 3 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {DEFAULT_PILLARS.map(pillar => (
                  <button
                    key={pillar}
                    onClick={() => togglePillar(pillar)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                      selectedPillars.has(pillar)
                        ? "bg-teal-400/10 border-teal-400/40 text-teal-400"
                        : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-teal-400/30 hover:text-gray-300"
                    }`}
                  >
                    {pillar}
                  </button>
                ))}
              </div>
              <button
                onClick={handleConfirmPillars}
                className="w-full py-2.5 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400 text-sm font-medium hover:bg-teal-400/15 transition-all"
              >
                {selectedPillars.size > 0 ? `Use ${selectedPillars.size} pillar${selectedPillars.size > 1 ? "s" : ""}` : "Use default pillars"}
              </button>
            </div>
          )}

          {/* Topics input (step 4) */}
          {chatStep === 4 && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTopic() } }}
                  placeholder="Type a topic and press Enter..."
                  className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm"
                />
                <button
                  onClick={handleAddTopic}
                  disabled={!topicInput.trim() || formData.topics.length >= formData.postsPerWeek * formData.weeksCount}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    topicInput.trim() && formData.topics.length < formData.postsPerWeek * formData.weeksCount
                      ? "bg-teal-400/10 border border-teal-400/30 text-teal-400 hover:bg-teal-400/15"
                      : "bg-white/[0.03] border border-white/[0.06] text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Add
                </button>
              </div>

              {formData.topics.length > 0 && (
                <div className="space-y-1.5">
                  {formData.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-xs font-bold text-gray-600 w-5">{i + 1}.</span>
                      <span className="flex-1 text-sm text-gray-300">{topic}</span>
                      <button
                        onClick={() => handleRemoveTopic(i)}
                        className="text-gray-600 hover:text-red-400 transition-colors p-0.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-gray-600">
                    {formData.topics.length} of {formData.postsPerWeek * formData.weeksCount} max topics
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleConfirmTopics}
                  className="flex-1 py-2.5 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400 text-sm font-medium hover:bg-teal-400/15 transition-all"
                >
                  {formData.topics.length > 0 ? `Continue with ${formData.topics.length} topic${formData.topics.length > 1 ? "s" : ""}` : "Skip — choose for me"}
                </button>
              </div>
            </div>
          )}

          {/* Confirm & generate (step 5) */}
          {chatStep === 5 && (
            <div className="pt-2">
              <button
                onClick={() => handleGenerate()}
                className="w-full py-3 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400 font-semibold hover:bg-teal-400/15 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Generate X Plan (25 tokens)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Generating */}
      {phase === "generating" && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-white font-medium mb-1">Building your X content plan...</p>
          <p className="text-gray-500 text-sm">
            {formData.postsPerWeek * formData.weeksCount <= 8
              ? "This takes around 20 seconds."
              : "This takes around 30–60 seconds."}
          </p>
        </div>
      )}

      {/* Results */}
      {phase === "results" && plan && (
        <div className="space-y-6">
          {/* Plan header */}
          <div className="bg-white/[0.03] border border-teal-400/20 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-white">{plan.monthTheme}</h2>
                  {qualityReport && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${qualityReport.overallScore >= 80 ? "bg-teal-400/20 text-teal-400" : qualityReport.overallScore >= 65 ? "bg-amber-400/20 text-amber-400" : "bg-red-400/20 text-red-400"}`}>
                      Quality {qualityReport.overallScore}/100
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{plan.monthThemeDescription}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-white">{plan.posts.length}</p>
                <p className="text-xs text-gray-500">posts</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic mb-4">{plan.frequencyRationale}</p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <button onClick={handleStartOver} className="text-xs text-gray-500 hover:text-teal-400 transition-colors">
                  ← Start Over
                </button>
                <CopyButton
                  text={plan.posts.map(p => `${p.date} ${p.dayOfWeek} ${p.posting_time}\n${p.format}${p.thread_tweet_count ? ` (${p.thread_tweet_count}T)` : ""}${p.article_type ? ` (${p.article_type})` : ""} · ${p.funnel_stage} · ${p.pillar}\nHook: ${p.hook}`).join("\n\n")}
                  label="Export plan"
                />
              </div>
              <FeedbackButtons
                contentType="x_plan"
                contentSnapshot={{ goal: formData.goal, postsPerWeek: formData.postsPerWeek, weeksCount: formData.weeksCount }}
                onRegenerate={(note) => handleGenerate(note)}
              />
            </div>
          </div>

          {/* Account activity plan */}
          <AccountActivityPlan plan={plan} />

          {/* Post list */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">
              {plan.posts.length} Posts · {formData.weeksCount} week{formData.weeksCount > 1 ? "s" : ""}
            </h3>
            <div className="space-y-3">
              {plan.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  writeState={postWrites[post.id] || { phase: "idle" }}
                  onWrite={() => handleWritePost(post)}
                  onResetWrite={() => handleResetWrite(post.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
