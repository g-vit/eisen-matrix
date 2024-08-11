SHELL := /bin/bash

-include .env
export HOST
export LOGIN
export PASS

.PHONY: binaries
binaries: bin/reflex bin/overmind
bin/reflex:
	GOBIN=$(shell pwd)/bin go install github.com/cespare/reflex@latest
bin/overmind:
	GOBIN=$(shell pwd)/bin go install github.com/DarthSim/overmind/v2@latest

run: binaries
	rm -f .overmind.sock
	bin/overmind start

cleanup-data:
	rm -f data.json
	echo "[]" > data.json
	bin/overmind restart

run-script: check-vars
	@echo "Running script: $(name).sh"
	@if [ -z "$(name)" ]; then \
		echo "Error: `name` variable is not set."; \
		exit 1; \
	elif [ ! -f ./scripts/$(name).sh ]; then \
		echo "Error: Script ./scripts/$(name).sh not found."; \
		exit 1; \
	else \
		./scripts/$(name).sh; \
	fi

check-vars:
	@if [ -z "$(HOST)" ]; then echo "You need to set HOST in the .env file or export the variable separately."; exit 1; fi
