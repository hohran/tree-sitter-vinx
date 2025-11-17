package tree_sitter_vinx_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_vinx "github.com/tree-sitter/tree-sitter-vinx/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_vinx.Language())
	if language == nil {
		t.Errorf("Error loading Vinx grammar")
	}
}
