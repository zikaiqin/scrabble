import { Service } from 'typedi';
import { Player } from '@app/classes/player';
import { Reserve } from '@app/classes/reserve';

@Service()
export class ExchangeService {
    /**
     * @description Exchange letters in hand with letters from reserve
     */
    exchangeLetters(letters: string, player: Player, reserve: Reserve): void {
        letters.split('').forEach((oldLetter) => {
            player.remove(oldLetter);
            reserve.receiveOne(oldLetter);
            const newLetter = reserve.drawOne();
            if (newLetter !== undefined) {
                player.add(newLetter);
            }
        });
    }
}
