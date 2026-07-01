export const founderBioContent = {
  sections: [
    {
      id: 'our-story',
      title: 'Our story and why we started Enrollify',
      paragraphs: [
        "We didn't set out just to build another software tool; we set out to solve a real, persistent problem we kept seeing over and over again. Education providers and other organisations were spending enormous amounts of time manually handling enquiries, replying to every message, and trying to keep track of who was genuinely ready to take the next step, all in email inboxes and spreadsheets. That manual work wasn't just inefficient—it meant strong candidates sometimes slipped through the cracks while staff were stuck in low-value conversations or hunting for information buried in old threads.",
        "As we listened to admissions teams and business owners, a clear pattern emerged: the enrolment journey was fragmented and reactive. When someone reached out with interest, there was no central place to see the full story of that person's interactions, their questions, or their level of readiness. Staff were juggling Facebook messages, website enquiries, emails, and phone calls without a unified way to qualify leads or understand which conversations deserved priority. That's the environment Enrollify was born into—and it's the environment we set out to transform.",
        "We started Enrollify because we believe that technology should quietly take care of the repetitive, structured work so humans can spend their time on the conversations and decisions that actually require judgment and care. For admissions and enrolment in particular, that means two things: giving prospective students timely, helpful responses, and giving the organisation an organised, accurate view of who they're talking to and how those conversations are progressing. Enrollify is our answer to those needs, designed from the ground up around real workflows rather than abstract ideas.",
      ],
    },
    {
      id: 'what-enrollify-is',
      title: 'What Enrollify is and what it does',
      paragraphs: [
        'Enrollify is a modern admissions and enrolment platform, with Enrollify AI at its core—a production-ready AI assistant that helps prospective students explore study opportunities in New Zealand through channels like Facebook Messenger. When a prospective student sends a message to your Facebook page, Enrollify receives it, understands the context, responds naturally, and gradually qualifies that person over multiple messages. Behind the scenes, it captures every relevant detail—name, contact information, education background, desired qualification, budget, and more—so you have a complete profile rather than a disconnected string of messages.',
        'The key to Enrollify is that it brings everything together in one shared backend platform. The same "brain" that talks to students on Messenger is designed to power future website chat, Instagram, WhatsApp, and other channels, so no matter where a conversation starts, it ends up in a single, consistent system. All the conversations, leads, scores, and student profiles live in one place, powered by a robust data layer built on Supabase PostgreSQL, which makes it possible to track and manage enrolments with far more clarity than email and spreadsheets ever could.',
        "We've also focused heavily on ensuring Enrollify doesn't just talk—it listens, remembers, and organises. The AI assistant maintains conversation history, pulls in relevant knowledge about courses and institutions, and uses natural qualification flows to ask the right questions without interrogating the user. Every interaction is recorded so staff can later review what was discussed, see how the lead was scored, and decide what follow-up actions are appropriate. That mix of automation, memory, and structured data is what makes Enrollify feel like a real admissions partner rather than just a chatbot.",
      ],
    },
    {
      id: 'how-enrollify-helps',
      title: 'How Enrollify helps organisations',
      paragraphs: [
        "When we talk about Enrollify with organisations, we usually start with the simple reality: you are spending too much time on manual tasks that a well-designed system can handle for you. Today, many teams must reply to every new message from scratch, ask the same qualifying questions again and again, and manually copy details into a spreadsheet or CRM—if they have time to do it at all. Enrollify's AI assistant is built to take on that initial load, engaging in warm, professional conversations that naturally gather the information you need to decide whether someone is a good fit and how ready they are to enrol.",
        "On the business side, Enrollify provides a central admin dashboard where staff can see students, conversations, lead scores, and overall pipeline health at a glance. We've designed the system so that admissions teams can review conversation histories, filter leads by score, and track how many enquiries are converting into applications or enrolments. Instead of scrambling through inboxes or trying to remember which messages still need replies, staff can work from a clean, prioritised view that highlights hot leads and shows where each person is in the journey.",
        'One of the most important benefits for us is that Enrollify reduces time spent on poor-fit or low-intent enquiries. By automatically scoring leads based on factors like readiness to apply, English ability, budget fit, intake timeframe, and visa readiness, the system helps organisations focus their limited time on people who are genuinely close to enrolling. That doesn't mean turning away others; it means using a structured, consistent view of lead quality to deliver smarter, more sustainable admissions operations.',
      ],
    },
    {
      id: 'our-philosophy',
      title: 'Our philosophy',
      paragraphs: [
        "Our philosophy is simple: technology should be warm, helpful, and invisible when it's working well. We don't want prospective students or staff to feel like they're dealing with a machine; we want them to feel like they're part of a well-organised conversation where the right information appears at the right time. That's why the Enrollify AI assistant is designed to sound professional and human, to ask questions at a natural pace, and to never overwhelm or interrogate the user.",
        'We care deeply about building systems that reflect real-world workflows. Instead of forcing organisations to change everything they do, Enrollify integrates into channels they already use—like Facebook Messenger—and overlays a smarter, more structured way of handling those conversations. Under the hood, the architecture uses patterns like service layers, repositories, and clear separation between channels and core logic, so the platform stays robust, maintainable, and easy to extend as needs evolve.',
        "Another part of our philosophy is transparency. We want admissions teams to see exactly what the AI is doing, what data is being captured, and how leads are being scored. That's why Enrollify includes an admin dashboard with analytics like response times, conversation volumes, and conversion rates, along with clear views into the data stored for each student. For us, trust in AI starts with giving humans clear visibility and control over the system's behaviour, and Enrollify is built with that principle in mind.",
      ],
    },
    {
      id: 'where-enrollify-is-heading',
      title: 'Where Enrollify is heading',
      paragraphs: [
        "Enrollify began with Facebook Messenger as the first channel, but we've always envisioned it as a multi-channel admissions platform with a single shared backend. The same architecture that powers Messenger today is designed to support website chat, Instagram, WhatsApp, and future channels without needing to rebuild the core AI, data, or lead-management services. This means organisations can expand how they engage with prospective students and clients while keeping a unified, consistent view of their enrolment pipeline.",
        "Looking ahead, we're excited to continue refining Enrollify based on real feedback from the teams using it. That includes improving the AI's ability to understand nuanced questions, expanding the knowledge base and reporting capabilities, and deepening integrations with tools like HubSpot for downstream sales and marketing workflows. Through all of that, our goal remains the same: to make enrolment smoother, smarter, and more human, so organisations can grow without sacrificing the quality of their relationships with the people they serve.",
      ],
    },
  ],
  closingCta: {
    title: 'Get in touch',
    body: 'Whether you represent an education provider exploring admissions technology or a student researching study in New Zealand, we would love to hear from you.',
    primaryLabel: 'Contact Enrollify',
    secondaryLabel: 'Book a free consultation',
  },
} as const
