import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xkdhgomqrxqybiyahyyw.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZGhnb21xcnhxeWJpeWFoeXl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAxNTY4OCwiZXhwIjoyMDg2NTkxNjg4fQ.lV8Wpb1V36SeAE8IFkeOiJ93oV33bPjMEyc-AXcLWPA";

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// User already created in previous run
const userId = "32fa6763-2f7a-4626-bf5e-141150cf0f68";
console.log(`Using existing user: ${userId}`);

// ── Step 2: Populate profile ──
console.log("Step 2: Populating profile...");

const voiceSample = `Buildings That Get Built. Imagine That.

Most architects are brilliant at designing. We're brilliant at designing things that make it through planning, stay on budget, and turn out how you imagined. Novel concept.

You know the stories. We all do. The architect who ghosts you after signing. The one who treats your budget like a suggestion. The one who makes you feel daft for asking questions.

Whether you're building twenty flats that need to sell, a home extension that needs to work, or an investment property that needs to stack up—you need an architect who treats your project like it matters. Which sounds obvious. But here we are.

Turns out availability shouldn't be a differentiator. But it is.`;

const profileData = {
  id: userId,
  email: "chris@jsa.design",
  display_name: "JSA Architects",
  business_name: "JSA Architects",
  business_description:
    "Employee-owned architectural firm across the Midlands. 97% planning approval rate, 700+ buildings designed and delivered since 2002. 4 studios across Derby, Nottingham, Lichfield, and Solihull. Services include residential architecture (extensions, renovations, new builds), commercial & development projects, interior design, planning applications, and construction support.",
  website_url: "https://jsa.design",
  industry: "Architecture",
  location: "Midlands, UK (Derby, Nottingham, Lichfield, Solihull)",
  target_audience:
    "Property developers, landlords, house builders, and business-owner homeowners who treat projects like investments. Results-focused professionals who value efficiency, ROI, and expertise over emotion.",
  brand_voice: "Sharp",
  tone: "Witty",
  voice_sample: voiceSample,
  instagram_handle: "jsa.architects.uk",
  linkedin_handle: "JSA Architects",
  offers:
    "Residential architecture (extensions, renovations, new builds), Commercial & development projects (multi-unit, investment properties), Interior design, Planning applications, Construction support",
  usp: "97% planning approval rate (first submission, most of the time). 700+ buildings delivered. 20+ years navigating Midlands planning authorities. Employee-owned. Actually answer the phone. Design within your means—no surprises, no budget creep.",
  primary_cta: "Book a Call",
  proof_points:
    "97% planning approval rate. 700+ buildings designed and delivered. 500+ clients served since 2002. 4 studios across the Midlands. 20+ years in business. Employee-owned. Relationships spanning decades with repeat clients.",
  goals:
    "Shift revenue split to 70% commercial / 30% residential. Dominate organic search in 8 Midlands locations. Position as architects for people who treat projects like investments.",
  desired_outcomes:
    "More commercial clients (developers, landlords, house builders). Higher-value projects. Market dominance in Sutton Coldfield and surrounding areas. Beat JAB Design in target locations.",
  content_pillars: [
    "Planning Expertise",
    "Collaborative Approach",
    "Accessibility & Communication",
    "Budget Respect",
    "Proven Track Record",
  ],
  use_case: "Agency",
  onboarding_complete: true,
};

const { error: profileError } = await admin
  .from("profiles")
  .upsert(profileData, { onConflict: "id" });

if (profileError) {
  console.error("Profile error:", profileError.message);
  // Try without optional columns
  delete profileData.use_case;
  delete profileData.voice_sample;
  const { error: retryError } = await admin
    .from("profiles")
    .upsert(profileData, { onConflict: "id" });
  if (retryError) {
    console.error("Profile retry error:", retryError.message);
    process.exit(1);
  }
}
console.log("Profile populated.");

// ── Step 3: Create Instagram platform profile ──
console.log("Step 3: Creating Instagram platform profile...");

