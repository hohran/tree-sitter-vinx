// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterVinx",
    products: [
        .library(name: "TreeSitterVinx", targets: ["TreeSitterVinx"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterVinx",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterVinxTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterVinx",
            ],
            path: "bindings/swift/TreeSitterVinxTests"
        )
    ],
    cLanguageStandard: .c11
)
