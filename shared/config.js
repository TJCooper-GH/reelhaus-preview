/* ==========================================================================
   LAUNCH PAGES CONFIG: every link, offer and video for these pages lives here.
   Edit this file only. No HTML edits needed.
   ========================================================================== */

/* Checkout links: new Whop plans from /workspace/whop-launch/created.json (Nov 26).
   Skill-pack links are the ones the homepage uses. Agency yearly is $2,490 (Whop $2,500 cap). */
var CHECKOUT = {
  starter_month: 'https://whop.com/checkout/plan_vIGeO5fbLDedA',
  studio_month:  'https://whop.com/checkout/plan_9DZ0OADZL1bAc',
  agency_month:  'https://whop.com/checkout/plan_gIcehut7rWfQ9',
  starter_year:  'https://whop.com/checkout/plan_IWw9tBwpGFD9Z',
  studio_year:   'https://whop.com/checkout/plan_Pr12zNX5p3GUt',
  agency_year:   'https://whop.com/checkout/plan_ZNGIC8xR3PT9p',
  spark:         'https://whop.com/checkout/plan_84pVYLzVsjBDK',
  boost:         'https://whop.com/checkout/plan_B1IdY9ZWYa89f',
  bulk:          'https://whop.com/checkout/plan_gzEy6mgzEhkdH',
  skill_1: 'https://reelhaus.ai/front/signin?next=%2Ffront%2Fskills%2Fstore%3Fbuy%3Dplan_TzGAuTzg2yeJb',
  skill_3: 'https://reelhaus.ai/front/signin?next=%2Ffront%2Fskills%2Fstore%3Fbuy%3Dplan_JgBYwVB54GbS7',
  skill_5: 'https://reelhaus.ai/front/signin?next=%2Ffront%2Fskills%2Fstore%3Fbuy%3Dplan_0RKFAhI7bTE6O'
};

/* Black Friday: same shape, end time and storage key as the homepage
   (homepage-scroll/build-v2/site.js), so closing the popup on one page
   closes it on all of them. Test expired: ?bfnow=2026-12-02  Force popup: ?bfpop=1 */
var BF = {
  endsAt: '2026-12-01T23:59:59-08:00',   // Dec 1, 2026, 11:59 PM PT. Nothing shows after this.
  checkoutUrl: CHECKOUT.studio_year,
  banner: 'Black Friday: Studio yearly $990, two months free, plus a 5-skill pack and +50 searches a month for 3 months. Ends Dec 1.',
  bannerShort: 'Black Friday: Studio yearly $990',   // narrow screens (matches homepage)
  bannerLink: 'Get the deal',                         // banner link text on phones
  popupTitle: 'Black Friday',
  popupBody: 'Studio yearly $990, two months free, plus a 5-skill pack and +50 searches a month for 3 months. Ends Dec 1.',
  button: 'Get the Black Friday deal',
  popupDelayMs: 8000,
  popupScroll: 0.40,
  storageKey: 'rh-bf26-popup'
};

/* MEDIA: none of these clips are final. TJ makes the real ones in the tool.
   To swap one in: change the path (relative to the page folder), reload.
   Leave video '' to show the poster with a "Placeholder" tag. */
var MEDIA = {
  pricing_reel:  { video: '', poster: '../site-v1/images/still-heist.webp', label: 'Sizzle reel goes here' },
  auth_reel:     { video: '', poster: '../site-v1/images/still-motorcade.webp', label: 'Short loop goes here' },
  start_step1:   { video: '', poster: '../screens/screen-find.webp',  label: 'Step 1 clip' },
  start_step2:   { video: '', poster: '../screens/screen-shots.webp', label: 'Step 2 clip' },
  start_step3:   { video: '', poster: '../screens/screen-edit.webp',  label: 'Step 3 clip' },
  aud_idea_hero:    { video: '', poster: '../site-v1/images/still-tacos.webp',     label: 'Idea page: hero reel goes here' },
  aud_idea_done:    { video: '', poster: '../site-v1/images/still-sneaker.webp',   label: 'Idea page: finished ad goes here' },
  aud_recreate_hero:{ video: '', poster: '../site-v1/images/still-reaper.webp',    label: 'Recreate page: hero reel goes here' },
  aud_recreate_done:{ video: '', poster: '../site-v1/images/still-perfume.webp',   label: 'Recreate page: finished remake goes here' },
  aud_story_hero:   { video: '', poster: '../site-v1/images/still-drama.webp',     label: 'Story page: hero reel goes here' },
  aud_story_done:   { video: '', poster: '../site-v1/images/still-ready.webp',     label: 'Story page: finished short goes here' },
  aud_pro_hero:     { video: '', poster: '../site-v1/images/still-motorcade.webp', label: 'Pro page: hero reel goes here' },
  aud_pro_done:     { video: '', poster: '../site-v1/images/still-heist.webp',     label: 'Pro page: finished client video goes here' }
};

/* TODO (TJ to decide before wiring): a live anonymous free-preview breakdown
   endpoint. This static page must never call a paid API or the live backend.
   When ready, set breakdownPreviewUrl to the endpoint and keep the handoff
   below as the fallback. Decide rate limit, captcha, and a free-preview cap
   first — a public paste-a-link box can be abused (cost per run is a research
   / breakdown step; exact catalog price not confirmed as a public free preview). */
var BREAKDOWN_PREVIEW = {
  endpoint: null,  // TODO: e.g. '/front/api/moment/preview'
  signIn: 'https://reelhaus.ai/front/signin',
  momentPath: '/front/moment',
  priceLabel: 'Breakdown: free preview',
  nextPriceLabel: 'Next step: you see the price before it runs'
};