const instagramProfile = {
  user_id: userId,
  platform: "instagram",
  tone: "Sharp + Playful",
  voice_sample: `Client: 'The kitchen feels cramped.'

Us: 'Because it's in the wrong place.'

Client: 'Can we move it?'

Us: 'Can we? Should we? Let's find out.'

[Result: We moved it. House makes sense now.]

Sometimes the answer isn't a bigger kitchen. It's a smarter house.`,
  copy_examples: [
    `Client: 'Can we fit a wine cellar under the stairs?'\nUs: 'Can you fit wine bottles under stairs?'\nClient: 'Good point.'\nUs: 'We know things.'\n\n[Link in bio for projects that actually work.]`,
    `Before: A house that fought against itself.\nAfter: A house that makes sense.\n\nNo walls were harmed in the making of this renovation. (Okay, three were. But they deserved it.)\n\n97% planning approval. 700+ projects delivered. We know what we're doing.`,
    `'Will I need to sell a kidney?'\n\nNo. But you will need an honest conversation about what's achievable.\n\nChampagne tastes, lemonade budget? We're good at it. Great design isn't about spending more—it's about spending smarter.\n\nYou tell us what you can't compromise on. We'll tell you where you can.`,
  ],
  style_description: {
    writing_style: "short & punchy",
    voice_traits: [
      "Sharp wit",
      "Self-aware humor",
      "Observational",
      "British dry humor",
      "Playful dialogue format",
      "Concrete visual language",
    ],
    banned_words: [
      "actually",
      "literally",
      "really",
      "very",
      "simply",
      "just",
      "drama",
      "nightmare",
      "journey",
      "chaos",
      "disaster",
      "solutions",
      "innovative",
      "innovation",
      "game-changer",
      "cutting-edge",
      "state-of-the-art",
      "world-class",
      "next-generation",
      "revolutionary",
      "passionate",
      "dedicated",
      "committed",
      "excited",
      "thrilled",
      "delighted",
      "seamless",
      "effortless",
      "unique",
      "bespoke",
      "premium",
      "luxury",
      "exclusive",
      "transform",
      "transformation",
      "empower",
      "leverage",
      "synergy",
      "optimize",
      "streamline",
    ],
    guidelines:
      "40% professional credibility, 60% personality. Full permission to play with wit. Behind-the-scenes content with humor. Self-deprecating jokes about architects. Clever before/afters. Wordplay in captions. Lead with the joke or observation. Keep it brief. End with subtle CTA or question. Never sacrifice clarity for cleverness. No emoji overload. Playful dialogue format works well. Show problem-solving approach. Platform-appropriate—Instagram allows more play.",
  },
  goals: "Build brand awareness and personality",
  primary_cta: "Link in bio",
  content_pillars: [
    "Behind-the-scenes with humor",
    "Before/After project reveals",
    "Problem-solving stories",
    "Self-deprecating architect humor",
    "Client wins & transformations",
  ],
  posting_frequency: 4,
  handle: "jsa.architects.uk",
};

const { error: igError } = await admin
  .from("platform_profiles")
  .upsert(instagramProfile, { onConflict: "user_id,platform" });

if (igError) {
  console.error("Instagram profile error:", igError.message);
  process.exit(1);
}
console.log("Instagram platform profile created.");

// ── Step 4: Create LinkedIn platform profile ──
console.log("Step 4: Creating LinkedIn platform profile...");

