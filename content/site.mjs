// Amble Films: page copy for services, industries, enterprise, process and FAQs.
// Edit the words, then run: node tools/build.mjs

export const SITE = {
  name: "Amble Films",
  url: "https://amblefilms.in",
  email: "contact@amblefilms.in",
  phone: "+91-87507-59538",
  whatsappDisplay: "+91 87507 59538",
  founder: { name: "Ajit", role: "Founder & Creative Director" },
  social: { youtube: "https://www.youtube.com/@AmbleFilms", instagram: "https://www.instagram.com/amble_films/", linkedin: "https://www.linkedin.com/company/amblefilms/" },
  tagline: "AI-powered films for brands, products and ideas.",
  kind: "AI video production studio",
  description: "Amble Films is an AI video production studio creating brand films, product videos, advertisements, explainers and educational films with generative AI, creative direction and professional post-production."
};

// The three ways in. Every page uses these words, so the difference between them stays clear.
export const CTA = {
  project: { label: "Start a project", href: "/contact/" },
  preview: { label: "Request your free AI video preview", short: "Free AI video preview", href: "/contact/?preview=yes" },
  enterprise: { label: "Discuss an enterprise project", href: "/contact/?need=Enterprise%20%2F%20multi-video%20programme" }
};

// Indicative ranges for the enquiry form. These qualify an enquiry; they are not prices.
export const BUDGETS = ["$100–$300", "$300–$750", "$750–$1,500", "$1,500–$3,000", "$3,000–$5,000", "$5,000+", "Not sure yet", "Enterprise / multi-video engagement"];
export const FROM_PRICE = "Selected AI video projects from $100.";
export const PRICE_NOTE = "Every quote depends on the brief, complexity, length, deliverables and usage.";

// The complimentary preview. Public wording only; the full internal policy is in docs/preview-first-offer.md.
export const PREVIEW = {
  eyebrow: "See it before you commit",
  title: "See your idea on screen before you commit.",
  text: "Tell us what you want to make. For qualified projects, we create a complimentary AI video preview of 30 to 45 seconds, built around your brief. If it isn't right for you, you owe nothing for it and there is no obligation to continue. If you love the direction, we agree the full scope, timeline and price before full production begins.",
  steps: [
    ["Share your brief", "Your brand, what you want to make, who it is for and where it will run. A few lines are enough to begin."],
    ["Watch your preview", "A short AI-generated film in one creative direction, made for your project and ready to review."],
    ["Decide with confidence", "Not right for you? You pay nothing for the preview. Ready to go ahead? We agree scope, timeline and price first."]
  ],
  terms: "One complimentary preview per qualified project. Previews are for review only and are not licensed for publication or commercial use unless the project is commissioned."
};

// Labels used on the Work page and on film cards
export const CATEGORIES = {
  brand: "Brand films", product: "Product films", advertising: "Advertising",
  explainer: "Explainers", education: "Education", concepts: "Creative concepts"
};
// One line per category for the Work page. `service` links to the matching service page.
// `visual` names a licensed stock still in /assets/img/stock (see docs/stock-asset-licenses.md), used only as atmosphere where a category has no film of its own.
export const CATEGORY_INTROS = {
  brand: { line: "Brand films generated with AI and directed around your positioning, so the film carries what your company believes.", service: "brand-films", visual: "bokeh" },
  product: { line: "Your product in light, scale and settings a physical shoot rarely reaches, checked shot by shot for accuracy.", service: "product-films", visual: "smoke" },
  advertising: { line: "Commercials from six seconds to sixty, built on one clear idea and cut for every platform.", service: "advertising-films", visual: "inks" },
  explainer: { line: "Complex ideas made clear in minutes, one step and one picture at a time.", service: "explainer-films" },
  education: { line: "Chapter-by-chapter lesson films with a recurring AI-generated cast, scripted from your syllabus.", service: "educational-films" },
  concepts: { line: "Speculative films we create to explore new ideas, looks and generative techniques.", service: null, visual: "confetti" }
};
export const KINDS = {
  client: { label: "Client film", note: "made for a client" },
  studio: { label: "Studio film", note: "made by Amble Films for its own brand" },
  concept: { label: "Concept film", note: "a speculative film made to explore an idea" },
  study: { label: "Study", note: "a short visual experiment" }
};
// Licensed stock (Mixkit Stock Video Free License, graded by Amble Films). Licences are recorded in docs/stock-asset-licenses.md.
// Used only as atmosphere, never presented as a film or client work.
export const STOCK = {
  bokeh: { alt: "Soft out-of-focus lights drifting on a dark background" },
  smoke: { alt: "A thin ribbon of smoke curling through darkness" },
  inks: { alt: "Clouds of orange, blue and cream ink colliding in liquid" },
  confetti: { alt: "Metallic confetti falling through darkness" }
};

