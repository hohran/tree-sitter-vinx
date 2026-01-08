;; comments
(comment) @comment

;; literals
(string) @string
(number) @number

;; identifiers
(variable) @variable
(iterator) @variable.builtin

;; keywords / operators
(repeat_quantifier) @keyword
(file_load) @function
(value) @constant

;; optional: directions / effects
(direction) @constant.builtin
(effect) @attribute
(color_name) @constant
(color_value) @number

; (repeat_quantifier) @function
; (value) @keyword
; (iterator) @keyword
; (variable) @type
; (string) @string
; (file_load) @function
