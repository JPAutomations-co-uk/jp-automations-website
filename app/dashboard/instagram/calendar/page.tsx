"use client"

import { Suspense, useState, useCallback, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"

// ─── Types ───────────────────────────────────────────────────────────────────

type PostFormat = "Talking Head Reel" | "Voiceover/B-Roll Reel" | "Carousel" | "Single Image" | "Story"
type FunnelStage = "TOFU" | "MOFU" | "BOFU"
type PostStatus = "draft" | "scheduled" | "published" | "failed"

interface Post {
    id: string
    date: string
    day_of_week: string
    title: string | null // topic in DB is title equivalent
    format: PostFormat
    funnel_stage: FunnelStage
    pillar: string
    caption_hook: string
    caption_body: string
    hashtags: string[]
    posting_time: string
    status: PostStatus
    instagram_media_id?: string
    instagram_permalink?: string | null
    meta?: {
        description?: string
        why_it_works?: string
        engagement_tip?: string
    }
    generated_assets?: {
        id: string
        url: string
        asset_type: string
    }[]
}

interface CalendarCell {
    date: number | null
    dateStr: string | null
    posts: Post[]
    isCurrentMonth: boolean
}

interface PlanQualityReport {
    overallScore?: number
    mode?: string
    qualityWarning?: boolean
    qualityGaps?: string[]
}

interface PlanSummary {
    id: string
    month: string
    quality_mode: string | null
    quality_report: PlanQualityReport | null
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const FUNNEL_COLORS: Record<FunnelStage, { bg: string; border: string; text: string; dot: string }> = {
    TOFU: { bg: "bg-blue-400/15", border: "border-blue-400/30", text: "text-blue-400", dot: "bg-blue-400" },
    MOFU: { bg: "bg-amber-400/15", border: "border-amber-400/30", text: "text-amber-400", dot: "bg-amber-400" },
    BOFU: { bg: "bg-teal-400/15", border: "border-teal-400/30", text: "text-teal-400", dot: "bg-teal-400" },
}

const STATUS_COLORS: Record<PostStatus, string> = {
    draft: "bg-gray-500",
    scheduled: "bg-amber-500",
    published: "bg-green-500",
    failed: "bg-red-500",
}

// ─── Components ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PostStatus }) {
    const color = STATUS_COLORS[status] || "bg-gray-500"
    return (
        <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
            <span className="text-xs font-medium text-gray-400 capitalize">{status}</span>
        </span>
    )
}

function FormatIcon({ format, className = "w-3.5 h-3.5" }: { format: string; className?: string }) {
    if (format.includes("Reel")) return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    )
    if (format === "Carousel") return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
        </svg>
    )
    if (format === "Single Image") return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
    )
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    )
}

