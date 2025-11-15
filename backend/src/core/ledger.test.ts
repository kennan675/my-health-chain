import { Ledger } from './ledger';

describe('Ledger', () => {
  it('creates blocks and verifies chain', async () => {
    const ledger = new Ledger();
    const hash1 = ledger.hashRecord({ a: 1 });
    const b1 = await ledger.addBlock('test.action', hash1, 'tester');
    const hash2 = ledger.hashRecord({ b: 2 });
    const b2 = await ledger.addBlock('test.action', hash2, 'tester');

    const chainOk = ledger.verifyChain();
    expect(chainOk).toBe(true);
    expect(b2.index).toBe(b1.index + 1);
  });
});
