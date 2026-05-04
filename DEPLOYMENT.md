# Blogging App Deployment

This project can be deployed with Vercel or with a VPS using Nginx and PM2.

## Required Production Environment Variables

Backend:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/blogapp
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=https://your-frontend-url.vercel.app
```

Frontend:

```env
VITE_API_URL=https://your-backend-url
```

Use MongoDB Atlas for production. Do not use `mongodb://127.0.0.1:27017/myapp` after deployment unless MongoDB is installed on the same VPS.

## Option 1: Vercel

### Backend

1. Create a new Vercel project.
2. Set root directory to:

```text
backend/backend
```

3. Add backend environment variables:

```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
CLIENT_URL=https://your-frontend-url.vercel.app
```

4. Deploy.
5. Test:

```text
https://your-backend-url.vercel.app/health
```

### Frontend

1. Create another Vercel project.
2. Set root directory to:

```text
frontend/frontend/blogpost
```

3. Add frontend environment variable:

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

4. Deploy.
5. After frontend deployment, update backend `CLIENT_URL` to the final frontend URL and redeploy backend.

## Option 2: VPS With Nginx + PM2

### Backend

```bash
cd backend/backend
npm install
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
```

Create backend `.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
CLIENT_URL=https://your-frontend-domain.com
```

Use `backend/backend/nginx-backend.conf.example` as the Nginx template.

### Frontend

```bash
cd frontend/frontend/blogpost
npm install
npm run build
```

Copy `dist` to:

```text
/var/www/blog-frontend/dist
```

Use `frontend/frontend/blogpost/nginx-frontend.conf.example` as the Nginx template.

## Final Testing Checklist

- Register user works.
- Login returns JWT and saves session.
- Home loads posts.
- Post detail opens.
- Admin login can access dashboard.
- Admin can create, update, delete users.
- Admin can create, update, delete posts.
- Ads render in top, bottom, sidebar, two in-content positions, and sticky footer.
