import { githubSchema, linkedInSchema} from './schema' /*, xSchema not included*/
import { TrueApi, testnet } from '@truenetworkio/sdk'
import { TrueConfig } from '@truenetworkio/sdk/dist/utils/cli-config'

// If you are not in a NodeJS environment, please comment the code following code:
import dotenv from 'dotenv'
dotenv.config()

export const getTrueNetworkInstance = async (): Promise<TrueApi> => {
  const trueApi = await TrueApi.create(config.account.secret)

  await trueApi.setIssuer(config.issuer.hash)

  return trueApi;
}

export const config: TrueConfig = {
  network: testnet,
  account: {
    address: 'hz28v33oiFSQiMHvbPiRBRvUmRhCKAtsk4RtaE5UiSv4Ucx',
    secret: process.env.TRUE_NETWORK_SECRET_KEY ?? ''
  },
  issuer: {
    name: 'CALIBRE',
    hash: '0x62c5e7ea8dff9a389b4c17589bf4ade1f69a2d2e706260f732ff2e78c9d89f96'
  },
  algorithm: {
    id: 138,
    path: 'acm',
    schemas: [githubSchema, linkedInSchema]/*, xSchema isnt included coz twitter scraping failed*/
  },
}
  