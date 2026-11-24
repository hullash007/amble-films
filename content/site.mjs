// Amble Films: all page copy for services and industries lives here.
// Edit the words, then run: node tools/build.mjs

export const SITE = {
  name: "Amble Films",
  url: "https://amblefilms.in",
  email: "contact@amblefilms.in",
  phone: "+91-87507-59538",
  whatsappDisplay: "+91 87507 59538",
  founder: { name: "Ajit", role: "Founder & Creative Director" },
  social: { youtube: "https://www.youtube.com/@AmbleFilms", instagram: "https://www.instagram.com/amble_films/", linkedin: "https://www.linkedin.com/company/amblefilms/" },
  tagline: "Cinematic films for brands, products and ideas.",
  description: "Amble Films is a film studio making brand, product, advertising, explainer and educational films for organisations anywhere. Directed by people, produced with AI."
};

// Labels used on the Work page and on film cards
export const CATEGORIES = {
  brand: "Brand", product: "Product", advertising: "Advertising",
  explainer: "Explainers", education: "Education", experiments: "Creative experiments"
};
export const KINDS = {
  client: { label: "Client film", note: "made for a client" },
  concept: { label: "Concept film", note: "a speculative film made to explore an idea" },
  study: { label: "Study", note: "a short visual experiment" }
};

