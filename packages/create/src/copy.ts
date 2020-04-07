import copy from 'copy-template-dir';
import fs from 'fs';

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

      createdFiles.forEach(file => {
        const contents = fs.readFileSync(file, { encoding: 'utf8' });
        fs.writeFileSync(
          file,
          contents.replace(/\\{/g, '{').replace(/\\}/g, '}')
        );
      });

      resolve(createdFiles);
    });
  });
}
