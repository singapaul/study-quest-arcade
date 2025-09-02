# 🚀 Deployment Guide - Study Quest Arcade

## 📋 Prerequisites
- GitHub repository connected to Vercel
- Supabase project set up
- Vercel account

## 🔧 Environment Variables Setup

### 1. Local Development (.env.local)
Create a `.env.local` file in your project root:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://bkbtkbfnxtzxhupcqsdp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYnRrYmZueHR6eGh1cGNxc2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzAyNTEsImV4cCI6MjA3MTk0NjI1MX0.qy2-3E56Jk-6HL2jNBNci4sBYQM9LxS3-yeLR8q3MwY

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Study Quest Arcade
```

### 2. Vercel Production Environment
In your Vercel dashboard, add these environment variables:

**Production Environment:**
```
VITE_SUPABASE_URL=https://bkbtkbfnxtzxhupcqsdp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYnRrYmZueHR6eGh1cGNxc2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzAyNTEsImV4cCI6MjA3MTk0NjI1MX0.qy2-3E56Jk-6HL2jNBNci4sBYQM9LxS3-yeLR8q3MwY
VITE_APP_URL=https://study-quest-arcade.vercel.app
VITE_APP_NAME=Study Quest Arcade
```

## 🔐 Supabase Configuration

### 1. Update Authentication Settings
Go to your Supabase dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://study-quest-arcade.vercel.app
```

**Redirect URLs:**
```
https://study-quest-arcade.vercel.app/auth/callback
```

### 2. Add Additional Redirect URLs (Required for Development)
You need to add both development and production URLs:
```
http://localhost:5173/auth/callback
https://study-quest-arcade.vercel.app/auth/callback
```

**Important**: Make sure both URLs are added to the "Redirect URLs" list in your Supabase dashboard. This allows magic links to work in both development and production environments.

## 🚀 Vercel Deployment

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `study-quest-arcade` repository

### 2. Configure Build Settings
Vercel will auto-detect it's a Vite app, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Add Environment Variables
Add the production environment variables listed above.

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## ✅ Verification

### 1. Check Authentication
- Visit your deployed app
- Try to sign in with magic link
- Verify redirect works correctly

### 2. Check Console
- Open browser DevTools
- Look for any errors in Console tab
- Verify all assets load correctly

### 3. Test Routes
- Navigate to `/profile`
- Navigate to `/revision`
- Verify no 404 errors

## 🔄 Updating Environment Variables

### Local Development
Update `.env.local` and restart dev server:
```bash
npm run dev
```

### Production
Update in Vercel dashboard and redeploy automatically.

## 🐛 Troubleshooting

### Common Issues:
1. **404 on routes**: Ensure Vercel has proper rewrite rules
2. **Auth callback fails**: Check Supabase redirect URLs
3. **Environment variables not working**: Verify Vercel env vars are set
4. **Build fails**: Check build logs in Vercel dashboard

### Support:
- Check Vercel deployment logs
- Verify environment variables are set correctly
- Ensure Supabase configuration matches production URL

## 📱 Final URLs

**Production:**
- App: https://study-quest-arcade.vercel.app
- Auth Callback: https://study-quest-arcade.vercel.app/auth/callback

**Development:**
- App: http://localhost:5173
- Auth Callback: http://localhost:5173/auth/callback
