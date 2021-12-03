import { fail } from "assert";
// import * as chai from "chai";
import { expect } from "chai";
// import * as chaiAsPromised from "chai-as-promised";
import { describe } from "mocha";
// import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DatabaseService } from "@app/services/database.service";
import { GameDifficulty, GameMode } from "@app/classes/game-info";
// import { DATABASE } from "@app/classes/config";

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    const fakeScorer1 = {name: 'FakePlayerButCooler', score: 100};
    const fakeScorer2 = {name: 'FakePlayer', score: 12};
    // const fakeDictionary = {name: 'fakeDict', description: 'a fake dictionary', words: ['why']};

    beforeEach(async () => {
        databaseService = new DatabaseService();

        mongoServer = await MongoMemoryServer.create();
    });

    afterEach(async () => {
        if (databaseService["client"]) {
          await databaseService["client"].close();
        }
    });

    it("should connect to the database when databaseConnect is called", async () => {
      // Reconnect to local server
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      expect(databaseService["client"]).to.not.be.undefined;
    });

    it("should not connect to the database when databaseConnect is called with wrong URL", async () => {
      try {
        await databaseService.databaseConnect("WRONG URL");
        fail();
      } catch {
        expect(databaseService["client"]).to.be.undefined;
      }
    });

    it("should return the right highscore list when calling getHighScores", async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.insertDefaultScores();
      let scoreLog2990 = await databaseService.getHighScores(GameMode.Classical);
      expect(scoreLog2990[0].name).to.equal('TheLegend27');
      expect(scoreLog2990[1].name).to.equal('Kevin Nguyen');
      expect(scoreLog2990[2].name).to.equal('105mm APFSDS rnd');
    });

    it("should insertDefaultScores in the database", async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.insertDefaultScores();
      let scoreClassic = await databaseService.getHighScores(GameMode.Classical);
      let scoreLog2990 = await databaseService.getHighScores(GameMode.Log2990);
      expect(scoreClassic.length).to.equal(5);
      expect(scoreLog2990.length).to.equal(5);
    });

    it("should updateHighScore when a higher score has been reached in Classical", async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.insertDefaultScores();
      await databaseService.updateHighScore(fakeScorer1, GameMode.Classical);
      let scoreClassic = await databaseService.getHighScores(GameMode.Classical);
      expect(scoreClassic[0].name).to.equal('FakePlayerButCooler');
      expect(scoreClassic[0].score).to.equal(100);
    });

    it("should not updateHighScore when a new score is lower or equal than all of the current highscores in Classical", async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.insertDefaultScores();
      await databaseService.updateHighScore(fakeScorer2, GameMode.Classical);
      let scoreClassic = await databaseService.getHighScores(GameMode.Classical);
      for (const it of scoreClassic) {
        expect(it.name).to.not.equal('FakePlayer');
      }
    });

    it("should updateHighScore when a higher score has been reached in Log2990", async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.insertDefaultScores();
      await databaseService.updateHighScore(fakeScorer1, GameMode.Log2990);
      let scoreLog2990 = await databaseService.getHighScores(GameMode.Log2990);
      expect(scoreLog2990[0].name).to.equal('FakePlayerButCooler');
      expect(scoreLog2990[0].score).to.equal(100);
    });

    it("should not updateHighScore when a new score is lower or equal than all of the current highscores in Log2990", async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.insertDefaultScores();
      await databaseService.updateHighScore(fakeScorer2, GameMode.Log2990);
      let scoreLog2990 = await databaseService.getHighScores(GameMode.Log2990);
      for (const it of scoreLog2990) {
        expect(it.name).to.not.equal('FakePlayer');
      }
    });

    it('should return a random bot of the right difficulty when calling getBots', async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      let bot = await databaseService.getBots(GameDifficulty.Hard);
      expect(bot).to.not.be.undefined;
    });
    
    it('should insert a bot when calling insertBot', async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.insertBot('Gridman', GameDifficulty.Hard);
      let bot = await databaseService.getBots(GameDifficulty.Hard);
      for (const it of bot) {
        if (it.name = 'Gridman') {
          expect(it.name).to.equal('Gridman');
        }
      }
    });

    it('should change the name of a bot identified with its id and difficulty', async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      let botList = await databaseService.getBots(GameDifficulty.Hard);
      setTimeout( () => {
        let bot = botList[0];
        databaseService.editBot(bot._id as string, 'Gridman', GameDifficulty.Hard);
      }, 5000);
      botList = await databaseService.getBots(GameDifficulty.Hard);
      for (const it of botList) {
        if (it.name = 'Gridman') {
          expect(it.name).to.equal('Gridman');
        }
      }
    });

    it('should return the number of bots of the same name in each difficulty', async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.insertBot('Gridman', GameDifficulty.Hard);
      await databaseService.insertBot('Gridman', GameDifficulty.Hard);
      await databaseService.insertBot('Gridman', GameDifficulty.Hard);
      await databaseService.insertBot('Gridman', GameDifficulty.Easy);
      await databaseService.insertBot('Gridman', GameDifficulty.Easy);
      await databaseService.insertBot('Gridman', GameDifficulty.Easy);
      let bots = await databaseService.countBots('Gridman');
      expect(bots).to.deep.equals([ 3, 3 ]);
    });

    /*it('should return the dictionary with the right id with getDictionary', async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.insertDictionary(fakeDictionary.name, fakeDictionary.description, fakeDictionary.words);
      let dict = await databaseService.getDictionaryDescriptions();
    it('should reset the database', async () => {
      const mongoUri = await mongoServer.getUri();
      await databaseService.databaseConnect(mongoUri);
      await databaseService.resetDB();
    });*/
})