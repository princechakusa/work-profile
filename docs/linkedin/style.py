"""Turn **bold** and _italic_ in a LinkedIn caption into the Unicode letters creators use for styled posts.

    python docs/linkedin/style.py caption.md > caption.txt

LinkedIn has no formatting, so styled text is made of Mathematical Sans-Serif letters. Keep it to the hook
and a few key phrases: screen readers spell these letters out, and hashtags must stay plain to be searchable.
"""
import re
import sys


def _map(text: str, upper: int, lower: int, digit: int | None) -> str:
    out = []
    for ch in text:
        if "A" <= ch <= "Z":
            out.append(chr(upper + ord(ch) - ord("A")))
        elif "a" <= ch <= "z":
            out.append(chr(lower + ord(ch) - ord("a")))
        elif digit is not None and "0" <= ch <= "9":
            out.append(chr(digit + ord(ch) - ord("0")))
        else:
            out.append(ch)
    return "".join(out)


def bold(text: str) -> str:
    return _map(text, 0x1D5D4, 0x1D5EE, 0x1D7EC)  # sans-serif bold


def italic(text: str) -> str:
    return _map(text, 0x1D608, 0x1D622, None)  # sans-serif italic


def style(caption: str) -> str:
    caption = re.sub(r"\*\*(.+?)\*\*", lambda m: bold(m.group(1)), caption)
    return re.sub(r"(?<![\w#])_(.+?)_(?!\w)", lambda m: italic(m.group(1)), caption)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    print(style(open(sys.argv[1], encoding="utf-8").read()), end="")
