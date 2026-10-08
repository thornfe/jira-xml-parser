import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: {
    // tsup 8's declaration bundler injects baseUrl; scope its TS 6 compatibility here.
    compilerOptions: { ignoreDeprecations: '6.0' }
  }
});
