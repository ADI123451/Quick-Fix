// Mock vendor data for Quick Fix
// Generated from realistic Indian name/city/skill pools so the marketplace
// feels production-grade while remaining 100% static (no backend).

const FIRST_NAMES = [
  "Ravi", "Amit", "Suresh", "Karan", "Mohan", "Deepak", "Rahul", "Vikas", "Arjun", "Sanjay",
  "Manoj", "Rakesh", "Pradeep", "Vinod", "Anil", "Sunil", "Ramesh", "Gopal", "Harish", "Naveen",
  "Ajay", "Vijay", "Rohit", "Nitin", "Prakash", "Mahesh", "Dinesh", "Kishore", "Lokesh", "Ganesh",
  "Mohammed", "Imran", "Faisal", "Iqbal", "Salman", "Yusuf", "Farhan", "Aslam", "Rizwan", "Javed",
  "Anita", "Priya", "Pooja", "Sneha", "Kavita", "Meena", "Sunita", "Rekha", "Neha", "Shilpa",
];

const LAST_NAMES = [
  "Kumar", "Sharma", "Verma", "Singh", "Patel", "Reddy", "Nair", "Iyer", "Rao", "Joshi",
  "Mehta", "Shah", "Gupta", "Agarwal", "Bansal", "Chopra", "Malhotra", "Khan", "Sheikh", "Ansari",
  "Das", "Bose", "Ghosh", "Pillai", "Menon", "Kulkarni", "Desai", "Naidu", "Pandey", "Mishra",
];

const CITIES = [
  "Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad",
  "Jaipur", "Lucknow", "Indore", "Chandigarh", "Kochi", "Surat", "Nagpur", "Bhopal",
  "Patna", "Vadodara", "Coimbatore", "Visakhapatnam", "Gurgaon", "Noida",
];

const SKILLS_BY_SERVICE = {
  Electrician: [
    "Home Wiring", "Switch Repair", "Fan Installation", "Inverter Setup", "MCB Setup",
    "Smart Home Wiring", "CCTV Installation", "LED Lighting", "Industrial Wiring",
    "Generator Repair", "Doorbell Setup", "Voltage Stabilizer",
  ],
  Plumber: [
    "Pipe Fixing", "Leakage Repair", "Tap Installation", "Bathroom Fittings", "Geyser Install",
    "Drain Cleaning", "Water Tank Service", "RO Service", "Sewage Repair", "Toilet Repair",
    "Kitchen Sink Repair", "Motor Repair",
  ],
  Carpenter: [
    "Furniture Making", "Door Repair", "Modular Kitchen", "Wood Polishing", "Wardrobe Design",
    "Bed Repair", "Office Furniture", "Window Frames", "Cabinet Fitting", "Hinge Replacement",
    "Drawer Repair", "Custom Shelving",
  ],
  Technician: [
    "AC Repair", "Washing Machine", "Refrigerator", "Microwave Repair", "TV Repair",
    "Geyser Service", "Chimney Cleaning", "Dishwasher Repair", "Water Purifier", "Mixer Grinder",
    "Induction Cooktop", "Air Cooler Service",
  ],
};

const PRICE_RANGES = {
  Electrician: [300, 800],
  Plumber: [200, 600],
  Carpenter: [400, 1200],
  Technician: [350, 900],
};

const DESCRIPTION_TEMPLATES = [
  (s, exp, city, skill) =>
    `${exp}+ years of trusted ${s.toLowerCase()} work in ${city}. Specializes in ${skill.toLowerCase()} with same-day service.`,
  (s, exp, city, skill) =>
    `Certified ${s.toLowerCase()} based in ${city}. Known for clean ${skill.toLowerCase()} jobs and on-time delivery.`,
  (s, exp, city, skill) =>
    `Friendly local ${s.toLowerCase()} serving ${city} for over ${exp} years. Expert in ${skill.toLowerCase()} and home visits.`,
  (s, exp, city, skill) =>
    `Senior ${s.toLowerCase()} handling residential and small commercial jobs across ${city}. Strong skills in ${skill.toLowerCase()}.`,
  (s, exp, city, skill) =>
    `Background-verified ${s.toLowerCase()} from ${city}. Offers warranty on ${skill.toLowerCase()} and most major repairs.`,
  (s, exp, city, skill) =>
    `Quick-response ${s.toLowerCase()} in ${city} with ${exp} years on the job. Trusted for ${skill.toLowerCase()} and emergency calls.`,
];

// Tiny seeded PRNG so the dataset is identical across reloads (stable IDs, ratings, etc.)
const mulberry32 = (seed) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const rand = mulberry32(20240419);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickN = (arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
};
const intBetween = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

const SERVICES = ["Electrician", "Plumber", "Carpenter", "Technician"];
const PER_CATEGORY = 50;

const buildVendor = (id, service) => {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const city = pick(CITIES);
  const experience = intBetween(1, 18);
  const skillPool = SKILLS_BY_SERVICE[service];
  const skills = pickN(skillPool, intBetween(3, 5));
  const [pMin, pMax] = PRICE_RANGES[service];
  const price = Math.round(intBetween(pMin, pMax) / 50) * 50;
  const rating = Math.round((3.6 + rand() * 1.4) * 10) / 10;
  const completed = intBetween(15, 520);
  const tmpl = DESCRIPTION_TEMPLATES[id % DESCRIPTION_TEMPLATES.length];
  const description = tmpl(service, experience, city, skills[0]);

  return {
    id,
    name: `${first} ${last}`,
    service,
    experience: `${experience} years`,
    price: `₹${price}`,
    rating: Math.min(5, rating),
    skills,
    description,
    location: city,
    completed,
  };
};

export const vendors = (() => {
  const list = [];
  let id = 1;
  for (const service of SERVICES) {
    for (let i = 0; i < PER_CATEGORY; i++) {
      list.push(buildVendor(id++, service));
    }
  }
  return list;
})();

export const categories = [
  { name: "Electrician", icon: "⚡", color: "from-yellow-400 to-orange-500" },
  { name: "Plumber", icon: "🔧", color: "from-blue-400 to-cyan-500" },
  { name: "Carpenter", icon: "🪚", color: "from-amber-500 to-orange-600" },
  { name: "Technician", icon: "🛠️", color: "from-emerald-400 to-teal-500" },
];
