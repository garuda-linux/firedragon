import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-title",
  imports: [],
  templateUrl: "./title.component.html",
  styleUrl: "./title.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  title = input<string>();
  subtitle = input<string>();
  subtitleHtml = input<string>();
}
