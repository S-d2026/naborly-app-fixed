/**
 * Mock backend contract for future replacement.
 * Replace these localStorage-backed methods with Supabase/Firebase/API calls.
 */

export const schema = {
  users: ['id', 'name', 'email', 'neighborhood', 'role'],
  listings: ['id', 'title', 'type', 'mode', 'price', 'neighborhood', 'contact', 'description', 'image_url', 'seller_id', 'approved', 'created_at'],
  favorites: ['id', 'user_id', 'listing_id'],
  reports: ['id', 'user_id', 'listing_id', 'reason', 'created_at'],
  messages: ['id', 'sender_id', 'receiver_id', 'listing_id', 'body', 'created_at'],
};

export const apiExamples = {
  signIn: { method: 'POST', path: '/api/auth/sign-in' },
  listListings: { method: 'GET', path: '/api/listings' },
  createListing: { method: 'POST', path: '/api/listings' },
  saveFavorite: { method: 'POST', path: '/api/favorites' },
  reportListing: { method: 'POST', path: '/api/reports' },
  moderateListing: { method: 'PATCH', path: '/api/listings/:id' },
};
