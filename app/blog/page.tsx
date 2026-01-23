export default function BlogIndexPage() {
    const posts = [
      {
        title: "Why Most Automation Projects Fail",
        excerpt:
          "The hidden mistakes companies make when implementing automation — and how to avoid them.",
        slug: "automation-projects-fail",
        image: "/blog/automation-fail.jpg",
      },
      {
        title: "The 3 Systems Every Scalable Business Needs",
        excerpt:
          "If your business feels stuck, these are the systems likely holding you back.",
        slug: "essential-business-systems",
        image: "/blog/business-systems.jpg",
      },
    ]
  
    return (
      <main className="bg-black min-h-screen py-24">
        <div className="max-w-7xl mx-auto px-6">
  
          <h1 className="text-9xl font-bold text-white text-center">
          The <span className="text-teal-400">Blog</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 text-center max-w-3xl mx-auto">
          Free resources, insights, and practical tips designed to help trade businesses grow to their full potential using smart digital systems.
          </p>
  
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-teal-400 transition"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
  
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-white group-hover:text-teal-400">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-gray-400">
                    {post.excerpt}
                  </p>
                </div>
              </a>
            ))}
          </div>
  
        </div>
      </main>
    )
  }
  