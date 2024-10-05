import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig, mergeConfig } from 'vite';
import { getBuildConfig, getBuildDefine, external, pluginHotRestart } from './vite.base.config';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

// Custom function to copy files to the build directory
const copyBatchFile = () => {
  const source = resolve(__dirname, 'BatCommand/call_open_profile.bat');
  const destinationDir = resolve(__dirname, '.vite/build/BatCommand');
  const destination = resolve(destinationDir, 'call_open_profile.bat');

  // Ensure the destination directory exists
  mkdirSync(destinationDir, { recursive: true });

  // Copy the batch file
  copyFileSync(source, destination);
};

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'build'>;
  const { forgeConfigSelf } = forgeEnv;
  const define = getBuildDefine(forgeEnv);
  const config: UserConfig = {
    build: {
      lib: {
        entry: forgeConfigSelf.entry!,
        fileName: () => '[name].js',
        formats: ['cjs'],
      },
      rollupOptions: {
        external,
        plugins: [
          {
            name: 'copy-batch-file',
            generateBundle() {
              copyBatchFile();
            },
          },
        ],
      },
    },
    plugins: [pluginHotRestart('restart')],
    define,
    resolve: {
      // Load the Node.js entry.
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
