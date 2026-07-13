# TODO - Next.js + Django integration

## 1. Backend connection + env
- [ ] Add `NEXT_PUBLIC_API_BASE_URL` to Next.js usage (and create/update `.env.local` if present)

## 2. API client (JWT-aware)
- [ ] Create `lib/api/backend.ts` (or refactor `lib/api/client.ts`) to call Django endpoints
- [ ] Implement token handling (Authorization header) + optional refresh on 401

## 3. Catalog service: replace mocks
- [ ] Rewrite `lib/services/catalog-service.ts` to fetch from:
  - [ ] /api/v1/categories/
  - [ ] /api/v1/faculties/
  - [ ] /api/v1/vendors/
  - [ ] /api/v1/books/ (with filters)
  - [ ] /api/v1/books/{slug}/reviews/

## 4. Auth slice: make it real
- [ ] Update `store/slices/authSlice.ts` to also call `GET /api/v1/auth/me/` after login
- [ ] Remove hardcoded endpoints; use `NEXT_PUBLIC_API_BASE_URL`

## 5. Cart / Wishlist / Orders persistence
- [ ] Rewrite `store/slices/cartSlice.ts` to sync with backend:
  - [ ] loadCart: GET /api/v1/cart/
  - [ ] addToCart: POST /api/v1/cart/add_item/
  - [ ] updateQuantity: POST /api/v1/cart/update_item/
  - [ ] removeFromCart: POST /api/v1/cart/remove_item/
  - [ ] clearCart: POST /api/v1/cart/clear_cart/
  - [ ] wishlist endpoints wired similarly
- [ ] Update Checkout page to submit order:
  - [ ] POST /api/v1/orders/ (from cart) with shipping_address + phone + email
- [ ] Update Orders page and Account dashboard to load real orders

## 6. Optional Next.js API proxy routes
- [ ] Convert `app/api/*` mock wrappers into real proxies OR delete unused routes

## 7. Validate multi-vendor public behavior
- [ ] Ensure vendors/categories/book listings use backend data and filters

## 8. Run & test
- [ ] Start Django server
- [ ] Start Next dev server
- [ ] Manual smoke tests: browse, login, cart, checkout->order, orders list

