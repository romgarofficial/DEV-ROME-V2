import { getSimpleIcon } from "@/lib/simple-icon";

export type SocialCategory =
  | "social"
  | "professional"
  | "developer"
  | "messaging"
  | "creative"
  | "media";

export type SocialPlatform = {
  slug: string;
  label: string;
  category: SocialCategory;
  placeholder: string;
  mark?: string;
};

export const SOCIAL_CATEGORY_LABELS: Record<SocialCategory, string> = {
  social: "Social",
  professional: "Professional",
  developer: "Developer",
  messaging: "Messaging",
  creative: "Creative",
  media: "Media",
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { slug: "x", label: "X (Twitter)", category: "social", placeholder: "https://x.com/username" },
  { slug: "instagram", label: "Instagram", category: "social", placeholder: "https://instagram.com/username" },
  { slug: "facebook", label: "Facebook", category: "social", placeholder: "https://facebook.com/username" },
  { slug: "threads", label: "Threads", category: "social", placeholder: "https://threads.net/@username" },
  { slug: "tiktok", label: "TikTok", category: "social", placeholder: "https://tiktok.com/@username" },
  { slug: "reddit", label: "Reddit", category: "social", placeholder: "https://reddit.com/user/username" },
  { slug: "pinterest", label: "Pinterest", category: "social", placeholder: "https://pinterest.com/username" },
  { slug: "snapchat", label: "Snapchat", category: "social", placeholder: "https://snapchat.com/add/username" },
  { slug: "tumblr", label: "Tumblr", category: "social", placeholder: "https://username.tumblr.com" },
  { slug: "bluesky", label: "Bluesky", category: "social", placeholder: "https://bsky.app/profile/username" },
  { slug: "mastodon", label: "Mastodon", category: "social", placeholder: "https://mastodon.social/@username" },
  { slug: "nextdoor", label: "Nextdoor", category: "social", placeholder: "https://nextdoor.com/profile/username" },

  { slug: "linkedin", label: "LinkedIn", category: "professional", placeholder: "https://linkedin.com/in/username", mark: "in" },
  { slug: "xing", label: "Xing", category: "professional", placeholder: "https://xing.com/profile/username" },
  { slug: "wellfound", label: "Wellfound", category: "professional", placeholder: "https://wellfound.com/u/username" },
  { slug: "upwork", label: "Upwork", category: "professional", placeholder: "https://upwork.com/freelancers/username" },
  { slug: "fiverr", label: "Fiverr", category: "professional", placeholder: "https://fiverr.com/username" },
  { slug: "indeed", label: "Indeed", category: "professional", placeholder: "https://indeed.com" },
  { slug: "glassdoor", label: "Glassdoor", category: "professional", placeholder: "https://glassdoor.com" },
  { slug: "microsoft", label: "Microsoft", category: "professional", placeholder: "https://microsoft.com", mark: "MS" },
  { slug: "google", label: "Google", category: "professional", placeholder: "https://google.com" },
  { slug: "linktree", label: "Linktree", category: "professional", placeholder: "https://linktr.ee/username" },
  { slug: "calendly", label: "Calendly", category: "professional", placeholder: "https://calendly.com/username" },
  { slug: "caldotcom", label: "Cal.com", category: "professional", placeholder: "https://cal.com/username" },
  { slug: "notion", label: "Notion", category: "professional", placeholder: "https://username.notion.site" },

  { slug: "github", label: "GitHub", category: "developer", placeholder: "https://github.com/username" },
  { slug: "gitlab", label: "GitLab", category: "developer", placeholder: "https://gitlab.com/username" },
  { slug: "bitbucket", label: "Bitbucket", category: "developer", placeholder: "https://bitbucket.org/username" },
  { slug: "stackoverflow", label: "Stack Overflow", category: "developer", placeholder: "https://stackoverflow.com/users/id" },
  { slug: "codepen", label: "CodePen", category: "developer", placeholder: "https://codepen.io/username", mark: "CP" },
  { slug: "codesandbox", label: "CodeSandbox", category: "developer", placeholder: "https://codesandbox.io/u/username" },
  { slug: "replit", label: "Replit", category: "developer", placeholder: "https://replit.com/@username" },
  { slug: "leetcode", label: "LeetCode", category: "developer", placeholder: "https://leetcode.com/u/username" },
  { slug: "hackerrank", label: "HackerRank", category: "developer", placeholder: "https://hackerrank.com/username" },
  { slug: "codewars", label: "Codewars", category: "developer", placeholder: "https://codewars.com/users/username" },
  { slug: "kaggle", label: "Kaggle", category: "developer", placeholder: "https://kaggle.com/username" },
  { slug: "hashnode", label: "Hashnode", category: "developer", placeholder: "https://hashnode.com/@username" },
  { slug: "devdotto", label: "Dev.to", category: "developer", placeholder: "https://dev.to/username" },
  { slug: "huggingface", label: "Hugging Face", category: "developer", placeholder: "https://huggingface.co/username" },
  { slug: "npm", label: "npm", category: "developer", placeholder: "https://npmjs.com/~username" },
  { slug: "docker", label: "Docker", category: "developer", placeholder: "https://hub.docker.com/u/username" },

  { slug: "whatsapp", label: "WhatsApp", category: "messaging", placeholder: "https://wa.me/15551234567" },
  { slug: "telegram", label: "Telegram", category: "messaging", placeholder: "https://t.me/username" },
  { slug: "discord", label: "Discord", category: "messaging", placeholder: "https://discord.com/users/id" },
  { slug: "signal", label: "Signal", category: "messaging", placeholder: "https://signal.me/#p/+15551234567" },
  { slug: "messenger", label: "Messenger", category: "messaging", placeholder: "https://m.me/username" },
  { slug: "slack", label: "Slack", category: "messaging", placeholder: "https://your-workspace.slack.com", mark: "Sl" },
  { slug: "skype", label: "Skype", category: "messaging", placeholder: "skype:username?chat", mark: "Sk" },
  { slug: "wechat", label: "WeChat", category: "messaging", placeholder: "https://wechat.com" },
  { slug: "line", label: "LINE", category: "messaging", placeholder: "https://line.me/ti/p/username" },
  { slug: "zoom", label: "Zoom", category: "messaging", placeholder: "https://zoom.us/j/id" },
  { slug: "gmail", label: "Gmail", category: "messaging", placeholder: "mailto:you@gmail.com" },
  { slug: "protonmail", label: "Proton Mail", category: "messaging", placeholder: "mailto:you@proton.me" },
  { slug: "matrix", label: "Matrix", category: "messaging", placeholder: "https://matrix.to/#/@user:server" },
  { slug: "element", label: "Element", category: "messaging", placeholder: "https://app.element.io" },
  { slug: "keybase", label: "Keybase", category: "messaging", placeholder: "https://keybase.io/username" },

  { slug: "dribbble", label: "Dribbble", category: "creative", placeholder: "https://dribbble.com/username" },
  { slug: "behance", label: "Behance", category: "creative", placeholder: "https://behance.net/username" },
  { slug: "figma", label: "Figma", category: "creative", placeholder: "https://figma.com/@username" },
  { slug: "medium", label: "Medium", category: "creative", placeholder: "https://medium.com/@username" },
  { slug: "substack", label: "Substack", category: "creative", placeholder: "https://username.substack.com" },
  { slug: "patreon", label: "Patreon", category: "creative", placeholder: "https://patreon.com/username" },
  { slug: "buymeacoffee", label: "Buy Me a Coffee", category: "creative", placeholder: "https://buymeacoffee.com/username" },
  { slug: "kofi", label: "Ko-fi", category: "creative", placeholder: "https://ko-fi.com/username" },
  { slug: "gumroad", label: "Gumroad", category: "creative", placeholder: "https://username.gumroad.com" },
  { slug: "producthunt", label: "Product Hunt", category: "creative", placeholder: "https://producthunt.com/@username" },
  { slug: "flickr", label: "Flickr", category: "creative", placeholder: "https://flickr.com/photos/username" },
  { slug: "vsco", label: "VSCO", category: "creative", placeholder: "https://vsco.co/username" },
  { slug: "wordpress", label: "WordPress", category: "creative", placeholder: "https://username.wordpress.com" },
  { slug: "blogger", label: "Blogger", category: "creative", placeholder: "https://username.blogspot.com" },

  { slug: "youtube", label: "YouTube", category: "media", placeholder: "https://youtube.com/@username" },
  { slug: "twitch", label: "Twitch", category: "media", placeholder: "https://twitch.tv/username" },
  { slug: "vimeo", label: "Vimeo", category: "media", placeholder: "https://vimeo.com/username" },
  { slug: "kick", label: "Kick", category: "media", placeholder: "https://kick.com/username" },
  { slug: "spotify", label: "Spotify", category: "media", placeholder: "https://open.spotify.com/user/username" },
  { slug: "soundcloud", label: "SoundCloud", category: "media", placeholder: "https://soundcloud.com/username" },
  { slug: "applemusic", label: "Apple Music", category: "media", placeholder: "https://music.apple.com/profile/username" },
  { slug: "youtubemusic", label: "YouTube Music", category: "media", placeholder: "https://music.youtube.com" },
  { slug: "bandcamp", label: "Bandcamp", category: "media", placeholder: "https://username.bandcamp.com" },
  { slug: "mixcloud", label: "Mixcloud", category: "media", placeholder: "https://mixcloud.com/username" },
  { slug: "letterboxd", label: "Letterboxd", category: "media", placeholder: "https://letterboxd.com/username" },
  { slug: "goodreads", label: "Goodreads", category: "media", placeholder: "https://goodreads.com/username" },
  { slug: "steam", label: "Steam", category: "media", placeholder: "https://steamcommunity.com/id/username" },
  { slug: "quora", label: "Quora", category: "media", placeholder: "https://quora.com/profile/username" },
  { slug: "wikipedia", label: "Wikipedia", category: "media", placeholder: "https://en.wikipedia.org/wiki/User:username" },
  { slug: "meetup", label: "Meetup", category: "media", placeholder: "https://meetup.com/members/id" },
  { slug: "orcid", label: "ORCID", category: "media", placeholder: "https://orcid.org/0000-0000-0000-0000" },
  { slug: "researchgate", label: "ResearchGate", category: "media", placeholder: "https://researchgate.net/profile/username" },
  { slug: "googlescholar", label: "Google Scholar", category: "media", placeholder: "https://scholar.google.com/citations?user=id" },
];