export const SERVICES = [
  {
    slug: "brand-films", name: "Brand Films", need: "Brand film", category: "brand",
    line: "Films that say who you are and why it matters.",
    title: "Brand films that say who you are",
    h1: "Films that say who you are.",
    lead: "A brand film carries what a company believes and why it matters, in a form people actually watch. We write and direct it from your positioning, not from a template.",
    receive: ["A creative concept and written treatment", "Script and storyboard for approval", "A directed film, usually one to three minutes", "Music, sound design and a full colour grade", "Shorter cuts for social, presentations and events"],
    uses: ["Website and homepage films", "Company launches and rebrands", "Investor and partner presentations", "Recruitment and culture", "Keynotes and events"],
    deliver: ["Hero film, 60 to 180 seconds", "30 and 15 second cut-downs", "16:9, 9:16 and 1:1 versions", "Captioned and silent versions", "Masters up to 4K"],
    approach: "Brand films start with positioning, not pictures. We use the brief to understand your audience and the single impression the film must leave, then build the world, characters and visual language around it.",
    meta: "Brand films written and directed around your positioning: concept, script, direction, sound and grade, with cuts for every platform."
  },
  {
    slug: "product-films", name: "Product Films", need: "Product film", category: "product",
    line: "Your product, in places and light a shoot rarely reaches.",
    title: "Product films that show it at its best",
    h1: "Show the product at its best.",
    lead: "Your product, presented in settings, light and scale that a physical shoot would struggle to reach, while staying true to how it looks and works.",
    receive: ["A product treatment and shot list", "A hero product film", "Feature and detail sequences", "Lifestyle and in-context scenes", "Short loops ready for listings and ads"],
    uses: ["E-commerce product pages", "Marketplace listings", "Pre-orders and crowdfunding", "Retail and exhibition screens", "Paid social"],
    deliver: ["Hero film, 30 to 90 seconds", "Feature loops, 6 to 15 seconds", "16:9, 9:16 and 1:1 versions", "Silent versions with on-screen text", "Stills taken from the film"],
    approach: "We work from your product photographs, renders or samples, and you check every product shot for accuracy before the film is finished.",
    meta: "Product films for e-commerce, listings, launches and ads: hero films, feature loops and every platform format."
  },
  {
    slug: "advertising-films", name: "Advertising Films", need: "Advertising film", category: "advertising",
    line: "Commercials from six seconds to sixty, built on one clear idea.",
    title: "Advertising films and commercials",
    h1: "One idea, made to be remembered.",
    lead: "Commercials for YouTube, paid social, connected TV and cinema, from six seconds to sixty. We start with the idea and build the craft around it.",
    receive: ["Creative routes to choose between", "Script and storyboard for approval", "A directed commercial", "Music, sound design and colour", "Edits built to each platform's specifications"],
    uses: ["Brand campaigns", "Paid social and performance", "Seasonal and festive campaigns", "YouTube pre-roll", "Connected TV and cinema"],
    deliver: ["6, 15, 30 and 60 second edits", "16:9, 9:16, 4:5 and 1:1 versions", "Versions with and without supers", "Delivery to platform specifications", "Masters up to 4K"],
    approach: "If you work with an agency, we can produce to their script and storyboard as a production partner. If you come to us directly, we develop the idea with you first.",
    meta: "Advertising films and commercials for YouTube, paid social, connected TV and cinema, from six seconds to sixty."
  },
  {
    slug: "explainer-films", name: "Explainer Films", need: "Explainer film", category: "explainer",
    line: "Complex ideas, made clear in minutes.",
    title: "Explainer films that make the complex clear",
    h1: "Make the complex clear.",
    lead: "Some ideas are hard to picture: how a service works, what happens inside a system, why a process matters. Explainer films show them, so audiences understand in minutes rather than pages.",
    receive: ["Narrative structure and script", "Visual metaphors and storyboard", "Voice-over casting and direction", "A finished film, with motion graphics where they help", "Captions and translated versions"],
    uses: ["Product and platform onboarding", "Financial, legal and healthcare services", "Internal training and change", "Sales presentations", "Public information"],
    deliver: ["Film of 60 to 180 seconds", "Chaptered versions for longer topics", "Captions in every language delivered", "Thumbnails and stills", "Masters up to 4K"],
    approach: "We write explainers the way a good teacher speaks: one idea at a time, in the order a viewer needs it, with a picture for every step.",
    meta: "Explainer films for products, services and processes: script, storyboard, voice-over and finished film."
  },
  {
    slug: "educational-films", name: "Educational Films", need: "Educational films", category: "education",
    line: "Lesson films people want to watch, chapter by chapter.",
    title: "Educational and lesson films",
    h1: "Lessons people want to watch.",
    lead: "Chapter-by-chapter lesson films for schools, colleges, coaching centres, learning platforms and course creators. A recurring cast carries the series, so a subject feels like one course.",
    receive: ["Scripts written from your syllabus, textbook or notes", "Recurring characters across the whole series", "Narration in one or more languages", "Accuracy review at script and at cut", "A consistent look from chapter to chapter"],
    uses: ["Schools and colleges", "Coaching and test-preparation centres", "Learning platforms and apps", "Online course creators", "Publishers adapting textbooks", "Corporate learning"],
    deliver: ["Lesson parts of 4 to 10 minutes", "A series of parts for each chapter", "English, Hindi and other languages on request", "Short revision clips", "Masters up to 4K"],
    approach: "Accuracy comes first. We script from your material, you approve the script and storyboard before anything is made, and your subject experts review the cuts before we finish.",
    meta: "Educational and lesson films for schools, colleges, coaching centres, learning platforms and course creators, in English, Hindi and more."
  },
  {
    slug: "launch-campaign-films", name: "Launch Films & Campaign Content", short: "Launch & Campaign", need: "Launch or campaign", category: "advertising",
    line: "A film for the day it goes public, and the content that follows.",
    title: "Launch films and campaign content",
    h1: "A film for the day it goes public.",
    lead: "Launch films introduce something new: a product, a feature, a company. Campaign content keeps that story moving across every channel afterwards. We plan both from one creative world.",
    receive: ["A launch film", "Teasers and countdown edits", "Campaign cut-downs", "Vertical and short-form versions", "Frames and stills for the wider campaign"],
    uses: ["Product and feature launches", "Company and brand launches", "Funding announcements", "Events and conferences", "Seasonal campaigns"],
    deliver: ["Launch film, 45 to 120 seconds", "Three to five teasers", "Cut-downs of 6 to 15 seconds", "Every platform format", "Stills from the film"],
    approach: "We design the launch film and the campaign around it at the same time, so every teaser, cut-down and still belongs to the same story.",
    meta: "Launch films and campaign content: a hero launch film, teasers and cut-downs from one creative world, for every platform."
  },
  {
    slug: "ongoing-content", name: "Ongoing Video Production", short: "Ongoing Production", need: "Ongoing production", category: null,
    line: "A steady run of films in one consistent look.",
    title: "Ongoing video production",
    h1: "A steady run of films, in one consistent look.",
    lead: "For brands and educators who publish regularly. A monthly production plan keeps your channels active without briefing a new team each time.",
    receive: ["A monthly content plan", "An agreed number of films each month", "Characters, settings and style kept consistent", "One point of contact throughout", "A monthly review of what worked"],
    uses: ["Social channels", "YouTube series", "Course and lesson libraries", "Product updates", "Internal communication"],
    deliver: ["An agreed monthly volume", "A mix of long and short form", "Every platform format", "A shared delivery folder", "Masters up to 4K"],
    approach: "We set up the look, characters and templates once, then produce against a calendar you approve, so each new film is faster to brief and consistent with the last.",
    meta: "Ongoing video production: a monthly run of films in one consistent look for brands, platforms and educators."
  }
];

