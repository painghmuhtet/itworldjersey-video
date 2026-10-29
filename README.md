# IT WORLD JERSEY Video

Mobile-first video feed for **IT WORLD JERSEY**. This repository is a web-first starter designed for Cloudflare Pages, with a future Cloudflare Worker API.

## Canonical domain plan

- Main store: https://itworldjersey.store/
- Shop: https://itworldjersey.store/shop/
- Videos: https://videos.itworldjersey.store/
- Live Sale: https://itworldjersey.store/live/
- Product media: https://media.itworldjersey.store/

The retired `itworldlive.stream` domain must not be used for new links or configuration. The store domain and its subdomains are the canonical domain family.

## Current starter features

- Responsive video-feed interface with top and bottom navigation
- Like interaction, share, WhatsApp order link and More menu
- More menu actions for download, copy link and report (API-dependent actions are clearly marked as not connected)
- Brand-owned domain links
- No API keys or secrets committed to source

## Deploy to Cloudflare Pages

1. In Cloudflare, open Workers & Pages and connect this repository.
2. Select `main` as the production branch.
3. This is a static HTML/CSS/JavaScript starter, so no build command is required.
4. Use the repository root as output directory if supported.
5. Add `videos.itworldjersey.store` as a custom domain after the Pages project has deployed.

Do not change DNS or remove legacy domain records until the canonical website and subdomain routes have been verified.

## API and security notes

The current files are a frontend prototype, not a production social network. Likes, comments, reports, authentication, moderation, video storage and admin actions need server-side APIs. Never put API tokens in browser JavaScript; use Cloudflare Worker secrets and validate write actions on the server.

## Reference and attribution

Reference project: [matheuspelegrino/tiktok-clone](https://github.com/matheuspelegrino/tiktok-clone). Its README states that the project is MIT-licensed. If source code or assets from the reference project are copied in a future commit, retain the original copyright and license notice and verify the exact upstream LICENSE file first.

## License

The original starter files in this repository are licensed under the MIT License; see [LICENSE](./LICENSE). Third-party code and assets added later remain subject to their respective licenses.
