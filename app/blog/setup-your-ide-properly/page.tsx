import Link from "next/link"

export default function IdeSetupArticle() {
  return (
    <main className="bg-black text-white min-h-screen">
      <article className="relative max-w-3xl mx-auto px-6 py-24">

        {/* Back to blog */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="text-sm text-gray-400 hover:text-teal-400 transition"
          >
            ← Back to all articles
          </Link>
        </div>

        {/* Header */}
        <div className="mb-16">
          <p className="text-sm text-gray-400 mb-2">4 March 2026</p>
          <p className="text-teal-400 text-sm font-medium tracking-wide uppercase mb-4">
            Developer Guide
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6">
            Setting Up Your IDE Properly,{" "}
            <span className="text-teal-400">From Scratch</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Most people open VS Code, install a dark theme, and think they&apos;re done.
            They&apos;re not. This is the setup I wish someone had given me from day one.
          </p>
        </div>

        {/* Article Body */}
        <div className="space-y-16 text-gray-300 leading-relaxed">

          <p className="text-lg text-gray-400">
            They&apos;re one accidental commit away from leaking an API key, working twice as hard as they need to,
            and producing code that breaks the moment someone else touches it. So start here.
          </p>

          {/* Step 1 */}
          <section>
            <StepHeading number={1} title="Pick your editor and install it" />
            <p className="mb-4">If you&apos;re not already on one of these, choose now:</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-teal-400 mt-1">→</span>
                <div>
                  <span className="text-white font-medium">VS Code</span>
                  <span className="text-gray-400"> — free, universal, works with everything. Start here if you&apos;re unsure.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-400 mt-1">→</span>
                <div>
                  <span className="text-white font-medium">Cursor</span>
                  <span className="text-gray-400"> — VS Code with AI built in. Upgrade once you&apos;re comfortable with the basics.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-400 mt-1">→</span>
                <div>
                  <span className="text-white font-medium">Antigravity</span>
                  <span className="text-gray-400"> — Google&apos;s agent-first IDE. Use this if you&apos;re building full projects and want AI running tasks in parallel, not just completing your sentences.</span>
                </div>
              </li>
            </ul>
            <p className="text-gray-400">
              For this guide I&apos;ll reference VS Code and Cursor. Antigravity works differently — it&apos;s less about
              configuration and more about how you orchestrate agents.
            </p>
            <p className="mt-4 text-gray-400">Download, install, open. You should be looking at a blank workspace.</p>
          </section>

          {/* Step 2 */}
          <section>
            <StepHeading number={2} title="Set up your project folder structure before touching any code" />
            <p className="mb-6">Before writing a single line, get this right:</p>
            <CodeBlock>{`my-project/
├── .env            ← your secrets live here (APIs mostly)
├── .env.example    ← placeholder version, safe to commit
├── .gitignore      ← tells git what to ignore
├── src/            ← all your source code
└── README.md`}</CodeBlock>
            <p className="mt-6 mb-4">
              The <code className="text-teal-400 font-mono text-sm">.env</code> file is where all API keys, database passwords, and tokens live.
              It never gets committed. Ever.
            </p>
            <p className="mb-4">Create your <code className="text-teal-400 font-mono text-sm">.gitignore</code> immediately and add this at minimum:</p>
            <CodeBlock>{`.env
.env.local
.env*.local
*.pem
*.key
node_modules/
.DS_Store`}</CodeBlock>
            <p className="mt-4 text-gray-400">
              If you skip this step and commit a secret key to GitHub, you&apos;ll spend your afternoon revoking and
              rotating credentials. Ask me how I know.
            </p>
          </section>

          {/* Step 3 */}
          <section>
            <StepHeading number={3} title="Initialise git straight away" />
            <p className="mb-4">
              Don&apos;t wait until you have code worth saving. Start version control from the first file.
            </p>
            <CodeBlock>{`git init
git add .gitignore
git commit -m "init"`}</CodeBlock>
            <p className="mt-6 mb-4">Then create a repo on GitHub and connect it:</p>
            <CodeBlock>{`git remote add origin git@github.com:yourname/your-repo.git
git push -u origin main`}</CodeBlock>
            <p className="mt-6 mb-4">
              Use SSH for authentication, not HTTPS. Generate an SSH key if you haven&apos;t:
            </p>
            <CodeBlock>{`ssh-keygen -t ed25519 -C "your@email.com"`}</CodeBlock>
            <p className="mt-4 text-gray-400">
              Add the public key to GitHub under Settings → SSH Keys. You&apos;ll never type a password again.
            </p>
          </section>

          {/* Step 4 */}
          <section>
            <StepHeading number={4} title="Sign your commits" />
            <p className="mb-4">
              This one takes five minutes and most developers skip it entirely.
            </p>
            <p className="mb-6 text-gray-400">
              Commit signing means every commit is cryptographically verified as coming from you. If anyone ever
              compromises your account or tries to push fake commits, they can&apos;t fake the signature.
            </p>
            <CodeBlock>{`git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true`}</CodeBlock>
            <p className="mt-4 text-gray-400">
              GitHub shows a green &quot;Verified&quot; badge on every signed commit. Small thing. Looks professional. Protects you.
            </p>
          </section>

          {/* Step 5 */}
          <section>
            <StepHeading number={5} title="Install a secret scanner" />
            <p className="mb-4 text-gray-400">
              <code className="text-teal-400 font-mono text-sm">.gitignore</code> is your first line of defence. But it&apos;s not foolproof — you can still accidentally
              stage a file with a hardcoded key in it.
            </p>
            <p className="mb-4">Install gitleaks:</p>
            <CodeBlock>{`brew install gitleaks`}</CodeBlock>
            <p className="mt-6 text-gray-400">
              Then add it as a pre-commit hook so it scans your staged files every time you commit. If it finds an
              API key pattern, it blocks the commit entirely.
            </p>
            <p className="mt-4 text-gray-400">
              One accidental push of a live AWS key to a public repo costs you a four-figure cloud bill from bots
              that scrape GitHub continuously. This tool costs you nothing.
            </p>
          </section>

          {/* Step 6 */}
          <section>
            <StepHeading number={6} title="Set up auto-formatting" />
            <p className="mb-4">Stop thinking about formatting. Just make it automatic.</p>
            <p className="mb-4">Install Prettier for JavaScript/TypeScript:</p>
            <CodeBlock>{`npm install --save-dev prettier`}</CodeBlock>
            <p className="mt-6 mb-4">Create a <code className="text-teal-400 font-mono text-sm">.prettierrc</code>:</p>
            <CodeBlock>{`{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}`}</CodeBlock>
            <p className="mt-6 mb-4">Then in VS Code settings (Cmd+Shift+P → Open User Settings JSON):</p>
            <CodeBlock>{`{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}`}</CodeBlock>
            <p className="mt-6 mb-4">Every file formats itself on save. For Python, use Black instead:</p>
            <CodeBlock>{`pip install black`}</CodeBlock>
            <p className="mt-4 text-gray-400">Same principle — format on save, zero manual effort.</p>
          </section>

          {/* Step 7 */}
          <section>
            <StepHeading number={7} title="Add linting" />
            <p className="mb-4 text-gray-400">
              Formatting fixes how code looks. Linting catches how code <em className="text-white">behaves</em>.
            </p>
            <p className="mb-4">ESLint for JavaScript/TypeScript:</p>
            <CodeBlock>{`npm install --save-dev eslint
npx eslint --init`}</CodeBlock>
            <p className="mt-6 mb-4">Add auto-fix on save to your VS Code settings:</p>
            <CodeBlock>{`{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}`}</CodeBlock>
            <p className="mt-4 text-gray-400">
              ESLint catches undefined variables, unused imports, suspicious patterns, and dozens of other issues
              before they become bugs. It runs silently and fixes what it can automatically.
            </p>
          </section>

          {/* Step 8 */}
          <section>
            <StepHeading number={8} title="Enable TypeScript strict mode" />
            <p className="mb-4 text-gray-400">
              If you&apos;re writing TypeScript (and you should be), half the configuration value comes from turning
              strict mode on.
            </p>
            <p className="mb-4">In your <code className="text-teal-400 font-mono text-sm">tsconfig.json</code>:</p>
            <CodeBlock>{`{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}`}</CodeBlock>
            <p className="mt-4 text-gray-400">
              Strict TypeScript forces you to handle null cases, prevents implicit any types, and catches entire
              categories of runtime errors at compile time. It feels restrictive for the first hour. After that,
              it catches bugs before you can even run the code.
            </p>
          </section>

          {/* Step 9 */}
          <section>
            <StepHeading number={9} title="Set up pre-commit hooks" />
            <p className="mb-4 text-gray-400">
              You now have linting, formatting, and secret scanning. Pre-commit hooks make all of them run
              automatically before every single commit.
            </p>
            <p className="mb-4">Install Husky:</p>
            <CodeBlock>{`npm install --save-dev husky
npx husky init`}</CodeBlock>
            <p className="mt-6 mb-4">Edit <code className="text-teal-400 font-mono text-sm">.husky/pre-commit</code>:</p>
            <CodeBlock>{`#!/bin/sh
gitleaks protect --staged
npx tsc --noEmit
npx eslint .
npx prettier --check .`}</CodeBlock>
            <p className="mt-6 mb-3">Now every commit automatically:</p>
            <ul className="space-y-2 text-gray-400">
              {[
                "Scans for leaked secrets",
                "Type-checks your code",
                "Lints your code",
                "Checks formatting",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-teal-400">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-gray-400">
              If any of these fail, the commit is blocked. You fix it, then commit. Nothing broken ever makes it
              into version control.
            </p>
          </section>

          {/* Step 10 */}
          <section>
            <StepHeading number={10} title="Configure your AI assistant" />
            <p className="mb-4 text-gray-400">This is where setup gets compounding returns.</p>
            <p className="mb-4">
              In Cursor, create a <code className="text-teal-400 font-mono text-sm">.cursorrules</code> file in your project root. This is a plain text file
              that tells the AI exactly how your project works — every time, without you having to explain it:
            </p>
            <CodeBlock>{`You are working on a Next.js 15 TypeScript project using Tailwind CSS.

- Always use TypeScript with strict mode
- Use named exports, not default exports for components
- No inline styles — use Tailwind classes only
- All API routes follow the pattern in /app/api
- Never commit secrets or hardcode environment variables
- Write clean, minimal code — no unnecessary abstractions`}</CodeBlock>
            <p className="mt-4 text-gray-400">
              Adjust this to your stack. The more specific you are, the more useful the AI becomes. A well-configured
              rules file means you stop re-explaining context on every prompt.
            </p>
          </section>

          {/* Step 11 */}
          <section>
            <StepHeading number={11} title="Install the extensions that actually matter" />
            <p className="mb-6 text-gray-400">Skip the extension rabbit hole. These are the ones worth having:</p>
            <div className="space-y-4">
              {[
                {
                  name: "Error Lens",
                  desc: "Shows linting and TypeScript errors inline on the same line as the problem. You see issues the moment you write them, not when you scroll to the problems panel.",
                },
                {
                  name: "GitLens",
                  desc: "Shows who wrote every line, when, and why. Inline blame annotations, commit history per line, full context without leaving the editor.",
                },
                {
                  name: "Prettier",
                  desc: "Already installed via npm, but you also need the VS Code extension for format-on-save to work.",
                },
                {
                  name: "ESLint",
                  desc: "Same as above — the extension handles the editor integration.",
                },
                {
                  name: "Your language/framework pack",
                  desc: "Whatever is most downloaded for your stack. For Python: Python extension. For React: ES7 React snippets.",
                },
              ].map((ext) => (
                <div key={ext.name} className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3">
                  <span className="text-teal-400 mt-0.5">→</span>
                  <div>
                    <span className="text-white font-medium">{ext.name}</span>
                    <span className="text-gray-400"> — {ext.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-gray-400">That&apos;s it. More extensions slow VS Code down and create conflicts.</p>
          </section>

          {/* Step 12 */}
          <section>
            <StepHeading number={12} title="Add path aliases" />
            <p className="mb-4 text-gray-400">This is a small one but it adds up. Replace this:</p>
            <CodeBlock>{`import { Button } from '../../../components/ui/Button'`}</CodeBlock>
            <p className="mt-6 mb-4">With this:</p>
            <CodeBlock>{`import { Button } from '@/components/ui/Button'`}</CodeBlock>
            <p className="mt-6 mb-4">In <code className="text-teal-400 font-mono text-sm">tsconfig.json</code>:</p>
            <CodeBlock>{`{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`}</CodeBlock>
            <p className="mt-4 text-gray-400">
              Cleaner imports, faster navigation, zero confusion about relative paths.
            </p>
          </section>

          {/* Step 13 */}
          <section>
            <StepHeading number={13} title="Set up your integrated terminal properly" />
            <p className="mb-4 text-gray-400">
              Stop alt-tabbing to a separate terminal. Everything runs inside the IDE.
            </p>
            <p className="mb-4 text-gray-400">
              Ctrl+backtick opens the terminal in VS Code. Split it horizontally — one pane for your dev server
              running continuously, one pane for commands.
            </p>
            <p className="mb-4">Set your default shell explicitly in settings:</p>
            <CodeBlock>{`{
  "terminal.integrated.defaultProfile.osx": "zsh"
}`}</CodeBlock>
            <p className="mt-4 text-gray-400">
              If you use oh-my-zsh with the git plugin, your terminal shows the current branch, staged/unstaged
              status, and last command exit code inline in the prompt. Worth the ten-minute setup.
            </p>
          </section>

          {/* Step 14 */}
          <section>
            <StepHeading number={14} title="Scan your dependencies" />
            <p className="mb-4 text-gray-400">Before you ship anything, audit what you&apos;ve imported.</p>
            <CodeBlock>{`npm audit          # shows known vulnerabilities in your packages
npm audit fix      # auto-fixes what it can`}</CodeBlock>
            <p className="mt-6 text-gray-400">
              Enable Dependabot on your GitHub repo (Settings → Security → Dependabot alerts). It monitors your
              dependencies continuously and opens PRs automatically when a vulnerability is found.
            </p>
            <p className="mt-4 text-gray-400">This is entirely passive once it&apos;s enabled. It watches so you don&apos;t have to.</p>
          </section>

          {/* Summary */}
          <section className="border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Where you are now</h2>
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {[
                "Secrets protected at the file level and at the commit level",
                "Auto-formatting and linting running on every save and every commit",
                "TypeScript catching type errors before they become runtime bugs",
                "An AI assistant that understands your project without being briefed",
                "Version control set up properly from the start",
                "Dependency scanning running in the background",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-teal-400/5 border border-teal-400/10 rounded-lg px-4 py-3">
                  <span className="text-teal-400 text-sm mt-0.5">✓</span>
                  <p className="text-gray-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed">
              This setup took under an hour. It will save you dozens of hours across every project you build on it.
            </p>
            <p className="text-white font-medium mt-4">
              The developers who ship reliably aren&apos;t more talented. They just don&apos;t waste time on problems that
              infrastructure should have caught.
            </p>
          </section>

        </div>

        {/* CTA */}
        <section className="mt-20 bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Want systems like this in your business?
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The same principles apply beyond code. Book a free audit and I&apos;ll show you where time and money are
            leaking in your operations.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-medium rounded-xl hover:bg-teal-300 transition"
          >
            Book a Free Audit
          </Link>
        </section>

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            ← All Articles
          </Link>
          <Link
            href="/blog/biggest-automation-mistakes-service-businesses"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            Read: Biggest Automation Mistakes →
          </Link>
          <Link
            href="/blog/essential-business-systems"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            Read: 3 Systems Every Business Needs →
          </Link>
        </div>

      </article>
    </main>
  )
}

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-teal-400/10 border border-teal-400/30 text-teal-400 font-mono font-bold text-sm">
        {number}
      </span>
      <h2 className="text-2xl font-bold text-white">
        {title}
      </h2>
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-gray-900 border border-white/5 rounded-xl p-5 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
      <code>{children}</code>
    </pre>
  )
}
