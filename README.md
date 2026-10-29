# IT WORLD JERSEY Video

Mobile-first video feed for **IT WORLD JERSEY**. This repository is a web-first starter designed for Cloudflare Pages, with a future Cloudflare Worker API.

## Current starter features

- Responsive video-feed interface with top and bottom navigation
- Like interaction, share, WhatsApp order link and More menu
- More menu actions for download, copy link and report (API-dependent actions are clearly marked as not connected)
- Brand-owned domain links
- No API keys or secrets committed to source

## Canonical domain plan

- Videos: https://videos.itworldjersey.store
- Live Sale: https://itworldjersey.store/live/
- Main store: https://itworldjersey.store
- Shop: https://itworldjersey.store/shop
- Custom design: https://itworldjersey.store/custom-design.html
- Inbox: https://messenger.profile.itworldjersey.store
- Profile: https://profile.itworldjersey.store
- Sign in: https://signin.profile.itworldjersey.store
- Register: https://signup.profile.itworldjersey.store
- Admin: https://admin.itworldjersey.store

## Deploy to Cloudflare Pages

1. In Cloudflare, open **Workers & Pages** and create a Pages project connected to this repository.
2. Select `main` as the production branch.
3. This is a static HTML/CSS/JavaScript starter, so no build command is required.
4. Set the output directory to the repository root if supported. If the Pages setup requires a dedicated output directory, move the static files into `public/` and use `public`.
5. The existing Pages project uses `videos.itworldjersey.store` as its branded custom domain.

Keep all new links and configuration on the canonical store domain or its verified subdomains. Verify each route before removing any legacy DNS records.

## API and security notes

The current files are a frontend prototype, not a production social network. Likes, comments, reports, authentication, moderation, video storage and admin actions need server-side APIs. Never put API tokens in browser JavaScript; use Cloudflare Worker secrets and validate write actions on the server.

## Reference and attribution

Reference project: [matheuspelegrino/tiktok-clone](https://github.com/matheuspelegrino/tiktok-clone). Its README states that the project is MIT-licensed. The current HTML/CSS/JavaScript starter is an independent implementation and does not copy its Expo/React Native source files. If source code or assets from the reference project are copied in a future commit, retain the original copyright and license notice and verify the exact upstream LICENSE file first.

## License

The original starter files in this repository are licensed under the MIT License; see [LICENSE](./LICENSE). Third-party code and assets added later remain subject to their respective licenses.
