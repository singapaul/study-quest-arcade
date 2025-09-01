// Environment configuration
export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://bkbtkbfnxtzxhupcqsdp.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYnRrYmZueHR6eGh1cGNxc2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzAyNTEsImV4cCI6MjA3MTk0NjI1MX0.qy2-3E56Jk-6HL2jNBNci4sBYQM9LxS3-yeLR8q3MwY",
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || "Study Quest Arcade",
    url: import.meta.env.VITE_APP_URL || "http://localhost:5173",
  },
  
  // Auth Configuration
  auth: {
    // Callback URLs for different environments
    callbackUrl: import.meta.env.VITE_APP_URL 
      ? `${import.meta.env.VITE_APP_URL}/auth/callback`
      : "http://localhost:5173/auth/callback",
    
    // Redirect URLs after login/logout
    redirectTo: import.meta.env.VITE_APP_URL || "http://localhost:5173",
  }
};

// Helper function to get the current environment
export const getEnvironment = () => {
  if (import.meta.env.VITE_APP_URL?.includes('vercel.app')) {
    return 'production';
  }
  if (import.meta.env.VITE_APP_URL?.includes('localhost')) {
    return 'development';
  }
  return 'production'; // Default to production
};

// Helper function to get the base URL for API calls
export const getBaseUrl = () => {
  return config.app.url;
};
