import { Generator } from "@jspm/generator";
import assert from "assert";

const generator = new Generator({
  inputMap: {
    imports: {
        react: "https://ga.jspm.io/npm:react@17.0.1/dev.index.js",
    },
    scopes: {
      "https://ga.jspm.io/": {
        "lit-html": "https://ga.jspm.io/npm:lit-html@2.6.0/lit-html.js",
      }
    },
  },
  mapUrl: import.meta.url,
  env: ["production", "browser"],
  freeze: true, // lock versions
});

// Install with too many arguments should throw:
try {
  await generator.install("too", "many");
  assert(false);
} catch {
  /* expected to throw */
}

// Install with no arguments should install all top-level pins.
await generator.install();
let json = generator.getMap();

assert.strictEqual(
  json.imports.react,
  "https://ga.jspm.io/npm:react@17.0.1/index.js"
);

// Installing a new dependency with freeze should not throw, but it should
// never bump versions from the import map:
await generator.install(["lit@2.6.1", "lit-html"]);
json = generator.getMap();

assert.strictEqual(
  json.imports.lit,
  "https://ga.jspm.io/npm:lit@2.6.1/index.js",
);

// Even though latest for lit-html is 2.6.1, it should remain locked due to
// the freeze option being set:
assert.strictEqual(
  json.imports["lit-html"],
  "https://ga.jspm.io/npm:lit-html@2.6.0/lit-html.js",
);
