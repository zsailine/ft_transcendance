import api from "./axios";
import type { ImageBuffer } from "../Providers/DashboardProvider";

export interface statInterface {
	total_matches: number | 0,
	total_losses: number | 0,
	total_wins: number | 0
}

export const getStat = async (username: string | null, setStat: (stat: statInterface) => void) => {
	const response = await api.get(`/matches/stats/${username}`);
	if (response.data.total_matches) {
		setStat(response.data);
	}
}

export const getBanner = async (username: string | null, setBanner: (image: ImageBuffer | null) => void) => {
	const response = await api.get(`/users/${username}/banner`);
	if (response) {
		setBanner(response.data.cover_image);
	}
}

export const getBlocker = async (username: string | null, setBlocker: (user: string | null) => void) => {
	const response = await api.get(`/friend/${username}/blocked_by`);
	if (response) {
		setBlocker(response.data.blocked_by);
	}
}

export const getRelationship = async (username: string | null, setRelation: (user: string | null) => void) => {
	const response = await api.get(`/friend/status/${username}`);
	if (response) {
		setRelation(response.data.status);
	}
}
