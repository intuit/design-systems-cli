import findUp from 'find-up';

/** Get the package json for a require statement */
const resolvePackage = (name: string) => findUp.sync('package.json', {
  cwd: require.resolve(name)
});

export default resolvePackage;
