import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { type AvailableJokeSources, jokes, type UselessFact } from "./jokes";
import { ConfigService } from "../../config/config.service";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-jokes",
  imports: [],
  templateUrl: "./jokes.component.html",
  styleUrl: "./jokes.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JokesComponent {
  joke = signal<string>("");

  private readonly configService = inject(ConfigService);
  private readonly httpService = inject(HttpClient);

  constructor() {
    effect(() => {
      void this.setJoke(this.configService.settings().activeJoke);
    });
  }

  /**
   * Sets a new random joke.
   */
  async setJoke(activeJoke?: AvailableJokeSources): Promise<void> {
    if (!activeJoke) activeJoke = this.configService.settings().activeJoke;

    switch (activeJoke) {
      case "dev-excuses":
        this.joke.set(this.getDevExcuses());
        break;
      case "useless-facts":
        this.joke.set(await this.getUselessFact());
        break;
    }
  }

  /**
   * Get a random developer excuse from the array of available ones.
   */
  getDevExcuses(): string {
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  /**
   * Retrieve a useless but funny fact and return it.
   * @returns A random useless fact
   */
  async getUselessFact(): Promise<string> {
    try {
      const url = "https://uselessfacts.jsph.pl/api/v2/facts/random";
      const fact: UselessFact = await firstValueFrom(
        this.httpService.get<UselessFact>(url),
      );
      return fact.text;
    } catch (err: any) {
      console.error(
        "Failed retrieving useless fact, proceeding to show excuse",
      );
      return this.getDevExcuses();
    }
  }
}
