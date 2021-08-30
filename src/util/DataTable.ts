import {Game} from '@/domain/Game/GameTypes';
import {BrokerSpec} from '@/domain/Broker/BrokerSpec';
import {formatDate} from '@/util/Date';

export class DataTable {

  public static matchGames(term: string, game: Game): boolean {
    const terms: string[] = term.split('|')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 1)
      .map((t: string) => t.toLowerCase());
    return terms.length > 0
      ? terms.reduce((matches: boolean, t: string) => matches || DataTable.matchSingleGame(t, game), false)
      : true;
  }

  private static matchSingleGame(term: string, game: Game): boolean {
    return game.name.toLowerCase().includes(term)
    || game.id.toLowerCase().includes(term)
    || game.brokers.reduce(
      (includes: boolean, b: BrokerSpec) => includes || b.name.toLowerCase().includes(term), false)
    || formatDate(game.createdAt).includes(term)
    || formatDate(game.end).includes(term);
  }

}
