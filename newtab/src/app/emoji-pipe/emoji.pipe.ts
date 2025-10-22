import { Pipe, type PipeTransform } from "@angular/core";
import { EmojiConvertor } from "emoji-js";

@Pipe({
  name: "emojiPipe",
  standalone: true,
})
export class EmojiPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return "";
    const emoji = new EmojiConvertor();
    emoji.replace_mode = "unified";
    emoji.allow_native = true;
    return emoji.replace_colons(value);
  }
}
