"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  viewport: { once: true, margin: "-100px" },
}

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease },
}

type BlogPost = {
  title: string
  excerpt: string
  slug: string
  image: string
  date: string
  publishDate?: string
}

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  return (
    <main className="bg-black min-h-screen py-24 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{ maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
          whileHover={{ x: -4, color: "#2dd4bf" }}
          className="inline-flex items-center gap-2 mb-12 text-sm font-medium text-gray-400 transition-colors"
        >
          <span>&larr;</span>
          Back to home
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease }}
          className="text-7xl md:text-9xl font-bold text-white text-center tracking-tight"
        >
          The <span className="text-teal-400">AI Automation</span> Blog
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
          className="mt-6 text-lg text-gray-400 text-center max-w-3xl mx-auto"
        >
          Free resources, insights, and practical tips designed to help trade businesses grow to their full potential using smart digital systems.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {posts.map((post) => (
            <motion.a
              key={post.slug}
              variants={staggerItem}
              href={`/blog${post.slug}`}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-teal-400/30 hover:shadow-[0_0_30px_rgba(45,212,191,0.08)] transition-colors"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <Image
                  src={post.image}
                  alt={post.title}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="p-8">
                <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wider">{post.date}</p>
                <h2 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors tracking-tight leading-tight">
                  {post.title}
                </h2>
                <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-teal-400 group-hover:gap-3 transition-all">
                  Read more <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
