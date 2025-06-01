import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	base: process.env.NODE_ENV === 'production' ? '/Three-JS--Computer/' : '/'
};

export default config;