const PLATFORM_BY_SLUG = new Map(SOCIAL_PLATFORMS.map((platform) => [platform.slug, platform]));

export function socialKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function findSocialPlatform(platform: string) {
  const key = socialKey(platform);
  return (
    PLATFORM_BY_SLUG.get(key) ||
    SOCIAL_PLATFORMS.find((item) => socialKey(item.label) === key || item.slug === platform.toLowerCase()) ||
    null
  );
}

const FALLBACK_PATHS: Record<string, string> = {
  linkedin:
    "M4.98 3.5A2.5 2.5 0 112.5 6a2.5 2.5 0 012.48-2.5zM3 8.98h3.96V21H3zM9.5 8.98H13v1.64h.05c.49-.93 1.7-1.9 3.5-1.9 3.74 0 4.43 2.46 4.43 5.66V21h-3.96v-5.54c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21H9.5z",
};

export function socialIconPath(platform: SocialPlatform | string) {
  const resolved = typeof platform === "string" ? findSocialPlatform(platform) : platform;
  const slug = resolved?.slug || (typeof platform === "string" ? socialKey(platform) : "");
  return (
    getSimpleIcon(slug)?.path ??
    getSimpleIcon(typeof platform === "string" ? platform : resolved?.label)?.path ??
    (slug ? FALLBACK_PATHS[slug] : null) ??
    null
  );
}

export function socialMark(platform: SocialPlatform | string) {
  const resolved = typeof platform === "string" ? findSocialPlatform(platform) : platform;
  if (resolved?.mark) return resolved.mark;
  const label = resolved?.label || (typeof platform === "string" ? platform : "");
  return label.slice(0, 2);
}

export function socialLabel(platform: string) {
  return findSocialPlatform(platform)?.label || platform;
}
