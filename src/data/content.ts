import manifest from "./image-manifest.json";

export type ManifestImage = {
  name: string;
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export const img = (name: string): ManifestImage => {
  const entry = (manifest as Record<string, ManifestImage>)[name];
  if (!entry) throw new Error(`Missing image asset: ${name}`);
  return entry;
};

/* ------------------------------------------------------------------ brand */

export const BRAND = {
  name: "Castellan",
  suffix: "Estates",
  tagline: "Residences beyond time",
  heroHeadline: ["Where Silence", "Becomes Luxury"],
  heroSub: "Private residences composed like cinema — light, stone, and stillness in perfect measure.",
};

/* ---------------------------------------------------------------- journey */

export const JOURNEY_SCENES = [
  { key: "journey/01-exterior", chapter: "I", title: "The Estate", caption: "Dusk settles over the western façade" },
  { key: "journey/02-approach", chapter: "II", title: "The Approach", caption: "A path of stone, drawn toward the light" },
  { key: "journey/03-door", chapter: "III", title: "The Threshold", caption: "Four metres of bronze, opening in silence" },
  { key: "journey/04-lobby", chapter: "IV", title: "The Grand Lobby", caption: "Backlit marble beneath a cascade of glass" },
  { key: "journey/05-hallway", chapter: "V", title: "The Gallery", caption: "A private collection lines the way" },
  { key: "journey/06-living", chapter: "VI", title: "The Living Hall", caption: "Nine metres of glass, one horizon" },
  { key: "journey/07-kitchen", chapter: "VII", title: "The Kitchen", caption: "Calacatta stone and quiet bronze" },
  { key: "journey/08-dining", chapter: "VIII", title: "The Dining Room", caption: "Twelve seats beneath a single line of light" },
  { key: "journey/09-bedroom", chapter: "IX", title: "The Master Suite", caption: "The city glitters at your feet" },
  { key: "journey/10-closet", chapter: "X", title: "The Dressing Room", caption: "A private atelier, softly lit" },
  { key: "journey/11-bathroom", chapter: "XI", title: "The Bath", caption: "Carved stone beneath a window of stars" },
  { key: "journey/12-cinema", chapter: "XII", title: "The Cinema", caption: "Eleven seats. One endless sunset" },
  { key: "journey/13-office", chapter: "XIII", title: "The Study", caption: "Where decisions overlook the skyline" },
  { key: "journey/14-pool", chapter: "XIV", title: "The Infinity Edge", caption: "Water dissolving into sea" },
  { key: "journey/15-lounge", chapter: "XV", title: "The Fire Terrace", caption: "Evenings written in ember and starlight" },
  { key: "journey/16-aerial", chapter: "XVI", title: "The Coast", caption: "One address on an endless shore" },
] as const;

/* --------------------------------------------------------------- projects */

export type Project = {
  slug: string;
  name: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  status: "Available" | "Off-plan" | "Last residence";
  image: string;
  description: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "aurelia-tower",
    name: "Al Mouj Marina Residence",
    location: "The Wave, Muscat, Sultanate of Oman",
    price: "From OMR 480,000",
    beds: 3,
    baths: 4,
    area: "520 m²",
    status: "Available",
    image: "projects/aurelia-tower",
    description: "Full-floor marina sky residence with private arrival lobby, wrapped in bronze glass above the Al Mouj yacht basin.",
  },
  {
    slug: "serena-courtyard",
    name: "Jebel Akhdar Mountain Sanctuary",
    location: "Jebel Akhdar, Al Dakhiliyah, Oman",
    price: "From OMR 850,000",
    beds: 5,
    baths: 6,
    area: "1,120 m²",
    status: "Last residence",
    image: "projects/serena-courtyard",
    description: "Perched 2,000 metres above sea level on the canyon edge with a cantilevered heated pool and terraced gardens.",
  },
  {
    slug: "meridian-cliff",
    name: "Bandar Jissah Beachfront Villa",
    location: "Bandar Jissah, Muscat Coast, Oman",
    price: "From OMR 1,200,000",
    beds: 5,
    baths: 7,
    area: "1,380 m²",
    status: "Available",
    image: "projects/meridian-cliff",
    description: "Sculpted into the limestone cove with a glass-edge infinity pool suspended directly over the turquoise Arabian sea.",
  },
  {
    slug: "lumen-tower",
    name: "Shatti Al Qurum Beachfront Estate",
    location: "Shatti Al Qurum, Muscat, Oman",
    price: "From OMR 1,650,000",
    beds: 6,
    baths: 8,
    area: "1,540 m²",
    status: "Off-plan",
    image: "projects/lumen-tower",
    description: "An irreplaceable private sanctuary on Muscat's golden coast with direct beach access and secluded palm courtyard.",
  },
  {
    slug: "vela-courtyard",
    name: "Dhofar Ocean Sanctuary",
    location: "Salalah Coast, Dhofar, Oman",
    price: "From OMR 920,000",
    beds: 4,
    baths: 5,
    area: "960 m²",
    status: "Available",
    image: "projects/vela-courtyard",
    description: "Eco-luxury coastal estate nestled among coconut palms and emerald waves, featuring local stone craftsmanship.",
  },
  {
    slug: "solace-cliff",
    name: "Musandam Fjord Haven",
    location: "Musandam Coast, Sultanate of Oman",
    price: "From OMR 1,450,000",
    beds: 4,
    baths: 5,
    area: "890 m²",
    status: "Off-plan",
    image: "projects/solace-cliff",
    description: "A private architectural sanctuary carved into the fjord cliffside, where every suite gazes across open ocean waters.",
  },
];