export const SERVICES = [
  {
    slug: "brand-films", name: "Brand Films", need: "Brand film", category: "brand",
    line: "AI brand films that say who you are and why it matters.",
    title: "AI brand films, directed around your positioning",
    h1: "Brand films that say who you are.",
    lead: "A brand film carries what a company believes, in a form people actually watch. We generate its worlds and characters with AI and direct every frame from your positioning, not from a template.",
    receive: ["A creative concept and written treatment", "Script and storyboard for approval", "An AI-generated, directed film, usually one to three minutes", "Music, sound design and a full colour grade", "Shorter cuts for social, presentations and events"],
    uses: ["Website and homepage films", "Company launches and rebrands", "Investor and partner presentations", "Recruitment and culture", "Keynotes and events"],
    deliver: ["Hero film, 60 to 180 seconds", "30 and 15 second cut-downs", "16:9, 9:16 and 1:1 versions", "Captioned and silent versions", "Masters up to 4K"],
    approach: "Brand films start with positioning, not pictures. We define the audience and the single impression the film must leave, then use generative AI to build the world, characters and visual language around it.",
    meta: "AI-generated brand films from Amble Films: concept, script, generative production, editing, sound and grade, with cuts for every platform."
  },
  {
    slug: "product-films", name: "Product Films", need: "Product film", category: "product",
    line: "AI product videos in places and light a shoot rarely reaches.",
    title: "AI product videos for e-commerce, launches and ads",
    h1: "Show the product at its best.",
    lead: "AI product videos that present your product in settings, light and scale a physical shoot would struggle to reach, while staying true to how it looks and works.",
    receive: ["A product treatment and shot list", "A hero product film", "Feature and detail sequences", "Lifestyle and in-context scenes", "Short loops ready for listings and ads"],
    uses: ["E-commerce product pages", "Marketplace listings", "Pre-orders and crowdfunding", "Retail and exhibition screens", "Paid social"],
    deliver: ["Hero film, 30 to 90 seconds", "Feature loops, 6 to 15 seconds", "16:9, 9:16 and 1:1 versions", "Silent versions with on-screen text", "Stills taken from the film"],
    approach: "We work from your product photographs, renders or samples. AI builds the settings and movement around the product, and you check every product shot for accuracy before the film is finished.",
    meta: "AI product videos for e-commerce, listings, launches and ads: hero films, feature loops and every platform format, checked for accuracy."
  },
  {
    slug: "advertising-films", name: "Advertising Films", need: "Advertising film", category: "advertising",
    line: "AI commercials from six seconds to sixty, built on one clear idea.",
    title: "AI advertising films and commercials",
    h1: "One idea, made to be remembered.",
    lead: "AI advertising films for YouTube, paid social, connected TV and cinema, from six seconds to sixty. We start with the idea, then generate and direct the craft around it.",
    receive: ["Creative routes to choose between", "Script and storyboard for approval", "A generated and directed commercial", "Music, sound design and colour", "Edits built to each platform's specifications"],
    uses: ["Brand campaigns", "Paid social and performance", "Seasonal and festive campaigns", "YouTube pre-roll", "Connected TV and cinema"],
    deliver: ["6, 15, 30 and 60 second edits", "16:9, 9:16, 4:5 and 1:1 versions", "Versions with and without supers", "Delivery to platform specifications", "Masters up to 4K"],
    approach: "If you work with an agency, we produce to their script and storyboard as a production partner. If you come to us directly, we develop the idea with you first. Either way, AI makes more versions practical, so each platform gets an edit built for it.",
    meta: "AI advertising videos and commercials for YouTube, paid social, connected TV and cinema, from six seconds to sixty, in every platform format."
  },
  {
    slug: "explainer-films", name: "Explainer Films", need: "Explainer film", category: "explainer",
    line: "AI explainer videos that make complex ideas clear in minutes.",
    title: "AI explainer videos that make the complex clear",
    h1: "Make the complex clear.",
    lead: "Some ideas are hard to picture: how a service works, what happens inside a system, why a process matters. AI explainer videos show them, so audiences understand in minutes rather than pages.",
    receive: ["Narrative structure and script", "Visual metaphors and storyboard", "Voice-over casting and direction", "A finished film, with motion graphics where they help", "Captions and language versions"],
    uses: ["Product and platform onboarding", "Financial, legal and healthcare services", "Internal training and change", "Sales presentations", "Public information"],
    deliver: ["Film of 60 to 180 seconds", "Chaptered versions for longer topics", "Captions in every language delivered", "Thumbnails and stills", "Masters up to 4K"],
    approach: "We write explainers the way a good teacher speaks: one idea at a time, in the order a viewer needs it. Generative AI lets us give every step its own picture, however abstract the subject.",
    meta: "AI explainer videos for products, services and processes: script, storyboard, voice-over and a finished, professionally edited film."
  },
  {
    slug: "educational-films", name: "Educational Films", need: "Educational films", category: "education",
    line: "AI lesson films people want to watch, chapter by chapter.",
    title: "AI educational and lesson films",
    h1: "Lessons people want to watch.",
    lead: "Chapter-by-chapter AI lesson films for schools, colleges, learning platforms and course creators. A recurring AI-generated cast carries the series, so a subject feels like one course.",
    receive: ["Scripts written from your syllabus, textbook or notes", "Recurring characters across the whole series", "Narration in one or more languages", "Accuracy review at script and at cut", "A consistent look from chapter to chapter"],
    uses: ["Schools and colleges", "Coaching and test-preparation centres", "Learning platforms and apps", "Online course creators", "Publishers adapting textbooks", "Corporate learning"],
    deliver: ["Lesson parts of 4 to 10 minutes", "A series of parts for each chapter", "Narration in English; other languages on request", "Short revision clips", "Masters up to 4K"],
    approach: "Accuracy comes first. We script from your material, you approve the script and storyboard before anything is generated, and your subject experts review the cuts before we finish.",
    meta: "AI educational and lesson films for schools, learning platforms and course creators: scripted from your syllabus, with a recurring cast and a consistent look."
  },
  {
    slug: "launch-campaign-films", name: "Launch Films & Campaign Content", short: "Launch & Campaign", need: "Launch or campaign", category: "advertising",
    line: "A film for the day it goes public, and the content that follows.",
    title: "AI launch films and campaign content",
    h1: "A film for the day it goes public.",
    lead: "Launch films introduce something new: a product, a feature, a company. Campaign content keeps that story moving across every channel afterwards. We generate both from one creative world.",
    receive: ["A launch film", "Teasers and countdown edits", "Campaign cut-downs", "Vertical and short-form versions", "Frames and stills for the wider campaign"],
    uses: ["Product and feature launches", "Company and brand launches", "Funding announcements", "Events and conferences", "Seasonal campaigns"],
    deliver: ["Launch film, 45 to 120 seconds", "Three to five teasers", "Cut-downs of 6 to 15 seconds", "Every platform format", "Stills from the film"],
    approach: "We design the launch film and the campaign around it at the same time, so every teaser, cut-down and still belongs to the same AI-generated world and tells the same story.",
    meta: "AI launch films and campaign content: a hero launch film, teasers and cut-downs from one creative world, for every platform."
  },
  {
    slug: "ongoing-content", name: "Ongoing Video Production", short: "Ongoing Production", need: "Ongoing production", category: null, visual: "bokeh",
    line: "A steady run of AI films in one consistent look.",
    title: "Ongoing AI video production",
    h1: "A steady run of films, in one consistent look.",
    lead: "For brands, marketing teams and educators who publish regularly. A monthly AI video production plan keeps your channels active without briefing a new team each time.",
    receive: ["A monthly content plan", "An agreed number of films each month", "Characters, settings and style kept consistent", "One point of contact throughout", "A monthly review of what worked"],
    uses: ["Social channels", "YouTube series", "Course and lesson libraries", "Product updates", "Internal communication"],
    deliver: ["An agreed monthly volume", "A mix of long and short form", "Every platform format", "A shared delivery folder", "Masters up to 4K"],
    approach: "We set up the look, characters and templates once, then produce against a calendar you approve. Because the world already exists, each new film is faster to brief and consistent with the last.",
    meta: "Ongoing AI video production: a monthly run of films in one consistent look for brands, marketing teams, platforms and educators."
  }
];

