import XCTest
import SwiftTreeSitter
import TreeSitterVinx

final class TreeSitterVinxTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_vinx())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Vinx grammar")
    }
}
