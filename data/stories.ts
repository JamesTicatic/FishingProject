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
    content: `The morning began at full throttle. Launching out of Fort Fisher, North Carolina, our party of six split across two inshore skiffs, we beelined straight toward a rock jetty. For a terrifying minute, it appeared the captains were steering us directly into a collision—Justin locked eyes with the captain to see if he was cursed with a death wish. At the last moment we veered to the left narrowly avoiding the jetty, a sigh of relief for all of us on this early morning. It was an adrenaline-pumping welcome to Cape Fear waters.

  While the second boat focused on catching enough to feed an entire 12 man golf party—slamming keeper red drum, black drum, sheepshead and flounder on live crab and mullet—my boat was locked in on a different mission. Joining me were Jason and Andrew, two seasoned anglers itching to bend a rod again after a long dry spell. Our captain was an intense, hyper-focused guide who lived for sight-casting redfish on the shallow flats. 

  We paused in a marsh creek for a quick briefing, but mid-sentence, the captain suddenly slammed the throttle. He’d spotted a school of fish and wasn't about to let another boat beat us there. He quickly handed us our weapons: a topwater walk-the-dog plug for me, a soft plastic on a jighead for Andrew, and a live mullet for Jason. 

  The tension was suffocating. We needed long, silent, surgical casts. Fueled by excitement, Jason fired off a cast before the captain gave the signal, tangling his line in the console rod holders. I stepped up for my shot and completely blew the placement. It was an awkward start with a guide who expected perfection. Fortunately, the school didn't spook. On our second attempt, both Jason and I hooked up simultaneously, leaving Andrew on deck cheering us on.

  After thirty minutes of windless marsh heat, we made a move out through the inlet. Tying on heavy metal spoons, we began burning retrieves for pelagics. The action started slow, and we shifted gears to running and gunning to find something larger. Covering miles of shoreline we saw few marks even on the side scan, and it was becoming clear Jason was getting impatient. "Can we go back to catching the real fish" he poked as we were trying to catch bait.

  This was the right decision, as the tide came in we moved to the intersection of the north and east-facing shorelines of North Carolina. Below the surface was a labyrinth of hills and troughs channeling currents in every direction. Spanish mackerel, bluefish, and aggressive jack crevalle were chasing down our lures on every throw—delivering the non-stop action and hard strikes every angler craves.

  To top off an already unforgettable day, a school of massive sharks began cruising the rips. We managed to hook into a powerful blacktip shark, sending our gear into overdrive as it put on a clinic of lightning-fast directional shifts, raw power, and corkscrewing aerial jumps.

  At lunch afterwards we all recounted the initial run out from the boat launch. Everyone admitted they’d quietly braced for impact against the rocks. We had one of the best days of fishing in our lives, but the headline that will survive the test of time isn’t the drum or the blacktips; it’s the five terrifying seconds we all believed we were going down at full throttle.`,
    location: "Wrightsville Beach, North Carolina",
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
      "Topwater Walk-the-Dog Plug",
      "Soft Plastic Jig",
      "Casting Spoons",
      "Mullet",
      "Crab"
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
      "A hot afternoon in Portland turns into an impromptu pier session with unexpected gear and schooling harbor mackerel.",
    content: `August in Portland, Maine, brought a heavy, humid blanket over the Old Port. Mom and I were wandering the waterfront before my sister wrapped up work for her birthday trip. Most of the harbor shoreline is closed to angling due to patio dining, private marinas, and bustling tourist shops, leaving little room for anyone trying to wet a line. But from a trip the year prior, I remembered seeing anglers at the Maine State Pier right alongside the Casco Bay Lines ferry terminal.

  Mom was worn down by the midday heat, but the setup couldn't have worked out better. The ferry terminal’s air-conditioned lobby gave her a cool retreat with expansive windows to people watch the steady parade of New England summer vacationers. I spend a fair share of time doing the same over the course of this trip, and daydream about the spectacular weddings and events that are being held on surrounding islands. Meanwhile, I walked down the pier to see if anything fishy is afoot.

  This dock is home water for anglers without a boat, made obvious by the gritty, unconventional tackle on display. That’s where I met Dan. He was out there killing time while waiting for his girlfriend's shift in town to end, working a sabiki rig for pollock and mackerel. What caught my eye was his gear: a pair of light action Zebco spincast combos. Running freshwater push-buttons in saltwater seemed like a mistake to me, but the fish clearly hadn't read the rulebook.

  Dan didn’t hesitate to offer me his spare combo. We traded notes on regional tactics, I learned about the coldwater saltwater fishing game and shared my experiences fly angling at high evelation. We found camaraderie discussing the quiet satisfaction of decoding water in the pursuit of fish. Angling has this great way of bridging backgrounds—even when the species and gear look foreign, the instincts carry right over.

  Dropping straight down beside the pier pilings produced immediate hits from harbor pollock. But the real prize was casting out into the open current. Schools of Atlantic mackerel were tearing through the green tide, hammering the tiny sabiki quills and pulling with a bulldogging fury on the flimsy freshwater rod. Bringing in that first Maine mackerel was a humble catch, but easily one of the most rewarding moments of the entire trip.

  Midway through the blitz, Dan’s borrowed reel jammed up—a classic mechanical slip inside the spincast hood. Fortunately, my time volunteering and repairing this exact tackle back home in Colorado paid off. I stripped the housing down, reseated the line catch mechanism, and had it humming again in minutes, officially earning my keep for the rod he’d handed me. It was simple dockside fishing at its absolute best: spontaneous, generous, and bound together by shared water.`,
    location: "Portland, Maine",
    species: [
      "Atlantic Mackerel",
      "Pollock"
    ],
    gear: [
      "Zebco Spincast Combo (Light Action)",
      "Sabiki Rig"
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
      "A booking blunder turns into a late night dash to Wrightsville Beach, where an incoming nor'easter and an explosive pelagic bite deliver an unforgettable day.",
    content: `It was late Thursday night when our weekend logistics unraveled. With a mandatory Saturday return to Raleigh, our window to hit Johnnie Mercers Pier was thin. Word out of Wrightsville Beach was that pelagics were annihilating Gotcha plugs, and I had drawn up the perfect Friday game plan. Fish the morning, check into the hotel, and unwind in preparation for a Saturday return. Then came the gut punch: our hotel reservation had actually been booked for Thursday night, not Friday.

  After fruitlessly scrambling for anyone to blame but myself, reality set in. We either hit the highway immediately and checked in late or we bailed on the trip entirely. I was beating myself up over the logistical fumble, my perfectly orchestrated plan now felt like a scramble that may not be worth pursuing. 

  Normally I would keep this frustration to myself, but I decided to share it with Mom to see her perspective. After all she would also be subjected to poorly timed long drives and a short sleep leading into a cold morning of fishing. Moms have a superpower for shrinking stress down to size: pack up, make the drive, and shake it off. A fantastic day was still waiting to be had, we just had to go get it. 

  A few short hours of sleep and a hurried breakfast later, we walked onto the pier right at 7:00 AM. A gathering nor'easter coupled with a king tide had pushed the surf up to the legs of the lifeguard towers. Despite the chop, the water retained the Carolina blue clarity that feels surreal every time you see it.

  Local talk was all about an aggressive bluefish bite at daybreak. A few heavy blues were still being caught, but they were dialing strictly into live mullet—a bait I didn't have available. Mom grabbed the high-low rig tipped with frozen shrimp and enjoyed the morning catching steady pinfish, while I reached for a goofy jig to prospect for stray Pompano.

  The height of the pier makes precise rod work mandatory when fishing moving baits. I was running a newly added 5'10" medium-action Ugly Stik—a deliberate downsize from the long, thicc surf sticks I hauled out here recently. The shorter blank had just enough flex to flick the jig into a sharp darting hop without yanking it out of the strike column. Distinguishing the strike was a guessing game, until the line loaded up solid. Right as pier regular Tony Carter strolled past—fresh off our earlier discussion crowning Pompano the king of table fare—I swung a 10 inch Pompano over the rail. Not a notable catch, but the day was made. 

  From mid-morning toward noon, the pier transformed into a circus. I lobbed a fresh cut pinfish on a Carolina rig to wait on and continued working the Gotcha rod. In classic angling fashion, the bait rod went stone dead whenever I held it, only to get slammed the split second I picked up the plug. My baitrunner reel gave them plenty of free spool to pick up the chunk, but the slack let the fish shake loose before I could crank and get the line tight—a mechanical puzzle I still need to iron out.

  Then the surface erupted. Roving packs of mullet and glass minnows sprayed skyward as schools of bluefish, spanish mackerel, and jack crevalle blitzed. Reels were screaming, plugs were firing, and rods were doubled over in every direction. 

  By afternoon, the surf calmed, the gear was packed, and that morning pompano made the journey up the road to become our centerpiece dinner in Raleigh. We laughed at how our survival skills would fail with such a small catch, but enjoyed every bite of the mild white flesh. Fishing beside Mom felt just like being a kid again—and making the day happen despite the uncertainty is a lesson I hope to keep with me for a long time.`,
    location: "Wrightsville Beach, North Carolina",
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
  },
  {
    id: "story-4",
    slug: "swifts-beach-kayak-slam-wareham-river",
    title: "Kayak Slams and Surprise Weakfish off Swifts Beach",
    excerpt:
      "A laid-back birthday paddle across the Wareham river leads to relentless scup action and an unexpected northern weakfish.",
    content: `July 23rd was my birthday, and being on vacation in Wareham, Massachusetts, meant only one thing: we were getting on the water. With clear skies and calm summer conditions, Abbie and I launched the kayaks directly off Swifts Beach proper. We didn't have an elaborate game plan—just an eye on the commercial oyster farm across the bay, which promised solid structure while keeping us safely tucked away from the busy boat channel.

  I handed Abbie a soft plastic paddle-tail jig, while I tied on a reliable high-low rig for a consistent scup bite. Abbie was hesitant, questioning whether her retrieve speed and jigging cadence were right. Back home in Colorado, presentation is an exact science. Failing to deliver a good presentation is failing to catch fish. Out here on bigger water, I told her the truth: 'There’s no right way to do it; you just need to be in the right place at the right time.' She asked how she’d detect a strike, to which I grinned: 'Trust me, you’ll know.' My instructions provided little confidence but she continued casting.

  Barely two casts into the drift, I hear the reel's drag screaming behind me. I'm used to the opposite, me being able to hook fish consistently and allowing Abbie to enjoy the fight. But it was my birthday, so I snatched the rod out of her hand and could immediately tell we found the right one for the day.

  The fish tore off through the current, ripping toward the anchor ropes of the oyster floats and navigation markers. I felt the  heavy, sweeping headshakes that screamed striper. When the fish finally surfaced beside the hull, a long flash of iridescent silver broke through. As I reached to boat it, I stopped dead—it wasn't a striper at all, but a gorgeous northern weakfish (squeteague). In Florida, I'd only ever run into smaller specimens, making this broad-shouldered Buzzards Bay squeteague an unexpected trophy.

  From there, the high-low rig took over the morning. The scup bite was so furious that we abandoned jigging altogether so both of us could drop bait into the feeding frenzy. Mixed in with the scup came a feisty dogfish and a small black sea bass, rounding out an impromptu Wareham River inshore slam.

  After a midday breather onshore, I pushed back out with Sam to explore the 'secret passage'—a winding, narrow tidal creek snaking back through the salt marsh. The channel ran surprisingly deep, flanked by cordgrass and sheltering terrapins. We worked our way back out toward the deeper rip, picking up steady scup on the drop and daydreaming about what other migratory oddities might slip into this bay before summer closes.`,
    location: "Wareham, Massachusetts",
    species: [
      "Weakfish",
      "Scup",
      "Black Sea Bass",
      "Dogfish"
    ],
    gear: [
      "Soft Plastic Jig",
      "High-Low Rig",
      "Squid"
    ],
    date: "July 23, 2026",
    coverImage: {
      url: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/bdayweakfish.jpg",
      alt: "Weakfish being held on kayak",
      caption: "Trophy Wareham Weakfish" // optional
    },
  },
  {
    id: "story-5",
    slug: "clear-lake-colorado-trout-and-floating-fish-lore",
    title: "Flashback Pheasant Tails and Floating Fish Lore at Clear Lake",
    excerpt:
      "A spontaneous drive past high-traffic canyon stretches leads to alpine redemption and an inside joke a decade in the making.",
    content: `It was a pristine morning in Colorado as Andres and I carved our way up Clear Creek Canyon. The goal was simple: get outdoors and soak in the rugged Front Range scenery. We hadn't dialed in a destination beforehand, and as we wound along the creek, Andres felt a wave of disappointment—the canyon was crawling with traffic, and it was a place he’d visited far too recently. At the time, I was focused on refining my fly fishing technique, often visiting heavily pressured water specifically to sharpen my game. But the endless self-criticism and obsession with improving had been slowly leeching the joy out of the sport. 

  Pivoting mid-drive, I suggested pushing past the canyon crowds toward Clear Lake, a high-elevation alpine fishery tucked above Georgetown that neither of us had explored. We got Baja Blasted at Taco Bell, and the moment we arrived at new water with unknown possibilities, the fishing passion snapped straight back into focus. Andres is a lot of things, but he has brought good into my life.

  We picked our way along the south shore, sticking to the gentle perimeter trail toward the river inlet where oxygen and current were guaranteed to stack fish. Early on, the action was nonexistent. Andres wasted no time roasting me over our prior outing to Bear Creek—a grueling day where I managed zero fish and endless practice casts. 'Why do you even fish if it’s just casting?' he joked, and I couldn't help but laugh along.

  Then the puzzle fell into place. The trout weren't chasing big flashy hardware; they were eating micro-invertebrates drifting in the current. Dropping a size 14 Flashback Pheasant Tail nymph under an indicator with a size 18 Zebra Midge trailer unlocked the lake. As high-country clouds and sudden gusts rolled across the basin, sporadic sunbursts triggered a full-blown alpine feeding frenzy. Andres's teasing quickly shifted to genuine hype: 'You hooked another one!' echoed across the cove as trout after trout came to hand.

  The scene dredged up an old memory from our high school days back in Raleigh, North Carolina. We were kids at Umstead Lake chasing largemouth bass, and I had handed Andres the camera to photograph a catch. My fish handling back then was admittedly lacking, and the bass unfortunately went belly-up. Andres had captured a photo of the casualty floating in the weeds, and over ten years of shared friendship, that photo remained an untouchable, dark-humor staple.

  Fast forward to Clear Lake, and my fishing ethics were night-and-day: barbless hooks, short fights on stout tippet, water temps holding cleanly in the mid-50s, and every trout unhooked and released directly in the rubber net without leaving the water. Every single fish kicked away strong and healthy.

  And then, right on cue from the comedy gods, a pale, ghostly silver shape began slowly bobbing up from the depths.

  It wasn't a cruising rainbow—it was a completely dead stocker floating right toward the bank. We locked eyes and erupted in helpless laughter. To an outsider, snapping a photo of a floating fish looks morbid and callous. But for two guys who have shared a decade of laughs, miles of road, and plenty of skunked days, it was the perfect punchline to close out an unforgettable Colorado day.`,
    location: "Georgetown, Colorado",
    species: [
      "Rainbow Trout"
    ],
    gear: [
      "9ft 5wt Fly Rod",
      "Flashback Pheasant Tail",
      "Zebra Midge"
    ],
    date: "June 23, 2026",
    coverImage: {
      url: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/clearlakecast.jpg",
      alt: "Fly Casting on an apline lake",
      caption: "Views from above at Clear Lake"
    }
  },
  {
    id: "story-6",
    slug: "tailwater-troutlet-to-georgetown-lake-catch-and-cook",
    title: "From the Hollywood Hole to a Georgetown Lake Catch and Cook",
    excerpt:
      "Trading the tailwater circus of Silverthorne's outlet malls for the humble Georgetown Lake.",
    content: `September 3rd started with a familiar Colorado itch: putting a heavyweight tailwater trout on the fly rod. First light found me standing in the Blue River right through the Silverthorne outlet malls, rigged up beneath the pedestrian bridge leading to the Columbia store. Locals and guides affectionately dub this stretch the 'Hollywood Hole'—equal parts prized honey hole and public theater, flanked by shopping footpaths and spectators leaning over the railings.

  It didn't take long for the tailwater reality to set in. Within minutes, lines were being lobbed over mine and the fish I was casting to were getting walked on. While crowding is par for the course here, it still stings to watch prime water get trampled. I backed out of the fray, walked upstream to a quieter pocket, and spotted the unmistakable red band hovering just above the bottom. The fish would delicately rise, but never break the surface. One delicate drift with a size 20 Griffith's Gnat brought a slow, deliberate sip. 

  Hooked up, the 20-inch rainbow fought with strange resignation—almost swimming right toward the me as if eager to get the unhooking ritual over with. It is wild how heavily pressured trout adapt, treating a hook set more like a routine inconvenience than a fight for life.

  Needing room to breathe, I packed the rod and drove back east over the divide to Georgetown Lake. Georgetown sees plenty of anglers, but the large amount of water diffuses the pressure. Powerbait and live worms are the most common bait fished in this lake. Feeding on these baits is a trout's survival instinct, the scent inevitably draws them in and the offering is easy to capture and keeps a fish well-fed. 

  Here we see another impressive display of trout intelligence. Anglers often fail to get bites or have a far lower bite rate when fishing powerbait or worms. Trout deny these reasonable, large protein offerings in favor of smaller prey that is less likely to be a trap. If a trout eats 10 worms he will find 7 hooks, if he eats 100 tiny insects he will only find one fly angler.

  Historically, my route on Georgetown stayed north of the bridge, methodically watching a strike indicator suspended over a classic tandem—a beadhead pheasant tail with a midge dropper—usually waiting ten to fifteen minutes between strikes. Today, I broke routine and prospected south of the bridge. 

  The payoff was immediate. The south end presented varied depth contours, sharp drop-offs, and stacked schools that tripled my typical hookup rate. Rather than a bite every quarter-hour, the indicator plunged consistently as eager rainbows and occassional browns attacked the nymphs. 

  Catch-and-release is my default across the high country, but fresh off a summer of delicious saltwater table fare, I decided to harvest one clean stocker. Back home, that rainbow hit the grill with lemon and butter—capping off a classic early autumn Colorado day.`,
    location: "Georgetown, Colorado",
    species: [
      "Rainbow Trout",
      "Brown Trout"
    ],
    gear: [
      "9ft 5wt Fly Rod",
      "Griffith's Gnat",
      "Flashback Pheasant Tail",
      "Zebra Midge"
    ],
    date: "September 3, 2026",
    coverImage: {
      url: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/troutletgriffithsgnat.jpg",
      alt: "Large trout facing camera with griffiths gnat lodged in top jaw",
      caption: "Completely fooled tailwater trout, an accomplishment"
    }
  },
  {
    id: "story-7",
    slug: "jacy-first-mackerel-blitz-maine-state-pier",
    title: "Harbor Seals, Pier Characters, and Jacy's First Mackerel Blitz",
    excerpt:
      "A hot morning on the Maine State Pier turns a hesitant pier walk into a lesson in persistence.",
    content: `On August 7th, Jacy finally had a day off from work in Portland, Maine. She had been showing an itch to try fishing lately, so I shipped a brand new spinning combo to Portland. Today was our first opportunity to get out on the water together and put her new setup through its paces.

  We made our way down toward our familiar pocket on the Maine State Pier. As we neared the end, unsavory characters loitering made her reasonably hesitant about walking out. Without a backup plan and driven by determination to wet a line no matter what, I convinced her to press forward. Once we set our tackle down and rigged up, the initial tension vanished—it was just standard dockside bustle with zero issues.

  At the end of the pier was a fixture of the Portland waterfront: an older Russian gentleman who had a line in the water on every one of my visits to the pier so far. The man was a local legend who always out-fished everyone, but even he was grinding through an uncharacteristically dead bite today. We worked our sabiki rigs over the pilings and out into the current, but couldn't coax so much as a nibble from the harbor pollock that typically hug the pier.

  Fortunately, Casco Bay supplied plenty of sideshow entertainment. A resident harbor seal repeatedly popped its head to keep tabs on us, while an erratic jet skier repeatedly buzzed right along the edge of our casting range, carving tight, aimless circles. While entertaining, it seemed everything about the day was preventing us from having a chance at catching a fish.

  Then the harbor flipped a switch. A dense bait ball balled up tight against the pier before spraying across the surface. Mackerel marauded the fringes, slashing through the bait in a frenzied blitz. These windows of opportunity are short-lived, and on a slow day they must be taken advantage of to have any chance of success. 

  Jacy didn't hesitate. She fired her new rod into the boiling water, twitched the sabiki through the school, and connected before the blitz could dissipate—a strike executed with the timing and poise of a veteran angler. Watching her was a reminder of why she thrives at everything she does: she carries that rare combination of stubborn persistence and rapid adaptation. We hauled a few more thrashing mackerel over the rail before the midday heat forced a retreat, wrapping up a first-tackle milestone and beginning a tradition that will hopefully be long lived.`,
    location: "Portland, Maine",
    species: [
      "Atlantic Mackerel"
    ],
    gear: [
      "Sabiki Rig",
    ],
    date: "August 7, 2026",
    coverImage: {
      url: "https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/jacyfish.jpg",
      alt: "Two anglers standing on pier as jet ski and ferry pass by",
      caption: "Crowded waterways as to be expected on Maine State Pier"
    }
  }
];

export function getAllStories(): FishingStory[] {
  return stories;
}

export function getStoryBySlug(slug: string): FishingStory | undefined {
  return stories.find((story) => story.slug === slug);
}
