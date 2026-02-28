import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

// Mock base44 for Vercel/local/standalone use (no real Base44 SDK)
const mockBase44 = {
  auth: {
    me: async () => ({
      email: "mock@shawn.reddeer",
      full_name: "Shawn Robertson",
      role: "user", // mock role — change to 'admin' if you want admin note
    }),
  },
  entities: {
    Profile: {
      filter: async () => [], // Return empty array for no profiles
    },
    Thread: {
      filter: async () => [], // Return empty array for no threads
    },
  },
};

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1); // e.g., "agent-verification" → "agent-verification"

  const { data: authData, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const user = await mockBase44.auth.me();
        return { user, isAuthenticated: true };
      } catch (error) {
        console.error("Mock auth failed:", error);
        return { user: null, isAuthenticated: false };
      }
    },
    staleTime: Infinity, // Cache forever since it's mock
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-void)] text-[var(--text-primary)] p-6">
      {/* 404 Error Code */}
      <div className="space-y-2 text-center">
        <h1 className="text-7xl md:text-9xl font-light text-slate-300">404</h1>
        <div className="h-0.5 w-16 bg-slate-200 mx-auto"></div>
      </div>

      {/* Main Message */}
      <div className="mt-6 space-y-3 text-center">
        <h2 className="text-2xl md:text-3xl font-medium text-slate-800">
          Page Not Found
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed max-w-md">
          The page <span className="font-mono text-[#f07ba0]">/{pageName}</span> does not exist in this application.
        </p>
      </div>

      {/* Admin/Guest Note */}
      {isFetched && (
        <div className="mt-8">
          {authData?.isAuthenticated ? (
            <p className="text-sm text-slate-700">
              Welcome back, {authData.user?.full_name || "traveler"}.
            </p>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Guest mode active — full features require login.
            </p>
          )}

          {authData?.user?.role === 'admin' && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-200 max-w-md">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm font-medium text-slate-700">Admin Note</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This page may not be implemented yet. Ask Grok to add it in the chat.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Return to Square
        </Link>
      </div>
    </div>
  );
}
