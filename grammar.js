/**
 * @file language for image/video processing specification
 * @author jan hranicka <hranickajan@seznam.cz>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "vinx",

  conflicts: $ => [
    [$.var_definition,$.value],
  ],

  word: $ => $.keyword,

  rules: {
    source_file: $ => repeat($._stmt),
    _stmt: $ => choice(
      $.action,
      $.var_definition,
      $.declaration,
      // $.component_definition,
    ),
    action: $ => seq(
      optional($.label),
      $.trigger,
      $.events,
    ),
    var_definition: $ => seq(
      $.variable,
      '=',
      $.sequence,
      ';',
    ),
    declaration: $ => seq(
      field("lhs", $.sequence),
      '=',
      choice(
        field("operation", $.events),
        field("component", $.component_declaration),
      ),
    ),
    component_declaration: $ => seq(
      '{',
      repeat1($._stmt), // nested components are forbidden
      '}',
    ),
    label: $ => /@[a-z_][0-9a-z_]*/,
    trigger: $ => seq(
      $.repeat_quantifier,
      optional($.number),
      $.time_unit,
    ),
    events: $ => choice(
      seq(
      $.sequence,
        ';',
      ),
      seq(
        '{',
        repeat(seq(
          $.sequence,
          ';',
        )),
        '}',
      ),
    ),
    sequence: $ => repeat1(
      choice(
        $.keyword,
        $.value,
        $.label,
      )
    ),
    keyword: $ => /[a-z]+/,
    variable: $ => /\$[a-z_][a-z_0-9]*/,
    repeat_quantifier: $ => choice(
      field('repeated','every'),
      field('onetime','at'),
    ),
    number: $ => /\d+/,
    time_unit: $ => choice(
      field('frame', choice(
        'frame', 'frames'
      )),
      field('second', choice(
        's', 'second', 'seconds'
      )),
      field('millisecond', choice(
        'ms', 'millisecond', 'milliseconds'
      )),
    ),
    position: $ => seq(
      '(',
      $.number,
      ',',
      $.number,
      ')',
    ),
    vector: $ => seq(
      '[',
      commaSep($.value),
      ']',
    ),
    direction: $ => choice(
      'up',
      'down',
      'left',
      'right',
    ),
    color: $ => choice(
      $.color_name,
      $.color_value,
    ),
    value: $ => choice(
      $.variable,
      $.number,
      $.position,
      $.vector,
      $.color,
      $.direction,
    ),
    color_value: $ => /#\d{6}/,
    color_name: $ => choice(
      'red',
      'green',
      'blue',
      'yellow',
      'black',
      'brown',
      'cyan',
      'purple',
      'orange',
      'white',
      'pink',
      // TODO: add more
    ),
  }
});
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)))
}

function commaSep(rule) {
  return optional(commaSep1(rule))
}
