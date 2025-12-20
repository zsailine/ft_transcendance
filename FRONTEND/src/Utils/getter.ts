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

export const getBanner = async (username: string | null, setBanner: (image: ImageBuffer) => void) => {
	const response = await api.get(`/users/${username}/banner`);
	if (response) {
		setBanner(response.data.cover_image);
	}
}

export const getSetAvatar = async (username: string | null, setAvatar: (image: ImageBuffer) => void) => {
	const response = await api.get(`/users/${username}/avatar`);
	if (response) {
		setAvatar(response.data.avatar);
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

export const getId = async (username: string | null) => {
	const response = await api.get(`/users/${username}/id`);
	if (response.data.id) {
		return response.data.id;
	}
}

export const getAvatar = async (username: string | null) => {
	const response = await api.get(`/users/${username}/avatar`);
	if (response.data.avatar) {
		return response.data.avatar;
	}
}

export const getUserInfo = async (username: string | null) => {
	const response = await api.get(`/users/${username}/info`);
	if (response.data) {
		return response.data;
	}
}
