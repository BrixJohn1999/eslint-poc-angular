import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin";
import {
  share as _share,
  SharedMappings,
} from "@angular-architects/module-federation/webpack";
import { join } from "path";
const share = _share;

const sharedMappings = new SharedMappings();
// eslint-disable-next-line no-undef
sharedMappings.register(join(__dirname, "tsconfig.json"), [
  /* mapped paths to share */
]);

export const output = {
  uniqueName: "myaccess20Dashboard",
  publicPath: "http://localhost:3008/",
  scriptType: "text/javascript",
};
export const optimization = {
  runtimeChunk: false,
};
export const resolve = {
  alias: {
    ...sharedMappings.getAliases(),
    jquery: "gridstack/dist/jq/jquery.js",
    "jquery-ui": "gridstack/dist/jq/jquery-ui.js",
    "jquery.ui": "gridstack/dist/jq/jquery-ui.js",
    "jquery.ui.touch-punch": "gridstack/dist/jq/jquery.ui.touch-punch.js",
  },
};
export const experiments = {
  outputModule: true,
};
export const plugins = [
  new ModuleFederationPlugin({
    library: { type: "module" },
    // For remotes (please adjust)
    name: "myAccessDashboard",
    filename: "remoteEntry.js",
    exposes: {
      DashboardAdmin: [
        "./src/styles.css",
        "./src/app/module/dashboard/dashboard.module.ts",
      ],
    },

    // For hosts (please adjust)
    // remotes: {
    //     "mfe1": "http://localhost:3000/remoteEntry.js",
    // },
    shared: share({
      "@angular/core": {
        singleton: true,
        strictVersion: true,
        requiredVersion: "auto",
      },
      "@angular/common": {
        singleton: true,
        strictVersion: true,
        requiredVersion: "auto",
      },
      "@angular/common/http": {
        singleton: true,
        strictVersion: true,
        requiredVersion: "auto",
      },
      "@angular/router": {
        singleton: true,
        strictVersion: true,
        requiredVersion: "auto",
      },

      ...sharedMappings.getDescriptors(),
    }),
  }),
  sharedMappings.getPlugin(),
];
