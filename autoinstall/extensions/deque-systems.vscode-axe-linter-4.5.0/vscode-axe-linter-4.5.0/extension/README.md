Coding for accessibility made easy.

## Features

- Checks React (.js .jsx .ts .tsx), Vue (.vue), Angular (.component.html), HTML (.html .htm), and Markdown (.md .markdown) files so you can avoid common accessibility defects. Inline Angular templates are not currently supported.
- Consistent with the open-source [axe-core rules engine](https://www.deque.com/axe/core-documentation/api-documentation/) to provide early warnings of real accessibility defects -- zero false positives, so you don't have to write a bunch of `ignore` flags.
- No configuration required -- zero learning curve, so you can be productive immediately.
- Shareable project-specific configurations, so your team can work from the same accessibility standard or rules.

![Axe-linter running in vscode displaying an error on an image without an alt text](https://axe-linter-server-binary-prod-us-east-1.s3.amazonaws.com/docs-assets/vsce-example.png)

## Quickstart

Once the plugin is installed, axe-linter installs and configures itself automatically. This can sometimes take a few minutes. Once this step is completed, axe-linter will start running on compatible source files.

## CI/CD Integration

Axe-linter is now available on a multitude of other platforms! We currently provide integrations for:
- GitHub Actions
- Git Pre-Commit Hooks
- SonarQube
- Jenkins, Azure DevOps, CircleCI, and more!

To start your free trial head to [deque.com](https://accessibility.deque.com/linter-contact-us/?utm_source=marketplace_visual_studio&utm_medium=referral&utm_campaign=trial_start). In the mean time, check out all the [details on axe-linter's other integrations](https://www.deque.com/axe/linters/) or our [full axe-linter platform documentation](https://docs.deque.com/linter/1.0.0/en/linter-home)

## Settings

The rules axe-linter uses and components it can lint are configurable by adding a file called `axe-linter.yml` at your project's root level. You can enable and disable specific rules individually, or by groups. You can also configure axe-linter to work with custom components.


### Rule Configuration
You can enable/disable rules individually with the `rules` entry:

```yml
rules:
  some-rule: false # turn off rule
  other-rule: true # turn on rule
```

You can also disable rules as a group based on WCAG standard they are associated with using the `tags` entry:

```yml
tags: # Disable all rules for WCAG 2.1 A, WCAG 2.1 AA, and best practices.
  - wcag21a
  - wcag21aa
  - best-practices
```

### Available Accessibility Tags

The following tags are available for configuration in axe-linter:

| Tag Name        | Accessibility Standard / Purpose    |
| --------------- | ----------------------------------- |
| `wcag2a`        | WCAG 2.0 Level A                    |
| `wcag2aa`       | WCAG 2.0 Level AA                   |
| `wcag21a`       | WCAG 2.1 Level A                    |
| `wcag21aa`      | WCAG 2.1 Level AA                   |
| `best-practice` | Common accessibility best practices |

### Available Rules

axe-linter has the following rules, by default all are enabled:

- [area-alt](https://dequeuniversity.com/rules/axe/4.5/area-alt)
- [aria-allowed-attr](https://dequeuniversity.com/rules/axe/4.5/aria-allowed-attr)
- [aria-allowed-role](https://dequeuniversity.com/rules/axe/4.5/aria-allowed-role)
- [aria-command-name](https://dequeuniversity.com/rules/axe/4.5/aria-command-name)
- [aria-dialog-name](https://dequeuniversity.com/rules/axe/4.5/aria-dialog-name)
- [aria-input-field-name](https://dequeuniversity.com/rules/axe/4.5/aria-input-field-name)
- [aria-meter-name](https://dequeuniversity.com/rules/axe/4.5/aria-meter-name)
- [aria-progressbar-name](https://dequeuniversity.com/rules/axe/4.5/aria-progressbar-name)
- [aria-required-attr](https://dequeuniversity.com/rules/axe/4.5/aria-required-attr)
- [aria-roles](https://dequeuniversity.com/rules/axe/4.5/aria-roles)
- [aria-roledescription](https://dequeuniversity.com/rules/axe/4.5/aria-roledescription)
- [aria-text](https://dequeuniversity.com/rules/axe/4.5/aria-text)
- [aria-toggle-field-name](https://dequeuniversity.com/rules/axe/4.5/aria-toggle-field-name)
- [aria-tooltip-name](https://dequeuniversity.com/rules/axe/4.5/aria-tooltip-name)
- [aria-treeitem-name](https://dequeuniversity.com/rules/axe/4.5/aria-treeitem-name)
- [aria-valid-attr-value](https://dequeuniversity.com/rules/axe/4.5/aria-valid-attr-value)
- [aria-valid-attr](https://dequeuniversity.com/rules/axe/4.5/aria-valid-attr)
- [autocomplete-valid](https://dequeuniversity.com/rules/axe/4.5/autocomplete-valid)
- [button-name](https://dequeuniversity.com/rules/axe/4.5/button-name)
- [definition-list](https://dequeuniversity.com/rules/axe/4.5/definition-list)
- [empty-heading](https://dequeuniversity.com/rules/axe/4.5/empty-heading)
- [frame-title](https://dequeuniversity.com/rules/axe/4.5/frame-title)
- [html-has-lang](https://dequeuniversity.com/rules/axe/4.5/html-has-lang)
- [html-lang-valid](https://dequeuniversity.com/rules/axe/4.5/html-lang-valid)
- [image-alt](https://dequeuniversity.com/rules/axe/4.5/image-alt)
- [input-button-name](https://dequeuniversity.com/rules/axe/4.5/input-button-name)
- [input-image-alt](https://dequeuniversity.com/rules/axe/4.5/input-image-alt)
- [label](https://dequeuniversity.com/rules/axe/4.5/label)
- [link-name](https://dequeuniversity.com/rules/axe/4.5/link-name)
- [list](https://dequeuniversity.com/rules/axe/4.5/list)
- [meta-refresh](https://dequeuniversity.com/rules/axe/4.5/meta-refresh)
- [meta-viewport](https://dequeuniversity.com/rules/axe/4.5/meta-viewport)
- [nested-interactive](https://dequeuniversity.com/rules/axe/4.5/nested-interactive)
- [object-alt](https://dequeuniversity.com/rules/axe/4.5/object-alt)
- [presentation-role-conflict](https://dequeuniversity.com/rules/axe/4.5/presentation-role-conflict)
- [role-img-alt](https://dequeuniversity.com/rules/axe/4.5/role-img-alt)
- [select-name](https://dequeuniversity.com/rules/axe/4.5/select-name)
- [svg-img-alt](https://dequeuniversity.com/rules/axe/4.5/svg-img-alt)
- [tabindex](https://dequeuniversity.com/rules/axe/4.5/tabindex)
- [valid-lang](https://dequeuniversity.com/rules/axe/4.5/valid-lang)

### Markdown(MD) Rules:

- [heading-order](https://dequeuniversity.com/rules/axe/4.5/heading-order)

### Global Components

The `global-components` setting in `axe-linter.yml` tells axe-linter how to map your own custom components or components from third party libraries to native HTML elements. This allows you to lint your components as though they were native HTML elements. For example, the following will treat all custom `DqButton` components as though they were native HTML `button` elements. This automatically maps every attribute on `DqButton` to `button`, thus requiring an accessible name for all `DqButton` components.

```yml
global-components:
  DqButton: button
```

Alternatively, for components that don't map all attributes to native HTML components, you can list the attributes required for accessibility conformance using the `attributes` property. You can list attributes the component supports, as well as rename attributes. There are two wildcard values - `aria-*` tells axe-linter that all attributes that start with `aria-` are mapped to the native HTML element as-is. The `<text>` value tells axe-linter that a property is used to set the content of the native HTML element.

```yml
global-components:
  DqButton:
    element:
      button
      # Ignore all attributes on <DqButton> except the following:
    attributes:
      - role # Map the role attribute from <DqButton /> to <button />
      - aria-* # Map all attributes starting with aria-
      - action: type # <DqButton action="submit" /> maps to <button type="submit" />
      - label: <text> #  <DqButton label="ABC" /> become <button>ABC</button>
```

Only attributes relevant for accessibility need to be in the `attributes` list. Element names are case sensitive. CamelCase as shown above as a common JSX example, but kebab-case which is used in Vue, Angular, and HTML custom elements can be used.

For full documentation on our custom component support, head to our [docs site](https://docs.deque.com/linter/1.0.0/en/linting-custom-components)

If you need a hand setting up your global-components configuration, [drop us a line](https://github.com/dequelabs/axe-core/issues) and we'll be happy to help.

## Support

- To report an issue or request a feature check out [our issue reporting page](https://github.com/dequelabs/axe-core/issues)
- To get in ontact with the axe-linter development team and other axe-linter users [join our accessibility slack channel](https://accessibility.deque.com/axe-community)

## Telemetry

Axe-linter gathers a minimal amount of telemetry in order to assist in monitoring the plugin's heartbeat. The collected data is limited to the date and time of scans, the axe-linter engine version, and identification of the data as being axe-linter related. We've also added telemetry to gather all error messages as needed to help provide a better end user experience.
