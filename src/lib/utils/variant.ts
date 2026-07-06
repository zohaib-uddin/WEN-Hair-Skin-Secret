export const getSmallestVariant = (variants: string[] | undefined, size?: string | null): string => {
  if (!variants || variants.length === 0) {
    return size || "";
  }
  
  // Parse numerical values to sort (e.g. "50ml", "100ml", "10g")
  const sorted = [...variants].sort((a, b) => {
    const valA = parseFloat(a) || 0;
    const valB = parseFloat(b) || 0;
    return valA - valB;
  });
  
  return sorted[0] || size || "";
};
