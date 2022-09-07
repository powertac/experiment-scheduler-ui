import GameClient from '@/api/GameClient';
import GameRunClient from '@/api/GameRunClient';
import ApplicationClient from '@/api/ApplicationClient';
import BaselineClient from '@/api/BaselineClient';
import BrokerClient from '@/api/BrokerClient';
import TreatmentClient from '@/api/TreatmentClient';
import {orchestratorAuthClient} from '@/api/AuthClient';

export default {
  orchestrator: {
    auth: orchestratorAuthClient,
    application: new ApplicationClient(),
    games: new GameClient(),
    runs: new GameRunClient(),
    baselines: new BaselineClient(),
    treatments: new TreatmentClient(),
    brokers: new BrokerClient(),
  },
};
