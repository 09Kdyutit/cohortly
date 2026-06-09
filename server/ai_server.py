from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI(title="Cohortly AI")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

KB = [
  # ── MODULES ──────────────────────────────────────────────────────────────
  {
    "id": "m-10014",
    "triggers": [
      "10.014","10014","computational thinking","CTD","python module","coding module",
      "programming course","lab submission","recursion","jupyter notebook","lab 1","lab 2",
      "lab 3","lab 4","tree traversal","binary tree","linked list","sorting algorithm",
      "how to submit lab","python assignment","python help","10.014 help","debugging python",
      "python error","syntax error","index error","indentation error","10.014 difficult",
      "10.014 hard","fail 10.014","10.014 tips","10.014 exam","pass 10.014","code not working",
      "my code is broken","lab not working","jupyter not working","anaconda","spyder",
      "how to install python","python setup","10.014 project","ctd project",
    ],
    "response": "**10.014 Computational Thinking for Design** — your intro to Python and algorithms.\n\n**What you'll cover:**\n- Functions, loops, conditionals, recursion\n- Data structures (lists, dicts, trees)\n- Basic algorithms (sorting, searching)\n- Jupyter notebooks throughout\n\n**Lab tips from seniors:**\n- Recursion trips everyone up — trace it on paper BEFORE coding. Draw the call stack.\n- If you get an IndentationError, your tabs/spaces are mixed — use the editor's 'Convert Indentation' option\n- Submit via **Canvas** — check the exact filename format required, wrong names = zero\n- Lab machines in **Building 5** have everything installed and are open 24h with your student card\n\n**Getting help:**\n- Post in the **10.014 module room** on Cohortly (Classes tab) — Aarav or Sara usually reply within 2–4 hours\n- Aarav Menon (Y3 ISTD) runs **weekly coding prep sessions** — check Events\n- Don't debug alone for more than 20 minutes — ask",
    "followUps": ["How do I set up Python?","Who is Aarav Menon?","How do I use the module rooms?"],
  },
  {
    "id": "m-10009",
    "triggers": [
      "10.009","10009","digital world","the digital world","2d project","2D project",
      "group project","project brief","digital world project","team formation",
      "10.009 project","10.009 help","10009 project","team for 10.009","2d brief",
      "project scope","project topic","10.009 hard","10.009 tips","digital world exam",
      "information systems","sociotechnical","technology society",
    ],
    "response": "**10.009 The Digital World** — technology, society, and how they shape each other.\n\n**The big deliverable: 2D Group Project**\n- Brief drops in **Week 2** — don't wait to form your team\n- Pick teammates with **complementary skills**: ASD (spatial/design) + ISTD (technical) combos work extremely well\n- Past themes: smart city systems, assistive tech, zero-waste platforms, crisis communication tools\n- Scope **down** aggressively — ambitious scoping kills teams in Week 11\n\n**Assessment breakdown:**\n- Continuous: weekly reflections, participation, guest lectures\n- 2D Project: proposal → midterm review → final submission + presentation\n\n**Tips:**\n- Start the project report structure in Week 3 even if content is thin — it forces clarity\n- Seniors Wei Jian and Aarav both answer in the 10.009 module room on Cohortly",
    "followUps": ["How do I form a good team?","What other modules do I take?","How does Pass/Fail grading work?"],
  },
  {
    "id": "m-10001",
    "triggers": [
      "10.001","10001","advanced mathematics","advanced maths","advanced math",
      "maths module","math module","calculus","linear algebra","differential equations",
      "matrices","eigenvalues","10.001 hard","fail math","math help","maths help",
      "10.001 tips","10.001 exam","problem sets","tutorial","math tutorial",
      "integration","differentiation","vectors","10001 exam",
    ],
    "response": "**10.001 Advanced Mathematics I** — the mathematical backbone for everything at SUTD.\n\n**Topics covered:**\n- Calculus (multivariable, integration techniques)\n- Linear algebra (matrices, eigenvalues, vector spaces)\n- Differential equations (ODEs, systems)\n\n**How to not fall behind:**\n- Do **every problem set** even if it's not graded — the exam is heavily problem-set-style\n- Go to **office hours** (posted on Canvas). Professors actually want you there. Showing up with a written question gets you more than an hour of solo studying.\n- Find 2–3 study partners at the same pace — explain concepts to each other\n- Khan Academy and MIT OpenCourseWare 18.06 (linear algebra) are excellent free supplements\n\n**Common failure point**: falling behind in Week 3–4 and not catching up. If you're lost, go to office hours before the next problem set, not after.",
    "followUps": ["How do I find a study group?","How does grading work?","What are all my modules?"],
  },
  {
    "id": "m-10002-10003",
    "triggers": [
      "10.002","10002","modelling the systems world","systems world",
      "10.003","10003","modelling space","space and systems","physics module",
      "mechanics","dynamics","statics","10.002 help","10.003 help",
      "free body diagram","thermodynamics","signals","frequency","10.002 exam",
      "10.003 exam","engineering module","modelling module",
    ],
    "response": "**10.002 Modelling the Systems World** and **10.003 Modelling Space and Systems**.\n\n**10.002** — quantitative modelling of systems: mechanics, dynamics, basic control.\n- Tied to 10.009 and 10.001 — the maths shows up here in applied form\n- Free body diagrams and differential equations are core skills\n\n**10.003** — geometry, spatial reasoning, 3D physical behaviour.\n- Strong overlap with ASD design work and FabLab prototyping\n- Visualising in 3D helps — sketch things out physically\n\n**Tips:**\n- Cross-disciplinary study groups work: ASD students excel at spatial thinking, ISTD at systems modelling\n- Use the **FabLab** (Building 2) to build physical prototypes for 10.003 concepts — hands-on helps understanding\n- Office hours matter here — bring your half-done problem set, not a blank one",
    "followUps": ["What is the FabLab?","What other modules do I take?","How does grading work?"],
  },
  {
    "id": "freshmore-curriculum",
    "triggers": [
      "what modules do i take","freshmore modules","year 1 modules","all modules",
      "term 1 modules","what subjects","what courses","freshmore curriculum",
      "first year modules","how many modules","module list","subject list",
      "what do i study","what to study","study plan","module overview",
    ],
    "response": "**Every Freshmore takes the same 5 modules in Term 1:**\n\n- **10.001** — Advanced Mathematics I (calculus, linear algebra, ODEs)\n- **10.002** — Modelling the Systems World (applied physics/mechanics)\n- **10.003** — Modelling Space and Systems (geometry, spatial reasoning)\n- **10.009** — The Digital World (technology + society + 2D group project)\n- **10.014** — Computational Thinking for Design (Python programming)\n\n**Term 2** adds Humanities, Arts and Social Sciences (HASS) electives and continues the core.\n\n**Term 3** begins to introduce pillar-specific content.\n\nAll modules are **Pass/Fail in Year 1** — no GPA stress until Year 2. Your timetable is on **ModTrek**; materials are on **Canvas**.",
    "followUps": ["How does Pass/Fail grading work?","What is 10.014 like?","What is the academic calendar?"],
  },
  {
    "id": "y2-modules",
    "triggers": [
      "50.007","50007","machine learning","ML module","year 2 modules","pillar modules",
      "ISTD modules","ASD modules","EPD modules","ESD modules","DAI modules",
      "year 2 subjects","second year modules","upper year modules","advanced modules",
      "what do i study in year 2","year 3 modules","deep learning","neural network",
      "algorithms","data structures module","software engineering module",
    ],
    "response": "**Year 2+ modules depend on your pillar** — chosen at end of Freshmore year.\n\nSample modules by pillar:\n\n**ISTD** (Info Systems, Tech & Design):\n- 50.001 Introduction to Information Systems\n- 50.002 Computation Structures\n- 50.005 Computer System Engineering\n- 50.007 Machine Learning\n\n**DAI** (Design & AI):\n- 60.001 Design Thinking\n- 60.004 AI Design Studio\n\n**ASD** (Architecture & Sustainable Design):\n- 40.001 Spatial Thinking\n- 40.016 Architecture Design Studio\n\n**EPD** (Engineering Product Development):\n- 30.001 Circuits & Electronics\n- 30.007 Engineering Design Innovation\n\n**ESD** (Engineering Systems & Design):\n- 40.001 Analytics\n- 40.002 Optimisation\n\n**50.007 ML** specifically: covers supervised learning, neural networks, gradient descent. Strong 10.014 Python foundation helps a lot. Aarav Menon (Y3 ISTD) answers questions in the 50.007 module room.",
    "followUps": ["What is pillar selection?","Tell me about ISTD","When do letter grades start?"],
  },

  # ── ACADEMIC SYSTEM ───────────────────────────────────────────────────────
  {
    "id": "grading-pf",
    "triggers": [
      "pass fail","pass/fail","grading","grades","gpa","letter grade","transcript",
      "how am i graded","assessment","no grades","marks","how to pass","scoring",
      "grade system","evaluation","how grading works","S/U","satisfactory",
      "fail grade","B+ grade","A grade","grade calculation","freshmore grading",
    ],
    "response": "**Freshmore year (Terms 1–2) is fully Pass/Fail** — no GPA, no letter grades.\n\nThis is intentional. SUTD designed it so you can explore, take risks, and focus on learning rather than competing for grades.\n\n**What you need to do:** Pass every module. That's it.\n\n**How they decide pass/fail:**\n- Continuous assessment (labs, project milestones, participation): typically 40–60%\n- Final project or exam: 40–60%\n- Attendance is factored in — 80% minimum required\n\n**Letter grades (A+ to D) start from Year 2** and count toward your cumulative GPA.\n\n**Pillar selection** at end of Freshmore is competitive based on your engagement, projects, and sometimes a brief statement — not Freshmore grades. But failing modules delays you.",
    "followUps": ["What is pillar selection?","What happens if I fail a module?","What are all my modules?"],
  },
  {
    "id": "academic-calendar",
    "triggers": [
      "academic calendar","term dates","when does term start","when does school start",
      "term break","break dates","recess week","reading week","study week","exam period",
      "vacation","holiday","when is break","school holiday","term 1 dates","term 2 dates",
      "when is recess","mid term break","semester schedule","term structure","how long is term",
      "teaching weeks","how many weeks","when does term end",
    ],
    "response": "**SUTD Academic Calendar (AY2026–27):**\n\n**Term 1** (~Sep–Nov 2026)\n- 13 teaching weeks\n- **Recess Week** at Week 7 — mid-term breather, use it to catch up, not fall further behind\n- Continuous assessment throughout; project/exam submissions in Weeks 12–13\n\n**Term Break 1** (~late Nov – early Jan): ~6 weeks\n\n**Term 2** (~Jan–Apr 2027)\n- 13 teaching weeks + Recess Week\n- 10.009 2D Project final submission\n- Pillar preference submission happens around end of Term 2\n\n**Term Break 2** (~Apr–May): ~5 weeks\n\n**Term 3** (~May–Aug 2027)\n- Pillar-specific electives begin appearing\n- Some students do internships or external programmes during this period\n\nExact dates shift each year — check **Canvas announcements** and the official SUTD academic calendar at sutd.edu.sg.",
    "followUps": ["What is Recess Week for?","What do I do during term break?","What is pillar selection?"],
  },
  {
    "id": "fail-module",
    "triggers": [
      "fail module","failed module","failing","what if i fail","retake","repeat module",
      "academic probation","academic warning","remediation","flunk","consequences of failing",
      "failed exam","failed project","academic review","poor performance","struggling academically",
      "behind in module","falling behind","cant pass","cannot pass",
    ],
    "response": "**If you fail a module at SUTD:**\n\n**Immediate consequence**: You need to retake it in the next available term — this can delay pillar entry.\n\n**Escalation path:**\n- 1 failed module → academic advisor meeting + action plan\n- 2+ failed modules in a term → formal **academic review** with OSA\n- Continued failures → **academic probation**: reduced module load, mandatory weekly check-ins, formal notice\n\n**Before it gets there — what actually works:**\n- Talk to your **module coordinator or professor mid-term**, not at the end. They have accommodation options.\n- Post in the **Cohortly module room** — seniors spot common mistakes fast and respond within hours\n- Walk into **Student Hub (Building 1, Level 2)** and ask for an OSA student advisor — they help you make a recovery plan\n- Most students who fail a module in Term 1 and get support do fine in Term 2\n\nThe worst thing you can do is stay silent and hope it fixes itself.",
    "followUps": ["How do I manage stress and workload?","Where is the Wellbeing Centre?","How do I email a professor?"],
  },
  {
    "id": "academic-integrity",
    "triggers": [
      "plagiarism","academic integrity","cheat","cheating","copy homework","turnitin",
      "academic dishonesty","AI assistance","chatgpt allowed","can i use chatgpt",
      "can i use AI","collaboration policy","what counts as plagiarism","cite sources",
      "citation","copying code","share assignment","group work rules","individual work",
      "copilot allowed","github copilot allowed","is it cheating",
    ],
    "response": "**Academic Integrity at SUTD — take this seriously.**\n\n**Plagiarism includes:**\n- Copying code or text from classmates (even if you change variable names)\n- Submitting online sources without citation\n- Giving your code to someone else — the person who shares is also guilty\n\n**AI tools (ChatGPT, Copilot, etc.):**\n- Rules vary module-by-module. Some allow AI for brainstorming, not code/writing. Some ban it entirely.\n- **Always check Canvas for that module's AI policy before using any AI tool**\n- When in doubt, ask your prof. They appreciate the question.\n\n**Safe collaboration:**\n- Discussing concepts, approaches, and ideas with classmates: ✓ allowed\n- Each person writes their own code/essay independently: ✓ required\n- Working on a document together and submitting it as individual work: ✗ not allowed\n\n**If caught**: Academic Integrity Committee review. Consequences range from zero on the assignment to module failure to suspension. It's not worth it.",
    "followUps": ["How do I ask a professor about the AI policy?","What happens if I fail a module?","How do I email a professor?"],
  },
  {
    "id": "excused-absence",
    "triggers": [
      "excused absence","miss class","miss lab","miss lecture","miss tutorial",
      "absent","late submission","extension","deadline extension","missed deadline",
      "skip class","attendance policy","medical excuse","excused","how to get extension",
      "late assignment","late lab","late submission policy","attendance requirement",
      "80 percent attendance","attendance minimum",
    ],
    "response": "**Missing class or a deadline:**\n\n**Attendance**: SUTD requires 80% minimum attendance per module to pass. Labs and tutorials are especially tracked.\n\n**If you're sick — do this on the same day:**\n1. See a doctor, get an MC (medical certificate)\n2. Email your professor AND module coordinator with MC attached\n3. Subject line: `Medical Leave – [Module Code] – [Full Name]`\n4. Keep the email short: date, what you missed, MC attached. Don't over-explain.\n\n**Deadline extension:**\n- Email the prof **before** the deadline — this matters. Asking after rarely works.\n- One sentence on the situation + what you're requesting + when you can submit\n- Don't pad it with excessive apologies\n\n**Repeated absences**: Talk to OSA or your faculty advisor early — they have accommodation processes. Don't go silent.",
    "followUps": ["How do I email a professor?","How do I get an MC?","What happens if I fail a module?"],
  },
  {
    "id": "email-prof",
    "triggers": [
      "email professor","email prof","how to email","email tutor","email teacher",
      "contact professor","professional email","email etiquette","office hours",
      "prof email","how to address professor","dear prof","email faculty",
      "how to write email","reply to prof","email supervisor","email ta",
    ],
    "response": "**How to email a professor at SUTD:**\n\nThis format gets responses. Professors get 50+ emails a day.\n\n**Subject**: `[Module Code] – [Brief topic]`\nExample: `10.014 – Question on Lab 3 submission format`\n\n**Structure:**\n- `Dear Prof [Last Name],` (use Prof unless you know they prefer Dr.)\n- One line of context: \"I'm a Term 1 student in your 10.014 class.\"\n- Your specific question — say what you've already tried\n- `Thank you,`\n- `[Full Name] (Student ID: XXXXXXX)`\n\n**Office hours are almost always better than email** for technical questions. Bring a written-down question. Check Canvas for their schedule.\n\n**Response time**: 24–48h typical. For urgent issues (MC, missed deadline), call the department office.",
    "followUps": ["How do I ask for a deadline extension?","What are office hours?","What is Canvas?"],
  },
  {
    "id": "pillar-selection",
    "triggers": [
      "pillar selection","choose pillar","which pillar","pillar","ASD","ESD","EPD",
      "ISTD","DAI","architecture pillar","engineering pillar","design ai pillar",
      "information systems","pillar preference","what pillar to choose","pillar competitive",
      "pillar application","pillar intake","pillar quota","change pillar","pillar transfer",
      "architecture sustainable design","engineering systems","engineering product",
    ],
    "response": "**SUTD has 5 undergraduate pillars** — you choose at the end of Freshmore year.\n\n- **ASD** — Architecture and Sustainable Design: buildings, urban design, sustainability, spatial design. Creative + technical.\n- **ESD** — Engineering Systems and Design: complex systems, supply chains, finance engineering, analytics. Great for problem solvers who think at scale.\n- **EPD** — Engineering Product Development: physical products, robotics, electronics, manufacturing. Best for makers.\n- **ISTD** — Information Systems Technology and Design: software, cybersecurity, AI/ML, systems. Largest pillar, highest demand.\n- **DAI** — Design and Artificial Intelligence: human-centred AI, UX, data design, AI ethics. Newest pillar.\n\n**Selection process**: Submit your pillar preference in Term 2. Most pillars have enough places — engagement, projects, and genuine interest matter more than grades (remember: Freshmore is P/F).\n\nTalk to seniors in each pillar via the **People tab** — their actual experience > any brochure.",
    "followUps": ["Who are the ISTD mentors?","How do I connect with seniors?","What is Freshmore grading?"],
  },

  # ── TECH SETUP ────────────────────────────────────────────────────────────
  {
    "id": "python-setup",
    "triggers": [
      "python setup","install python","set up python","vs code","vscode","git setup",
      "github setup","development environment","coding environment","anaconda","jupyter",
      "github education","github copilot","pip","conda","python version","python 3",
      "set up laptop","coding tools","programming setup","install jupyter","how to code",
      "laptop setup","coding environment setup","download python",
    ],
    "response": "**Get this set up before Week 1 of 10.014:**\n\n1. **Python 3.11+** — download from python.org OR install **Anaconda** (includes Jupyter, numpy, pandas — recommended)\n2. **VS Code** — add the Python and Jupyter extensions from the Extensions marketplace\n3. **Git** — download from git-scm.com\n4. **GitHub account** — use your **SUTD email** (yourname@mymail.sutd.edu.sg). This unlocks **GitHub Education**: free Copilot, private repos, and more\n\n**Quick test**: Open terminal → `python3 --version` → should print 3.11+ ✓\n\n**Don't stress if setup breaks** — lab machines in **Building 5** have everything pre-installed and are open 24h with your student card. Post in the 10.014 Cohortly module room if you're stuck.",
    "followUps": ["What is the 10.014 module?","What is GitHub Education?","Where is Building 5?"],
  },
  {
    "id": "it-services",
    "triggers": [
      "vpn","microsoft 365","office 365","teams","onedrive","matlab","adobe cc",
      "adobe creative cloud","software license","free software","sutd software","sutd vpn",
      "it helpdesk","eduroam","wifi","wifi setup","wifi not connecting","campus wifi",
      "free apps","student software","it support","microsoft word","outlook","sharepoint",
      "palo alto","globalprotect","figma","notion","student discount apps",
    ],
    "response": "**Free software for SUTD students:**\n\n- **Microsoft 365** (Outlook, Word, Excel, Teams, OneDrive 1TB): free — activate at office.com with your SUTD email\n- **Adobe Creative Cloud** (Photoshop, Illustrator, Premiere, InDesign, After Effects): free — register at adobe.com/education with your SUTD email\n- **MATLAB**: licensed for SUTD — download from the IT portal at sutd.edu.sg/it\n- **GitHub Education**: free Copilot + private repos — register with SUTD email at education.github.com\n\n**SUTD VPN**: Palo Alto GlobalProtect — required for library resources off-campus. Download from the IT portal.\n\n**eduroam WiFi**: Username = your full SUTD email, Password = student account password. Works at universities worldwide.\n\n**IT Help Desk**: Building 1 Level 1, or email ithelp@sutd.edu.sg. Usually 1 business day response.",
    "followUps": ["How do I set up my SUTD email?","Where is Building 1?","How do I connect to eduroam?"],
  },
  {
    "id": "canvas-modtrek",
    "triggers": [
      "canvas","lms","modtrek","timetable","schedule","class schedule","assignments",
      "announcements","how to access canvas","canvas not working","modtrek login",
      "canvas login","where are my modules","lecture slides","learning management",
      "course portal","assignment portal","submit assignment","canvas submission",
    ],
    "response": "**Two platforms you'll live on:**\n\n**Canvas** (canvas.sutd.edu.sg) — SUTD's Learning Management System:\n- All lecture slides, assignments, deadlines, and announcements live here\n- Check it every evening — profs post important things without emailing you separately\n- Submit all assignments here unless the prof says otherwise\n- Activate with your SUTD student account credentials\n\n**ModTrek** (modtrek.sutd.edu.sg) — your timetable:\n- Shows your official lecture, tutorial, and lab times with room numbers\n- Check this first for any timetable conflicts\n\n**If Canvas isn't showing your modules**: Go to IT Help Desk (Building 1, Level 1) or email ithelp@sutd.edu.sg — usually a provisioning issue fixed within a day.",
    "followUps": ["How do I set up my SUTD email?","What software is available to me?","Where is the IT helpdesk?"],
  },

  # ── HOSTEL ────────────────────────────────────────────────────────────────
  {
    "id": "hostel-overview",
    "triggers": [
      "hostel","housing","on campus housing","dorm","dormitory","block 1n","block 1s",
      "move in","move-in","compulsory housing","stay on campus","where do i live",
      "hostel application","hostel room","hostel block","single room","shared room",
      "accommodation","stay at sutd","campus living","hostel fee","room fee",
      "hostel cost","check in","check-in","hostel orientation","housing portal",
    ],
    "response": "**All Freshmores live on campus for Terms 1–3** — compulsory for AY2026.\n\nMost Freshmores are in **Block 1N or 1S**. Rooms are single-occupancy (own room, shared bathroom on the floor).\n\n**Hostel fees**: ~S$250–350/month depending on room type — included in your billing via Student Hub.\n\n**Move-in checklist:**\n- Bring a printed passport-size photo for key collection (Housing office, Building 1)\n- Pack: bedsheet set (single bed), pillow, towel, toiletries\n- **No kettles or high-wattage appliances** — fire safety, rooms ARE inspected\n- Your student card opens the block door\n- WiFi: connect to **eduroam** with your SUTD email credentials\n\nThe floor lounge is where most Freshmore friendships start — show up there in Week 1.",
    "followUps": ["What should I pack?","What are the hostel rules?","What food is near the hostel?"],
  },
  {
    "id": "hostel-pack",
    "triggers": [
      "what to bring","what to pack","packing list","packing for hostel","what do i need",
      "essentials hostel","hostel packing","what should i bring","bring to sutd",
      "what to bring sutd","hostel essentials","bedsheet","pillow","towel","toiletries",
    ],
    "response": "**Hostel packing list for SUTD:**\n\n**Bedding (single bed):**\n- Bedsheet set (fitted + flat, single size)\n- Pillow + pillowcase\n- Light blanket/comforter (rooms are air-conditioned, can get cold)\n\n**Bathroom:**\n- Shower caddy/basket (shared bathrooms on your floor)\n- Flip-flops for the shower\n- Towels (2)\n- All your usual toiletries\n\n**Room:**\n- Extension cord / power strip (rooms have limited sockets)\n- Reading lamp or desk lamp\n- Clothes hangers\n- A small lockbox for valuables (optional but smart)\n\n**Electronics:**\n- Laptop + charger (essential)\n- Portable power bank\n- Earphones/headphones\n\n**Do NOT bring:**\n- Kettles, rice cookers, toasters, hotplates — fire safety rules, strictly enforced\n- Immersion heaters — same reason\n\nBuy snacks, water, and small items from the Cheers/7-Eleven on campus after you arrive.",
    "followUps": ["What are hostel rules?","What food is near campus?","What is the hostel like?"],
  },
  {
    "id": "hostel-rules",
    "triggers": [
      "hostel rules","hostel regulations","quiet hours","visitor policy","overnight guests",
      "hostel policy","no kettle","noise rules","hostel conduct","room inspection",
      "ra","resident advisor","hostel management","hostel warden","check out","leave hostel",
      "late night hostel","curfew","can i have visitors","guest hostel","friend visit",
    ],
    "response": "**Key hostel rules:**\n\n- **Quiet hours**: 11 PM – 8 AM (weekdays), midnight – 9 AM (weekends)\n- **No kettles, rice cookers, or appliances over ~500W** — fire regulations. Room inspections do happen.\n- **Overnight guests**: must be registered at the security desk. Max nights per guest is limited — check with your RA for the exact policy.\n- **Visitor sign-in**: all guests, including SUTD students from other blocks, sign in at security\n- **Laundry**: book via the housing app — peak time Sunday 2–6 PM, avoid it\n- **No hanging laundry outside windows** — use the drying racks on your floor\n\n**Your RA (Resident Advisor)** — a Year 2/3 student on your floor — is your first contact for any hostel issues. They know the system, they're not there to police you.",
    "followUps": ["Where is the nearest food?","How does hostel laundry work?","How do I meet floor neighbours?"],
  },
  {
    "id": "hostel-laundry",
    "triggers": [
      "laundry","washing machine","dryer","wash clothes","iron","ironing board",
      "laundry room","laundry cost","laundry booking","how to wash clothes",
      "laundry machine","where to do laundry","laundry facilities","laundry app",
      "wet clothes","dry clothes","laundry peak time",
    ],
    "response": "**Hostel laundry at SUTD:**\n\n- **Location**: Each block floor has 2–3 washers and dryers\n- **Cost**: ~S$1.50–2.00 per wash cycle, ~S$1.00–1.50 per dry cycle\n- **Payment**: Campus laundry app or coins (check which your block uses)\n- **Booking**: Use the **SUTD Housing app** to see real-time machine availability\n\n**Timing strategy:**\n- Worst: Sunday 2–6 PM\n- Best: Thursday morning or weekday before 9 AM\n- Wash takes ~35–40 min, dry ~45–50 min\n- Don't leave clothes in machines unattended — others will move them\n\n**Ironing**: Ironing boards in the laundry room. Bring your own low-wattage iron (<1000W — the rule is roughly this).\n\n**Air drying**: Clothes racks available on the floor balcony area. Don't hang outside windows.",
    "followUps": ["What are hostel rules?","What should I pack?","Where is the nearest supermarket?"],
  },
  {
    "id": "hostel-packages",
    "triggers": [
      "package","parcel","delivery","receive parcel","mail","courier","shopee","lazada",
      "amazon","carousell","postal address","hostel address","where to receive package",
      "mailbox","letterbox","collection","package collection","courier delivery",
    ],
    "response": "**Receiving parcels at SUTD hostel:**\n\n**Your postal address format:**\n`[Block Number], 8 Dover Road, Singapore 138682`\nE.g., `Block 1N, Room 04-12, 8 Dover Road, Singapore 138682`\n\n**How it works:**\n- Shopee/Lazada: delivered to the **block mailroom or security counter** — you get an SMS or delivery slip in your letterbox\n- Oversized parcels (DHL, FedEx): security desk holds them. Collect with your student card.\n- **Popstation lockers** at Clementi MRT (2 stops) are great if you want to control pickup timing\n\n**Check your mailbox** weekly — ICA letters, bank cards, and OSA notices come by post.\n\n**Tip**: In Shopee/Lazada settings, set the default address to your block's security address. They handle it well.",
    "followUps": ["What amenities are near campus?","How do I get to Clementi?","What is the hostel address?"],
  },

  # ── FOOD ─────────────────────────────────────────────────────────────────
  {
    "id": "food-campus",
    "triggers": [
      "food","eat","canteen","lunch","dinner","breakfast","campus food","where to eat",
      "koufu","bistro","campus bistro","sports canteen","sports complex food",
      "food options","meal","hungry","food on campus","dining","what to eat",
      "pgp canteen","cheap food","affordable food campus",
    ],
    "response": "**Campus and near-campus food:**\n\n**On campus:**\n- **Koufu at 1N**: opens 7:30 AM — best for breakfast before 8 AM lectures; multiple stalls, cheapest option (~S$3–6)\n- **Campus Bistro**: opens 8 AM, more variety, slightly pricier (~S$5–8)\n- **Sports Complex Canteen**: lunch crowd, good for quick meals\n- **Cheers/7-Eleven** (campus): snacks, drinks, instant noodles\n\n**Short walk:**\n- **PGP Canteen** (~8 min walk): popular for dinner, more variety\n- **Ghim Moh Hawker Centre** (~15 min walk or 5 min Grab): legendary char kway teow, wonton mee, popiah. Best value off-campus.\n- **Holland Village** (1 MRT stop): more options, slightly pricier\n\n**Late night:**\n- **McDonald's Dover**: 12 min walk, open 24h — the classic supper run\n\nCheck **Hostel tab → active jios** for people heading out — no need to eat alone.",
    "followUps": ["How do meal jios work?","What is halal food like near campus?","What is the Hostel tab?"],
  },
  {
    "id": "food-halal-veg",
    "triggers": [
      "halal food","halal options","halal canteen","muslim food","vegetarian food",
      "vegan food","no pork","no lard","vegetarian options","vegan options",
      "plant based","dietary restriction","food allergy","kosher","hindu vegetarian",
      "halal certified","where to eat halal","muslim student food","halal near sutd",
    ],
    "response": "**Halal food at and near SUTD:**\n\n**On campus:**\n- **Koufu at 1N** has halal-certified stalls — look for the MUIS halal certification logo on each stall\n- **Campus Bistro**: some stalls are halal — check the notice board at the entrance\n\n**Off campus:**\n- **PGP Canteen**: majority of stalls are halal\n- **Ghim Moh Hawker Centre**: several halal stalls (biryani, nasi padang)\n- **Holland Village**: multiple halal restaurants\n- **Clementi Mall food court** (2 MRT stops): many halal options\n\n**Vegetarian/Vegan:**\n- Koufu has at least one vegetarian stall (economic rice style)\n- Ghim Moh has dedicated vegetarian stalls\n- Holland Village has vegetarian cafes\n\n**Muslim students**: The **Muslim Students' Association** is an active Fifth Row club — they organise iftars and community meals during Ramadan. Check the Fifth Row tab.",
    "followUps": ["Where is the prayer room?","What Fifth Row clubs are there?","What food is on campus?"],
  },
  {
    "id": "food-grocery",
    "triggers": [
      "grocery","groceries","supermarket","ntuc","fairprice","cold storage","giant",
      "sheng siong","shop for food","buy groceries","where to buy food","cooking",
      "cook in hostel","hostel kitchen","instant noodles","breakfast supplies",
      "buy snacks","provision shop","market",
    ],
    "response": "**Grocery shopping near SUTD:**\n\n**Closest options:**\n- **Cheers/7-Eleven** on campus: instant noodles, snacks, drinks, basic toiletries — good for emergencies\n- **NTUC FairPrice** at Ghim Moh: ~15 min walk or short Grab. Full supermarket.\n- **Sheng Siong** at Clementi (2 MRT stops): cheapest for staples — rice, eggs, fresh produce\n- **Cold Storage** at Holland Village (1 MRT stop): pricier but convenient, good for Western/specialty items\n- **Clementi Mall** (2 MRT stops): NTUC + Watsons + multiple food options in one trip\n\n**Hostel kitchen**: Each floor has a basic pantry/kitchenette — microwave, kettle (shared communal one is fine, you just can't have one in your room), fridge. Good for instant noodles and simple meals.\n\n**Tip**: Do a proper grocery run once a week — stock snacks, drinks, and breakfast items. Saves money vs buying on campus every day.",
    "followUps": ["What amenities are near campus?","What food is on campus?","How much does living cost?"],
  },
  {
    "id": "jio-culture",
    "triggers": [
      "jio","meal jio","supper run","join jio","post jio","food run","going to eat",
      "jio meaning","what is jio","supper jio","late night food run","spontaneous food",
      "invite to eat","join for food","makan together","eat together",
    ],
    "response": "**Jio** — Singapore slang for \"invite\" or \"ask if you want to join.\"\n\nSomeone posts they're heading somewhere: \"jio anyone for Koufu?\" — and others can join.\n\n**On Cohortly**: People → Hostel tab shows active jios near you — meal runs, study sessions, sports. Tap \"Join jio\" to signal you're in.\n\n**How to post one**: For now, post in your floor group chat. The Events tab also supports social outings.\n\n**Why this matters**: Jios are genuinely how most hostel friendships start in Week 1. The pattern is:\n- Week 1: \"anyone want to jio Koufu?\"\n- Week 2: you have a regular dinner group\n- Week 4: these are your closest friends\n\nSay yes to the first few jios even if you're tired. The ROI is high.",
    "followUps": ["What food is near the hostel?","How do I meet people?","What is the Hostel tab?"],
  },

  # ── ADMIN & REGISTRATION ──────────────────────────────────────────────────
  {
    "id": "admin-checklist",
    "triggers": [
      "admin setup","first week admin","what to do first week","week 1 checklist",
      "week 0 checklist","setup checklist","things to do","orientation checklist",
      "admin tasks","what to register","first day tasks","registration tasks",
      "what do i need to do","to do list sutd","prepare for sutd","before class starts",
    ],
    "response": "**Week 0–1 admin checklist:**\n\n- **Student card** → Student Hub, Building 1 Level 2. Bring IC/passport + photo.\n- **SUTD email** → Activate at sutd.edu.sg/it using your student ID\n- **Canvas** → Log in with SUTD credentials, confirm all your modules are visible\n- **ModTrek** → Confirm your timetable\n- **Singpass** → Register/link at singpass.gov.sg (essential for bank account, polyclinic, government services)\n- **Bank account** → DBS/OCBC recommended; international students: do ICA Student's Pass registration first\n- **EZ-Link card** → From Dover MRT — get Student Concession Pass (half-price fares)\n- **eduroam WiFi** → Connect with SUTD email credentials\n- **GitHub** → Create account with SUTD email → apply for GitHub Education\n\nIf anything breaks: walk into **Student Hub** or email osa@sutd.edu.sg.\n\nAlso check your **Cohortly Launchpad** — Admin & Registration phase has the full interactive tick-off list.",
    "followUps": ["How do I activate my SUTD email?","Where is the Student Hub?","How do I get Singpass?"],
  },
  {
    "id": "student-card",
    "triggers": [
      "student card","collect card","student id card","id card","access card",
      "where to get card","student hub","lost card","replace card","card replacement",
      "access to buildings","campus access card","ntu card","sutd card","student id",
      "card not working","card issue","building access card",
    ],
    "response": "**Collect your student card at Student Hub, Building 1 Level 2** — during Week 0 orientation.\n\n**Bring**: NRIC or passport + passport-size photo (they may also take one on-site).\n\n**What your student card unlocks:**\n- Building access (labs, computer rooms, FabLab — open 24h)\n- Library printing and borrowing\n- Sports Complex and gym\n- Hostel block access\n- Student discounts at campus vendors\n\n**If you lose it:**\n- Report immediately at Student Hub\n- Replacement fee ~S$15\n- Do this fast — you need it for lab access and building entry after hours\n\n**Card not working?** Student Hub, Level 2, or call Building Services.",
    "followUps": ["What is the FabLab?","Where is the library?","What do I need to set up in Week 1?"],
  },
  {
    "id": "sutd-email",
    "triggers": [
      "sutd email","mymail","set up email","email activation","student email",
      "activate email","email not working","sutd email login","mymail.sutd.edu.sg",
      "how to get email","email credentials","sutd outlook","sutd mail",
    ],
    "response": "**Your SUTD email** (yourname@mymail.sutd.edu.sg) is your official identity — professors, OSA, Canvas, and banks all use it.\n\n**How to activate:**\n1. Go to sutd.edu.sg → Student Resources → IT Services\n2. Activate with your student ID number\n3. You get **Microsoft 365 free** — Outlook, Teams, OneDrive (1TB), Word, Excel\n\n**Important uses:**\n- Canvas and all SUTD portals — login\n- GitHub Education (free Copilot + repos) — register with this email\n- Adobe CC — register with this email at adobe.com/education\n- Spotify, Apple Music — student discount with .edu email\n- Bank account verification (some banks accept this as student proof)\n\n**If activation fails**: IT Help Desk, Building 1 Level 1, or ithelp@sutd.edu.sg.",
    "followUps": ["What free software do I get?","How do I set up Canvas?","How do I get GitHub Education?"],
  },
  {
    "id": "international-students",
    "triggers": [
      "international student","student pass","student's pass","ipa letter","ica",
      "myica","immigration","visa","overseas student","foreign student","non singaporean",
      "work permit student","student visa singapore","arrive singapore","immigration card",
      "thumbprint ica","ica registration","ica appointment","register ica",
    ],
    "response": "**International students — key things on arrival:**\n\n**Before you leave home:**\n- Print your **IPA (In-Principle Approval) letter** — don't rely on the phone version at the airport\n- Check that your passport has 6+ months validity beyond your intended stay\n\n**On arrival:**\n- Customs: declare if carrying >S$20,000 in cash or certain food items\n- Register at **myICA** within **2 weeks** of arrival to get your Student's Pass card — do this FIRST before opening a bank account\n\n**Week 0:**\n- Attend the **OSA international student briefing** — mandatory, covers pass conditions\n- Your Student's Pass card takes 1–2 weeks to arrive by post\n\n**Part-time work**: Student's Pass allows up to 16h/week part-time during term. Check your specific pass conditions with OSA.\n\n**Questions?** Email osa@sutd.edu.sg — they respond quickly to international student queries.",
    "followUps": ["How do I open a bank account?","What do I need to set up in Week 1?","What is Singpass?"],
  },
  {
    "id": "singpass",
    "triggers": [
      "singpass","sing pass","myinfo","national digital identity","singpass app",
      "how to register singpass","set up singpass","singpass face verification",
      "singpass login","singpass for students","ndi","singpass two factor",
    ],
    "response": "**Singpass** is Singapore's national digital identity system — essential for almost everything here.\n\n**Singapore Citizens & PRs:**\n- You already have a Singpass linked to your NRIC\n- Download the **Singpass app** → register with NRIC → set up 2FA (fingerprint recommended)\n\n**International students:**\n- You get Singpass access once your **Student's Pass card** arrives from ICA (~1–2 weeks after myICA registration)\n- Register at singpass.gov.sg or at a Singpass counter (ICA Building at Lavender MRT)\n\n**Why you need it at SUTD:**\n- Opening a bank account online (DBS, OCBC)\n- CPF transactions\n- Government portal access (polyclinic bookings, etc.)\n- Digital signing of documents\n- Some student applications and registrations\n\nSet it up in Week 1 — it's fast once you have the right ID.",
    "followUps": ["How do I open a bank account?","What is the ICA process for international students?","What do I need to set up?"],
  },
  {
    "id": "bank-account",
    "triggers": [
      "bank account","open bank account","dbs","posb","ocbc","uob","bank","banking",
      "paynow","bank setup","transfer money","receive money","which bank","best bank student",
      "student account","bank requirements","bank for students","dbs student account",
      "ocbc frank","atm card","debit card","internet banking","online banking",
    ],
    "response": "**Opening a bank account in Singapore:**\n\n**Best options for students:**\n- **DBS/POSB** — largest ATM network, PayNow linked, great app. DBS Multiplier or POSB Student Account.\n- **OCBC Frank** — zero fees, no minimum balance, good UX\n- **UOB One** — if you want cashback later (less relevant as a student)\n\n**What to bring:**\n- Singapore Citizens/PRs: NRIC + Singpass app (online application is easiest)\n- International students: Passport + **Student's Pass card** (physical card required — bank cannot accept the IPA letter)\n\n**International students**: Complete **myICA registration first** and wait for your Student's Pass card before going to the bank.\n\n**ATMs on campus**: DBS ATM near Koufu canteen. OCBC/UOB at Dover MRT station.\n\n**PayNow**: Link your bank to your Singpass/mobile number for instant transfers — used everywhere for splitting bills.",
    "followUps": ["How do I get Singpass?","Where are ATMs on campus?","What is the cost of living?"],
  },

  # ── FINANCE ───────────────────────────────────────────────────────────────
  {
    "id": "tuition-fees",
    "triggers": [
      "tuition fee","tuition fees","school fees","how much sutd","sutd cost","sutd fees",
      "moe tuition grant","tuition grant","subsidised fees","fee waiver","fee structure",
      "yearly fee","annual fee","per term fee","pay school fees","fee payment",
      "how to pay fees","fee invoice","fee bill","study cost",
    ],
    "response": "**SUTD Tuition Fees (AY2026, after MOE Tuition Grant):**\n\n- **Singapore Citizens**: ~S$9,450/year (~S$3,150/term)\n- **Singapore PRs**: ~S$13,150/year\n- **International students**: ~S$28,850/year (with MOE grant); significantly higher without it\n\n**MOE Tuition Grant**: Almost all students take this — it heavily subsidises fees in exchange for a **3-year work-in-Singapore bond** after graduation. Worth it.\n\n**Fee payment**: Via Student Hub billing or online portal — check your SUTD student account for invoices each term.\n\n**Hostel fees**: Additional ~S$250–350/month billed separately.\n\n**If fees are a concern**: Talk to OSA about financial assistance options before they become overdue. They have discretionary funds and can help you plan.",
    "followUps": ["What scholarships are available?","What financial aid can I get?","How much does living cost monthly?"],
  },
  {
    "id": "scholarships-bursaries",
    "triggers": [
      "scholarship","bursary","financial aid","financial assistance","free money",
      "sutd scholarship","government scholarship","mendaki","cdac","sinda","moe bursary",
      "sutd merit award","bond","scholarship bond","scholarship application",
      "how to apply scholarship","study loan","cpf education","financial support",
      "means tested","income criteria","bursary application","need based aid",
    ],
    "response": "**SUTD scholarships and financial aid:**\n\n**Merit Scholarships:**\n- **SUTD Scholarship**: full fees + monthly allowance — very competitive, usually offered pre-admission\n- **DSTA, MINDEF, DSO scholarships**: government-linked, come with career bonds\n- **External scholarships**: PSC, bank scholarships, company-sponsored — apply separately\n\n**Needs-based aid:**\n- **MOE Bursary**: income-tested, reduces tuition further. Apply each academic year via OSA.\n- **SUTD Financial Aid**: additional means-tested bursary. Visit Student Hub to apply.\n- **Community bursaries**: Mendaki (Malay/Muslim), CDAC (Chinese), SINDA (Indian/Eurasian), Eurasian Association — check eligibility on each organisation's website\n\n**Study loans:**\n- **CPF Education Scheme**: use your or parents' CPF savings\n- **Bank study loans** (DBS, OCBC): competitive rates, repay after graduation\n\n**Advice**: Go to OSA financial counselling — they know every option and won't judge. Many students who come in thinking they can't afford SUTD leave with a workable plan.",
    "followUps": ["What are the tuition fees?","How much does living cost?","Where is the OSA office?"],
  },
  {
    "id": "cost-of-living",
    "triggers": [
      "cost of living","monthly budget","living expenses","how much money","expensive",
      "singapore expensive","pocket money","allowance","spending","budget student",
      "how much does it cost to live","monthly expenses","money management","how much per month",
      "food budget","transport budget","entertainment budget",
    ],
    "response": "**Realistic monthly budget as a SUTD student:**\n\n| Category | Budget |\n|---|---|\n| Food (hawker/canteen mostly) | S$300–450 |\n| Transport (EZ-Link concession) | S$60–100 |\n| Personal/toiletries | S$50–80 |\n| Entertainment/activities | S$80–150 |\n| Miscellaneous | S$50–100 |\n| **Total** | **~S$550–880/month** |\n\nThis is on top of tuition and hostel fees.\n\n**Money-saving tips:**\n- Hawker centres beat food courts every time — S$4–6 per meal vs S$8–12\n- Get the **Student Concession EZ-Link card** — half-price MRT/bus fares\n- Campus gym is free with your student card\n- Buy second-hand textbooks on Carousell or check the library first (many are available)\n- Avoid food delivery apps like Grab Food/Foodpanda — delivery fees add up fast",
    "followUps": ["How do I get a student concession card?","What food is cheapest near campus?","Are there part-time jobs?"],
  },

  # ── HEALTHCARE ────────────────────────────────────────────────────────────
  {
    "id": "healthcare",
    "triggers": [
      "clinic","sick","health centre","health center","medical","doctor","unwell",
      "ill","fever","mc","medical certificate","sick leave","campus clinic","healthcare",
      "polyclinic","see a doctor","not feeling well","injury","campus health","gp",
      "general practitioner","sutd clinic","building 1 clinic","campus doctor",
      "food poisoning","headache","stomachache","cough","cold","flu",
    ],
    "response": "**When you're sick at SUTD:**\n\n**Campus Health Centre** (Building 1, Level 1):\n- Mon–Fri, office hours (check Canvas for current hours)\n- GP consultations, subsidised for students\n- Bring your student card\n- Get your MC here — fastest for class excusal\n\n**If the clinic is closed or it's after hours:**\n- **Telemedicine**: Doctor Anywhere or MyDoc app — consult a GP online, get an e-MC (accepted by SUTD profs)\n- **Nearest polyclinic**: Queenstown Polyclinic (~10 min Grab) — subsidised with NRIC, S$14.50 for SC/PR citizens\n- **A&E**: Changi General Hospital (nearest) or National University Hospital (NUH, closer) — for serious issues\n\n**Getting an MC for class:**\n- Email prof + module coordinator on the same day. Subject: `Medical Leave – [Module Code] – [Name]`. Attach the MC.\n- Don't wait until you're better — email same day.",
    "followUps": ["How do I email a professor about being sick?","What is the excused absence process?","Where is Building 1?"],
  },

  # ── TRANSPORT & SINGAPORE ─────────────────────────────────────────────────
  {
    "id": "getting-to-sutd",
    "triggers": [
      "how to get to sutd","sutd location","where is sutd","dover mrt","mrt to sutd",
      "bus to sutd","address sutd","8 dover road","get to campus","transport to sutd",
      "which mrt","which bus","from airport to sutd","from city to sutd","campus location",
      "mrt station","dover station","changi to sutd","jurong to sutd","orchard to sutd",
    ],
    "response": "**Getting to SUTD:**\n\n**Address**: 8 Dover Road, Singapore 138682\n\n**By MRT** (easiest):\n- **Dover MRT** (Circle Line, CC22) — 5-min walk to campus gate\n- From Dhoby Ghaut (city centre): ~20 min direct\n- From Changi Airport: ~50 min (via Tanah Merah → Circle Line)\n\n**By bus**: Routes 99, 147, 175 stop at the campus gate\n\n**By Grab**: S$8–12 from city, S$15–22 from Changi Airport\n\n**From JB (Malaysia)**: Bus to Kranji MRT → Circle Line to Dover. ~1.5–2 hours total.\n\n**Walking from Dover MRT**: Exit B, turn right, walk straight ~5 min. You'll see the campus gate.",
    "followUps": ["What is near campus?","How do I get an EZ-Link card?","Getting to Changi Airport?"],
  },
  {
    "id": "transport-singapore",
    "triggers": [
      "mrt","ez-link","ez link","ezlink","bus","transport","concession card","train",
      "singapore transport","transit","simplygo","student concession","student transit",
      "citymapper","bus app","mrt map","circle line","mrt network","getting around",
      "public transport","bus routes","mrt routes","how to take mrt","how to take bus",
      "tap in tap out","contactless payment","apple pay mrt","google pay mrt",
    ],
    "response": "**Getting around Singapore:**\n\n**EZ-Link card**: Get one at Dover MRT (General Ticketing Machine) or any 7-Eleven. S$12 (includes S$5 credit). Works for all MRT and buses.\n\n**Student Concession Card**: Register at a TransitLink customer service centre (Dover MRT has one) with your student card + IC. Reduces fares by ~50%. Takes a few days to activate — do this in Week 1.\n\n**SimplyGo**: SUTD cards may be linked to SimplyGo. Check if your bank card works for contactless MRT payment (DBS/OCBC debit cards do).\n\n**Apps:**\n- **Google Maps** or **Citymapper**: both excellent for Singapore transit. Citymapper shows real-time bus arrival.\n- **MyTransport.SG** (official): bus arrival times\n\n**Grab/Gojek**: Use for late nights or when buses are infrequent. Gojek is usually cheaper than Grab for short trips.",
    "followUps": ["How do I get a student concession card?","What bus goes to SUTD?","How much does transport cost monthly?"],
  },
  {
    "id": "nearby-amenities",
    "triggers": [
      "supermarket","grocery","atm","pharmacy","convenience store","ntuc","fairprice",
      "guardian","watsons","nearby shops","shopping near sutd","minimart","7 eleven",
      "cheers","atm near campus","shops near","medicine near campus","toiletries",
      "where to buy things","shopping","nearby mall","clementi mall","holland village",
    ],
    "response": "**Near-campus amenities:**\n\n**On campus:**\n- **Cheers/7-Eleven** (near Koufu block): snacks, drinks, basic toiletries, EZ-Link top-up\n- **DBS ATM**: inside Koufu canteen block\n- **Campus photocopy/printing**: Building 5 Library\n\n**Short MRT ride:**\n- **Dover MRT area**: OCBC/UOB ATMs\n- **Holland Village** (1 MRT stop): Cold Storage, Guardian pharmacy, banks, cafes, restaurants\n- **Clementi Mall** (2 MRT stops): NTUC FairPrice, Watsons, Popular bookshop, food court, cinema, bank branches — most convenient for a proper shopping trip\n- **Buona Vista** (1 stop, Circle/East-West): medical clinic, shops\n\n**Pharmacy/medicine**: Guardian at Holland Village, Watsons at Clementi Mall. On campus: Cheers has Panadol, plasters, basic OTC meds.",
    "followUps": ["What food is near campus?","How do I get to Clementi?","How do I get an EZ-Link card?"],
  },
  {
    "id": "weekend-activities",
    "triggers": [
      "weekend","what to do singapore","explore singapore","day trip","johor bahru",
      "jb","malaysia","sentosa","universal studios","botanic gardens","orchard road",
      "night safari","free things to do","singapore attractions","off campus activities",
      "things to do near sutd","go out","explore","sightseeing","sunday","saturday plans",
      "weekend plans","fun singapore","tourist spots","local spots",
    ],
    "response": "**Weekend activities from SUTD:**\n\n**Free or cheap:**\n- **Botanic Gardens** (near Botanic Gardens MRT, 2 stops): UNESCO heritage, free entry, huge green space. Good for a morning walk or study picnic.\n- **MacRitchie Reservoir**: hiking trails (30 min bus), completely free, treetop walk (small fee)\n- **East Coast Park**: cycling, beach, seafood. Rent bikes at Bedok MRT.\n- **Little India / Chinatown / Arab Street**: cheap food, vibrant culture, wandering is free\n- **Marina Bay waterfront**: walking, the Helix Bridge, free light shows at night\n\n**Worth spending:**\n- **Sentosa / Universal Studios**: 25 min from Dover MRT. Student prices available.\n- **Night Safari** at Mandai: unique Singapore experience\n- **Gardens by the Bay**: outdoor free, conservatories ~S$20 for students\n\n**JB (Johor Bahru, Malaysia):**\n- ~1h from Kranji MRT (bus) — bring passport!\n- Food, nail salons, shopping 30–50% cheaper than Singapore\n- Popular SUTD weekend trip — post in floor chat to get a group together",
    "followUps": ["How do I get to JB?","What is near campus?","How much does Singapore cost?"],
  },

  # ── WELLBEING ─────────────────────────────────────────────────────────────
  {
    "id": "wellbeing-services",
    "triggers": [
      "wellbeing","wellbeing centre","counselling","mental health","counselor",
      "therapist","talk to someone","psn","peer support","building 54","counselling free",
      "student support","psychological support","anxiety sutd","depression sutd",
      "mental health support","student counsellor","feel overwhelmed","need help",
      "not coping","struggling","burnout","sutd wellbeing","student wellbeing",
    ],
    "response": "**SUTD Student Wellbeing Centre — Building 54, Level 2**\n\n- Walk-ins are welcome during office hours — no appointment needed\n- All sessions are **free and strictly confidential** — nothing goes on your academic record\n- Services: 1-on-1 counselling with professional counsellors, group support programmes, referrals to external psychiatrists if needed\n\n**Peer Support Network (PSN)**: Trained fellow students you can talk to informally first — sometimes easier than going straight to a counsellor. Look for PSN events and contacts on Canvas.\n\n**There is no stigma at SUTD** — many students use these services. Going early (when you notice stress building) is much more effective than waiting until you're in crisis.\n\nIf you're not sure if your issue is \"serious enough\" — it is. Go.",
    "followUps": ["What are the crisis hotlines?","How do I manage workload?","Where is Building 54?"],
  },
  {
    "id": "crisis-help",
    "triggers": [
      "crisis","sos","suicidal","self harm","urgent mental health","in crisis","not okay",
      "really struggling","1767","samaritans","emergency mental","feel like giving up",
      "want to die","can't go on","break down","panic attack","emergency help",
      "immediate help","call for help","hotline","mental health emergency",
    ],
    "response": "**If you or someone needs help right now:**\n\n- **SOS Singapore: 1767** — 24 hours, free, confidential\n- **Samaritans of Singapore: 1800-221-4444** — 24 hours\n- **IMH Mental Health Helpline: 6389-2222** — 24 hours\n- **SUTD Security: 6303-6002** — on campus any time, can assist and contact wellbeing staff\n\n**On campus during office hours:**\nWellbeing Centre, Building 54 Level 2 — walk in.\n\n**A&E if it's a physical emergency**: National University Hospital (NUH) is the nearest to campus.\n\nYou don't have to be in crisis to reach out. If things feel heavy, please go to the Wellbeing Centre or call SOS. These services exist for exactly this.",
    "followUps": ["Where is the Wellbeing Centre?","What is the Peer Support Network?","How do I tell my prof I need time?"],
  },
  {
    "id": "workload-stress",
    "triggers": [
      "workload","overwhelmed","stressed","too much work","too many assignments",
      "behind","falling behind","time management","study tips","how to cope","busy",
      "manage workload","semester hard","drowning in work","can't keep up",
      "no time","always tired","exhausted","burnt out","burnout","cant sleep",
      "study schedule","how to study","effective studying","how to be productive",
    ],
    "response": "**Managing Freshmore workload — what seniors say actually works:**\n\n- **Skim lecture materials before class** — even 5 min of pre-reading makes the actual class 3x more useful\n- **Study in groups for 10.014**: debugging with someone is faster than debugging alone. Always.\n- **Use office hours**: most students don't. Showing up with a written question = better than 1 extra solo hour\n- **Sleep is not optional**: students who consistently get <6h see the steepest drops in performance by Term 2\n- **Post questions on Cohortly module rooms the day you're stuck** — not the night before the deadline\n- **Recess Week is not a holiday**: it's for catching up on the material that slipped\n\n**If it's more than workload:**\nThe Wellbeing Centre (Building 54, Level 2) has counsellors for exactly this kind of stress. Free, confidential. Don't wait until you're drowning.",
    "followUps": ["How do I use the module rooms?","Where is the Wellbeing Centre?","How do I find a study group?"],
  },
  {
    "id": "homesickness",
    "triggers": [
      "homesick","missing home","miss my family","feel lonely","loneliness","feel isolated",
      "dont know anyone","alone in singapore","far from home","international alone",
      "adjusting singapore","culture shock","first time away from home","feel out of place",
      "dont fit in","social anxiety","shy","introvert sutd","making friends hard",
    ],
    "response": "**Feeling homesick or out of place is completely normal — especially in the first few weeks.**\n\nSUTD is compact and intense, which makes the adjustment feel amplified. Almost every international student (and many Singaporeans, too) feels this in Week 1–2.\n\n**What actually helps:**\n- Say yes to the floor jios even when you're tired — those first shared meals become the friendships\n- Post in the floor WhatsApp group: \"anyone heading to dinner?\" — low-effort, high-return\n- Join one Fifth Row trial session for something you're even slightly curious about\n- Video call home regularly — don't cut off connection, and don't feel guilty for it\n\n**If it persists or deepens into depression or anxiety:**\nThe Wellbeing Centre (Building 54, Level 2) has counsellors experienced with international student adjustment. Walk in, no appointment. Free and confidential.\n\nThis gets easier. By Week 3–4, most students have found their people.",
    "followUps": ["How do I make friends?","What is the Wellbeing Centre?","What are some social activities?"],
  },

  # ── SOCIAL & MAKING FRIENDS ───────────────────────────────────────────────
  {
    "id": "making-friends",
    "triggers": [
      "make friends","making friends","meet people","how to make friends","find friends",
      "social tips","first week social","get to know people","network","social life",
      "how to meet people","connect with people","no friends","friends sutd",
      "freshmore friends","hostel friends","study group","find study partner",
    ],
    "response": "**Making friends at SUTD — what actually works:**\n\n**Highest ROI actions in Week 1:**\n- **Say yes to everything in Week 0**: orientation events, jios, floor hangouts — even when tired. The first 2 weeks set the social trajectory.\n- **Go to the floor lounge**: don't stay in your room. The lounge is where floor friendships form — just show up.\n- **Join a module study group**: shared academic struggle is the fastest bonding mechanism\n- **Attend 3 Fifth Row trial sessions**: no commitment, but you meet people who share specific interests\n\n**Tools on Cohortly:**\n- **People tab**: send connection requests to 3 people in your modules — low pressure, good upside\n- **Hostel tab**: check active jios, see who's on your floor, say hi from the app\n\n**If you're introverted**: small groups are better. A meal jio with 2–3 people beats a big group event. Focus on depth over breadth.",
    "followUps": ["What is the Hostel tab?","What is Fifth Row?","How do I find a study group?"],
  },
  {
    "id": "orientation-camp",
    "triggers": [
      "orientation camp","orientation","o camp","o week","week 0","freshmore camp",
      "freshmore orientation","orientation activities","what happens orientation",
      "what is orientation","orientation week","first week","what to expect sutd",
      "before school starts","camp leader","orientation games","icebreakers",
    ],
    "response": "**Freshmore Orientation — Week 0 (before classes start):**\n\n**What to expect:**\n- **Orientation Camp**: 1–2 days of icebreakers, team activities, campus exploration — run by senior student leaders (OGLs). High energy, intentionally designed to help you meet people fast.\n- **Admin setup sessions**: Help desks for student card, email, Canvas — get everything done here\n- **Fifth Row Club Fair**: All 80+ clubs have booths — walk around, collect brochures, sign up for trial mailing lists\n- **Campus tour**: Seniors walk you through every building, lab, and hidden hangout spot\n- **Wellbeing briefing**: All support services explained\n\n**Attitude**: Go to everything. It feels optional. It's not — this is genuinely your best window to meet the people who will matter for the next 4 years.\n\nIf you're shy: orientation is explicitly designed for that. Everyone is equally lost.",
    "followUps": ["What is Fifth Row?","What should I set up in Week 1?","How do I make friends?"],
  },

  # ── FIFTH ROW CLUBS ───────────────────────────────────────────────────────
  {
    "id": "fifth-row-overview",
    "triggers": [
      "fifth row","CCA","co-curricular","extracurricular","club","clubs","activities",
      "student club","join club","club fair","sutd clubs","what is fifth row",
      "fifth row meaning","student activities","80 clubs","club system sutd",
      "how to join CCA","student organisation","student society","student groups",
    ],
    "response": "**Fifth Row** is SUTD's co-curricular system — named for being the \"fifth\" dimension of education alongside the four pillars.\n\n**5 clusters, 80+ clubs:**\n- **Arts**: Drama, Choir, Dance, Photography Society, Music\n- **Sports**: Basketball, Badminton, Bouldering/Climbing, Frisbee, Volleyball, Swimming, Table Tennis, and more\n- **Community**: Habitat for Humanity, ENVU, Entrepreneurship Society, Muslim Students' Association\n- **Culture**: DSIA, Tea Club, Tabletop/Games Club\n- **Makers**: FabLab Community, Robotics, SUTD Motorsports, CADT (data science)\n\n**Club Fair** — Week 0, all clubs have booths. Browse first, trial later.\n\n**Most clubs have no-commitment trials in Weeks 1–2** — go to 3 trials before you decide anything.\n\nBrowse and track interest in the **Fifth Row tab** on Cohortly.",
    "followUps": ["What is the FabLab?","What Sports clubs are there?","What Community clubs are there?"],
  },
  {
    "id": "fablab",
    "triggers": [
      "fablab","fab lab","fabrication lab","3d printing","3d print","laser cut",
      "laser cutting","maker space","building 2","electronics workshop","prototyping",
      "arduino","raspberry pi","soldering","cnc","woodworking","metalworking",
      "resin printing","fdm printing","3d printer","how to use fablab","fablab access",
      "fablab booking","maker","making things","physical project",
    ],
    "response": "**FabLab (Fabrication Lab) — Building 2, open 24h with your student card.**\n\n**What you can do:**\n- **3D Printing**: FDM (plastic filament) and resin printers. Self-service after a short induction. Book machine slots via the FabLab portal.\n- **Laser cutting**: Acrylic, wood, cardboard, leather. Induction required. Book time slots.\n- **Electronics**: Soldering stations, oscilloscopes, Arduino/Raspberry Pi kits available for loan\n- **Woodworking & metalworking**: In the adjacent workshop — safety induction required (wear closed-toe shoes)\n- **Vinyl cutting**, electronics design, hand tools: available\n\n**Cost**: Free for SUTD students. You pay for materials (filament is cheap — ~S$1–3 per print).\n\n**First time**: Do the **FabLab induction session** — 1.5h, covers safety and machine basics. Book via FabLab portal or show up during a drop-in session.\n\n**FabLab Community** is also a Fifth Row club — join if you want deeper access and community.",
    "followUps": ["What is the lab safety induction?","What other Makers clubs are there?","Where is Building 2?"],
  },
  {
    "id": "sports-clubs",
    "triggers": [
      "basketball","badminton","climbing","bouldering","sports club","gym","swimming",
      "sports complex","pool","volleyball","frisbee","table tennis","soccer","football",
      "running club","cycling","martial arts","floorball","netball","tennis",
      "sports fifth row","join sports","sutd sports",
    ],
    "response": "**Sports Fifth Row clubs at SUTD:**\n\n- **Badminton**: Most popular sport on campus. Low commitment, casual and competitive sessions. Trials: Tue/Thu evenings.\n- **Basketball**: Recreational + competitive. All skill levels. Trials: Mon/Wed evenings.\n- **Bouldering/Climbing**: Campus bouldering wall open 24h to members. Beginner-friendly. Trials: Week 2, Saturday morning.\n- **Frisbee (Ultimate)**: Relaxed vibe, social sport. Beginner-friendly.\n- **Volleyball, Floorball, Netball, Table Tennis**: All active with regular sessions.\n- **Swimming**: 25m pool at Sports Complex (Building 8). Casual club, lane bookings.\n\n**Sports Complex (Building 8):**\n- **Gym**: Free with student card. Weights, cardio machines. Open daily.\n- **Courts**: Badminton, basketball, squash — book via student portal\n- **25m Pool**: Swimming slots bookable\n\nMost sports clubs have trial sessions — no commitment, just show up in sports clothes.",
    "followUps": ["Where is the Sports Complex?","What other Fifth Row clubs are there?","How do I join a club?"],
  },
  {
    "id": "arts-clubs",
    "triggers": [
      "drama","choir","dance","photography","arts club","performing arts","music",
      "singing","theatre","acting","film","filmmaking","sutd drama","sutd choir",
      "sutd dance","photography society","guitar","band","music club","creative arts",
    ],
    "response": "**Arts cluster Fifth Row clubs:**\n\n- **SUTD Drama**: Comedy sketches to full productions. Genuinely beginner-friendly — no experience needed. Trials: Week 2, Friday 7 PM.\n- **SUTD Choir**: A cappella and choral, relaxed auditions. Just bring your voice. Trials: Week 1, Tuesday 7 PM.\n- **SUTD Dance**: Contemporary and hip-hop. Multiple shows per term. Slightly more competitive. Trials: Week 2, Saturday 2 PM.\n- **Photography Society**: Campus photowalks, workshops, exhibitions. No camera gear required (phone is fine). Ongoing drop-in.\n- **Music / Band**: Jam sessions, performances at campus events. Practice rooms available.\n\n**Arts at SUTD is stronger than you'd expect** — for a tech university, the productions and performances are genuinely impressive. Don't dismiss it.\n\nAll have trial sessions — go even if you've never performed before. Week 0 is the best time to try new things.",
    "followUps": ["What other Fifth Row clubs are there?","What is the Club Fair?","What is Fifth Row?"],
  },
  {
    "id": "community-clubs",
    "triggers": [
      "habitat for humanity","envu","environment","sustainability","entrepreneurship",
      "startup club","volunteer","community service","community club","muslim students",
      "muslim society","religious club","social impact","social entrepreneurship",
      "giving back","community work","csr","ngo","charity club",
    ],
    "response": "**Community cluster Fifth Row clubs:**\n\n- **Habitat for Humanity SUTD**: Build homes with underprivileged communities. Local events + overseas build trips. Trials: Week 1, Saturday morning.\n- **ENVU** (Environment Club): Sustainability, zero-waste, campus garden. Trials: Week 1, Thursday evening.\n- **Entrepreneurship Society**: Pitch nights, startup mentorship, hackathons, iCube connections. Most career-relevant club for aspiring founders. 88+ members, very active. Trials: Week 1, Thursday evening.\n- **Muslim Students' Association (MSA)**: Community events, Ramadan iftars, social and cultural activities for Muslim students.\n- **SUTD Buddhist Society, Christian Students, etc.**: Various faith communities — check the Club Fair.\n\n**iCube connection**: Entrepreneurship Society has direct ties to SUTD's startup incubator — the best entry point if you're interested in startups.",
    "followUps": ["What is iCube?","What other Fifth Row clubs exist?","What is the Club Fair?"],
  },
  {
    "id": "makers-clubs",
    "triggers": [
      "robotics","motorsports","makers club","makers cluster","engineering club",
      "sutd motorsports","cadt","hackathon club","autonomous vehicle","robot",
      "data science club","machine learning club","coding club","hardware club",
      "sutd hackers","hackathon","competition team","competitive programming",
    ],
    "response": "**Makers cluster Fifth Row clubs:**\n\n- **FabLab Community**: Drop-in 3D printing, laser cutting, electronics. Best first stop for any builder — open 24h.\n- **Robotics Club**: Autonomous robots, RoboCon competition, embedded systems. Hardware + software combo. Active weekly sessions.\n- **SUTD Motorsports**: Design and race an electric kart. High commitment but they train you from zero on manufacturing and electronics.\n- **SUTD Hackers**: Organises and participates in local and international hackathons. Mixed skill levels — beginners welcome.\n- **CADT** (Computing & Data Team): Kaggle competitions, data science projects, ML challenges. Popular among ISTD/DAI students.\n\n**All Makers clubs have strong links to the FabLab and iCube.** If you want to build hardware+software together, this is your cluster.",
    "followUps": ["What is the FabLab?","What is iCube?","What is Fifth Row?"],
  },
  {
    "id": "culture-clubs",
    "triggers": [
      "culture cluster","dsia","design society","culture club","tabletop","board games",
      "games club","tea club","cultural fifth row","anime","sutd anime","film club",
      "language club","chinese culture","indian culture","malay culture",
    ],
    "response": "**Culture cluster Fifth Row clubs:**\n\n- **DSIA** (Design & Society in Action): Design research, social design, talks on how technology shapes society. SUTD's most intellectually distinctive club. Strong alumni network in design industry.\n- **Tabletop & Games Club**: Weekly board game sessions, RPG campaigns. Very low commitment, great for unwinding.\n- **Tea Club**: Singapore and Asian tea culture, tastings and sessions. Genuinely relaxing.\n- **Cultural dance/language groups**: Various clubs celebrating different cultural traditions — check the Club Fair for the latest.\n\nCulture clubs are lighter on commitment than Sports or Arts but excellent for meeting people across pillars and years. DSIA especially has strong career value in design-adjacent fields.",
    "followUps": ["What are Arts clubs?","What other Fifth Row clubs are there?","What is Fifth Row?"],
  },

  # ── CAMPUS BUILDINGS ──────────────────────────────────────────────────────
  {
    "id": "campus-buildings",
    "triggers": [
      "building map","campus map","where is building","campus layout","navigate campus",
      "building 1","building 2","building 3","building 4","building 5","building 6",
      "building 8","building 54","campus guide","find building","block 1n","block 1s",
      "all buildings","campus buildings","where is","which building",
    ],
    "response": "**SUTD Campus Buildings Guide:**\n\n- **Building 1** — Main academic building: Lecture theatres LT1–LT4, Student Hub (Level 2), Campus Clinic (Level 1), IT Helpdesk (Level 1), OSA office\n- **Building 2** — Design & making: FabLab (24h), design studios, architecture workshops, iCube startup space (Level 3)\n- **Building 3** — Seminar and tutorial rooms, ASD design studios\n- **Building 4** — Classrooms, research labs, faculty offices\n- **Building 5** — Learning Hub: Library (24h), computer labs, study rooms, Level 3 quiet zone, Level 3 common hangout\n- **Building 6** — Engineering labs (EPD, ESD), machine shop, manufacturing labs\n- **Building 8** — Sports Complex: gym, courts, 25m pool\n- **Block 54** — Wellbeing Centre (Level 2), student activity rooms\n- **Hostel Blocks** — 1N, 1S (Freshmore); 2N, 2S (upper years)\n\nCampus is compact — all buildings are covered walkway-connected. End to end is ~10 minutes.",
    "followUps": ["Where is the FabLab?","Where is the library?","Where is the Wellbeing Centre?"],
  },
  {
    "id": "library",
    "triggers": [
      "library","study room","study space","print","printing","book library",
      "borrow book","library hours","library building 5","study room booking",
      "library catalogue","library search","library resources","level 3","level 3 library",
      "quiet zone","library computer","library print","library wifi",
    ],
    "response": "**SUTD Library — Building 5, open 24h with your student card.**\n\n**Study rooms**: Book via the library portal (library.sutd.edu.sg). Book early — popular time slots (evenings, weekends) fill fast. Some rooms require group booking (3+ people).\n\n**Printing**: Load credit to your student card via the library portal top-up. B&W ~S$0.05/page, colour ~S$0.30. Printers on Level 1 and Level 3.\n\n**Computer labs**: All software pre-installed — Python, MATLAB, Adobe CC, Microsoft 365. Available on all levels.\n\n**Book borrowing**: Search SUTD LibrarySearch catalogue first. Many textbooks are available — check before buying.\n\n**Level 3 quiet zone**: Enforced silence — actually quiet, excellent for exam period deep work.\n\n**Level 3 common area**: Casual study and hangout zone — popular for group work and between-class downtime.",
    "followUps": ["How do I book a study room?","Where are good study spots?","What printing is available?"],
  },
  {
    "id": "study-spots",
    "triggers": [
      "study spot","where to study","study area","best place to study","quiet study",
      "24 hour study","study at night","late night study","study location","where to go study",
      "good wifi study","study outside hostel","change of environment","study cafe",
    ],
    "response": "**Best study spots on campus:**\n\n- **Building 5 Library, Level 3 Quiet Zone**: Enforced silence, best for deep focus. 24h access.\n- **Building 5, Level 3 Common Area**: Good for group work — casual noise level, good wifi, multiple power sockets\n- **FabLab** (Building 2): Open 24h. Great if working on a project with hardware. Background noise from machines.\n- **Campus Bistro area** (off-peak, after 2 PM): Good light, wifi, coffee if you need it\n- **Hostel floor lounge**: Each floor has a common room — great for late-night 10.014 debugging with floor neighbours\n- **Building 1 atrium**: Good for casual work between lectures\n\n**Tip**: Change your environment every 2–3 hours if you're in a long study session. The walk between buildings counts as a mental break.",
    "followUps": ["How do I book a library study room?","Where is the FabLab?","What are quiet hour rules?"],
  },
  {
    "id": "prayer-room",
    "triggers": [
      "prayer room","surau","muslim","prayer","solat","friday prayer","jumaat prayer",
      "ablution","wudu","where to pray","mosque near sutd","qibla","prayer mat",
      "prayer facilities","religious room","meditation room","quiet room","reflection room",
    ],
    "response": "**Prayer facilities at SUTD:**\n\n**On-campus Surau (Prayer Room)**: Building 1, Level 3\n- Separate sections for male and female\n- Wudu (ablution) area nearby\n- Prayer mats provided\n- Open during campus hours\n\n**Friday prayers (Jumaat)**: SUTD generally does not schedule lectures Friday lunchtime to accommodate this.\n- **Nearest mosque**: Masjid Al-Amin (Clementi, 2 MRT stops) — ~20 min by transit\n- **Masjid Al-Muttaqin** (Clementi Ave 2): also nearby\n\n**Non-Muslim quiet/reflection room**: Building 54 has quiet rooms for general reflection or meditation use.\n\nThe Muslim Students' Association (MSA) on Cohortly's Fifth Row tab is also a good community point — they run Ramadan iftars and cultural events.",
    "followUps": ["What food is halal near campus?","What is the Muslim Students' Association?","Where is Building 1?"],
  },

  # ── CAREER & INTERNSHIPS ──────────────────────────────────────────────────
  {
    "id": "internships",
    "triggers": [
      "internship","intern","job","career","work experience","summer internship",
      "when can i intern","oip","office of industry programs","career services",
      "career fair","sutd career","linkedin","resume","cv","job search","job hunting",
      "industry experience","industry attachment","IA","structured internship",
    ],
    "response": "**Internships and careers at SUTD:**\n\n**When you can intern:**\n- **First opportunity**: Summer after Year 1 (May–Aug) — breaks are long enough for 2–3 month internships\n- **Structured internship**: Usually in Year 3, built into the academic calendar (~6 months for most pillars)\n\n**SUTD Career Services — Office of Industry Programs (OIP):**\n- Building 1 — runs career fairs, company talks, mock interviews, resume clinics\n- **SUTD Internship Fair**: October and March — tech companies, consulting, finance, local startups all attend\n- Portal: careers.sutd.edu.sg (SUTD login required)\n\n**For Freshmores — build your profile now:**\n- Get strong at Python (10.014 → personal projects)\n- Start a GitHub portfolio: put your 10.014 lab code there (cleaned up)\n- Join Entrepreneurship Society for startup connections\n- Talk to seniors about their internship experiences via People tab",
    "followUps": ["What is iCube?","How do I build a GitHub portfolio?","What is the Entrepreneurship Society?"],
  },
  {
    "id": "part-time-jobs",
    "triggers": [
      "part time job","part-time","work while studying","earn money","student job",
      "tutor","freelance","campus job","TA","teaching assistant","paid work",
      "can i work","side income","how many hours can i work","work limit student",
      "student pass work","international work","part time work sutd",
    ],
    "response": "**Part-time work at SUTD:**\n\n**Singapore Citizens & PRs**: No legal limit — work as many hours as you can manage. Most students cap at 10–15h/week to avoid burning out.\n\n**International students**: Student's Pass allows **up to 16h/week part-time** during term. Full-time work is allowed during official vacation periods. Check your pass conditions with OSA.\n\n**Good options for SUTD students:**\n- **Tuition**: Strong demand for A-Level and O-Level Maths/Physics/Computing (S$25–50/h). Sign up with tuition agencies or post on tuition platforms.\n- **Teaching Assistant (TA)**: Paid by module — apply through module coordinators or Canvas announcements. Usually available from Year 2.\n- **Research Assistant (RA)**: Some professors post RA positions. Email them directly with your relevant skills.\n- **iCube startup jobs**: Some SUTD-linked startups hire students part-time — check the iCube board or Entrepreneurship Society notice board.\n\n**Advice**: Don't work in Freshmore Term 1. Term 1 is too intensive. Start from Term 2 at the earliest.",
    "followUps": ["What is a Teaching Assistant?","What is iCube?","How much does living cost?"],
  },
  {
    "id": "icube",
    "triggers": [
      "icube","i-cube","startup incubator","entrepreneurship","startup ecosystem",
      "venture","business idea","found a startup","student startup","sutd startup",
      "startup at sutd","incubator","accelerator","startup funding","entrepreneur sutd",
    ],
    "response": "**iCube — SUTD's Startup Incubator (Building 2, Level 3):**\n\niCube is one of Singapore's most active university-linked startup ecosystems.\n\n**What iCube offers:**\n- Co-working space and meeting rooms for student-founded startups\n- Mentorship from entrepreneurs-in-residence and investors\n- Connections to VCs, angel investors, and industry partners\n- Seed funding opportunities and startup competitions\n\n**How to engage as a Freshmore:**\n- **Entrepreneurship Society** (Fifth Row, Community cluster) has direct iCube ties — the fastest path in\n- **SUTD Hackathons**: co-organised with iCube, open to all years. Posted in the Events tab.\n- **iCube open days**: Drop-in afternoons to tour, meet current startup teams, and understand the ecosystem\n\n**Path**: Many SUTD startups (in deeptech, fintech, biotech) started as student projects in Year 2–3 that got into iCube. Building Python/engineering skills in Year 1 is how you get there.",
    "followUps": ["What is the Entrepreneurship Society?","What are internship options?","How do I meet senior students?"],
  },
  {
    "id": "sep-exchange",
    "triggers": [
      "exchange program","exchange programme","SEP","study abroad","partner university",
      "overseas study","student exchange","exchange year","exchange application",
      "mit exchange","eth exchange","tu delft","overseas university","which universities",
      "how to apply exchange","exchange gpa requirement","exchange cost","exchange experience",
    ],
    "response": "**Student Exchange Programme (SEP):**\n\nSUTD has exchange partnerships with 70+ universities — MIT, ETH Zürich, TU Delft, NUS, NTU, KAIST, and more.\n\n**When**: Typically Year 3, Term 1 or 2 — after pillar selection and core module completion.\n\n**Requirements:**\n- Cumulative GPA: typically 3.0/4.0+ (grades from Year 2 onwards count)\n- Statement of Purpose\n- Faculty recommendation\n\n**Application process:**\n- Applications open in **Year 2 Term 2** via OSA Global Programmes office\n- Apply early — popular universities (MIT, ETH) fill fast\n\n**What to expect:**\n- Take equivalent modules that map back to SUTD electives\n- Accommodation via host university dorms\n- Cost is roughly similar to SUTD (varies by country)\n\n**Start researching now**: Talk to seniors who've done exchange via the People tab — their experience is more useful than brochures.",
    "followUps": ["When do letter grades start?","What is pillar selection?","What is Year 2 like?"],
  },
  {
    "id": "urop",
    "triggers": [
      "urop","undergraduate research","research opportunity","research project",
      "work with professor","professor research","lab research","research assistant",
      "research paper","co-author","academic research","research at sutd","sutd research",
      "faculty research","research lab","phd","do research","research experience",
    ],
    "response": "**UROP — Undergraduate Research Opportunities Programme:**\n\nWork on real research with SUTD faculty. Can be paid (~S$10–15/h), credit-bearing, or both.\n\n**When**: Can start from Term 2 Year 1 but most begin in Year 2. Term 1 Year 1 is too full.\n\n**How to get involved:**\n1. Browse SUTD Research page for open positions\n2. Email professors whose work interests you — mention your name, year, relevant modules/skills, and 2–3 lines on why their specific project interests you\n3. Some positions are posted on Canvas and department boards\n\n**What it leads to:**\n- Co-authorship on publications (for significant contributions)\n- Strong PhD recommendation letters\n- Impressive talking point in internship interviews — industry values SUTD research experience\n\n**For ISTD/DAI students**: ML and NLP research projects often take students with strong 10.014 Python foundations.",
    "followUps": ["How do I email a professor?","What is iCube?","What are internship options?"],
  },

  # ── NATIONAL SERVICE ──────────────────────────────────────────────────────
  {
    "id": "national-service",
    "triggers": [
      "NS","national service","NSman","reservist","in-camp training","ICT",
      "disrupted studies","NS deferment","MINDEF","operationally ready","ORD",
      "pre-enlistee","SAF","SPF","SCDF","call-up","NS leave","army sutd",
      "serve NS and study","NS during school","NS obligation",
    ],
    "response": "**National Service (NS) and SUTD:**\n\n**Pre-enlistees (haven't completed NS)**:\nYour deferment letter should be arranged before matriculation. If unsure, contact CMPB directly and copy OSA (osa@sutd.edu.sg).\n\n**Operationally Ready NSmen (reservists)**:\nYou may get ICT call-ups during term. When you receive the call-up order:\n1. Email the professor and module coordinator with the NS order attached\n2. Subject: `NS In-Camp Training Leave – [Module] – [Name]`\n3. Visit Student Hub for the official NS leave form — OSA has a standard process\n\n**SUTD's policy**: NS obligations are recognised and accommodated. Professors are understanding if you communicate immediately when you receive the call-up. Don't wait.\n\n**MINDEF/DSTA scholarship holders**: Your scholarship manager coordinates NS and study schedules — check with your scholarship POC.",
    "followUps": ["How do I email a professor?","What is the excused absence process?","Where is Student Hub?"],
  },

  # ── PEDAGOGY & SUTD CULTURE ───────────────────────────────────────────────
  {
    "id": "teaching-style",
    "triggers": [
      "teaching style","how does sutd teach","project based learning","flipped classroom",
      "design thinking","cohort learning","sutd pedagogy","hands on learning",
      "different from JC","different from poly","different from other universities",
      "cohort based","SUTD different","why SUTD","sutd education approach",
      "lectures at sutd","tutorials at sutd","how class works",
    ],
    "response": "**SUTD's teaching approach is genuinely different from JC/poly/other universities.**\n\n**Flipped classroom**: Pre-recorded lectures or readings before class — class time is discussion, problem-solving, and working through hard concepts together. Skim materials before class, even 5 minutes.\n\n**Project-based learning**: Every module has significant project components. You build and make things, not just do problem sets. The 10.009 2D project is the centrepiece.\n\n**Design thinking**: Embedded throughout — framing problems, ideating, prototyping, testing, iterating. Feels unusual coming from exam-focused education but becomes second nature.\n\n**Cohort identity**: Your Freshmore cohort takes the same 5 modules. This shared struggle is intentional — it builds the community SUTD is known for.\n\n**What this means for you:**\n- Engage during class — participation is often assessed\n- Start projects early — last-minute rushing fails when physical prototypes are involved\n- Office hours and module room Q&A are how top students get better, not private mugging",
    "followUps": ["What are the Freshmore modules?","What is the 2D project?","How do I manage workload?"],
  },

  # ── STUDENT GOVERNMENT ────────────────────────────────────────────────────
  {
    "id": "student-government",
    "triggers": [
      "SGA","student government","student association","student council","student union",
      "student rep","student body","SUTD student association","SSA","student representative",
      "student leadership","campus government","student politics","student affairs",
    ],
    "response": "**SUTD Student Government Association (SGA):**\n\nSGA is the main student representative body — they advocate for students with the administration and organise campus-wide events.\n\n**What SGA does:**\n- Represents student interests at faculty meetings and with the administration\n- Organises orientation, rag & flag, and campus-wide events\n- Manages student welfare funds and club event subsidies\n- Coordinates with Fifth Row clubs on cross-campus activities\n\n**Getting involved:**\n- Run for SGA elections (usually from Year 2 onwards)\n- Volunteer for SGA-run events during Freshmore year — good experience and connections\n- Follow SGA on Instagram or Canvas for open positions\n\nSGA leadership is taken seriously by SUTD's admin and looks strong on resumes. If student leadership interests you, it's worth pursuing.",
    "followUps": ["What is Fifth Row?","How do I get involved on campus?","What is orientation?"],
  },

  # ── YEAR 2+ ───────────────────────────────────────────────────────────────
  {
    "id": "year2-onwards",
    "triggers": [
      "year 2","after freshmore","post freshmore","second year","what happens year 2",
      "year 3","year 4","graduation","capstone project","senior year","upper year",
      "graduation requirements","what do i need to graduate","final year project",
      "FYP","year 4 project","degree requirements","credit hours",
    ],
    "response": "**What comes after Freshmore Year:**\n\n**Year 2 (Terms 4–6)**: Pillar-specific core modules begin. GPA counts from here. More freedom in elective choices. Study groups naturally reorganise around your pillar.\n\n**Year 3 (Terms 7–9)**: Deepening pillar knowledge + optional UROP. The **structured internship** is typically in Year 3 — a 6-month industry attachment built into the academic calendar for most pillars.\n\n**Year 4 (Terms 10–12)**: **Capstone Project** — your major final-year design/engineering project, usually with an industry partner. Plus electives, final core modules, and graduation preparation.\n\n**Graduation requirements** (approximate):\n- All core pillar modules\n- Required number of credit hours including HASS electives\n- Completion of structured internship\n- Satisfactory cumulative GPA\n- Capstone project\n\n**The fast version**: Freshmore = foundation. Year 2+ = specialisation and career launch. Pillar choice matters but doesn't lock your career — SUTD grads work across industries.",
    "followUps": ["What is pillar selection?","What are internship options?","What is UROP?"],
  },

  # ── ABOUT SUTD & COHORTLY ─────────────────────────────────────────────────
  {
    "id": "about-sutd",
    "triggers": [
      "what is sutd","about sutd","sutd overview","sutd university","sutd history",
      "sutd ranking","sutd reputation","sutd mit","sutd unique","sutd founded",
      "sutd size","sutd how big","sutd students","sutd faculty","why sutd",
      "should i go to sutd","sutd vs nus","sutd vs ntu","sutd vs smu",
    ],
    "response": "**SUTD — Singapore University of Technology and Design:**\n\n- Founded in **2012** in collaboration with **MIT and Zhejiang University**\n- ~1,000 undergrads per cohort — deliberately small and tight-knit\n- Mission: integrate technology, design thinking, and engineering\n- Faculty: many MIT-trained, strong research output relative to size\n- **Compulsory Freshmore year**: everyone takes the same modules → strong cohort identity\n- Campus: 8 Dover Road, Dover MRT (Circle Line)\n- 5 undergraduate pillars: ASD, ESD, EPD, ISTD, DAI\n- Graduate school: SUTD also has Masters and PhD programmes\n\n**Differentiators vs NUS/NTU:**\n- Smaller (you'll know your professors by name)\n- Project-based learning from Day 1\n- Design thinking is core, not an elective\n- Industry connections are strong relative to cohort size\n- Campus culture is known for being unusually tight-knit",
    "followUps": ["What are the 5 pillars?","What is the Freshmore year?","Where is SUTD?"],
  },
  {
    "id": "about-cohortly",
    "triggers": [
      "what is cohortly","about cohortly","cohortly features","what can cohortly do",
      "explain cohortly","cohortly app","how does cohortly work","cohortly platform",
      "cohortly help","cohortly guide","verified network","student network",
    ],
    "response": "**Cohortly** is SUTD's verified student network — built for Freshmore belonging.\n\n**Key features:**\n- **Launchpad**: 8-phase guided Freshmore checklist (pre-arrival → mentorship)\n- **People**: Connect with students, senior mentors, and floor neighbours. The Aura system shows match quality (Legendary ✦ / Rare ◆ / High ◈ / Good ● / Rising ○)\n- **Events**: Browse and RSVP to campus events; create your own (admin approval required)\n- **Fifth Row**: Browse 80+ clubs, track interest, filter by cluster and commitment level\n- **Classes**: Module Q&A rooms — senior mentors claim and answer questions\n- **Knowledge Base**: Searchable articles on everything SUTD\n- **Messages**: 1-on-1 and group threads\n- **Hostel tab**: Active meal jios and floor neighbours\n- **Weekly Pulse**: Anonymous wellbeing check-in\n- **Cohortly AI** (that's me): Ask anything, any time\n\nAll profiles are verified against SUTD email — everyone you see is real.",
    "followUps": ["How do I use the Launchpad?","How do I find a mentor?","What are the module rooms?"],
  },
  {
    "id": "mentors",
    "triggers": [
      "mentor","senior mentor","find mentor","get a mentor","aarav","sara halim",
      "wei jian","mentor profile","connect mentor","mentor match","senior student",
      "how to get a mentor","need a mentor","mentorship sutd","senior help",
    ],
    "response": "**Senior mentors on Cohortly:**\n\n- **Aarav Menon** (Y3 ISTD, ✦ Legendary): Active in 10.014, 50.007, 10.009. Runs weekly Tuesday coding prep sessions. Best for Python debugging, recursion, ML.\n- **Sara Binte Halim** (Y2 DAI, ◆ Rare): Active in 10.014 and 10.009. Weekday evenings.\n- **Wei Jian Lim** (Y3 ISTD, ◈ High): Active in 10.014, 10.009, 50.007. Sunday study sessions.\n\n**How to connect**: People tab → Senior Mentors → click their profile card → Request intro.\n\nYou can also post in their module room on the Classes tab — they monitor it and often reply faster than DMs.\n\nMentor availability is tracked by their Aura score — Legendary mentors are most actively engaged.",
    "followUps": ["How do I use module rooms?","What events do mentors run?","How does the Aura system work?"],
  },

  # ── CHITCHAT ──────────────────────────────────────────────────────────────
  {
    "id": "chitchat-greeting",
    "triggers": [
      "hello","hi","hey","hiya","yo","sup","good morning","good afternoon","good evening",
      "howdy","what's up","whats up","helo","hii","hihi","heya",
    ],
    "response": "Hey! Welcome to Cohortly AI — I know everything about SUTD and this app.\n\nAsk me about modules, hostel, admin setup, Fifth Row clubs, mental health support, internships, making friends — anything about starting at SUTD or navigating university life here.",
    "followUps": ["What modules do I take?","What should I pack for hostel?","What is Fifth Row?","How does Pass/Fail work?"],
  },
  {
    "id": "chitchat-thanks",
    "triggers": [
      "thank you","thanks","thank u","tq","ty","thx","appreciate it","helpful","that helps",
      "nice","great","awesome","good bot","good ai","you're helpful","ur helpful",
    ],
    "response": "Anytime! That's exactly what I'm here for.\n\nIf anything else comes up — modules, hostel, admin, friends, mental health, Fifth Row — just ask. Good luck with Freshmore! 🎓",
    "followUps": ["What is the Launchpad?","How do I find my mentor?","What is Fifth Row?"],
  },
  {
    "id": "chitchat-what-are-you",
    "triggers": [
      "what are you","who are you","are you real","are you an ai","who made you",
      "how do you work","what can you do","how smart are you","are you chatgpt",
      "what is cohortly ai","cohortly ai","explain yourself","what model",
    ],
    "response": "I'm **Cohortly AI** — built directly into this app to help SUTD Freshmores navigate university life.\n\nI run completely offline — no external AI API, no data leaving your device. I use a semantic search engine trained on a comprehensive SUTD knowledge base: every module, hostel detail, admin process, Fifth Row club, career path, wellbeing resource, and campus building.\n\nI know everything about SUTD. Ask me anything.",
    "followUps": ["What is Cohortly?","What modules will I take?","What is Fifth Row?"],
  },

  # ── LAPTOP & TECH RECOMMENDATIONS ─────────────────────────────────────────
  {
    "id": "laptop-recommendations",
    "triggers": [
      "laptop","what laptop","which laptop","laptop recommendation","macbook","windows laptop",
      "buy laptop","best laptop sutd","laptop for sutd","laptop for engineering",
      "mac or windows","macbook air","macbook pro","dell xps","thinkpad","asus",
      "what computer","computer recommendation","do i need a laptop","laptop specs",
      "laptop storage","ram for sutd","laptop for coding","programming laptop",
    ],
    "response": "**Laptop recommendations for SUTD:**\n\n**Most popular among SUTD students:**\n- **MacBook Air M2/M3** (13\" or 15\"): Best battery life, runs Python/Jupyter fast, lightweight. Most ASD and DAI students use this. ~S$1,500–2,200\n- **MacBook Pro M3** (14\"): For EPD/ISTD students who run heavy simulations or need more GPU. ~S$2,500+\n- **Dell XPS 13/15** or **ASUS Zenbook**: Good Windows alternatives, strong build quality. ~S$1,200–2,000\n- **Lenovo ThinkPad X1 Carbon**: Reliable Windows option, excellent keyboard. ~S$1,800–2,200\n\n**Minimum specs for SUTD:**\n- 16GB RAM (8GB will struggle with Jupyter + Chrome + Zoom simultaneously)\n- 256GB SSD (512GB preferred — project files add up)\n- Any modern processor (M-series Apple or Intel/AMD 12th gen+)\n\n**Practical tips:**\n- Lab machines in Building 5 have everything pre-installed — you don't need a monster laptop\n- Buy from the Apple Education Store or Challenger/Courts with student ID for discounts (~S$100–200 off)\n- **AppleCare** is worth it for a 4-year degree\n- Get a **USB-C hub** — most modern laptops have few ports and you'll need HDMI + USB-A for presentations",
    "followUps": ["What free software do I get at SUTD?","Where are the lab computers?","How do I set up Python?"],
  },

  # ── HASS ELECTIVES ────────────────────────────────────────────────────────
  {
    "id": "hass-electives",
    "triggers": [
      "hass","humanities","arts social sciences","hass elective","social science module",
      "humanities module","elective module","free elective","hass module","choose elective",
      "humanities arts","language module","what electives","optional module","hass requirement",
      "hass credit","communication module","writing module","philosophy module",
      "economics module","psychology module","history module","language class",
      "japanese","mandarin","french","german","sutd language",
    ],
    "response": "**HASS — Humanities, Arts & Social Sciences at SUTD:**\n\nHASS modules are built into every year of your degree. They broaden your perspective beyond pure engineering and are taken alongside your technical core modules.\n\n**HASS elective types:**\n- **Language modules**: Japanese, Mandarin, French, German, Korean — popular and practically useful\n- **Writing & Communication**: Technical writing, academic writing, presentation skills (very useful for industry)\n- **Social sciences**: Economics, Psychology, Sociology — how systems and people work\n- **Philosophy & Ethics**: Technology ethics, design ethics — increasingly important in tech careers\n- **Arts**: Visual communication, design history, music\n\n**How to choose:**\n- Language modules fill up fast — register early via the HASS module selection portal on Canvas\n- Communication/writing modules are underrated — they directly improve your project reports and job applications\n- Check which HASS modules count toward your pillar's graduation requirements\n\n**Credit requirements**: Usually 2–3 HASS modules per year across your degree. Check your pillar's specific graduation audit on the Registrar's portal.",
    "followUps": ["What are the graduation requirements?","What is pillar selection?","How do I register for modules?"],
  },

  # ── GPA & ACADEMIC STANDING (YEAR 2+) ─────────────────────────────────────
  {
    "id": "gpa-calculation",
    "triggers": [
      "gpa calculation","how is gpa calculated","gpa formula","grade points","A grade points",
      "B grade points","cumulative gpa","cgpa","semester gpa","sgpa","weighted gpa",
      "4.0 scale","5.0 scale","grade scale","what gpa is good","minimum gpa",
      "gpa for scholarship","gpa for exchange","maintain gpa","improve gpa","low gpa",
      "grade a plus","grade a","grade b plus","grade b","grade c plus","grade c","grade d",
    ],
    "response": "**GPA at SUTD (from Year 2 onwards):**\n\n**Grade scale (5.0 system):**\n| Grade | Points | Typical % range |\n|---|---|---|\n| A+ | 5.0 | Top ~5% of cohort |\n| A | 5.0 | ~75%+ |\n| A- | 4.5 | ~70–74% |\n| B+ | 4.0 | ~65–69% |\n| B | 3.5 | ~60–64% |\n| B- | 3.0 | ~55–59% |\n| C+ | 2.5 | ~50–54% |\n| C | 2.0 | ~45–49% |\n| D+ | 1.5 | ~40–44% |\n| D | 1.0 | ~35–39% |\n| F | 0.0 | Below 35% |\n\n**Cumulative GPA (CGPA)** = weighted average across all letter-graded modules (credit-hours × grade points / total credit hours)\n\n**Benchmarks:**\n- **4.0+**: Excellent — scholarship eligibility, Dean's List consideration\n- **3.5+**: Strong — good for exchange applications and competitive internships\n- **3.0+**: Satisfactory — SEP exchange minimum, most graduate school requirements\n- **Below 2.0**: Academic probation risk\n\nFreshmore (Year 1) is Pass/Fail and does NOT count toward your CGPA.",
    "followUps": ["What is Pass/Fail grading?","How do I apply for exchange?","What are scholarships?"],
  },

  # ── LEAVE OF ABSENCE & WITHDRAWAL ─────────────────────────────────────────
  {
    "id": "leave-of-absence",
    "triggers": [
      "leave of absence","LOA","take a break","defer studies","gap year","pause studies",
      "take semester off","medical leave of absence","mental health leave","withdrawal",
      "withdraw from sutd","drop out","transfer university","leave sutd",
      "suspend studies","academic suspension","take time off","study break",
    ],
    "response": "**Leave of Absence (LOA) at SUTD:**\n\nYou can apply for a LOA — typically for medical, personal, or family reasons.\n\n**Medical LOA**: Supported by medical documentation. Your place is held and you return after recovery. OSA works with you on a re-entry plan.\n\n**Personal/other LOA**: Case-by-case. Examples: family emergency, mental health, financial hardship, pursuing a significant external opportunity.\n\n**How to apply:**\n1. Make an appointment with OSA (Building 1, Level 2)\n2. Discuss your situation and timeline\n3. Submit the LOA application form with supporting documentation\n4. Faculty advisor endorsement usually required\n\n**Important to know:**\n- Hostel spot may not be held during LOA — confirm with Housing\n- Scholarship conditions vary — check with your scholarship manager before applying\n- International students: LOA may affect your Student's Pass — check with OSA and ICA\n- You can usually return within 1–2 years\n\n**Withdrawal**: Permanent exit. Very rare. OSA will always try to find alternatives (LOA, reduced load) before withdrawal becomes the outcome. If you're considering this, please talk to the Wellbeing Centre first.",
    "followUps": ["Where is the Wellbeing Centre?","What is OSA?","International students and pass conditions?"],
  },

  # ── MODULE WAIVER / ADVANCED STANDING ─────────────────────────────────────
  {
    "id": "module-waiver",
    "triggers": [
      "module waiver","module exemption","advanced standing","polytechnic diploma",
      "poly diploma","credit transfer","exempt module","waive module","prior learning",
      "ap credit","a level exemption","diploma holder","poly to sutd","ite to sutd",
      "skip module","bypass module","transfer credit","recognition prior learning",
    ],
    "response": "**Module waivers and advanced standing at SUTD:**\n\n**Who can apply:**\n- Students with a polytechnic diploma, ITE cert, A-Level distinctions, or relevant prior qualifications\n- International students with equivalent credentials\n\n**What can be waived:**\n- Typically HASS electives or some foundational modules — not the core Freshmore technical modules (10.001–10.014)\n- Each waiver is assessed individually by the relevant faculty\n\n**How to apply:**\n1. Email the module coordinator or your faculty advisor with your transcript/certificate\n2. May need to sit a placement test or submit a portfolio\n3. Apply **before or during the first week** of the module — not after\n\n**Reality check**: Most Freshmore core modules (10.001, 10.002, 10.003, 10.009, 10.014) are NOT waivable regardless of prior experience — SUTD's versions are taught differently and the cohort experience is intentional.\n\n**Contact**: Registrar's Office (Building 1) or your faculty advisor for assessment.",
    "followUps": ["What are the Freshmore modules?","What is HASS?","How do I contact the Registrar?"],
  },

  # ── ACADEMIC APPEAL ───────────────────────────────────────────────────────
  {
    "id": "academic-appeal",
    "triggers": [
      "appeal grade","grade appeal","appeal result","contest grade","dispute grade",
      "unfair grade","wrong grade","appeal process","re-marking","re-grade",
      "exam re-check","appeal exam","appeal assignment","appeal final grade",
      "academic appeal","how to appeal","appeal module result",
    ],
    "response": "**Appealing a grade at SUTD:**\n\n**Step 1 — Talk to the prof first** (always): Email or visit office hours and ask for clarification on the grade. Say: \"Could I understand how my submission was assessed?\" Most issues resolve here.\n\n**Step 2 — Formal appeal** (if still unresolved):\n- Submit a written Grade Appeal form to the module coordinator within **2 weeks of grade release** (exact deadline varies — check Canvas)\n- Clearly state what you're disputing and why (cite the rubric, specific feedback, or marking error)\n- Attach your original submission and any relevant communications\n- Appeals based on \"I worked hard\" are not accepted — you need to demonstrate a marking error or rubric misapplication\n\n**Step 3 — Escalation**: If the module coordinator response is unsatisfactory, escalate to the pillar head or the Academic Appeals Committee.\n\n**Timeline**: Formal appeals typically take 2–4 weeks.\n\n**Note**: Appeals rarely change grades significantly — they're most effective when there's a clear marking error (wrong question marked, rubric misread).",
    "followUps": ["How do I email a professor?","What happens if I fail a module?","What is the Registrar's Office?"],
  },

  # ── HOSTEL ROOM DETAILS ────────────────────────────────────────────────────
  {
    "id": "hostel-room-details",
    "triggers": [
      "hostel room size","room facilities","what is in my room","hostel room features",
      "air conditioning","aircon hostel","ac hostel","hostel bed size","single bed",
      "room window","room desk","wardrobe hostel","bathroom shared","toilet shared",
      "en suite","hostel bathroom","room amenities","what does my room have","hot water",
      "water heater","shower hostel","how big is the room","hostel room sqm",
    ],
    "response": "**SUTD hostel room details:**\n\n**Room size**: Approximately 12–15 sqm — compact but functional. Single occupancy (your own room).\n\n**What's in the room:**\n- Single bed (approx 90×190cm) with mattress — bring your own sheets\n- Study desk + chair\n- Wardrobe/closet\n- Small bookshelf\n- Air conditioning unit (individual control — you set your own temperature)\n- Window with natural light\n- Power sockets (SG 3-pin type G)\n- Mirror\n\n**Bathrooms**: Shared on the floor (typically 1 bathroom per 3–4 students). Shower + toilet. Hot water available.\n\n**Air conditioning**: Each room has its own AC unit with a remote. Set it however you like. Some students sleep at 25°C; some at 16°C. Utility costs are bundled into your hostel fee — no extra charge for AC usage.\n\n**Internet**: eduroam WiFi in every room. Speed is generally good (50–100+ Mbps), though peak hours (9–11 PM) can slow down.",
    "followUps": ["What should I pack?","What are hostel rules?","How does laundry work?"],
  },

  # ── HOSTEL ROOM CHANGE ─────────────────────────────────────────────────────
  {
    "id": "hostel-room-change",
    "triggers": [
      "room change","change room","swap room","different room","room transfer",
      "move to different room","change block","noisy neighbour","bad neighbour",
      "hostel room issue","room problem","room too small","room complaint",
      "room maintenance","broken room","hostel maintenance","repair hostel",
      "aircon not working","hostel repair","pest","bedbugs","cockroach","ants hostel",
    ],
    "response": "**Hostel room change and maintenance:**\n\n**Requesting a room change:**\n- Room changes are possible but not guaranteed — subject to availability\n- Submit a request via the **SUTD Housing portal** or walk into the Housing office (Building 1)\n- Common valid reasons: serious noise issues, health concerns, room defects\n- You typically can't change rooms just for preference (e.g., wanting a higher floor)\n\n**Maintenance and repairs:**\n- Submit via the **campus e-Service portal** (search \"facility request\" on the SUTD website)\n- Or email housing@sutd.edu.sg with a description and photo\n- Response time: 1–3 business days for non-urgent; urgent issues (no AC, water leak) same day\n\n**AC not working**: Log a request AND tell your RA immediately — this is treated as urgent.\n\n**Pests (cockroaches, ants, bed bugs)**: Report to Housing immediately. Pest control comes within 24–48h. Don't try to handle it yourself — the solution can damage your belongings.",
    "followUps": ["Who is my RA?","What are hostel rules?","Where is the Housing office?"],
  },

  # ── HOSTEL SMOKING & ALCOHOL POLICY ───────────────────────────────────────
  {
    "id": "hostel-smoking-alcohol",
    "triggers": [
      "smoking","cigarette","vape","e-cigarette","smoke campus","where to smoke",
      "smoking area","smoking zone","can i smoke","alcohol hostel","drinking hostel",
      "beer hostel","wine hostel","can i drink","alcohol rules","drinking rules",
      "alcohol on campus","sutd alcohol policy","party hostel","noise complaint",
      "drugs sutd","weed sutd","cannabis sutd",
    ],
    "response": "**Smoking and alcohol at SUTD:**\n\n**Smoking:**\n- Smoking (including vaping/e-cigarettes) is **prohibited in all campus buildings and hostels**\n- Designated outdoor smoking areas exist on campus — look for the marked zones near the campus perimeter\n- Smoking in non-designated areas can result in a campus fine\n- Singapore law: smoking is banned in all air-conditioned spaces and many public areas\n\n**Alcohol:**\n- Alcohol is **permitted in hostel rooms** for students aged 18+ (Singapore's legal drinking age)\n- You cannot drink in common areas (lounges, corridors) or make excessive noise\n- Alcohol must not be supplied to underage students\n- Being drunk and disruptive in the hostel is a disciplinary matter\n\n**Drugs:**\n- Zero tolerance. Singapore has extremely strict drug laws — mandatory minimum sentences apply. This is not a grey area.\n\n**Parties:**\n- Hostel rooms are too small and walls too thin for parties. Common areas require Housing office approval for events. Most social gatherings happen in the lounge with proper noise management.",
    "followUps": ["What are hostel rules?","What are quiet hours?","What is the hostel conduct policy?"],
  },

  # ── STUDENT ID PHOTO ───────────────────────────────────────────────────────
  {
    "id": "student-id-photo",
    "triggers": [
      "student id photo","id photo","passport photo","where to take photo",
      "photo for student card","student card photo","id card photo","photobooth",
      "neoprint","where to print photo","passport size photo","take id photo",
      "student photo sutd","sutd id photo submission",
    ],
    "response": "**Getting your student ID photo:**\n\n**What SUTD requires**: A recent passport-size photo (35mm × 45mm, white background, face clearly visible, no spectacles for biometric purposes).\n\n**Where to get one near campus:**\n- **Photobooth at Clementi MRT** (2 stops from Dover): automated photo booth, ~S$8–10 for 4–6 prints\n- **Popular Photo at Clementi Mall**: professional photos, ~S$10–15\n- **Any major MRT station** has photobooth machines (look for the orange/blue booths)\n- **7-Eleven** (some outlets): passport photo printing service\n\n**Digital submission**: Some SUTD admin processes accept a digital photo — take a photo against a white wall in good natural lighting with your phone; crop to passport size using any free tool.\n\n**Tip**: Get 6 copies printed at once. You'll need them for: student card, bank accounts, ICA registration (international students), and various admin forms throughout your degree.",
    "followUps": ["Where is the Student Hub?","How do I collect my student card?","What do I need for ICA registration?"],
  },

  # ── APPS TO DOWNLOAD ──────────────────────────────────────────────────────
  {
    "id": "apps-to-download",
    "triggers": [
      "apps to download","what apps","useful apps","must have apps","apps singapore",
      "download app","essential apps","apps for students","apps for sutd","phone apps",
      "sg apps","singapore apps","apps freshmore","recommended apps",
      "which app","good apps","app recommendation","download what",
    ],
    "response": "**Apps every SUTD student should download:**\n\n**Must-haves (Day 1):**\n- **Singpass** — national digital ID, needed for almost everything\n- **Google Maps** or **Citymapper** — Singapore transit navigation\n- **SimplyGo** or your bank's app — track EZ-Link balance\n- **MyTransport.SG** — real-time bus arrival\n- **Grab** — transport + food delivery\n- **PayNow** (via your bank app) — instant money transfers, used for everything\n\n**Campus & Study:**\n- **Canvas** (SUTD's LMS) — mobile app for announcements and deadlines\n- **Microsoft Outlook** — SUTD email on mobile\n- **Microsoft Teams** — group projects and prof communication\n- **Notion** or **Obsidian** — note-taking and organisation\n- **GitHub Mobile** — monitor your code repos\n\n**Food & Lifestyle:**\n- **Foodpanda** or **GrabFood** — delivery (use sparingly, fees add up)\n- **Shopee** or **Lazada** — online shopping\n- **Carousell** — second-hand textbooks and furniture\n- **Doctor Anywhere** or **MyDoc** — telemedicine, e-MC\n\n**Finance:**\n- Your bank's app (DBS/POSB/OCBC)\n- **Seedly** or **Spendee** — student budget tracking",
    "followUps": ["What is Singpass?","How do I get an EZ-Link card?","What is PayNow?"],
  },

  # ── TELEGRAM & SOCIAL MEDIA GROUPS ────────────────────────────────────────
  {
    "id": "telegram-groups",
    "triggers": [
      "telegram group","whatsapp group","discord sutd","sutd telegram","sutd whatsapp",
      "student group chat","cohort chat","freshmore group","module group chat",
      "where to find group chat","sutd reddit","sutd social media","sutd instagram",
      "student communication","sutd group","official group","class group chat",
      "how to join group","sutd community online",
    ],
    "response": "**SUTD student communication channels:**\n\n**Official channels:**\n- **Canvas announcements** — all official module and OSA communications\n- **SUTD Email** — formal comms from admin, profs, OSA\n\n**Student-run (you'll get added by peers):**\n- **Telegram**: Your Freshmore cohort will have a class Telegram group — OGLs (orientation leaders) share the link during Week 0. There are also module-specific groups (10.014, 10.009, etc.) and block/floor groups for your hostel.\n- **WhatsApp**: Floor and block hostel groups are usually on WhatsApp\n- **Instagram**: SUTD's official @sutd_sg. Each club has its own account. SGA also posts events.\n\n**Finding groups:**\n- Your OGL or Resident Advisor will add you to the main Freshmore cohort group during orientation\n- Module groups are shared by classmates in the first lecture — just ask in class\n- Fifth Row clubs share their group chats during trial sessions\n\n**Reddit**: r/SUTD — small but useful for candid discussions about modules, life, and tips seniors won't say publicly.",
    "followUps": ["What is the orientation camp?","How do I make friends?","What is Fifth Row?"],
  },

  # ── EVENING ACTIVITIES & NIGHTLIFE ─────────────────────────────────────────
  {
    "id": "evening-activities",
    "triggers": [
      "what to do evening","night activities","night life","evening near sutd",
      "bored at night","what to do tonight","after studying","unwind","relax evening",
      "things to do at night","late night activities","bars near sutd","nightclub",
      "pub near sutd","night out","friday night","saturday night","night food",
      "what to do after 10pm","night sutd","entertainment evening",
    ],
    "response": "**Evening and night activities near SUTD:**\n\n**On campus (anytime):**\n- FabLab (Building 2) — build something, 24h\n- Library Level 3 quiet zone — deep work, 24h\n- Bouldering wall — if you're a Climbing Club member\n- Floor lounge hangouts — the spontaneous ones are usually the best\n\n**Near campus:**\n- **Holland Village** (1 MRT stop): great bar street, casual restaurants, cafe culture. Rochester Park nearby for cocktails.\n- **One-North** area (1 stop other direction): quieter, some rooftop bars\n- **Buona Vista / Star Vista**: cinema (Golden Village), food, shopping until 10 PM\n- **Orchard Road** (20 min by MRT): bars, clubs, cinemas, 24h food at Cuppage Plaza\n\n**Budget evening options:**\n- Supper runs to McDonald's Dover (12 min walk, 24h)\n- Bubble tea runs — Gong Cha and Koi are near Clementi MRT\n- Convenience store snacks + Netflix/gaming in the lounge with floor friends\n\n**Night markets / weekend events**: Bazaars and pop-up markets happen monthly around Singapore — check Telegram event channels or Eventbrite.",
    "followUps": ["What is near campus?","What food is available late night?","How do I get around at night?"],
  },

  # ── HEALTH INSURANCE ──────────────────────────────────────────────────────
  {
    "id": "health-insurance",
    "triggers": [
      "health insurance","medical insurance","insurance sutd","medishield","hospitalization",
      "hospitalisation","hospital insurance","student insurance","accident insurance",
      "coverage hospital","insurance plan student","medical coverage","dental insurance",
      "sutd insurance","group insurance","insurance for international","insurance singapore",
    ],
    "response": "**Health insurance at SUTD:**\n\n**SUTD Group Insurance (all students):**\nAll enrolled SUTD students are covered by a **SUTD Group Personal Accident and Hospitalisation Insurance** plan. This provides:\n- Inpatient hospitalisation coverage\n- Personal accident (injuries on and off campus)\n- Emergency medical evacuation (for international students)\n\nCoverage details are in the welcome package or the SUTD student portal — check your benefits.\n\n**Singapore Citizens/PRs — MediShield Life:**\nYou're automatically covered by MediShield Life (national health insurance). This covers inpatient hospital bills at subsidised rates. Polyclinic visits are also heavily subsidised.\n\n**International students:**\n- The SUTD group plan is your primary insurance\n- Some students buy supplementary travel/health insurance (AXA, NTUC Income, etc.) for broader coverage\n- Check if your parents' home country insurance extends to Singapore studies\n\n**Practical note**: Campus clinic and polyclinic visits for minor illness are inexpensive even without insurance (S$10–25). Insurance mainly matters for hospitalisation.",
    "followUps": ["Where is the campus clinic?","What healthcare is available?","International student admin?"],
  },

  # ── DENTAL & PERSONAL CARE ────────────────────────────────────────────────
  {
    "id": "dental-personal-care",
    "triggers": [
      "dental","dentist","teeth","tooth","dental near sutd","dental clinic",
      "haircut","barber","hair salon","cut hair","where to cut hair","hair near campus",
      "optician","glasses","contact lens","eye check","eye test","spectacles",
      "dry cleaning","tailor","mend clothes","laundromat","dry clean",
      "pharmacy near","guardian","watson","watsons near","medicine",
    ],
    "response": "**Personal care near SUTD:**\n\n**Dental clinics:**\n- **Clementi Dental Centre** (Clementi MRT, 2 stops): affordable, ~S$50–100 for basic cleaning\n- **National Dental Centre** (Outram Park MRT): specialist referrals\n- Singapore Citizens/PRs: Medisave can be used for dental procedures at registered clinics\n\n**Hair salons / barbers:**\n- **Clementi Mall** (2 stops): multiple salons at all price points (~S$15–50 for cuts)\n- **Holland Village** (1 stop): trendier salons\n- Quick cuts: EC House or QB House (chain, ~S$13–16, fast and reliable) at most malls\n\n**Optician (glasses, contacts):**\n- **Clementi Mall**: Paris Miki, Nanyang Optical — student discounts available with SUTD card\n- Bring your prescription from home if possible to save on eye tests\n\n**Pharmacy:**\n- Guardian (Clementi Mall), Watsons (Clementi Mall)\n- Campus Cheers/7-Eleven: Panadol, plasters, basic OTC meds\n\n**Dry cleaning / tailoring:**\n- Clementi town has a few dry cleaners (look around the hawker centre area)",
    "followUps": ["What amenities are near campus?","How do I get to Clementi?","What healthcare is available?"],
  },

  # ── PRINTING SETUP & QUOTA ────────────────────────────────────────────────
  {
    "id": "printing",
    "triggers": [
      "printing","print","printer","how to print","campus printer","library printer",
      "printing cost","print quota","free printing","black and white print",
      "colour print","color print","printing credit","scan document","scan sutd",
      "photocopy","copy document","a4 print","a3 print","how much to print",
    ],
    "response": "**Printing at SUTD:**\n\n**Where**: Library (Building 5) — printers on Level 1 and Level 3. Also in some computer labs.\n\n**Cost:**\n- B&W: ~S$0.05/page\n- Colour: ~S$0.30/page\n- Top up via the **campus print portal** (link on the SUTD IT page) — credit is loaded to your student account\n\n**Initial credit**: New students get a small free print credit each term (~S$2–5 — check the IT portal for your balance).\n\n**How to print:**\n1. Send document to the print queue via the campus print portal (accessible from any campus computer or via VPN on your laptop)\n2. Walk to any campus printer\n3. Tap your student card on the printer → select your job → print\n\n**Scanning**: All campus printers also scan. Scan to email (your SUTD email) for free.\n\n**Tip**: PDFs of most textbooks and readings are on Canvas or the library e-resources — print only what you actually need to annotate.",
    "followUps": ["Where is the library?","How do I use my SUTD email?","What is the SUTD VPN for?"],
  },

  # ── CYCLING TO CAMPUS ─────────────────────────────────────────────────────
  {
    "id": "cycling",
    "triggers": [
      "cycling","cycle to sutd","bicycle","bike","cycle to school","ride bike",
      "bike storage","bicycle storage","bring bike","cycle from mrt","bike lane",
      "bike path","cycling to campus","bicycle sutd","cycling route",
      "lime bike","mobike","sg bike","bicycle rental","bike share",
    ],
    "response": "**Cycling to and around SUTD:**\n\n**Cycling to campus:**\n- SUTD is accessible via cycling paths from Dover MRT area\n- The campus is connected to the Park Connector Network (PCN) — scenic routes from Queenstown, Buona Vista, and one-north\n- Google Maps has a cycling mode for Singapore — use it to find safe routes\n\n**Bike storage on campus:**\n- Bicycle racks at the main campus entrance and near the hostels\n- Register your bicycle with Campus Services (sticker on the bike) — unregistered bikes may be removed\n- Lock properly with a D-lock (U-lock) — bicycle theft does happen\n\n**Bringing your bike:**\n- Can bring from home during move-in; fits in the goods lift for hostel access\n- Store in the hostel bicycle bay (ground floor, near the entrance)\n\n**Bike sharing:**\n- **Anywheel**, **SG Bike** and **Neuron** docked/dockless bikes are available around Dover MRT area\n- ~S$0.50–1.00 per 15 min; useful for one-way trips to Clementi or Holland Village",
    "followUps": ["How do I get to SUTD?","What is near campus?","How do I get around Singapore?"],
  },

  # ── GYM & SPORTS COMPLEX HOURS ────────────────────────────────────────────
  {
    "id": "gym-hours",
    "triggers": [
      "gym hours","gym timing","gym open","when is gym open","gym sutd","gym building 8",
      "sports complex hours","pool hours","swimming pool timing","pool open",
      "court booking","badminton court booking","basketball court booking",
      "gym facilities","gym equipment","weights gym","treadmill sutd","gym membership",
      "sutd gym","squash court","how to book court","sports facility",
    ],
    "response": "**Sports Complex (Building 8) — facilities and hours:**\n\n**Gym:**\n- Hours: Mon–Fri 7 AM – 10 PM, Sat–Sun 8 AM – 9 PM (verify on Canvas/housing notices as hours can vary)\n- Equipment: free weights, dumbbells, barbells, squat racks, treadmills, stationary bikes, rowing machines\n- **Free for SUTD students** with student card — just tap in\n- Personal lockers available (bring your own lock or use day-use lockers)\n\n**Swimming pool (25m):**\n- Lap swimming in designated time slots — check the Sports Complex booking portal for lane bookings\n- Recreational swim: open swim times are available\n\n**Courts (badminton, basketball, squash):**\n- Book online via the student portal 1–3 days in advance\n- Some courts have drop-in slots if a booking is cancelled\n- Badminton feathers/shuttles can be purchased from campus sports shop\n\n**Pro tip**: 7–8 AM weekday gym slots are almost always free. Post-lecture evenings (6–8 PM) are busiest.",
    "followUps": ["What sports clubs are there?","Where is Building 8?","How do I join a sports club?"],
  },

  # ── LOST AND FOUND ────────────────────────────────────────────────────────
  {
    "id": "lost-and-found",
    "triggers": [
      "lost and found","lost item","found item","lost phone","lost wallet","lost laptop",
      "lost bag","lost keys","lost card","lost earphones","lost something","find lost item",
      "campus lost property","lost property sutd","report lost item","left behind",
      "forgot something","where to report lost","lost something campus",
    ],
    "response": "**Lost and found at SUTD:**\n\n**Where to check:**\n- **Campus Security desk** (main entrance, Building 1 area): all found items are logged and kept here. Visit in person with your student card or call SUTD Security: 6303-6002.\n- **Library (Building 5) Level 1**: items found in study rooms or computer labs are taken to the library counter\n- **FabLab front desk** (Building 2): items left in FabLab\n- **Sports Complex reception** (Building 8): items left in gym or courts\n\n**Steps to take:**\n1. Go to Security first — they have a log of all found items\n2. Check the floor/area where you last had the item\n3. For lost phones: try Find My iPhone or Google Find My Device immediately while you still have another device\n4. For lost student cards: report to Student Hub (Building 1, Level 2) immediately — your card will be deactivated and a replacement issued\n\n**Tip**: Write your name and phone number on your laptop, power bank, and charger with a label — it dramatically increases return rates.",
    "followUps": ["How do I replace my student card?","Where is campus security?","Where is Student Hub?"],
  },

  # ── LOCKERS ───────────────────────────────────────────────────────────────
  {
    "id": "lockers",
    "triggers": [
      "locker","lockers","campus locker","study locker","store stuff campus",
      "day locker","storage locker","locker room","gym locker","book locker",
      "where to store bag","leave bag campus","luggage storage campus",
      "store luggage break","where to keep things","locker booking",
    ],
    "response": "**Lockers at SUTD:**\n\n**Library lockers (Building 5):**\n- Day-use lockers available on Level 1 and Level 3\n- Bring your own combination lock (sold at Cheers, Daiso near campus)\n- First-come-first-served, must be cleared by closing time\n\n**Gym lockers (Building 8):**\n- Day-use lockers in the changing rooms — bring your own padlock\n- Do NOT leave items overnight — they'll be removed\n\n**Hostel room:**\n- Your room is your main secure storage. Lock your door when you leave.\n- Some students buy a small personal safe (~S$30 at Ikea/Daiso) for passport, cash, and valuables\n\n**Luggage storage during term break:**\n- Most students leave non-essential items in their hostel room during term breaks (room is still yours)\n- Confirm with Housing each time that your room access continues during the specific break period\n- There is limited communal storage in some hostel blocks — ask your RA\n\n**Coming for orientation with large luggage**: Campus security can store oversized bags for a few hours on move-in day while you sort out your room key",
    "followUps": ["Where can I buy a padlock?","What amenities are near campus?","Hostel during term break?"],
  },

  # ── GROUP PROJECT CONFLICT ─────────────────────────────────────────────────
  {
    "id": "group-project-conflict",
    "triggers": [
      "group project conflict","team conflict","bad teammate","teammate not contributing",
      "free rider","group project problem","team member not doing work","team issue",
      "teammate lazy","group conflict","project team fight","disagree with team",
      "team not communicating","group project stress","teammate missing","ghosting team",
      "unfair contribution","team contribution","how to handle team conflict",
    ],
    "response": "**Handling group project conflict at SUTD:**\n\nGroup project tension is extremely common — especially in 10.009. Here's what actually works:\n\n**Prevention (best strategy):**\n- Set expectations in Week 1 of the project: meeting schedule, communication channel (Telegram/Discord), and what \"done\" means for each milestone\n- Use a shared task tracker (Notion, GitHub Projects, Google Sheets) so contribution is visible\n\n**If someone isn't contributing:**\n1. **Private conversation first**: \"Hey, we've noticed you're behind on [X] — is everything okay? Can we help?\" — sometimes life stuff is happening\n2. **Document it**: Keep records of task assignments and what was/wasn't completed\n3. **Rebalance the work**: Redistribute tasks explicitly (don't assume — state it clearly)\n4. **Escalate to the prof if it's serious**: Most profs have a mechanism for peer assessment — your grade can be adjusted for contribution differences. Email the prof with specifics.\n\n**Peer evaluation**: Most 10.009 projects include a confidential peer evaluation form — this is your formal mechanism to flag contribution issues. Fill it honestly.\n\n**Don't**: Absorb all the work silently and resent it. That hurts your wellbeing and doesn't solve the problem.",
    "followUps": ["How do I email a professor?","How do I manage workload?","What is the 2D project?"],
  },

  # ── WHAT TO DO NIGHT BEFORE EXAM/SUBMISSION ────────────────────────────────
  {
    "id": "exam-prep",
    "triggers": [
      "night before exam","exam preparation","before submission","exam tips","study for exam",
      "exam strategy","how to study","revision tips","exam stress","exam technique",
      "past year papers","past year exams","exam format sutd","project submission",
      "final submission","before deadline","exam tomorrow","submission tomorrow",
      "all nighter","should i pull an all nighter","how to revise",
    ],
    "response": "**Before an exam or major submission:**\n\n**The night before:**\n- **Do not pull an all-nighter** — sleep deprivation impairs recall more than a few extra hours of cramming helps. Serious.\n- Review your summary notes, not new material\n- Test yourself: close notes, try to explain each key concept aloud\n- Sleep by midnight. Wake up 1h before to do a final light review.\n\n**For SUTD specifically** (mostly project-based assessment):\n- Check submission format carefully — Canvas often has specific file naming requirements\n- Submit 1–2 hours before the deadline (Canvas servers can slow down with simultaneous submissions)\n- Keep a copy of your submission confirmation\n\n**Past year papers**: For modules that do have exams, past papers are sometimes on Canvas or in the library. Ask the prof or module room — seniors often share them in Cohortly Classes.\n\n**Exam technique:**\n- Read every question before starting — allocate time proportional to marks\n- If stuck, move on and come back\n- For SUTD project exams: they often assess your *reasoning process*, not just the answer — show your work\n\n**The morning of**: Eat breakfast. Even if not hungry.",
    "followUps": ["How do I manage stress?","Where is the Wellbeing Centre?","How do I use the module rooms?"],
  },

  # ── SUTD TRADITIONS & ANNUAL EVENTS ──────────────────────────────────────
  {
    "id": "sutd-traditions",
    "triggers": [
      "sutd tradition","annual event","rag and flag","rag flag","sutd celebration",
      "freshmore week","sutd culture","campus event annual","convocation","graduation ceremony",
      "sutd sports day","inter pillar","inter-pillar competition","sutd fest",
      "design week","term 1 events","campus life events","what happens each year",
      "sutd annual","yearly event","sutd october","sutd march",
    ],
    "response": "**SUTD traditions and annual events:**\n\n**Orientation (Week 0)**: The Freshmore cohort's official start — orientation games, Camp Night, campus exploration. Run by senior student leaders. Loud, fun, intentionally disorienting.\n\n**Fifth Row Club Fair (Week 0)**: All 80+ clubs have booths. The biggest student-led event of the year start.\n\n**SUTD Freshmore Week** (~Term 1, Week 2–3): Additional Freshmore-specific programming — design workshops, inter-cohort activities, and the first taste of SUTD's project culture.\n\n**Rag and Flag** (varies by year): Charity fundraising and float-building competition — part of the broader Singapore university tradition. SUTD's version involves inter-pillar teams.\n\n**Design Week**: Annual showcase where students present their best projects. Industry guests attend. Great for getting noticed.\n\n**Inter-Pillar Games**: Sports competition between pillars. Intense but fun. Usually mid-semester.\n\n**Convocation**: Graduation ceremony, held annually. Formal, attended by families.\n\n**iCube Demo Day**: Student startups pitch to investors. Open to all students to attend — worth going even as a Freshmore.",
    "followUps": ["What is Fifth Row?","What is the orientation camp?","What is iCube?"],
  },

  # ── SINGAPORE COST-SAVING TIPS ─────────────────────────────────────────────
  {
    "id": "cost-saving-tips",
    "triggers": [
      "save money","money saving tips","cheap singapore","budget tips","frugal",
      "student discount","discount card","isic","student deals","promo code",
      "cheap things to do","free singapore","cheap food","money tight","broke student",
      "cut costs","spend less","how to save","budget living","cheap eats","free stuff",
    ],
    "response": "**Money-saving tips for SUTD students:**\n\n**Food:**\n- Hawker centres are your best friend — S$3–5 per meal vs S$10+ elsewhere\n- Koufu student meal deals (look for the special daily sets under S$4)\n- Cook simple meals using the hostel kitchen once or twice a week — eggs, instant noodles, pasta cost almost nothing\n- Drink water from campus water refill stations (free) instead of buying drinks\n\n**Transport:**\n- Student Concession EZ-Link card: ~50% off all bus and MRT fares\n- Walk to Dover MRT (5 min) instead of taking Grab for short trips\n- Group Grab (split fare) when going somewhere late at night with friends\n\n**Shopping:**\n- **Carousell** for second-hand textbooks, furniture, electronics\n- **Shopee** with vouchers — electronics, stationery, everything\n- **Daiso** (Clementi Mall, S$2): kitchen items, organisers, stationery\n- **IKEA Alexandra** (S$1.50 hotdogs): actually a campus dinner hack\n\n**Entertainment:**\n- National Museum: free entry Friday after 6 PM\n- Parks and reservoirs: free\n- Movie tickets: GV student pricing with student card (~S$9)\n- Spotify/Apple Music: student plan (~S$6/month)\n\n**Student discounts**: Always show your student card — most Singapore attractions, museums, and some restaurants give 20–30% off.",
    "followUps": ["What food is cheapest near campus?","How much does living cost?","What is near campus?"],
  },

  # ── SUTD RESEARCH INSTITUTES ──────────────────────────────────────────────
  {
    "id": "research-institutes",
    "triggers": [
      "research institute","sutd research","SUTD-MIT","design research","IDC",
      "international design centre","gambit","SUTD-ZJU","zhejiang program",
      "joint program","research centre","research center","ROAR","AI research",
      "sutd labs","research lab","advanced research","faculty research area",
    ],
    "response": "**SUTD research institutes and signature programmes:**\n\n**International Design Centre (IDC)**: SUTD–MIT joint research centre on design. Runs interdisciplinary projects and hosts the SUTD-MIT Global Leadership Programme.\n\n**SUTD–ZJU IDEA** (SUTD–Zhejiang University Innovation, Design and Entrepreneurship Alliance): Joint summer programmes, student exchange, and research between SUTD and Zhejiang University (China).\n\n**ROAR** (Research in Artificial Intelligence): SUTD's AI research cluster across ISTD and DAI faculty. Strong industry partnerships.\n\n**Design and Artificial Intelligence Research**: Human-centred AI, computer vision, NLP, applied ML.\n\n**Engineering research labs**: By pillar — EPD has advanced manufacturing labs, ESD has optimisation and analytics, ASD has sustainable design studios.\n\n**For undergrads**: Access these through UROP (Undergraduate Research Opportunities Programme). Email faculty whose work interests you in Year 1 Term 2 or Year 2. Most labs are open to motivated undergrads.\n\n**Summer programmes**: SUTD-MIT Global Leadership Programme and ZJU summer programmes — apply via OSA Global Programmes in Term 2.",
    "followUps": ["What is UROP?","How do I email a professor for research?","What is the SEP exchange programme?"],
  },

  # ── SINGAPORE CULTURE GUIDE ───────────────────────────────────────────────
  {
    "id": "singapore-culture",
    "triggers": [
      "singapore culture","living in singapore","singapore tips","sg culture","singlish",
      "singapore customs","sg customs","what is singlish","singapore etiquette",
      "singapore do and dont","queue singapore","singapore weather","hot weather",
      "humid singapore","chope","tissue paper chope","singapore norms","sg norms",
      "culture shock singapore","adapt singapore","sg lifestyle","new to singapore",
    ],
    "response": "**Singapore culture: what you need to know as a new student:**\n\n**Singlish** — Singapore English with Malay, Tamil, and Hokkien mix:\n- \"Lah\" (softener/emphasis): \"Can lah\" = yes it's fine\n- \"Can\" / \"Cannot\" (yes/no): \"Can meet tomorrow?\" = \"Can we meet tomorrow?\"\n- \"Jio\" = invite someone\n- \"Shiok\" = feels great\n- \"Kiasu\" = scared to lose (afraid of missing out) — deeply Singapore\n- \"Chope\" = reserve a seat by leaving a packet of tissues on it — a local custom\n\n**Practical culture:**\n- **Queue for everything** — jumping the queue is genuinely offensive\n- **Eat first, talk later** — hawker meals are finished fast; lingering is fine but don't rush through food\n- **It's hot and humid year-round** (~30–33°C, 80%+ humidity). Embrace it. Dress light. Stay hydrated. The campus is air-conditioned.\n- **Rain is sudden**: keep a foldable umbrella in your bag. Rainstorms appear in 10 minutes and pass in 30.\n- **Cleanliness**: Singapore takes littering seriously (fines). Eat inside designated areas. No eating on MRT.\n- **Tipping**: Not customary. Service charge is already included in most restaurants.",
    "followUps": ["What is jio culture?","How do I get around Singapore?","What weekend activities are nearby?"],
  },

  # ── SINGAPORE WATER / HYDRATION ───────────────────────────────────────────
  {
    "id": "water-facilities",
    "triggers": [
      "water refill","drinking water","water points","water dispenser","water fountain",
      "hot water sutd","boiling water","fill water bottle","where to get water",
      "water bottle sutd","hydration campus","clean water","tap water singapore",
      "water quality singapore","is tap water safe",
    ],
    "response": "**Water and hydration at SUTD:**\n\n**Tap water in Singapore is safe to drink directly** — it meets WHO standards. No filter or boiling needed.\n\n**Water refill points on campus:**\n- Hot and cold water dispensers on every hostel floor (near the laundry room or pantry)\n- Water coolers in the Library (Building 5) on each level\n- Vending areas near Koufu and the Campus Bistro have bottle fill stations\n- FabLab has a water cooler\n\n**Bring a reusable bottle** — this is the single most money-saving campus habit. S$1.50–2.00 per bottled drink vs free from the dispenser adds up fast.\n\n**Hot water**: Available in the hostel pantry/communal kettle (the communal one is allowed — just not one in your own room).\n\n**Staying hydrated**: Singapore's heat and campus AC (very cold) create a dry environment. Drink more than you think you need, especially during orientation week when you're outdoors a lot.",
    "followUps": ["What should I pack for hostel?","What is cheap food near campus?","What are hostel facilities?"],
  },

  # ── SCHOLARSHIPS - MORE DETAIL ────────────────────────────────────────────
  {
    "id": "scholarship-bonds",
    "triggers": [
      "scholarship bond","bond obligation","scholarship service obligation","bond period",
      "break bond","scholarship conditions","scholarship work requirement",
      "dsta bond","mindef bond","psc bond","temasek bond","scholarship employer",
      "return scholarship","repay scholarship","scholarship penalty","scholarship breach",
    ],
    "response": "**SUTD scholarship bonds and conditions:**\n\n**MOE Tuition Grant bond**: Not a scholarship, but all students who take the MOE Tuition Grant (most do) are bonded to work in Singapore for **3 years** after graduation. This is company-neutral — you can work for any Singapore-registered company.\n\n**SUTD Scholarship**: Full fees + allowance, typically comes with a **4–5 year bond** to work in Singapore after graduation. Specific conditions vary — read your scholarship letter carefully.\n\n**Government agency scholarships (DSTA, MINDEF, MHA, GIC, etc.)**:\n- Typically 4–6 year bonds with the sponsoring agency\n- You're bonded to work specifically for that agency\n- Breaking the bond requires repayment (pro-rated based on years served)\n- Come with internships at the agency and a defined career track\n\n**What happens if you break a bond:**\n- Repay the full tuition and allowance provided, pro-rated for unserved years\n- This is a legally binding contract — take it seriously before signing\n\n**Advice**: If you're unsure about a scholarship's career implications, talk to seniors who hold that scholarship via the People tab.",
    "followUps": ["What scholarships are available?","What are tuition fees?","What are internship options?"],
  },

  # ── SUTD CAMPUS MAP DETAIL ─────────────────────────────────────────────────
  {
    "id": "campus-map-detail",
    "triggers": [
      "campus map","where is lecture theatre","lt1","lt2","lt3","lt4","lecture theatre location",
      "seminar room","tutorial room","where is lab","engineering lab","design studio",
      "where to find room","room number","how to navigate campus","classroom location",
      "sr","tr","classroom sutd","room booking","where is my class","sutd map",
    ],
    "response": "**Navigating SUTD campus:**\n\n**Lecture Theatres (LT1–LT4)**: All in Building 1, various levels. LT1 is the largest (~300 seats), used for module-wide lectures. LTs 2–4 are smaller.\n\n**Seminar Rooms (SR)** and **Tutorial Rooms (TR)**: Spread across Buildings 1, 3, and 4. Your room number on ModTrek tells you exactly which building and floor (e.g., 1.505 = Building 1, Level 5, Room 05).\n\n**Design Studios**: Building 2 and 3 for ASD. FabLab is in Building 2.\n\n**Engineering Labs**: Building 6 for EPD/ESD labs (electronics, mechanical testing). Building 2 for fabrication.\n\n**Computer Labs**: Building 5 (Library building), Level 1 and Level 2.\n\n**Navigation tip**: SUTD room codes follow `[Building].[Level][Room]`. Example: `2.507` = Building 2, Level 5, Room 07.\n\n**Physical map**: A campus map is available at the main entrance notice board and on the SUTD website. Within a week you'll know it without the map — the campus is genuinely small.",
    "followUps": ["Where is the FabLab?","Where is the library?","Where are the lecture theatres?"],
  },

  # ── FRESHMORE ADVISORS & SUPPORT ──────────────────────────────────────────
  {
    "id": "freshmore-advisor",
    "triggers": [
      "faculty advisor","freshmore advisor","academic advisor","academic counsellor",
      "who is my advisor","advisor meeting","advisor help","academic guidance",
      "student advisor","course advisor","osa advisor","who to see for academic help",
      "academic planning","module planning","curriculum advice","academic support",
    ],
    "response": "**Academic advisors at SUTD:**\n\n**Faculty Advisor**: Every Freshmore cohort is assigned a Faculty Advisor — a faculty member who provides academic guidance for your year. They are your go-to for:\n- Module choices, HASS electives, special arrangements\n- Academic difficulty, leave of absence requests\n- Pillar selection advice based on your interests and performance\n\n**How to reach them**: Your Faculty Advisor's name and email is in your welcome email or on Canvas in the student information section. Email them with your specific question — they hold regular consultation hours.\n\n**OSA Student Advisors**: The Office of Student Affairs (Building 1, Level 2) has dedicated student advisors for non-academic matters — finance, wellbeing, accommodation, international students. Walk in any weekday.\n\n**Module Coordinator**: For specific module concerns (grade queries, attendance, extensions), go to the module coordinator directly (listed on Canvas for each module).\n\n**Mentor on Cohortly**: For day-to-day questions and perspective, senior mentors (Aarav, Sara, Wei Jian) on the People tab are often the fastest and most practical source of guidance.",
    "followUps": ["Where is the OSA office?","How do I email a professor?","How do I find a senior mentor?"],
  },

  # ── VENDING MACHINES & CAMPUS CONVENIENCES ────────────────────────────────
  {
    "id": "campus-conveniences",
    "triggers": [
      "vending machine","vending","drinks machine","snacks machine","campus snacks",
      "24 hour food","where to get food midnight","midnight snack","after hours food",
      "campus shop","bookshop","campus bookstore","stationery campus","buy pen campus",
      "campus atm","cash campus","cash withdrawal campus","sutd bookshop",
      "campus photocopying","photocopy campus","fax sutd",
    ],
    "response": "**Campus conveniences:**\n\n**Vending machines:**\n- Drink vending machines (Pokka, 100Plus, water): outside Koufu block, near Building 5 entrance, near the Sports Complex — open 24h\n- Snack machines: near the library (Building 5) Level 1\n- Prices: ~S$1.50–2.50 per item\n\n**Cheers/7-Eleven** (on campus, near Koufu):\n- Open until late (check current hours on campus notice boards)\n- Snacks, drinks, cup noodles, ice cream, EZ-Link top-up, basic toiletries, Panadol\n\n**ATM on campus**: DBS ATM inside Koufu canteen block. Nearest OCBC/UOB at Dover MRT (5 min walk).\n\n**Campus bookshop / stationery**: SUTD doesn't have a formal bookshop — buy stationery from the Cheers on campus, or Daiso/Popular at Clementi Mall. Textbooks: borrow from library first, then Carousell for second-hand, then Kinokuniya or Amazon.sg.\n\n**Umbrella stand**: Some covered walkways have umbrella holders where you can borrow one temporarily during unexpected rain — return when done. Not everywhere but check near Building 1 entrance.",
    "followUps": ["What food is on campus?","What is near campus?","Where are ATMs?"],
  },

  # ── TERM 3 SPECIFICS ──────────────────────────────────────────────────────
  {
    "id": "term-3",
    "triggers": [
      "term 3","third term","term3","what happens term 3","summer term",
      "summer semester","may term","june term","july august sutd",
      "internship term 3","exchange term 3","summer at sutd","term 3 modules",
      "freshmore term 3","year 1 term 3","term 3 housing","hostel term 3",
    ],
    "response": "**Term 3 at SUTD (approx. May–August):**\n\nTerm 3 is structured differently from Terms 1 and 2 — it bridges Freshmore year and Year 2.\n\n**For Freshmores in Term 3:**\n- Some pillar-specific taster modules may begin\n- Pillar selection finalisation happens around this time\n- Lighter module load than Terms 1–2 — intentional, allows reflection and exploration\n- Some students do their **first internship** during Term 3 (3-month break timing aligns well)\n\n**Housing in Term 3**: Hostel accommodation continues — you don't need to move out. Confirm with Housing at the start of Term 3.\n\n**Activities:**\n- SUTD-organised summer programmes (MIT, ZJU) — apply via OSA in Term 2\n- Research opportunities (UROP) — some labs specifically take students in Term 3 when the pace is lighter\n- Fifth Row club activities continue at reduced intensity\n\n**Different atmosphere**: Term 3 is noticeably quieter — fewer people on campus, more relaxed energy. Good for exploring Singapore, day trips, and actually sleeping properly after Terms 1–2.",
    "followUps": ["What is pillar selection?","What are internship options?","What is UROP?"],
  },

  # ── YEAR 2 HOUSING ────────────────────────────────────────────────────────
  {
    "id": "year2-housing",
    "triggers": [
      "year 2 housing","year 2 hostel","upper year housing","y2 hostel","senior hostel",
      "block 2n","block 2s","year 2 room","year 3 housing","can i stay hostel year 2",
      "hostel year 2","off campus year 2","leave hostel","move out hostel",
      "housing after freshmore","accommodation year 2",
    ],
    "response": "**Hostel for Year 2 and beyond:**\n\n**Year 2 housing**: Not compulsory, but on-campus housing is available for Year 2 students (Blocks 2N and 2S) subject to availability. Most upper-year students apply to stay on campus for at least Year 2.\n\n**How to apply**: Via the SUTD Housing portal (opens in Term 3 of Freshmore year) — apply early as spots are limited and allocated by priority.\n\n**Why students choose to stay:**\n- Convenience (no commute, campus facilities)\n- The community aspect continues to be valuable\n- Cheaper than renting off-campus in Singapore\n\n**Off-campus option (Year 2+)**:\nSome students move off-campus for independence. Common areas:\n- **Clementi, Buona Vista, one-north**: 1–2 MRT stops from campus. HDB flats rent for ~S$800–1,200/month per room\n- **Holland Village area**: Slightly pricier but very liveable\n- Renting with 2–3 friends (shared flat) is the most cost-effective option\n\n**International students**: Check with OSA that your Student's Pass conditions don't require on-campus housing — this is rarely an issue but worth confirming.",
    "followUps": ["How much does living cost?","What is the hostel like?","How do I find off-campus housing?"],
  },

  # ── FRESHMORE SPECIFIC SUPPORT PROGRAMMES ─────────────────────────────────
  {
    "id": "freshmore-support",
    "triggers": [
      "freshmore support","freshmore programme","peer learning","peer mentoring",
      "academic support programme","sutd peer tutor","academic enrichment",
      "supplementary class","extra help class","prof consultation","ta consultation",
      "additional help","remedial","tutoring sutd","help session","support session",
      "math help","physics help","coding help","programming help session",
    ],
    "response": "**Academic support for Freshmores:**\n\n**Module-specific help:**\n- **Office hours**: Every prof lists hours on Canvas. Show up with a specific question — most Freshmores don't use this and it's genuinely effective.\n- **TA (Teaching Assistant) sessions**: For some modules (especially 10.014), TAs run additional help sessions. Check Canvas for schedules.\n- **Module rooms on Cohortly** (Classes tab): Senior mentors Aarav, Sara, and Wei Jian actively answer questions — often faster than office hours for coding questions.\n\n**Peer learning:**\n- **Study groups**: Form one in Week 1 — it's the single most effective academic support mechanism\n- **Cohortly module rooms**: Post your question, get a peer answer within hours\n- **Floor study sessions**: Freshmore floor mates are in the same modules — use the lounge\n\n**Formal support programmes:**\n- OSA runs academic workshops on study skills, time management, and exam techniques — check Canvas/OSA announcements\n- **Writing Centre** (if available — check OSA): helps with project reports and technical writing\n- Some pillar-head advisors run supplementary Q&A sessions in Weeks 5–6 when the workload peaks\n\n**If you're seriously falling behind**: Talk to OSA (Building 1, Level 2) before Week 8 — there are more options earlier.",
    "followUps": ["How do I find a study group?","How do I use module rooms?","Where is OSA?"],
  },

  # ── SUSTAINABILITY ON CAMPUS ──────────────────────────────────────────────
  {
    "id": "sustainability-campus",
    "triggers": [
      "sustainability","green campus","eco friendly","environmental","recycle","recycling bin",
      "reduce waste","zero waste","plastic free","sutd green","carbon footprint",
      "environmental initiative","green building","solar panels sutd","envu",
      "sustainability club","sutd environment","going green","eco campus",
    ],
    "response": "**Sustainability at SUTD:**\n\n**Campus sustainability:**\n- SUTD's buildings have green certification — energy-efficient design, solar panels, rainwater harvesting\n- Recycling bins (blue for paper/plastic/metal, brown for general waste) are throughout campus — use them\n- Water refill stations everywhere — use a reusable bottle\n- **No single-use plastic bags** in SUTD-operated food outlets (bring your own bag or pay S$0.05–0.10)\n\n**ENVU (Environmental Club):**\n- Campus garden (near the hostel blocks) — ENVU maintains it, open to all\n- Zero-waste campaigns: bring your own container to Koufu and some stalls give a discount\n- Weekly sustainability events, plogging (jog + pick up litter) sessions\n- Join via Fifth Row tab on Cohortly\n\n**Academic:**\n- ASD pillar has dedicated sustainable design modules\n- ESD looks at sustainable systems and supply chains\n- The Digital World (10.009) often has groups working on sustainability-themed projects\n\n**Practical habit**: Buying a reusable coffee cup saves ~S$0.50 per drink at the Campus Bistro and most coffee shops.",
    "followUps": ["What is ENVU?","What are Fifth Row clubs?","What is the ASD pillar?"],
  },

  # ── IMPOSTER SYNDROME ─────────────────────────────────────────────────────
  {
    "id": "imposter-syndrome",
    "triggers": [
      "imposter syndrome","feel dumb","not smart enough","everyone smarter than me",
      "feel like i dont belong","out of my depth","not good enough","feel like a fraud",
      "dont deserve to be here","surrounded by smart people","feel inferior",
      "comparing myself","everyone seems smarter","feel behind everyone","not fit for sutd",
      "made a mistake coming here","regret sutd","doubt myself",
    ],
    "response": "**On imposter syndrome at SUTD:**\n\nThis is one of the most common experiences at SUTD — especially in the first few weeks when you're surrounded by people who all seem brilliant and put-together.\n\n**What's actually happening**: The people around you are also scared and also feel like they don't belong. Almost without exception. The ones who seem most confident often feel it most acutely.\n\n**What helps:**\n- Remember that SUTD selected you. The admissions team reviewed thousands of applications and chose yours. That wasn't an accident.\n- Compare yourself to yourself, not others — your job is to grow, not to win\n- Talk about it: most students feel this way. Saying \"I felt totally lost in 10.001 today\" in the floor lounge will be met with universal agreement\n- Focus on the work, not the performance — people who fixate on seeming smart learn less than people who focus on understanding\n\n**If it's persistent and affecting your wellbeing:**\nThe Wellbeing Centre (Building 54, Level 2) specifically works with students on imposter syndrome and academic anxiety. It's genuinely one of the most common issues they see.\n\nYou belong here.",
    "followUps": ["Where is the Wellbeing Centre?","How do I manage workload?","How do I make friends?"],
  },

  # ── SIM CARD & PHONE PLAN ─────────────────────────────────────────────────
  {
    "id": "sim-card",
    "triggers": [
      "sim card","phone plan","mobile plan","which telco","singtel","starhub","m1","circles life",
      "giga","best phone plan","cheap phone plan","prepaid sim","postpaid plan",
      "phone data plan","data plan singapore","unlimited data","roaming singapore",
      "get a sim","buy sim card","sim card singapore","simba","redone","phone number",
      "mobile data","wifi calling","esim singapore",
    ],
    "response": "**Getting a SIM card in Singapore:**\n\n**Best options for SUTD students:**\n- **Giga** (~S$15–18/month): Unlimited data (throttled after 20–50GB), no contract. Most popular among students for value.\n- **Circles.Life** (~S$20–28/month): Flexible data, good speeds, digital-only (manage via app)\n- **Singtel / StarHub / M1** (the big 3): More reliable coverage, ~S$20–35/month. Better for heavy users or if you travel a lot.\n- **Prepaid SIM** (Singtel hi!Tourist, StarHub): Good for your first weeks while you decide — buy at Changi Airport, 7-Eleven, or major telco stores\n\n**Where to buy:**\n- Changi Airport arrivals (get one the moment you land — cheapest move)\n- Any **Challenger** or **Courts** at a mall\n- Singtel/StarHub/M1 shops at major MRTs\n- Online (Giga and Circles.Life are digital-only — register online, SIM posted to campus)\n\n**Registration**: Singapore SIMs require Singpass or ICA FIN registration — bring your passport or Student's Pass.\n\n**Pro tip**: Buy at the airport first (prepaid), then switch to a monthly plan from your hostel room in Week 1.",
    "followUps": ["What apps do I need?","What is Singpass?","How do I get around Singapore?"],
  },

  # ── DEAN'S LIST ───────────────────────────────────────────────────────────
  {
    "id": "deans-list",
    "triggers": [
      "dean's list","deans list","top student award","academic award","academic recognition",
      "best student","highest gpa","top gpa","distinction","academic excellence",
      "gold medal","top 5 percent","top student","academic honour","honor roll",
      "dean list criteria","how to get deans list","am i on deans list",
    ],
    "response": "**Dean's List at SUTD:**\n\n**What it is**: An academic honour awarded each term to students in the top 10% of their cohort (based on term GPA).\n\n**Eligibility:**\n- Year 2 onwards (Freshmore year is Pass/Fail, so not eligible)\n- Must be taking a full module load that term\n- No failed or withdrawn modules in the term\n\n**How it's awarded**: Automatic — no application needed. The Registrar's Office calculates at the end of each term and notifies eligible students.\n\n**What you get:**\n- Formal letter of recognition\n- Listed in the SUTD Dean's List record\n- Goes on your transcript — useful for graduate school applications, government scholarships, and competitive internships\n\n**GPA target**: Typically requires 4.5+ out of 5.0 in the term. The exact cutoff varies by cohort size and performance each term.\n\n**Gold Medal**: Awarded at convocation to the single student with the highest overall CGPA in each graduating cohort. Rare and very prestigious.",
    "followUps": ["What is GPA?","How are modules graded?","What are scholarships?"],
  },

  # ── READING WEEK / STUDY BREAK ────────────────────────────────────────────
  {
    "id": "reading-week",
    "triggers": [
      "reading week","study break","reading week sutd","recess week","mid-term break",
      "when is study break","no classes week","free week","week off",
      "what is reading week","reading week what to do","study break plans",
      "recess sutd","mid sem break","study week before exam",
    ],
    "response": "**Reading Week at SUTD:**\n\nSUTD has a **Reading Week** (also called Study Break) typically scheduled after Week 6–7 of each term, before final assessments begin. The exact timing is in the Academic Calendar on Canvas.\n\n**What it means:**\n- No scheduled lectures or tutorials\n- FabLab, library, and study spaces are all open\n- Most professors hold extra office hours during this week\n- A popular time for project submissions and final lab reports\n\n**What most students do:**\n- Catch up on any accumulated backlog from mid-semester crunch\n- Review lecture notes systematically before finals\n- Schedule prof consultations for anything unclear\n- Group project final push before submission week\n\n**What you should NOT do:**\n- Treat it as a full holiday — assessments come immediately after\n- Use it only for rest with no work; rest is important, but mix it in\n\n**Hostel during reading week**: You stay in your room as usual — no need to move out. Campus is quieter but still well-populated.",
    "followUps": ["How do I prepare for exams?","What are study spots?","What is the academic calendar?"],
  },

  # ── HOSTEL GUEST POLICY ───────────────────────────────────────────────────
  {
    "id": "hostel-guest-policy",
    "triggers": [
      "can friends visit","hostel guest","overnight guest","visitor policy","hostel visitor",
      "can i have a guest","can family visit hostel","overnight stay friend","bring someone to hostel",
      "guest in room","non-resident guest","opposite gender guest","boyfriend girlfriend hostel",
      "bring family campus","visitor rules","guest rules hostel","people over hostel",
    ],
    "response": "**Hostel guest policy at SUTD:**\n\n**Daytime visitors (general rule)**:\n- Friends and family can visit the campus and common areas freely during the day\n- Visitors must register at the security desk (main entrance) and collect a visitor pass\n\n**Hostel rooms:**\n- Guests are generally permitted in your room during daytime hours\n- **Overnight stays by non-residents are not permitted** as a general rule\n- Specific policies may vary — check the current Housing handbook on Canvas or ask your RA for the exact rules, as these can change\n\n**Family visit tips:**\n- Visitors can eat at Koufu and the Campus Bistro — no restrictions\n- Good areas to spend time with family: library lounge, outdoor areas, campus cafes\n- If your family is coming from abroad for orientation week, they can attend the family orientation programme that OSA organises\n\n**RA and floor norms**: Your RA will brief you on practical norms for your floor. Generally, people are considerate about guests and quiet hours.",
    "followUps": ["What are hostel rules?","What are quiet hours?","Who is my RA?"],
  },

  # ── HOSTEL COOKING FACILITIES ─────────────────────────────────────────────
  {
    "id": "hostel-cooking",
    "triggers": [
      "can i cook","cooking hostel","hostel kitchen","cook in room","microwave hostel",
      "kettle hostel","rice cooker hostel","hot plate hostel","kitchen facilities",
      "where to cook","communal kitchen","hostel pantry","cooking facilities",
      "make food hostel","induction cooker","electric appliances hostel",
      "can i bring rice cooker","electric kettle allowed","toaster hostel",
    ],
    "response": "**Cooking in the SUTD hostel:**\n\n**What's available:**\n- **Communal pantry/kitchen** on each floor (or every 2 floors): has a microwave, electric kettle, and basic sink\n- Hot water dispenser for instant noodles, milo, oats\n\n**What's allowed in your room:**\n- Small personal electric kettle (most rooms are fine with this — confirm with Housing)\n- Fan, laptop charger, bedside lamp, etc.\n- **NOT allowed in rooms**: rice cookers, hot plates, induction cookers, toasters — fire risk. These must be used in the communal pantry only.\n\n**Common cooking habits:**\n- Cup noodles / instant oats using the floor kettle or microwave\n- Reheating takeaway in the communal microwave\n- Simple cooking (eggs, pasta) in the communal pantry on permitted appliances — some floors have more kitchen facilities, check what your block has\n\n**Grocery runs**: Fairprice at Clementi Mall is 2 MRT stops away. Sheng Siong near Clementi is cheaper for basics. Giant at Clementi is mid-range. All ~15–20 min from campus.",
    "followUps": ["What food is on campus?","Where can I buy groceries?","What are hostel rules?"],
  },

  # ── HOSTEL MOVE-IN TIPS ───────────────────────────────────────────────────
  {
    "id": "hostel-move-in",
    "triggers": [
      "move in day","move in tips","first day hostel","check in hostel","hostel check in",
      "moving into hostel","arrival day","key collection","room key","how to move in",
      "hostel orientation","first day sutd","what to do when you arrive","arrival checklist",
      "report to hostel","hostel admin first day","get room key","move in process",
    ],
    "response": "**Hostel move-in at SUTD:**\n\n**Arrival day process:**\n1. Go to the **Housing office** (Building 1, Level 2) or the designated move-in desk (set up during orientation week) to collect your room key card\n2. Bring: student acceptance letter, passport/IC, and any documents stated in your pre-arrival email from Housing\n3. Sign the hostel agreement form (if not done online)\n4. Collect your room key — this is also your access card for the hostel lifts and common areas\n\n**Practical tips for move-in:**\n- Use the goods lift (freight lift) for large luggage — ask security where it is\n- Your room comes with mattress + pillow only — sheets, towels, toiletries are your responsibility\n- The Campus Bistro is open during orientation week — eat there while you unpack\n- Explore your floor, meet your neighbours and RA on Day 1 — this sets the tone for the year\n\n**If you arrive before official move-in day**: Security can store your luggage temporarily. Check in advance with Housing.\n\n**International students**: Your Student's Pass registration appointment will be coordinated via OSA within the first 2 weeks — attend when called.",
    "followUps": ["What should I pack?","Who is my RA?","What happens during orientation?"],
  },

  # ── SUPPLEMENTARY EXAMS ───────────────────────────────────────────────────
  {
    "id": "supplementary-exams",
    "triggers": [
      "supplementary exam","makeup exam","make up exam","missed exam","miss exam",
      "sick during exam","medical cert exam","sick on exam day","absent exam",
      "defer exam","exam deferral","special consideration","exam exemption",
      "what if i miss exam","can i retake exam","retake exam","second chance exam",
      "alternative assessment","mc for exam","medical leave exam",
    ],
    "response": "**Missing an exam or assessment at SUTD:**\n\n**If you're sick on exam day:**\n1. See a doctor **before or as close to the exam time as possible** and get a valid medical certificate (MC)\n2. Email the module coordinator **the same day** — do not wait\n3. Attach your MC and student ID to the email\n4. SUTD generally does not penalise for genuine medical absences with proper documentation\n\n**Supplementary / make-up assessment:**\n- For exams: a supplementary exam may be scheduled, or the grade may be calculated from other components\n- For projects/submissions: extensions are granted case-by-case with MC — contact the module coordinator promptly\n- Each module has its own policy — check the syllabus on Canvas\n\n**Personal emergencies** (family bereavement, serious accident): Contact OSA (Building 1, Level 2) immediately — they liaise with the faculty on your behalf.\n\n**Important**: Do NOT attend an exam when very unwell and then claim illness after the fact — documentation must precede the assessment or be contemporaneous.\n\n**Failing due to absence without excuse**: Module fail, which may require repeat — see OSA before this happens.",
    "followUps": ["What happens if I fail a module?","How do I get a medical certificate?","Where is OSA?"],
  },

  # ── CAREER FAIR & RECRUITMENT ─────────────────────────────────────────────
  {
    "id": "career-fair",
    "triggers": [
      "career fair","job fair","recruitment fair","company booth","employers on campus",
      "internship fair","hiring fair","when is career fair","sutd career fair",
      "company recruitment","campus recruitment","on campus interview","company presentation",
      "employer presentation","company talk","networking event","industry talk",
      "connect with companies","how to talk to recruiters","career event",
    ],
    "response": "**Career fairs and recruitment at SUTD:**\n\n**Annual events:**\n- **SUTD Career Fair**: Held once or twice a year (typically Term 2). Companies set up booths on campus — tech firms, engineering companies, government agencies, startups. Open to all students.\n- **Industry Talks**: Companies visit year-round for 1–2 hour presentations + Q&A. These appear on the CDC calendar (Canvas / CDC portal) — attend the ones relevant to your pillar\n- **Company-specific recruitment drives**: Some firms (DSTA, DBS Tech, SEA Group, etc.) run dedicated SUTD recruitment events\n\n**Practical tips:**\n- Bring printed CVs to the career fair — even if you're just a Freshmore, introduce yourself and ask about internships for Year 2+\n- Dress smart-casual: clean, pressed, no slippers\n- Research the companies before approaching their booth — recruiters remember students who ask specific questions\n- Connect on LinkedIn after the fair: \"Hi, I'm a SUTD Freshmore — we spoke at the SUTD Career Fair about [X]\"\n\n**For Freshmores**: Career fair is useful to scope what companies expect. Internship applications in earnest start Year 2.",
    "followUps": ["How do I apply for internships?","What is the CDC?","How do I build a resume?"],
  },

  # ── RESUME & LINKEDIN ─────────────────────────────────────────────────────
  {
    "id": "resume-linkedin",
    "triggers": [
      "resume","cv","curriculum vitae","write resume","build cv","linkedin","linkedin profile",
      "resume tips","how to write cv","resume format","student resume","engineering resume",
      "portfolio","design portfolio","work portfolio","how to find internship",
      "job application","cover letter","resume template","sutd resume",
      "linkedin tips","connect linkedin","linkedin recommendation",
    ],
    "response": "**Resume, CV, and LinkedIn for SUTD students:**\n\n**Resume basics:**\n- Keep it to **1 page** for internship applications as a student\n- Sections: Contact info → Education (SUTD, GPA if 3.5+) → Skills → Projects → Work Experience (if any) → Awards\n- Your **Freshmore projects** (10.009 project, 10.014 capstone) are real portfolio pieces — describe them with impact: what you built, what tech you used, what the outcome was\n- Skills section: list programming languages, software, tools you actually know — don't pad it\n\n**LinkedIn:**\n- Set up your profile in Week 1 of Year 1 — recruiters look for you, not the other way around\n- Headline: \"Computer Science & Design student @ SUTD | Python, React, Machine Learning\" — specific beats vague\n- Connect with professors, industry speakers after talks, and career fair recruiters\n- Post about projects you're proud of — this builds a trail recruiters see\n\n**CDC help:**\n- SUTD's Career Development Centre (CDC) on the student portal offers free resume reviews — use this before submitting to dream companies\n- Mock interview sessions available in Term 2 — book via CDC portal\n\n**Portfolio (ASD, DAI, ISTD)**: A digital portfolio (Behance, personal website, GitHub) is often more important than your resume in design-heavy roles.",
    "followUps": ["What are internship options?","What is the CDC?","When should I start applying for jobs?"],
  },

  # ── GRADUATE PROGRAMS ─────────────────────────────────────────────────────
  {
    "id": "graduate-programs",
    "triggers": [
      "masters","phd","graduate school","grad school","sutd masters","sutd phd",
      "postgraduate","masters degree","doctoral","research degree","masters program",
      "sutd graduate programme","msc","master of science","doctor of philosophy",
      "stay for masters","apply masters sutd","study further","after bachelor",
      "sutd alumni","sutd research degree","dtp","design technology programme",
    ],
    "response": "**Graduate programs at SUTD:**\n\n**Masters programmes:**\n- **MSc in Innovation** (DTP — Design and Technology Programme)\n- **MSc in Urban Science** (with MIT)\n- **MSc in AI** (ISTD / DAI)\n- **MSc in Engineering Product Development** (EPD)\n- Various research-based and coursework-based MSc options\n\n**PhD:**\n- PhD programmes across all five pillars (ASD, EPD, ESD, ISTD, DAI)\n- Fully-funded positions available with research stipend (~S$2,000–2,500/month)\n- Apply directly via the SUTD Graduate Admissions portal\n\n**Who should consider:**\n- Students who want to go into research, academia, or deep technical specialisation\n- UROP students who find they love the research process\n- Students wanting a stronger academic profile before industry roles\n\n**SUTD alumni pathway**: SUTD undergrads sometimes get priority consideration for SUTD Masters programmes — ask your Faculty Advisor or check the Graduate Admissions website.",
    "followUps": ["What is UROP?","What are research institutes?","What are career options after SUTD?"],
  },

  # ── HOSTEL ROOM CHECKOUT ──────────────────────────────────────────────────
  {
    "id": "hostel-checkout",
    "triggers": [
      "hostel checkout","check out hostel","vacate room","leave hostel","end of year hostel",
      "what to do at end of year","room inspection","hostel room inspection",
      "hostel deposit","deposit return","hostel move out","clear room","end of term hostel",
      "checkout process","how to checkout hostel","leave room sutd",
    ],
    "response": "**Hostel checkout / room inspection:**\n\n**When it happens:**\n- End of each academic year (some students staying on for Year 2 continue; those leaving SUTD or moving off-campus check out)\n- Also applies if you leave mid-year (withdrawal or LOA)\n\n**Process:**\n1. Clear all your belongings from the room\n2. Return all borrowed items (common room equipment, etc.)\n3. Clean the room to a reasonable standard — wipe desk, take out rubbish, clean fridge if there is one\n4. Return the room key/access card to the Housing office\n5. A Housing officer will inspect the room for damage\n\n**Damage charges:**\n- Normal wear and tear: no charge\n- Damage beyond normal wear (wall damage, broken furniture, stains): deducted from your hostel deposit\n- You'll be invoiced for anything beyond the deposit\n\n**Hostel deposit**: Paid at the start of Year 1 (check your fees bill). Refunded after checkout inspection if room is in good condition.\n\n**Storage during the break**: If you're returning next term, your room is yours — you don't need to do anything.",
    "followUps": ["What is the hostel deposit?","How much does housing cost?","Hostel room change?"],
  },

  # ── NON-SEP STUDY ABROAD ─────────────────────────────────────────────────
  {
    "id": "study-abroad-non-sep",
    "triggers": [
      "winter program","summer program","short term exchange","non sep abroad",
      "study abroad not sep","short exchange","mit program","mit visit",
      "sutd mit link","zju program","zhejiang program","study abroad short",
      "overseas programme","sutd global","global programmes","overseas learning",
      "sutd overseas","go overseas","summer school abroad","short programme overseas",
    ],
    "response": "**Non-SEP study abroad opportunities at SUTD:**\n\n**SUTD–MIT Global Leadership Programme (SMGLP):**\n- Annual programme with MIT (Cambridge, USA)\n- 1–2 weeks, combines leadership training with MIT campus experience\n- Open to Years 2–4. Apply via OSA Global Programmes in Term 2.\n- Competitive — GPA, leadership record, and a strong statement matter\n\n**SUTD–ZJU (Zhejiang University) Exchange:**\n- Summer programme in Hangzhou, China (ZJU campus)\n- Design and engineering focus, joint student projects\n- Usually 3–6 weeks in Term 3 / summer\n- Apply via OSA in Term 2\n\n**Other short programmes:**\n- SUTD partners with universities in Japan, Germany, Netherlands, and USA for short-term project collaborations (1–4 weeks). Check the OSA Global Programmes page each term.\n- Some companies (BMW, BOSCH) run co-organised workshops that are technically \"global programmes\" and open to SUTD students\n\n**Financial support**: Most SUTD-organised programmes have subsidised fees or travel grants for students with demonstrated financial need — ask OSA when applying.",
    "followUps": ["What is the SEP exchange?","How do I apply for global programmes?","What are research institutes?"],
  },

  # ── HACKATHONS & COMPETITIONS ─────────────────────────────────────────────
  {
    "id": "hackathons-competitions",
    "triggers": [
      "hackathon","design competition","competition sutd","student competition",
      "build something","project competition","coding competition","case competition",
      "business competition","startup competition","pitching competition",
      "ntu hackathon","nus hackathon","singapore hackathon","tech competition",
      "innovation challenge","design challenge","enter competition","win competition",
      "sutd hackathon","icube competition","entrepreneurship competition",
    ],
    "response": "**Hackathons and competitions for SUTD students:**\n\n**On campus:**\n- **iCube Startup Competitions**: SUTD's entrepreneurship centre runs pitch competitions throughout the year — open to all students, prizes and mentorship\n- **SUTD Design Challenges**: Faculty-organised or industry-partnered challenges (often with prizes) — watch Canvas/OSA announcements\n- **Fifth Row-organised events**: E.g., IEEE Student Branch hosts coding competitions, GEAR (robotics) hosts demo days\n\n**Singapore-wide:**\n- **GovTech and government hackathons** (HackforPublicGood, etc.) — SUTD students often win these\n- **NUS and NTU tech fests** — open to all Singapore universities\n- **SEA (Shopee, Grab, etc.) internal hackathons** — companies recruit at SUTD and run dedicated events\n\n**International:**\n- **MIT hackathons**: Check the SUTD-MIT link programme for invitations\n- **Google Hash Code, ICPC** (competitive programming)\n- **IChO, ISEF** (for science-focused students)\n\n**Tips:**\n- Start with 24-hour hackathons before week-long ones — lower stakes, higher learning\n- Find a team with complementary skills: 1 designer + 1 backend + 1 presenter is a winning formula\n- Winning is secondary — the network and experience are the real prize\n\n**Register**: Most competitions are announced on Canvas, SUTD Fifth Row social pages, or Devpost.",
    "followUps": ["What is iCube?","What are Fifth Row clubs?","How do I find a team?"],
  },

  # ── FABRIC / MATERIAL SOURCING ────────────────────────────────────────────
  {
    "id": "materials-sourcing",
    "triggers": [
      "where to buy materials","materials for project","buy components","electronics parts",
      "buy arduino","buy raspberry pi","buy sensors","where to buy electronics",
      "sim lim","where to buy fabric","material sourcing","3d printing filament",
      "buy filament","craft materials","buy wood","acrylic","buy acrylic","plywood",
      "hardware store near sutd","mending materials","buy tools","buy screws",
      "where to buy craft stuff","project materials","sourcing","supplier singapore",
    ],
    "response": "**Where to buy materials and components for SUTD projects:**\n\n**Electronics / Maker components:**\n- **Sim Lim Square** (Rochor MRT, ~25 min from campus): 6-storey electronics mall. Resistors, sensors, motors, Arduino, Raspberry Pi, cables, batteries — cheapest prices in Singapore\n- **Lazada / Shopee**: For common components (jumper wires, displays, modules) — cheaper than physical shops and delivered to campus\n- **RS Components / Element14**: Professional-grade components, fast Singapore delivery, account registration required\n- **Digikey / Mouser**: International orders, takes 3–5 days, great for obscure parts\n\n**3D printing filament:**\n- FabLab stocks basic PLA — check with FabLab staff for what's available\n- Lazada for extra spools (get PLA 1.75mm)\n\n**Wood / Acrylic / Sheet materials:**\n- **Hardware stores at Boon Lay / Jurong** (MRT, ~30 min): Full range of timber, plywood, acrylic sheets\n- **Daiso** (Clementi Mall): Craft supplies, foam board, basic tools\n- FabLab has scrap material available — ask before buying\n\n**Fabric (ASD students):**\n- **Spotlight at Parkway Parade** (East) or **Peninsula Shopping Centre** (City Hall MRT): largest fabric selection in Singapore\n- **Mustafa Centre** (Little India): cheaper fabric, open 24h",
    "followUps": ["What is FabLab?","What materials can I use in FabLab?","How do I start a project?"],
  },

  # ── BANKING IN SINGAPORE ──────────────────────────────────────────────────
  {
    "id": "banking-sg",
    "triggers": [
      "open bank account","bank account singapore","which bank","dbs","posb","ocbc","uob",
      "bank account student","how to open bank account","student bank account",
      "online banking singapore","money transfer","bank transfer","atm singapore",
      "bank near campus","bank near sutd","savings account","current account","bank fees",
    ],
    "response": "**Opening a bank account in Singapore:**\n\n**Best options for students:**\n- **DBS/POSB Multiplier or Everyday Savings Account**: Most SUTD students use this. POSB is DBS's retail brand — same bank, slightly different products. Widely accessible, zero or low fees for students.\n- **OCBC 360 Account**: Good for students who want interest on their savings\n- **Wise** (online multi-currency): Excellent for international students receiving money from abroad — lower FX fees than local banks\n\n**How to open (DBS/POSB):**\n1. Download the DBS or POSB app → tap \"Open an Account\" (can do fully digitally with Singpass)\n2. Need: Singpass (SG citizens/PRs) or passport + Student's Pass + proof of address (ICA letter works for international students)\n3. Account opened within 1–2 days; card arrives within 5 business days\n\n**For international students without Singpass yet**: Go to a branch (nearest to campus: DBS Dover, or any Clementi branch) with your passport and Student's Pass.\n\n**ATMs near campus:**\n- DBS ATM inside Koufu canteen block (on campus)\n- DBS, OCBC, UOB at Clementi MRT (2 stops, 5 min walk from Dover MRT)\n\n**PayNow**: Once your account is set up, link your phone number to PayNow (in the app) — essential for splitting meals and paying for almost everything.",
    "followUps": ["What is PayNow?","What apps do I need?","How do I get here from the airport?"],
  },

  # ── MENTAL HEALTH CRISIS ──────────────────────────────────────────────────
  {
    "id": "mental-health-crisis",
    "triggers": [
      "mental health crisis","crisis line","suicidal thoughts","suicide","self harm","self-harm",
      "feeling suicidal","want to die","cant go on","emergency mental health",
      "mental breakdown","panic attack","severe anxiety","psychiatric emergency",
      "SOS","samaritans of singapore","crisis hotline","mental health emergency",
      "having a breakdown","in crisis","need help urgently mental","overwhelmed completely",
    ],
    "response": "If you're in crisis right now, please reach out immediately:\n\n**24/7 crisis support:**\n- **Samaritans of Singapore (SOS)**: 1-767 (24h hotline, free, confidential)\n- **IMH Crisis Helpline**: 6389-2222 (24h, Institute of Mental Health)\n- **Emergency (ambulance)**: 995\n\n**On campus:**\n- **SUTD Security**: 6303-6002 — they can connect you to help any time\n- **Wellbeing Centre** (Building 54, Level 2): Walk in during office hours. For after-hours crises, call Security.\n\n**Text options (if you can't speak):**\n- **Crisis Text Line** (WhatsApp SOS): Text \"Hello\" to 1800-221-4444 (Befrienders)\n\nYou don't have to be okay right now. You just have to reach out to one person. That's enough.",
    "followUps": ["Where is the Wellbeing Centre?","How do I talk to someone on campus?"],
  },

  # ── OVERSEAS / AIRPORT ARRIVAL ────────────────────────────────────────────
  {
    "id": "airport-arrival",
    "triggers": [
      "arriving singapore","airport to sutd","changi to sutd","how to get from airport",
      "arrived singapore","just landed","from changi","airport transport","mrt from airport",
      "airport to campus","taxi from airport","grab from airport","bus from airport",
      "what to do when i land","arriving changi","changi airport","first time singapore",
    ],
    "response": "**Getting from Changi Airport to SUTD:**\n\n**Option 1 — MRT (recommended, cheapest):**\n- Take the **East-West Line** (green) from Changi Airport MRT\n- Change at Tanah Merah → continue West towards Jurong East\n- Alight at **Dover MRT** (not Changi station — it's a different branch)\n- Total: ~50–60 min, S$2.50–3.00 with an EZ-Link card\n- Grab an EZ-Link card from the airport arrivals hall (vending machines, convenience stores)\n\n**Option 2 — Grab/Taxi (~30–35 min, S$25–45):**\n- Grab (app) from the airport to SUTD Dover Campus\n- Faster but significantly more expensive — good for heavy luggage on move-in day\n\n**Option 3 — Airport Shuttle Bus:**\n- Check if SUTD or your hostel is arranging a move-in shuttle during orientation week — OSA usually sends details in the pre-arrival email\n\n**On arrival:**\n- Get a prepaid SIM at the airport (Singtel/StarHub kiosks in Arrivals) before leaving — you'll need mobile data immediately\n- Changi has left-luggage storage if you arrive before check-in time\n\n**Address to give Grab/taxi driver**: 8 Somapah Road, SUTD, Singapore 487372",
    "followUps": ["How do I get around Singapore?","Where is SUTD?","How do I get a SIM card?"],
  },

  # ── NIGHT BUS / LATE TRANSPORT ────────────────────────────────────────────
  {
    "id": "late-night-transport",
    "triggers": [
      "night bus","late night bus","mrt last train","last train timing","when does mrt close",
      "owlbus","night rider","late night train","transport after midnight","coming back late",
      "how to get home late","night transport","late bus singapore","after midnight transport",
      "night owl bus","night rider bus","get back late","late night mrt",
    ],
    "response": "**Late night transport in Singapore:**\n\n**MRT last train**: The MRT shuts down around **midnight–12:30 AM** (varies slightly by line and direction). After that, no MRT service until ~5:30 AM.\n\n**Night Owl (NightRider / NR) buses**: Premium buses from ~11:30 PM – 3 AM. Routes from city hubs (Chinatown, Clarke Quay, Orchard, Tampines) to residential areas. Fare: ~S$4–5. Check the SBS Transit app or Google Maps for NR routes.\n\n**Bus 14 / 74 / 166** (near Dover): Standard buses continue to run until midnight-ish on weekends.\n\n**Grab / GoJek**: Available 24/7 — most reliable option after midnight. Surge pricing applies late night/early morning (S$12–20 for short trips).\n\n**SUTD to/from city after midnight**: Grab is your main option once MRT closes. Split the fare with friends to keep costs down.\n\n**Pro tip**: Leave Orchard/Clarke Quay by **11:30 PM** to catch the last MRT home to Dover — or budget S$15–20 for a Grab back.",
    "followUps": ["How do I get around Singapore?","How much does living cost?","What are evening activities?"],
  },

  # ── INTERNATIONAL STUDENT ICA DETAILS ─────────────────────────────────────
  {
    "id": "ica-registration",
    "triggers": [
      "ica registration","student pass","student's pass","immigration","in-principle approval",
      "ipa letter","collect student pass","student pass renewal","pass renewal","ica appointment",
      "immigration checkpoint authority","visa singapore","student visa","work permit student",
      "register ica","student pass collection","iris","sutd ica","international student pass",
      "change passport details","lost passport","lost student pass","emergency certificate",
    ],
    "response": "**ICA / Student's Pass for international students:**\n\n**Before arriving:**\n- Apply for the In-Principle Approval (IPA) letter — SUTD's Registrar coordinates this after you accept your offer. The IPA is your entry approval.\n- Bring the IPA letter + original supporting documents when you fly in\n\n**On arrival:**\n- You enter on the IPA, which gives you a short-term stay\n- SUTD's OSA will schedule a **group ICA appointment** for the entire international cohort within the first 2 weeks — you MUST attend this to collect your actual Student's Pass\n- Bring: Passport, IPA letter, completed SUTD acceptance docs, and passport-sized photos\n\n**Student's Pass duration**: Typically valid for the full duration of your degree + a little buffer. Renew through OSA if your degree is extended.\n\n**Important rules:**\n- You must stay enrolled and in good standing — losing your student status can affect your pass\n- You can work part-time up to **16 hours/week** on a valid Student's Pass\n- Notify OSA immediately if you lose your passport or Student's Pass\n\n**Renewing or extending**: Contact the OSA International Student Office (Building 1, Level 2) for all ICA-related matters — they manage the paperwork collectively.",
    "followUps": ["What is OSA?","What are part-time job rules?","What documents do I need?"],
  },
]

