SHELL := /bin/bash

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
