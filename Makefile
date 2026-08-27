# Guided Breathing — development, build and deployment commands.
#
# Every target wraps the underlying Node/npm/Docker/AWS tooling so that common
# operations need no memorised commands (TECH_SPECS §14, §26).

SHELL := /bin/bash

# --- Configuration (override on the command line or via the environment) ----
IMAGE       ?= guided-breathing
TAG         ?= latest
PORT        ?= 8080
DEV_PORT    ?= 5173

# Feature flags appended to the development URL (SPECS §3, TECH_SPECS §15.1).
# The one-breath dev duration is on by default here because the development
# server is exactly where it is wanted; `make dev DEV_QUERY=` opens a clean URL.
# Nothing is baked into the build: `preview`, `docker-run` and `deploy` serve
# the flag-free app, and the flag can still be added by hand to any URL.
DEV_QUERY   ?= ?devduration=1

# Deployment. Supplied through the environment or the standard AWS CLI
# credential mechanism — never hard-coded here (TECH_SPECS §18, §23).
AWS_PROFILE ?=
AWS_REGION  ?=
S3_BUCKET   ?=
S3_PREFIX   ?=

AWS_FLAGS :=
ifneq ($(strip $(AWS_PROFILE)),)
AWS_FLAGS += --profile $(AWS_PROFILE)
endif
ifneq ($(strip $(AWS_REGION)),)
AWS_FLAGS += --region $(AWS_REGION)
endif

S3_TARGET := s3://$(S3_BUCKET)$(if $(strip $(S3_PREFIX)),/$(S3_PREFIX),)

.DEFAULT_GOAL := help
.PHONY: help install dev build preview test docker docker-run deploy clean

help: ## Show this help
	@echo "Guided Breathing — available targets:"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "Deployment variables: AWS_PROFILE, AWS_REGION, S3_BUCKET, S3_PREFIX"

install: ## Install development dependencies
	npm install

node_modules: package.json
	npm install
	@touch node_modules

dev: node_modules ## Start the development server (LAN-accessible, dev flags on)
	@echo "==> http://localhost:$(DEV_PORT)/$(DEV_QUERY)"
	@echo "    (open the same query string on a phone against this machine's LAN address)"
	npm run dev -- --host --port $(DEV_PORT) --open "/$(DEV_QUERY)"

build: node_modules ## Create the optimised production build in dist/
	npm run build

preview: build ## Serve the production build locally
	npm run preview -- --host --port $(PORT)

test: node_modules ## Run the unit test suite
	npm test

docker: ## Build the production Docker image
	docker build -t $(IMAGE):$(TAG) .

docker-run: docker ## Run the production image on $(PORT)
	docker run --rm -p $(PORT):80 $(IMAGE):$(TAG)

deploy: build ## Build and deploy dist/ to S3
	@if [ -z "$(strip $(S3_BUCKET))" ]; then \
		echo "S3_BUCKET is not set. Example:"; \
		echo "  make deploy S3_BUCKET=my-bucket AWS_PROFILE=my-profile AWS_REGION=eu-west-1"; \
		exit 1; \
	fi
	@echo "==> Deploying to $(S3_TARGET)"
	# Hashed assets first, with a long immutable cache. Uploading these before
	# the entry points means a freshly fetched index.html never references an
	# asset that is not there yet (TECH_SPECS §18.1).
	aws s3 sync dist/ $(S3_TARGET) $(AWS_FLAGS) \
		--delete \
		--exclude "index.html" \
		--exclude "sw.js" \
		--exclude "registerSW.js" \
		--exclude "manifest.webmanifest" \
		--exclude "icons/*" \
		--cache-control "public, max-age=31536000, immutable"
	aws s3 sync dist/icons/ $(S3_TARGET)/icons/ $(AWS_FLAGS) \
		--delete \
		--cache-control "public, max-age=604800"
	# Entry points last, never cached, so an update is picked up immediately.
	aws s3 cp dist/index.html $(S3_TARGET)/index.html $(AWS_FLAGS) \
		--cache-control "no-cache" --content-type "text/html; charset=utf-8"
	aws s3 cp dist/sw.js $(S3_TARGET)/sw.js $(AWS_FLAGS) \
		--cache-control "no-cache" --content-type "text/javascript; charset=utf-8"
	@if [ -f dist/registerSW.js ]; then \
		aws s3 cp dist/registerSW.js $(S3_TARGET)/registerSW.js $(AWS_FLAGS) \
			--cache-control "no-cache" --content-type "text/javascript; charset=utf-8"; \
	fi
	aws s3 cp dist/manifest.webmanifest $(S3_TARGET)/manifest.webmanifest $(AWS_FLAGS) \
		--cache-control "no-cache" --content-type "application/manifest+json"
	@echo "==> Done."

clean: ## Remove generated build artefacts
	rm -rf dist dev-dist node_modules/.vite
