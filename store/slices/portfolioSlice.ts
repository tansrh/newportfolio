import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AboutData {
    name: string;
    title: string;
    email: string;
    location: string;
    bio: string;
}
export interface ExperienceData {
    organisation: string;
    designation: string;
    from: string;
    to?: string;
    isCurrent: boolean;
    description?: string;
}
export interface AchievementsData {
    title: string;
    year: string;
    description?: string;
}
export interface ContactData {
    method: string;
    value: string;
}
export interface PortfolioData {
    about: AboutData;
    experience: ExperienceData[];
    achievements: AchievementsData[];
    contact: ContactData[];
    projects: ProjectData[];
}

export interface ProjectData {
    title: string;
    description: string;
    link?: string;
}

const initialState: PortfolioData = {
    about: {
        name: 'Alexandra Bennett',
        title: 'Senior Journalist',
        email: 'alex.bennett@newsworld.com',
        location: 'New York, USA',
        bio: 'Alexandra Bennett is an award-winning journalist with over 20 years of experience in investigative reporting, political analysis, and feature writing. She has contributed to major publications and is known for her integrity and impactful storytelling.'
    },
    experience: [
        {
            organisation: 'NewsWorld',
            designation: 'Senior Reporter',
            from: '2015-01-01', // January 1, 2015
            isCurrent: true,
            description: 'Leading investigative journalism and reporting on major global events.'
        },
        {
            organisation: 'Global Times',
            designation: 'Investigative Journalist',
            from: '2010-06-15', // June 15, 2010
            to: '2015-12-31',   // December 31, 2015
            isCurrent: false,
            description: 'Conducted in-depth investigations and published award-winning reports.'
        },
        {
            organisation: 'City Herald',
            designation: 'Staff Writer',
            from: '2005-09-10', // September 10, 2005
            to: '2010-03-20',   // March 20, 2010
            isCurrent: false,
            description: 'Covered local news and developed feature stories.'
        }
    ],
    achievements: [
        {
            title: 'Pulitzer Prize Finalist',
            year: '2022',
            description: 'Recognized for outstanding investigative reporting.'
        },
        {
            title: 'National Press Award Winner',
            year: '2018',
            description: 'Awarded for excellence in journalism.'
        },
        {
            title: 'Best Investigative Report',
            year: '2010',
            description: 'Honored for a groundbreaking local investigation.'
        }
    ],
    contact: [
        { method: 'email', value: 'alex.bennett@newsworld.com' },
        { method: 'location', value: 'New York, USA' },
        { method: 'phone', value: '+1-555-123-4567' },
        { method: 'website', value: 'www.alexbennettjournalist.com' }
    ],
    projects: [
        {
            title: 'Global Investigations Portal',
            description: 'A web platform for sharing investigative journalism resources and reports.',
            link: 'https://globalinvestigations.com'
        },
        {
            title: 'Election Analysis Dashboard',
            description: 'Interactive dashboard for real-time election coverage and analysis.',
            link: 'https://electiondashboard.com'
        },
        {
            title: 'Human Rights Watch Series',
            description: 'A series of articles highlighting human rights issues worldwide.'
        }
    ]
};

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        updatePortfolio(state, action: PayloadAction<Partial<PortfolioData>>) {
            return { ...state, ...action.payload };
        },
    },
});

export const { updatePortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
