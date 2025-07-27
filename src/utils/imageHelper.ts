export const getStorageImageUrl = (path: string): string => {
  if (!path) return '';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove duplicate storage prefixes
  const normalizedPath = cleanPath.replace(/^storage\//, '');
  
  return `/storage/${normalizedPath}`;
};

export const getFullImageUrl = (path: string): string => {
  if (!path) return '';
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${path.replace(/^\/?storage\//, '')}`;
};