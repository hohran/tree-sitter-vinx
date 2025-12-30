/**
 * @file language for image/video processing specification
 * @author jan hranicka <hranickajan@seznam.cz>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "vinx",

  extras: ($) => [
    /\s/, // whitespace
    $.comment,
  ],

  conflicts: $ => [
    [$.var_definition,$.value,$.operation_signature],
    [$.iterator,$.value],
    [$.operation_signature,$.value],
    [$.operation_signature,$.sequence],
  ],

  word: $ => $.keyword,

  rules: {
    source_file: $ => repeat($._stmt),
    _stmt: $ => prec(1, choice(
      $.action,
      $.var_definition,
      $.declaration,
      // $.component_definition,
    )),
    _op_stmt: $ => prec(2,choice(
      $.var_definition,
      seq(
        $.sequence,
        ';',
      )),
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
      choice(
        prec(1,field("operation", seq(
          $.operation_signature,
          '=',
          $.operation_declaration
        ))),
        prec(0,field("component", seq(
          $.sequence,
          '=',
          $.component_declaration
        ))),
      ),
    ),
    operation_signature: $ => repeat1(
      choice(
        $.keyword,
        $.variable,
        $.iterator,
      )
    ),
    iterator: $ => seq(
      '[',
      $.variable,
      optional('*'),
      ']',
    ),
    component_declaration: $ => seq(
      '{',
      repeat1($._stmt), // nested components are forbidden
      '}',
    ),
    operation_declaration: $ => choice(
      seq(
      $.sequence,
        ';',
      ),
      seq(
        '{',
        repeat(
          $._op_stmt,
        ),
        '}',
      ),
    ),
    label: $ => /@[a-z_][0-9a-z_]*/,
    trigger: $ => seq(
      optional('!'),
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
    effect: $ => choice(
      'randomized',
      'blurred',
      'inversed',
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
      $.effect,
      $.direction,
      // $.string,
    ),
    // string: $ => '',
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

    comment: $ => token(
      choice(
        seq("//", /.*/), 
        seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")
      ),
    ),
  }
});
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)))
}

function commaSep(rule) {
  return optional(commaSep1(rule))
}
