# ITMS - Intramural Team Management System

A comprehensive platform for managing McGill Athletics intramural sports leagues, teams, and schedules.

## 🎯 Features

### Sprint A (US001-US010)
- ✅ **US001**: Player Registration with McGill email validation
- ✅ **US002**: Join Team - Request to join existing teams
- ✅ **US003**: Season Creation - Admin creates sport seasons
- ✅ **US004**: Schedule Management - Admin dashboard with conflict detection
- ✅ **US005**: Find Player - Search player directory
- ✅ **US006**: Review Player Request - Captain approves/rejects join requests
- ✅ **US007**: Player Skill Level Update - Update profile skill level
- ✅ **US008**: Availability Management - Mark availability for games
- ✅ **US009**: Leave Team - Player leaves a team
- ✅ **US010**: Team Creation - Captain creates new teams

### Sprint B (US011-US015)
- 🔄 **US011**: Game Score Reporting
- 🔄 **US012**: League Standings View
- 🔄 **US013**: Incident Reporting
- 🔄 **US014**: Facility Booking
- 🔄 **US015**: Team Roster Management

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (MVP uses mock data)
- **Authentication**: Mock auth (simulates McGill SSO)
- **Testing**: Vitest + Cucumber
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run Cucumber acceptance tests
npm run test:acceptance

# Run all tests
npm run test:all
```

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── player/         # Player role pages
│   │   ├── captain/        # Captain role pages
│   │   └── admin/          # Administrator pages
│   ├── actions/            # Server actions
│   │   ├── auth.ts        # Authentication actions
│   │   ├── teams.ts       # Team management actions
│   │   ├── seasons.ts     # Season management actions
│   │   ├── schedule.ts    # Schedule management actions
│   │   └── players.ts     # Player management actions
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   └── shared/            # Shared components (navbar, etc.)
├── lib/
│   ├── mock-auth.ts       # Mock authentication
│   ├── mock-data.ts       # Mock database
│   ├── utils.ts           # Utility functions
│   └── supabase/          # Supabase client (future)
└── types/
    ├── database.ts        # Database types
    └── index.ts           # Application types

tests/
├── unit/                  # Vitest unit tests
├── acceptance/
│   ├── features/         # Cucumber feature files
│   └── steps/            # Step definitions
└── setup.ts              # Test configuration

context/deliverables/
├── SprintA/              # Sprint A deliverables
│   ├── Week1/           # Week 1 task lists
│   ├── Week2/           # Week 2 task lists
│   ├── Week3/           # Week 3 task lists
│   └── Spring Backlog and Done Checklist/
└── SprintB/              # Sprint B deliverables
    └── (similar structure)
```

## 🧪 Testing Approach

### Unit Tests
- Test server actions directly with FormData inputs
- Cover all success, error, and alternate flows
- Located in `tests/unit/`

### Acceptance Tests
- Gherkin feature files from user stories
- Step definitions call server actions
- Located in `tests/acceptance/`

## 👥 User Roles

The system supports 5 user roles:
1. **Player** - Join teams, manage availability, search players
2. **Captain** - Create teams, manage rosters, review join requests
3. **Administrator** - Manage leagues, seasons, schedules
4. **Game Official** - Report scores and incidents
5. **Facility Manager** - Manage venues and bookings

## 🔐 Mock Authentication

For MVP development, the app uses mock authentication:

**Test Accounts:**
- Player: `john.doe@mail.mcgill.ca` / `Password1!`
- Captain: `captain.kirk@mail.mcgill.ca` / `Password1!`
- Admin: `admin@mcgill.ca` / `Password1!`
- Official: `ref.jones@mail.mcgill.ca` / `Password1!`

Use the user switcher in the navigation bar to test different roles.

## 📊 Domain Model

See [DomainModel.mmd](./DomainModel.mmd) for the complete Mermaid class diagram showing all entities, enumerations, and relationships.

## 📝 User Stories

All user stories are documented as Gherkin feature files in:
- `context/deliverables/SprintA/Spring Backlog and Done Checklist/Features/`
- `context/deliverables/SprintB/Spring Backlog and Done Checklist/Features/`

## 🎨 Design System

- **Theme**: Dark mode with CSS variables
- **Colors**: Semantic color system (primary, secondary, accent, destructive, etc.)
- **Components**: Shadcn-style components with Tailwind CSS
- **Typography**: Inter font family

## 📈 Development Process

- **Methodology**: Scrum with 3-week sprints
- **Version Control**: Git with feature branches
- **Code Review**: Pull requests required
- **CI/CD**: GitHub Actions for testing and deployment
- **Done Checklist**: See project preparation documents

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Create a pull request
5. Wait for code review approval
6. Merge to `main`

## 📄 License

This project is for educational purposes as part of ECSE 428 at McGill University.

## 👨‍💻 Team

- David Zhou - Scrum Master (Sprint A)
- Toufic Jrab - Proxy PO / Scrum Master (Sprint B)
- Nathan Audegond - Developer
- Fahim Bashar - Developer
- Thibaut Chan Teck Su - Developer
- Eric Deng - Developer
- Farhad Guliyev - Developer
- Haoyuan Sun - Developer
- David Vo - Developer
- Zhenxuan Zhao - Developer
- Shengyi Zhong - Developer

## 📞 Support

For issues or questions, please open an issue on GitHub.