# ─── TF-IDF Index ─────────────────────────────────────────────────────────────

corpus_word = [" ".join(e["triggers"]).lower() for e in KB]
corpus_char = [" ".join(e["triggers"]).lower() for e in KB]

word_vec = TfidfVectorizer(ngram_range=(1, 3), sublinear_tf=True, min_df=1)
char_vec = TfidfVectorizer(ngram_range=(2, 5), analyzer="char_wb", sublinear_tf=True, min_df=1)

word_matrix = word_vec.fit_transform(corpus_word)
char_matrix = char_vec.fit_transform(corpus_char)

STRESS_WORDS = {
    "stressed", "overwhelmed", "anxious", "scared", "worried",
    "cant cope", "can't cope", "help me", "so lost", "struggling",
    "not okay", "not ok", "breaking down", "panic",
}

CONTEXT_PHRASES = {
    "tell me more", "more about that", "explain more", "go on",
    "elaborate", "and then", "what else", "keep going", "continue",
}

# ─── Endpoint ─────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    last_entry_id: str | None = None

@app.post("/api/ai/chat")
def chat(req: ChatRequest):
    msg = req.message.strip()
    if not msg:
        return fallback()

    lower = msg.lower()

    # Context continuation
    if any(p in lower for p in CONTEXT_PHRASES) and req.last_entry_id:
        entry = next((e for e in KB if e["id"] == req.last_entry_id), None)
        if entry:
            return build_response(entry, 0.95)

    # TF-IDF scoring
    try:
        qw = word_vec.transform([lower])
        qc = char_vec.transform([lower])
        word_scores = cosine_similarity(qw, word_matrix).flatten()
        char_scores = cosine_similarity(qc, char_matrix).flatten()
        combined = 0.72 * word_scores + 0.28 * char_scores
        best_idx = int(np.argmax(combined))
        best_score = float(combined[best_idx])
    except Exception:
        return fallback()

    if best_score < 0.04:
        return fallback()

    entry = KB[best_idx]
    response = entry["response"]

    # Stress detection: append wellbeing note if stressed + off-topic
    if any(w in lower for w in STRESS_WORDS) and entry["id"] not in ("wellbeing-services", "crisis-help", "workload-stress", "homesickness"):
        response += "\n\n---\n**Also**: If things feel overwhelming, the **Wellbeing Centre** (Building 54, Level 2) is there — walk-ins welcome, free and confidential."

    return build_response(entry, best_score, response)


def build_response(entry: dict, confidence: float, response: str | None = None):
    return {
        "response": response or entry["response"],
        "followUps": entry.get("followUps", []),
        "entryId": entry["id"],
        "confidence": round(confidence, 3),
    }


def fallback():
    return {
        "response": "I don't have specific info on that yet. Here's what I can help with:\n\n- **Modules** — 10.014, 10.009, 10.001, 10.002, 10.003 and more\n- **Hostel** — move-in, rules, food, laundry\n- **Admin** — student card, email, fees, international students\n- **Fifth Row** — clubs, FabLab, sports, arts, makers\n- **Wellbeing** — counselling, managing stress, crisis hotlines\n- **Career** — internships, iCube, exchange programmes\n- **Singapore life** — transport, food, weekend activities\n\nTry rephrasing, or check the **Knowledge Base** tab for articles!",
        "followUps": ["What modules do I take?", "Tell me about the hostel", "Where do I get my student card?"],
        "entryId": "fallback",
        "confidence": 0.0,
    }


@app.get("/health")
def health():
    return {"status": "ok", "entries": len(KB)}
