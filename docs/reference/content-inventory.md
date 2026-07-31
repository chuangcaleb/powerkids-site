# v3 Content Inventory

**Purpose:** verbatim record of every piece of content on the v3 site, so the rebuild never needs to read v3 source again.
**Read this when:** modelling content, seeding the CMS, or checking whether a piece of copy already exists.

Extracted from tag `v3-final` on 2026-07-30. This document — not the `v3` branch — is the migration source of truth. If a discrepancy is found against the live site, fix it here and note it in [Open questions](#open-questions).

Copy is reproduced as written, including its inconsistencies. Rewriting is a content decision for the owner, not a migration task. Items needing a decision are flagged **[DECIDE]**.

---

## Site-wide

### Brand

- Legal name: **Power Kids Care Centre**
- Display name: **PowerKids** — always one word, rendered as `Power` (red) + `Kids` (blue)
- Tagline: **the Centre with a Heart** (`Centre` highlighted blue, `Heart` highlighted red)
- Founded: **2001**. Year count is computed live (`currentYear - 2001`), rendered as "{n} years & counting!"
- Curriculum: **FunGates** (also written _Fungates_ in places — **[DECIDE]** canonical casing)
- Charity affiliation: **FunGates Superflow Foundation** — <http://www.fungatessuperflowfoundation.org>

### Default metadata

- Default title: `PowerKids Kindergarten: The Centre With A Heart`
- Title template for subpages: `{Page Title} | PowerKids Kindergarten: The Centre With A Heart`
- Meta description: `First-Class 21st-Century Kindergarten Education, based across four locations around Kuala Lumpur. Powered by the Fungates curriculum since 2001.`
- `theme-color`: `#ffffff`; Safari pinned-tab colour: `#e20000`
- App name (iOS/Windows tiles): `PowerKids`

**[DECIDE]** The description says _four_ locations; only **three** schools are active in the data (two are commented out — see [Schools](#schools)). Either the copy or the school list is wrong.

### Contact (global)

| Field         | Value                                   |
| ------------- | --------------------------------------- |
| Opening hours | `8:30am - 5:00pm`                       |
| Opening days  | `Monday - Friday`                       |
| Email         | `powerkidschool@gmail.com`              |
| Phone 1       | `010 - 221 2482` → `tel:+60102212482`   |
| Phone 2       | `03 - 9056 4288` → `tel:+60390564288`   |
| Phone 3       | `010 - 221 2483` → `tel:+0102212483` ⚠️ |

⚠️ Phone 3's `tel:` href is malformed in v3 (`+0102212483` — missing the `6` country code). Correct value is almost certainly `+60102212483`. **[DECIDE]** confirm before seeding.

Contact section heading: `Contact Us!`
Contact section blurb: `Please come and find out more! We'd love to hear from you!`

### Social links

| Platform  | URL                                                        |
| --------- | ---------------------------------------------------------- |
| Facebook  | <https://www.facebook.com/PowerKidsChildcare>              |
| Instagram | <https://www.instagram.com/powerkids_2001/>                |
| YouTube   | <https://www.youtube.com/channel/UCOjK8A2hTRbh1jg3hPE7uCw> |

Each link has an aria-label of the form `{Platform} profile for PowerKids Kindergarten`.

### Footer credit

- `© {currentYear} Power Kids Care Centre`
- `Designed with ♥ by Chuang Caleb` — heart is `/images/heart.svg`, name links to <https://chuangcaleb.com>

### Registration (appears on every page except Careers)

Heading: `Register Today!`

Ordered steps:

1. `Sign the Registration Form`
2. `Attach photocopy of birth cert.`
3. `Email proof of full payment`

CTA: `open our form` → Google Form
`https://docs.google.com/forms/d/e/1FAIpQLScx6CBPRCpy701cuUepOTB2r7_d0DdaYDuIRtPN5U5OtV7phQ/viewform?usp=sf_link`

The `Careers` page passes `excludeRegister` and omits this section.

---

## Navigation

Header and footer are generated from one source with three groups.

### Group: about

| Label         | Href                 | Description                                                    |
| ------------- | -------------------- | -------------------------------------------------------------- |
| Who We Are    | `/about`             | To raise a new generation of 21st-Century Children with heart. |
| Our Schools   | `/about#our-schools` | _(none)_                                                       |
| Our Team      | `/about#our-team`    | Trained & qualified teachers who are passionate and dynamic.   |
| We're Hiring! | `/careers`           | Want to enter and be a part of the centre with a heart?        |

⚠️ `#our-schools` is used as the anchor id by **two** sections in v3 — Our Schools _and_ Our Principals. Duplicate ids; the link resolves to whichever renders first. **[DECIDE]** give Principals its own anchor.
⚠️ `Our Team` is linked in the nav but the section is **commented out** on the About page, so the anchor goes nowhere.

### Group: programs

| Label                | Href                             | Hours                 | Description                                                                            |
| -------------------- | -------------------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| Morning School       | `/programs/morning-school`       | `08:30AM - 12:30noon` | Essential early childhood education (ECE) provided for children from Ages 2-6!         |
| After School Program | `/programs/after-school-program` | `12:30PM - 03:00PM`   | A variety of enrichment classes after lunch and homework coaching!                     |
| Evening Daycare      | `/programs/daycare`              | `03:00PM - 07:00PM`   | Care and activities for your child, while they wait for you to finish your day's work! |

Note the route is `/programs/daycare` while the label is "Evening Daycare". **[DECIDE]** keep the slug (needs a redirect either way) or align it.

### Group: events

| Label             | Href                        | Description                                                                                                                                                        |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Graduation        | `/events/graduation`        | A stage-performance celebration of our children who've completed their pre-school learning, showcasing the discipline and training of our children over the years! |
| Sports Day        | `/events/sports-day`        | Championship, sportsmanship, winning, competing, participation — a family day-out.                                                                                 |
| Field Trips       | `/events/field-trips`       | Learning beyond the classroom walls, bringing perspective to boost cognitive development.                                                                          |
| Community Service | `/events/community-service` | A portion of your child's monthly school fees is channelled to support FunGates SuperFlow Foundation. See how our teachers and students serve!                     |

### Footer structure

Left column: logo + wordmark linking to `/`, then a flat list of school names.
Right columns: one column per nav group, heading = group key (`about`, `programs`, `events` — rendered lowercase, unstyled). **[DECIDE]** proper column titles for the rebuild.

---

## Schools

Three active. Ordered as listed.

### Sri Petaling

```
2, Jalan 5/149B
Taman Sri Endah
Bandar Baru Sri Petaling
57000 Kuala Lumpur
```

Contacts: `03 - 9056 4288`, `010 - 221 2482`
Principal: Ms. Wan Hong
Image id: `powerkids/about/schools/sri-petaling`

### Puchong Utama

```
No 1, Jalan PU 3/1A
Taman Puchong Utama
47140 Puchong, Selangor
```

Contacts: `03 - 8066 9363`, `012 - 218 0240`
Principal: Uncle Chun Hoe
Image id: `powerkids/about/schools/puchong`

### Parklane OUG

```
D1-1-11 Jalan 1/152
Taman OUG Parklane
58200 Kuala Lumpur
```

Contacts: `012 - 386 1123`, `03 - 7498 1905`
Principal: Ms. Mary
Image id: `powerkids/about/schools/parklane`

### Inactive (commented out in v3 — do not seed unless the owner says otherwise)

- **Salak South Garden** — K45 Jalan Cahaya 4, Salak South Garden, 57100 Kuala Lumpur. Contacts: `03 - 9059 2979`, `010 - 221 2482`
- **Bukit Jalil** — No 48 Jalan 17/155C, Bandar Bukit Jalil, 57000 Kuala Lumpur. Contacts: `012 - 231 2408`, `03 - 9545 1455`

Phone links are built by stripping non-digits and prefixing `+6`.

---

## Page: Home (`/`)

Section order: Hero → rule → About → rule → Programs → rule → Events → Register → Contact → footer nav.

### Hero

- H1: `the Centre with a Heart` — `Centre` marked blue, `Heart` marked red, line break before "with a"
- Body: `First-Class 21st-Century Kindergarten Education, based across four locations around Kuala Lumpur. Powered by the FunGates curriculum since 2001.` — _Kindergarten Education_ underlined, _four_ and _FunGates_ italic
- CTAs: `register` (red) → `#register`; `contact` (blue) → `#contact`
- Image: `hero.jpg`, alt: `Two PowerKids students on a toy telephone, with a speech bubble reading: Register now for 2025!`

⚠️ The alt text hard-codes **2025**. The image itself likely shows a 2025 call-out. **[DECIDE]** new hero image, or year-neutral copy.

### Who We Are

- Eyebrow pill: `Who We Are`
- H2: `{n} years & counting!` — computed from 2001, _{n} years_ underlined
- Body: the shared **Identity Statement** (below)
- CTA: `read about us` → `/about`
- Media: YouTube `pWK_QZkIbQ0`, title `Register Now with PowerKids!`

**Identity Statement** (reused on Home, About, and Careers):

> **PowerKids** _is_ the Kindergarten **Centre** with a **Heart**
>
> We believe that we have that _difference_, that _secret ingredient_, that will propel the next generation to _stand up_ and _stand out_ from the crowd.

### Our Programs

- Eyebrow pill: `Our Programs` (red)
- H2: `Fun learning is our serious business.` — _Fun learning_ underlined, _serious_ marked red
- Keyword row: `Play.` `Explore.` `Grow.` `Collaborate.`
- Intro: `High-value lessons and activities, with the love and care of our professional teachers, all throughout the entire day!`
- Then the three program cards (title, hours pill with clock icon, image, description, `more!` link)

### Our Events

- Eyebrow pill: `Our Events` (blue)
- H2: `In and outside of classrooms!` — _and_ underlined, _outside_ marked blue
- Strapline: `Experiences maketh thy child.`
- Then the four event cards (title, description, image, `more!` link)

---

## Page: About (`/about`)

Sections: Mission/Vision grid → Our Schools → Our Principals. (Our Team exists in source but is commented out.)

### Mission / Vision grid

- H1: `Who We Are`
- Identity Statement
- Body: `We've been around for {n} years, powered by the Fungates system. Together with educational policies from the Ministry of Education Malaysia and Jabatan Kebajikan Malaysia, we constantly keep up with the best practices to ensure our students become competent learners to navigate the 21st-Century world.`
- Body: `PowerKids... Opening the Gates to First-Class Fun Learning!`
- Image: `powerkids/about/apple-girl.jpg`, alt `A PowerKids student offering an apple`
- Decoration: rotated logo

**Our Mission** card:

> To raise a new generation of 21st-Century children with **heart**.

**Our Vision** card — an acrostic; the first letter of each item is set large:

> - **A**cademic Excellence
> - **B**uilding Character
> - **C**ultivating Moral & Spiritual Values

### Our Schools

- H2: `Our Schools` (school icon), anchor `#our-schools`
- One article per school: name, address block, phone links, photo. Separated by heart rules.

### Our Principals

- H2: `Our Principals` (user icon)
- Anchor is **also** `#our-schools` — see nav warning above.

**Uncle Peck Guan — Founder**

> If a child can't read, we TEACH him to read.
>
> If a child can't do Math problems, we TEACH him how to do Math problems.
>
> If a child doesn't know how to behave, we PUNISH him…
>
> ...but NOT in PowerKids: "The Centre with a Heart" ~ because Love Never Fails – we make a Difference.

**Ms. Wan Hong — Principal of PowerKids Sri Petaling**

> The future of the world is in my classroom today." - Ivan John Fitzwater.
>
> I am truly honored to be a teacher— a role that allows me to shape the minds and hearts of tomorrow. To be entrusted with the incredible responsibility of nurturing the future leaders, thinkers, and changemakers of the world.
>
> My mission is to empower each student to unlock their full potential, providing not just academic knowledge, but the tools, guidance, and support necessary for their growth in every aspect of life: intellectually, emotionally, socially, and spiritually. I am committed to creating a safe, inclusive, and inspiring environment where. every student can thrive, embrace their uniqueness, and cultivate a lifelong love for learning.

⚠️ Two typos in the original: an unmatched closing quote before `- Ivan John Fitzwater`, and `environment where. every student`. **[DECIDE]** fix on migration (recommended) or preserve.

**Ms. Mary — Principal of PowerKids Parklane**

> Ms. Mary Chan is a dedicated educator with 25 years of teaching experience, specializing in nurturing young minds. She holds a Diploma in Early Childhood Education and has completed the KAAK course, equipping her with advanced skills in child development and education.
>
> Additionally, she is certified in First Aid, ensuring a safe and secure environment for the children under her care. Ms. Mary is known for her loving and caring nature, fostering a positive and supportive atmosphere.
>
> Her exceptional ability to handle children with patience and understanding makes her a cherished and trusted teacher among parents and students alike.

**Uncle Chun Hoe — Principal of PowerKids Puchong Utama**

> I have been an educator for 23 years and hold a Diploma in Early Childhood Education. I believe every child is unique and learns at their own pace. At our kindergarten, we focus on providing a safe, warm environment where children can explore, play, and have fun.
>
> Robert John Meehan: "Every child has a different learning style and pace. Each child is unique, not only capable of learning but capable of succeeding."
>
> My goal as a principal is to guide our school in providing children with a strong foundation for lifelong learning while making their preschool experience one to treasure.

Portraits: `wan-hong.png`, `peck-guan.jpg`, `mary.jpeg`, `chun-hoe.jpeg` — alt pattern `Profile picture of {name}`.

Principal bios are hard-coded prose of varying length and voice. Note the year counts ("25 years", "23 years") are static and will silently go stale. **[DECIDE]** store as prose (accepts drift) or as `yearsExperience` + `startYear`.

### Our Team (commented out in v3 — content preserved here)

- H2: `Our Team`, repeated four times at decreasing opacity as a decorative effect
- Body: `At PowerKids, we have trained, qualified teachers who are passionate and dynamic. Their joy comes from seeing our little learners light up as they make new friends or learn new letters, words or concepts.`
- Body: `Every class teacher is certified in Early Childhood Education, and then further annually up-graded with the latest FunGates teaching practices. Our teaching team is up-to-date on trainings by KSPK Ministry of Education of Malaysia for guru-guru pra-sekolah.`
- Pull quote: `"Children First" is our basis to all our decisions in managing children entrusted to our care.`
- Photo grid pulled live from Cloudinary prefix `powerkids/about/team`; each card's heading is derived from the filename (text after the first space).

**[DECIDE]** restore this section in v4, or drop it and remove the nav link.

---

## Page: Careers (`/careers`)

- Eyebrow: `Career Opportunities` (red)
- H1: `We Want You !` — _You_ marked red
- Identity Statement
- Body: `Do you have that difference too? Check out any vacancies, and feel free to just contact us any time through the channels below.`
- H2: `Current Vacancies`

**Vacancy card — Teacher**

- Minimum: **Diploma in ECE**
- **Experienced** working with young children
- **Patient** with **energetic** disposition
- **Creative** mindset
- Passionate for **shaping and inspiring** young minds

Closing:

- `Call 03 - 9056 4288 for an interview, or email your resume to powerkidschool@gmail.com`
- `Not 100% certain? Contact us anyways, and stand out from the others who didn't!`

This page omits the Register section.

---

## Page: Morning School (`/programs/morning-school`)

- H1: `Morning School` + hours pill `08:30AM - 12:30noon`
- Strapline: `Essential early childhood education`
- Body: `Essential early childhood education (ECE) provided for children from Ages 2 to 6!`
- Body: `There will be emphasis on building social emotion to cognitive study from very young age. PowerKids has a track record of strong academics and good character transformation.`
- CTAs: `register`, `contact` — ⚠️ both point at `/` in v3, a bug. Should be `#register` / `#contact`.
- Gallery: Cloudinary prefix `powerkids/programs/morning`

---

## Page: After School Program (`/programs/after-school-program`)

- H1: `After School Program` + hours pill `12:30PM - 03:00PM`
- Strapline: `Experiences beyond traditional academics`
- Body: `After a tasty lunch and homework coaching, we have a variety of enrichment classes prepared for the children!`
- Lead-in: `For example (and not limited to):`
- List:
  - **Domestic Science** for children to explore practical kitchen skills,
  - **Creative Art and Craft** as a means of outwardly expressing their inner thoughts and emotions,
  - **Speech & Drama** into the world of imagination and stepping out to speak with _confidence_,
  - **Information Communication Technology** with hands-on activities to train up relevant digital skills!
- Closing: `Take a look at one of our featured programs!`
- Four brochure scans (English front/back, Chinese front/back), all with **empty alt text** — ⚠️ accessibility defect; brochures carry real information. **[DECIDE]** write alt text or transcribe the brochure content into the page.
  - `powerkids/programs/after/ASP_front.jpg`
  - `powerkids/programs/after/ASP_back.jpg`
  - `powerkids/programs/after/ASP_front_chinese.jpg`
  - `powerkids/programs/after/ASP_back_chinese.jpg`

---

## Page: Evening Daycare (`/programs/daycare`)

- H1: `Evening Daycare` + hours pill `03:00PM - 07:00PM`
- Strapline: `Chill with the after-hours crew`
- Body: `Care and activities for your child, while they wait for you to finish your day's work!`
- Body: `After nap time, the kids will have many outlets for their youthful energy in even more activities and games! You can trust after they tell you about all the their stories and friends from their full-day at school, that they will crash quickly at night!`
  - ⚠️ typo in original: `all the their stories`
- Image: `powerkids/programs/daycare/daycare_qicl4q.png`, alt `Children and teachers during PowerKids' Evening Daycare program`
- No gallery.

---

## Page: Graduation (`/events/graduation`)

- H1: `Graduation`
- Body: `Our Graduation is a celebration of our children who completed their pre-school learning.`
- Body: `Here, we practice Graduation-Concerts, where all our students get an opportunity to be involved in stage performance during the graduation event. This is our showcase of discipline and training of children over the years!`
- Two tabbed video cards:
  - `2020` — YouTube `eyyBMt6-zIc`, title `PowerKids Graduation 2020`
  - `2019` — YouTube `7nphFvgTY2M`, title `PowerKids Graduation 2019`
- No gallery. Newest video is from 2020 — **[DECIDE]** the CMS should let admins add year entries without a developer.

---

## Page: Sports Day (`/events/sports-day`)

- H1: `Sports Day`
- Strapline: `Dexterity, competition & teamwork`
- Body: `Championship, sportsmanship, winning, competing, participation — a family day-out.`
- Body: `Numerous telematch games. Four schools. Three houses. One champion.`
  - ⚠️ says **four** schools; three are active. Same discrepancy as the meta description.
- Video: YouTube `vj-9e65wtPE`, title `PowerKids Sports Day 2019`
- Gallery: Cloudinary prefix `powerkids/events/sports-day`

---

## Page: Field Trips (`/events/field-trips`)

- H1: `Field Trips`
- Strapline: `Real world makes real kids`
- Body: `Field trips help bring learning outside the classroom, giving children a new perspective and boost cognitive development.`
- Body: `These trips offer diverse learning opportunities, improve health and allow children to get authentic experiences.`
- Destination chips, in order, each with a leading emoji:
  `🚒 Fire Station`, `🐬 Aquaria`, `💇🏻‍♀️ Hair Saloon`, `🏦 Bank Negara`, `🏙️ Kidzania`, `🚜 EcoFarm`, `🔭 National Science Centre`, `🛒 Grocery Shopping`, `🐯 Zoo Negara`, `🍕 Pizza Hut`, `🦷 Dentist Clinic`, `🍫 Chocolate Factory`, `🗺️ ...Where Next ?`
  - "Hair Saloon" is a misspelling of "Salon" — **[DECIDE]**
- Gallery: Cloudinary prefix `powerkids/events/field-trips`

---

## Page: Community Service (`/events/community-service`)

- H1: `Community Service`
- Callout card: `PowerKids supports the work of FunGates Superflow Foundation` → <http://www.fungatessuperflowfoundation.org>
  - ⚠️ link is plain `http://`. Check for an HTTPS version before migrating.
- Body: `A portion of your child's monthly school fees is channelled to support FunGates SuperFlow Foundation. You play a part in the community work when you register your child with PowerKids.`
- Body: `At PowerKids, we teach CARE by serving.`
- Body: `Our staff will get to serve in Love-On-Wheels (food distribution) and in the Soup Kitchen. The 6-years-olds' also get to go on a field trip to serve in the Soup Kitchen.`
  - ⚠️ stray apostrophe in `6-years-olds'`
- Image: `powerkids/events/pspkidsfoundation_orig_r8xclb.jpg`, alt: `A booklet excerpt reading 'Thank you Fungates Superflow Foundation for the privilege to travel together on the journey of Community Transformation through your many social services.' from PowerKids`
- Gallery: Cloudinary prefix `powerkids/events/community-service`

---

## Media

### Brand assets — copied to `_reference/media/` (gitignored), reusable as-is

| File                           | Use                                                        |
| ------------------------------ | ---------------------------------------------------------- |
| `public/images/logo.svg`       | Wordmark logo                                              |
| `public/images/heart.svg`      | Section rule ornament, footer credit                       |
| `public/images/blob.svg`       | Register section background                                |
| `public/fonts/marker-felt.ttf` | Display typeface (see the design audit for licensing risk) |
| `public/favicon/*`             | Full favicon set, incl. `site.webmanifest`                 |

### Bundled photos — in `_reference/media/assets/`

`hero.jpg`, `hero-2.png`, and four principal portraits (`wan-hong.png`, `peck-guan.jpg`, `mary.jpeg`, `chun-hoe.jpeg`). ~22 MB total, unoptimised.

### Cloudinary-hosted images

v3 fetched these at build time through the Cloudinary Admin API. **Counts are unknown without API credentials** — galleries were paginated and fetched recursively, so any of these prefixes may hold dozens of images.

| Prefix / public id                                        | Where used                         | Count       |
| --------------------------------------------------------- | ---------------------------------- | ----------- |
| `powerkids/index/program-morning.jpg`                     | Home program card                  | 1           |
| `powerkids/index/program-after.jpg`                       | Home program card                  | 1           |
| `powerkids/index/daycare.jpg`                             | Home program card                  | 1           |
| `powerkids/index/graduation.jpg`                          | Home event card                    | 1           |
| `powerkids/index/sports-day.jpg`                          | Home event card                    | 1           |
| `powerkids/index/field-trip.jpg`                          | Home event card                    | 1           |
| `powerkids/index/community-service.jpg`                   | Home event card                    | 1           |
| `powerkids/about/apple-girl.jpg`                          | About hero image                   | 1           |
| `powerkids/about/schools/{sri-petaling,puchong,parklane}` | School photos                      | 3           |
| `powerkids/programs/after/ASP_*.jpg`                      | Brochure scans                     | 4           |
| `powerkids/programs/daycare/daycare_qicl4q.png`           | Daycare photo                      | 1           |
| `powerkids/events/pspkidsfoundation_orig_r8xclb.jpg`      | Foundation booklet                 | 1           |
| `powerkids/programs/morning`                              | Gallery                            | **unknown** |
| `powerkids/events/sports-day`                             | Gallery                            | **unknown** |
| `powerkids/events/field-trips`                            | Gallery                            | **unknown** |
| `powerkids/events/community-service`                      | Gallery                            | **unknown** |
| `powerkids/about/team`                                    | Team photo grid (section disabled) | **unknown** |

**Migration rule for galleries:** seed 2–3 representative images per gallery only. Galleries are editor-managed content; bulk re-upload is an admin task after launch, not a migration task. No layout may assume a fixed image count — a gallery of 1 and a gallery of 40 must both look right.

**[DECIDE]** how gallery originals move off Cloudinary. Options: export via the Cloudinary console, script it with the Admin API, or treat launch as a clean start and have admins re-upload the photos worth keeping. This needs the Cloudinary account owner.

---

## Route map (for redirects)

Every v3 URL must resolve after launch.

| v3 route                         | v4 plan                                  |
| -------------------------------- | ---------------------------------------- |
| `/`                              | Page `home`                              |
| `/about`                         | Page `about`                             |
| `/careers`                       | Page `careers`                           |
| `/programs/morning-school`       | Program page                             |
| `/programs/after-school-program` | Program page                             |
| `/programs/daycare`              | Program page (slug mismatch — see above) |
| `/events/graduation`             | Event page                               |
| `/events/sports-day`             | Event page                               |
| `/events/field-trips`            | Event page                               |
| `/events/community-service`      | Event page                               |
| `/about#our-schools`             | Anchor must survive                      |
| `/about#our-team`                | Currently dead — fix or remove           |
| `#register`, `#contact`          | Global sections, present on every page   |

---

## Open questions

Collected from the **[DECIDE]** flags above. All are content or product calls for the owner; none block Phase 1.

1. Three schools or four? Meta description, hero copy, and Sports Day copy all say four. A: three schools.
2. Phone 3's `tel:` link is missing the country code. A: append the 6
3. Restore the Our Team section, or drop it and remove the nav link? A: remove nav link
4. Hero alt text hard-codes "2025". A: replace with "Our school student in a superhero mask and striking a pose"
5. Principal bios contain static year counts that will go stale. A: use live counts
6. Fix the typos found in v3 copy, or preserve them verbatim? A: fix typos
7. Canonical spelling: FunGates or Fungates? A: FunGates
8. Keep the `/programs/daycare` slug or rename it? A: evening-daycare
9. Brochure scans have no alt text; the information in them is image-only. A: remove brochure images from page, replace with placeholder body text
10. Graduation videos stop at 2020 — should year entries be editor-managed? A:
11. How do Cloudinary gallery originals get migrated, if at all? A: fill gallery with 2-3 placeholder images,
12. Footer nav column headings are currently raw group keys. A: yeah use proper column
13. Give Our Principals its own anchor id. A: yes
