import {GameInterface} from '@/domain/Game/GameInterface';
import {formatDate} from '@/util/Date';
import {Broker} from '@/domain/Broker/Broker';

export class DataTable {

  public static matchGames(term: string, game: GameInterface): boolean {
    const terms: string[] = term.split('|')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 1)
      .map((t: string) => t.toLowerCase());
    return terms.length > 0
      ? terms.reduce((matches: boolean, t: string) => matches || DataTable.matchSingleGame(t, game), false)
      : true;
  }

  public static defaultSortGames(a: GameInterface, b: GameInterface): number {
    if (a.status !== b.status) {              // sort by status first
      return a.statusIndex - b.statusIndex;
    } else if (a.createdAt !== b.createdAt) { // ... then by creation date
      return a.createdAt - b.createdAt;
    } else {
      return a.name.localeCompare(b.name);
    }
  }

  private static matchSingleGame(term: string, game: GameInterface): boolean {
    return game.name.toLowerCase().includes(term)
    || game.id.toLowerCase().includes(term)
    || game.brokers.reduce(
      (includes: boolean, b: Broker) => includes || b.name.toLowerCase().includes(term), false)
    || formatDate(game.createdAt).includes(term)
    || formatDate(game.end).includes(term);
  }

}