function FunnelBadge({ stage }: { stage: FunnelStage }) {
    const colors = FUNNEL_COLORS[stage] || { bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' }
    return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${colors.bg} ${colors.border} border ${colors.text}`}>
            <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
            {stage}
        </span>
    )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function CalendarPageFallback() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">
            <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6 max-w-7xl mx-auto">
                <p className="text-sm text-gray-400">Loading calendar...</p>
            </main>
        </div>
    )
}

function CalendarPageContent() {
    const { user, tokenBalance } = useAuth()
    const searchParams = useSearchParams()

    const isValidMonth = useCallback((value: string | null): value is string => {
        return Boolean(value && /^\d{4}-\d{2}$/.test(value))
    }, [])

    const [currentMonth, setCurrentMonth] = useState(() => {
        const queryMonth = searchParams.get("month")
        if (queryMonth && /^\d{4}-\d{2}$/.test(queryMonth)) return queryMonth
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })

    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [publishing, setPublishing] = useState(false)
    const [planSummary, setPlanSummary] = useState<PlanSummary | null>(null)
    const planId = searchParams.get("planId")

    useEffect(() => {
        const queryMonth = searchParams.get("month")
        if (!isValidMonth(queryMonth)) return
        setCurrentMonth((prev) => (prev === queryMonth ? prev : queryMonth))
    }, [searchParams, isValidMonth])

    // Fetch posts when month changes
    useEffect(() => {
        if (!user) return

        async function fetchPosts() {
            setLoading(true)
            try {
                const res = await fetch(`/api/posts?month=${currentMonth}`)
                if (res.ok) {
                    const data = await res.json()
                    setPosts(data.posts || [])
                }
            } catch (err) {
                console.error("Failed to fetch posts", err)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [user, currentMonth])

    useEffect(() => {
        if (!user) return

        async function fetchPlanSummary() {
            try {
                const params = new URLSearchParams()
                if (planId) params.set("id", planId)
                else params.set("month", currentMonth)

                const res = await fetch(`/api/content-plans?${params.toString()}`)
                if (!res.ok) return
                const data = await res.json()
                setPlanSummary(data.plan || null)
            } catch (err) {
                console.error("Failed to fetch content plan summary", err)
            }
        }

        fetchPlanSummary()
    }, [user, currentMonth, planId])

    // Calendar Logic
    const calendarCells = useMemo(() => {
        const [year, month] = currentMonth.split("-").map(Number)
        const firstDay = new Date(year, month - 1, 1)
        const lastDay = new Date(year, month, 0)
        const startDayOfWeek = (firstDay.getDay() + 6) % 7 // Mon=0
        const daysInMonth = lastDay.getDate()

        const postsByDate = new Map<string, Post[]>()
        posts.forEach((p) => {
            const existing = postsByDate.get(p.date) || []
            postsByDate.set(p.date, [...existing, p])
        })

        const cells: CalendarCell[] = []

        for (let i = 0; i < startDayOfWeek; i++) {
            cells.push({ date: null, dateStr: null, posts: [], isCurrentMonth: false })
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
            cells.push({
                date: d,
                dateStr,
                posts: postsByDate.get(dateStr) || [],
                isCurrentMonth: true,
            })
        }

        // Fill remaining cells
        while (cells.length % 7 !== 0) {
            cells.push({ date: null, dateStr: null, posts: [], isCurrentMonth: false })
        }

        return cells
    }, [currentMonth, posts])

    const handleMonthChange = (offset: number) => {
        const [y, m] = currentMonth.split('-').map(Number)
        const date = new Date(y, m - 1 + offset, 1)
        setCurrentMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
    }

    const handlePublish = async (post: Post) => {
        if (!confirm("Are you sure you want to publish this post to Instagram?")) return

        setPublishing(true)
        try {
            const res = await fetch("/api/instagram/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: post.id })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Failed to publish")
                return
            }

            alert("Post published successfully!")
            // Refresh posts
            setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: "published", instagram_media_id: data.mediaId, instagram_permalink: data.permalink || p.instagram_permalink } : p))
            setSelectedPost(prev => prev?.id === post.id ? { ...prev, status: "published", instagram_media_id: data.mediaId, instagram_permalink: data.permalink || prev.instagram_permalink } : prev)

        } catch (err) {
            alert("An error occurred while publishing")
            console.error(err)
        } finally {
            setPublishing(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">
            {/* Nav Reused (Should act as layout but duplicated for now matching planner) */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 border-b border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="relative z-50">
                        <img src="/logo.png" alt="JP Automations" className="h-16 md:h-20 w-auto" />
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/dashboard" className="px-5 py-2.5 text-sm font-semibold border border-teal-400/40 text-teal-400 rounded-lg hover:bg-teal-400/10 transition-all">
                            My Apps
                        </Link>
                        {user && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg">
                                <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
                                <span className="text-xs text-gray-500">tokens</span>
                            </div>
                        )}
                        {user && <UserMenu />}
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <Link href="/dashboard/instagram" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-4 group">
                            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Content Calendar</h1>
                        <p className="text-gray-500">Manage and publish your scheduled content.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => handleMonthChange(-1)} className="p-2 hover:bg-white/10 rounded-full transition">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="text-lg font-semibold min-w-[140px] text-center">
                            {new Date(currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: 'UTC' })}
                        </span>
                        <button onClick={() => handleMonthChange(1)} className="p-2 hover:bg-white/10 rounded-full transition">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {planSummary?.quality_report && (
                    <div className={`mb-6 rounded-xl border p-4 ${planSummary.quality_report.qualityWarning ? "border-amber-400/30 bg-amber-400/10" : "border-teal-400/25 bg-teal-400/10"}`}>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <p className="text-sm font-semibold text-white">
                                Planner Quality Report
                            </p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 uppercase">
                                {planSummary.quality_report.mode || planSummary.quality_mode || "pro"}
                            </span>
                            {typeof planSummary.quality_report.overallScore === "number" && (
                                <span className="text-xs text-teal-300">
                                    Score: {Math.round(planSummary.quality_report.overallScore)}/100
                                </span>
                            )}
                        </div>
                        {Array.isArray(planSummary.quality_report.qualityGaps) && planSummary.quality_report.qualityGaps.length > 0 ? (
                            <p className="text-xs text-amber-200">
                                Needs attention: {planSummary.quality_report.qualityGaps.join(", ")}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-300">
                                This plan passed quality thresholds and includes research-backed stage evidence.
                            </p>
                        )}
                    </div>
                )}

                <p className="text-xs text-gray-500 mb-3">
                    {loading ? "Loading posts..." : `${posts.length} posts loaded`}
                </p>

                {/* Calendar Grid */}
                <div className="border border-white/10 rounded-xl bg-black/40 overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.02]">
                        {DAYS_OF_WEEK.map(day => (
                            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 auto-rows-[140px] divide-x divide-white/10 bg-white/[0.01]">
                        {calendarCells.map((cell, i) => (
                            <div key={cell.dateStr ?? `empty-${i}`} className={`relative p-2 group ${!cell.isCurrentMonth ? 'bg-white/[0.02] opacity-50' : ''} border-b border-white/10`}>
                                {cell.date && (
                                    <span className={`text-sm font-medium ${cell.isCurrentMonth ? 'text-gray-400' : 'text-gray-600'}`}>{cell.date}</span>
                                )}
                                <div className="mt-2 space-y-1.5 overflow-y-auto max-h-[100px] hide-scrollbar">
                                    {cell.posts.map(post => (
                                        <button
                                            key={post.id}
                                            onClick={() => setSelectedPost(post)}
                                            className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group/post relative"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <FunnelBadge stage={post.funnel_stage} />
                                                {post.status === 'published' && <span className="text-[10px] text-green-400">Published</span>}
                                            </div>
                                            <p className="text-xs text-gray-300 truncate font-medium">{post.title || post.pillar}</p>
                                            <div className="absolute top-1 right-1 opacity-0 group-hover/post:opacity-100 transition-opacity">
                                                <FormatIcon format={post.format} className="w-3 h-3 text-gray-500" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Post Detail Modal */}
                {selectedPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <div onClick={() => setSelectedPost(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
                        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col">

                            {/* Header */}
                            <div className="flex items-start justify-between p-6 border-b border-white/10 bg-white/[0.02]">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">{selectedPost.title || selectedPost.pillar}</h2>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={selectedPost.status} />
                                        <span className="text-sm text-gray-500">•</span>
                                        <span className="text-sm text-gray-400">{new Date(selectedPost.date).toLocaleDateString()}</span>
                                        <span className="text-sm text-gray-500">•</span>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                            <FormatIcon format={selectedPost.format} />
                                            {selectedPost.format}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">

                                {selectedPost.generated_assets && selectedPost.generated_assets.length > 0 && (
                                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                                        <img src={selectedPost.generated_assets[0].url} alt="Post asset" className="w-full h-auto max-h-[300px] object-cover" />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Funnel Stage</span>
                                        <div className="flex items-center gap-2">
                                            <FunnelBadge stage={selectedPost.funnel_stage} />
                                            <span className="text-sm text-gray-300">{selectedPost.funnel_stage === 'TOFU' ? 'Awareness' : selectedPost.funnel_stage === 'MOFU' ? 'Nurture' : 'Conversion'}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Content Pillar</span>
                                        <span className="text-sm text-gray-300">{selectedPost.pillar}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Caption</h3>
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-4">
                                        <div>
                                            <span className="text-xs text-teal-400 font-medium mb-1 block">HOOK</span>
                                            <p className="text-sm text-white font-medium">{selectedPost.caption_hook}</p>
                                        </div>
                                        <div className="w-full h-px bg-white/5" />
                                        <div>
                                            <span className="text-xs text-gray-500 font-medium mb-1 block">BODY</span>
                                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedPost.caption_body || selectedPost.meta?.description}</p>
                                        </div>
                                        <div className="w-full h-px bg-white/5" />
                                        <div>
                                            <span className="text-xs text-blue-400 font-medium mb-1 block">HASHTAGS</span>
                                            <p className="text-sm text-blue-300/80">{selectedPost.hashtags?.map(t => `#${t}`).join(" ")}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedPost.meta?.why_it_works && (
                                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">Why It Works</span>
                                        <p className="text-sm text-purple-200/80">{selectedPost.meta.why_it_works}</p>
                                    </div>
                                )}

                                {selectedPost.meta?.engagement_tip && (
                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">Engagement Tip</span>
                                        <p className="text-sm text-amber-200/80">{selectedPost.meta.engagement_tip}</p>
                                    </div>
                                )}

                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3 rounded-b-2xl">
                                <button onClick={() => setSelectedPost(null)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                    Close
                                </button>
                                {selectedPost.status !== "published" && (
                                    <button
                                        onClick={() => handlePublish(selectedPost)}
                                        disabled={publishing}
                                        className="px-5 py-2 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex items-center gap-2"
                                    >
                                        {publishing ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Publishing...
                                            </>
                                        ) : (
                                            "Publish to Instagram"
                                        )}
                                    </button>
                                )}
                                {selectedPost.status === "published" && (
                                    <a
                                        href={selectedPost.instagram_permalink || `https://instagram.com`}
                                        className="px-5 py-2 text-sm font-semibold bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View on Instagram
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default function CalendarPage() {
    return (
        <Suspense fallback={<CalendarPageFallback />}>
            <CalendarPageContent />
        </Suspense>
    )
}
