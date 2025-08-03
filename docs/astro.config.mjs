// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: "https://apt-swarm.ktrain5369.dev",
  integrations: [
    starlight({
      title: "Swarm APT Documentation",
      customCss: ["./src/styles/swarmify.css", "./src/styles/pr-maker.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/neuroverse-fm/apt-swarm",
        },
      ],
      sidebar: [
        {
          label: "Installation",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "How to install the repo", slug: "installation" },
          ],
        },
        {
          label: "Uploading a package",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Prerequisites", slug: "uploading/prereqs" },
            { label: "Uploading a new Package", slug: "uploading/newpackage" },
          ],
        },
        {
          label: "Packages",
          autogenerate: { directory: "packages" },
        },
        "pr-maker",
      ],
    }),
    preact(),
  ],
});
