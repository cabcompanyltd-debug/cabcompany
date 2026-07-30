import fs from 'fs';
import path from 'path';

try {
  const pkgPath = path.join(process.cwd(), 'node_modules', '@insforge', 'shared-schemas', 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.exports && pkg.exports['.']) {
      pkg.exports['.'] = {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
        require: "./dist/index.js",
        default: "./dist/index.js"
      };
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      console.log('Successfully patched @insforge/shared-schemas/package.json for CommonJS support.');
    }
  } else {
    console.warn('Could not find @insforge/shared-schemas package.json to patch.');
  }
} catch (err) {
  console.error('Failed to patch @insforge/shared-schemas:', err);
}
