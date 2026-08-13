/**
 * Local content hooks - all data local, no Sanity.
 * Hooks keep their names and return null to use built-in fallback data.
 */
export const isSanityConfigured = false;
const cache = { projects: null, content: null, awards: null, loading: false, loaded: true, error: null };

export function loadSanityData() {
  cache.loaded = true;
  return Promise.resolve(cache);
}

export function isSanityDataLoaded() {
  return true;
}

export function useGalleryProjects() {
  return null;
}

export function useStudioContent() {
  return null;
}

export function useAwards() {
  return null;
}
