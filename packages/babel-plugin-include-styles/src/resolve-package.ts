import findUp from 'find-up';

/** Get the package json for a require statement */
const resolvePackage = (name: string) => {
  try {
    return findUp.sync('package.json', {
      cwd: require.resolve(name)
    });
  } catch (error) {
    // During testing fs will be undefiend
  }
}

export default resolvePackage;
