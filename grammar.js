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
    [$.var_definition,$.signature],
    [$.iterator,$.value],
    [$.signature,$.value],
    [$.signature,$.sequence],
  ],

  word: $ => $.keyword,

  rules: {
    source_file: $ => repeat($._stmt),
    _stmt: $ => prec(1, choice(
      $.comment,  // hack for getting com
      $.action,
      $.var_definition,
      $.definition,
      $.file_load,
      // $.component_definition,
    )),
    _op_stmt: $ => prec(2,choice(
      $.var_definition,
      $._ended_sequence
      ),
    ),
    file_load: $ => seq(
      'load',
      field("filename", $.string),
      ';'
    ),
    action: $ => seq(
      optional($._label),
      $.trigger,
      $.events,
    ),
    var_definition: $ => seq(
      field("lhs", $.variable),
      '=',
      field("rhs", $.sequence),
      ';',
    ),
    definition: $ => seq(
      $.signature,
      '=',
      $.definition_body
    ),
    signature: $ => repeat1(
      choice(
        $.keyword,
        $.variable,
        $.iterator,
      )
    ),
    definition_body: $ => choice(
      $._definition_stmt,
      seq(
        '{',
        repeat($._definition_stmt),
        '}'
      )
    ),
    _definition_stmt: $ => choice(
      $._ended_sequence,
      $.definition,
      $.var_definition,
    ),

    // declaration: $ => choice(
    //     prec(1,field("operation", seq(
    //       $.operation_signature,
    //       '=',
    //       $.operation_declaration
    //     ))),
    //     prec(0,field("component", seq(
    //       $.sequence,
    //       '=',
    //       $.component_declaration
    //     )),
    //   ),
    // ),
    operation_signature: $ => repeat1(
      choice(
        $.keyword,
        $.variable,
        $.iterator,
      )
    ),
    iterator: $ => seq(
      '[',
      field("variable", $.variable),
      optional(field("main", '*')),
      ']',
    ),
    component_declaration: $ => seq(
      '{',
      repeat1($._stmt), // nested components are forbidden
      '}',
    ),
    operation_declaration: $ => choice(
      $._ended_sequence,
      seq(
        '{',
        repeat(
          $._op_stmt,
        ),
        '}',
      ),
    ),
    _label: $ => $.string,
    trigger: $ => seq(
      optional(field("deactivated", '!')),
      $.repeat_quantifier,
      optional(field("step", $.number)),
      $.time_unit,
    ),
    events: $ => choice(
      $._ended_sequence,
      seq(
        '{',
        repeat($._ended_sequence),
        '}',
      ),
    ),
    sequence: $ => repeat1(
      choice(
        $.keyword,
        $.value,
      )
    ),
    _ended_sequence: $ => seq(
      $.sequence,
      ';'
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
      field("x", $.number),
      ',',
      field("y", $.number),
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
      $.string,
    ),
    string: $ => seq(
      '"',
      field("value", repeat(choice(
        /[^"\\\n]/,
        /\\./
      ))),
      '"'
    ),
    color_value: $ => /#[\da-fA-F]{6}/,
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
