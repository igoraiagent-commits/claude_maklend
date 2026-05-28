import { nanoid } from "nanoid"

function transliterate(str: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "h", д: "d", е: "e", є: "ye",
    ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k",
    л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s",
    т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh",
    щ: "shch", ь: "", ю: "yu", я: "ya",
  }
  return str
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
}

export function generateSlug(title: string): string {
  const base = transliterate(title)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
  return `${base}-${nanoid(6)}`
}
