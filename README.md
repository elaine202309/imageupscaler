# Image Upscaler

AI-powered image upscaling tool. Choose target resolution (HD / 2K / 4K) and get enhanced images in seconds.

Built with Next.js + fal.ai SeedVR2.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add your FAL_KEY from https://fal.ai/dashboard/keys
npm run dev
```

Open http://localhost:3000

## API

```bash
# Submit upscale
curl -X POST http://localhost:3000/api/upscale \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "IMAGE_URL", "target": "HD|2K|4K"}'

# Check result
curl http://localhost:3000/api/upscale/{requestId}
```

## Deploy

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Set env var `FAL_KEY` in Vercel dashboard
4. Deploy

## Pricing

| Plan | Price | Credits | Max Resolution |
|---|---|---|---|
| Free | $0 | 5/mo | HD |
| Plus | $6/mo | 100/mo | 4K |
| Pro | $12/mo | 300/mo | 4K |

| Resolution | Credits | Long Edge |
|---|---|---|
| HD | 1 | 1080px |
| 2K | 2 | 1440px |
| 4K | 5 | 2160px |
