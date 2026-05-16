import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PROMPTS = [
  "A hill I'll die on…",
  "My most controversial opinion…",
  "A perfect Sunday looks like…",
  "Something I'll never shut up about…",
  "The way to my heart is…",
  "I'm weirdly passionate about…",
  "Green flag I look for…",
  "My love language is…",
];

const MP = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=800&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
  "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=800&q=80",
  "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=800&q=80",
];

const FP = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&q=80",
  "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
];

const seedUsers = [
  // --- Males ---
  {
    email: "alex@demo.com", name: "Alex", age: 27, gender: "MALE", lookingFor: "FEMALE",
    bio: "Software engineer by day, amateur chef by night. I believe in long conversations over good food, and I'll probably convince you to try something you've never eaten before. Currently building things that matter.",
    location: "San Francisco, CA",
    interests: ["cooking", "hiking", "music", "startups", "philosophy"],
    photos: [MP[0], MP[1]],
    prompts: [
      { prompt: PROMPTS[0], answer: "Pineapple belongs on pizza if the pizza is good enough." },
      { prompt: PROMPTS[2], answer: "Farmer's market at 9am, a 3-hour cook session, then reading until sunset." },
      { prompt: PROMPTS[6], answer: "Someone who has opinions. About anything. I want to hear what you care about." },
    ],
  },
  {
    email: "jordan@demo.com", name: "Jordan", age: 29, gender: "MALE", lookingFor: "FEMALE",
    bio: "Emergency room nurse who has seen enough to know what actually matters. Deeply sarcastic in a caring way. I'm the person who will always show up — for a crisis or a bad day, same energy.",
    location: "Chicago, IL",
    interests: ["running", "travel", "books", "coffee", "board games"],
    photos: [MP[2], MP[3]],
    prompts: [
      { prompt: PROMPTS[0], answer: "Working hard and being kind are both required, not either/or." },
      { prompt: PROMPTS[7], answer: "Acts of service. I want to help. Let me help." },
      { prompt: PROMPTS[5], answer: "The science of how coffee actually works. I will explain the Maillard reaction to anyone who asks." },
    ],
  },
  {
    email: "sam@demo.com", name: "Sam", age: 31, gender: "MALE", lookingFor: "FEMALE",
    bio: "High school English teacher who still thinks literature is the most underrated technology for understanding other people. Writes bad poetry on weekends. Looking for someone who will let me read it to them.",
    location: "Austin, TX",
    interests: ["literature", "poetry", "cycling", "indie music", "cooking"],
    photos: [MP[4], MP[5]],
    prompts: [
      { prompt: PROMPTS[3], answer: "That the right book at the right time can genuinely change how you see the world." },
      { prompt: PROMPTS[0], answer: "Rereading is more valuable than reading widely. Fight me." },
      { prompt: PROMPTS[4], answer: "Someone who has a thing. A real, specific, odd thing they love." },
    ],
  },
  {
    email: "kai@demo.com", name: "Kai", age: 24, gender: "MALE", lookingFor: "FEMALE",
    bio: "Musician and part-time poet living in a too-small apartment with too many guitars. I write songs about mundane things — grocery lists, bus delays, the specific sadness of a Sunday night. I think small moments are where everything real happens.",
    location: "Brooklyn, NY",
    interests: ["music", "poetry", "skateboarding", "vinyl", "coffee"],
    photos: [MP[6], MP[7]],
    prompts: [
      { prompt: PROMPTS[3], answer: "That minor chords contain more emotional information than entire self-help books." },
      { prompt: PROMPTS[2], answer: "Slow morning, bad coffee made well, writing one sentence I don't hate, then whatever happens." },
      { prompt: PROMPTS[6], answer: "You laugh at things other people don't notice." },
    ],
  },
  {
    email: "luca@demo.com", name: "Luca", age: 30, gender: "MALE", lookingFor: "FEMALE",
    bio: "Architect who believes cities should be designed for walking, not driving, and that most buildings built after 1975 are a crime against the human soul. I say this while living in a very normal apartment. I'm working on the contradiction.",
    location: "Los Angeles, CA",
    interests: ["architecture", "cycling", "wine", "history", "travel"],
    photos: [MP[8], MP[9]],
    prompts: [
      { prompt: PROMPTS[1], answer: "Open floor plans destroyed the art of conversation in domestic spaces." },
      { prompt: PROMPTS[4], answer: "Someone cooking with me, not for me. I want to chop things together and argue about seasoning." },
      { prompt: PROMPTS[0], answer: "Brutalism is beautiful. I will not be taking questions." },
    ],
  },
  {
    email: "omar@demo.com", name: "Omar", age: 28, gender: "MALE", lookingFor: "FEMALE",
    bio: "Sports journalist who covers basketball but only really cares about the psychology of athletes under pressure. I ask athletes questions they don't expect and then write about the silence before they answer. That's the real story.",
    location: "Atlanta, GA",
    interests: ["basketball", "writing", "travel", "documentaries", "philosophy"],
    photos: [MP[10], MP[11]],
    prompts: [
      { prompt: PROMPTS[5], answer: "The mental side of sports. Everyone sees the physical. Nobody talks about what happens in their head at 0.3 seconds left." },
      { prompt: PROMPTS[2], answer: "Nowhere specific. Just somewhere I've never been before. Even in my own city." },
      { prompt: PROMPTS[7], answer: "Being genuinely interested in someone's answer, not just waiting for my turn to talk." },
    ],
  },
  {
    email: "felix@demo.com", name: "Felix", age: 26, gender: "MALE", lookingFor: "FEMALE",
    bio: "Biotech researcher trying to understand how cells decide to die, which sounds dark but is actually about extending life. I spend 10 hours a day thinking about tiny things and then go home and need to talk about literally anything else.",
    location: "Boston, MA",
    interests: ["science", "climbing", "cooking", "philosophy", "chess"],
    photos: [MP[0], MP[6]],
    prompts: [
      { prompt: PROMPTS[1], answer: "Most scientists are bad at explaining why their work matters. This is a crisis." },
      { prompt: PROMPTS[3], answer: "That the distance between who you are and who you could be is almost always smaller than you think." },
      { prompt: PROMPTS[6], answer: "You're comfortable with uncertainty. Not as a coping mechanism. As a genuine stance." },
    ],
  },
  {
    email: "marcus@demo.com", name: "Marcus", age: 32, gender: "MALE", lookingFor: "FEMALE",
    bio: "Chef who opened a small restaurant at 29 and learned more about failure in the first year than in the 10 before it. Still open. Still learning. The menu changes every week because I get bored easily and that's either my best or worst quality.",
    location: "New York, NY",
    interests: ["cooking", "wine", "travel", "jazz", "markets"],
    photos: [MP[1], MP[7]],
    prompts: [
      { prompt: PROMPTS[0], answer: "Fusion cuisine is only bad when it's done without respect for either culture. Done right, it's where the best food happens." },
      { prompt: PROMPTS[4], answer: "Telling me you're not hungry, and then stealing half my food. That's the move." },
      { prompt: PROMPTS[2], answer: "Farmers market at 7am, cook until 2pm, eat at 3pm, nap, dinner somewhere I've never been." },
    ],
  },
  {
    email: "theo@demo.com", name: "Theo", age: 25, gender: "MALE", lookingFor: "FEMALE",
    bio: "Visual artist who makes large-scale installations about memory and forgetting. My studio is a disaster. I forget to eat when I'm working. I'm told I'm intense. I prefer 'present.' Currently making something I can't explain yet.",
    location: "Portland, OR",
    interests: ["art", "film", "philosophy", "hiking", "ceramics"],
    photos: [MP[2], MP[8]],
    prompts: [
      { prompt: PROMPTS[5], answer: "How people remember things that didn't happen the way they remember them. Memory is creative nonfiction." },
      { prompt: PROMPTS[3], answer: "That making something imperfect and showing it to people anyway is the bravest thing a person can do." },
      { prompt: PROMPTS[1], answer: "Art that explains itself isn't finished yet." },
    ],
  },

  // --- Females ---
  {
    email: "maya@demo.com", name: "Maya", age: 25, gender: "FEMALE", lookingFor: "MALE",
    bio: "Documentary filmmaker who thinks everyone has a story worth telling. I ask too many questions and apologize for it too little. I'm learning to be comfortable with not having all the answers.",
    location: "Brooklyn, NY",
    interests: ["film", "photography", "yoga", "jazz", "writing"],
    photos: [FP[0], FP[1]],
    prompts: [
      { prompt: PROMPTS[1], answer: "Jazz is objectively the most emotionally intelligent genre of music." },
      { prompt: PROMPTS[3], answer: "The fact that we're all just making it up as we go — I find that comforting." },
      { prompt: PROMPTS[4], answer: "Sharing a meal you made yourself. Doesn't have to be fancy. Just intentional." },
    ],
  },
  {
    email: "priya@demo.com", name: "Priya", age: 26, gender: "FEMALE", lookingFor: "MALE",
    bio: "Product designer. I think about systems the way most people think about people. Moved here from Bangalore 4 years ago and still discovering the city. Currently obsessed with brutalist architecture and why it makes me feel things.",
    location: "New York, NY",
    interests: ["design", "architecture", "travel", "cooking", "art"],
    photos: [FP[2], FP[3]],
    prompts: [
      { prompt: PROMPTS[2], answer: "Museum in the morning, long lunch, something unexpected in the afternoon — a gallery opening, a stranger's recommendation." },
      { prompt: PROMPTS[1], answer: "Most 'minimalist design' isn't minimal, it's just beige." },
      { prompt: PROMPTS[6], answer: "Curiosity without agenda. You're interested in things for no reason other than they're interesting." },
    ],
  },
  {
    email: "zoe@demo.com", name: "Zoe", age: 24, gender: "FEMALE", lookingFor: "MALE",
    bio: "Climate scientist who refuses to be doomed about it. I believe in solving hard problems and long dinners. I'm annoyingly optimistic and I've been told this is both my best and worst quality.",
    location: "Seattle, WA",
    interests: ["science", "hiking", "ceramics", "cooking", "sustainability"],
    photos: [FP[4], FP[5]],
    prompts: [
      { prompt: PROMPTS[5], answer: "Why soil is the most underrated thing on earth. Literally. I'll start." },
      { prompt: PROMPTS[2], answer: "Long hike, dumb podcast, homemade pasta, one good movie." },
      { prompt: PROMPTS[1], answer: "Optimism is not naive. It's a moral stance." },
    ],
  },
  {
    email: "nadia@demo.com", name: "Nadia", age: 27, gender: "FEMALE", lookingFor: "MALE",
    bio: "Clinical psychologist in training who knows exactly why I make the choices I make and still makes them anyway. I listen for a living and sometimes I need to be the one who talks. I'm genuinely interested in what you're afraid of. In a good way.",
    location: "Chicago, IL",
    interests: ["psychology", "reading", "dance", "wine", "travel"],
    photos: [FP[6], FP[7]],
    prompts: [
      { prompt: PROMPTS[1], answer: "Most people's problems are about control, not what they say they're about. Mine included." },
      { prompt: PROMPTS[6], answer: "You've changed your mind about something important in the last year." },
      { prompt: PROMPTS[4], answer: "Being asked a question nobody has asked me before." },
    ],
  },
  {
    email: "elara@demo.com", name: "Elara", age: 23, gender: "FEMALE", lookingFor: "MALE",
    bio: "Product manager at a startup that might work. Originally from Lagos, moved to SF for grad school, stayed because the produce is exceptional and I'm still figuring out if that's a good reason. I make decisions for a living and I'm great at it. Personally, I take forever.",
    location: "San Francisco, CA",
    interests: ["startups", "design", "afrobeats", "cooking", "hiking"],
    photos: [FP[8], FP[9]],
    prompts: [
      { prompt: PROMPTS[2], answer: "Nowhere I have to be, something good cooking, someone interesting talking. That's it. That's the whole thing." },
      { prompt: PROMPTS[0], answer: "Decisiveness is a skill you can learn. People who say they're 'just indecisive' have decided to be." },
      { prompt: PROMPTS[3], answer: "That most product decisions are actually people decisions in disguise." },
    ],
  },
  {
    email: "simone@demo.com", name: "Simone", age: 29, gender: "FEMALE", lookingFor: "MALE",
    bio: "Environmental lawyer who sues polluters for a living. People assume I'm angry all the time. I'm mostly just very focused. I do get angry about things that deserve it. I've been told this is either intimidating or attractive. Hoping it's the second.",
    location: "Austin, TX",
    interests: ["law", "climbing", "sustainability", "running", "books"],
    photos: [FP[10], FP[11]],
    prompts: [
      { prompt: PROMPTS[1], answer: "'I'm not political' is itself a political position. One that benefits whoever's already in power." },
      { prompt: PROMPTS[6], answer: "You argue with me and don't need me to agree. I need someone who will push back." },
      { prompt: PROMPTS[5], answer: "Soil carbon sequestration. I'm aware this is not a normal answer. I stand by it." },
    ],
  },
  {
    email: "jade@demo.com", name: "Jade", age: 26, gender: "FEMALE", lookingFor: "MALE",
    bio: "UX researcher who interviews strangers for a living and genuinely loves it. I'm deeply curious about why people do things they can't explain. My superpower is making people feel heard in 30 minutes or less. My kryptonite is small talk.",
    location: "Seattle, WA",
    interests: ["research", "photography", "yoga", "coffee", "writing"],
    photos: [FP[0], FP[6]],
    prompts: [
      { prompt: PROMPTS[7], answer: "Asking and actually listening. Not listening while thinking about what I want to say." },
      { prompt: PROMPTS[3], answer: "That 'I don't know' is one of the most trustworthy things a person can say." },
      { prompt: PROMPTS[2], answer: "Quiet morning, long walk with no destination, coffee somewhere new, conversation with no agenda." },
    ],
  },
  {
    email: "amara@demo.com", name: "Amara", age: 28, gender: "FEMALE", lookingFor: "MALE",
    bio: "Fashion editor who thinks the industry is broken in interesting ways and is trying to fix a small piece of it. I care about craft, not trends. I've worn the same three pairs of shoes for two years. I know exactly why this is a contradiction.",
    location: "New York, NY",
    interests: ["fashion", "art", "travel", "literature", "cooking"],
    photos: [FP[1], FP[7]],
    prompts: [
      { prompt: PROMPTS[1], answer: "Sustainable fashion is mostly marketing. Real sustainability is buying less. The industry won't tell you that." },
      { prompt: PROMPTS[4], answer: "Someone who notices things. Details. The small things that most people walk past." },
      { prompt: PROMPTS[6], answer: "You have taste. Not expensive taste — considered taste. There's a difference." },
    ],
  },
  {
    email: "cleo@demo.com", name: "Cleo", age: 24, gender: "FEMALE", lookingFor: "MALE",
    bio: "Marine biologist studying bioluminescence — which means I spend a lot of time in the dark looking for things that glow. I think the ocean is the best argument for the existence of wonder. I am very easy to talk to about everything except small talk.",
    location: "Boston, MA",
    interests: ["science", "diving", "photography", "hiking", "reading"],
    photos: [FP[2], FP[8]],
    prompts: [
      { prompt: PROMPTS[5], answer: "Deep sea creatures. There are animals down there that make no evolutionary sense and I love them." },
      { prompt: PROMPTS[3], answer: "That most of life on earth has never seen the sun, and it's doing fine." },
      { prompt: PROMPTS[2], answer: "Early dive, weird sea creature sighting, long lunch talking about it, reading until dark." },
    ],
  },

  // --- 4 new females, all pre-liked alex ---
  {
    email: "luna@demo.com", name: "Luna", age: 25, gender: "FEMALE", lookingFor: "MALE",
    bio: "Astronomer by training, science communicator by choice. I explain black holes to strangers at parties and somehow they don't leave. I think the universe is big enough that being a little weird is fine. I have opinions about the moon.",
    location: "Los Angeles, CA",
    interests: ["astronomy", "writing", "hiking", "coffee", "photography"],
    photos: [FP[3], FP[9]],
    prompts: [
      { prompt: PROMPTS[5], answer: "Why Pluto deserves more respect. Yes, I know it's not a planet anymore. That's exactly the problem." },
      { prompt: PROMPTS[2], answer: "Somewhere dark enough to see stars. A thermos of something warm. No plans." },
      { prompt: PROMPTS[3], answer: "That most people dramatically underestimate how interesting the sky above them is." },
    ],
  },
  {
    email: "rose@demo.com", name: "Rose", age: 28, gender: "FEMALE", lookingFor: "MALE",
    bio: "Pastry chef with a savory problem — I keep trying to make desserts that taste like actual meals. My friends are extremely tired of being test subjects and extremely well-fed. I work strange hours and I'm very awake at 2am.",
    location: "San Francisco, CA",
    interests: ["cooking", "wine", "markets", "ceramics", "travel"],
    photos: [FP[4], FP[10]],
    prompts: [
      { prompt: PROMPTS[0], answer: "Butter is never the wrong answer. I will not be moved on this." },
      { prompt: PROMPTS[4], answer: "Someone who eats enthusiastically. Not politely. Enthusiastically." },
      { prompt: PROMPTS[2], answer: "Early morning at the market, long afternoon in the kitchen, dinner with people who aren't looking at their phones." },
    ],
  },
  {
    email: "isabella@demo.com", name: "Isabella", age: 27, gender: "FEMALE", lookingFor: "MALE",
    bio: "Art historian who thinks everything is more interesting when you know why it was made. I work at a museum and I've been thrown out of exactly one auction house. The story is worth asking about. I'm direct, I have high standards, and I'm tired of pretending otherwise.",
    location: "New York, NY",
    interests: ["art", "history", "wine", "travel", "philosophy"],
    photos: [FP[5], FP[11]],
    prompts: [
      { prompt: PROMPTS[1], answer: "Most people who say they 'don't get art' are actually having a real response to it. They've just been told their response is wrong." },
      { prompt: PROMPTS[6], answer: "You have a perspective, not just preferences. There's a difference." },
      { prompt: PROMPTS[2], answer: "Museum before the crowds, a long lunch arguing about something, bookshop, home, cook something ambitious." },
    ],
  },
  {
    email: "petra@demo.com", name: "Petra", age: 30, gender: "FEMALE", lookingFor: "MALE",
    bio: "Mathematician working on problems I can't explain at dinner parties. I try anyway. I grew up in Prague, live in Chicago now, and I still find American portion sizes alarming. I'm reserved until I'm not, and then I am very much not.",
    location: "Chicago, IL",
    interests: ["mathematics", "chess", "running", "literature", "coffee"],
    photos: [FP[6], FP[0]],
    prompts: [
      { prompt: PROMPTS[1], answer: "Most people are better at abstract thinking than they believe. They just had one bad math teacher." },
      { prompt: PROMPTS[3], answer: "That elegance is a real thing and not just aesthetic. The most correct answer is usually the most beautiful one." },
      { prompt: PROMPTS[6], answer: "You say what you mean. I'll spend three days assuming you meant something else if you don't." },
    ],
  },

  // --- 7 new males ---
  {
    email: "daniel@demo.com", name: "Daniel", age: 28, gender: "MALE", lookingFor: "FEMALE",
    bio: "Trauma surgeon who is somehow also a morning person. I have a theory that the people who work the most intense jobs are often the most present outside of them — you learn fast what's worth your attention. I cook elaborate breakfasts on days off. It's a coping mechanism and I'm fine with that.",
    location: "Houston, TX",
    interests: ["cooking", "running", "jazz", "travel", "reading"],
    photos: ["https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&q=80", "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[6], answer: "You can sit in comfortable silence. Conversation is great. Silence that isn't awkward is rarer and better." },
      { prompt: PROMPTS[2], answer: "Up at 6, long run, two-hour breakfast I actually cooked, read something that has nothing to do with medicine, sleep by 9pm like the deeply uncool person I am." },
      { prompt: PROMPTS[1], answer: "Rest is productive. The culture that treats exhaustion as a personality trait is genuinely killing people. I've seen it." },
    ],
  },
  {
    email: "ryan@demo.com", name: "Ryan", age: 26, gender: "MALE", lookingFor: "FEMALE",
    bio: "Stand-up comedian who writes jokes about things I'm afraid of, which means my set is basically a therapy session with better timing. I've bombed in 14 cities. I've killed in 6. The ratio is improving. I'm looking for someone who laughs at things most people don't notice.",
    location: "Los Angeles, CA",
    interests: ["comedy", "film", "writing", "coffee", "cycling"],
    photos: ["https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=800&q=80", "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[0], answer: "Uncomfortable comedy is more honest than comfortable comedy. If a joke doesn't risk something, it's not really a joke." },
      { prompt: PROMPTS[4], answer: "Laughing at something I said that wasn't even meant to be funny. That's the one." },
      { prompt: PROMPTS[5], answer: "Joke structure. I'll explain why something is funny in a way that makes it funnier. This is a gift and a curse." },
    ],
  },
  {
    email: "james@demo.com", name: "James", age: 33, gender: "MALE", lookingFor: "FEMALE",
    bio: "Foreign correspondent who spent three years in Southeast Asia and came back changed in ways I'm still figuring out. I write long-form journalism about places most people only see in headlines. I think context is the rarest thing in the world right now.",
    location: "Washington, DC",
    interests: ["journalism", "travel", "history", "photography", "language"],
    photos: ["https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80", "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[3], answer: "That most of what we think we know about places we've never been is wrong, and not in an obvious way." },
      { prompt: PROMPTS[6], answer: "You've changed your mind about something big in public and weren't embarrassed about it." },
      { prompt: PROMPTS[2], answer: "Somewhere I've never been. Any city. I'll find the good coffee, the local paper, and something worth writing about." },
    ],
  },
  {
    email: "noah@demo.com", name: "Noah", age: 25, gender: "MALE", lookingFor: "FEMALE",
    bio: "Marine who got out after six years, now studying philosophy at 25 surrounded by 18-year-olds who've read more Nietzsche than I have and less of everything else. It's humbling in a good way. I think about ethics constantly — occupational hazard that became a genuine obsession.",
    location: "Nashville, TN",
    interests: ["philosophy", "hiking", "reading", "weightlifting", "music"],
    photos: ["https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&q=80", "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[0], answer: "Moral intuitions are data, not noise. When something feels wrong before you can explain why, that feeling deserves to be interrogated, not dismissed." },
      { prompt: PROMPTS[4], answer: "Someone who asks follow-up questions. Not 'that's interesting' — an actual question. It's rarer than it should be." },
      { prompt: PROMPTS[5], answer: "Why people follow orders they disagree with. I've thought about this more than anyone should have to." },
    ],
  },
  {
    email: "ethan@demo.com", name: "Ethan", age: 29, gender: "MALE", lookingFor: "FEMALE",
    bio: "Landscape photographer who drives 6 hours to catch a 4-minute window of light and considers this a completely normal use of a Tuesday. I've slept in my car in 11 states. My photos have been in places I can't quite believe yet. I'm easy to be around but hard to pin down to a schedule.",
    location: "Denver, CO",
    interests: ["photography", "hiking", "climbing", "travel", "coffee"],
    photos: ["https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=800&q=80", "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[2], answer: "Somewhere I've never been at a time of day I've never seen it. Every place looks different at the wrong hour." },
      { prompt: PROMPTS[3], answer: "That being in the right place at the right time isn't luck — it's preparation and then patience." },
      { prompt: PROMPTS[6], answer: "You're okay not knowing what comes next. Plans are good. Attachment to plans is different." },
    ],
  },
  {
    email: "carlos@demo.com", name: "Carlos", age: 31, gender: "MALE", lookingFor: "FEMALE",
    bio: "Criminal defense attorney who believes everyone deserves a real defense, which makes me unpopular at some dinner parties and very good at my job. I grew up in Miami, live in Chicago, and I still haven't fully accepted that you can't get good Cuban food in the Midwest.",
    location: "Chicago, IL",
    interests: ["law", "salsa", "cooking", "boxing", "reading"],
    photos: ["https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=800&q=80", "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[1], answer: "Believing in due process isn't the same as believing people are innocent. It means believing the process matters more than the outcome. Most people can't hold that distinction." },
      { prompt: PROMPTS[4], answer: "Someone who argues back. Not to win — to figure out what's actually true. That's the sexiest thing I can think of." },
      { prompt: PROMPTS[0], answer: "The best food is always the food someone's grandmother made. No restaurant has ever beaten it." },
    ],
  },
  {
    email: "ben@demo.com", name: "Ben", age: 27, gender: "MALE", lookingFor: "FEMALE",
    bio: "Occupational therapist working with kids who have sensory processing differences. I spend my days helping children understand their own bodies and I've learned more about patience from a six-year-old than from any adult. I'm quiet in groups and very loud one-on-one.",
    location: "Minneapolis, MN",
    interests: ["climbing", "music", "cooking", "reading", "board games"],
    photos: ["https://images.unsplash.com/photo-1596075780750-81249df16d19?w=800&q=80", "https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[7], answer: "Paying attention. Not performing attention — actually noticing things about someone and remembering them later." },
      { prompt: PROMPTS[6], answer: "You're gentle with things. Objects, animals, people. There's information in how someone handles fragile things." },
      { prompt: PROMPTS[2], answer: "Climbing gym in the morning, cook something that requires actual effort, read on the couch, see one friend, early night." },
    ],
  },

  // --- 7 new females ---
  {
    email: "sofia@demo.com", name: "Sofia", age: 26, gender: "FEMALE", lookingFor: "MALE",
    bio: "Neuroscientist studying how the brain consolidates memory during sleep, which means I think about dreaming for a living and still don't know why we do it. Originally from Buenos Aires. I dance tango badly on Thursdays and it's the best part of my week.",
    location: "Boston, MA",
    interests: ["neuroscience", "tango", "reading", "coffee", "travel"],
    photos: ["https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&q=80", "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[5], answer: "Why we sleep. We spend a third of our lives unconscious and nobody really knows why. I find this terrifying and beautiful." },
      { prompt: PROMPTS[1], answer: "Dreams are not random noise. They are the brain practicing something. I'll debate this with anyone." },
      { prompt: PROMPTS[4], answer: "Someone who is genuinely curious about something I don't understand yet. Teach me something tonight." },
    ],
  },
  {
    email: "claire@demo.com", name: "Claire", age: 28, gender: "FEMALE", lookingFor: "MALE",
    bio: "Architect specializing in affordable housing. I design spaces for people who are usually an afterthought in this industry. It's the hardest, slowest work I've ever done and I can't imagine doing anything else. I sketch on everything. I have ruined several napkins.",
    location: "Detroit, MI",
    interests: ["architecture", "urbanism", "cycling", "ceramics", "wine"],
    photos: ["https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&q=80", "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[1], answer: "Most cities are designed for cars, not people, and we've so thoroughly normalized this that it reads as neutral. It is not neutral." },
      { prompt: PROMPTS[6], answer: "You notice when something is well-made. Not expensive — well-made. The difference matters." },
      { prompt: PROMPTS[2], answer: "Bike ride somewhere I haven't been, long lunch, find a building worth looking at, sketch it badly, go home full." },
    ],
  },
  {
    email: "aisha@demo.com", name: "Aisha", age: 27, gender: "FEMALE", lookingFor: "MALE",
    bio: "Epidemiologist who spent two years doing field work in West Africa and came back with a completely recalibrated sense of what actually matters. I'm data-driven about work and embarrassingly sentimental about everything else. My friends say I'm the most organized chaotic person they know.",
    location: "Atlanta, GA",
    interests: ["public health", "travel", "cooking", "running", "books"],
    photos: ["https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80", "https://images.unsplash.com/photo-1569124589354-615739ae007b?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[3], answer: "That proximity to suffering either breaks you or makes you impossible to impress by trivial things. I'm the second one." },
      { prompt: PROMPTS[6], answer: "You show up. Plans change, life gets complicated — but when you say you'll be somewhere, you're there." },
      { prompt: PROMPTS[2], answer: "Long run, call my mother, cook something from home, have one real conversation with one person. That's enough." },
    ],
  },
  {
    email: "hannah@demo.com", name: "Hannah", age: 24, gender: "FEMALE", lookingFor: "MALE",
    bio: "Jazz pianist performing at venues ranging from 'intimate' (read: empty) to occasionally quite full. I practice 4 hours a day and my neighbors have been extraordinarily patient. I think music is the closest thing to reading someone's mind and I'm always listening to what people aren't saying.",
    location: "New York, NY",
    interests: ["jazz", "music", "philosophy", "coffee", "film"],
    photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80", "https://images.unsplash.com/photo-1546961342-ea5f62d85a3b?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[0], answer: "Silence in music is as important as sound. Most people talking don't understand that silence works the same way in conversation." },
      { prompt: PROMPTS[5], answer: "Why Bill Evans played the way he did. I have a 40-minute answer. I've been asked to shorten it." },
      { prompt: PROMPTS[4], answer: "Coming to a show. Not out of obligation. Because you actually want to hear something." },
    ],
  },
  {
    email: "vera@demo.com", name: "Vera", age: 31, gender: "FEMALE", lookingFor: "MALE",
    bio: "Forensic accountant who finds financial crime inexplicably fascinating. I track money through shell companies for a living, which makes me terrible at watching heist movies ('that's not how that works') and very good at spotting when something doesn't add up. I'm from Kyiv, been in the US for seven years, and I make the best borscht in Chicago.",
    location: "Chicago, IL",
    interests: ["finance", "chess", "cooking", "reading", "wine"],
    photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80", "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[1], answer: "The most interesting criminals are the boring ones. The flashy ones always get caught. The scary ones look like accountants." },
      { prompt: PROMPTS[6], answer: "You're direct. I grew up in a culture of subtext and I've spent years unlearning it. I don't want to have to learn it again." },
      { prompt: PROMPTS[2], answer: "Farmers market, chess with my neighbor who always beats me, cook for three hours, eat slowly, read something long." },
    ],
  },
  {
    email: "maya2@demo.com", name: "Leila", age: 29, gender: "FEMALE", lookingFor: "MALE",
    bio: "Palliative care doctor who has probably had more conversations about death than anyone you'll meet today. It changes you. I am very, very good at knowing what matters and very bad at caring about things that don't. I laugh easily. People find this surprising given what I do. I don't.",
    location: "San Francisco, CA",
    interests: ["medicine", "hiking", "cooking", "music", "philosophy"],
    photos: ["https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&q=80", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[3], answer: "That nobody in the last days of their life has ever told me they wished they'd worked more. This is not a cliché. It's empirical data." },
      { prompt: PROMPTS[1], answer: "We handle death completely wrong as a culture and it makes everything — grief, illness, aging — harder than it has to be." },
      { prompt: PROMPTS[6], answer: "You've thought seriously about what kind of person you want to be, not just what you want to do." },
    ],
  },
  {
    email: "nina@demo.com", name: "Nina", age: 25, gender: "FEMALE", lookingFor: "MALE",
    bio: "Competitive fencer ranked 12th nationally, which is a fact that consistently surprises people because fencing is apparently not what they picture. I'm fast, precise, and I read people for weaknesses — in the sport, not in life, I promise. I'm actually quite warm. The sword is at home.",
    location: "Philadelphia, PA",
    interests: ["fencing", "chess", "languages", "travel", "cooking"],
    photos: ["https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80", "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&q=80"],
    prompts: [
      { prompt: PROMPTS[0], answer: "Fencing is the most mentally demanding sport that nobody watches, and I've accepted that I'll spend my career explaining this." },
      { prompt: PROMPTS[2], answer: "Train in the morning, win an argument I wasn't expecting to have, eat something excellent, watch a film I don't understand, sleep well." },
      { prompt: PROMPTS[6], answer: "You have something you're serious about. Not casually interested in — serious about. The subject doesn't matter." },
    ],
  },
];