export const INDUSTRIES = [
  { id: "enterprise-teams", name: "Enterprise & Marketing Teams", enterprise: true,
    line: "An AI video production partner that works to your brand, your approvals and your calendar.",
    uses: ["Brand, product and campaign films to your guidelines", "Training, internal and sales enablement content", "Versions for every market, audience and format"],
    services: ["brand-films", "launch-campaign-films", "ongoing-content"] },
  { id: "brands-startups", name: "Brands & Startups",
    line: "Tell a young company's story with the confidence of an established one.",
    uses: ["Brand and launch films that explain why you exist", "Films for investor and partner conversations", "Campaign content built from one creative world"],
    services: ["brand-films", "launch-campaign-films", "advertising-films"] },
  { id: "products-ecommerce", name: "Products & E-commerce",
    line: "Show products in context, at the moment buyers decide.",
    uses: ["Hero films for product pages", "Short loops for listings and ads", "Seasonal and festive variations"],
    services: ["product-films", "advertising-films", "ongoing-content"] },
  { id: "agencies-partners", name: "Agencies & Creative Partners",
    line: "A production partner for cinematic AI work your clients will notice.",
    uses: ["Production to your script, boards and guidelines", "Pitch films and animatics for new business", "Extra capacity in busy campaign periods"],
    services: ["advertising-films", "brand-films", "launch-campaign-films"] },
  { id: "business-corporate", name: "Businesses & Corporations",
    line: "Explain what you do, and why it matters, to customers and to your own people.",
    uses: ["Company and culture films", "Explainers for services and processes", "Internal training and change communication"],
    services: ["brand-films", "explainer-films", "ongoing-content"] },
  { id: "education-learning", name: "Education & Learning",
    line: "Turn a syllabus into films students want to watch.",
    uses: ["Chapter-by-chapter lesson series", "Course trailers and admissions films", "Versions in more than one language"],
    services: ["educational-films", "explainer-films", "ongoing-content"] },
  { id: "publishers-content", name: "Publishers & Course Businesses",
    line: "Bring books, courses and series to the screen.",
    uses: ["Chapters and stories adapted into film", "Series content for your channels", "Trailers for books and courses"],
    services: ["educational-films", "ongoing-content", "explainer-films"] }
];

