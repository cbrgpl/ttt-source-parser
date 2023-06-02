import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export interface ICliArgs {
  [key: string]: any;
}

interface IArgv extends ICliArgs {
  [x: string]: unknown;
  _: ( string | number )[];
  $0: string;
}

export const cli = new class Cli {
  private argv: IArgv

  constructor() {
    this.argv = yargs( hideBin( process.argv ) ).argv as IArgv
  }

  getCliArgs(): ICliArgs {
    this.fillArgvWithDefaultValues()
    return this.argv
  }

  private fillArgvWithDefaultValues() { null }
}
