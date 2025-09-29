# Signup Flow Fix

## Completed Tasks
- [x] Update AuthContext signUp function to return { user, session, error } instead of { user, error }
- [x] Update SignUpPage handleSubmit to check for session: if session exists, navigate to country-selection; else, show confirmation message and redirect to login after 3 seconds

## Followup Steps
- [ ] Test the signup flow to ensure it works when session is present or handles confirmation properly
- [ ] If needed, check Supabase settings for email confirmation
