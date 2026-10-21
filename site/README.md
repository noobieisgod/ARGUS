# Website source

Use Node.js 24. Public CI runs `node site/test-public.mjs --repository`; its fixtures are synthetic and contain no publisher observations.

Full local builds also require the private, hash-pinned `site/data/usnews-acceptance/{schools,methodology,sources,history}.json`, private `site/handoff.json`, separately maintained non-scoring `site/admissions-updates.json`, and the selected local `images/` files. The four ranking JSONs, handoff and admissions-correction file must not be committed. Campus photographs are published only after individual clearance. The public clone is intentionally not a self-contained numerical reproduction package.

With the authorized private inputs restored locally, run `node site/build.mjs`, then `node site/serve.mjs`. `ARGUS_BASE_PATH` defaults to empty. For project Pages use `/argus-university-rankings`; `ARGUS_COMPACT_HTML=1` compacts generated HTML, and `ARGUS_OUTPUT_DIRECTORY` selects a dedicated output directory. Set the same base path and output directory when previewing.

`site/images.json` contains publication-safe source, author, license, checksum and modification records. Each photograph retains its own license, distinct from the repository code license. `site/locations.json` contains independently arranged location facts and source citations.

Complete data-dependent tests run in the private working project. Do not copy private archives, raw observations or their test fixtures into this repository. The manually dispatched Pages workflow accepts only an explicitly approved publication commit and matching release-manifest checksum. It does not build from private data or automatically deploy a source push.