// The /enterprise page
export const ENTERPRISE = {
  title: "AI video production for ambitious brands and enterprise teams.",
  lead: "Amble Films works as an AI video production partner for marketing departments, enterprise brands and agencies: one studio for single films, full campaigns and continuing programmes of video.",
  uses: [
    ["Brand and corporate storytelling", "Company, culture and purpose films that carry your positioning."],
    ["Product launch campaigns", "A launch film, teasers and cut-downs from one creative world."],
    ["Advertising and marketing", "Commercials and paid-social edits built for every platform."],
    ["Product demonstrations", "Features shown clearly, in settings a physical shoot rarely reaches."],
    ["Internal communication", "Announcements, change and leadership messages people watch to the end."],
    ["Training and learning", "Onboarding and skills modules with a consistent cast and look."],
    ["Sales enablement", "Short films your teams can send, present and reuse."],
    ["Explainer films", "Complex services, systems and processes made clear in minutes."],
    ["Versions and variations", "Lengths, formats, audiences and markets from one master film."],
    ["Recurring production", "A steady programme of films in one consistent visual identity."]
  ],
  how: [
    ["A clear brief", "Objective, audience, channels and success measures, agreed in writing."],
    ["Your brand guidelines", "Colour, type, tone and identity followed in every frame."],
    ["Defined deliverables", "Lengths, formats and versions listed in the quote before work begins."],
    ["Structured feedback", "Timed notes on each cut, within agreed review rounds."],
    ["Stakeholder approvals", "Sign-off points for script, preview and final cut, built into the schedule."],
    ["Production timelines", "Milestones planned around your launch and campaign dates."],
    ["One consistent look", "Characters, settings and style held steady across a series."],
    ["Repeat production", "Looks and templates set up once, so every new film is faster to brief."]
  ]
};