export const INDUSTRIES = [
  { id: "brands-startups", name: "Brands & Startups",
    line: "Tell a young company's story with the confidence of an established one.",
    uses: ["Brand and launch films that explain why you exist", "Films for investor and partner conversations", "Campaign content built from one creative world"],
    services: ["brand-films", "launch-campaign-films", "advertising-films"] },
  { id: "products-ecommerce", name: "Products & E-commerce",
    line: "Show products in context, at the moment buyers decide.",
    uses: ["Hero films for product pages", "Short loops for listings and ads", "Seasonal and festive variations"],
    services: ["product-films", "advertising-films", "ongoing-content"] },
  { id: "business-corporate", name: "Businesses & Corporations",
    line: "Explain what you do, and why it matters, to customers and to your own people.",
    uses: ["Company and culture films", "Explainers for services and processes", "Internal training and change communication"],
    services: ["brand-films", "explainer-films", "ongoing-content"] },
  { id: "education-learning", name: "Education & Learning",
    line: "Turn a syllabus into films students want to watch.",
    uses: ["Chapter-by-chapter lesson series", "Course trailers and admissions films", "Versions in more than one language"],
    services: ["educational-films", "explainer-films", "ongoing-content"] },
  { id: "agencies-partners", name: "Agencies & Creative Partners",
    line: "A production partner for cinematic work your clients will notice.",
    uses: ["Production to your script, boards and guidelines", "Pitch films and animatics for new business", "Extra capacity in busy campaign periods"],
    services: ["advertising-films", "brand-films", "launch-campaign-films"] },
  { id: "publishers-content", name: "Publishers & Content Businesses",
    line: "Bring books, courses and series to the screen.",
    uses: ["Chapters and stories adapted into film", "Series content for your channels", "Trailers for books and courses"],
    services: ["educational-films", "ongoing-content", "explainer-films"] }
];

export const STEPS = [
  { name: "Brief", line: "Understand the objective and the creative vision.",
    text: "One conversation about what the film must achieve, who it is for and where it will run.",
    you: "Your goals, audience, brand guidelines and any references.", get: "A written brief we both agree on." },
  { name: "Direction", line: "Develop the concept, treatment and storyboard.",
    text: "We develop the concept and return a written treatment, a storyboard, a timeline and a fixed quote.",
    you: "Your notes on the direction.", get: "The plan and the full price, approved before production starts." },
  { name: "Production", line: "Generate, direct, edit and refine the film.",
    text: "We generate, direct and select every shot, edit the film and share cuts as it takes shape.",
    you: "Timed notes on each cut, within the agreed rounds.", get: "Cuts to review, and changes made from your notes." },
  { name: "Delivery", line: "Sound, music, grade and every agreed format.",
    text: "Sound design, music, voice and colour grade, then final masters in the formats you need.",
    you: "Final approval.", get: "Masters, cut-downs and captions, ready to publish." }
];

export const FAQ = [
  ["Will the film look obviously made by AI?", "We direct every shot and discard most of what the tools generate, then edit, grade and mix the film by hand. Watch the films on this site and judge for yourself."],
  ["Can the same characters appear across a series?", "Yes. We keep characters, settings and style consistent from film to film, so a series feels like one piece of work."],
  ["How do you make sure the content is accurate?", "We script from your material. You approve the script and storyboard before anything is produced, and you review cuts before we finish."],
  ["Which languages do you work in?", "We have delivered films in English and in Hindi, each version timed to its own narration. Ask us about other languages."],
  ["How much does a film cost?", "Every project gets a fixed quote after the brief, so you know the full cost before work starts. You can share a budget range in the enquiry form if you would like us to plan around it."],
  ["How long does it take?", "That depends on the length and the number of films. Your timeline comes with the fixed quote, before anything begins."],
  ["Where can we use the finished film?", "Tell us where it will run, whether that is your website, YouTube, paid ads, a classroom or an event, and the usage is written into your quote."],
  ["Do you work with clients outside India?", "Yes. We work remotely, so it makes no difference where you are. Briefs, reviews and approvals happen over calls and shared review links."]
];
