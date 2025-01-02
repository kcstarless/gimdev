SimpleForm.setup do |config|
  # Wrappers configration
  config.wrappers :default, class: "form_field" do |b|
    b.use :html5
    b.use :placeholder
    b.use :label, class: "field_label"
    b.use :input, class: "field_input", error_class: "form_input--invalid"
  end

    # For boolean inputs (checkboxes and radio buttons)
    config.wrappers :boolean, class: "boolean_field" do |b|
      b.use :label, class: "boolean-label"
      b.use :input, class: "boolean-input", error_class: "form_input--checkbox--invalid"
    end

  # Default configuration
  config.generate_additional_classes_for = []
  config.default_wrapper                 = :default
  config.button_class                    = "btn"
  config.label_text                      = lambda { |label, _, _| label }
  config.error_notification_tag          = :div
  config.error_notification_class        = "error_notification"
  config.browser_validations             = false
  config.boolean_style                   = :nested
  config.boolean_label_class             = "form__checkbox-label"
end
