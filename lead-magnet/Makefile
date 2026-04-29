# lead-magnet/Makefile
#
# Re-render the lead-magnet PDF from the canonical source markdown.
# Run from anywhere:  make -C lead-magnet pdf
# Or via npm:         pnpm run pdf

NODE      ?= node
SRC       := source.md
TEMPLATE  := template/styles.css
OUT       := dist/10-stacks-v1.pdf
PUBLIC    := ../public/downloads/10-stacks-v1.pdf

.PHONY: pdf clean install

pdf: $(OUT)

$(OUT): build.mjs $(SRC) $(TEMPLATE)
	cd .. && $(NODE) lead-magnet/build.mjs

install:
	cd .. && pnpm install --no-frozen-lockfile

clean:
	rm -rf dist
	rm -f $(PUBLIC)
