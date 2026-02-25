# Deployment Guide (Vercel)

This project is built with **Next.js**, so the easiest and best place to deploy it is **Vercel**.

## Prerequisites
- [x] GitHub Account
- [x] Project pushed to GitHub
- [ ] Vercel Account (Create one at [vercel.com](https://vercel.com/signup))

## Step 1: Import Project to Vercel
1.  Log in to your **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  You will see a list of your GitHub repositories. Find `stuco-portal` and click **"Import"**.

> **Cost Note:** When asked to select a plan, choose **"Hobby"**. It is completely **FREE** for personal projects.

## Step 2: Configure Project
1.  **Framework Preset**: It should automatically detect `Next.js`. Leave this as is.
2.  **Root Directory**: Leave as `./`.

## Step 3: Environment Variables (CRITICAL)
You need to copy the values from your local `.env.local` file into Vercel.
Expand the **"Environment Variables"** section and add the following:

| Key | Value Source |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Copy from `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Copy from `.env.local` |
| `ADMIN_PASSWORD` | Copy from `.env.local` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | Copy from `.env.local` (your gmail) |
| `EMAIL_PASS` | Copy from `.env.local` (your app password) |

> **Note:** Open your local `.env.local` file to copy the actual secret values (starting with `eyJ...` or your passwords).

## Step 4: Deploy
1.  Click **"Deploy"**.
2.  Wait for the build to finish (usually 1-2 minutes).
3.  Once done, you will get a live URL (e.g., `stuco-portal.vercel.app`).

## Verifying Deployment
- Visit the live URL.
- Go to `/admin` and try logging in with your password.
- Test the "Contact Us" or "Feedback" forms to ensure emails are sending.

## Limits & Scaling (University Launch)
For a university-wide launch, the **Free "Hobby" Plan** is usually sufficient! Here are the limits:

*   **Bandwidth**: 100 GB / month (Enough for ~50,000+ page views)
*   **Users**: Unlimited visitors.
*   **Cost**: $0

**When to upgrade?**
You only need to pay ($20/mo) if:
1.  You exceed the 100GB bandwidth (very hard to do with text/image sites).
2.  You need "Teams" features (multiple developers working on the Vercel dashboard).

**Verdict:** You are safe to stay on the Free plan for now! 🚀
