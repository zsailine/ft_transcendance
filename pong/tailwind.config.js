/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  "./*.html",
	  "./src/**/*.{js,ts}",
	  "./dist/*.js"
	],
	theme: {
	  extend: {},
	},
	plugins: [],
  }
  
  module.exports = {
	content: [
	  "./*.html",
	  "./src/**/*.{js,ts}",
	  "./dist/*.js"
	],
	plugins: [
	  require('@tailwindcss/forms'),
	],
	safelist: [
	  'bg-black/25', 'bg-black/40', 'bg-black/50', 'bg-white'
	],
  };