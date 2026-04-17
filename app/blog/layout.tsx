import BlogNewsletterCTA from "@/app/components/BlogNewsletterCTA"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BlogNewsletterCTA />
    </>
  )
}
