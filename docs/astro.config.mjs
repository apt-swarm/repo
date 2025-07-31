// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://neuroverse-fm.github.io',
	base: '/apt-swarm',
	integrations: [
		starlight({
			title: 'Swarm APT Documentation',
			customCss: [
				'./src/styles/swarmify.css',
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/neuroverse-fm/apt-swarm' }],
			sidebar: [
				{
					label: 'Instalation',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'How to install the repo', slug: 'installation' },
					],
				},
				{
					label: 'Uploading a package',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Prerequisites', slug: 'uploading/prereqs' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
