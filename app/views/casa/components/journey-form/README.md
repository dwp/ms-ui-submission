# COPY OF......CASA Journey Form

# OVERRIDES @dwp/govuk-casa/views/casa/components/journey-form
# NB: WILL NOT AUTOMATICALLY UPDATE IF CASA CHANGES

## Introduction

Component to wrap your form inputs in a `<form>` that contains all the required elements for CASA.

A "Continue" button (and "Cancel" link if in edit mode) will also be added.

####NB: The locales files used in the casa version have been replaced in this template.njk with application-level locales.
#### i.e. t('common:form.buttons.saveChanges.label') has been replaced by t('app:saveChanges')
#### i.e. t('common:form.buttons.continue.label') has been replaced by t('app:continue')
#### i.e. t('common:form.buttons.cancel.label') has been replaced by t('app:cancel')

## Example usage

```
{% from "casa/components/journey-form/macro.njk" import casaJourneyForm with context %}

{% call casaJourneyForm({
  casaMountUrl: '...',
  csrfToken: '...',
  inEditMode: false
}) %}
  ... your form inputs here ...
{% endcall %}
```

## Component arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `casaMountUrl` | string | Yes | URL prefix (available to user's templates via the global `inEditMode` variable) |
| `csrfToken` | string | Yes | Token used to protect form from CSRF (available to user's templates via the global `csrfToken` variable) |
| `inEditMode` | boolean | No | Toggle edit-mode of the form (available to user's templates via the global `inEditMode` variable) |