/* ----------------------------------------------------------------- pillars */

export const PILLARS = [
  {
    title: "Prime Addresses",
    body: "We acquire only irreplaceable land — shorelines, summits, and skyline corners that cannot be built twice.",
  },
  {
    title: "Timeless Design",
    body: "Every residence is authored with world-renowned architects and held to a hundred-year standard.",
  },
  {
    title: "Uncompromised Craft",
    body: "Stone chosen at the quarry. Bronze finished by hand. Three inspections for every single surface.",
  },
  {
    title: "Private Service",
    body: "One dedicated curator per client, from first viewing to years after the keys are yours.",
  },
];

/* ---------------------------------------------------------------- services */

export const SERVICES = [
  {
    n: "01",
    title: "Private Acquisition",
    body: "Off-market access to residences that are never publicly listed, negotiated discreetly on your behalf.",
  },
  {
    n: "02",
    title: "Bespoke Development",
    body: "From land sourcing to the final brass fitting — we compose one-of-one estates for one-of-one lives.",
  },
  {
    n: "03",
    title: "Portfolio Management",
    body: "Structured ownership, leasing, and asset care for collections of luxury property across three continents.",
  },
  {
    n: "04",
    title: "Interior Curation",
    body: "Museum-grade interiors assembled with ateliers in Milan, Paris, and Kyoto — delivered turn-key.",
  },
  {
    n: "05",
    title: "Residence Aftercare",
    body: "A permanent estate team keeping every system, surface, and garden exactly as it was on day one.",
  },
];

/* -------------------------------------------------------------- investment */

export const INVESTMENT_POINTS = [
  { value: 14.2, suffix: "%", label: "Average annual appreciation across our portfolio since 2016" },
  { value: 96, suffix: "%", label: "Of residences resold above acquisition price within five years" },
  { value: 2.4, suffix: "B", prefix: "$", label: "In private assets under management for our clients" },
];

/* ---------------------------------------------------------------- timeline */

export const TIMELINE = [
  { year: "2009", title: "The Founding", body: "Castellan begins with a single restored palazzo and a conviction: property should be composed, not constructed." },
  { year: "2013", title: "First Skyline", body: "Aurelia Tower breaks ground in Dubai Marina — our first vertical estate, sold out before completion." },
  { year: "2017", title: "The Coast Years", body: "Expansion along the Arabian coastline: nine cliff and beachfront estates from Muscat to Musandam." },
  { year: "2021", title: "A Global Atelier", body: "Design studios open in Milan and Singapore. Craft partnerships reach 40 ateliers worldwide." },
  { year: "2026", title: "The Next Chapter", body: "Three new addresses in composition — each one a place the map will be redrawn around." },
];

/* ------------------------------------------------------------------- stats */

export const STATS = [
  { value: 52, suffix: "+", label: "Luxury projects completed" },
  { value: 17, suffix: "", label: "Years of excellence" },
  { value: 9, suffix: "", label: "International design awards" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
];

/* ------------------------------------------------------------------ awards */

export const AWARDS = [
  { year: "2025", name: "International Property Awards", detail: "Best Luxury Development — Middle East" },
  { year: "2024", name: "Architizer A+ Awards", detail: "Residential Architecture, Jury Winner" },
  { year: "2023", name: "European Property Prize", detail: "Developer of the Year, Shortlist" },
  { year: "2022", name: "AHEAD Global", detail: "Ultimate Winner — Private Residences" },
  { year: "2021", name: "Luxury Lifestyle Awards", detail: "Top 100 Real Estate Brands" },
];

/* ------------------------------------------------------------ testimonials */

export const TESTIMONIALS = [
  {
    quote: "They didn't sell us a house. They understood a life we hadn't fully imagined yet, and then they built it.",
    name: "A. Al-Rashid",
    role: "Owner, Serena Courtyard",
  },
  {
    quote: "From the first viewing to the final key, not one promise slipped. In thirty years of acquiring property, that is singular.",
    name: "H. Lindqvist",
    role: "Private investor, Stockholm",
  },
  {
    quote: "Standing in the living hall at dusk, my wife said it felt like the house had been waiting for us. That is Castellan.",
    name: "D. Okonkwo",
    role: "Owner, Meridian Cliff",
  },
];

/* --------------------------------------------------------------------- faq */

export const FAQS = [
  {
    q: "How are private viewings arranged?",
    a: "Every viewing is by appointment only, hosted by your dedicated curator. We arrange travel, timing at golden hour, and complete discretion — most of our residences are never publicly marketed.",
  },
  {
    q: "Can international buyers acquire your residences?",
    a: "Yes. Our legal team structures ownership for clients from over thirty countries, including freehold title in the UAE and Oman, and we coordinate residency programmes where applicable.",
  },
  {
    q: "Do you take on fully bespoke commissions?",
    a: "A small number each year. A bespoke estate begins with land acquisition and typically completes within thirty-six months, with a single design team from first sketch to handover.",
  },
  {
    q: "What does ownership include beyond the residence?",
    a: "Every Castellan residence includes five years of estate management, access to our private club of owners, and priority allocation in all future developments.",
  },
  {
    q: "How is my privacy protected during a purchase?",
    a: "Transactions can be completed through nominee structures under strict confidentiality. Your name never appears in any public listing, and our staff are bound by lifetime discretion agreements.",
  },
];

/* ----------------------------------------------------------------- footer */

export const OFFICES = [
  { city: "Dubai", line: "Level 58, Marina Gate" },
  { city: "London", line: "9 Grosvenor Street, Mayfair" },
  { city: "Muscat", line: "Al Mouj Marina, Walk 12" },
];
