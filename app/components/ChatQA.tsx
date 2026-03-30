"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

export type ChatRole = "assistant" | "user"

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string | ReactNode
  /** If true, message renders as a ReactNode (not a text bubble) */
  isWidget?: boolean
}

export interface ButtonOption {
  value: string
  label: string
  description?: string
}

export interface ChipOption {
  value: string
  label: string
  selected?: boolean
}

// Stable defaults to avoid infinite re-render loops in useEffect
const EMPTY_BUTTONS: ButtonOption[] = []
const EMPTY_CHIPS: ChipOption[] = []

// ─── ChatQA Component ────────────────────────────────────────────────────────

interface ChatQAProps {
  messages: ChatMessage[]
  /** When set, shows an input area at the bottom */
  inputMode?: "none" | "buttons" | "textarea" | "chips"
  /** Button options (when inputMode === "buttons") */
  buttonOptions?: ButtonOption[]
  /** Chip options (when inputMode === "chips") */
  chipOptions?: ChipOption[]
  /** Textarea placeholder */
  placeholder?: string
  /** Whether the textarea is optional (shows skip button) */
  optional?: boolean
  /** Called when user submits text */
  onSubmitText?: (text: string) => void
  /** Called when user clicks a button option */
  onSelectButton?: (value: string) => void
  /** Called when user submits chip selections */
  onSubmitChips?: (selected: string[]) => void
  /** Called when user skips an optional step */
  onSkip?: () => void
  /** Whether generation is in progress (disables input) */
  loading?: boolean
  /** Loading message to show */
  loadingMessage?: string
  /** Child content rendered after messages (e.g. plan results) */
  children?: ReactNode
}

export default function ChatQA({
  messages,
  inputMode = "none",
  buttonOptions = EMPTY_BUTTONS,
  chipOptions = EMPTY_CHIPS,
  placeholder = "Type your answer...",
  optional = false,
  onSubmitText,
  onSelectButton,
  onSubmitChips,
  onSkip,
  loading = false,
  loadingMessage,
  children,
}: ChatQAProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [textValue, setTextValue] = useState("")
  const [selectedChips, setSelectedChips] = useState<string[]>(() =>
    chipOptions.filter((c) => c.selected).map((c) => c.value)
  )

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, loading, children])

  // Sync chip selections when options change
  useEffect(() => {
    setSelectedChips(chipOptions.filter((c) => c.selected).map((c) => c.value))
  }, [chipOptions])

  const handleTextSubmit = () => {
    const trimmed = textValue.trim()
    if (!trimmed || !onSubmitText) return
    onSubmitText(trimmed)
    setTextValue("")
  }

  const toggleChip = (value: string) => {
    setSelectedChips((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Messages */}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`animate-[fadeSlideIn_0.3s_ease-out] ${
            msg.role === "user" ? "flex justify-end" : "flex justify-start"
          }`}
        >
          {msg.isWidget ? (
            <div className="w-full">{msg.content}</div>
          ) : msg.role === "assistant" ? (
            <div className="max-w-[85%] md:max-w-[75%]">
              <div className="px-5 py-4 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.08] text-sm text-gray-200 leading-relaxed">
                {typeof msg.content === "string" ? msg.content : msg.content}
              </div>
            </div>
          ) : (
            <div className="max-w-[85%] md:max-w-[75%]">
              <div className="px-5 py-4 rounded-2xl rounded-tr-md bg-teal-400/10 border border-teal-400/20 text-sm text-teal-300 leading-relaxed">
                {typeof msg.content === "string" ? msg.content : msg.content}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-start animate-[fadeSlideIn_0.3s_ease-out]">
          <div className="max-w-[85%] md:max-w-[75%]">
            <div className="px-5 py-4 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.08] text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:300ms]" />
                </div>
                {loadingMessage && (
                  <span className="text-gray-500 animate-pulse">{loadingMessage}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      {!loading && inputMode !== "none" && (
        <div className="animate-[fadeSlideIn_0.3s_ease-out]">
          {/* Button options */}
          {inputMode === "buttons" && buttonOptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {buttonOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSelectButton?.(opt.value)}
                  className="group px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-teal-400/50 hover:bg-teal-400/10 transition-all text-left"
                >
                  <p className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">
                    {opt.label}
                  </p>
                  {opt.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Textarea */}
          {inputMode === "textarea" && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleTextSubmit()
                    }
                  }}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleTextSubmit}
                  disabled={!textValue.trim()}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    textValue.trim()
                      ? "bg-teal-400 text-black hover:bg-teal-300"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
                {optional && (
                  <button
                    onClick={onSkip}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all"
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Chip selection */}
          {inputMode === "chips" && chipOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {chipOptions.map((chip) => (
                  <button
                    key={chip.value}
                    onClick={() => toggleChip(chip.value)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                      selectedChips.includes(chip.value)
                        ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                        : "border-white/[0.08] bg-white/[0.03] text-gray-400 hover:border-white/20"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onSubmitChips?.(selectedChips)}
                  disabled={selectedChips.length === 0}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selectedChips.length > 0
                      ? "bg-teal-400 text-black hover:bg-teal-300"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue ({selectedChips.length} selected)
                </button>
                {optional && (
                  <button
                    onClick={onSkip}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all"
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Child content (plan results, generated posts, etc.) */}
      {children}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  )
}