// Which female emails have pre-liked alex
// pending = alex hasn't responded yet (will see them in discover → instant match on right swipe)
// matched = mutual like already, appears in /matches
// chatted = mutual like + has messages
const PRE_LIKED_PENDING = ["maya", "priya", "nadia", "elara", "simone"];
const PRE_MATCHED = ["luna", "isabella"]; // already mutual
const PRE_CHATTED = "petra"; // mutual + conversation

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.promptAnswer.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const createdUsers: Record<string, string> = {}; // email prefix → userId

  for (const userData of seedUsers) {
    const hashedPassword = await bcrypt.hash("password123", 12);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        profile: {
          create: {
            name: userData.name,
            age: userData.age,
            gender: userData.gender,
            lookingFor: userData.lookingFor,
            bio: userData.bio,
            location: userData.location,
            interests: JSON.stringify(userData.interests),
            photos: { create: userData.photos.map((url, i) => ({ url, order: i })) },
            prompts: { create: userData.prompts.map((p, i) => ({ ...p, order: i })) },
          },
        },
      },
    });
    const prefix = userData.email.split("@")[0];
    createdUsers[prefix] = user.id;
    console.log(`  ✓ ${userData.name} (${userData.email})`);
  }

  const alexId = createdUsers["alex"];

  // --- Pending: these females liked alex, alex hasn't seen them yet ---
  for (const name of PRE_LIKED_PENDING) {
    const femaleId = createdUsers[name];
    await prisma.swipe.create({
      data: { swiperId: femaleId, swipedId: alexId, liked: true },
    });
  }
  console.log(`\n  ✓ ${PRE_LIKED_PENDING.length} pending likes on alex (swipe right for instant match)`);

  // --- Matched: mutual likes, Match record created ---
  for (const name of PRE_MATCHED) {
    const femaleId = createdUsers[name];
    const [userAId, userBId] = [alexId, femaleId].sort();

    await prisma.swipe.createMany({
      data: [
        { swiperId: alexId, swipedId: femaleId, liked: true },
        { swiperId: femaleId, swipedId: alexId, liked: true },
      ],
    });
    await prisma.match.create({ data: { userAId, userBId } });
  }
  console.log(`  ✓ ${PRE_MATCHED.length} existing matches for alex (visible in /matches)`);

  // --- Chatted: mutual like + a conversation ---
  const petraId = createdUsers[PRE_CHATTED];
  const [userAId, userBId] = [alexId, petraId].sort();

  await prisma.swipe.createMany({
    data: [
      { swiperId: alexId, swipedId: petraId, liked: true },
      { swiperId: petraId, swipedId: alexId, liked: true },
    ],
  });
  const match = await prisma.match.create({ data: { userAId, userBId } });

  const conversation = [
    { senderId: petraId,  content: "Hi. I read your bio twice. The bit about cooking things that matter — I liked that." },
    { senderId: alexId,   content: "Ha — that's the most Czech compliment I've ever received. I appreciate the precision." },
    { senderId: petraId,  content: "I'm from Prague. We don't do compliments, we do observations." },
    { senderId: alexId,   content: "Okay, observation: what do you actually work on? You said problems you can't explain at dinner parties." },
    { senderId: petraId,  content: "Topological data analysis. I look for shapes in high-dimensional datasets that shouldn't have shapes." },
    { senderId: alexId,   content: "That genuinely sounds like magic. What made you want to do that?" },
    { senderId: petraId,  content: "I had a professor who said all of mathematics is just finding the right language to describe something you already know is true. I haven't stopped thinking about that." },
    { senderId: alexId,   content: "I want to steal that quote. Are you protective of it?" },
    { senderId: petraId,  content: "Take it. Good ideas should move." },
  ];

  const now = Date.now();
  for (let i = 0; i < conversation.length; i++) {
    await prisma.message.create({
      data: {
        matchId: match.id,
        senderId: conversation[i].senderId,
        content: conversation[i].content,
        read: true,
        createdAt: new Date(now - (conversation.length - i) * 4 * 60 * 1000),
      },
    });
  }
  console.log(`  ✓ Match + conversation seeded with ${PRE_CHATTED}`);

  console.log(`\n✅ ${seedUsers.length} users created`);
  console.log(`   Password for all: password123`);
  console.log(`\n   Test as alex@demo.com to:`);
  console.log(`   → Swipe right on Maya, Priya, Nadia, Elara, Simone → instant match`);
  console.log(`   → /matches already shows Luna, Isabella, Petra`);
  console.log(`   → /messages/[petra's match] has a full conversation`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