const linkedinProfile = {
  user_id: userId,
  platform: "linkedin",
  tone: "Sharp + Substantive",
  voice_sample: `Planning delays cost developers roughly £40K per month.

Which makes our 97% first-submission approval rate less of a brag, more of a business case.

Here's what 700+ projects taught us about getting planning approved efficiently:

1. Planning officers care about precedent more than innovation
2. Incomplete applications get rejected more than 'wrong' applications
3. Pre-app discussions save months on the backend

The strategy: know the rules, know the authority, know when to push and when to conform.

What's been your biggest planning headache?`,
  copy_examples: [
    `Planning delays cost developers roughly £40K per month.\n\nWhich makes our 97% first-submission approval rate less of a brag, more of a business case.\n\nHere's what 700+ projects taught us about getting planning approved efficiently:\n\n1. Planning officers care about precedent more than innovation\n2. Incomplete applications get rejected more than 'wrong' applications\n3. Pre-app discussions save months on the backend\n\nThe strategy: know the rules, know the authority, know when to push and when to conform.\n\nWhat's been your biggest planning headache?`,
    `Most architects are brilliant at designing.\n\nWe're brilliant at designing things that make it through planning, stay on budget, and turn out how you imagined.\n\nNovel concept.\n\nAfter 700+ projects across the Midlands, here's what we've learned about the gap between "great design" and "great results":\n\nThe best design in the world means nothing if it doesn't get approved. Or if it costs 40% more than the budget. Or if it looks nothing like the renders.\n\nWe design for reality. Not for awards.\n\n97% planning approval. 500+ clients. 20+ years.\n\nSometimes boring facts beat exciting promises.`,
    `"Why hire an architect when a builder could do the job?"\n\nBecause builders build. Architects think first, then build.\n\nWe work out how to use your space better. How to get planning approved faster. How to avoid expensive mistakes before they happen.\n\nThink of us as the people who save you money by spending it smarter.\n\nPlus, planning officers tend to take architects more seriously than "trust me, it'll be fine."`,
  ],
  style_description: {
    writing_style: "mixed",
    voice_traits: [
      "Data-led opening",
      "Sharp observations",
      "Dry wit (not jokes)",
      "Educational with a point of view",
      "Confident-but-humble",
      "British understatement",
    ],
    banned_words: [
      "actually",
      "literally",
      "really",
      "very",
      "simply",
      "just",
      "drama",
      "nightmare",
      "journey",
      "chaos",
      "disaster",
      "solutions",
      "innovative",
      "innovation",
      "game-changer",
      "cutting-edge",
      "state-of-the-art",
      "world-class",
      "next-generation",
      "revolutionary",
      "passionate",
      "dedicated",
      "committed",
      "excited",
      "thrilled",
      "delighted",
      "seamless",
      "effortless",
      "unique",
      "bespoke",
      "premium",
      "luxury",
      "exclusive",
      "transform",
      "transformation",
      "empower",
      "leverage",
      "synergy",
      "optimize",
      "streamline",
    ],
    guidelines:
      "70% professional credibility, 30% personality. Lead with insight or data. Follow with substance and value. Personality in the framing, not the facts. Dry wit, not jokes. Educational content with a point of view. Open with insight or observation (sharp but serious). Body delivers value, data, substance. Close with takeaway or engagement question. Professional tone throughout. End with engagement question when appropriate. Use 'you/your' 2x more than 'we/our/us'. Show don't tell. One customer success story beats 10 feature descriptions.",
  },
  goals:
    "Establish expertise with commercial audience. Attract property developers, landlords, and house builders.",
  primary_cta: "Book a project feasibility call",
  content_pillars: [
    "Planning data & insights",
    "Industry observations with sharp POV",
    "Case studies & project wins",
    "Commercial property expertise",
    "Educational content for developers",
  ],
  posting_frequency: 3,
  handle: "JSA Architects",
};

const { error: liError } = await admin
  .from("platform_profiles")
  .upsert(linkedinProfile, { onConflict: "user_id,platform" });

if (liError) {
  console.error("LinkedIn profile error:", liError.message);
  process.exit(1);
}
console.log("LinkedIn platform profile created.");

// ── Step 5: Give them starting tokens ──
console.log("Step 5: Setting up token balance...");

const { error: tokenError } = await admin.from("token_balances").upsert(
  {
    user_id: userId,
    balance: 200,
  },
  { onConflict: "user_id" }
);

if (tokenError) {
  console.error("Token balance error:", tokenError.message);
}

console.log("\n✅ JSA Architects onboarded successfully!");
console.log("───────────────────────────────────────");
console.log(`Email:    chris@jsa.design`);
console.log(`Password: Chris#2026`);
console.log(`User ID:  ${userId}`);
console.log(`Platforms: Instagram + LinkedIn`);
console.log(`Tokens:   200`);
console.log("───────────────────────────────────────");
