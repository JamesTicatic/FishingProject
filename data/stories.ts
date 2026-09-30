export interface StoryImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface FishingStory {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // multi-paragraph narrative text
  location: string;
  species: string[];
  gear: string[];
  date: string;
  coverImage?: StoryImage;
}

export const stories: FishingStory[] = [
  {
    id: "story-1",
    slug: "fort-fisher-pelagics-and-blacktips",
    title: "Full Throttle at Fort Fisher: Drum, Pelagics, and Blacktips",
    excerpt:
      "An explosive double-charter out of North Carolina featuring high-speed jetty runs, sight-casting redfish on the flats, and acrobatic blacktip sharks.",
    content: `The morning began at full throttle. Launching out of Fort Fisher, North Carolina, our party of six split across two inshore skiffs, heading straight toward a looming granite rock jetty. For a terrifying minute, every one of us thought the captains were steering us directly into a collision—until we learned the deep-water channel hugged the rocks within inches. It was an adrenaline-pumping welcome to Cape Fear waters.

  While the second boat focused on 'filling the freezer'—slamming keeper red drum, black drum, sheepshead, flounder, and the occasional sea robin on live crab and mullet—my boat was locked in on a different mission. Joining me were Jason and Andrew, two seasoned anglers itching to bend a rod again after a long dry spell. Our captain was an intense, hyper-focused guide who lived for sight-casting redfish on the shallow flats. 

  We paused in a marsh creek for a quick briefing, but mid-sentence, the captain suddenly slammed the throttle and shot the boat 200 yards up the bank. He’d spotted a push of fish and wasn't about to let another boat beat us to the target. He quickly handed us our weapons: a topwater walk-the-dog plug for me, a soft plastic on a jighead for Andrew, and a live mullet for Jason. 

  The tension was suffocating. We needed long, silent, surgical casts. Fueled by excitement, Jason fired off a cast before the captain gave the signal, tangling his line in the console rod holders. I stepped up for my shot and completely blew the placement. It was a cold, awkward start with a guide who expected perfection. Fortunately, the school didn't spook. On our second attempt, both Jason and I hooked up simultaneously, leaving Andrew on deck cheering us on.

  After thirty minutes of suffocating, windless marsh heat, we made a move out through the inlet in search of a breeze and fast action. Tying on heavy metal spoons, we began burning retrieves for pelagics in the crystal-clear water. Immediately, the ocean exploded. Spanish mackerel, bluefish, and aggressive jack crevalle were chasing down our lures on every throw—delivering the non-stop action and hard strikes every angler craves.

  To top off an already unforgettable day, a school of massive sharks began cruising the rips. We managed to hook into a powerful blacktip shark, sending our gear into overdrive as it put on a clinic of lightning-fast directional shifts, raw power, and corkscrewing aerial jumps.

  Sharing a day like this with lifelong friends—building on a bond that’s lasted for years—is what saltwater fishing is all about. Watching that blacktip breach against the Carolina sky, surrounded by best friends, was a core memory locked in for a lifetime.`,
    location: "Fort Fisher, North Carolina",
    species: [
      "Red Drum",
      "Black Drum",
      "Spanish Mackerel",
      "Jack Crevalle",
      "Bluefish",
      "Blacktip Shark",
      "Flounder",
      "Sheepshead"
    ],
    gear: [
      "Inshore Skiff",
      "Topwater Walk-the-Dog Plug",
      "Soft Plastic Jig",
      "Casting Spoons",
      "Live Bait (Mullet & Crab)"
    ],
    date: "August 20, 2026",
    coverImage: {
      url: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/Andrew2026.jpg",
      alt: "Andrew holding his monster catch",
      caption: "Sight-casting metal at fast moving pelagics." // optional
    },
  },
  {
    id: "story-2",
    slug: "casco-bay-ferry-dock-pollock-mackerel",
    title: "Spincast Sabikis on Casco Bay",
    excerpt:
      "A hot afternoon in Portland turns into an impromptu pier session with light spincast gear, schooling harbor mackerel, and a quick reel tune-up to pay it forward.",
    content: `August in Portland, Maine, brought a heavy, humid blanket over the Old Port. Mom and I were wandering the waterfront before my sister wrapped up work for her birthday trip. Most of the harbor shoreline is closed to angling due to patio dining, private marinas, and bustling tourist shops, leaving little room for anyone trying to wet a line. But from a trip the year prior, I remembered the public pocket at the Maine State Pier right alongside the Casco Bay Lines ferry terminal.

  Mom was worn down by the midday heat, but the setup couldn't have worked out better. The ferry terminal’s air-conditioned lobby gave her a cool retreat with expansive windows to people-watch the steady parade of New England summer vacationers catching boats out to the islands. I spend a fair share of time doing the same over the course of this trip, and daydream about the spectacular weddings and events that are being held on surrounding islands. Meanwhile, I stepped out onto the sun-baked planks to see if anything fishy is afoot.

  This dock is home water for anglers without a boat, made immediately obvious by the gritty, unconventional tackle on display. That’s where I met Dan. He was out there killing time while waiting for his girlfriend's shift in town to end, working a sabiki rig for pollock and mackerel. What caught my eye immediately was his outfit: a pair of light-action Zebco spincast push-button combos. Running freshwater push-buttons in saltwater is practically heresy on paper, but the fish in the slip clearly hadn't read the rulebook.

  Dan didn’t hesitate to offer me his spare combo. As we leaned over the timber railing, we traded notes on local tides, regional tactics, and the quiet satisfaction of decoding water thousands of miles from home. Angling has this great way of bridging backgrounds—even when the species and gear look foreign, the instincts carry right over.

  Dropping straight down beside the pier pilings produced immediate hits from harbor pollock. But the real prize was casting out into the open current. Schools of Atlantic mackerel were tearing through the green tide, hammering the tiny sabiki quills and pulling with a surprising, bulldogging fury on the flimsy freshwater rod. Bringing in that first Maine mackerel was an honest, humble catch, but easily one of the most rewarding moments of the entire trip.

  Midway through the blitz, Dan’s borrowed reel jammed up—a classic mechanical slip inside the spincast hood. Fortunately, my time volunteering and repairing basic tackle back home in Colorado paid off. I stripped the housing down, reseated the line catch mechanism, and had it humming again in minutes, officially earning my keep for the rod he’d handed me. It was simple dockside fishing at its absolute best: spontaneous, generous, and bound together by shared water.`,
    location: "Maine State Pier, Portland, Maine",
    species: [
      "Atlantic Mackerel",
      "Pollock"
    ],
    gear: [
      "Zebco Spincast Combo (Light Action)",
      "Sabiki Rig",
      "Terminal Pier Tackle"
    ],
    date: "August 4, 2026",
    coverImage: {
      url: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/MackerelAug42026.jpg",
      alt: "Mackerel on top of dock cleat",
      caption: "A humble beggining to Maine angling for me." // optional
    },
  },
  {
    id: "story-3",
    slug: "king-tide-and-gotcha-blitz-johnnie-mercers-pier",
    title: "King Tides and Gotcha Blitzes at Johnnie Mercers Pier",
    excerpt:
      "A booking blunder turns into a sunrise dash to Wrightsville Beach, where an incoming nor'easter, tricky pompano jigs, and an explosive pelagic bite deliver an unforgettable day on the planks.",
    content: `It was late Thursday night when our weekend logistics unraveled. With a mandatory Saturday return to Raleigh on the schedule, my window to hit Johnnie Mercers Pier was razor-thin. Word out of Wrightsville Beach was that the pelagics were annihilating Gotcha plugs on schedule, and I had drawn up the perfect Friday game plan—fish the morning, check into the hotel, and unwind. Then came the gut punch: our hotel reservation had actually been booked for Thursday night, not Friday.

  After briefly and fruitlessly scrambling for someone else to blame, reality set in. We either hit the highway immediately, checked in late, and made first light on the pier, or we bailed on the trip entirely. I was beating myself up over the logistical fumble, but talking it through with Mom ended the spiral. Moms have an unmatched superpower for shrinking stress down to size: pack up, make the drive, and shake it off. 

  A few short hours of sleep and a hurried breakfast later, we walked out onto the concrete planks right at 7:00 AM. A gathering nor'easter coupled with a full king tide had pushed the search clean up to the legs of the lifeguard towers. Despite the raw chop, the water retained that crystalline, Carolina blue clarity that feels surreal every time you see it.

  Local talk along the rails was all about an aggressive bluefish slam at daybreak. A few heavy blues were still being hauled over the wooden boards, but they were dialing strictly into live mullet—a bait I didn't have rigged. Mom grabbed the high-low rig tipped with frozen shrimp and enjoyed the morning catching steady pinfish, while I reached for a goofy jig to prospect for stray Pompano.

  The vertical pier drop makes short, precise rod work mandatory. I was running a newly added 5'10" medium-action Ugly Stik—a deliberate downsize from the clunky surf sticks I used to haul out here. The shorter blank had just enough flex to flick the jig into a sharp darting hop without yanking it out of the strike column in heavy swell. Distinguishing the strike was a guessing game, until the line loaded up solid. Right as pier regular Tony Carter strolled past—fresh off our earlier discussion crowning Pompano the king of table fare—I swung a 10 inch Pompano over the rail. Not a notable catch, but I knew the day was made with one bite. 

  From mid-morning toward noon, the pier transformed into a circus. I lobbed a fresh cut pinfish on a Carolina rig to wait on and continued working the Gotcha rod. In classic angling fashion, the bait rod went stone dead whenever I held it, only to get slammed the split second I picked up the plug. My baitrunner reel gave them plenty of free spool to pick up the chunk, but the slack let the fish shake loose before I could crank and get the line tight—a mechanical puzzle I still need to iron out.

  Then the surface erupted. Roving packs of mullet and rain minnows sprayed skyward as schools of heavy bluefish, spanish mackerel, and jack crevalle blitzed the pilings. Reels were screaming, plugs were firing into the whitewater, and rods were doubled over in every direction. 

  By afternoon, the surf calmed, the gear was packed, and that morning pompano made the journey up the road to become our centerpiece dinner in Raleigh. We laughed at how our survival skills would fail with such a small catch, but enjoyed every bite of the mild white flesh. Fishing beside Mom felt just like being a kid again—easily one of the best days on the water all summer.`,
    location: "Johnnie Mercers Pier, Wrightsville Beach, North Carolina",
    species: [
      "Florida Pompano",
      "Bluefish",
      "Spanish Mackerel",
      "Jack Crevalle",
      "Pinfish"
    ],
    gear: [
      "Goofy Jig",
      "Gotcha Plug",
      "Frozen Shrimp",
      "Cut Bait",
      "High-Low Rig",
      "Carolina Rig"
    ],
    date: "September 25, 2026",
    coverImage: {
      url: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/PompanoSept25.jpg",
      alt: "Pompano and Spanish Mackerel Catch on pier",
      caption: "One happy boy." // optional
    },
  }
];

export function getAllStories(): FishingStory[] {
  return stories;
}

export function getStoryBySlug(slug: string): FishingStory | undefined {
  return stories.find((story) => story.slug === slug);
}
