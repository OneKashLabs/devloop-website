import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {themes} from 'prism-react-renderer';

const DESCRIPTION =
  'A test-driven development plugin for Claude Code and Codex, with review agents that check the plan before coding and the diff before commit.';
const REPO = 'https://github.com/OneKashLabs/devloop';
// The one organization every OneKash Labs site points to, defined on onekash.org.
const ORG = {'@type': 'Organization', '@id': 'https://onekash.org/#org', name: 'OneKash Labs', url: 'https://onekash.org'};

// Code blocks on the hero's ink, so commands read as part of the logo's palette.
const codeTheme = {...themes.palenight, plain: {...themes.palenight.plain, backgroundColor: '#0d1124'}};

const config: Config = {
  title: 'devloop',
  tagline: 'Spec, plan and build, with independent review',
  favicon: 'img/favicon.png',
  future: {v4: true},
  url: 'https://devloop.onekash.org',
  baseUrl: '/',
  organizationName: 'OneKashLabs',
  projectName: 'devloop-website',
  // GitHub Pages serves /path/index.html at /path/, so links use the slash form.
  trailingSlash: true,
  onBrokenLinks: 'throw',
  i18n: {defaultLocale: 'en', locales: ['en']},
  headTags: [
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', href: '/img/logo.png'}},
    {tagName: 'meta', attributes: {name: 'theme-color', content: '#0d1124'}},
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'devloop',
        url: 'https://devloop.onekash.org',
        description: DESCRIPTION,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS, Linux, Windows',
        softwareVersion: '4.0.0',
        downloadUrl: REPO,
        softwareHelp: `${REPO}/issues`,
        license: 'https://www.apache.org/licenses/LICENSE-2.0',
        image: 'https://devloop.onekash.org/img/logo.png',
        offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
        sameAs: [REPO],
        author: ORG,
        publisher: ORG,
      }),
    },
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'devloop',
        url: 'https://devloop.onekash.org/',
        publisher: ORG,
      }),
    },
  ],
  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      {name: 'description', content: DESCRIPTION},
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'devloop'},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {property: 'og:image:alt', content: 'devloop: spec, plan and build, with independent review. The install command and the devloop mark.'},
      {name: 'twitter:image:alt', content: 'devloop: spec, plan and build, with independent review. The install command and the devloop mark.'},
    ],
    colorMode: {respectPrefersColorScheme: true},
    prism: {theme: codeTheme, darkTheme: codeTheme, additionalLanguages: ['bash', 'json', 'markdown']},
    navbar: {
      title: 'devloop',
      logo: {alt: 'devloop logo', src: 'img/icon-rounded.png'},
      items: [
        // The home page is not these links' page, so they never show as the current one.
        {to: '/#loop', label: 'The loop', position: 'left', activeBaseRegex: '^$'},
        {to: '/#review', label: 'Review', position: 'left', activeBaseRegex: '^$'},
        {to: '/#install', label: 'Install', position: 'left', activeBaseRegex: '^$'},
        {href: 'https://github.com/sponsors/one-kash', label: 'Donate', position: 'right'},
        {href: REPO, label: 'Source', position: 'right'},
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          items: [
            {label: 'Install', to: '/#install'},
            {label: 'Full reference', href: `${REPO}#readme`},
            {label: 'Changelog', href: `${REPO}/blob/main/CHANGELOG.md`},
            {label: 'Stack examples', href: `${REPO}/tree/main/examples`},
            {label: 'Report a problem', href: `${REPO}/issues`},
            {label: 'Donate', href: 'https://github.com/sponsors/one-kash'},
            {label: 'Source', href: REPO},
          ],
        },
      ],
      copyright:
        'Built with love in Austin by <a href="https://onekash.org">onekash labs</a>. Free and open source under Apache-2.0.',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
