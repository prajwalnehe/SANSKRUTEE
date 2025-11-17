import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

let isSetup = false;

export function setupPassport() {
  if (isSetup) return;

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 7000}`;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('[passport] Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET');
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID || '',
        clientSecret: GOOGLE_CLIENT_SECRET || '',
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = (profile.emails && profile.emails[0]?.value) || '';
          const name = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();
          const avatar = (profile.photos && profile.photos[0]?.value) || '';

          console.log('Google profile:', {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails,
            photos: profile.photos,
            name: profile.name,
            provider: profile.provider,
          });

          // Prefer lookup by googleId
          let user = await User.findOne({ googleId });
          if (!user && email) {
            // Fallback: link existing account by email
            user = await User.findOne({ email });
          }

          if (!user) {
            user = await User.create({
              name: name || 'Google User',
              email,
              googleId,
              avatar,
              provider: 'google',
            });
            console.log('User saved:', { id: String(user._id), email: user.email, googleId: user.googleId });
          } else {
            // Update google fields if needed
            const updates = {};
            if (!user.googleId) updates.googleId = googleId;
            if (avatar && user.avatar !== avatar) updates.avatar = avatar;
            if (user.provider !== 'google') updates.provider = 'google';
            if (Object.keys(updates).length) {
              user.set(updates);
              await user.save();
              console.log('User saved:', { id: String(user._id), email: user.email, googleId: user.googleId });
            }
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('name email isAdmin googleId avatar provider');
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  isSetup = true;
}

export default passport;
