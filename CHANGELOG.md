# Change Log

## [1.1.0] - 2017-02-08

### Added

- `wireAdvanced` handlers will now also pass through arguments given
  to the handler on invocation, as well as partially applied arguments
  during handler construction.

  ```js
    const Component = () => <button onClick='handleClick({ data: 'data' })>Button</button>
    const Wired = wireAdvanced({
      channel: {
        handleClick(emit, data, e) {
          /* data - the partially applied data object */
          /* e - the onClick event from the button */
        },
      },
    });
  ```

## [1.0.2] - 2017-02-07

### Changed

- Display name for a component that has used `wireAdvanced` is now `WiredAdvanced()`.

## [1.0.1] - 2017-02-07

### Fixed

- Named channels from `wire()` should be suffixed with `Emitter`.

## [1.0.0] - 2017-02-07

Initial Implementation

## Notes

`react-emit-provider` follows [semantic versioning](http://semver.org/)

[Unreleased]: https://github.com/nioinnovation/react-emit-provider/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/nioinnovation/react-emit-provider/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/nioinnovation/react-emit-provider/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/nioinnovation/react-emit-provider/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/nioinnovation/react-emit-provider/compare/8b37f39...v1.0.0
