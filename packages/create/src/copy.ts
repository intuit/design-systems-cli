import copy from 'copy-template-dir';

/** Copy a template dir to some location. */
export default async function template(
  source: string,
  output: string,
  options: Record<string, string>
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    copy(source, output, options, (err, createdFiles) => {
      if (err) {
        return reject(err);
      }

      resolve(createdFiles);
    });
  });
}
