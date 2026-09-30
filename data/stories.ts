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
  }
];

export function getAllStories(): FishingStory[] {
  return stories;
}

export function getStoryBySlug(slug: string): FishingStory | undefined {
  return stories.find((story) => story.slug === slug);
}
