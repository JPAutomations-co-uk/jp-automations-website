"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Question {
  id: string
  question: string
  inputType: "text" | "textarea" | "single-select" | "multi-select" | "number" | "toggle"
  options?: { label: string; value: string }[]
  placeholder?: string
  optional?: boolean
}

export interface ConversationalQAProps {
  questions: Question[]
  onComplete: (answers: Record<string, unknown>) => void
  prefillData?: Record<string, unknown>
  finalButtonLabel?: string
}

interface LockedAnswer {
  questionIndex: number
  question: string
  answer: string | string[] | number | boolean
  displayValue: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDisplayValue(
  answer: string | string[] | number | boolean,
  question: Question
): string {
  if (typeof answer === "boolean") return answer ? "Yes" : "No"
  if (typeof answer === "number") return answer.toLocaleString()
  if (Array.isArray(answer)) {
    const labels = answer.map((v) => {
      const opt = question.options?.find((o) => o.value === v)
      return opt?.label ?? v
    })
    return labels.join(", ")
  }
  // Single select — show label
  if (question.inputType === "single-select") {
    const opt = question.options?.find((o) => o.value === answer)
    return opt?.label ?? answer
  }
  return String(answer)
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ConversationalQA({
  questions,
  onComplete,
  prefillData,
  finalButtonLabel = "Generate",
}: ConversationalQAProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [lockedAnswers, setLockedAnswers] = useState<LockedAnswer[]>([])
  const [textValue, setTextValue] = useState("")
  const [numberValue, setNumberValue] = useState("")
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [toggleValue, setToggleValue] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const totalQuestions = questions.length

  // Auto-scroll to bottom on new question
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [currentIndex, lockedAnswers.length])

  // Focus input when question changes
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 400)
    return () => clearTimeout(timer)
  }, [currentIndex])

  // Pre-populate from prefillData when question changes
  useEffect(() => {
    if (!currentQuestion || !prefillData) return
    const prefill = prefillData[currentQuestion.id]
    if (prefill === undefined || prefill === null) {
      // Reset inputs
      setTextValue("")
      setNumberValue("")
      setSelectedChips([])
      setToggleValue(false)
      return
    }
    switch (currentQuestion.inputType) {
      case "text":
      case "textarea":
        setTextValue("")
        break
      case "number":
        setNumberValue("")
        break
      case "single-select":
        setSelectedChips([])
        break
      case "multi-select":
        setSelectedChips([])
        break
      case "toggle":
        setToggleValue(false)
        break
    }
  }, [currentIndex, currentQuestion, prefillData])

  const submitAnswer = useCallback(
    (value: string | string[] | number | boolean) => {
      if (!currentQuestion) return

      const newAnswers = { ...answers, [currentQuestion.id]: value }
      setAnswers(newAnswers)

      const displayValue = formatDisplayValue(value, currentQuestion)

      // Remove any locked answers at or after this index (for re-edits)
      const newLocked = lockedAnswers.filter(
        (a) => a.questionIndex < currentIndex
      )
      newLocked.push({
        questionIndex: currentIndex,
        question: currentQuestion.question,
        answer: value,
        displayValue,
      })
      setLockedAnswers(newLocked)

      // Reset inputs
      setTextValue("")
      setNumberValue("")
      setSelectedChips([])
      setToggleValue(false)

      if (isLastQuestion) {
        onComplete(newAnswers)
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    },
    [answers, currentIndex, currentQuestion, isLastQuestion, lockedAnswers, onComplete]
  )

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return
    const prevIndex = currentIndex - 1
    const prevQuestion = questions[prevIndex]

    // Remove locked answers from prevIndex onward
    setLockedAnswers((prev) => prev.filter((a) => a.questionIndex < prevIndex))

    // Restore the previous answer into the input
    const prevAnswer = answers[prevQuestion.id]
    switch (prevQuestion.inputType) {
      case "text":
      case "textarea":
        setTextValue(typeof prevAnswer === "string" ? prevAnswer : "")
        break
      case "number":
        setNumberValue(prevAnswer !== undefined ? String(prevAnswer) : "")
        break
      case "single-select":
        setSelectedChips(typeof prevAnswer === "string" ? [prevAnswer] : [])
        break
      case "multi-select":
        setSelectedChips(Array.isArray(prevAnswer) ? (prevAnswer as string[]) : [])
        break
      case "toggle":
        setToggleValue(typeof prevAnswer === "boolean" ? prevAnswer : false)
        break
    }

    // Remove answer
    const newAnswers = { ...answers }
    delete newAnswers[prevQuestion.id]
    setAnswers(newAnswers)

    setCurrentIndex(prevIndex)
  }, [answers, currentIndex, questions])

  const handleTextSubmit = () => {
    const trimmed = textValue.trim()
    if (!trimmed && !currentQuestion?.optional) return
    submitAnswer(trimmed || "")
  }

  const handleNumberSubmit = () => {
    const num = parseInt(numberValue, 10)
    if (isNaN(num) && !currentQuestion?.optional) return
    submitAnswer(isNaN(num) ? 0 : num)
  }

  const handleSkip = () => {
    submitAnswer("")
  }

  const usePrefill = () => {
    if (!currentQuestion || !prefillData) return
    const value = prefillData[currentQuestion.id]
    if (value !== undefined && value !== null) {
      submitAnswer(value as string | string[] | number | boolean)
    }
  }

  const hasPrefill =
    currentQuestion &&
    prefillData &&
    prefillData[currentQuestion.id] !== undefined &&
    prefillData[currentQuestion.id] !== null &&
    prefillData[currentQuestion.id] !== ""

  const prefillValue = hasPrefill
    ? formatDisplayValue(
        prefillData![currentQuestion!.id] as string | string[] | number | boolean,
        currentQuestion!
      )
    : null

  const buttonLabel = isLastQuestion ? finalButtonLabel : "Next"

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">
            {currentIndex + 1} of {totalQuestions}
          </span>
          {currentIndex > 0 && (
            <button
              onClick={handleBack}
              className="text-xs text-gray-500 hover:text-teal-400 transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-teal-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Locked answers */}
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {lockedAnswers.map((locked) => (
            <motion.div
              key={locked.questionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {/* Question */}
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06] text-sm text-gray-400">
                    {locked.question}
                  </div>
                </div>
              </div>
              {/* Answer */}
              <div className="flex justify-end">
                <div className="max-w-[85%]">
                  <div className="px-4 py-3 rounded-2xl rounded-tr-md bg-teal-400/10 border border-teal-400/20 text-sm text-teal-300">
                    {locked.displayValue || <span className="text-gray-500 italic">Skipped</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Current question */}
      {currentQuestion && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-4"
        >
          {/* Question bubble */}
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              <div className="px-5 py-4 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.08] text-sm text-gray-200 leading-relaxed">
                {currentQuestion.question}
              </div>
            </div>
          </div>

          {/* Prefill suggestion */}
          {hasPrefill && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <span className="text-xs text-gray-500 flex-1 truncate">
                Previous: <span className="text-gray-400">{prefillValue}</span>
              </span>
              <button
                onClick={usePrefill}
                className="shrink-0 text-xs font-medium text-teal-400 hover:text-teal-300 px-3 py-1 rounded-lg bg-teal-400/10 border border-teal-400/20 hover:bg-teal-400/20 transition-all"
              >
                Use this
              </button>
            </motion.div>
          )}

          {/* Input area */}
          <div className="space-y-3">
            {/* Text input */}
            {currentQuestion.inputType === "text" && (
              <div>
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleTextSubmit()
                    }
                  }}
                  placeholder={currentQuestion.placeholder || "Type your answer..."}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm"
                />
              </div>
            )}

            {/* Textarea */}
            {currentQuestion.inputType === "textarea" && (
              <div>
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleTextSubmit()
                    }
                  }}
                  rows={3}
                  placeholder={currentQuestion.placeholder || "Type your answer..."}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-sm"
                />
              </div>
            )}

            {/* Number input */}
            {currentQuestion.inputType === "number" && (
              <div>
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="number"
                  value={numberValue}
                  onChange={(e) => setNumberValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleNumberSubmit()
                    }
                  }}
                  placeholder={currentQuestion.placeholder || "Enter a number..."}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            )}

            {/* Single select chips */}
            {currentQuestion.inputType === "single-select" && currentQuestion.options && (
              <div className="flex flex-wrap gap-2">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => submitAnswer(opt.value)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:scale-[1.02] border-white/[0.1] bg-white/[0.03] text-gray-300 hover:border-teal-400/50 hover:bg-teal-400/10 hover:text-teal-400"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Multi-select chips */}
            {currentQuestion.inputType === "multi-select" && currentQuestion.options && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setSelectedChips((prev) =>
                          prev.includes(opt.value)
                            ? prev.filter((v) => v !== opt.value)
                            : [...prev, opt.value]
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        selectedChips.includes(opt.value)
                          ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                          : "border-white/[0.1] bg-white/[0.03] text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle */}
            {currentQuestion.inputType === "toggle" && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setToggleValue(!toggleValue)}
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    toggleValue ? "bg-teal-400" : "bg-white/[0.1]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      toggleValue ? "translate-x-7" : ""
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-300">
                  {toggleValue ? "Yes" : "No"}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              {/* Show submit for text, textarea, number, multi-select, toggle */}
              {currentQuestion.inputType !== "single-select" && (
                <button
                  onClick={() => {
                    switch (currentQuestion.inputType) {
                      case "text":
                      case "textarea":
                        handleTextSubmit()
                        break
                      case "number":
                        handleNumberSubmit()
                        break
                      case "multi-select":
                        if (selectedChips.length > 0) submitAnswer(selectedChips)
                        break
                      case "toggle":
                        submitAnswer(toggleValue)
                        break
                    }
                  }}
                  disabled={
                    (currentQuestion.inputType === "text" && !textValue.trim() && !currentQuestion.optional) ||
                    (currentQuestion.inputType === "textarea" && !textValue.trim() && !currentQuestion.optional) ||
                    (currentQuestion.inputType === "number" && !numberValue && !currentQuestion.optional) ||
                    (currentQuestion.inputType === "multi-select" && selectedChips.length === 0 && !currentQuestion.optional)
                  }
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-teal-400"
                >
                  {isLastQuestion ? finalButtonLabel : buttonLabel}
                  {currentQuestion.inputType === "multi-select" && selectedChips.length > 0 && (
                    <span className="ml-1 opacity-70">({selectedChips.length})</span>
                  )}
                </button>
              )}

              {/* Skip button for optional questions */}
              {currentQuestion.optional && (
                <button
                  onClick={handleSkip}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all"
                >
                  Skip
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Scroll anchor */}
      <div ref={scrollRef} className="h-8" />
    </div>
  )
}
