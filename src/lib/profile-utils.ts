
interface ProfileData {
  username?: string | null;
  avatar_url?: string | null;
  location?: string | null;
  primary_sport?: string | null;
  bio?: string | null;
  preferred_sports?: string[] | null;
}

/**
 * Calculates the completeness percentage of a user profile
 * and returns a list of missing fields
 */
export function calculateProfileCompleteness(profile: ProfileData) {
  // Define the fields that contribute to profile completeness
  const fields = [
    { name: 'Profile Picture', value: profile.avatar_url },
    { name: 'Username', value: profile.username },
    { name: 'Location', value: profile.location },
    { name: 'Primary Sport', value: profile.primary_sport },
    { name: 'Bio', value: profile.bio },
    { name: 'Preferred Sports', value: profile.preferred_sports?.length ? profile.preferred_sports : null }
  ];
  
  // Count completed fields
  const completedFields = fields.filter(field => field.value).length;
  
  // Calculate percentage
  const completeness = Math.round((completedFields / fields.length) * 100);
  
  // Get list of missing fields
  const missingFields = fields
    .filter(field => !field.value)
    .map(field => field.name);
  
  return { 
    completeness, 
    missingFields,
    completedFields,
    totalFields: fields.length
  };
}
