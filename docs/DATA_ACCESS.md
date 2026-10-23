# Underlying data access

The public website uses a reduced view containing ARGUS results, campus locations, institutional admissions facts and bibliographic source links. It does not distribute publisher input tables, raw ratings, research extracts or the four original JSON files. The finalized calculations are unchanged. The three unverified publisher-sourced acceptance figures remain private and are omitted from public admissions displays.

Use the repository's [data request channel](https://github.com/noobieisgod/argus-university-rankings/issues/new?title=Data%20access%20request) to identify schools, fields, intended use and the reproducibility question. Do not include personal information, credentials, paid documents or restricted data in a public issue.

Requests are reviewed individually. Only material that can lawfully be redistributed is supplied. Otherwise, source citations, permitted excerpts where supported, or directions to the original provider are offered. Request-only access is not a blanket permission to redistribute publisher datasets, and access is not guaranteed. No automated raw-data download or request fulfillment is enabled.

The `minimal` build profile removes unnecessary input exposure without changing ARGUS results or ranking functionality. This does not independently establish a legal basis for publication of publisher-derived outputs. Source attribution and a link to an accessible document are not reuse licenses. Public launch remains conditional on that separate review.

Build locally with `ARGUS_PUBLICATION_PROFILE=minimal` and the approved Pages base path. The default `full` profile is for local review. Full data-dependent reproduction requires the private finalized inputs and is not available from a public clone alone.
