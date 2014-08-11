all: lib test

lib:
	cd src && $$(npm bin)/esnext -o ../lib *.js && cd ..

test:
	cd test/src && $$(npm bin)/esnext -o ../lib *.js && cd ..

.PHONY: lib test
