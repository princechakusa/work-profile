import { Config } from "@remotion/cli/config";
import path from "node:path";
import webpack from "webpack";

Config.overrideWebpackConfig((config) => ({
  ...config,
  // the films import from "@/..." like the site does
  resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": path.join(process.cwd(), "src") } },
  // Remotion serves public/ under /public, so asset("/voice/a1.mp3") must become /public/voice/a1.mp3
  plugins: [...(config.plugins ?? []), new webpack.DefinePlugin({ "process.env.NEXT_PUBLIC_BASE_PATH": JSON.stringify("/public") })],
}));
Config.setChromiumOpenGlRenderer("angle");
