import type { GuidePageContent } from '@/types/content'
import { routes, studentResourceTopics } from '@/lib/routes'

export const studyInNewZealandContent: GuidePageContent = {
  meta: {
    title: 'Study in New Zealand — Guide for International Students | Enrollify',
    description:
      'A complete guide for international students planning to study in New Zealand — qualifications, costs, visas, scholarships, student life and career pathways after graduation.',
  },
  hero: {
    title: 'Your New Zealand Adventure Starts Here',
    subtitle: 'A warm welcome to students from across Asia and beyond',
    intro: [
      [
        'Imagine waking up to crisp mountain air, grabbing a world-class flat white from a cosy café, walking into a classroom where your professor insists you call them by their first name — and then, after class, hiking to a waterfall that looks like it was designed for a movie set. (Actually, it probably was — this is New Zealand, after all.)',
      ],
      [
        "If you're reading this, you're already asking the right questions. ",
        { type: 'strong', text: 'Could New Zealand be the place where I build my future?' },
      ],
      [
        "We think the answer is a very enthusiastic yes. And we're going to tell you exactly why.",
      ],
    ],
    imageAlt: 'Students studying in New Zealand and having fun',
  },
  tableOfContents: [
    { id: 'aotearoa', label: 'Aotearoa — The Land of the Long White Cloud' },
    { id: 'why-students-love-nz', label: 'Why Students Love New Zealand' },
    { id: 'universities', label: 'Eight World-Class Universities' },
    { id: 'kiwi-classroom', label: 'The Kiwi Classroom Experience' },
    { id: 'finding-your-city', label: 'Finding Your City' },
    { id: 'costs', label: 'What Does It Actually Cost?' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'life-after-graduation', label: 'Life After Graduation' },
    { id: 'practical-tips', label: 'Practical Tips From Students' },
    { id: 'your-next-step', label: 'Your Next Step' },
  ],
  sections: [
    {
      id: 'aotearoa',
      title: 'Aotearoa — The Land of the Long White Cloud',
      blocks: [
        {
          type: 'paragraph',
          content: [
            'New Zealand — or ',
            { type: 'em', text: 'Aotearoa' },
            ', as it is known in the Māori language — is a small island nation at the bottom of the world. It has only around 5 million people, and yet it somehow packs in rainforests, glaciers, volcanic landscapes, golden beaches, and some of the most sophisticated cities you\'ll ever visit. It is the place where ',
            { type: 'em', text: 'The Lord of the Rings' },
            ' was filmed, and once you arrive, you\'ll understand why the filmmakers didn\'t need to build a fantasy world — New Zealand is already one.',
          ],
        },
        {
          type: 'paragraph',
          content: [
            "But beyond the scenery, New Zealand is genuinely one of the world's warmest, most welcoming societies. Kiwis (the friendly nickname for New Zealanders) are known for being laid-back, direct, and quick to laugh. There is no stiff formality here. You'll find that within weeks, you won't just be a student in New Zealand — you'll be ",
            { type: 'em', text: 'part' },
            ' of it.',
          ],
        },
      ],
    },
    {
      id: 'why-students-love-nz',
      title: 'Why Students Love New Zealand',
      blocks: [
        {
          type: 'paragraph',
          content: [
            "You're in excellent company. Students from China, India, Japan, South Korea, Thailand, the Philippines, and beyond have made New Zealand one of their top study destinations. In 2024 alone, international student enrolments grew by 21%, with Asian students making up the vast majority of those numbers.",
          ],
        },
        {
          type: 'paragraph',
          content: ["What keeps drawing people back? Here's what international students consistently say:"],
        },
        {
          type: 'list',
          items: [
            [
              { type: 'strong', text: 'A safe, peaceful environment.' },
              ' New Zealand is consistently ranked among the safest countries in the world for international students.',
            ],
            [
              { type: 'strong', text: 'World-recognised qualifications.' },
              " All eight of New Zealand's universities rank in the Times Higher Education World University Rankings. A degree from New Zealand opens doors in the UK, Australia, Asia, and beyond.",
            ],
            [
              { type: 'strong', text: 'A genuinely multicultural community.' },
              " You'll find large, vibrant, diverse communities in cities like Auckland and Wellington. You won't be alone.",
            ],
            [
              { type: 'strong', text: 'Real career opportunities after graduation.' },
              ' Unlike some countries where student visas lock you out of the workforce, New Zealand actively encourages you to work and build a career here.',
            ],
            [
              { type: 'strong', text: "Quality of life that's hard to beat." },
              ' Fresh air, clean water, no overcrowding, stunning nature at your doorstep — and universities that actually care about your wellbeing.',
            ],
          ],
        },
      ],
    },
    {
      id: 'universities',
      title: 'Eight World-Class Universities Waiting for You',
      blocks: [
        {
          type: 'paragraph',
          content: [
            "New Zealand has eight universities, each with a distinct personality and strengths. Explore ",
            { type: 'link', label: 'courses and programmes', href: routes.findCourse },
            ' to find the right fit for your goals.',
          ],
        },
        {
          type: 'list',
          items: [
            [
              { type: 'strong', text: 'University of Auckland' },
              " — New Zealand's largest, ranked in the global top 20 for Impact Rankings, located in the country's biggest and most cosmopolitan city.",
            ],
            [
              { type: 'strong', text: 'Victoria University of Wellington' },
              ' — set in the cool, creative capital city, known for law, policy, and the arts.',
            ],
            [
              { type: 'strong', text: 'University of Canterbury' },
              " — Christchurch's anchor institution, strong in engineering and science, surrounded by the Southern Alps.",
            ],
            [
              { type: 'strong', text: 'University of Otago' },
              ' — New Zealand\'s oldest university, in the vibrant student city of Dunedin, renowned for health sciences and medicine.',
            ],
            [
              { type: 'strong', text: 'Auckland University of Technology (AUT)' },
              ' — modern, practical, career-focused, with deep industry connections.',
            ],
            [
              { type: 'strong', text: 'Lincoln University' },
              ' — the go-to for environmental science, agriculture, and sustainability near Christchurch.',
            ],
            [
              { type: 'strong', text: 'University of Waikato' },
              ' — in beautiful Hamilton, strong in business, law, and Māori studies.',
            ],
            [
              { type: 'strong', text: 'Massey University' },
              ' — a multi-campus university with excellent creative arts, veterinary science, and distance learning options.',
            ],
          ],
        },
        {
          type: 'paragraph',
          content: [
            'No matter what you want to study — engineering, medicine, business, hospitality, agriculture, technology, design, or the arts — there is a New Zealand university that is right for you.',
          ],
        },
      ],
    },
    {
      id: 'kiwi-classroom',
      title: "The Kiwi Classroom Experience — You'll Love This",
      blocks: [
        {
          type: 'paragraph',
          content: [
            "Here's something that surprises almost every student when they first arrive: ",
            { type: 'strong', text: "New Zealand classes are nothing like what you're used to." },
          ],
        },
        {
          type: 'paragraph',
          content: [
            'Back home, many students are accustomed to lectures where you quietly take notes, and the professor is a distant authority figure. In New Zealand, your lecturer will introduce themselves as "Dave" or "Paula" on the first day. They will ask for your opinion. They will encourage debate. Group projects are common, critical thinking is celebrated, and it\'s perfectly normal — expected, even — to respectfully disagree with your professor.',
          ],
        },
        {
          type: 'paragraph',
          content: [
            'This might feel strange at first. But students consistently say this approach transformed their confidence, their communication skills, and their ability to think independently. These are exactly the skills that top employers around the world are hiring for right now.',
          ],
        },
        {
          type: 'paragraph',
          content: [
            'Studying in New Zealand is generally considered more manageable than in many other Western countries. The learning culture is relaxed and practical. That doesn\'t mean it\'s easy — professional degrees like medicine or law are still rigorous — but the environment is supportive, not cutthroat.',
          ],
        },
      ],
    },
    {
      id: 'finding-your-city',
      title: 'Auckland, Wellington, Christchurch — Finding Your City',
      blocks: [
        {
          type: 'paragraph',
          content: [
            "One of the best decisions you'll make is choosing the right city. Here's a snapshot to help — and explore our ",
            { type: 'link', label: 'city guides', href: routes.cityGuides },
            ' for more detail.',
          ],
        },
        {
          type: 'subsection',
          id: 'auckland',
          title: 'Auckland — The Vibrant Metropolis',
          blocks: [
            {
              type: 'paragraph',
              content: [
                "New Zealand's largest city is home to the University of Auckland and AUT. It's cosmopolitan, multicultural, and packed with Asian restaurants, night markets, and cultural events. You can island-hop to Waiheke Island for vineyards and beaches, or hike up any of Auckland's 53 volcanic cones for a panoramic view. If you want energy, diversity, and opportunity, Auckland is your city.",
              ],
            },
          ],
        },
        {
          type: 'subsection',
          id: 'wellington',
          title: 'Wellington — The Creative Capital',
          blocks: [
            {
              type: 'paragraph',
              content: [
                "Wellington is compact, walkable, and endlessly cool. As New Zealand's capital city, it's the heartbeat of government, arts, and film (Wellington is home to ",
                {
                  type: 'link',
                  label: 'Weta Workshop',
                  href: 'https://www.wetaworkshop.com/',
                  external: true,
                },
                ', the studio behind Lord of the Rings). Victoria University sits right in the city centre. Wellington has a world-famous café culture and a friendliness that consistently surprises visitors.',
              ],
            },
          ],
        },
        {
          type: 'subsection',
          id: 'christchurch',
          title: 'Christchurch — The Garden City',
          blocks: [
            {
              type: 'paragraph',
              content: [
                "Christchurch is New Zealand's second-largest city and is known for its wide streets, leafy parks, and laid-back lifestyle. It's the gateway to the South Island's stunning landscapes — ski fields, glaciers, and Queenstown are all within easy reach. If you love the outdoors and a more relaxed pace, Christchurch is calling your name.",
              ],
            },
          ],
        },
        {
          type: 'subsection',
          id: 'dunedin',
          title: 'Dunedin — The Student City',
          blocks: [
            {
              type: 'paragraph',
              content: [
                "Dunedin is essentially built around the University of Otago — it's one of the most student-friendly cities in New Zealand, with a lively social scene, affordable rent, and a quirky, artistic character all its own.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'costs',
      title: 'What Does It Actually Cost?',
      blocks: [
        {
          type: 'paragraph',
          content: [
            "Let's be real — studying abroad is a big financial commitment, and we want you to go in with clear eyes. See our full guide on the ",
            {
              type: 'link',
              label: 'cost of studying in New Zealand',
              href: routes.studentResourceTopic(studentResourceTopics.costs),
            },
            ' for more detail.',
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'strong', text: 'Tuition fees' },
            ' for international students typically range from NZ$22,000 to NZ$45,000 per year for undergraduate degrees, and NZ$20,000 to NZ$37,000 for postgraduate degrees. PhD programmes are significantly more affordable, at just NZ$6,500–$9,000 per year — and PhD fees are the same for international and domestic students.',
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'strong', text: 'Living costs' },
            ' are approximately NZ$1,500–$2,200 per month, covering:',
          ],
        },
        {
          type: 'list',
          items: [
            [
              { type: 'strong', text: 'Accommodation:' },
              ' NZ$120–$200 per week (shared flat to private room).',
            ],
            [
              { type: 'strong', text: 'Groceries and meals:' },
              ' eating out costs around NZ$20 for a casual meal.',
            ],
            [
              { type: 'strong', text: 'Phone and internet:' },
              ' around NZ$90–$100 per month combined.',
            ],
            [
              { type: 'strong', text: 'Transport:' },
              ' student discount cards make getting around affordable.',
            ],
            [
              { type: 'strong', text: 'Health insurance:' },
              ' required for your ',
              {
                type: 'link',
                label: 'visa',
                href: routes.studentResourceTopic(studentResourceTopics.visas),
              },
              ', and very affordable — around NZ$590 per year with providers like ',
              {
                type: 'link',
                label: 'StudentSafe',
                href: 'https://www.studentsafe.co.nz/',
                external: true,
              },
              '.',
            ],
          ],
        },
        {
          type: 'paragraph',
          content: [
            'The good news? ',
            { type: 'strong', text: 'You can work while you study.' },
            ' Student visa holders can work up to 25 hours per week during term time and full-time during holidays. Read more about ',
            {
              type: 'link',
              label: 'working while studying',
              href: routes.studentResourceTopic(studentResourceTopics.working),
            },
            '. The adult minimum wage in New Zealand is NZ$23.15 per hour, which means part-time work genuinely makes a difference.',
          ],
        },
      ],
    },
    {
      id: 'scholarships',
      title: "Scholarships — Don't Leave Money on the Table",
      blocks: [
        {
          type: 'paragraph',
          content: [
            'There are real, significant scholarship opportunities available to you. Browse our ',
            {
              type: 'link',
              label: 'scholarships guide',
              href: routes.studentResourceTopic(studentResourceTopics.scholarships),
            },
            ' for more options.',
          ],
        },
        {
          type: 'list',
          items: [
            [
              { type: 'strong', text: 'New Zealand Manaaki Scholarships' },
              ' — full government-funded scholarships for students from eligible countries. ',
              {
                type: 'link',
                label: 'Learn more here',
                href: 'https://www.mfat.govt.nz/en/aid-and-development/new-zealand-scholarships/',
                external: true,
              },
              '.',
            ],
            [
              { type: 'strong', text: 'University of Auckland International Student Excellence Scholarship' },
              ' — valued at NZ$10,000 for high-achieving students.',
            ],
            [
              { type: 'strong', text: 'University of Canterbury International First Year Scholarship' },
              ' — for outstanding international undergraduates.',
            ],
            [
              { type: 'strong', text: "Victoria Master's Scholarships" },
              " — NZ$15,000 stipend plus domestic fees for research-focused master's students.",
            ],
          ],
        },
        {
          type: 'paragraph',
          content: [
            'The ',
            {
              type: 'link',
              label: 'Education New Zealand scholarship finder',
              href: 'https://www.educationnz.govt.nz/scholarships',
              external: true,
            },
            ' lets you search by subject and study level. Scholarships are competitive, but absolutely worth pursuing early.',
          ],
        },
      ],
    },
    {
      id: 'life-after-graduation',
      title: 'Life After Graduation — Your Future in New Zealand',
      blocks: [
        {
          type: 'paragraph',
          content: [
            "Here's where it gets really exciting. New Zealand doesn't just want you to study here — it wants you to ",
            { type: 'em', text: 'stay' },
            ', contribute, and build a career. Explore ',
            { type: 'link', label: 'career pathways', href: routes.careerGuides },
            ' after graduation.',
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'strong', text: 'The Post-Study Work Visa (PSWV)' },
            ' allows you to remain in New Zealand after graduation and work for any employer, in any role, anywhere in the country. See our ',
            {
              type: 'link',
              label: 'visa guide',
              href: routes.studentResourceTopic(studentResourceTopics.visas),
            },
            ' for full details:',
          ],
        },
        {
          type: 'list',
          items: [
            [
              "Graduates with a Level 7 bachelor's degree or above: up to ",
              { type: 'strong', text: '3 years' },
              ' of open work rights.',
            ],
            ['Self-employment and sole trading are permitted.'],
            ['No restriction on industry or job type.'],
          ],
        },
        {
          type: 'paragraph',
          content: [
            "For those whose qualification doesn't quite reach the full PSWV threshold, a ",
            { type: 'strong', text: 'brand new Short-Term Graduate Work Visa' },
            ' is launching in late 2026, offering 6 months of open work rights to find employment.',
          ],
        },
        {
          type: 'paragraph',
          content: [
            'And if you fall in love with New Zealand — which is likely — ',
            { type: 'strong', text: 'the path to residency is very real' },
            ". New Zealand's Green List includes occupations across healthcare, engineering, technology, education, and more. If your job is on the Green List Tier 1, you can apply for residency directly after meeting qualification and salary requirements. New Zealand's biggest industries — agriculture, technology, green energy, healthcare, and services — are all growing. The country actively needs skilled graduates, and your international perspective is an asset.",
          ],
        },
      ],
    },
    {
      id: 'practical-tips',
      title: "Practical Tips From Students Who've Been There",
      blocks: [
        {
          type: 'paragraph',
          content: [
            "Heard from real students who've made the journey from Asia to New Zealand:",
          ],
        },
        {
          type: 'list',
          items: [
            [
              { type: 'strong', text: 'Accommodation:' },
              " Start in university halls of residence — it's the fastest way to make friends and find your feet. Once you've settled in, ",
              { type: 'em', text: 'flatting' },
              ' (sharing a rental with other students) is common and much cheaper. See our ',
              {
                type: 'link',
                label: 'accommodation guide',
                href: routes.studentResourceTopic(studentResourceTopics.accommodation),
              },
              ' and the website ',
              {
                type: 'link',
                label: 'Trade Me',
                href: 'https://www.trademe.co.nz/',
                external: true,
              },
              ' — your first stop for finding a flat.',
            ],
            [
              { type: 'strong', text: 'Food:' },
              ' Kiwi café culture is genuinely world-class. Look forward to incredible flat whites, avocado toast, and the famous New Zealand meat pie. Auckland especially has an incredible range of Asian cuisine — Japanese, Korean, Chinese, Vietnamese, Thai — so homesickness is less of a problem than you might fear.',
            ],
            [
              { type: 'strong', text: 'Getting around:' },
              ' Most cities have good public transport, and student discount cards make buses and trains affordable. For exploring beyond the city, New Zealand has cheap domestic flights and beautiful road trip routes.',
            ],
            [
              { type: 'strong', text: 'Getting connected:' },
              ' Setting up a local SIM card on arrival is easy and affordable. Major providers include Spark, One NZ, and 2degrees.',
            ],
            [
              { type: 'strong', text: 'Healthcare:' },
              ' Register with a local GP (doctor) soon after arriving. Your student health insurance from providers like ',
              {
                type: 'link',
                label: 'StudentSafe',
                href: 'https://www.studentsafe.co.nz/',
                external: true,
              },
              ' covers accidents and illness — keep the policy documents handy.',
            ],
            [
              { type: 'strong', text: 'Beat homesickness:' },
              " It's normal. Almost every international student goes through a period of adjustment. The key is to stay active, join clubs and student associations, keep in touch with family back home, and be patient with yourself. Within a few weeks, New Zealand will start to feel like home.",
            ],
          ],
        },
      ],
    },
    {
      id: 'your-next-step',
      title: 'Your Next Step',
      blocks: [
        {
          type: 'paragraph',
          content: [
            'New Zealand is ready for you. The universities are world-class, the landscapes are extraordinary, the people are warm, and the opportunities after graduation are real and meaningful.',
          ],
        },
        {
          type: 'paragraph',
          content: [
            'The best advice? ',
            { type: 'strong', text: 'Start early.' },
          ],
        },
      ],
    },
  ],
  cta: {
    heading: 'Ready to Start Your New Zealand Study Journey?',
    body: "Book a free consultation with an Enrollify advisor. We'll help you understand your options, identify the right study pathway and answer any questions about courses, visas, costs and life in New Zealand.",
    primaryLabel: 'Book a Free Consultation',
    secondaryLabel: 'Explore Courses',
  },
}
