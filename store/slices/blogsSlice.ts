import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BlogData {
	id: string;
	title: string;
	subtitle?: string;
	content: string;
	image?: string;
	createdAt: string; // ISO string
}

export interface BlogsState {
	blogs: BlogData[];
	searchResults?: BlogData[];
	selectedBlog: BlogData | null;
}

const initialState: BlogsState = {
	blogs: [
		{
			id: '1',
			title: 'Investigating the Future of Journalism',
			subtitle: 'How technology is changing the newsroom',
			content: 'A deep dive into the impact of AI, automation, and digital platforms on modern journalism. Includes interviews with industry leaders and predictions for the next decade.',
			image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            createdAt: new Date('2025-11-01').toISOString()
		},
		{
			id: '1',
			title: 'Investigating the Future of Journalism',
			subtitle: 'How technology is changing the newsroom',
			content: 'A deep dive into the impact of AI, automation, and digital platforms on modern journalism. Includes interviews with industry leaders and predictions for the next decade.',
			image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
			createdAt: new Date('2025-11-01').toISOString()
		},
		{
			id: '2',
			title: 'Reporting from Conflict Zones',
			subtitle: 'Stories from the frontlines',
			content: 'Personal accounts and lessons learned from covering wars and humanitarian crises around the world. Tips for safety, ethics, and storytelling under pressure.',
			image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
			createdAt: new Date('2025-11-05').toISOString()
		},
		{
			id: '3',
			title: 'The Rise of Citizen Journalism',
			subtitle: 'Empowering voices everywhere',
			content: 'Exploring the growth of citizen reporting, social media activism, and the challenges of verifying grassroots news. Includes case studies and expert commentary.',
			image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
			createdAt: new Date('2025-11-10').toISOString()
		}
	],
    selectedBlog: null
};

const blogsSlice = createSlice({
	name: 'blogs',
	initialState,
	reducers: {
		setBlogs(state, action: PayloadAction<BlogData[]>) {
			state.blogs = action.payload;
		},
		addBlog(state, action: PayloadAction<BlogData>) {
			state.blogs.push(action.payload);
		},
		removeBlog(state, action: PayloadAction<number>) {
			state.blogs.splice(action.payload, 1);
		},
		setSearchResults(state, action: PayloadAction<BlogData[]>) {
			state.searchResults = action.payload;
		},
		clearSearchResults(state) {
			state.searchResults = undefined;
		},
		setSelectedBlog(state, action: PayloadAction<BlogData | null>) {
			state.selectedBlog = action.payload;
		}
	}
});

export const { setBlogs, addBlog, removeBlog, setSearchResults, clearSearchResults, setSelectedBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
