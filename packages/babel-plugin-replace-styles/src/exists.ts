/** Check if a module exits */
export default function exists(name: string) {
  try {
    require.resolve(name);
    return true;
  } catch (error) {
    return false;
  }
}
