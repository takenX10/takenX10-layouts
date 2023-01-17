# Grammarly for VS Code

This extension brings [Grammarly](https://grammarly.com) to VS Code.

## Getting Started

You need to configure which files should be checked with Grammarly.

- Set `grammarly.files.include` or **Grammarly > Files > Include** to the allowed list of files.
- Run `grammarly.check` or **Grammarly: Check text** command

Default configuration:

```json
{
  "grammarly.files.include": ["**/README.md", "**/readme.md", "**/*.txt"]
}
```

You may use `grammarly.files.exclude` to ignore specific files.

## Grammarly account or premium

Run `grammarly.login` or **Grammarly: Login / Connect your account** command to connect your Grammarly account.
Run `grammarly.logout` or **Grammarly: Log out** to disconnect your account.

## Configuration

Configure dialect, document domain, and which check to include in settings.

![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/screenshot-config.png)

## Supported Languages

- plaintext
- markdown (work in progress) — [CommonMark](https://commonmark.org/)
- html (work in progress)

## Troubleshooting

The status of the Grammarly text-checking session is displayed on the status bar (bottom right). Clicking on the status bar icon would pause/resume text checking session.

![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/staturbar.png)

| Session           | Connecting                          | Checking                          | Done                               | Paused                          | Error                          |
| ----------------- | ----------------------------------- | --------------------------------- | ---------------------------------- | ------------------------------- | ------------------------------ |
| Anonymous         | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-connecting.png) | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-checking.png) | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-done.png)      | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-paused.png) | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-error.png) |
| Grammarly Account | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-connecting.png) | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-checking.png) | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-connected.png) | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-paused.png) | ![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/status-error.png) |

Check output panel for logs.

![](https://github.com/znck/grammarly/raw/HEAD/extension/assets/screenshot-output-panel.png)

Run `grammarly.restart` or **Grammarly: Restart language server** to restart the text checking service.

## How to get help

Have a question, or want to provide feedback? Use [repository discussions](https://github.com/znck/grammarly/discussions) to ask questions, share bugs or feedback, or chat with other users.

## Support

This extension is maintained by [Rahul Kadyan](https://github.com/znck). You can [💖 sponsor him](https://github.com/sponsors/znck) for the continued development of this extension.

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/znck/sponsors@main/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/znck/sponsors@main/sponsors.png'/>
  </a>
</p>

<br>
<br>
<br>
