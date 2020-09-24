declare module 'react-merge-refs' {
  export default function mergeRefs<T>(ref: React.Ref<T>[]): React.Ref<T>;
}