export const STEPS = [
  { name: "Brief", line: "Your objective, audience and brand.",
    text: "One conversation about what the film must achieve, who it is for and where it will run.",
    you: "Your goals, audience, brand guidelines and any references.", get: "A written brief we both agree on." },
  { name: "Preview", line: "See the direction as a short AI film.",
    text: "We develop the concept, treatment and look. For qualified projects, we create a complimentary AI video preview of 30 to 45 seconds, so you can judge the direction on screen. Then we agree the full scope, timeline and price.",
    you: "Your notes on the preview and the direction.", get: "A preview to react to, then the plan and a fixed price, approved before production." },
  { name: "Production", line: "Generate, direct, edit and refine.",
    text: "We generate the scenes with AI, direct and select every shot, edit the film and share cuts as it takes shape.",
    you: "Timed notes on each cut, within the agreed rounds.", get: "Cuts to review, and changes made from your notes." },
  { name: "Delivery", line: "Sound, music, grade and every format.",
    text: "Sound design, music, voice and colour grade, then final masters in every format you need.",
    you: "Final approval.", get: "Masters, cut-downs and captions, ready to publish." }
];

export const FAQ = [
  ["Do you really use AI to make the videos?", "Yes. We use generative AI to create the scenes, characters, settings and visual effects in our films. Our team writes, directs, selects, edits, scores and grades every film, so the result is intentional and on brand."],
  ["Will the film look obviously made by AI?", "We direct every shot and discard most of what the tools generate, then edit, grade and mix the film by hand. Watch the films on this site and judge for yourself."],
  ["What is the free AI video preview?", "For qualified projects, we create a complimentary AI video preview of 30 to 45 seconds based on your brief, in one creative direction. If it isn't right for you, there is nothing to pay and no obligation. If you want to go ahead, we agree the full scope, timeline and price before full production begins. Previews are for review only and cannot be published or used commercially unless the project is commissioned."],
  ["How much does a film cost?", "Selected AI video projects start from $100. Every quote depends on the brief, complexity, length, number of deliverables and how the film will be used, and you receive a fixed price before production starts."],
  ["Do you work with enterprise teams and agencies?", "Yes. We work to your brand guidelines, agreed deliverables, review rounds and approval stages, and can produce a continuing programme of videos. Agencies can brief us as a production partner on their own scripts and boards."],
  ["Can the same characters appear across a series?", "Yes. We keep characters, settings and style consistent from film to film, so a series feels like one piece of work."],
  ["How do you make sure the content is accurate?", "We work from your material. You approve the script and storyboard before anything is generated, and you review cuts before we finish."],
  ["How long does it take?", "That depends on the length and the number of films. Your timeline comes with the fixed quote, before production begins."],
  ["Where can we use the finished film?", "Tell us where it will run, whether that is your website, YouTube, paid ads, a classroom or an event, and the usage is written into your quote."],
  ["Do you work with clients internationally?", "Yes. We work remotely with clients worldwide. Briefs, reviews and approvals happen over calls and shared review links, arranged around your time zone."]
];
