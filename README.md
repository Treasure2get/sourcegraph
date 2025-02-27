# <a href="https://sourcegraph.com"><picture><source srcset="./ui/assets/img/sourcegraph-head-logo.svg" media="(prefers-color-scheme: dark)"/><img alt="Sourcegraph" src="./ui/assets/img/sourcegraph-logo-light.svg" height="48px" /></picture></a>

[![build](https://badge.buildkite.com/00bbe6fa9986c78b8e8591cffeb0b0f2e8c4bb610d7e339ff6.svg?branch=master)](https://buildkite.com/sourcegraph/sourcegraph)
[![apache license](https://img.shields.io/badge/license-Apache-blue.svg)](LICENSE)

[Sourcegraph](https://about.sourcegraph.com/) OSS edition is a fast, open-source, fully-featured code search and navigation engine. [Enterprise editions](https://about.sourcegraph.com/pricing) are available.

![sourcegraph com_github com_golang_go_-_blob_src_net_http_request go_L855_6](https://user-images.githubusercontent.com/989826/126650657-cef98203-1505-4848-aab6-57acda1ec35f.png)

**Features**

- Fast global code search with a hybrid backend that combines a trigram index with in-memory streaming.
- Code intelligence for many languages via the [Language Server Index Format](https://lsif.dev/).
- Enhances GitHub, GitLab, Phabricator, and other code hosts and code review tools via the [Sourcegraph browser extension](https://docs.sourcegraph.com/integration/browser_extension).
- Integration with third-party developer tools via the [Sourcegraph extension API](https://docs.sourcegraph.com/extensions).

## Try it yourself

- Try out the public instance on any open-source repository at [sourcegraph.com](https://sourcegraph.com/github.com/golang/go/-/blob/src/net/http/httptest/httptest.go#L41:6&tab=references).
- Install the free and open-source [browser extension](https://chrome.google.com/webstore/detail/sourcegraph/dgjhfomjieaadpoljlnidmbgkdffpack?hl=en).
- Spin up your own instance with the [quickstart installation guide](https://docs.sourcegraph.com/#getting-started)
- File feature requests and bug reports in [our issue tracker](https://github.com/sourcegraph/sourcegraph/issues).
- Visit [about.sourcegraph.com](https://about.sourcegraph.com) for more information about product features.

## Installation

> **Prebuilt Docker images are the fastest way to use Sourcegraph Enterprise. See the [quickstart installation guide](https://docs.sourcegraph.com/#getting-started).**

To use Sourcegraph OSS:

1. [Initialize the PostgreSQL database](doc/dev/getting-started/quickstart_2_initialize_database.md)
1. [Ensure Docker is running](doc/dev/getting-started/quickstart_3_start_docker.md)
1. [Configure the HTTPS reverse proxy](doc/dev/getting-started/quickstart_5_configure_https_reverse_proxy.md)
1. [Start the development server](doc/dev/getting-started/quickstart_6_start_server.md)
   ```sh
   ./dev/start.sh
   ```

Sourcegraph should now be running at https://sourcegraph.test:3443.

For detailed instructions and troubleshooting, see the [local development documentation](./doc/dev/index.md).

## Development

Refer to the [Developing Sourcegraph guide](doc/dev/index.md) to get started.

### Documentation

The `doc` directory has additional documentation for developing and understanding Sourcegraph:

- [Project FAQ](./doc/admin/faq.md)
- [Architecture](./doc/dev/background-information/architecture/index.md): high-level architecture
- [Database setup](./doc/dev/background-information/postgresql.md): database best practices
- [General style guide](https://about.sourcegraph.com/handbook/communication/style_guide)
- [Go style guide](https://about.sourcegraph.com/handbook/engineering/languages/go)
- [Documentation style guide](https://about.sourcegraph.com/handbook/engineering/product_documentation)
- [GraphQL API](./doc/api/graphql/index.md): useful tips when modifying the GraphQL API
- [Contributing](./CONTRIBUTING.md)

## License

Sourcegraph OSS is available freely under the [Apache 2 license](LICENSE.apache). Sourcegraph OSS comprises all files in this repository except those in the `enterprise/` and `client/web/src/enterprise` directories.

All files in the `enterprise/` and `client/web/src/enterprise/` directories are subject to the [Sourcegraph Enterprise license](LICENSE.enterprise).
