import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
    displayConfig: {
    // Desativa o cabeçalho em todas as páginas de autenticação
    ui: {
      navigation: false,
      showHeaderTitle: false,
      showFooter: false,
      showOptionalFields: false,
    }
  },
  
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};